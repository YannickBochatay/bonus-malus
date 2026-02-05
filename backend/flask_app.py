from flask import Flask, request, jsonify
from db import query_db, close_db

app = Flask(__name__)

app.teardown_appcontext(close_db)

@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

def check_user(fct):
  def wrapper(user):
    check_user = query_db("select nom from joueurs where nom=?", [user])
    
    if not check_user:
      return send_error("joueur inconnu", 404)
    
    return fct()
  
  return wrapper

def send_error(msg, code = 400):
  return jsonify({ "details" : msg}), code

def error_handler(fct):
  def wrapper(*args, **kwargs):
    try:
      return fct(*args, **kwargs)
    except BaseException:
      return send_error("Requête incorrecte")
  
  return wrapper


@app.route("/")
def joueurs(): 
  bonus = query_db("select joueurs.nom as joueur, sum(valeur) as score "\
                   "from joueurs left join actions on joueurs.nom=actions.joueur "\
                   "where valeur > 0 "\
                   "group by joueurs.nom")
  
  malus = query_db("select joueurs.nom as joueur, sum(valeur) as score "\
                   "from joueurs left join actions on joueurs.nom=actions.joueur "\
                   "where valeur < 0 "\
                  "group by joueurs.nom")

  depenses = query_db("select joueurs.nom as joueur, ifnull(cast(floor(sum(cout)*10) as int),0) as total "\
                    "from joueurs left join depenses on joueurs.nom=depenses.joueur "\
                    "group by joueurs.nom")

  res = []

  for index, bonus in enumerate(bonus):
    res.append({
      "joueur" : bonus["joueur"],
      "bonus" : bonus["score"],
      "malus" : malus[index]["score"],
      "depenses" : depenses[index]["total"]
    })

  return jsonify(res)

@app.route("/bareme", methods=['GET'])
def affiche_bareme():
  actions = query_db("select * from bareme order by action, valeur")
  return jsonify(actions)

@error_handler
@app.route("/bareme", methods=['POST'])
def nouvelle_action_bareme():
  action = request.form["action"]
  valeur = request.form["valeur"]
  query_db("insert into bareme (action ,valeur) values (?, ?)", [action, valeur])
  return jsonify({
    "details" : "La nouvelle action a bien été ajoutée au barème",
    "action" : action,
    "valeur" : valeur
  })

@error_handler
@app.route("/bareme/<id>", methods=['PUT'])
def maj_action_bareme(id):
  action = request.form["action"]
  valeur = request.form["valeur"]
  query_db("update bareme set action=?, valeur=? where id=?", [action, valeur, id])
  return jsonify({
    "details" : "L'action a bien été modifiée",
    "action" : action,
    "valeur" : valeur
  })

@error_handler
@app.route("/bareme/<id>", methods=['DELETE'])
def supprime_action_bareme(id):
  try:
    query_db("delete from bareme where id=?",[id])
  except BaseException:
    return send_error("Cette action a déjà été réalisée, vous ne pouvez pas la supprimer.")
  
  return jsonify({ "details" : "L'action a bien été supprimée" })

@check_user
@app.route("/<user>")
def resume_joueur(user): 
  bonus = query_db("select sum(valeur) as score "\
                   "from joueurs left join actions on joueurs.nom=actions.joueur "\
                   "where valeur > 0 and joueurs.nom = ?", [user])
  
  malus = query_db("select sum(valeur) as score "\
                   "from joueurs left join actions on joueurs.nom=actions.joueur "\
                   "where valeur < 0 and joueurs.nom = ?", [user])

  depenses = query_db("select ifnull(cast(floor(sum(cout)*10) as int),0) as total "\
                    "from joueurs left join depenses on joueurs.nom=depenses.joueur "\
                    "where joueurs.nom = ?", [user])

  return jsonify({
    "bonus" : bonus[0]["score"],
    "malus" : malus[0]["score"],
    "depenses" : depenses[0]["total"]
  })

@check_user
@app.route("/<user>/actions", methods=["GET"])
def actions_joueur(user):

  actions = query_db("select actions.id, bareme.action, date, actions.valeur "\
    "from actions, bareme where bareme.id = actions.action and joueur=? order by date desc",
    [user]
  )

  return jsonify(actions)

@check_user
@app.route("/<user>/depenses", methods=["GET"])
def depenses_joueur(user):
  depenses = query_db("select * from depenses where joueur=? order by date desc", [user])

  return jsonify(depenses)

@check_user
@error_handler
@app.route("/<user>/actions", methods=['POST'])
def ajout_action(user):
  id_action = int(request.form["action"])

  res = query_db("select * from bareme where id=?", [id_action])

  if res:
    valeur = res[0]["valeur"]
    query_db("insert into actions (action, joueur, valeur) values (?, ?, ?)", [id_action, user, valeur])

    return jsonify({
      "details" : f"L'action a bien été ajoutée à {user}",
      "id" : id_action,
      "user" : user,
      "valeur" : valeur
    })
  else:
    return send_error(f"{id_action} : action inconnue", 404)

@check_user
@error_handler
@app.route("/<user>/depenses", methods=['POST'])
def ajout_depense(user):
  if "cost" not in request.form or 'descript' not in request.form:
    return send_error("les champs cost et/ou descript sont manquants", 400)

  cost = float(request.form["cost"])
  descript = request.form['descript']
  query_db("insert into depenses (cout, joueur, descript) values(?, ?, ?)",[cost, user, descript])
  return jsonify({
    "details" : f"La dépense a bien été ajoutée à {user}",
    "cost" : cost,
    "user" : user,
    "descript" : descript
  })

@error_handler
@app.route("/<user>/actions/<id>", methods=['DELETE'])
def supprime_action(user, id):
  query_db("delete from actions where id=?",[id])
  return jsonify({ "details" : "L'action a bien été supprimée" })

@error_handler
@app.route("/<user>/depenses/<id>", methods=['DELETE'])
def supprime_depense(user, id):
  query_db("delete from depenses where id=?",[id])
  return jsonify({ "details" : "La dépense a bien été supprimée"})


@app.errorhandler(404)
def resource_not_found(e):
  return send_error("L'url demandée n'existe pas", 404)


if __name__ == '__main__':
  app.run(debug=True)

from flask import Flask, send_from_directory, request, jsonify
from db import query_db, close_db

app = Flask(__name__)

app.teardown_appcontext(close_db)

def json_cors(data):
  response = jsonify(data)
  response.headers.add("Access-Control-Allow-Origin", "*")
  return response

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

  return json_cors(res)

@app.route("/<user>/summary")
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

  return json_cors({
    "bonus" : bonus[0]["score"],
    "malus" : malus[0]["score"],
    "depenses" : depenses[0]["total"]
  })

@app.route("/<user>")
def details_joueur(user):
  check_user = query_db("select nom from joueurs where nom=?", [user])
  
  if not check_user:
    return json_cors({ "details" : "joueur inconnu"}), 404
  
  actions = query_db("select actions.id, bareme.action, date, actions.valeur "\
    "from actions, bareme where bareme.id = actions.action and joueur=? order by date desc",
    [user]
  )

  depenses = query_db("select * from depenses where joueur=? order by date desc", [user])

  return json_cors({
    "actions" : actions,
    "depenses" : depenses
  })

@app.route("/bareme", methods=['GET'])
def affiche_bareme():
  actions = query_db("select * from bareme order by action, valeur")
  return json_cors(actions)

@app.route("/bareme", methods=['POST'])
def nouvelle_action_bareme():
  action = request.form["action"]
  valeur = request.form["valeur"]
  query_db("insert into bareme (action ,valeur) values (?, ?)", [action, valeur])
  return json_cors({
    "action" : action,
    "valeur" : valeur
  })

@app.route("/bareme/<id>", methods=['PUT'])
def maj_action_bareme(id):
  action = request.form["action"]
  valeur = request.form["valeur"]
  query_db("update bareme set action=?, valeur=? where id=?", [action, valeur, id])
  return json_cors({
    "action" : action,
    "valeur" : valeur
  })

@app.route("/bareme/<id>", methods=['DELETE'])
def supprime_action_bareme(id):
  try:
    query_db("delete from bareme where id=?",[id])
  except BaseException:
    return json_cors({ "details" : "Cette action a déjà été réalisée, vous ne pouvez pas la supprimer." }), 500
  
  return json_cors({ "details" : f"action {id} deleted"})


@app.route("/bonus", methods=["GET"])
def recup_bonus():
  bonus_actions = query_db("select * from bareme where valeur > 0 order by action")
  return json_cors(bonus_actions)

@app.route("/malus", methods=["GET"])
def recup_malus():
  malus_actions = query_db("select * from bareme where valeur < 0 order by action")
  return json_cors(malus_actions)

'''


@app.route("/<user>/actions/add", methods=['POST'])
def ajout_action(user):
  id_action = int(request.form["action"])

  res = query_db("select * from bareme where id=?", [id_action])

  if res:
    valeur = res[0]["valeur"]
    query_db("insert into actions (action, joueur, valeur) values (?, ?, ?)", [id_action, user, valeur])
    return redirect("/")
  else:
    return render_template("erreur.html")

@app.route("/<user>/actions/delete/<id>", methods=['POST'])
def supprime_action(user, id):
  query_db("delete from actions where id=?",[id])
  return redirect("/" + user)

@app.route("/<user>/depenses/delete/<id>", methods=['POST'])
def supprime_depense(user, id):
  query_db("delete from depenses where id=?",[id])
  return redirect("/" + user + "#depenses")

@app.route("/<user>/depenses/add", methods=['POST'])
def ajout_depense(user):
  cost = float(request.form["cost"])
  descript = request.form['descript']
  query_db("insert into depenses (cout, joueur, descript) values(?, ?, ?)",[cost, user, descript])
  return redirect("/" + user + "#depenses")


'''

if __name__ == '__main__':
  app.run(debug=True)

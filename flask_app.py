from flask import Flask, render_template, request, redirect, url_for
from db import query_db, close_db

app = Flask(__name__)

app.teardown_appcontext(close_db)

@app.route("/")
def accueil():
  
  totaux = query_db("select joueurs.nom as joueur, sum(valeur) as score "\
                    "from joueurs left join actions on joueurs.nom=actions.joueur "\
                    "group by joueurs.nom")
  
  bonus = query_db("select joueurs.nom as joueur, sum(valeur) as score "\
                   "from joueurs left join actions on joueurs.nom=actions.joueur "\
                   "where valeur >= 0 "\
                   "group by joueurs.nom")
  
  malus = query_db("select joueurs.nom as joueur, sum(valeur) as score "\
                   "from joueurs left join actions on joueurs.nom=actions.joueur "\
                   "where valeur <= 0 "\
                  "group by joueurs.nom")
  
  bonus_actions = query_db("select * from barème where valeur > 0")
  malus_actions = query_db("select * from barème where valeur < 0")
    
  return render_template("accueil.html",
    totaux=totaux, bonus=bonus, malus=malus, bonus_actions=bonus_actions, malus_actions=malus_actions
  )

@app.route("/validate", methods=['POST'])
def ajout_action():
  id_action = int(request.form["action"])
  joueur = request.form["joueur"]

  res = query_db("select * from barème where id=?", [id_action])

  if res:
    valeur = res[0]["valeur"]
    query_db("insert into actions (action, joueur, valeur) values (?, ?, ?)", [id_action, joueur, valeur])
    return redirect("/")
  else:
    return render_template("erreur.html")
  
@app.route("/<user>")
def affiche_user(user):
  check_user = query_db("select nom from joueurs where nom=?", [user])
  
  if not check_user:
    return render_template("erreur.html")
  
  data = query_db("select actions.id, barème.action, date, actions.valeur "\
    "from actions, barème where barème.id = actions.action and joueur=? order by date desc",
    [user]
  )

  return render_template("user.html", data=data, user=user)

@app.route("/<user>/delete/<id>", methods=['POST'])
def supprime_action(user, id):
  query_db("delete from actions where id=?",[id])
  return redirect("/" + user)

@app.route("/bareme")
def affiche_bareme():
  actions = query_db("select * from barème")
  return render_template("bareme.html", actions=actions)

@app.route("/bareme/new", methods=['POST'])
def nouvelle_action_bareme():
  action = request.form["action"]
  valeur = request.form["valeur"]
  query_db("insert into barème (action ,valeur) values (?, ?)", [action, valeur])
  return redirect(url_for("affiche_bareme", _anchor="form_new"))

@app.route("/bareme/update/<id>", methods=['POST'])
def maj_action_bareme(id):
  action = request.form["action"]
  valeur = request.form["valeur"]
  query_db("update barème set action=?, valeur=? where id=?", [action, valeur, id])
  return redirect(url_for("affiche_bareme"))

@app.route("/bareme/delete/<id>", methods=['POST'])
def supprime_action_bareme(id):
  try:
    query_db("delete from barème where id=?",[id])
  except BaseException:
    return render_template("erreur.html", msg="Cette action a déjà été réalisée, vous ne pouvez pas la supprimer.")
  
  return redirect(url_for("affiche_bareme"))

if __name__ == '__main__':
  app.run(debug=True)

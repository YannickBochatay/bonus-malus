ALTER TABLE actions RENAME TO actions_old;

CREATE TABLE "actions" (
  "id" INTEGER NOT NULL UNIQUE,
  "action" INTEGER,
  "date" DATETIME DEFAULT (datetime('now','localtime')) ,
  "joueur" TEXT NOT NULL,
  "valeur" INTEGER NOT NULL,
  PRIMARY KEY("id"),
  FOREIGN KEY ("action") REFERENCES "bareme"("id")
  ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY ("joueur") REFERENCES "joueurs"("nom")
  ON UPDATE CASCADE ON DELETE NO ACTION
);

INSERT INTO actions (id, action, date, joueur, valeur)
SELECT id, action, date, joueur, valeur
FROM actions_old;

DROP TABLE actions_old;
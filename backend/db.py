# https://flask.palletsprojects.com/en/stable/patterns/sqlite3/
import sqlite3
from flask import g
import os

current_dir = os.path.dirname(os.path.realpath(__file__))

DATABASE = current_dir + '/db.sqlite'

def make_dicts(cursor, row):
  return dict((cursor.description[idx][0], value)
    for idx, value in enumerate(row))

def get_db():
  db = getattr(g, '_database', None)
  if db is None:
    db = g._database = sqlite3.connect(DATABASE, autocommit=True)
    db.row_factory = make_dicts
    db.execute('PRAGMA foreign_keys = ON')
  return db

def close_db(e=None):
  db = getattr(g, '_database', None)
  if db is not None:
    db.close()

def query_db(query, args=()):
  db = get_db()
  cur = db.execute(query, args)
  result = cur.fetchall()
  cur.close()
  return result

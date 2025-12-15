from server import db
from argon2 import PasswordHasher

ph = PasswordHasher()

def basic_auth(username,password):
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)
    sql_query = f"""
    SELECT
      id,
      password
    FROM
      users
    WHERE username = '{username}';
    """
    cursor.execute(sql_query)
    data = cursor.fetchone()
    db_hash = data['password']
    db_id = data['id'] 
    ph.verify(db_hash,password)
    return({
      "sub" : {
       "username" : username,
       "id" : db_id 
      }
    })
  except:
    return None
  finally:
    if connection:
      connection.close()

def admin_auth(username,password):
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)
    sql_query = f"""
    SELECT 
      password
    FROM
      users
    WHERE username = '{username}' AND is_admin = 1;
    """
    cursor.execute(sql_query)
    db_hash = cursor.fetchone()['password']
    ph.verify(db_hash,password)
    return({"sub" : username})
  except:
    return None
  finally:
    if connection:
      connection.close()

def create_hash(password):
  return ph.hash(password)
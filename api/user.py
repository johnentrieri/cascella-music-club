from server import db
from .security import create_hash
import random,string

def login(user):
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)

    # Get User
    user_id = user['id']
    sql_query = f"""
      SELECT
        id,
        join_date,
        is_admin,
        username
      FROM 
        users
      WHERE
        id = {user_id};
    """
    cursor.execute(sql_query)
    data = cursor.fetchone()
    if data == None:
      return "User Not Found", 400
    return data, 200
  except Exception as e:
    print(f"Error: {e}")
    return "Database Error", 500
  finally:
    if connection:
      connection.close()
def addUser(body):
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)

    # Confirm User Key Exists
    userkey = body['userkey']
    sql_query = f"""
      SELECT
        id
      FROM
        userkeys
      WHERE
        userkey = '{userkey}' AND is_claimed = 0;
    """
    cursor.execute(sql_query)
    userkeyId = cursor.fetchone()
    if userkeyId == None:
      return "User Key Not Found", 400

    # Add New User
    username = body['username']
    email = body['email']
    password = create_hash(body['password'])
    sql_query = f"""
      INSERT INTO users (
        username,
        email,
        password
      ) VALUES (
        '{username}',
        '{email}',
        '{password}'
      )
    """
    cursor.execute(sql_query)
    response = cursor.rowcount
    if response < 1:
      return "Database Error", 500
    
    # Get Last Inserted ID
    sql_query = f"""
      SELECT LAST_INSERT_ID();
    """
    cursor.execute(sql_query)
    last_insert_id = cursor.fetchone()['LAST_INSERT_ID()']

    # Claim User Key
    sql_query = f"""
      UPDATE
        userkeys
      SET
        is_claimed = 1,
        claimed_by = {last_insert_id}
      WHERE
        userkey = '{userkey}';
    """
    cursor.execute(sql_query)
    response = cursor.rowcount
    if response < 1:
      return "Database Error", 500

    connection.commit()
    return "Success", 200    
  except Exception as e:
    print(f"Error: {e}")
    if connection:
      connection.rollback()
    return "Database Error", 500
  finally:
    if connection:
      connection.close()

def getUsers():
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)
    sql_query = f"""
      SELECT
        id,
        username
      FROM 
        users;
    """
    cursor.execute(sql_query)
    data = cursor.fetchall()
    return data, 200
  except Exception as e:
    print(f"Error: {e}")
    return "Database Error", 500
  finally:
    if connection:
      connection.close()

# TODO
def updateUser():
  print("User Updated")

# TODO
def deleteUser():
  print("User Deleted")

def addUserKey():
  # Generate Random User Key
  random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=16))

  # Insert into Database
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)
    sql_query = f"""
      INSERT INTO userkeys (
        userkey
      ) VALUES (
        '{random_string}'
      )
    """
    cursor.execute(sql_query)
    response = cursor.rowcount
    if response < 1:
      return "Database Error", 500
    connection.commit()
    return "Success", 200
  except Exception as e:
    print(f"Error: {e}")
    if connection:
      connection.rollback()
    return "Database Error", 500
  finally:
    if connection:
      connection.close()

def getUserKeys():
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)
    sql_query = f"""
      SELECT
        uk.id,
        uk.userkey,
        uk.is_claimed,
        u.username as claimed_by,
        uk.created_on        
      FROM 
        userkeys as uk
      LEFT JOIN
        users as u ON u.id = uk.claimed_by
    """
    cursor.execute(sql_query)
    data = cursor.fetchall()
    return data, 200
  except Exception as e:
    print(f"Error: {e}")
    return "Database Error", 500
  finally:
    if connection:
      connection.close()
import mariadb
import os
import sys

from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()  

# Configure connection pool parameters
try:
  connection_pool = mariadb.ConnectionPool(
      pool_name="cmc_connection_pool",
      pool_size=5,  # Configurable size (max 64)
      host=os.getenv("DB_HOST"),
      port=int(os.getenv("DB_PORT")),
      user=os.getenv("DB_USER"),
      password=os.getenv("DB_PASSWORD"),
      database=os.getenv("DB_DBNAME"),
      pool_reset_connection=True # Resets connection state before returning to pool
  )
except mariadb.Error as e:
  print(f"Error creating connection pool: {e}")
  sys.exit(1)

def init():
  create_user_table()
  create_userkey_table()
  create_discussion_table()
  create_artist_table()
  create_song_table()
  create_comment_table()
  create_rating_table()

def create_user_table():
  try:
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    sql_query = f"""
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      join_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      is_admin TINYINT(1) NOT NULL DEFAULT 0
    )
    """
    cursor.execute(sql_query)
  except Exception as e:
    print(f"Error: {e}")
  finally:
    if connection:
      connection.close()

def create_userkey_table():
  try:
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    sql_query = f"""
    CREATE TABLE IF NOT EXISTS userkeys (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userkey VARCHAR(255) UNIQUE NOT NULL,
      created_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      is_claimed TINYINT(1) NOT NULL DEFAULT 0,
      claimed_by INT,
      FOREIGN KEY (claimed_by) REFERENCES users(id)
    )
    """
    cursor.execute(sql_query)
  except Exception as e:
    print(f"Error: {e}")
  finally:
    if connection:
      connection.close()

def create_discussion_table():
  try:
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    sql_query = f"""
    CREATE TABLE IF NOT EXISTS discussions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      created_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      curator INT,
      FOREIGN KEY (curator) REFERENCES users(id)
    )
    """
    cursor.execute(sql_query)
  except Exception as e:
    print(f"Error: {e}")
  finally:
    if connection:
      connection.close()

def create_artist_table():
  try:
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    sql_query = f"""
    CREATE TABLE IF NOT EXISTS artists (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      genre VARCHAR(255),
      created_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      img_url VARCHAR(255),
      discussion INT,
      FOREIGN KEY (discussion) REFERENCES discussions(id)
    )
    """
    cursor.execute(sql_query)
  except Exception as e:
    print(f"Error: {e}")
  finally:
    if connection:
      connection.close()

def create_song_table():
  try:
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    sql_query = f"""
    CREATE TABLE IF NOT EXISTS songs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      album VARCHAR(255),
      created_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      artist INT,
      discussion INT,
      FOREIGN KEY (artist) REFERENCES artists(id),
      FOREIGN KEY (discussion) REFERENCES discussions(id)
    )
    """
    cursor.execute(sql_query)
  except Exception as e:
    print(f"Error: {e}")
  finally:
    if connection:
      connection.close()

def create_comment_table():
  try:
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    sql_query = f"""
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      comment VARCHAR(255) NOT NULL,
      created_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      author INT,
      discussion INT,
      song INT,
      FOREIGN KEY (author) REFERENCES users(id),
      FOREIGN KEY (discussion) REFERENCES discussions(id),
      FOREIGN KEY (song) REFERENCES songs(id)
    )
    """
    cursor.execute(sql_query)
  except Exception as e:
    print(f"Error: {e}")
  finally:
    if connection:
      connection.close()

def create_rating_table():
  try:
    connection = connection_pool.get_connection()
    cursor = connection.cursor()
    sql_query = f"""
    CREATE TABLE IF NOT EXISTS ratings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      rating INT NOT NULL,
      created_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      author INT,
      discussion INT,
      song INT,
      FOREIGN KEY (author) REFERENCES users(id),
      FOREIGN KEY (discussion) REFERENCES discussions(id),
      FOREIGN KEY (song) REFERENCES songs(id)
    )
    """
    cursor.execute(sql_query)
  except Exception as e:
    print(f"Error: {e}")
  finally:
    if connection:
      connection.close()


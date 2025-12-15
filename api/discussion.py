from server import db

def addDiscussion(body):
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)

    # Get User ID from Username
    curator_username = body['curator']
    sql_query = f"""
      SELECT
        id
      FROM
        users
      WHERE
        username = '{curator_username}';
    """
    cursor.execute(sql_query)
    curator_id = cursor.fetchone()['id']
    if curator_id == None:
      return "Curator Not Found", 400
    
    # Create Discussion
    start_date = body['start_date']
    end_date = body['end_date']
    sql_query = f"""
      INSERT INTO discussions (
        start_date,
        end_date,
        curator
      ) VALUES (
        '{start_date}',
        '{end_date}',
        {curator_id}
      );
    """
    cursor.execute(sql_query)
    response = cursor.rowcount
    if response < 1:
      return "Database Error", 500
    
    # Get Last Inserted ID (Discussion)
    sql_query = f"""
      SELECT LAST_INSERT_ID();
    """
    cursor.execute(sql_query)
    discussion_id = cursor.fetchone()['LAST_INSERT_ID()']

    # Add Artist Entry
    artist_data = body['artist']
    artist_name = artist_data['name']
    artist_genre = artist_data['genre']
    artist_img = artist_data['img_url']
    sql_query = f"""
      INSERT INTO artists (
        name,
        genre,
        img_url,
        discussion
      ) VALUES (
        '{artist_name}',
        '{artist_genre}',
        '{artist_img}',
        {discussion_id}
      );
    """
    cursor.execute(sql_query)
    response = cursor.rowcount
    if response < 1:
      return "Database Error", 500
    
    # Get Last Inserted ID (Artist)
    sql_query = f"""
      SELECT LAST_INSERT_ID();
    """
    cursor.execute(sql_query)
    artist_id = cursor.fetchone()['LAST_INSERT_ID()']
  
    # Add Song Entries
    song_list = body['songs']
    for song in song_list:
      song_name = song['name']
      song_album = song['album']
      sql_query = f"""
        INSERT INTO songs (
          name,
          album,
          artist,
          discussion
        ) VALUES (
          '{song_name}',
          '{song_album}',
          {artist_id},
          {discussion_id}
        );
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

def getDiscussions():
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)
    sql_query = f"""
      SELECT
        d.id,
        d.start_date,
        d.end_date,
        u.username as curator,
        a.name as artist
      FROM 
        discussions as d
      JOIN
        users as u ON u.id = d.curator
      JOIN
        artists as a ON a.discussion = d.id
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

def getDiscussionById(discussionId):
  try:
    discussion_id = discussionId
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)

    # Get Base Discussion
    sql_query = f"""
      SELECT
        d.id,
        d.created_on,
        d.start_date,
        d.end_date,
        u.username as curator
      FROM 
        discussions as d
      JOIN
        users as u ON u.id = d.curator
      WHERE
        d.id = {discussion_id}
    """
    cursor.execute(sql_query)
    discussion_data = cursor.fetchone()
    if discussion_data == None:
      return "Discussion Not Found", 400    

    # Get Artist Data
    sql_query = f"""
      SELECT
        id,
        created_on,
        discussion as discussion_id,
        name,
        genre,
        img_url
      FROM 
        artists
      WHERE
        discussion = {discussion_id}
    """
    cursor.execute(sql_query)
    artist_data = cursor.fetchone()
    if artist_data == None:
      return "Artist Not Found", 400
    discussion_data['artist'] = artist_data
    discussion_data['artist']['comments'] = []
    discussion_data['artist']['ratings'] = []

    # Get Song Data
    sql_query = f"""
      SELECT
        id,
        created_on,
        discussion as discussion_id,
        artist as artist_id,
        name,
        album
      FROM 
        songs
      WHERE
        discussion = {discussion_id}
    """
    cursor.execute(sql_query)
    song_data = cursor.fetchall()
    if song_data == None:
      return "No Songs Found", 400
    for song in song_data:
      song['comments'] = []
      song['ratings'] = []
    discussion_data['songs'] = song_data

    # Get Comments
    sql_query = f"""
      SELECT
        c.id,
        c.created_on,
        c.discussion as discussion_id,
        c.song as song_id,
        u.username as author,
        c.comment
      FROM 
        comments as c
      JOIN
        users as u ON u.id = c.author
      WHERE
        discussion = {discussion_id}
    """
    cursor.execute(sql_query)
    comment_data = cursor.fetchall()
    
    # TODO - Sort Comments by Datetime

    # Add Artist Comments
    for comment in comment_data:
      if comment['song_id'] == None:
        discussion_data['artist']['comments'].append(comment)
    
    # Add Song Comments
    for song in discussion_data['songs']:
      for comment in comment_data:
        if comment['song_id'] == song['id']:
          song['comments'].append(comment)
    
    # Get Ratings
    sql_query = f"""
      SELECT
        r.id,
        r.created_on,
        r.discussion as discussion_id,
        r.song as song_id,
        u.username as author,
        r.rating
      FROM 
        ratings as r
      JOIN
        users as u ON u.id = r.author
      WHERE
        discussion = {discussion_id}
    """
    cursor.execute(sql_query)
    rating_data = cursor.fetchall()
    
    # TODO - Sort Ratings by Datetime?

    # Add Artist Ratings
    for rating in rating_data:
      if rating['song_id'] == None:
        discussion_data['artist']['ratings'].append(rating)
    
    # Add Song Ratings
    for song in discussion_data['songs']:
      for rating in rating_data:
        if rating['song_id'] == song['id']:
          song['ratings'].append(rating)

    return discussion_data, 200
  except Exception as e:
    print(f"Error: {e}")
    return "Database Error", 500
  finally:
    if connection:
      connection.close()

def addArtistComment(user,discussionId,body):
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)

    # Add Comment
    comment = body['comment']
    author_id = user['id']
    discussion_id = discussionId
    sql_query = f"""
      INSERT INTO comments (
        comment,
        author,
        discussion
      ) VALUES (
        '{comment}',
        {author_id},
        {discussion_id}
      );
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

def addSongComment(user,discussionId,songId,body):
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)

    # Add Comment
    comment = body['comment']
    author_id = user['id']
    song_id = songId
    discussion_id = discussionId
    sql_query = f"""
      INSERT INTO comments (
        comment,
        author,
        discussion,
        song
      ) VALUES (
        '{comment}',
        {author_id},
        {discussion_id},
        {song_id}
      );
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

def addArtistRating(user,discussionId,body):
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)

    # Check for Duplicates
    author_id = user['id']
    discussion_id = discussionId
    sql_query = f"""
      SELECT
        id
      FROM
        ratings
      WHERE
        author = {author_id}
      AND
        discussion = {discussion_id}
      AND
        song IS NULL;
    """
    cursor.execute(sql_query)
    data = cursor.fetchall()
    if len(data) > 0:
      return "User Rating Exists", 400

    # Add Rating
    rating = body['rating']
    sql_query = f"""
      INSERT INTO ratings (
        rating,
        author,
        discussion
      ) VALUES (
        {rating},
        {author_id},
        {discussion_id}
      );
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

def addSongRating(user,discussionId,songId,body):
  try:
    connection = db.connection_pool.get_connection()
    cursor = connection.cursor(dictionary=True)

    # Check for Duplicates
    author_id = user['id']
    song_id = songId
    discussion_id = discussionId
    sql_query = f"""
      SELECT
        id
      FROM
        ratings
      WHERE
        author = {author_id}
      AND
        discussion = {discussion_id}
      AND
        song = {song_id};
    """
    cursor.execute(sql_query)
    data = cursor.fetchall()
    if len(data) > 0:
      return "User Rating Exists", 400

    # Add Rating
    rating = body['rating']
    sql_query = f"""
      INSERT INTO ratings (
        rating,
        author,
        discussion,
        song
      ) VALUES (
        {rating},
        {author_id},
        {discussion_id},
        {song_id}
      );
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
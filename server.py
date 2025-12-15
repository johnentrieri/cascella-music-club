from connexion import AsyncApp
import db

# Connexion App Creation
app = AsyncApp(__name__)
app.add_api("cmc-api.yaml")

if __name__ == '__main__':
  db.init()
  app.run("server:app", port=4000)
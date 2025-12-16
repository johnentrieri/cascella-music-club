from connexion import AsyncApp
from connexion.middleware import MiddlewarePosition
from starlette.middleware.cors import CORSMiddleware
import db

# Connexion App Creation
app = AsyncApp(__name__)

# CORS Settings
app.add_middleware(
    CORSMiddleware,
    position=MiddlewarePosition.BEFORE_EXCEPTION,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_api("cmc-api.yaml")

if __name__ == '__main__':
  db.init()
  app.run("server:app", port=4000, host='0.0.0.0')
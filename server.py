from connexion import AsyncApp
from connexion.middleware import MiddlewarePosition
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import db

# MiddleWare for removing ETags
class NoETagMiddleware(BaseHTTPMiddleware):
  async def dispatch(self, request, call_next):
    response = await call_next(request)
    response.headers.pop("etag", None)
    return response
  
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

# Add ETag Strip Middleware
app.add_middleware(NoETagMiddleware)

# Link to OpenAPI Spec
app.add_api("cmc-api.yaml")

# Run App
if __name__ == '__main__':
  db.init()
  app.run("server:app", port=4000, host='0.0.0.0')
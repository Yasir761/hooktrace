from authlib.integrations.starlette_client import OAuth
from fastapi import Request
from fastapi.responses import RedirectResponse
import os

oauth = OAuth()

oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

oauth.register(
    name="github",
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url="https://github.com/login/oauth/access_token",
    authorize_url="https://github.com/login/oauth/authorize",
    api_base_url="https://api.github.com/",
    client_kwargs={"scope": "user:email"},
)

@router.get("/login/{provider}")
async def oauth_login(request: Request, provider: str):
    redirect_uri = request.url_for("oauth_callback", provider=provider)
    return await oauth.create_client(provider).authorize_redirect(request, redirect_uri)

@router.get("/callback/{provider}")
async def oauth_callback(request: Request, provider: str):
    client = oauth.create_client(provider)
    token = await client.authorize_access_token(request)

    if provider == "google":
        user = await client.parse_id_token(request, token)
        email = user["email"]
        provider_id = user["sub"]
        avatar = user.get("picture")

    else:
        resp = await client.get("user", token=token)
        profile = resp.json()
        email = profile.get("email")
        provider_id = str(profile["id"])
        avatar = profile.get("avatar_url")

    db = SessionLocal()
    try:
        existing = db.execute(
            text("SELECT id FROM users WHERE provider = :p AND provider_id = :pid"),
            {"p": provider, "pid": provider_id}
        ).fetchone()

        if existing:
            user_id = existing[0]
        else:
            user_id = str(uuid.uuid4())
            api_key = str(uuid.uuid4())

            db.execute(
                text("""
                    INSERT INTO users (id, email, provider, provider_id, avatar_url, api_key)
                    VALUES (:id, :email, :provider, :pid, :avatar, :api_key)
                """),
                {
                    "id": user_id,
                    "email": email,
                    "provider": provider,
                    "pid": provider_id,
                    "avatar": avatar,
                    "api_key": api_key,
                }
            )
            db.commit()

        jwt_token = create_token(user_id)

        return RedirectResponse(f"http://localhost:3000/oauth-success?token={jwt_token}")

    finally:
        db.close()
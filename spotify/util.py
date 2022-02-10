from datetime import timedelta
from lib2to3.pgen2 import token
from turtle import update
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_SECRET, CLIENT_ID
from requests import post, put, get

BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_or_create_user_tokens(
    session_id, access_token, token_type, expires_in, refresh_token
):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.resfresh_token = refresh_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.save(
            update_fields=["access_token", "refresh_token", "token_type", "expires_in"]
        )
    else:
        tokens = SpotifyToken(
            user=session_id,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=expires_in,
            token_type=token_type,
        )
        tokens.save()


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
        return True

    return False


def refresh_spotify_token(session_id):
    tokens = get_user_tokens(session_id)

    response = post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "refresh_token",
            "refresh_token": tokens.refresh_token,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
    ).json()

    access_token = response.get("access_token")
    token_type = response.get("token_type")
    expires_in = response.get("expires_in")

    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in, tokens.refresh_token
    )


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + tokens.access_token,
    }

    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        rere = put(BASE_URL + endpoint, headers=headers)
        print(rere.json())

    response = get(BASE_URL + endpoint, {}, headers=headers)

    # It will fail here if no content -> maybe handled in the endpoint
    try:
        return response.json()
    except:
        return {"Error": "Issue with request"}


def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)


def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)

def skip_song(session_id):
    return execute_spotify_api_request(session_id, "player/next", post_=True)

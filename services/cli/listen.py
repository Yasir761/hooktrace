import websocket
import requests
import json
import sys

PORT = sys.argv[1]
TOKEN = sys.argv[2]

ws = websocket.WebSocket()

ws.connect(f"ws://localhost:8000/ws/tunnel/{TOKEN}")

print("Hooktrace listening for events...")

while True:

    message = ws.recv()

    event = json.loads(message)

    try:
        requests.post(
            f"http://localhost:{PORT}",
            json=event["payload"],
            headers=event["headers"],
        )

        print("Forwarded webhook → localhost")

    except Exception as e:
        print("Local delivery failed:", e)
import json
import pika


def deliver(config, payload, headers=None):

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=config.get("host", "rabbitmq")
        )
    )

    channel = connection.channel()

    channel.basic_publish(
        exchange=config["exchange"],
        routing_key=config.get("routing_key", ""),
        body=json.dumps(payload)
    )

    connection.close()

    return {
        "status_code": 200,
        "body": "rabbitmq publish",
        "duration_ms": 0,
    }
import json
import pika


def deliver_rabbitmq(config, payload):
    host = config.get("host", "rabbitmq")
    exchange = config.get("exchange")
    if not exchange:
        raise ValueError("Missing RabbitMQ exchange")

    routing_key = config.get("routingKey") or config.get("routing_key") or ""

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
          host = host
        )
    )

    channel = connection.channel()

    channel.basic_publish(
        exchange=exchange,
        routing_key=config.routing_key,
        body=json.dumps(payload)
    )

    connection.close()

    return {
        "status_code": 200,
        "body": "rabbitmq publish",
        "duration_ms": 0,
    }
import json
from kafka import KafkaProducer


def deliver(config, payload, headers=None):

    producer = KafkaProducer(
        bootstrap_servers=config.get("brokers", "localhost:9092")
    )

    producer.send(
        config["topic"],
        json.dumps(payload).encode()
    )

    producer.flush()

    return {
        "status_code": 200,
        "body": "kafka publish",
        "duration_ms": 0,
    }
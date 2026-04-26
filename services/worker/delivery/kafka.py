import json
from kafka import KafkaProducer


def deliver_kafka(config, payload):
    topic = config.get("topic")
    if not topic:
        raise ValueError("Missing Kafka topic") 

    producer = KafkaProducer(
        bootstrap_servers=config.get("brokers", "localhost:9092")
    )

    producer.send(
        topic,
        json.dumps(payload).encode()
    )

    producer.flush()

    return {
        "status_code": 200,
        "body": "kafka publish",
        "duration_ms": 0,
    }
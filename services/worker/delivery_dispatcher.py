import requests
import json
from redis_client import redis_client


def deliver_http(config, payload, headers):
    url = config["url"]

    return requests.post(
        url,
        json=payload,
        headers=headers,
        timeout=10
    )


def deliver_redis(config, payload):
    queue = config["queue"]

    redis_client.lpush(queue, json.dumps(payload))


def deliver_kafka(config, payload):
    from kafka import KafkaProducer

    producer = KafkaProducer(
        bootstrap_servers=config.get("brokers", "localhost:9092")
    )

    producer.send(
        config["topic"],
        json.dumps(payload).encode()
    )

    producer.flush()


def deliver_sqs(config, payload):
    import boto3

    sqs = boto3.client("sqs")

    sqs.send_message(
        QueueUrl=config["queue_url"],
        MessageBody=json.dumps(payload)
    )


def deliver_rabbitmq(config, payload):
    import pika

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=config.get("host", "rabbitmq"))
    )

    channel = connection.channel()

    channel.basic_publish(
        exchange=config["exchange"],
        routing_key=config.get("routing_key", ""),
        body=json.dumps(payload)
    )

    connection.close()


def deliver_grpc(config, payload):
    import grpc

    channel = grpc.insecure_channel(config["endpoint"])

    # placeholder stub
    # depends on protobuf
    print("grpc delivery placeholder")
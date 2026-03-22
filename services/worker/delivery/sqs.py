import json
import boto3


def deliver(config, payload, headers=None):

    sqs = boto3.client("sqs")

    sqs.send_message(
        QueueUrl=config["queue_url"],
        MessageBody=json.dumps(payload)
    )

    return {
        "status_code": 200,
        "body": "sqs message",
        "duration_ms": 0,
    }
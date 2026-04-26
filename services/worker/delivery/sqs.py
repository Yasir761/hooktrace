import json
import boto3


def deliver_sqs(config, payload):
    queue_url = config.get("queueUrl") or config.get("queue_url")
    if not queue_url:
        raise ValueError("Missing SQS queue URL (queueUrl)")
    

    region = config.get("region")
    access_key = config.get("accessKeyId")
    secret_key = config.get("secretAccessKey")

    client_kwargs = {}
    if region:
        client_kwargs["region_name"] = region
    if access_key and secret_key:
        client_kwargs["aws_access_key_id"] = access_key
        client_kwargs["aws_secret_access_key"] = secret_key

    sqs = boto3.client("sqs", **client_kwargs)

    message = {
        "QueueUrl": queue_url,
        "MessageBody": json.dumps(payload),
    }

    message_group_id = config.get("messageGroupId") or config.get("message_group_id")
    if message_group_id:
        message["MessageGroupId"] = message_group_id

    sqs.send_message(**message)

    return {
        "status_code": 200,
        "body": "sqs message",
        "duration_ms": 0,
    }
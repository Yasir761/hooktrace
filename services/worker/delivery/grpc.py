import grpc


def deliver(config, payload, headers=None):

    channel = grpc.insecure_channel(config["endpoint"])

    # Placeholder for actual protobuf service
    print("gRPC delivery placeholder")

    return {
        "status_code": 200,
        "body": "grpc sent",
        "duration_ms": 0,
    }
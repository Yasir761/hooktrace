import grpc


def deliver_grpc(config, payload):
    endpoint = config.get("grpcUrl") or config.get("endpoint")
    if not endpoint:
        raise ValueError('Missing gRPC endpoint {grpcUrl}')
    channel = grpc.insecure_channel(endpoint)

    # Placeholder for actual protobuf service ninvocation

    _=(channel,payload)

    return {
        "status_code": 200,
        "body": "grpc sent",
        "duration_ms": 0,
    }
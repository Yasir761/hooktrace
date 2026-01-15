# Hooktrace

> The easiest and most reliable way to handle webhooks. Built for indie hackers and startups. Self-hosted or cloud. Beautiful debugging. AI-powered explanations.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Yasir761/hooktrace?style=social)](https://github.com/Yasir761/hooktrace)

## Features

- **Simple Webhook Relay** - Create public relay endpoints in seconds
- **Automatic Retries** - Exponential backoff with configurable retry policies
- **Real-time Debugging** - Live WebSocket logs, replay events, compare responses
- **Beautiful Dashboard** - Modern, dark-mode UI built with Next.js
- **Self-Hosted** - docker-compose, Kubernetes, and managed cloud options
- **Production Ready** - Postgres persistence, Redis queuing, async workers
- **AI-Powered Diagnostics** - Get instant explanations for why webhooks failed (Phase 4)
- **Event Routing** - Forward to HTTP, Kafka, Redis, SQS, RabbitMQ, and more (Phase 3)
- **Signature Validation** - HMAC signing for webhook security
- **Dead Letter Queue** - Never lose failed events

## Quick Start

### Docker Compose (Recommended)

```bash
git clone https://github.com/Yasir761/hooktrace.git
cd hooktrace

# Copy environment file
cp .env.example .env

# Start the stack
docker-compose up
```

Visit `http://localhost:3000` and start relaying webhooks!

### System Requirements

- Docker & Docker Compose 2.0+
- Python (for local development)
- PostgreSQL 14+ (or use docker-compose)
- Redis 7+ (or use docker-compose)

## Development

### Local Setup

```bash
 # python -m http.server 3000
 Hooktrace can now forward webhooks directly to:
# http://localhost:3000



```

### Project Structure

```
hooktrace/
├── apps/
│   ├── api/              # Node.js/Express backend
│   ├── worker/           # Job processing (Celery/RQ)
│   └── dashboard/        # Next.js web UI
├── packages/             # Shared TypeScript packages
├── docker-compose.yml    # Local dev stack
├── Dockerfile           # Multi-stage production builds
└── .github/            # CI/CD and templates
```

## Phase Roadmap

### Phase 1: MVP (Core) 
- [x] Public relay endpoints
- [x] Event persistence & queuing
- [x] Async worker with retries
- [x] Basic dashboard with event logs
- [x] Docker & docker-compose setup
- [ ] Helm chart
- [ ] EKS deployment docs

### Phase 2: Reliability & UX
- [x] Dead Letter Queue
- [x] Manual replay button
- [x] WebSocket live updates
- [x] Idempotency key support
- [x] Webhook signature validation
- [x] Prometheus metrics
- [x] Audit logs

### Phase 3: Developer Experience
- [x] Webhook provider templates (Stripe, GitHub, Razorpay, etc.)
- [x] Local dev forwarding (ngrok-like)
- [ ] Multiple delivery targets (HTTP, SQS, Kafka, Redis)
- [ ] Event aggregation mode
- [ ] Docker optimization

### Phase 4: Advanced Features
- [ ] AI failure analysis
- [ ] Replay comparison
- [ ] Advanced routing rules
- [ ] Auto-scaling optimization
- [ ] SaaS deployment
- [ ] Terraform modules

## Configuration

See `.env.example` for all available configuration options:

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/hooktrace
REDIS_URL=redis://localhost:6379

# API
API_PORT=3001
API_HOST=0.0.0.0

# Dashboard
NEXT_PUBLIC_API_URL=http://localhost:3001
DASHBOARD_PORT=3000
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Bug Reports
Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)

### Feature Requests
Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)

### Documentation Issues
Use the [documentation template](.github/ISSUE_TEMPLATE/documentation.md)

## License

Licensed under the Apache License 2.0 - see [LICENSE](./LICENSE) for details.

## Support

- **Documentation**: https://hooktrace.dev/docs
- **Issues**: https://github.com/Yasir761/hooktrace/issues
- **Discussions**: https://github.com/Yasir761/hooktrace/discussions

## Acknowledgments

Inspired by Convoy, Hook0, Svix, and modern webhook best practices.

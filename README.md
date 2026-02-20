<div align="center">

#  Hooktrace

### The modern webhook infrastructure for developers

**Simple. Reliable. Self-hosted.**

Built for indie hackers and startups who need webhook debugging without the enterprise price tag.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Yasir761/hooktrace?style=social)](https://github.com/Yasir761/hooktrace)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[Features](#-features) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

##  Features

### Core Capabilities

-  **Instant Webhook Relay** - Create public endpoints in seconds, no configuration needed
-  **Smart Retries** - Exponential backoff with configurable policies and circuit breaking
-  **Real-time Debugging** - Event logs, request/response inspection, and manual replay
-  **Beautiful Dashboard** - Modern, dark-mode UI built with Next.js and Tailwind CSS

### Production Ready

-  **Easy Self-Hosting** - Docker Compose, Kubernetes, Railway, and Render support
-  **Persistent Storage** - PostgreSQL for reliability, Redis for queuing
-  **Async Workers** - Background job processing with horizontal scaling
-  **Signature Validation** - HMAC signing for webhook security
-  **Audit Logs** - Complete event history and tracking

### Advanced Features

-  **Dead Letter Queue** - Never lose failed events, replay them anytime
-  **Local Forwarding** - Test webhooks locally without ngrok
-  **Provider Templates** - Pre-built configs for Stripe, GitHub, Razorpay, and more
-  **Idempotency Support** - Prevent duplicate event processing
-  **Event Routing** - Forward to HTTP endpoints *(more targets planned)*

---

##  Quick Start

### Option 1: Docker Compose (Recommended)

Get up and running in under 60 seconds:

```bash
git clone https://github.com/Yasir761/hooktrace.git
cd hooktrace
cp .env.example .env
docker-compose up
```

**That's it!** Open `http://localhost:3000` and start relaying webhooks.

### Option 2: One-Click Cloud Deploy

Deploy the full stack to managed platforms:

<table>
<tr>
<td width="33%" align="center">
  
**Railway**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/Yasir761/hooktrace)

*API + Worker + DB + Redis*

</td>
<td width="33%" align="center">

**Render**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Yasir761/hooktrace)

*Full Stack Deployment*

</td>
<td width="33%" align="center">

**Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Yasir761/hooktrace&env=NEXT_PUBLIC_API_URL)

*Dashboard Only*

</td>
</tr>
</table>

> **Note:** Vercel deploys the dashboard only. Deploy API + Worker on Railway/Render or self-host.

---

##  System Requirements

| Component | Minimum Version |
|-----------|----------------|
| Docker | 20.10+ |
| Docker Compose | 2.0+ |
| PostgreSQL | 14+ |
| Redis | 7+ |
| Python (dev only) | 3.9+ |
| Node.js (dev only) | 18+ |

---

##  Architecture

```
┌─────────────────┐
│   Dashboard     │  Next.js + Tailwind
│  (Port 3000)    │  Real-time UI
└────────┬────────┘
         │
         │ HTTP
         ▼
┌─────────────────┐
│   API Server    │  FastAPI (Python)
│  (Port 3001)    │  Webhook ingestion & routing
└────────┬────────┘
         │
         │ Enqueue jobs
         ▼
┌─────────────────┐       ┌──────────────┐
│   Redis Queue   │◄──────│  PostgreSQL  │
│                 │       │   Database   │
└────────┬────────┘       └──────────────┘
         │
         │ Process jobs
         ▼
┌─────────────────┐
│  Async Worker   │  Python (Redis-backed worker)
│                 │  Retry logic & delivery
└─────────────────┘
```

### Project Structure

```
hooktrace/
├── services/
│   ├── api/              # FastAPI backend
│   └── worker/           # Python job processor
├── web/                  # Next.js dashboard
├── docker-compose.yml    # Local development stack
└── .github/              # CI/CD workflows
```

---

##  Development

### Local Setup

```bash
# Clone the repository
git clone https://github.com/Yasir761/hooktrace.git
cd hooktrace

# Copy environment file
cp .env.example .env

# Start development stack
docker-compose up
```

### Local Webhook Forwarding

Test webhooks without exposing your machine:

```bash
# Start local receiver
python -m http.server 3000

# Configure Hooktrace destination URL based on your setup:
```

**When running Hooktrace in Docker:**
```
http://host.docker.internal:3000
```

**When running Hooktrace locally (without Docker):**
```
http://localhost:3000
```

> **Note:** Use `host.docker.internal` when Hooktrace runs inside Docker to reach your host machine. Use `localhost` when running Hooktrace natively.

No ngrok or tunneling required!

---

##  Configuration

Environment variables (see `.env.example`):

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/hooktrace
REDIS_URL=redis://localhost:6379

# API Server
API_PORT=3001
API_HOST=0.0.0.0

# Dashboard
NEXT_PUBLIC_API_URL=http://localhost:3001
DASHBOARD_PORT=3000

# Webhook Behavior
WEBHOOK_MAX_RETRY_ATTEMPTS=3
WEBHOOK_DEFAULT_TIMEOUT=30
```

For production deployments, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

##  Roadmap

###  Phase 1: MVP (Complete)
- [x] Public relay endpoints
- [x] Event persistence & queuing
- [x] Async worker with retries
- [x] Basic dashboard with logs
- [x] Docker Compose setup

###  Phase 2: Reliability (Mostly Complete)
- [x] Dead Letter Queue
- [x] Manual replay support
- [x] Idempotency key support
- [x] HMAC signature validation
- [x] Audit logs
- [ ] WebSocket live updates *(in progress)*
- [ ] Prometheus metrics *(planned)*

###  Phase 3: Developer Experience (Mostly Complete)
- [x] Webhook provider templates (Stripe, GitHub, Razorpay, etc.)
- [x] Local dev forwarding (no ngrok needed)
- [ ] Multiple delivery targets (HTTP, SQS, Kafka, Redis) *(HTTP only for now)*
- [ ] Event aggregation mode *(planned)*

###  Phase 4: Advanced Features (Planned)
- [ ] AI-powered failure analysis
- [ ] Replay comparison view
- [ ] Advanced routing rules
- [ ] Auto-scaling optimization
- [ ] Helm chart for Kubernetes
- [ ] Terraform modules
- [ ] SaaS deployment option

[View full roadmap →](https://github.com/Yasir761/hooktrace/projects)

---

##  Documentation

- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment options
- **[API Reference](https://hooktrace.dev/docs/api)** - REST API documentation
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[FAQ](https://hooktrace.dev/docs/faq)** - Common questions

---

##  Contributing

We love contributions! Whether it's bug fixes, new features, or documentation improvements.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Issue Templates

-  [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)
-  [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)
-  [Documentation](.github/ISSUE_TEMPLATE/documentation.md)

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

##  License

Licensed under the [Apache License 2.0](./LICENSE).

This means you can use Hooktrace for commercial purposes, modify it, distribute it, and use it privately. Just include the license and copyright notice.

---

##  Support & Community

-  **Documentation**: [hooktrace.dev/docs](https://hooktrace.dev/docs)
-  **Issues**: [GitHub Issues](https://github.com/Yasir761/hooktrace/issues)
-  **Discussions**: [GitHub Discussions](https://github.com/Yasir761/hooktrace/discussions)


---

##  Acknowledgments

Hooktrace stands on the shoulders of giants. Inspired by:

- [Convoy](https://github.com/frain-dev/convoy) - Webhook infrastructure
- [Hook0](https://www.hook0.com/) - Modern webhook service
- [Svix](https://www.svix.com/) - Enterprise webhook platform

Built with modern webhook best practices and a focus on developer experience.

---

<div align="center">

**Built with ❤️ by developer, for developers**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/Yasir761/hooktrace/issues) • [Request Feature](https://github.com/Yasir761/hooktrace/issues) 

</div>
# Deployment Guide

**Hooktrace** is designed to be cloud-agnostic and self-hostable. Deploy it locally for development, on managed platforms for production, or on your own infrastructure for full control.

---

## Quick Start Options

### 🐳 Local Development (Docker Compose)

**Best for:** Local testing, development, and contributions

#### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

#### Getting Started

```bash
git clone https://github.com/<your-username>/hooktrace
cd hooktrace
cp .env.example .env
docker compose up --build
```

#### Services Overview

| Service | URL | Description |
|---------|-----|-------------|
| **API** | `http://localhost:3001` | FastAPI backend |
| **Dashboard** | `http://localhost:3000` | Next.js frontend |
| **Postgres** | `localhost:5432` | Database |
| **Redis** | `localhost:6379` | Queue & cache |
| **Worker** | N/A | Background job processor |

#### Test Your Setup

```bash
curl -X POST http://localhost:3001/r/testtoken/order.created \
  -H "Content-Type: application/json" \
  -d '{"order_id": 123, "amount": 49.99}'
```

---

## Managed Platform Deployments

###  Railway

**Best for:** Indie hackers and rapid production deployment

Deploy the complete backend stack with one click. Railway automatically provisions and configures all required services.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/hooktrace)

**Includes:**
- FastAPI application server
- Background worker process
- PostgreSQL database (managed)
- Redis instance (managed)

**Configuration:** Railway automatically injects `DATABASE_URL` and `REDIS_URL`. No manual setup required.

---

###  Render

**Best for:** Open-source projects and stable managed infrastructure

One-click deployment with infrastructure-as-code via `render.yaml`.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/<your-username>/hooktrace)

**Deployed Services:**
- API (Web Service)
- Worker (Background Worker)
- PostgreSQL (Managed Database)
- Redis (Managed Cache)

All services are defined in the `render.yaml` blueprint and connected automatically.

---

###  Vercel (Dashboard Only)

**Best for:** Global CDN delivery and blazing-fast UI performance

> **Note:** Vercel hosts only the Next.js dashboard. You must deploy the API and Worker separately (Railway, Render, or self-hosted).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/<your-username>/hooktrace)

**Required Environment Variable:**

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

**Example:**
```bash
NEXT_PUBLIC_API_URL=https://hooktrace-api.onrender.com
```

---

## Self-Hosted Infrastructure

###  Custom Deployment

**Best for:** Enterprise usage, compliance requirements, and full operational control

#### Supported Platforms

- **Docker** - Containerized deployment
- **Kubernetes** - EKS, GKE, AKS, or self-managed
- **AWS ECS / Fargate** - Serverless containers
- **Bare Metal / VMs** - Traditional infrastructure

#### Architecture Components

| Component | Type | Scaling |
|-----------|------|---------|
| **API** | Stateless | Horizontal |
| **Worker** | Stateless | Horizontal |
| **PostgreSQL** | Stateful | Vertical/Replicas |
| **Redis** | Stateful | Cluster mode |

#### Deployment Tools

- **Helm Charts** *(coming soon)* - Kubernetes deployment
- **Terraform Modules** *(coming soon)* - Infrastructure as code
- **Docker Compose** - Available now for multi-container orchestration

---

## Development Features

###  Local Webhook Forwarding

Test webhooks locally without exposing your machine to the internet. No ngrok or tunneling required.

#### Setup

**1. Start a local receiver:**
```bash
python -m http.server 3000
```

**2. Configure webhook route target:**
```
http://host.docker.internal:3000
```

Hooktrace will now forward incoming webhooks directly to your local application.

---

## Configuration Reference

### Environment Variables

#### API & Worker

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `REDIS_URL` | Redis connection string | Yes | - |
| `WEBHOOK_MAX_RETRY_ATTEMPTS` | Maximum retry count for failed webhooks | No | `3` |
| `WEBHOOK_DEFAULT_TIMEOUT` | Request timeout in seconds | No | `30` |

#### Dashboard

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | API endpoint URL | Yes |

---

## Recommended Architecture

For most production use cases, we recommend this stack:

| Component | Platform | Reason |
|-----------|----------|--------|
| **API + Worker** | Railway or Render | Managed infrastructure, auto-scaling |
| **Dashboard** | Vercel | Global CDN, instant deploys |
| **Local Dev** | Docker Compose | Full stack locally |

**Benefits:**
-  Fast deployment (< 5 minutes)
-  Automatic scaling and health checks
-  Clear separation of concerns
-  Excellent developer experience

---

## Why Choose Hooktrace?

**Built for Developers:**
-  **Self-host friendly** - No vendor lock-in
-  **Queue-based reliability** - Never lose a webhook
-  **Automatic retries** - Configurable backoff strategy
-  **Dead letter queue** - Inspect and replay failed webhooks
-  **Manual replay** - Re-send webhooks with one click
-  **Local forwarding** - Test without exposing ports
-  **Indie hacker optimized** - Simple, powerful, cost-effective

---

## Next Steps

1. **Choose your deployment option** above
2. **Configure environment variables** for your platform
3. **Deploy in minutes** using one-click buttons or Docker
4. **Send your first webhook** and watch it flow through the system

Need help? Check the [documentation](https://github.com/<your-username>/hooktrace) or open an issue.

---

*Last updated: January 2026*
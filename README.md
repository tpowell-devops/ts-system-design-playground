
# 📦 Distributed Job Processing System (Full-Stack Platform)
A containerized full-stack system demonstrating authentication, asynchronous job processing, and distributed system design patterns using React, Node.js, Redis, and nginx.

## Overview

This project is a containerized, event-driven job processing system built with a React frontend, Node.js API, Redis-backed queueing, and nginx reverse proxy routing.

It demonstrates full-stack system design including:

* authentication architecture (JWT + refresh tokens)
* reverse proxy routing (nginx)
* asynchronous job processing (Redis queue + workers)
* retry + dead-letter handling
* frontend state orchestration (React Query + Axios interceptors)
* containerized microservice-style deployment

---

# 🧠 System Architecture

The system is composed of four primary layers:

## 1. Client Layer

* React SPA (TypeScript)
* React Router for routing
* React Query for server state
* Axios for API communication

## 2. Edge Layer

* nginx reverse proxy
* routes `/` → frontend
* routes `/api/*` → backend API

## 3. Application Layer

* Node.js + Express API
* JWT authentication (access + refresh tokens)
* job orchestration layer

## 4. Data / Processing Layer

* Redis (queue + state store)
* worker-based job processing system
* retry + DLQ logic

---

# 🧩 High-Level Architecture

```
Browser
   ↓
nginx (Reverse Proxy)
   ↓
+-------------------+-------------------+
|                   |                   |
Frontend SPA        API Service        Redis
(React)             (Express)          (Queue + State)
                                        ↓
                                    Worker System
```

---

# 🔐 Authentication System

## Design

A dual-token authentication model is implemented:

### Access Token

* Short-lived JWT (15 minutes)
* Stored in memory (not persisted)
* Attached via Axios interceptor

### Refresh Token

* Long-lived JWT (7 days)
* Stored in HttpOnly cookie
* Used for silent session renewal

---

## Flow

1. User logs in
2. API issues:

   * access token (response body)
   * refresh token (HttpOnly cookie)
3. Frontend stores access token in memory
4. Axios interceptors attach token to requests
5. On expiration:

   * interceptor calls `/auth/refresh`
   * new access token is issued transparently

---

## Security Properties

* No sensitive token stored in localStorage
* Refresh token inaccessible to JavaScript (XSS resistant)
* Session renewal is automatic and transparent

---

# ⚙️ Job Processing System

## Architecture

Jobs are processed asynchronously using a Redis-backed queue.

### Lifecycle States

* Created
* Queued
* Processing
* Completed
* Failed
* Dead Letter Queue (DLQ)

---

## Execution Flow

1. Client submits job
2. API validates request
3. Job is queued in Redis
4. Worker processes job asynchronously
5. Result is persisted back to Redis

---

## Failure Handling

If a job fails:

* Retry is attempted using exponential backoff
* Retry count is tracked per job
* After max retries → job is moved to DLQ
* DLQ requires manual intervention

---

## Reliability Patterns

* Idempotent job execution
* Retry with exponential backoff
* Failure isolation via DLQ
* Eventually consistent processing model

---

# 🌐 Frontend Architecture

## Structure

Feature-based modular architecture:

```
features/
  auth/
  jobs/
shared/
  http.ts
  authStore.ts
```

---

## Key Design Patterns

### React Query

* manages server state
* handles caching + mutations

### Axios Interceptors

* inject Authorization header
* handle token refresh automatically

### Auth State Model

* React Context (UI state)
* In-memory authStore (interceptor bridge)

---

## Request Flow

```
UI → React Query → API module → Axios → Interceptor → Backend
```

---

# 🧱 Infrastructure

## Dockerized Services

* frontend container (React build)
* API container (Node.js)
* Redis container
* nginx container

---

## nginx Routing

* `/` → frontend SPA
* `/api/*` → backend service

Acts as a reverse proxy layer separating UI and API concerns.

---

# 🔁 System Lifecycle (End-to-End)

1. User interacts with UI
2. Frontend sends request via React Query
3. Axios attaches JWT (if available)
4. nginx routes request to API
5. API validates JWT and processes request
6. Jobs are queued in Redis if async
7. Worker processes jobs independently
8. Results returned or polled by frontend

---

# 📊 Architecture Characteristics

This system demonstrates:

## Distributed Systems Concepts

* async job processing
* queue-based execution
* worker model
* eventual consistency

## Reliability Engineering

* retries with exponential backoff
* dead letter queue (DLQ)
* idempotent processing

## Security Architecture

* JWT-based authentication
* HttpOnly refresh tokens
* interceptor-based session renewal

## Frontend System Design

* server-state separation (React Query)
* global auth state management
* request middleware pattern

## Infrastructure Design

* reverse proxy routing
* containerized services
* internal service networking

---

# 🧠 Key Design Decisions

### 1. No localStorage for tokens

Improves security by reducing XSS exposure.

### 2. Axios interceptor-based auth

Centralizes request authentication logic.

### 3. Redis as coordination layer

Enables decoupled async job processing.

### 4. Stateless frontend

All session state derived from token + memory.

---

# 🚀 What this project demonstrates

This project demonstrates the ability to design and implement:

* full-stack distributed systems
* authentication systems with secure token lifecycle management
* asynchronous processing pipelines
* containerized service architectures
* frontend state orchestration patterns
* API middleware and proxy routing
* failure handling and retry logic in distributed systems

---

# 📌 Suggested Extensions (Future Work)

* WebSocket-based job updates
* Distributed worker scaling
* Metrics + observability (Prometheus/Grafana)
* Role-based access control (RBAC)
* Multi-tenant job isolation
* Persistent DB integration (Postgres)

---


# Distributed Job Queue + Monitoring Dashboard

## Overview

This project is a production-inspired job queue system designed to handle asynchronous workloads reliably at scale. It includes a backend queue/worker architecture and a frontend dashboard for observability and control.

The goal is to explore real-world concerns such as retries, failure handling, idempotency, and system backpressure—not just basic task execution.

---

## Features

* Asynchronous job processing
* Retry logic with exponential backoff
* Dead-letter queue for failed jobs
* Idempotent job handling
* Job status tracking (queued, running, succeeded, failed)
* REST API for job submission and querying
* Real-time monitoring dashboard

---

## System Architecture

**Core components:**

* API server (job ingestion)
* Queue (task buffering)
* Worker(s) (job processing)
* Database (state persistence)
* Frontend dashboard (visibility & control)

**Flow:**

1. Client submits a job via API
2. Job is persisted and pushed to the queue
3. Worker pulls and processes the job
4. Result is stored and exposed via API
5. Failures trigger retries or move to dead-letter queue

---

## Design Decisions & Tradeoffs

### 1. At-least-once delivery

The system guarantees **at-least-once processing** instead of exactly-once.

**Why:**

* Simpler to implement
* More realistic for distributed systems

**Tradeoff:**

* Requires idempotent job handlers to avoid duplicate effects

---

### 2. Retry strategy

Exponential backoff is used for retries.

**Why:**

* Prevents overwhelming the system under failure conditions

**Tradeoff:**

* Increased latency for eventual success

---

### 3. Persistence model

Jobs are stored in a database rather than purely in-memory.

**Why:**

* Durability across restarts
* Easier observability

**Tradeoff:**

* Slightly higher latency vs in-memory queues

---

### 4. Queue implementation

Initial version uses [describe your choice: in-memory / Redis / DB-backed].

**Future improvement:**

* Replace with a distributed message broker for horizontal scalability

---

## Failure Handling

* Transient failures → retried with backoff
* Permanent failures → moved to dead-letter queue
* Worker crashes → jobs are re-queued
* Duplicate execution → mitigated via idempotency keys

---

## Observability

* Structured logging for all job lifecycle events
* Metrics (job latency, retry counts, failure rates)
* Dashboard for real-time visibility

---

## What I Would Do in Production

* Introduce a distributed queue (e.g., Kafka / SQS)
* Add horizontal worker scaling with autoscaling
* Implement tracing (OpenTelemetry)
* Add rate limiting and backpressure controls
* Improve job prioritization and scheduling

---

## Running the Project

```bash
# install dependencies
# start backend
# start workers
# start frontend
```

---

## Tech Stack

* Frontend: React
* Backend: Node.js
* Database: PostgreSQL
* Queue: (your choice)
* Cache (optional): Redis

---

## Key Takeaways

This project focuses on the realities of backend systems:

* Work fails
* Systems retry
* Duplicate execution happens
* Observability is critical

The implementation reflects tradeoffs commonly made in production systems rather than idealized designs.

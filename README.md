# 📦 Subscription Tracker API

A production-ready RESTful API for managing user subscriptions with automated renewal reminders, rate limiting, and secure authentication.

Built with **Node.js**, **Express**, **MongoDB**, and **Upstash QStash Workflows**.

---

## 🚀 Features

- **JWT Authentication** — Secure user registration and login with token-based auth
- **Subscription Management** — Full CRUD for user subscriptions with auto status tracking
- **Automated Email Reminders** — QStash-powered workflows that send reminders at 7, 5, 2, and 1 days before renewal
- **Smart Status Updates** — Auto-expires subscriptions when their renewal date passes via Mongoose pre-save hooks
- **Rate Limiting** — Upstash Redis rate limiting middleware to protect against abuse
- **Security** — Arcjet integration for advanced bot detection and request protection

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Workflow Engine | Upstash QStash |
| Rate Limiting | Upstash Redis |
| Security | Arcjet |
| Email | Nodemailer |

---

## 📁 Project Structure

```
subscription_api/
├── config/
│   ├── env.js                  # Environment variable exports
│   └── upstash.js              # Upstash QStash workflow client
├── controllers/
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   └── workflow.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── arcjet.middleware.js
│   └── rateLimit.middleware.js
├── models/
│   ├── user.model.js
│   └── subscription.model.js
├── routes/
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   └── workflow.routes.js
├── utils/
│   └── send-email.js
├── .env.development.local
├── .env.production.local
└── server.js
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Upstash account (Redis + QStash)
- Arcjet account

### Installation

```bash
git clone https://github.com/pi8878/subscription-api.git
cd subscription-api
npm install
```

### Environment Variables

Create a `.env.development.local` file in the root directory:

```env
PORT=5500
SERVER_URL=http://localhost:5500
NODE_ENV=development

DB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your_qstash_token
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive JWT |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/subscriptions` | Create a subscription |
| GET | `/api/v1/subscriptions/user/:id` | Get all subscriptions for a user |
| GET | `/api/v1/subscriptions/:id` | Get a single subscription |
| PUT | `/api/v1/subscriptions/:id` | Update a subscription |
| DELETE | `/api/v1/subscriptions/:id` | Delete a subscription |

### Workflows

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/workflows/subscription/reminder` | Trigger renewal reminder workflow |

---

## 🔄 Workflow Logic

When a subscription is created, a QStash workflow is triggered that:

1. Fetches the subscription and validates it is still active
2. Sleeps until each reminder window (7, 5, 2, and 1 days before renewal)
3. Sends a reminder email to the user at each interval
4. Automatically skips reminders if the renewal date has already passed

> **Local Development Note:** Use [ngrok](https://ngrok.com) to expose your local server so QStash can reach your workflow endpoint. Update `SERVER_URL` in your `.env` with the ngrok URL.

---

## 🔐 Security

- All subscription routes are protected with JWT middleware
- Users can only access their own subscriptions
- Rate limiting is applied globally via Upstash Redis
- Arcjet provides bot detection and additional request protection

---

## 📬 Subscription Object

```json
{
  "name": "Netflix",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "Credit Card",
  "startDate": "2026-02-26T00:00:00.000Z"
}
```

Supported frequencies: `daily` `weekly` `monthly` `yearly`

Supported currencies: `USD` `EUR` `GBP`

---

## 📄 License

MIT

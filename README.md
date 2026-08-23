# 🌌 Aether CRM & ERP System

An enterprise-grade, glassmorphism-designed Mini-CRM and ERP system featuring role-restricted views, automated inventory ledger trace, and a robust delivery challan lifecycle management flow.

Built with **NestJS & TypeORM** (Core Backend), **Prisma 7 & PgAdapter** (Database Client), and **Vite, React & TypeScript** (Frontend) powered by a dark-mode styled UI.

---

## 🛠️ Tech Stack & Features

*   **Frontend**: React 19, TypeScript, Vite, React Router, Axios, Lucide Icons.
*   **Backend Framework**: NestJS (for production CRM/ERP architecture) & Express (auxiliary developer testing server).
*   **Database & ORMs**: PostgreSQL, TypeORM (for schema migrations/synchronization), Prisma 7 with Native Postgres PgAdapter (for high-speed client-side queries).
*   **Styling**: Custom Vanilla CSS with modern Glassmorphism dark-mode aesthetics, rich gradients, and micro-animations.
*   **Security**: JWT-based Authentication, Role-based Route & Action guards.

---

## 📂 Project Structure

```
CRM/
├── backend/                  # NestJS & Express Backend Project
│   ├── src/
│   │   ├── main.ts           # NestJS production entry point (Port 8001)
│   │   ├── server.ts         # Express dev/test server entry point (Port 8001)
│   │   ├── app.module.ts     # Main NestJS module
│   │   ├── lib/
│   │   │   └── prisma.ts     # Prisma 7 client connection setup (with PgPool adapter)
│   │   ├── generated/prisma  # Prisma generated type-safe client
│   │   ├── auth/             # Authentication & Guards module
│   │   ├── users/            # User administration module
│   │   ├── customers/        # Customer CRM accounts module
│   │   ├── products/         # Product catalog module
│   │   ├── challans/         # Challan lifecycle management module
│   │   └── stock-movements/  # Ledger ledger tracking module
│   ├── prisma/
│   │   └── schema.prisma     # Prisma DB Schema definition
│   ├── .env                  # Environment configuration
│   └── tsconfig.json         # TS configuration with ESM/NodeNext
├── frontend/                 # Vite + React Frontend Project
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts     # Axios client configuration (Points to port 8001)
│   │   ├── main.tsx          # React application entry point
│   │   └── ...               # React views & components
│   └── package.json
├── docker-compose.yml        # Docker compose definition for PostgreSQL
└── postman_collection.json   # Exported Postman API test collection
```

---

## 🚀 Quick Start Guide

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   [Docker](https://www.docker.com/) & Docker Compose

### 1. Database Setup
Start the local PostgreSQL container using Docker Compose:
```bash
docker compose up -d
```
*The database will start on `localhost:5432` with username `erp_admin`, password `erp_password`, and database name `mini_erp_crm`.*

### 2. Backend Installation & Setup
Navigate to the `backend` folder and set up environment variables:
```bash
cd backend
```

Create/verify your `.env` configuration:
```env
PORT=8001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=erp_admin
DB_PASSWORD=erp_password
DB_DATABASE=mini_erp_crm
DATABASE_URL="postgresql://erp_admin:erp_password@localhost:5432/mini_erp_crm"
JWT_SECRET=super-secret-crm-erp-key-change-in-prod
JWT_EXPIRATION=1d
```

Install packages and generate the Prisma client:
```bash
npm install
npx prisma generate
```

Now, choose your runner:
*   **Run NestJS production backend** (runs watch mode on Port `8001`):
    ```bash
    npm run start:dev
    ```
*   **Run auxiliary Express development server** (runs on Port `8001`):
    ```bash
    npm run dev
    ```

> 💡 **Automatic Database Seeding**: On startup, TypeORM automatically synchronizes the tables. The NestJS server checks for existing records, and automatically seeds default credentials, customers, and product items if they are missing.

### 3. Frontend Installation & Run
Go to the `frontend` folder, install dependencies, and start Vite:
```bash
cd ../frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 👥 Seeded Logins (Demo Accounts)

You can click the preset credentials shortcuts on the Login Page, or enter them manually:

| Role | Username | Password | Purpose & Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Control panel, full visibility, create users, modify catalogs & customers. |
| **Sales** | `sales` | `sales123` | Create new customers, create draft challans for assigned accounts. |
| **Warehouse** | `warehouse` | `warehouse123` | Record stock updates, view stock movement logs, dispatch draft challans. |
| **Accounts** | `accounts` | `accounts123` | View customer ledger balances, bill delivered challans. |

---

## 🔄 Delivery Challan Lifecycle Workflow

The system enforces a strict state machine to maintain accurate product stock counts and customer balances:

```mermaid
stateDiagram-v2
    [*] --> Draft : Sales creates order
    Draft --> Delivered : Warehouse dispatches stock\n(Atomically triggers OUT Stock Movement)
    Delivered --> Invoiced : Accounts bill invoice\n(Atomically increments customer balance)
    Draft --> Cancelled : Cancel draft (No stock/balance effect)
    Delivered --> Cancelled : Cancel delivery (Reverses stock count + IN Stock Movement)
    Invoiced --> Cancelled : Cancel billing (Reverses stock count + Decrements customer balance)
```

1.  **Draft**: Created by **Sales** outlining sold products. No stock or financial impact.
2.  **Delivered**: Checked and marked by the **Warehouse**. Decreases stock count automatically and registers a **Stock Movement (OUT)** log.
3.  **Invoiced**: Finalized by **Accounts**. Increases the customer's outstanding balance ledger by the total amount.
4.  **Cancelled**: Can be done by **Admin** or authorized users. Cancelling a `Delivered` or `Invoiced` challan triggers automatic inventory restocking (IN movement) and ledger reversals.

---

## 📡 API Testing
You can import the `postman_collection.json` file in root directly into **Postman** to test and verify all the authentication, user, client, product, challan, and stock management endpoints.
 


---

## 🧭 Project Overview

**Aether CRM & ERP** is a full-stack, enterprise-grade business management platform built to streamline sales, inventory, and accounting operations under a single unified interface.

It is designed for small-to-mid-sized businesses that need tight control over their product catalog, customer relationships, delivery order lifecycle, and stock ledger — all behind a role-restricted access model that ensures every team member sees only what they need.

The system combines a **NestJS** backend (with TypeORM for schema management and Prisma 7 for high-performance querying) with a **React + Vite** frontend that delivers a stunning glassmorphism dark-mode UI with real-time micro-animations and smooth navigational flows.

---

## ✨ Key Features

### 🔐 Authentication & Role-Based Access Control
- JWT-secured login system with refresh-safe token handling.
- Four built-in roles — **Admin, Sales, Warehouse, Accounts** — each with scoped permissions.
- Route guards on both frontend and backend to prevent unauthorized access or actions.

### 👤 Customer Relationship Management (CRM)
- Maintain a full customer directory with contact details and account metadata.
- Track each customer's outstanding balance ledger updated automatically on invoicing.
- Sales agents can create and manage their assigned customer accounts independently.

### 📦 Product Catalog & Inventory
- Manage a centralized product catalog with pricing, unit, and stock quantity tracking.
- Warehouse team can record incoming stock (IN movements) with timestamped logs.
- Stock levels are automatically adjusted on challan dispatch and cancellation events.

### 🧾 Delivery Challan Lifecycle Management
- End-to-end challan flow: **Draft → Delivered → Invoiced → (Cancelled)**.
- Each state transition is atomic — stock movements and balance changes are committed together or not at all, preventing data inconsistency.
- Cancellation of any post-draft state triggers full automatic reversal of stock and ledger entries.

### 📊 Stock Movement Ledger
- Every stock change (inbound or outbound) is logged as an immutable ledger entry.
- Provides full traceability: who moved stock, when, how much, and linked to which challan.
- Warehouse staff have a dedicated view for stock log history and inventory health.

### 🛡️ Admin Control Panel
- Admins can create and manage user accounts across all roles.
- Full visibility across customers, products, challans, and stock movements.
- System seeds default demo users, customers, and products automatically on first run.

### 🌐 Developer-Friendly Architecture
- Dual-server support: NestJS for production, Express auxiliary server for rapid testing.
- Prisma-generated type-safe client for zero-drift database access.
- Postman collection included for instant API exploration and end-to-end testing.
- Docker Compose configuration for one-command local PostgreSQL setup.


---

## 💼 Need & Application in the IT Sector

Modern IT companies — whether software houses, system integrators, or managed-service providers — juggle a complex web of client accounts, hardware/software procurement, service delivery orders, and vendor billing cycles. Without a unified system, teams end up working across disconnected spreadsheets, email threads, and siloed tools, leading to missed invoices, stock discrepancies, and poor client visibility.

**Aether CRM & ERP directly addresses these IT-sector challenges:**

- **Client & Account Management**: IT firms can maintain a structured client directory, track service agreements, and monitor outstanding balances per account — replacing error-prone manual records.
- **Procurement & Inventory Control**: Hardware resellers and system integrators can track component stock (servers, networking gear, licenses) with automatic ledger updates on every procurement or dispatch event.
- **Service Delivery Orders**: The Challan lifecycle maps naturally to IT service delivery — raise a work order (Draft), execute and dispatch (Delivered), then bill the client (Invoiced) with full audit trails.
- **Team Role Segregation**: IT orgs can grant Sales, Delivery/Operations, and Finance teams precisely scoped access — preventing accidental or unauthorized changes across departments.
- **Audit & Compliance Readiness**: The immutable stock movement and billing ledger gives IT finance teams a reliable trail for internal audits, tax filing, and client dispute resolution.

LETS THANKS FRO WROK TOGETHER..THANK U..
WE WILL FURTHER WORK ON IT LATER 
LAST DONE 26/8

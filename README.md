# 🌱 Krishi Grow — Agricultural Value-Chain Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java Version](https://img.shields.io/badge/Java-17%2B-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Flyway Migration](https://img.shields.io/badge/Flyway-Enabled-red.svg)](https://flywaydb.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Krishi Grow** is an enterprise-grade agricultural value-chain web platform engineered to connect farmers directly with commercial buyers (Aggregators, Processors, and Wholesalers). 

The platform provides end-to-end digitisation of the agri-supply chain: from crop logging, yield estimation, and transportation logistics calculation to market intelligence, government scheme discovery, value-addition processing, and buyer contract matching.

---

## 📌 Table of Contents

- [Key Features](#-key-features)
  - [For Farmers](#-for-farmers)
  - [For Commercial Buyers](#-for-commercial-buyers)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup (Spring Boot)](#1-backend-setup-spring-boot)
  - [2. Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
- [Configuration & Environment Variables](#-configuration--environment-variables)
- [Database Schema & Migrations](#-database-schema--migrations)
- [REST API Reference](#-rest-api-reference)
- [Documentation Index](#-documentation-index)
- [GitHub Workflow & Contribution Guidelines](#-github-workflow--contribution-guidelines)
- [License](#-license)

---

## ✨ Key Features

### 🌾 For Farmers
* **Crop Portfolio & Inventory**: Manage planted crops, acreage, harvest dates, estimated yield tonnage, and quality grades.
* **Market Intelligence & Price Tracker**: Real-time mandi price updates, historic rate trends, and regional crop demand analytics.
* **Logistics & Freight Calculator**: Distance-based transportation cost calculation, payload optimization, and vehicle selection.
* **Agronomy & Weather Insights**: Hyper-local weather forecasts, field harvest advisories, and crop protection alerts.
* **Government Scheme Finder**: Automated discovery of government agricultural subsidies, PMFBY insurance, and credit programs.
* **Value-Addition & Processing Options**: Locate nearby food processing units and explore post-harvest transformation opportunities (e.g., paste, flour, drying).

### 🏢 For Commercial Buyers (Aggregators, Processors, Wholesalers)
* **Targeted Procurement Portals**: Role-specific views customized for Aggregators (bulk aggregation), Processors (raw material specs), and Wholesalers (graded produce distribution).
* **Buyer Requirement Posting**: Post exact crop quality grades, required tonnage, price ceilings, delivery locations, and contract timelines.
* **Direct Farmer Sourcing**: Filter verified farmers by crop variety, location, harvest date, and volume; initiate direct supply negotiations.

---

## 🛠️ System Architecture & Tech Stack

```
+-------------------------------------------------------------+
|                  React 19 + TypeScript Frontend             |
|   (Vite, Tailwind CSS v4, Framer Motion, GSAP, Recharts)    |
+------------------------------+------------------------------+
                               |
                        REST / JSON (JWT Auth)
                               |
+------------------------------v------------------------------+
|                Spring Boot 3.2 Backend Service              |
|     (Spring Security, JPA / Hibernate, Actuator, Flyway)    |
+------------------------------+------------------------------+
                               |
                      JDBC Connection
                               |
+------------------------------v------------------------------+
|            Database Layer (PostgreSQL / H2 In-Memory)       |
+-------------------------------------------------------------+
```

### Backend Technologies
* **Framework**: Spring Boot 3.2.5
* **Language**: Java 17
* **Security**: Spring Security 6 + JSON Web Token (JWT) stateless auth
* **Persistence**: Spring Data JPA / Hibernate ORM
* **Database**: PostgreSQL (Production) / H2 In-Memory Database (Development & Testing)
* **Migrations**: Flyway DB Version Control
* **Build System**: Apache Maven

### Frontend Technologies
* **Framework**: React 19
* **Language**: TypeScript 6.0
* **Build Tool**: Vite 8.2
* **Styling**: Tailwind CSS v4 + Custom Utility Palette
* **UI Components & Icons**: Lucide React, Recharts (Data Visualisations)
* **Animations**: Framer Motion & GSAP Smooth Interactions

---

## 📁 Repository Structure

```
krishi-grow/
├── .gitignore                   # Comprehensive root Git ignore rules
├── README.md                    # Project documentation (this file)
├── index.html                   # Root entrypoint
├── 01_FRONTEND_UI_UX.md         # Frontend UI/UX specification & wireframes
├── 02_BACKEND_SPRING_BOOT.md   # Spring Boot backend architecture doc
├── 03_API_DATABASE_DEPLOYMENT.md# API schemas, Flyway migrations & deployment specs
├── backend/                     # Spring Boot Java REST backend
│   ├── pom.xml                  # Maven dependencies & build setup
│   ├── .gitignore
│   └── src/
│       ├── main/java/com/agri/platform/
│       │   ├── controller/      # REST API Controllers (Auth, Crop, Buyer)
│       │   ├── dto/             # Data Transfer Objects (Requests & Responses)
│       │   ├── entity/          # JPA Domain Entities (User, Crop, BuyerProfile)
│       │   ├── repository/      # Spring Data Repositories
│       │   ├── security/        # JWT Authentication Filter & Security Config
│       │   └── PlatformApplication.java # Spring Boot Main Class
│       └── main/resources/
│           ├── application.yml  # System & Database configuration
│           └── db/migration/    # Flyway SQL Migration Scripts (V1, V2, V3)
├── frontend/                    # Vite + React 19 TypeScript frontend
│   ├── package.json             # NPM dependencies & scripts
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS v4 settings
│   ├── .gitignore
│   ├── public/                  # Static assets & SVG icons
│   └── src/
│       ├── components/          # Reusable UI elements (Navbar, Cards, Modals)
│       ├── pages/               # Dashboard & Feature pages
│       ├── services/            # API Service layer (Axios / Fetch wrappers)
│       ├── context/             # Global Auth & State Providers
│       ├── types/               # Shared TypeScript interfaces
│       └── App.tsx              # Main Application Component
└── frames final/                # UI Mockups & Visual design assets
```

---

## 🚀 Getting Started

### Prerequisites

Before starting, ensure you have the following installed on your local environment:
* **Java Development Kit (JDK)**: Version 17 or higher
* **Node.js**: Version 18.x or 20.x+
* **npm**: Version 9.x+ (comes bundled with Node.js)
* **Maven**: Version 3.8+ (optional if using `mvnw` wrapper)
* **Git**: Version 2.x+

---

### 1. Backend Setup (Spring Boot)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Build the project and download dependencies**:
   ```bash
   mvn clean install
   ```

3. **Run the Spring Boot application**:
   ```bash
   mvn spring-boot:run
   ```
   *The backend server will start on `http://localhost:8080`.*

4. **Verify Backend Health**:
   Open `http://localhost:8080/actuator/health` in your browser. You should receive:
   ```json
   {"status": "UP"}
   ```

5. **H2 In-Memory Database Console (Dev Mode)**:
   - **URL**: `http://localhost:8080/h2-console`
   - **JDBC URL**: `jdbc:h2:mem:agri_value_chain`
   - **User**: `sa`
   - **Password**: *(leave blank)*

---

### 2. Frontend Setup (React + Vite)

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install NPM dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   *The frontend server will launch at `http://localhost:5173`.*

4. **Production Build & Preview**:
   ```bash
   npm run build
   npm run preview
   ```

---

## ⚙️ Configuration & Environment Variables

### Backend Configuration (`backend/src/main/resources/application.yml`)

The backend supports configuration via environment variables with sensible defaults for local development:

| Environment Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `jdbc:h2:mem:agri_value_chain;DB_CLOSE_DELAY=-1;MODE=PostgreSQL` | JDBC Connection URL |
| `DATABASE_USERNAME` | `sa` | Database user |
| `DATABASE_PASSWORD` | *(empty)* | Database password |
| `DATABASE_DRIVER` | `org.h2.Driver` | Database JDBC driver |
| `JWT_SECRET` | *(64-char hex key)* | Secret key for signing JWT tokens |
| `JWT_EXPIRATION` | `86400000` *(24 hours)* | Token expiration time in milliseconds |
| `SERVER_PORT` | `8080` | Spring Boot HTTP port |

To run with **PostgreSQL** in production, set the environment variables:
```bash
export DATABASE_URL="jdbc:postgresql://localhost:5432/agri_db"
export DATABASE_USERNAME="postgres"
export DATABASE_PASSWORD="your_secure_password"
export DATABASE_DRIVER="org.postgresql.Driver"
```

---

## 🗄️ Database Schema & Migrations

Database migrations are managed automatically using **Flyway**. Scripts are located in `backend/src/main/resources/db/migration/`:

* **`V1__create_users.sql`**: Initialises `users`, `farmer_profiles`, and `buyer_profiles` tables with security role constraints (`ROLE_FARMER`, `ROLE_BUYER`).
* **`V2__create_crop_tables.sql`**: Creates `crops`, `crop_varieties`, `crop_grades`, and `farmer_crops` tables.
* **`V3__create_buyer_tables.sql`**: Creates `buyer_requirements` table for commercial buyer postings.

---

## 📡 REST API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new Farmer or Buyer account | ❌ No |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT Bearer token | ❌ No |

### Crop Management Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/crops` | Fetch master list of supported crops & grades | ❌ No |
| `GET` | `/api/farmer/crops` | List crops owned by authenticated farmer | 🔑 Yes |
| `POST` | `/api/farmer/crops` | Register new crop entry with quantity & harvest date | 🔑 Yes |
| `DELETE` | `/api/farmer/crops/{id}` | Delete a farmer crop listing | 🔑 Yes |

### Buyer Requirement Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/buyer/requirements` | Search and list commercial buyer crop requirements | ❌ No |
| `POST` | `/api/buyer/requirements` | Create requirement posting (Aggregator / Processor / Wholesaler) | 🔑 Yes |
| `DELETE` | `/api/buyer/requirements/{id}` | Remove requirement posting | 🔑 Yes |

---

## 📄 Documentation Index

For detailed architectural and design specifications, refer to the following documents:
- [01 — Frontend UI & UX Specification](01_FRONTEND_UI_UX.md)
- [02 — Backend Spring Boot Architecture](02_BACKEND_SPRING_BOOT.md)
- [03 — API, Database Schema & Deployment Manual](03_API_DATABASE_DEPLOYMENT.md)

---

## 🐙 GitHub Workflow & Contribution Guidelines

### Pushing to GitHub

To publish this codebase to your GitHub repository, follow these steps:

1. **Create a new repository on GitHub** (e.g., `krishi-grow`).
2. **Add the remote repository URL**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/krishi-grow.git
   ```
3. **Stage and commit your changes**:
   ```bash
   git add .
   git commit -m "feat: initial commit of Krishi Grow full-stack platform"
   ```
4. **Push to main branch**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Branching Convention
* `main`: Production-ready stable codebase.
* `feature/*`: New features and modules.
* `bugfix/*`: Bug fixes and patches.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ for Sustainable Agriculture & Digital Supply Chain Transparency
</p>

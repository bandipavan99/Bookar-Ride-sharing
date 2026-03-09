# 🚀 RideShare Platform – Full Stack Application

A complete Uber/Rapido-like ride sharing platform built with **Spring Boot + React + MySQL**.

---

## 📁 Project Structure

```
Bookar/
├── ride-sharing-backend/    # Spring Boot 3 + Java 17
├── ride-sharing-frontend/   # React 18 + Vite
└── database/
    └── schema.sql           # MySQL schema
```

---

## 🗄 Database Setup (MySQL)

1. Open MySQL Workbench or CLI
2. Run the schema file:
   ```sql
   source C:/Users/bandi/Desktop/Bookar/database/schema.sql;
   ```
3. This creates `ridesharing` database with tables: `users`, `drivers`, `rides`, `payments`
4. A default **Admin** account is inserted:
   - Email: `admin@rideshare.com`
   - Password: `admin123`

---

## ⚙️ Backend Setup (Spring Boot)

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8 running on port 3306

### Configure
Edit `ride-sharing-backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### Run
```bash
cd ride-sharing-backend
mvn spring-boot:run
```

Backend starts on **http://localhost:8080**

---

## 🎨 Frontend Setup (React + Vite)

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run
```bash
cd ride-sharing-frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173**

> ⚡ API calls are automatically proxied to `localhost:8080` via Vite proxy config.

---

## 👤 User Roles & Default Accounts

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Admin | admin@rideshare.com | admin123 | /admin |
| Customer | Register at /register | — | /dashboard |
| Driver | Register at /register (select Driver) | — | /driver/dashboard |

---

## 🔌 API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register user/driver |
| POST | /api/auth/login | Login → returns JWT |

### User
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/users/profile | Get current user profile |
| PUT | /api/users/profile | Update name/phone/password |
| GET | /api/users/rides | Get ride history |

### Driver
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/drivers/register | Register vehicle details |
| GET | /api/drivers/profile | Get driver profile |
| PUT | /api/drivers/availability?status=true | Toggle online/offline |
| GET | /api/drivers/rides | Driver's ride history |
| GET | /api/drivers/earnings | Total earnings stats |
| PUT | /api/drivers/respond/{rideId}?accept=true | Accept or reject ride |

### Rides
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/rides/book | Book a ride |
| GET | /api/rides/{id} | Get ride by ID |
| PUT | /api/rides/{id}/status?status=ONGOING | Update ride status |
| GET | /api/rides/all | List all rides |

### Admin
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/users | All users |
| GET | /api/admin/drivers | All drivers |
| GET | /api/admin/rides | All rides |
| PUT | /api/admin/users/{id}/block?block=true | Block/unblock user |

---

## 🔐 JWT Authentication

All protected APIs require:
```
Authorization: Bearer <your-jwt-token>
```

Token is returned on login/register and stored in `localStorage` by the frontend.

---

## 💰 Fare Calculation

| Vehicle | Base Fare | Per km |
|---------|-----------|--------|
| 🛵 Bike | ₹20 | ₹8/km |
| 🛺 Auto | ₹30 | ₹12/km |
| 🚗 Car | ₹50 | ₹18/km |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Axios, React Hot Toast |
| Backend | Spring Boot 3, Spring Security, JPA/Hibernate, JWT (jjwt 0.11.5) |
| Database | MySQL 8 |
| Auth | JWT Bearer Tokens |
| Styling | Custom CSS (dark glassmorphism theme) |

---

## 📧 Support

Project by **RideShare Team** – 2026

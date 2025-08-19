# 📦 Parcel Delivery System API

## 🚀 Project Overview
The **Parcel Delivery System API** is a backend service built with **Node.js, Express, TypeScript, and MongoDB**.  
It allows users to send and receive parcels, track delivery progress, and manage delivery operations with role-based access control.

---

## ✨ Features
- **Authentication & Authorization**
  - Register/Login with JWT
  - Google OAuth support
  - Role-based access (Admin, Super Admin, Sender, Receiver, Delivery Personnel)
- **Parcel Management**
  - Create, update, block/unblock, and delete parcels
  - Assign delivery personnel
  - Track parcel using tracking ID
- **User Management**
  - Admins can block/unblock users
  - Super Admin can manage all users
- **Status Tracking**
  - Logs parcel delivery status with timestamp, location, and notes

---

## 🛠 Tech Stack
- **Backend Framework:** Node.js, Express.js, TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (Access & Refresh Tokens), Google OAuth
- **Security:** Bcrypt, CORS, Helmet
- **Utilities:** Express-session, Winston Logger

---

## 🔑 Environment Variables (.env)
```env
PORT=5000
DB_URL=your_mongo_connection_string
NODE_ENV=development

# JWT
JWT_ACCESS_SECRET=access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=refresh_secret
JWT_REFRESH_EXPIRES=30d

# BCRYPT
BCRYPT_SALT_ROUND=10

# SUPER ADMIN
SUPER_ADMIN_EMAIL=super@gmail.com
SUPER_ADMIN_PASSWORD=12345678

# Google
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Express Session
EXPRESS_SESSION_SECRET=express-session

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

## 📡 API Endpoints

### 🔐 Authentication
- `POST /api/v1/auth/register` – Register user  
- `POST /api/v1/auth/login` – Login user  
- `GET /api/v1/auth/google` – Google OAuth login  

---

### 🚚 Parcel APIs

#### 1. Create Parcel
**POST** `/api/v1/parcels`

**Request Body**
```json
{
  "sender": "64dcbf1a2f9a5b8c12345678",
  "receiver": "64dcbf1a2f9a5b8c87654321",
  "type": "Electronics",
  "weight": 2.5,
  "address": "123, Dhaka, Bangladesh",
  "fee": 150,
  "deliveryDate": "2025-08-25"
}
```

---

#### 2. Update Parcel Status
**PATCH** `/api/v1/parcels/:id/status`

**Request Body**
```json
{
  "status": "DISPATCHED",
  "location": "Dhaka Hub",
  "note": "Parcel sent to delivery hub"
}
```

---

#### 3. Assign Delivery Personnel
**PATCH** `/api/v1/parcels/:id/assign`

**Request Body**
```json
{
  "personnelId": "64dd111a2f9a5b8c99999999"
}
```

---

#### 4. Block / Unblock Parcel
**PATCH** `/api/v1/parcels/:id/block`

**Request Body**
```json
{
  "isBlocked": true,
  "location": "Warehouse",
  "note": "Suspicious parcel"
}
```

---

#### 5. Delete Parcel
**DELETE** `/api/v1/parcels/:id`

- Allowed if:
  - User is **Admin / Super Admin**
  - OR user is **Sender** and `status = REQUESTED`

---

#### 6. Get Parcel by Tracking ID
**GET** `/api/v1/parcels/track?trackingId=TRK-1723800000001`

**Response**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Parcel retrieved successfully",
  "data": {
    "trackingId": "TRK-1723800000001",
    "status": "IN_TRANSIT",
    "address": "123, Dhaka, Bangladesh",
    "statusLogs": [
      { "status": "REQUESTED", "timestamp": "2025-08-16T10:00:00.000Z" },
      { "status": "DISPATCHED", "location": "Dhaka Hub", "timestamp": "2025-08-17T09:00:00.000Z" }
    ]
  }
}
```

---

## ▶️ Run the Project

### 1. Clone the repo
```sh
git clone https://github.com/your-username/parcel-delivery-system.git
cd parcel-delivery-system
```

### 2. Install dependencies
```sh
npm install
```

### 3. Setup `.env`
Create a `.env` file in the root with the values from above.

### 4. Run server
```sh
npm run dev
```

Server will run on: **http://localhost:5000/api/v1**

# 📦 Parcel Delivery API

A backend service for managing parcel deliveries, users, and role-based operations.  
This system supports **senders, receivers, admins, and delivery personnel**, providing secure parcel tracking and management.

---

## 🚀 Project Overview

The **Parcel Delivery API** is designed to handle end-to-end parcel delivery management.  
It allows:
- **Senders** to create and track parcels.
- **Receivers** to confirm deliveries and view history.
- **Admins** to manage users, block/unblock parcels, and assign delivery personnel.
- **Delivery personnel** (optional) to update parcel statuses.

The project is built using **Node.js, Express, TypeScript, and MongoDB**, ensuring a scalable and secure solution.

---

## ✨ Features

- 🔐 **Role-based Authentication** (Admin, Sender, Receiver, Delivery Personnel)  
- 📦 **Parcel Management**
  - Create, update, and track parcels
  - Assign delivery personnel  
  - Block/unblock parcels with status logs  
- 👤 **User Management**
  - Registration and login (with roles)
  - Block/unblock users  (only admin/super-admin)
- 📊 **Parcel Status Logs** (history of updates and activities)
- 📝 **Delivery Confirmation & History for Receivers**
- ⚡ **JWT Authentication & Authorization**

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, TypeScript  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT (JSON Web Token)  
- **Error Handling:** Custom `AppError` with global error middleware  
- **Validation:** Zod (for request validation)  

---

## 📍 API Endpoints

### 🔑 Auth
| Method | Endpoint         | Description                  |
|--------|------------------|------------------------------|
| POST   | `/api/v1/user/register` | Register a new user (SENDER/RECEIVER) |
| POST   | `/api/v1/user/login`    | Login user & get token |

---

### 👤 User
| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/v1/user`              | Get all users (admin only)   |
| PATCH  | `/api/v1/user/:id/block`    | Block a user (admin only)    |
| PATCH  | `/api/v1/user/:id/unblock`  | Unblock a user (admin only)  |

---

### 📦 Parcel
| Method | Endpoint                                | Description                                   |
|--------|-----------------------------------------|-----------------------------------------------|
| POST   | `/api/v1/parcel`                          | Create a new parcel (sender only)             |
| GET    | `/api/v1/parcel/:id`                      | Get parcel by ID                              |
| GET    | `/api/v1/parcel/tracking/:trackingId`     | Track parcel by tracking ID                   |
| PATCH  | `/api/v1/parcel/:id/status`               | Update parcel status (admin/delivery only)    |
| PATCH  | `/api/v1/parcel/:id/block`                | Block/Unblock a parcel (admin only)           |
| PATCH  | `/api/v1/parcel/:id`                      | ADMIN or SUPER_ADMIN can delete directly and If SENDER => must be the sender & status must be REQUESTED           |
| PATCH  | `/api/v1/parcel/:id/assign-personnel`     | Assign delivery personnel (admin only)        |
| GET    | `/api/v1/parcel/receiver/history`         | Get delivery history for logged-in receiver   |

---

### 📜 Status Logs
Each parcel maintains a `statusLogs` array for audit trails:  
```json
{
  "status": "IN_TRANSIT",
  "location": "Warehouse - Dhaka",
  "note": "Parcel dispatched",
  "updatedBy": "64c8f3a9e23f2f45d1a1b123",
  "timestamp": "2025-08-16T10:20:30Z"
}
```

---

## 🚦 Getting Started

1. Clone the repo  
   ```bash
   git clone https://github.com/your-username/parcel-delivery-api.git
   cd parcel-delivery-api
   ```
2. Install dependencies  
   ```bash
   npm install
   ```
3. Create a `.env` file  
   ```env
   PORT=5000
   DATABASE_URL=mongodb+srv://...
   JWT_SECRET=your_secret_key
   ```
4. Start development server  
   ```bash
   npm run dev
   ```

---

## ✅ Future Improvements
- Delivery personnel dashboard  
- Notification system (email/SMS updates)  
- Payment integration  

---

## 📄 License
This project is open-source and available under the **MIT License**.

# Rotaract Club of GHRUA Web App

A full-stack web application to manage members, events, attendance, and certificates for the Rotaract Club of GHRUA. Built using **React**, **Node.js**, **Express**, **PostgreSQL**, **Tailwind CSS**, and **ExcelJS** for export functionality.  

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Folder Structure](#folder-structure)  
- [Setup Instructions](#setup-instructions)  
- [Environment Variables](#environment-variables)  
- [Backend API Routes](#backend-api-routes)  
- [Frontend Routes](#frontend-routes)
- [License](#license)  

---

## Features

### User Roles

- **Admin**: View and manage everything. Assign club roles, update club fee status, view all registered members, access all dashboards.  
- **Asst. Admin**: Upload events, mark attendance, manage event links, mark events complete, view event history.  
- **Member**: View upcoming events, register for events, view own attendance and profile, receive email notifications.  

---

### Member Management

- Create/update member profiles: `name`, `mobile`, `email`, `dob`, `university`, `system_role`, `club_role`, `club_fee_status`.  
- Admin can update `system_role`, `club_role`, and `club_fee_status`.  
- All users can update their personal info (`name`, `mobile`, `email`, `dob`, `university`).  
- Profile page for all users showing all fields, editable where permitted.  

---

### Events Management

- **Create events** (by Asst. Admin).  
- **Register for events** (`I’m In` / `I’m Out`).  
- View **upcoming and completed events**. (by Admin and Asst.Admin) 
- Upload **joining links** (visible to registered attendees).  
- Mark events **complete** after conclusion.  

---

### Attendance Tracking

- Only **Asst. Admins** can mark attendance.  
- **Attendance table** shows all registered users for the event.  
- Mark a user as **Present** (boolean).  
- Disable button once present is marked (button stays disabled after marking).  
- **Export attendance to Excel** with name, email, and present/absent status.  

---

### Event History

- Page displays all events for **Admin** and **Asst. Admin**.  
- Shows: **Sr. No., Event Date, Event Name, Certificate Status**.  
- Filter events by **from** and **to** date.  
- Toggle certificate status: **RECEIVED / NOT_RECEIVED** with **Save** button.  
- Export **filtered or all events** to Excel.  

---

### Dashboards

- **Member Dashboard**: View attendance stats, number of events attended, registered but not attended.  
- **Asst. Admin Dashboard**: Manage events, mark attendance, view event history.  
- **Admin Dashboard**: Manage members, assign roles, view all events and attendance, update member statuses.  

---

### Notifications

- Email notifications to members for:  
  - Event added  
  - Joining link updated  
- Toast notifications for success/error messages.  

---

## Tech Stack

- **Frontend**: React, Tailwind CSS, React Router DOM, Axios, react-hot-toast  
- **Backend**: Node.js, Express.js  
- **Database**: PostgreSQL (Supabase optional)  
- **Authentication**: JWT Tokens  
- **Excel Export**: ExcelJS  
- **Deployment**: Free hosting options (Railway, Render, or Supabase for backend and database, Netlify/Vercel for frontend)  

---

## Folder Structure
```
rac-ghrua-app/
├─ client/
│ ├─ src/
│ │ ├─ api/
│ │ ├─ components/
│ │ ├─ context/
│ │ ├─ pages/
│ │ ├─ AppRoutes.jsx
│ │ └─ index.js
├─ server/
│ ├─ controllers/
│ ├─ routes/
│ ├─ middlewares/
│ ├─ config/
│ ├─ app.js
│ └─ package.json
└─ README.md
```

---

## Setup Instructions

### Backend
Create .env file with database and JWT secrets

```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```
Tailwind CSS already configured.
Use http://localhost:5000 for API calls during development.

### Environment Variables (.env)
```bash
PORT=5000
DATABASE_URL=postgres://username:password@host:port/dbname
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.example.com
EMAIL_USER=example@example.com
EMAIL_PASS=password
```
## Backend API Routes
| Method | Endpoint                                | Description                | Roles              |
| ------ | --------------------------------------- | -------------------------- | ------------------ |
| POST   | /api/auth/login                         | Login user                 | All                |
| GET    | /api/users                              | Get all users              | ADMIN              |
| PUT    | /api/users/:id                          | Update user                | ADMIN / Self       |
| GET    | /api/events                             | Get all events             | All                |
| POST   | /api/events                             | Create event               | ASST_ADMIN / ADMIN |
| POST   | /api/attendance/:eventId/mark           | Mark present               | ASST_ADMIN / ADMIN |
| GET    | /api/attendance/:eventId                | Get attendance             | ASST_ADMIN / ADMIN |
| GET    | /api/export/attendance/:eventId         | Export attendance Excel    | ADMIN / ASST_ADMIN |
| GET    | /api/event-history                      | Event history              | ADMIN / ASST_ADMIN |
| GET    | /api/event-history/export               | Export event history Excel | ADMIN / ASST_ADMIN |
| PUT    | /api/event-history/:eventId/certificate | Update certificate status  | ADMIN / ASST_ADMIN |

## Frontend Routes
| Route                  | Component          | Roles              |
| ---------------------- | ------------------ | ------------------ |
| /login                 | Login              | All                |
| /dashboard/member      | MemberDashboard    | MEMBER             |
| /dashboard/asst-admin  | AsstAdminDashboard | ASST_ADMIN / ADMIN |
| /dashboard/admin       | AdminDashboard     | ADMIN              |
| /events                | Events             | All                |
| /events/:id            | EventDetails       | All                |
| /asst-admin            | AsstAdminEvents    | ASST_ADMIN / ADMIN |
| /asst-admin/events/:id | Attendance         | ASST_ADMIN / ADMIN |
| /profile               | Profile            | All                |
| /admin/members         | AdminMembers       | ADMIN              |
| /event-history         | EventHistory       | ADMIN / ASST_ADMIN |

## License
This project is for Rotaract Club of GHRUA internal use and is not licensed publicly.
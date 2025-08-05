# 🧳 Airport Luggage Storage System

> **IGDTUW Batch of 2027 - Application Engineering Assignment**  
> **Submission Deadline:** 07:00 PM IST  
> **Problem Statement:** Airport Luggage Storage & Billing System  
> **Developed by:** [Your Name] | Roll No: [Your Roll Number]  

---

## 📽️ Demo Video

🎥 **Watch the demo:** [Video Link Here](https://drive.google.com/your-demo-link)

---

## 🚀 Project Overview

The **Airport Luggage Storage System** is designed for **airport staff** to manage and track the usage of **storage lockers** for passenger luggage.  
It supports:
- Automated locker assignment
- Real-time status tracking
- Hourly-based billing
- Overstay detection (Bonus)
- Maintenance mode
- Revenue analytics

Passengers do not interact with the system. All operations are staff-driven via the system dashboard.

---

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (or LocalStorage for mock data)
- **Styling & UI:** Tailwind CSS / CSS Modules
- **Icons & UI Helpers:** Lucide React / React Hot Toast

---

## 📦 Features Implemented

### ✅ Core Luggage Operations (Level 0)
- Locker auto-assignment by luggage type (Small/Medium/Large/Special)
- Dashboard with:
  - Total, Available, Occupied lockers
  - Filter by locker type
  - Search by locker number

### ⏱️ Duration Tracking & Session Management (Level 1)
- Auto record of **Check-in** & **Check-out** time
- Locker auto-frees after check-out
- No overlapping locker sessions

### 💰 Pricing & Billing (Level 2)
- Hourly Billing as per the following logic:
  - `0–1 hr → ₹100`
  - `1–3 hrs → ₹200`
  - `3–6 hrs → ₹300`
  - `6+ hrs → ₹500`
- Bill is auto-generated and shown on checkout

### 🎯 Bonus Features
- Mark lockers as **Under Maintenance**
- **Overstay Alerts** for luggage stored beyond 24 hours
- **Revenue Reports** and locker utilization analytics

---

## 🧪 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/luggage-storage-system.git
cd luggage-storage-system
```

### 2. Install Dependencies

```bash
# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install
```

### 3. Start Development Servers

```bash
# Start backend server
cd backend
npm run dev

# Start frontend React app
cd ../frontend
npm start
```

> Ensure MongoDB is running if you are using database-backed version.  
> Or, you can try the localStorage version for quick setup.

---

## 📁 Folder Structure

```bash
/ (root)
├── frontend/          # React app
│   ├── components/
│   ├── pages/
│   └── ...
├── backend/           # Express + Node.js server
│   ├── models/
│   ├── routes/
│   └── ...
├── README.md
└── ...
```

---

## 📌 Notes

- 📤 **Make sure your screen recording (demo video) clearly shows each core and bonus feature.**
- 📎 Submit `.zip` of the project + Video link to:
  ```
  campus-hiring@motorq.co  
  CC: rohit@motorq.com, vinoj@motorq.com
  ```

---

## 🙋‍♂️ Author

**Name:** [Your Name]  
**Roll No:** [Your Roll Number]  
**Email:** [Your College Email]

---

## 📃 License

This project is a part of academic coursework and not intended for production use.  
Use under **IGDTUW Application Engineering Assignment guidelines**.

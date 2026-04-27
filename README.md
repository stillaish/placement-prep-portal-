# 🚀 Placement Preparation Portal

A full-stack **MERN (MongoDB, Express, React, Node.js)** web application designed to help students prepare for technical placements with company-wise questions, progress tracking, and interactive learning.

---

## 📌 Features

### 👤 Authentication & User Management
- JWT-based Signup/Login  
- Role-based access: Student, Admin, (Optional) Moderator  
- Profile management (name, skills, target company)  
- Password update/reset  

---

### 📚 Question Management
- Company-wise question bank  
- Topic-wise filtering (DSA, DBMS, OS, etc.)  
- Difficulty levels: Easy, Medium, Hard  
- Add/Edit/Delete questions (Admin)  

---

### 📊 Progress Tracking
- Mark questions as: ✅ Solved / ❌ Unsolved  
- Track preparation progress  
- Personalized dashboard  

---

### 🔍 Search & Filtering
- Search questions by keywords  
- Filter by Company, Topic, Difficulty  
- Recommended questions section  

---

### ⭐ Popular Topics
- Clickable topics (DSA, OS, DBMS, CN)  
- Redirect to relevant questions  

---

### 📈 Dashboard
- Total solved questions  
- Progress percentage  
- Activity overview  

---

### 🛠️ Admin Panel
- Manage users, questions, topics  
- Full CRUD operations  

---

## 🧑‍💻 Tech Stack

**Frontend:** React.js, Tailwind CSS, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**Authentication:** JWT, bcrypt  

---

## 📁 Folder Structure
placement-prep-portal/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
│
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── App.js
│
├── documentation/
│
└── README.md

---

## ⚙️ Installation & Setup

### Clone Repo
git clone https://github.com/your-username/placement-prep-portal.git
cd placement-prep-portal

### Backend Setup
cd backend
npm install
npm start

### Frontend Setup
cd frontend
npm install
npm start

---

## 🔐 Environment Variables (.env)
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

---

## 👨‍💻 Author

**Aish Maheshwari**

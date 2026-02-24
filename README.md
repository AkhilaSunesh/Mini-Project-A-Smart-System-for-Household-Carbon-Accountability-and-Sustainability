# Mini-Project-A Smart System for Household Carbon Accountability and Sustainability



# 🌱 EcoLogical

[![Python](https://img.shields.io/badge/Backend-Django-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Academic-blue.svg)](LICENSE)

**EcoLogical** is a web-based CO₂ tracking and carbon credit management platform designed to help individuals and communities measure, reduce, and manage their environmental impact.

> **Track. Reduce. Earn. Sustain.**

---

## 📌 Problem Statement
Many individuals are unaware of their daily carbon footprint. Existing tools often lack a unified system that combines real-time carbon tracking, verified rewards, and community-level sustainability monitoring.

## 💡 The Solution
EcoLogical provides a centralized ecosystem where users can:
- **Track & Calculate:** Log daily activities (transport, energy, waste) with automated CO₂ conversion.
- **Verify:** Upload proof of eco-friendly actions (Proof-of-Work).
- **Gamify:** Earn reward points and compete on community leaderboards.
- **Trade:** Participate in a conceptual carbon credit marketplace.

---

## ✨ Key Features

- **🌍 CO₂ Activity Tracker:** Granular tracking for transport, energy, water, and purchases.
- **📷 Proof of Work Verification:** Media upload and validation for eco-actions.
- **🏆 Rewards & Leaderboard:** Incentivizing sustainable behavior through gamification.
- **💱 Carbon Credit Marketplace:** A hub for managing and trading earned credits.
- **📊 Community Monitoring:** Aggregated data for localized environmental impact.
- **📝 Sustainability Insights:** Recommendations and AQI data access.

---

## 🏗️ System Architecture

The application is built using a decoupled, layered architecture to ensure scalability and security:

**User** → **React Frontend** (Tailwind CSS) → **DRF API** (JWT Auth) → **Django Backend** → **PostgreSQL**

---

## 🛠️ Tech Stack

### Frontend
- **React.js**: Single Page Application (SPA) framework.
- **Tailwind CSS**: Utility-first CSS for responsive design.
- **Axios**: Secure API communication.

### Backend
- **Django**: Robust Python web framework.
- **Django REST Framework (DRF)**: For building scalable REST APIs.
- **SimpleJWT**: Secure JSON Web Token authentication.
- **Bcrypt**: Industrial-strength password hashing.

### Database & Storage
- **PostgreSQL**: Relational database for activity logs and user data.
- **Django ORM**: Object-Relational Mapping for secure data access.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/ecological.git](https://github.com/your-username/ecological.git)
cd ecological

```

### 2. Backend Setup (Django)

```bash
cd backend
python -m venv venv

# Activate Virtual Environment
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start

```

---

## 🛣️ Future Scope

* **AI Integration:** Predictive modeling for personal carbon trends.
* **Mobile Application:** Native Android/iOS versions using React Native.
* **IoT Integration:** Smart meter connectivity for automated energy tracking.
* **Government Collaboration:** Linking verified credits to official environmental schemes.

---

## 👩‍💻 Team

Developed for academic and sustainability research purposes by:

* **Akhila Sunesh**
* **Amrutha Ajish Achuthan**
* **Anjali Kizhakekuttu Thomas**
* **Gowri P.J**
* **Under the guidance of:** Dr. Nisha Joseph

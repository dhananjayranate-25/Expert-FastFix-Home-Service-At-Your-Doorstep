<div align="center">

# 🛠️ Expert FastFix - Home Service At Your Doorstep

![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)

**A Comprehensive, Full-Stack Home Service Booking Platform designed to connect customers with expert service professionals.**

[🚀 Features](#-key-features) • [🧠 System Architecture](#-system-architecture) • [💻 Tech Stack](#-tech-stack) • [📦 Setup](#-installation--setup) • [🔐 Credentials](#-default-credentials)

</div>

---

## 📖 Introduction: What is FastFix?

Finding reliable, professional, and punctual home services (plumbers, electricians, cleaners) is often a frustrating experience. **Expert FastFix** bridges this gap by providing a seamless online platform where customers can browse over 40+ specialized home services, book an expert, and track the entire service process live.

This project is built as a complete **B2C (Business-to-Consumer) SaaS application**, handling everything from user onboarding to employee dispatching, admin oversight, and automated post-service invoicing.

---

## 🧠 System Architecture

FastFix employs a decoupled Client-Server architecture:
*   **Frontend (Client):** A highly responsive, single-page-like application built with Vanilla JavaScript, HTML5, and TailwindCSS. It utilizes `localStorage` for fast session management and makes asynchronous REST API calls to the server.
*   **Backend (Server):** A robust Python Flask API that processes business logic, handles routing, and communicates securely with the database.
*   **Database:** MongoDB serves as the NoSQL document database, allowing flexible and scalable schemas for `Users`, `Bookings`, and `Services`.

---

## ✨ Deep Dive into Core Portals & Features

The ecosystem is divided into three distinct portals, each tailored with specific permissions and dashboards.

### 1. 👤 Customer (User) Portal
The user portal is focused on conversion, ease of use, and transparency.
*   **Dynamic Service Catalog:** Users can search and filter through a dynamic grid of services loaded directly from the database.
*   **Frictionless Booking System:** Users can schedule a service by providing their address, preferred date, and description of the issue.
*   **Live Tracking Dashboard:** Once booked, users see a **Live Progress Bar** (Pending ➡️ In Progress ➡️ Completed) to track their service in real-time.
*   **Automated Tax Invoices:** Upon service completion, the system generates a professional A4-sized PDF invoice dynamically via `html2pdf.js`. It calculates base price, **CGST (9%)**, and **SGST (9%)** accurately.
*   **Review-Gated Invoicing:** To ensure high-quality service, invoice downloads are mathematically locked until the user submits a 5-star rating/review for the employee.
*   **Localization:** Integrated Google Translate widget allows users to switch the entire platform into local languages (e.g., Marathi, Hindi).

### 2. 👷 Employee (Technician) Portal
Built for on-the-go professionals to manage their workflow.
*   **Task Assignment Inbox:** Employees can view a queue of new/pending bookings.
*   **Status Management:** With a single click, employees can "Accept" a booking (changing status to *In Progress*) and later mark it as *Completed*. These updates instantly reflect on the Customer's live tracking bar.

### 3. 👑 Admin (Management) Portal
The central command center for business owners.
*   **Service Inventory Management:** Admins can Create, Read, Update, and Delete (CRUD) services from the catalog dynamically without touching the code.
*   **Global Oversight:** View all system users, employees, and every single booking made on the platform.
*   **Data Control:** Capability to delete rogue accounts or manage service prices dynamically.

---

## 💻 Tech Stack

### Frontend
*   **HTML5 & CSS3:** Semantic structure with customized styling.
*   **Tailwind CSS:** Utility-first CSS framework for rapid, responsive, and beautiful UI design.
*   **Vanilla JavaScript (ES6+):** For DOM manipulation, API fetching, and complex frontend logic (avoiding heavy framework overhead for raw performance).
*   **html2pdf.js:** Client-side HTML-to-PDF rendering engine for generating invoices.
*   **FontAwesome:** High-quality vector icons for UI enhancement.

### Backend & Database
*   **Python 3:** Core backend programming language.
*   **Flask:** Lightweight, fast WSGI web application framework to build RESTful APIs.
*   **Flask-CORS:** Handling Cross-Origin Resource Sharing for secure Client-Server communication.
*   **MongoDB & PyMongo:** NoSQL database system for storing JSON-like documents. 

---

## 🚀 Installation & Setup

### Prerequisites
*   Python 3.x installed
*   MongoDB installed and running locally on default port `27017` (or a MongoDB Atlas URI)

### Step-by-Step Guide

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dhananjayranate-25/Expert-FastFix-Home-Service-At-Your-Doorstep.git
   cd Expert-FastFix-Home-Service-At-Your-Doorstep
   ```

2. **Set up an isolated Python Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows
   # source venv/bin/activate    # On Mac/Linux
   ```

3. **Install required Python packages:**
   ```bash
   pip install Flask flask-cors pymongo
   ```

4. **Boot the Backend Server:**
   ```bash
   python app.py
   ```
   *The server will initialize the database with default services and start listening on `http://localhost:5000`.*

5. **Launch the Frontend:**
   * Because the frontend uses Vanilla JS and standard REST APIs, you do not need a Node server. Simply double-click `index.html` to open it in Chrome/Edge/Firefox, or serve it using a live server extension.

---

## 🔐 Default Credentials

The platform comes pre-configured with the following test credentials so you can explore all three portals immediately:

**1. Admin Login (`admin-login.html`)**
*   **Email:** `admin@fastfix.com`
*   **Password:** `admin`

**2. Employee Login (`employee-login.html`)**
*   **Email:** `employee@fastfix.com`
*   **Password:** `12345`

**3. Test Customer Login (`login.html`)**
*   **Email:** `testuser@gmail.com`
*   **Password:** `12345`

---

## 🔮 Future Roadmap / Next Steps
*   **Payment Gateway Integration:** Integrating Razorpay/Stripe for advance booking deposits.
*   **Push Notifications:** WebSocket integration to notify users the moment an employee accepts a job.
*   **AI Chatbot Integration:** LLM-powered assistant to help users diagnose home issues before booking.

---
*Architected and Developed to modernize the home service industry.*

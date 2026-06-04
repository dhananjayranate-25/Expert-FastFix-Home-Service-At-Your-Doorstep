# 🛠️ Expert FastFix - Home Service At Your Doorstep

Expert FastFix is a comprehensive, full-stack home service booking platform designed to connect customers with expert service professionals. It features a seamless, modern UI, multi-language support, automated PDF invoicing, and three distinct portals (Admin, Employee, and User) to manage the entire service lifecycle.

---

## ✨ Key Features

### 👤 User Portal
*   **Service Catalog:** Browse 40+ professional services with beautiful icons and descriptions.
*   **Booking System:** Easy-to-use booking interface with date selection and location details.
*   **Live Tracking:** Visual progress bar to track booking status (Pending ➡️ In Progress ➡️ Completed).
*   **Automated Invoicing:** Download professional A4-sized PDF invoices with proper GST calculations (CGST & SGST).
*   **Review System:** Rate and review services. (Invoice download is locked until a review is submitted!).
*   **Multi-Language Support:** Seamlessly translate the website to Marathi, Hindi, or English using Google Translate.

### 👷 Employee Portal
*   **Job Management:** View assigned tasks and new pending bookings.
*   **Status Updates:** Accept pending bookings and mark them as completed once the service is done.
*   **Employee Dashboard:** Clean UI to manage day-to-day tasks.

### 👑 Admin Portal
*   **Service Management:** Add, edit, or remove services from the catalog.
*   **User Management:** View all registered users and employees.
*   **Booking Oversight:** Complete visibility into all bookings, their statuses, and assigned employees.

---

## 💻 Tech Stack

*   **Frontend:** HTML5, Tailwind CSS (via CDN), Vanilla JavaScript, FontAwesome
*   **Backend:** Python, Flask, Flask-CORS
*   **Database:** MongoDB (PyMongo)
*   **Libraries & Tools:** 
    *   `html2pdf.js` for Client-side PDF generation
    *   Google Translate API for localization

---

## 🚀 Installation & Setup

### Prerequisites
*   Python 3.x
*   MongoDB (running locally or a MongoDB Atlas URI)

### Steps to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dhananjayranate-25/Expert-FastFix-Home-Service-At-Your-Doorstep.git
   cd Expert-FastFix-Home-Service-At-Your-Doorstep
   ```

2. **Set up a virtual environment:**
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows
   # source venv/bin/activate    # On Mac/Linux
   ```

3. **Install backend dependencies:**
   ```bash
   pip install Flask flask-cors pymongo
   ```

4. **Start the Flask Backend Server:**
   ```bash
   python app.py
   ```
   *The server will run on `http://localhost:5000`*

5. **Open the Frontend:**
   * Simply open `index.html` in your favorite web browser.

---

## 🔐 Default Credentials

You can use the following credentials to explore the different portals:

**1. Admin Login**
*   **Email:** `admin@fastfix.com`
*   **Password:** `admin`

**2. Employee Login**
*   **Email:** `employee@fastfix.com`
*   **Password:** `12345`

**3. Test User Login**
*   **Email:** `testuser@gmail.com`
*   **Password:** `12345`

---

## 📸 Project Highlights
*   **Optimized Performance:** Fast loading times with instant preloader functionality.
*   **Dynamic State Management:** Real-time data fetching using Flask APIs.
*   **Secure:** Status restrictions and logical locks (e.g., locking invoice downloads).

---
*Developed with ❤️ to make home services accessible and hassle-free.*

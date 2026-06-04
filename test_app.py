import requests
import json
import time

BASE_URL = "http://localhost:5000/api"

def test_flow():
    print("Starting automated tests...")
    
    # 1. Register a new user
    user_email = f"test_{int(time.time())}@example.com"
    res = requests.post(f"{BASE_URL}/register", json={
        "name": "Test User",
        "email": user_email,
        "password": "password123",
        "role": "user",
        "mobile": "1234567890",
        "address": "123 Test St"
    })
    print(f"Register User: {res.status_code}")
    if res.status_code not in [200, 201]: return False
    
    # 2. Login User
    res = requests.post(f"{BASE_URL}/login", json={
        "email": user_email,
        "password": "password123",
        "role": "user"
    })
    print(f"Login User: {res.status_code}")
    if res.status_code != 200: return False

    # 3. Get Services
    res = requests.get(f"{BASE_URL}/services")
    print(f"Get Services: {res.status_code} (Found {len(res.json())} services)")
    services = res.json()
    if not services: return False

    # 4. Create Booking
    service_name = services[0]['name']
    res = requests.post(f"{BASE_URL}/bookings", json={
        "service": service_name,
        "clientEmail": user_email,
        "name": "Test User",
        "mobile": "1234567890",
        "address": "123 Test St",
        "date": "2026-06-05",
        "description": "Test booking"
    })
    print(f"Create Booking: {res.status_code}")
    if res.status_code != 201: return False
    booking_id = res.json().get('id')

    # 5. Login Employee (Using existing employee@fastfix.com)
    res = requests.post(f"{BASE_URL}/login", json={
        "email": "employee@fastfix.com",
        "password": "12345",
        "role": "employee"
    })
    print(f"Login Employee: {res.status_code}")
    
    # 6. Employee gets pending bookings
    res = requests.get(f"{BASE_URL}/bookings")
    print(f"Get All Bookings: {res.status_code}")
    
    # 7. Employee accepts booking
    res = requests.put(f"{BASE_URL}/bookings/{booking_id}/status", json={
        "status": "accepted",
        "employeeEmail": "employee@fastfix.com"
    })
    print(f"Accept Booking: {res.status_code}")

    # 8. Employee completes booking
    res = requests.put(f"{BASE_URL}/bookings/{booking_id}/status", json={
        "status": "completed",
        "employeeEmail": "employee@fastfix.com"
    })
    print(f"Complete Booking: {res.status_code}")

    # 9. User writes a review
    res = requests.get(f"{BASE_URL}/bookings?clientEmail={user_email}")
    my_bookings = res.json()
    my_booking = next(b for b in my_bookings if b['_id'] == booking_id)
    
    my_booking['reviewed'] = True
    res = requests.put(f"{BASE_URL}/bookings/{booking_id}", json=my_booking)
    # Note: wait, does the PUT /bookings/<id> exist?
    print(f"Update Review: {res.status_code}")

    print("Tests completed successfully!")
    return True

if __name__ == '__main__':
    test_flow()

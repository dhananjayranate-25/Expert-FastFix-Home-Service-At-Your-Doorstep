from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# MongoDB Connection
client = MongoClient('mongodb://localhost:27017/')
db = client['homeservice']

# Collections
users_collection = db['users']
bookings_collection = db['bookings']
services_collection = db['services']

# Initialize some default services if the collection is empty
def init_db():
    # Drop existing services to inject the new 40 services
    if services_collection.count_documents({}) != 40:
        services_collection.delete_many({})
        default_services = [
            { "name": 'Deep Home Cleaning', "desc": 'Complete deep cleaning of your entire home.', "icon": 'fas fa-broom', "price": '₹2499', "duration": '4-6 hours' },
            { "name": 'Standard Cleaning', "desc": 'Regular cleaning for a tidy home.', "icon": 'fas fa-spray-can', "price": '₹999', "duration": '2-3 hours' },
            { "name": 'Bathroom Cleaning', "desc": 'Deep scrubbing and sanitization of bathrooms.', "icon": 'fas fa-bath', "price": '₹599', "duration": '1-2 hours' },
            { "name": 'Kitchen Cleaning', "desc": 'Degreasing and deep cleaning of kitchen.', "icon": 'fas fa-sink', "price": '₹799', "duration": '2-3 hours' },
            { "name": 'Sofa Cleaning', "desc": 'Dry and wet vacuuming of sofa sets.', "icon": 'fas fa-couch', "price": '₹699', "duration": '1-2 hours' },
            { "name": 'Carpet Cleaning', "desc": 'Deep shampooing of carpets.', "icon": 'fas fa-rug', "price": '₹499', "duration": '1-2 hours' },
            { "name": 'Water Tank Cleaning', "desc": 'Mechanized cleaning of overhead/underground tanks.', "icon": 'fas fa-water', "price": '₹899', "duration": '1-2 hours' },
            { "name": 'AC Servicing', "desc": 'General AC service and filter cleaning.', "icon": 'fas fa-snowflake', "price": '₹499', "duration": '1 hour' },
            { "name": 'AC Repair', "desc": 'Expert AC repair for all brands.', "icon": 'fas fa-tools', "price": '₹299', "duration": '1-2 hours' },
            { "name": 'AC Installation', "desc": 'Safe installation/uninstallation of AC.', "icon": 'fas fa-fan', "price": '₹999', "duration": '1-2 hours' },
            { "name": 'RO Water Purifier Repair', "desc": 'Filter change and repair for RO systems.', "icon": 'fas fa-faucet-drip', "price": '₹399', "duration": '1 hour' },
            { "name": 'Refrigerator Repair', "desc": 'Fix cooling and compressor issues.', "icon": 'fas fa-icicles', "price": '₹399', "duration": '1-2 hours' },
            { "name": 'Washing Machine Repair', "desc": 'Repair for top/front load washing machines.', "icon": 'fas fa-tshirt', "price": '₹399', "duration": '1-2 hours' },
            { "name": 'Microwave Repair', "desc": 'Fix heating and electrical issues.', "icon": 'fas fa-fire', "price": '₹299', "duration": '1 hour' },
            { "name": 'Geyser Repair', "desc": 'Water heater repair and installation.', "icon": 'fas fa-hot-tub', "price": '₹349', "duration": '1 hour' },
            { "name": 'TV Repair', "desc": 'LED/LCD TV repair and wall mounting.', "icon": 'fas fa-tv', "price": '₹499', "duration": '1-2 hours' },
            { "name": 'General Plumbing', "desc": 'Fix leaks, taps, and pipe issues.', "icon": 'fas fa-wrench', "price": '₹299', "duration": '1 hour' },
            { "name": 'Toilet Repair', "desc": 'Fix flush issues and blockages.', "icon": 'fas fa-toilet', "price": '₹399', "duration": '1-2 hours' },
            { "name": 'Washbasin Installation', "desc": 'Install or repair washbasins.', "icon": 'fas fa-sink', "price": '₹449', "duration": '1-2 hours' },
            { "name": 'Water Pump Repair', "desc": 'Fix motor and pumping issues.', "icon": 'fas fa-cogs', "price": '₹599', "duration": '1-2 hours' },
            { "name": 'General Electrical', "desc": 'Fix switches, wiring, and fuses.', "icon": 'fas fa-bolt', "price": '₹299', "duration": '1 hour' },
            { "name": 'Fan Repair', "desc": 'Ceiling/exhaust fan repair or replacement.', "icon": 'fas fa-fan', "price": '₹199', "duration": '1 hour' },
            { "name": 'Inverter Setup', "desc": 'Inverter and battery installation/repair.', "icon": 'fas fa-car-battery', "price": '₹499', "duration": '1-2 hours' },
            { "name": 'Lighting Installation', "desc": 'Install tube lights, bulbs, or fancy lights.', "icon": 'fas fa-lightbulb', "price": '₹199', "duration": '1 hour' },
            { "name": 'MCB/Fuse Repair', "desc": 'Fix tripping issues and replace MCBs.', "icon": 'fas fa-charging-station', "price": '₹299', "duration": '1 hour' },
            { "name": 'Carpentry Repairs', "desc": 'Fix doors, windows, and hinges.', "icon": 'fas fa-hammer', "price": '₹399', "duration": '1-2 hours' },
            { "name": 'Furniture Assembly', "desc": 'Assemble beds, wardrobes, or tables.', "icon": 'fas fa-couch', "price": '₹599', "duration": '2-3 hours' },
            { "name": 'Pest Control (General)', "desc": 'Cockroach and ant control.', "icon": 'fas fa-bug', "price": '₹899', "duration": '1-2 hours' },
            { "name": 'Termite Control', "desc": 'Long-lasting termite treatment.', "icon": 'fas fa-spider', "price": '₹1999', "duration": '2-4 hours' },
            { "name": 'Bedbug Treatment', "desc": 'Eradicate bedbugs completely.', "icon": 'fas fa-bed', "price": '₹1499', "duration": '2-3 hours' },
            { "name": 'Interior Painting', "desc": 'Wall painting for rooms.', "icon": 'fas fa-paint-roller', "price": '₹2999', "duration": '1-2 days' },
            { "name": 'Exterior Painting', "desc": 'Weatherproof exterior painting.', "icon": 'fas fa-paint-brush', "price": '₹4999', "duration": '2-4 days' },
            { "name": 'Waterproofing', "desc": 'Roof and wall waterproofing.', "icon": 'fas fa-umbrella', "price": '₹1999', "duration": '1-2 days' },
            { "name": 'Car Wash (At Home)', "desc": 'Exterior and interior car cleaning.', "icon": 'fas fa-car', "price": '₹499', "duration": '1 hour' },
            { "name": 'Bike Servicing', "desc": 'Basic service and oil change at home.', "icon": 'fas fa-motorcycle', "price": '₹399', "duration": '1 hour' },
            { "name": 'Salon for Women', "desc": 'Haircut, facial, and waxing at home.', "icon": 'fas fa-spa', "price": '₹999', "duration": '1-2 hours' },
            { "name": 'Massage for Men', "desc": 'Relaxing full body massage.', "icon": 'fas fa-hands-bubbles', "price": '₹899', "duration": '1 hour' },
            { "name": 'Massage for Women', "desc": 'Professional spa therapy at home.', "icon": 'fas fa-spa', "price": '₹899', "duration": '1 hour' },
            { "name": 'Gardening', "desc": 'Lawn mowing and plant care.', "icon": 'fas fa-leaf', "price": '₹599', "duration": '2-3 hours' },
            { "name": 'Packers & Movers', "desc": 'Local home shifting services.', "icon": 'fas fa-truck-moving', "price": '₹3499', "duration": '4-6 hours' }
        ]
        services_collection.insert_many(default_services)
        
    if users_collection.count_documents({"role": "admin"}) == 0:
        hashed_password = bcrypt.hashpw('admin'.encode('utf-8'), bcrypt.gensalt())
        users_collection.insert_one({
            "email": "admin@fastfix.com",
            "password": hashed_password.decode('utf-8'),
            "role": "admin",
            "name": "Super Admin",
            "mobile": "0000000000",
            "created_at": datetime.datetime.utcnow()
        })

init_db()

# Helper to format MongoDB document (ObjectId to string)
def format_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user') # 'user', 'employee', or 'admin'
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
        
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400
        
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    user = {
        "email": email,
        "password": hashed_password.decode('utf-8'),
        "role": role,
        "name": data.get('name', ''),
        "mobile": data.get('mobile', ''),
        "created_at": datetime.datetime.utcnow()
    }
    
    users_collection.insert_one(user)
    return jsonify({"message": "Registration successful"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role_requested = data.get('role', 'user')
    
    user = users_collection.find_one({"email": email})
    
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
        
    if user.get('role') != role_requested and user.get('role') != 'admin':
        return jsonify({"error": "Invalid role"}), 403
        
    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        user_data = format_doc(user)
        del user_data['password']
        return jsonify({
            "message": "Login successful",
            "user": user_data
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/api/services', methods=['GET'])
def get_services():
    services = list(services_collection.find())
    for s in services:
        s['_id'] = str(s['_id'])
        if 'detailedDesc' not in s:
            s['detailedDesc'] = f"Experience top-notch {s.get('name', 'service')} with our certified professionals. We ensure a thorough and complete job with 100% satisfaction guaranteed."
        if 'features' not in s:
            s['features'] = [
                "Certified and Experienced Professionals",
                "Transparent Pricing with No Hidden Charges",
                "100% Satisfaction Guarantee",
                "Use of High-Quality Materials and Tools"
            ]
        if 'image' not in s:
            s['image'] = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'
    return jsonify(services), 200

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.json
    
    booking = {
        "service": data.get('service'),
        "clientEmail": data.get('clientEmail'),
        "name": data.get('name'),
        "mobile": data.get('mobile'),
        "address": data.get('address'),
        "date": data.get('date'),
        "description": data.get('description', ''),
        "status": "pending", # pending, accepted, completed
        "employeeEmail": None,
        "bookingDate": datetime.datetime.utcnow()
    }
    
    result = bookings_collection.insert_one(booking)
    return jsonify({"message": "Booking created", "id": str(result.inserted_id)}), 201

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    client_email = request.args.get('clientEmail')
    employee_email = request.args.get('employeeEmail')
    
    query = {}
    if client_email:
        query['clientEmail'] = client_email
    if employee_email:
        query['employeeEmail'] = employee_email
        
    bookings = list(bookings_collection.find(query).sort("bookingDate", -1))
    for b in bookings:
        format_doc(b)
    return jsonify(bookings), 200

@app.route('/api/bookings/<booking_id>/status', methods=['PUT'])
def update_booking_status(booking_id):
    data = request.json
    new_status = data.get('status')
    employee_email = data.get('employeeEmail')
    
    update_data = {"status": new_status}
    if employee_email and new_status == 'accepted':
        update_data["employeeEmail"] = employee_email
        
    result = bookings_collection.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": update_data}
    )
    
    if result.modified_count > 0:
        return jsonify({"message": "Status updated successfully"}), 200
    return jsonify({"error": "Booking not found or no changes made"}), 404

@app.route('/api/bookings/<booking_id>', methods=['PUT'])
def update_booking(booking_id):
    data = request.json
    
    # Exclude _id to prevent modification of immutable field
    if '_id' in data:
        del data['_id']
        
    result = bookings_collection.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": data}
    )
    
    if result.modified_count > 0 or result.matched_count > 0:
        return jsonify({"message": "Booking updated successfully"}), 200
    return jsonify({"error": "Booking not found"}), 404

@app.route('/api/users', methods=['GET'])
def get_users():
    role = request.args.get('role', 'user')
    users = list(users_collection.find({"role": role}, {"password": 0}))
    for u in users:
        format_doc(u)
    return jsonify(users), 200

@app.route('/api/users/<email>', methods=['DELETE'])
def delete_user(email):
    result = users_collection.delete_one({"email": email})
    if result.deleted_count > 0:
        # Also delete associated bookings or mark as deleted
        bookings_collection.update_many({"clientEmail": email}, {"$set": {"isAccountDeleted": True}})
        return jsonify({"message": "User deleted successfully"}), 200
    return jsonify({"error": "User not found"}), 404

@app.route('/api/services', methods=['POST'])
def add_service():
    data = request.json
    service = {
        "name": data.get('name'),
        "desc": data.get('desc'),
        "icon": "fas fa-wrench" # Default icon
    }
    result = services_collection.insert_one(service)
    return jsonify({"message": "Service added", "id": str(result.inserted_id)}), 201

@app.route('/api/services/<service_id>', methods=['PUT'])
def update_service(service_id):
    data = request.json
    update_fields = {}
    
    for field in ['name', 'desc', 'detailedDesc', 'price', 'duration', 'image']:
        if field in data:
            update_fields[field] = data[field]
            
    if 'features' in data:
        update_fields['features'] = data['features']
        
    result = services_collection.update_one(
        {"_id": ObjectId(service_id)},
        {"$set": update_fields}
    )
    if result.modified_count > 0 or result.matched_count > 0:
        return jsonify({"message": "Service updated successfully"}), 200
    return jsonify({"error": "Service not found"}), 404

@app.route('/api/services/<service_id>', methods=['DELETE'])
def delete_service(service_id):
    result = services_collection.delete_one({"_id": ObjectId(service_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Service deleted successfully"}), 200
    return jsonify({"error": "Service not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)

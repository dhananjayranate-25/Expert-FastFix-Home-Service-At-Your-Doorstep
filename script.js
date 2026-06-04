const services = [
    { name: 'Cleaning', desc: 'Professional cleaning services.', icon: 'fas fa-broom' },
    { name: 'Plumbing', desc: 'Expert plumbing repairs.', icon: 'fas fa-wrench' },
    { name: 'Electrical', desc: 'Safe electrical services.', icon: 'fas fa-bolt' },
    { name: 'Gardening', desc: 'Lawn and garden care.', icon: 'fas fa-leaf' },
    { name: 'Painting', desc: 'Interior and exterior painting.', icon: 'fas fa-paint-roller' },
    { name: 'Carpentry', desc: 'Custom woodwork.', icon: 'fas fa-hammer' },
    { name: 'HVAC', desc: 'Heating and cooling.', icon: 'fas fa-snowflake' },
    { name: 'Roofing', desc: 'Roof repairs.', icon: 'fas fa-home' },
    { name: 'Flooring', desc: 'Floor installation.', icon: 'fas fa-th-large' },
    { name: 'Appliance Repair', desc: 'Fix household appliances.', icon: 'fas fa-tools' },
    { name: 'Pest Control', desc: 'Pest management.', icon: 'fas fa-bug' },
    { name: 'Window Cleaning', desc: 'Clean windows.', icon: 'fas fa-window-maximize' },
    { name: 'Landscaping', desc: 'Outdoor landscaping.', icon: 'fas fa-tree' },
    { name: 'Home Security', desc: 'Security systems.', icon: 'fas fa-shield-alt' },
    { name: 'Insulation', desc: 'Energy insulation.', icon: 'fas fa-thermometer-half' },
    { name: 'Drywall', desc: 'Drywall work.', icon: 'fas fa-wall' },
    { name: 'Tile Installation', desc: 'Tile laying.', icon: 'fas fa-th' },
    { name: 'Deck Building', desc: 'Deck construction.', icon: 'fas fa-couch' },
    { name: 'Fence Installation', desc: 'Fence building.', icon: 'fas fa-fence' },
    { name: 'Pool Maintenance', desc: 'Pool upkeep.', icon: 'fas fa-swimming-pool' }
];

function scrollToAbout() {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}

function scrollToServices() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

function loadServices() {
    const container = document.getElementById('services-grid');
    const isLoggedIn = localStorage.getItem('clientLoggedIn') === 'true';

    container.innerHTML = services.map(service => `
                <div class="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 service-card service-grid-card">
            <div class="text-center mb-3">
                <div class="text-3xl text-blue-600 mb-2">
                    <i class="${service.icon}"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">${service.name}</h3>
                <p class="text-sm text-gray-600">${service.desc}</p>
            </div>
            ${isLoggedIn ? `<button onclick="bookService('${service.name}')" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition text-sm">Book Now</button>` : '<p class="text-xs text-gray-500 text-center">Login to book this service</p>'}
        </div>
    `).join('');
}

function bookService(serviceName) {
    if (!localStorage.getItem('clientLoggedIn')) {
        alert('Please login first to book a service.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('booking-service-name').value = serviceName;
    document.getElementById('booking-modal').classList.remove('hidden');

    // Auto-fill client details if available
    const clientEmail = localStorage.getItem('clientEmail');
    if (clientEmail) {
        // Try to get client details from localStorage
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const client = clients.find(c => c.email === clientEmail);
        if (client) {
            document.getElementById('booking-name').value = client.name || '';
            document.getElementById('booking-mobile').value = client.mobile || '';
            document.getElementById('booking-address').value = client.address || '';
        }
    }
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    document.getElementById('booking-form').reset();
}

document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const serviceName = document.getElementById('booking-service-name').value;
    const name = document.getElementById('booking-name').value;
    const mobile = document.getElementById('booking-mobile').value;
    const description = document.getElementById('booking-description').value;
    const date = document.getElementById('booking-date').value;
    const address = document.getElementById('booking-address').value;

    // Store booking with all details
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = {
        service: serviceName,
        clientEmail: localStorage.getItem('clientEmail'),
        name: name,
        mobile: mobile,
        description: description,
        date: date,
        address: address,
        status: 'pending',
        bookingDate: new Date().toISOString()
    };
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert('Booking submitted successfully! We will contact you soon.');
    closeBookingModal();
});

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    updateNavbar();

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

function updateNavbar() {
    const isLoggedIn = localStorage.getItem('clientLoggedIn') === 'true';
    const userInfo = document.getElementById('user-info');
    const mobileUserInfo = document.getElementById('mobile-user-info');

    if (isLoggedIn) {
        const name = localStorage.getItem('clientName') || 'User';
        userInfo.innerHTML = `
            <span>Welcome, ${name}</span>
            <button onclick="logout()" class="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition">Logout</button>
        `;
        mobileUserInfo.innerHTML = `
            <span>Welcome, ${name}</span>
            <button onclick="logout()" class="block w-full mt-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition">Logout</button>
        `;
    } else {
        userInfo.innerHTML = '<a href="login.html" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">Login/Signup</a>';
        mobileUserInfo.innerHTML = '<a href="login.html" class="block py-2 bg-blue-600 text-white text-center rounded mt-2">Login/Signup</a>';
    }
}

function logout() {
    localStorage.removeItem('clientLoggedIn');
    localStorage.removeItem('clientEmail');
    localStorage.removeItem('clientName');
    updateNavbar();
    loadServices(); // To update the service buttons
}
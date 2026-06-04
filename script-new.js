let services = [];
let currentPage = 1;
const itemsPerPage = 8;
let searchQuery = "";
async function fetchServices() {
    try {
        const response = await fetch('http://localhost:5000/api/services');
        services = await response.json();
        loadServices();
    } catch (error) {
        console.error('Error fetching services:', error);
    }
}

function scrollToAbout() {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}

function scrollToServices() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

function showServiceDetails(index) {
    const service = services[index];
    const isLoggedIn = localStorage.getItem('clientLoggedIn') === 'true';
    const isEmployee = localStorage.getItem('employeeLoggedIn') === 'true';

    // Create modal HTML
    const modalHTML = `
        <div id="service-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="relative">
                    <!-- Header with image -->
                    <div class="relative h-64 md:h-80">
                        <img src="${service.image}" alt="${service.name}" class="w-full h-full object-cover rounded-t-2xl">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl"></div>
                        <button onclick="closeServiceModal()" class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="absolute bottom-6 left-6 text-white">
                            <div class="flex items-center mb-2">
                                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                                    <i class="${service.icon} text-xl"></i>
                                </div>
                                <h2 class="text-3xl font-bold">${service.name}</h2>
                            </div>
                            <div class="flex items-center space-x-4 text-sm">
                                <span class="bg-green-500 px-3 py-1 rounded-full font-semibold">${service.price}</span>
                                <span class="bg-blue-500 px-3 py-1 rounded-full font-semibold">${service.duration}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-8">
                        <!-- Description -->
                        <div class="mb-8">
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">Service Overview</h3>
                            <p class="text-gray-600 text-lg leading-relaxed">${service.detailedDesc}</p>
                        </div>

                        <!-- Features -->
                        <div class="mb-8">
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">What's Included</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                ${service.features.map(feature => `
                                    <div class="flex items-center bg-blue-50 p-3 rounded-lg">
                                        <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                        <span class="text-gray-700">${feature}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Pricing Info -->
                        <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8">
                            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h4 class="text-xl font-bold text-gray-900 mb-2">Service Pricing</h4>
                                    <p class="text-gray-600">Starting from ${service.price} • ${service.duration}</p>
                                </div>
                                ${isEmployee ? `
                                    <div class="bg-green-100 px-6 py-3 rounded-lg mt-4 md:mt-0">
                                        <span class="text-green-700 font-semibold"><i class="fas fa-user-tie mr-2"></i>Employee Mode Active</span>
                                    </div>
                                ` : (isLoggedIn ? `
                                    <button onclick="handleBookService('${service.name}')" class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg transform hover:scale-105 mt-4 md:mt-0">
                                        <i class="fas fa-calendar-check mr-2"></i>Book This Service
                                    </button>
                                ` : `
                                    <button onclick="window.location.href='login.html'" class="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg transform hover:scale-105 mt-4 md:mt-0">
                                        <i class="fas fa-sign-in-alt mr-2"></i>Login to Book
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Why Choose Us -->
                        <div class="border-t pt-8">
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">Why Choose FastFix?</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <i class="fas fa-user-check text-blue-600 text-2xl"></i>
                                    </div>
                                    <h4 class="font-semibold text-gray-900 mb-2">Certified Professionals</h4>
                                    <p class="text-gray-600 text-sm">All our technicians are licensed and experienced</p>
                                </div>
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <i class="fas fa-shield-alt text-green-600 text-2xl"></i>
                                    </div>
                                    <h4 class="font-semibold text-gray-900 mb-2">Quality Guarantee</h4>
                                    <p class="text-gray-600 text-sm">100% satisfaction guarantee on all services</p>
                                </div>
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <i class="fas fa-clock text-purple-600 text-2xl"></i>
                                    </div>
                                    <h4 class="font-semibold text-gray-900 mb-2">Quick Response</h4>
                                    <p class="text-gray-600 text-sm">Fast booking and prompt service delivery</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    const modal = document.getElementById('service-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function loadServices() {
    const container = document.getElementById('services-grid');
    if (!container) return; // If on another page

    const isLoggedIn = localStorage.getItem('clientLoggedIn') === 'true';
    const isEmployee = localStorage.getItem('employeeLoggedIn') === 'true';

    // 1. Filter by search query
    const filteredServices = services.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2. Calculate pagination
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

    if (paginatedServices.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500 text-lg">No services found for "${searchQuery}".</div>`;
    } else {
        container.innerHTML = paginatedServices.map((service, index) => {
            // Find original index for showServiceDetails
            const originalIndex = services.findIndex(s => s.name === service.name);
            return `
            <div class="service-item bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 service-card cursor-pointer transform hover:scale-105" onclick="showServiceDetails(${originalIndex})">
                <div class="text-center mb-4">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="${service.icon} text-2xl text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${service.name}</h3>
                    <p class="text-gray-600 text-sm mb-3">${service.desc}</p>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-green-600 font-semibold">${service.price}</span>
                        <span class="text-gray-500">${service.duration}</span>
                    </div>
                </div>
                ${isEmployee ? '<p class="text-xs text-blue-600 text-center bg-blue-50 py-2 rounded-lg font-medium"><i class="fas fa-user-tie mr-1"></i>Employee View</p>' : (isLoggedIn ? `<button onclick="event.stopPropagation(); bookService('${service.name}')" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition text-sm shadow-md">Book Now</button>` : '<button onclick="event.stopPropagation(); window.location.href=\'login.html\'" class="w-full text-xs text-gray-600 text-center bg-gray-100 hover:bg-gray-200 py-3 rounded-lg transition shadow-sm border border-gray-200">Login to book this service</button>')}
            </div>
        `}).join('');
    }

    // 3. Update Pagination UI
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
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
    const clientName = localStorage.getItem('clientName');
    const clientMobile = localStorage.getItem('clientMobile');
    
    if (clientEmail) {
        document.getElementById('booking-name').value = clientName || '';
        document.getElementById('booking-mobile').value = clientMobile || '';
    }
}

function handleBookService(serviceName) {
    // Remove service modal directly using vanilla JS
    var modal = document.getElementById('service-modal');
    if (modal) {
        modal.parentNode.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
    // Open booking modal after a brief delay
    window.setTimeout(function() {
        bookService(serviceName);
    }, 100);
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    document.getElementById('booking-form').reset();
}

function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const serviceName = document.getElementById('booking-service-name').value;
            const name = document.getElementById('booking-name').value;
            const mobile = document.getElementById('booking-mobile').value;
            const description = document.getElementById('booking-description').value;
            const date = document.getElementById('booking-date').value;
            const address = document.getElementById('booking-address').value;

            const bookingData = {
                service: serviceName,
                clientEmail: localStorage.getItem('clientEmail'),
                name: name,
                mobile: mobile,
                description: description,
                date: date,
                address: address
            };

            // Store in sessionStorage to process after payment
            sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
            
            // Redirect to payment page
            window.location.href = 'payment.html';
        });
    }
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchServices(); // Load services from DB
    updateNavbar();

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Search and Pagination Listeners
    const searchInput = document.getElementById('service-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchQuery = e.target.value;
            currentPage = 1; // Reset to first page when searching
            loadServices();
        });
    }

    const prevBtn = document.getElementById('prev-page');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadServices();
            }
        });
    }

    const nextBtn = document.getElementById('next-page');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentPage++;
            loadServices();
        });
    }
});

function updateNavbar() {
    const isLoggedIn = localStorage.getItem('clientLoggedIn') === 'true';
    const userInfo = document.getElementById('user-info');
    const mobileUserInfo = document.getElementById('mobile-user-info');

    if (isLoggedIn) {
        const name = localStorage.getItem('clientName') || 'User';
        if (userInfo) {
            userInfo.innerHTML = `
                <span>Welcome, ${name}</span>
                <a href="user-dashboard.html" class="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition text-sm">
                    <i class="fas fa-user mr-1"></i>My Account
                </a>
                <button onclick="logout()" class="ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition">Logout</button>
            `;
        }
        if (mobileUserInfo) {
            mobileUserInfo.innerHTML = `
                <span>Welcome, ${name}</span>
                <a href="user-dashboard.html" class="block w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition text-sm text-center">
                    <i class="fas fa-user mr-1"></i>My Account
                </a>
                <button onclick="logout()" class="block w-full mt-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition">Logout</button>
            `;
        }
    } else {
        if (userInfo) {
            userInfo.innerHTML = `
                <a href="login.html" class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    <i class="fas fa-sign-in-alt mr-2"></i>Login
                </a>
            `;
        }
        if (mobileUserInfo) {
            mobileUserInfo.innerHTML = `
                <a href="login.html" class="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg text-center font-medium">Login</a>
            `;
        }
    }
}

function logout() {
    localStorage.removeItem('clientLoggedIn');
    localStorage.removeItem('clientEmail');
    localStorage.removeItem('clientName');
    updateNavbar();
    loadServices();
    // Initialize immediately 
    fetchServices();
}

function showChangePasswordModal() {
    document.getElementById('change-password-modal').classList.remove('hidden');
}

function closeChangePasswordModal() {
    document.getElementById('change-password-modal').classList.add('hidden');
    document.getElementById('change-password-form').reset();
}

function initChangePasswordForm() {
    const form = document.getElementById('change-password-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const clientEmail = localStorage.getItem('clientEmail');

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match!');
                return;
            }

            if (newPassword.length < 4) {
                alert('Password must be at least 4 characters!');
                return;
            }

            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            const clientIndex = clients.findIndex(c => c.email === clientEmail);

            if (clientIndex === -1) {
                alert('Client not found!');
                return;
            }

            if (clients[clientIndex].password !== currentPassword) {
                alert('Current password is incorrect!');
                return;
            }

            clients[clientIndex].password = newPassword;
            localStorage.setItem('clients', JSON.stringify(clients));

            alert('Password changed successfully!');
            closeChangePasswordModal();
        });
    }
}

/* Chatbot Functions */
function toggleChatbot() {
    const container = document.getElementById('chatbot-container');
    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    if (!container || !toggleBtn) return;
    
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        setTimeout(() => {
            container.classList.remove('scale-95', 'opacity-0');
            container.classList.add('scale-100', 'opacity-100');
        }, 10);
        toggleBtn.classList.add('hidden');
        document.getElementById('chatbot-input').focus();
    } else {
        container.classList.remove('scale-100', 'opacity-100');
        container.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            container.classList.add('hidden');
            toggleBtn.classList.remove('hidden');
        }, 300);
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const inputField = document.getElementById('chatbot-input');
    const body = document.getElementById('chatbot-body');
    const userMsg = inputField.value.trim();
    if (!userMsg) return;

    // Add user message to UI
    body.innerHTML += `<div class="bg-blue-600 text-white self-end px-4 py-2 rounded-lg rounded-tr-none max-w-[80%] shadow-sm mt-2">${userMsg}</div>`;
    inputField.value = '';
    body.scrollTop = body.scrollHeight;

    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    body.innerHTML += `<div id="${typingId}" class="bg-gray-200 text-gray-500 self-start px-4 py-2 rounded-lg rounded-tl-none max-w-[80%] shadow-sm text-xs mt-2"><i class="fas fa-circle-notch fa-spin"></i> Typing...</div>`;
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
        const typingEl = document.getElementById(typingId);
        if(typingEl) typingEl.remove();

        const msgLower = userMsg.toLowerCase();
        let replyMsg = "I'm sorry, I didn't understand that. Could you try asking about 'AC', 'Cleaning', 'Plumber', or 'Painting'?";

        // Logic based matching
        if(msgLower.includes('ac')) {
            replyMsg = `We offer great AC Repair and Servicing starting at just ₹499. <br><a href="#services" onclick="toggleChatbot();" class="text-blue-600 underline font-semibold mt-1 inline-block">View AC Services</a>`;
        } else if(msgLower.includes('clean')) {
            replyMsg = `Our Deep Cleaning services will make your home shine! <br><a href="#services" onclick="toggleChatbot();" class="text-blue-600 underline font-semibold mt-1 inline-block">View Cleaning Services</a>`;
        } else if(msgLower.includes('plumb')) {
            replyMsg = `Facing a leakage? Book our professional plumbers now. <br><a href="#services" onclick="toggleChatbot();" class="text-blue-600 underline font-semibold mt-1 inline-block">View Plumbing</a>`;
        } else if(msgLower.includes('paint')) {
            replyMsg = `Give your home a new look with our Wall Painting service! <br><a href="#services" onclick="toggleChatbot();" class="text-blue-600 underline font-semibold mt-1 inline-block">View Painting</a>`;
        } else if(msgLower.includes('hello') || msgLower.includes('hi')) {
            replyMsg = "Hello! Welcome to FastFix. Which home service are you looking for today?";
        }

        body.innerHTML += `<div class="bg-blue-100 text-blue-900 self-start px-4 py-2 rounded-lg rounded-tl-none max-w-[80%] shadow-sm mt-2">${replyMsg}</div>`;
        body.scrollTop = body.scrollHeight;
    }, 800);
}
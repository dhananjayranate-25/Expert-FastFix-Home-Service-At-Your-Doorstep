if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
}

let employees = [];
let services = [];
let bookings = [];
let clients = [];
let chartInstance = null;

// Navigation handling
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('#content-sections > section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1) + '-section';

            sections.forEach(section => section.classList.add('hidden'));

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }

            navLinks.forEach(l => l.classList.remove('bg-white', 'bg-opacity-20'));
            this.classList.add('bg-white', 'bg-opacity-20');
        });
    });

    document.getElementById('overview-section').classList.remove('hidden');
    document.querySelector('a[href="#overview"]').classList.add('bg-white', 'bg-opacity-20');

    fetchAllData();
});

async function fetchAllData() {
    try {
        const [empRes, svcRes, bookRes, userRes] = await Promise.all([
            fetch('http://localhost:5000/api/users?role=employee'),
            fetch('http://localhost:5000/api/services'),
            fetch('http://localhost:5000/api/bookings'),
            fetch('http://localhost:5000/api/users?role=user')
        ]);
        employees = await empRes.json();
        services = await svcRes.json();
        bookings = await bookRes.json();
        clients = await userRes.json();
        
        updateStats();
        renderUsers();
        renderEmployees();
        renderServices();
        renderAssignments();
        renderBookings();
        updateSelects();
        populateEmployeeServiceSelect();
        renderChart();
    } catch(err) {
        console.error(err);
        showNotification('Error loading data', 'error');
    }
}

function updateStats() {
    const statsCards = document.getElementById('stats-cards');
    const totalRevenue = bookings.filter(b => b.status === 'completed').length * 500; 
    const activeBookings = bookings.filter(b => b.status !== 'completed').length;
    const totalEmployees = employees.length;

    statsCards.innerHTML = `
        <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-blue-100 text-sm font-medium">Total Revenue</p>
                    <p class="text-3xl font-bold">₹${totalRevenue.toLocaleString()}</p>
                </div>
                <i class="fas fa-rupee-sign text-4xl opacity-80"></i>
            </div>
        </div>
        <div class="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-green-100 text-sm font-medium">Active Bookings</p>
                    <p class="text-3xl font-bold">${activeBookings}</p>
                </div>
                <i class="fas fa-calendar-check text-4xl opacity-80"></i>
            </div>
        </div>
        <div class="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-purple-100 text-sm font-medium">Total Users</p>
                    <p class="text-3xl font-bold">${clients.length}</p>
                </div>
                <i class="fas fa-users text-4xl opacity-80"></i>
            </div>
        </div>
        <div class="stat-card bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-orange-100 text-sm font-medium">Total Employees</p>
                    <p class="text-3xl font-bold">${totalEmployees}</p>
                </div>
                <i class="fas fa-user-tie text-4xl opacity-80"></i>
            </div>
        </div>
    `;

    document.getElementById('total-revenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    document.getElementById('active-bookings').textContent = activeBookings;
    document.getElementById('total-users').textContent = clients.length;
}

function renderChart() {
    const canvas = document.getElementById('bookingsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const serviceCounts = {};
    bookings.forEach(b => {
        serviceCounts[b.service] = (serviceCounts[b.service] || 0) + 1;
    });

    const labels = Object.keys(serviceCounts);
    const data = Object.values(serviceCounts);

    if(chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length ? labels : ['No Data'],
            datasets: [{
                label: 'Bookings by Service',
                data: data.length ? data : [0],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function renderUsers() {
    const tbody = document.getElementById('users-table-body');
    const noUsersDiv = document.getElementById('no-users');
    
    if (clients.length === 0) {
        tbody.innerHTML = '';
        noUsersDiv.classList.remove('hidden');
        return;
    }
    
    noUsersDiv.classList.add('hidden');
    
    tbody.innerHTML = clients.map((client, index) => {
        const userBookings = bookings.filter(b => b.clientEmail === client.email);
        const completedBookings = userBookings.filter(b => b.status === 'completed').length;
        const activeBookings = userBookings.filter(b => b.status !== 'completed').length;
        
        return `
        <tr class="border-b border-gray-100 hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-600">${index + 1}</td>
            <td class="px-4 py-3">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <i class="fas fa-user text-blue-600 text-sm"></i>
                    </div>
                    <span class="font-medium text-gray-800">${client.name || 'N/A'}</span>
                </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">${client.email}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${client.mobile || 'N/A'}</td>
            <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">${client.address || 'N/A'}</td>
            <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                    <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">${userBookings.length} Total</span>
                    <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">${completedBookings} Done</span>
                    <span class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">${activeBookings} Active</span>
                </div>
            </td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
            </td>
            <td class="px-4 py-3">
                <button onclick="viewUserBookings('${client.email}')" class="text-blue-600 hover:text-blue-800 text-sm mr-2" title="View Bookings">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="deleteUser('${client.email}')" class="text-red-600 hover:text-red-800 text-sm" title="Delete User">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
        `;
    }).join('');
}

function viewUserBookings(email) {
    const userBookings = bookings.filter(b => b.clientEmail === email);
    const client = clients.find(c => c.email === email);
    const clientName = client ? client.name : 'Unknown';
    
    let message = `User: ${clientName}\nEmail: ${email}\n\nBookings:\n`;
    userBookings.forEach((b, i) => {
        message += `\n${i + 1}. ${b.service} - ${b.status || 'pending'} (${new Date(b.date).toLocaleDateString()})`;
    });
    
    if (userBookings.length === 0) {
        message = `User: ${clientName}\nEmail: ${email}\n\nNo bookings found.`;
    }
    
    alert(message);
}

async function deleteUser(email) {
    if (!confirm('Are you sure you want to delete this user? All their bookings will also be marked as deleted.')) return;
    
    try {
        const response = await fetch(`http://localhost:5000/api/users/${email}`, { method: 'DELETE' });
        if (response.ok) {
            showNotification('User deleted successfully!', 'success');
            fetchAllData();
        } else {
            showNotification('Failed to delete user', 'error');
        }
    } catch(err) {
        console.error(err);
    }
}

function renderEmployees() {
    const list = document.getElementById('employee-list');
    if (employees.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">No employees added yet.</p>';
        return;
    }
    list.innerHTML = employees.map((emp) => `
        <div class="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <i class="fas fa-user-circle text-green-600 text-2xl mr-3"></i>
                    <div>
                        <h4 class="font-semibold text-gray-800">${emp.name}</h4>
                        <p class="text-sm text-gray-600">${emp.email}</p>
                        <p class="text-xs text-blue-600 font-medium mt-1"><i class="fas fa-tools mr-1"></i>${emp.service || 'All Services'}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="removeEmployee('${emp.email}')" class="text-red-500 hover:text-red-700 transition" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function removeEmployee(email) {
    if (confirm('Are you sure you want to remove this employee?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${email}`, { method: 'DELETE' });
            if (response.ok) {
                showNotification('Employee removed successfully!', 'success');
                fetchAllData();
            } else {
                showNotification('Failed to remove employee', 'error');
            }
        } catch(err) {
            console.error(err);
        }
    }
}

function renderServices() {
    const list = document.getElementById('service-list');
    if (services.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">No services added yet.</p>';
        return;
    }
    list.innerHTML = services.map((svc) => `
        <div class="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div class="flex justify-between items-start">
                <div class="flex items-start">
                    <i class="${svc.icon || 'fas fa-wrench'} text-orange-600 text-2xl mr-3 mt-1"></i>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800">${svc.name}</h4>
                        <p class="text-sm text-gray-600 mt-1">${svc.desc}</p>
                        <p class="text-xs text-gray-500 mt-1"><strong>Price:</strong> ${svc.price || 'N/A'} | <strong>Duration:</strong> ${svc.duration || 'N/A'}</p>
                    </div>
                </div>
                <div class="flex ml-4">
                    <button onclick='openEditServiceModal(${JSON.stringify(svc).replace(/'/g, "&#39;")})' class="text-blue-500 hover:text-blue-700 transition mr-3" title="Edit Service">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="removeService('${svc._id}')" class="text-red-500 hover:text-red-700 transition" title="Delete Service">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function removeService(id) {
    if (confirm('Are you sure you want to remove this service?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/services/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showNotification('Service removed successfully!', 'success');
                fetchAllData();
            } else {
                showNotification('Failed to remove service', 'error');
            }
        } catch(err) {
            console.error(err);
        }
    }
}

document.getElementById('add-service-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('add-svc-name').value;
    const price = document.getElementById('add-svc-price').value;
    const duration = document.getElementById('add-svc-duration').value;
    const featuresStr = document.getElementById('add-svc-features').value;
    const desc = document.getElementById('add-svc-desc').value;
    const detailedDesc = document.getElementById('add-svc-detailed-desc').value;

    const features = featuresStr.split(',').map(f => f.trim()).filter(f => f);

    try {
        const response = await fetch('http://localhost:5000/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name, desc, price, duration, detailedDesc, features,
                image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
                icon: 'fas fa-tools'
            })
        });
        if (response.ok) {
            showNotification('Service added successfully!', 'success');
            this.reset();
            fetchAllData();
        }
    } catch(err) {
        console.error(err);
    }
});

// Edit Service Logic
function openEditServiceModal(svc) {
    document.getElementById('edit-svc-id').value = svc._id;
    document.getElementById('edit-svc-name').value = svc.name || '';
    document.getElementById('edit-svc-price').value = svc.price || '';
    document.getElementById('edit-svc-duration').value = svc.duration || '';
    document.getElementById('edit-svc-features').value = (svc.features || []).join(', ');
    document.getElementById('edit-svc-desc').value = svc.desc || '';
    document.getElementById('edit-svc-detailed-desc').value = svc.detailedDesc || '';
    
    document.getElementById('edit-service-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeEditServiceModal() {
    document.getElementById('edit-service-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

document.getElementById('edit-service-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('edit-svc-id').value;
    const name = document.getElementById('edit-svc-name').value;
    const price = document.getElementById('edit-svc-price').value;
    const duration = document.getElementById('edit-svc-duration').value;
    const featuresStr = document.getElementById('edit-svc-features').value;
    const desc = document.getElementById('edit-svc-desc').value;
    const detailedDesc = document.getElementById('edit-svc-detailed-desc').value;

    const features = featuresStr.split(',').map(f => f.trim()).filter(f => f);

    try {
        const response = await fetch(`http://localhost:5000/api/services/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, desc, price, duration, detailedDesc, features })
        });
        if (response.ok) {
            showNotification('Service updated successfully!', 'success');
            closeEditServiceModal();
            fetchAllData();
        } else {
            showNotification('Failed to update service', 'error');
        }
    } catch(err) {
        console.error(err);
        showNotification('Error updating service', 'error');
    }
});


document.getElementById('add-employee-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('emp-name').value;
    const email = document.getElementById('emp-email').value;
    const password = document.getElementById('emp-password').value;
    const service = document.getElementById('emp-service').value;
    
    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, service, role: 'employee' })
        });
        if (response.ok) {
            showNotification('Employee added successfully!', 'success');
            this.reset();
            fetchAllData();
        } else {
            const err = await response.json();
            showNotification(err.error || 'Failed to add employee', 'error');
        }
    } catch(err) {
        console.error(err);
    }
});

function renderAssignments() {
    const list = document.getElementById('assignment-list');
    const assignedBookings = bookings.filter(b => b.employeeEmail);
    if (assignedBookings.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">No assignments yet.</p>';
        return;
    }
    
    list.innerHTML = assignedBookings.map((ass) => {
        const isDeleted = ass.isAccountDeleted;
        const emp = employees.find(e => e.email === ass.employeeEmail);
        const empName = emp ? emp.name : ass.employeeEmail;

        return `
        <div class="bg-gradient-to-r ${isDeleted ? 'from-red-50 to-red-100' : 'from-purple-50 to-purple-100'} p-4 rounded-lg border ${isDeleted ? 'border-red-300' : 'border-purple-200'}">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center mb-2">
                        <i class="fas fa-user-check text-purple-600 text-xl mr-2"></i>
                        <h4 class="font-semibold text-gray-800">${empName} → ${ass.service}</h4>
                        ${isDeleted ? '<span class="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full"><i class="fas fa-user-slash mr-1"></i>User Deleted</span>' : ''}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div><strong>Client:</strong> ${ass.name}</div>
                        <div><strong>Mobile:</strong> ${ass.mobile}</div>
                        <div><strong>Address:</strong> ${ass.address}</div>
                        <div><strong>Date:</strong> ${new Date(ass.date).toLocaleDateString()}</div>
                    </div>
                    <p class="text-sm text-gray-600 mt-2"><strong>Problem:</strong> ${ass.description}</p>
                </div>
            </div>
        </div>
    `}).join('');
}

function renderBookings() {
    const list = document.getElementById('booking-list');
    if (bookings.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">No bookings yet.</p>';
        return;
    }
    list.innerHTML = bookings.map((b) => `
        <div class="bg-white border ${b.isAccountDeleted ? 'border-red-300 bg-red-50' : 'border-gray-200'} p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center mb-3">
                        <i class="fas fa-calendar-alt text-blue-600 text-xl mr-2"></i>
                        <h4 class="font-semibold text-gray-800 text-lg">${b.service}</h4>
                        <span class="ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                            b.status === 'completed' ? 'bg-green-100 text-green-800' :
                            b.status === 'accepted' ? 'bg-purple-100 text-purple-800' :
                            b.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                        }">${b.status || 'pending'}</span>
                        ${b.isAccountDeleted ? '<span class="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full"><i class="fas fa-user-slash mr-1"></i>User Deleted</span>' : ''}
                        ${b.employeeEmail ? `<span class="ml-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"><i class="fas fa-user-tie mr-1"></i>Assigned</span>` : ''}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div><strong>Client:</strong> ${b.name}</div>
                        <div><strong>Email:</strong> ${b.clientEmail}</div>
                        <div><strong>Mobile:</strong> ${b.mobile}</div>
                        <div><strong>Address:</strong> ${b.address}</div>
                        <div><strong>Preferred Date:</strong> ${new Date(b.date).toLocaleDateString()}</div>
                    </div>
                    <p class="text-sm text-gray-600"><strong>Problem:</strong> ${b.description}</p>
                </div>
                <div class="flex gap-2 ml-4">
                    ${!b.employeeEmail && b.status !== 'completed' ? `<button onclick="assignBooking('${b._id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">Assign</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function updateSelects() {
    const empSelect = document.getElementById('employee-select');
    const bookingSelect = document.getElementById('booking-select');

    empSelect.innerHTML = employees.length > 0 ?
        employees.map(emp => `<option value="${emp.email}" data-service="${emp.service}">${emp.name} (${emp.service || 'All Services'})</option>`).join('') :
        '<option value="">No employees available</option>';

    const unassignedBookings = bookings.filter(b => !b.employeeEmail && b.status !== 'completed');

    bookingSelect.innerHTML = '<option value="">Select Booking</option>' +
        unassignedBookings.map(b =>
            `<option value="${b._id}">${b.name} - ${b.service} (${new Date(b.date).toLocaleDateString()})</option>`
        ).join('');
}

function populateEmployeeServiceSelect() {
    const select = document.getElementById('emp-service');
    if (select) {
        const allServices = services.map(s => s.name);
        select.innerHTML = '<option value="">Select Service</option>' +
            allServices.map(svc => `<option value="${svc}">${svc}</option>`).join('');
    }
}

document.getElementById('booking-select').addEventListener('change', function(e) {
    const bookingId = e.target.value;
    const detailsDiv = document.getElementById('selected-booking-details');
    const clientInfo = document.getElementById('client-info');
    const empSelect = document.getElementById('employee-select');

    if (bookingId) {
        const booking = bookings.find(b => b._id === bookingId);
        if (!booking) return;

        clientInfo.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><strong>Name:</strong> ${booking.name}</div>
                <div><strong>Mobile:</strong> ${booking.mobile}</div>
                <div><strong>Address:</strong> ${booking.address}</div>
                <div><strong>Service:</strong> ${booking.service}</div>
                <div><strong>Preferred Date:</strong> ${new Date(booking.date).toLocaleDateString()}</div>
                <div><strong>Problem:</strong> ${booking.description}</div>
            </div>
        `;
        detailsDiv.classList.remove('hidden');

        const selectedService = booking.service ? booking.service.trim().toLowerCase() : '';
        const filteredEmployees = employees.filter(emp => {
            const empService = emp.service ? emp.service.trim().toLowerCase() : '';
            return !empService || empService === 'all services' || empService === selectedService;
        });
        
        empSelect.innerHTML = filteredEmployees.length > 0 ?
            filteredEmployees.map(emp => `<option value="${emp.email}">${emp.name} (${emp.service || 'All Services'})</option>`).join('') :
            '<option value="">No employees available for this service</option>';
    } else {
        detailsDiv.classList.add('hidden');
        updateSelects();
    }
});

function assignBooking(bookingId) {
    document.getElementById('booking-select').value = bookingId;
    document.getElementById('booking-select').dispatchEvent(new Event('change'));
    document.querySelector('#assign-work-form').scrollIntoView({ behavior: 'smooth' });
    document.querySelector('a[href="#assignments"]').click();
}

document.getElementById('assign-work-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const bookingId = document.getElementById('booking-select').value;
    const employeeEmail = document.getElementById('employee-select').value;

    if (!bookingId || !employeeEmail) {
        showNotification('Please select both a booking and an employee.', 'error');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'accepted', employeeEmail })
        });
        if (response.ok) {
            showNotification('Work assigned successfully!', 'success');
            document.getElementById('selected-booking-details').classList.add('hidden');
            this.reset();
            fetchAllData();
        }
    } catch(err) {
        console.error(err);
    }
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}

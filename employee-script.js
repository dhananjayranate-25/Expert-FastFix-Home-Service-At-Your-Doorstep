if (localStorage.getItem('employeeLoggedIn') !== 'true') {
    window.location.href = 'employee-login.html';
}

const employeeEmail = localStorage.getItem('employeeEmail');
const employeeName = localStorage.getItem('employeeName') || 'Employee';
const employeeService = localStorage.getItem('employeeService') || 'All Services';

document.getElementById('employee-name').textContent = employeeName;
document.getElementById('employee-service').textContent = employeeService;

let bookings = [];

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

    document.getElementById('mywork-section').classList.remove('hidden');
    document.querySelector('a[href="#mywork"]').classList.add('bg-white', 'bg-opacity-20');

    fetchBookings();
    loadProfile();
});

async function fetchBookings() {
    try {
        const response = await fetch(`http://localhost:5000/api/bookings?employeeEmail=${employeeEmail}`);
        if (response.ok) {
            bookings = await response.json();
            updateStats();
            renderMyWork();
            renderCompleted();
        }
    } catch(err) {
        console.error('Error fetching bookings:', err);
    }
}

function updateStats() {
    const pendingWork = bookings.filter(b => b.status !== 'completed');
    const completedWork = bookings.filter(b => b.status === 'completed');

    document.getElementById('stats-cards').innerHTML = `
        <div class="stat-card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-yellow-100 text-sm font-medium">Pending Work</p>
                    <p class="text-3xl font-bold">${pendingWork.length}</p>
                </div>
                <i class="fas fa-clock text-4xl opacity-80"></i>
            </div>
        </div>
        <div class="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-green-100 text-sm font-medium">Completed</p>
                    <p class="text-3xl font-bold">${completedWork.length}</p>
                </div>
                <i class="fas fa-check-circle text-4xl opacity-80"></i>
            </div>
        </div>
        <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-blue-100 text-sm font-medium">Total Jobs</p>
                    <p class="text-3xl font-bold">${bookings.length}</p>
                </div>
                <i class="fas fa-briefcase text-4xl opacity-80"></i>
            </div>
        </div>
    `;
}

function renderMyWork() {
    const list = document.getElementById('mywork-list');
    const pendingAssignments = bookings.filter(b => b.status !== 'completed');

    if (pendingAssignments.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">No pending work. All caught up!</p>';
        return;
    }

    list.innerHTML = pendingAssignments.map((booking) => {
        const isDeleted = booking.isAccountDeleted;
        
        return `
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center mb-3">
                        <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                            <i class="fas fa-wrench text-yellow-600"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800 text-lg">${booking.service}</h4>
                            <p class="text-xs text-gray-500">Assigned: ${new Date(booking.bookingDate || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <span class="ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }">${booking.status || 'pending'}</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div><strong>Client:</strong> ${isDeleted ? 'Deleted User' : booking.name}</div>
                        <div><strong>Mobile:</strong> ${isDeleted ? '**********' : booking.mobile}</div>
                        <div class="md:col-span-2"><strong>Address:</strong> ${isDeleted ? 'Address Deleted' : booking.address}</div>
                    </div>
                    <p class="text-sm text-gray-600"><strong>Problem:</strong> ${booking.description}</p>
                </div>
                <div class="flex flex-col gap-2 ml-4">
                    ${booking.status !== 'in-progress' ? `<button onclick="startWork('${booking._id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">Start Work</button>` : ''}
                    <button onclick="completeWork('${booking._id}')" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">Complete</button>
                </div>
            </div>
        </div>
    `}).join('');
}

function renderCompleted() {
    const list = document.getElementById('completed-list');
    const completedAssignments = bookings.filter(b => b.status === 'completed');

    if (completedAssignments.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">No completed jobs yet.</p>';
        return;
    }

    list.innerHTML = completedAssignments.map((booking) => {
        const isDeleted = booking.isAccountDeleted;
        
        return `
        <div class="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-6 rounded-lg shadow-sm">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center mb-3">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <i class="fas fa-check text-green-600"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800 text-lg">${booking.service}</h4>
                        </div>
                        <span class="ml-3 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div><strong>Client:</strong> ${isDeleted ? 'Deleted User' : booking.name}</div>
                        <div><strong>Mobile:</strong> ${isDeleted ? '**********' : booking.mobile}</div>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
}

async function startWork(bookingId) {
    try {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'in-progress' })
        });
        if (response.ok) {
            alert('Work started! Good luck!');
            fetchBookings();
        }
    } catch(err) {
        console.error(err);
    }
}

async function completeWork(bookingId) {
    if (!confirm('Are you sure you want to mark this job as completed?')) return;
    
    try {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
        });
        if (response.ok) {
            alert('Job marked as completed! Great work!');
            fetchBookings();
        }
    } catch(err) {
        console.error(err);
    }
}

function loadProfile() {
    document.getElementById('profile-name').value = employeeName;
    document.getElementById('profile-email').value = employeeEmail;
    document.getElementById('profile-service').value = employeeService;
}

// Cannot easily change profile/password via simple APIs right now since we didn't add endpoints for them yet. 
// For now, we will leave them non-functional or add alert explaining it's in development.
document.getElementById('profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Updating profile via API is not yet implemented.');
});

document.getElementById('change-password-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Updating password via API is not yet implemented.');
});

function logout() {
    localStorage.removeItem('employeeLoggedIn');
    localStorage.removeItem('employeeEmail');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeService');
    window.location.href = 'index.html';
}

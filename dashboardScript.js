// Get logged in user from local storage
const loggedInUser = localStorage.getItem('loggedInUser');

// Display welcome message
document.getElementById('welcome-message').innerHTML = `Welcome, ${loggedInUser.charAt(0).toUpperCase() + loggedInUser.slice(1)}!`;
document.getElementById('dashboard-message').innerHTML = `This is the ${loggedInUser} dashboard.`;

// Logout button handler
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
});

// Back button handler
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});
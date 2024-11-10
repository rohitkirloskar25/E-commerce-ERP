// User data for demonstration purposes
const users = {
    admin: {
        username: 'admin',
        password: 'admin',
        role: 'admin'
    },
    seller: {
        username: 'seller',
        password: 'seller',
        role: 'seller'
    },
    buyer: {
        username: 'buyer',
        password: 'buyer',
        role: 'buyer'
    },
    delivery: {
        username: 'delivery',
        password: 'delivery',
        role: 'delivery'
    }
};

// Login form submission handler
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check user credentials
    if (users[username] && users[username].password === password) {
        const role = users[username].role;
        localStorage.setItem('loggedInUser', role);
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error-message').innerHTML = 'Invalid username or password';
    }
});
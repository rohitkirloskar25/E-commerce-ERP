const users = {
    admin: { username: 'admin', password: 'admin', role: 'admin' },
    seller: { username: 'seller', password: 'seller', role: 'seller' },
    buyer: { username: 'buyer', password: 'buyer', role: 'buyer' },
    delivery: { username: 'delivery', password: 'delivery', role: 'delivery' },
};

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users[username];

    if (user && user.password === password) {
        localStorage.setItem('loggedInUser', user.role);
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error-message').textContent = 'Invalid username or password';
    }
});

// Global Variables
let products = JSON.parse(localStorage.getItem('products')) || [];
let activityLogs = JSON.parse(localStorage.getItem('logs')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Utility Functions
function logActivity(message) {
    const log = { timestamp: new Date(), message };
    activityLogs.push(log);
    localStorage.setItem('logs', JSON.stringify(activityLogs));
}

// Seller Dashboard
function displaySellerDashboard() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">Seller Dashboard</h2>
    <form id="product-form" class="space-y-4">
        <div>
            <label for="product-brand" class="block text-sm font-medium text-gray-700">Brand:</label>
            <input type="text" id="product-brand" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
        </div>
        <div>
            <label for="product-item" class="block text-sm font-medium text-gray-700">Item:</label>
            <input type="text" id="product-item" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
        </div>
        <div>
            <label for="product-description" class="block text-sm font-medium text-gray-700">Description:</label>
            <textarea id="product-description" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
        </div>
        <div>
            <label for="product-price" class="block text-sm font-medium text-gray-700">Price:</label>
            <input type="number" id="product-price" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500">Add Product</button>
    </form>
    <h3 class="text-lg font-semibold mt-6">My Products</h3>
    <div id="product-list" class="space-y-4 mt-4"></div>
`;


    document.getElementById('product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const brand = document.getElementById('product-brand').value;
        const item = document.getElementById('product-item').value;
        const description = document.getElementById('product-description').value;
        const price = parseFloat(document.getElementById('product-price').value);

        const newProduct = { id: Date.now(), brand, item, description, price, clicks: 0 };
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        logActivity(`Seller added a product: ${item}`);
        displayProductList();
    });

    displayProductList();
}

function displayProductList() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = products
        .map(
            (product, index) => `
            <div class="product-card">
                <img src="https://source.unsplash.com/random/300x200?sig=${index}&clothes,accessories" alt="${product.item}" />
                <div class="product-card-body">
                    <h4>${product.brand} - ${product.item}</h4>
                    <p>${product.description}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
                </div>
            </div>`
        )
        .join('');
}

function displayBuyerDashboard() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Buyer Dashboard</h2>
        <div id="product-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
        <h3 class="text-xl font-bold mt-8">My Cart</h3>
        <div id="cart-list" class="mt-4"></div>
    `;

    displayProductList();

    document.querySelectorAll('.add-to-cart-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.productId);
            addToCart(productId);
            incrementProductClicks(productId);
        });
    });

    displayCart();
}


function addToCart(productId) {
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    logActivity(`Buyer added product ID ${productId} to cart`);
    displayCart();
}

function displayCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = cart
        .map((id) => {
            const product = products.find((p) => p.id === id);
            return `<div>${product.brand} - ${product.item}</div>`;
        })
        .join('');
}

function incrementProductClicks(productId) {
    products = products.map((product) => {
        if (product.id === productId) product.clicks++;
        return product;
    });
    localStorage.setItem('products', JSON.stringify(products));
}

// Delivery Dashboard
function displayDeliveryDashboard() {
    window.location.href="http://127.0.0.1:5500/E-commerce-ERP/map.html"
    
}

// Admin Dashboard
function displayAdminDashboard() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <h2>Admin Dashboard</h2>
        <h3>All Products</h3>
        <div id="admin-product-list"></div>
        <h3>Activity Logs</h3>
        <div id="activity-logs"></div>
        <h3>Login Details</h3>
        <div id="login-details"></div>
    `;

    // Display products
    document.getElementById('admin-product-list').innerHTML = products
        .map(
            (product) => `
            <div>
                <h4>${product.brand} - ${product.item}</h4>
                <p>${product.description}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>Clicks: ${product.clicks}</p>
            </div>`
        )
        .join('');

    // Display activity logs
    document.getElementById('activity-logs').innerHTML = activityLogs
        .map(
            (log) =>
                `<div>
                    <p><strong>${new Date(log.timestamp).toLocaleString()}:</strong> ${log.message}</p>
                </div>`
        )
        .join('');

    // Display login details
    const users = JSON.parse(localStorage.getItem('loginDetails')) || [];
    document.getElementById('login-details').innerHTML = users
        .map((user) => `<div>${user.username} - ${new Date(user.timestamp).toLocaleString()}</div>`)
        .join('');
}

// Role-Based Navigation
function handleRole(role) {
    switch (role) {
        case 'seller':
            displaySellerDashboard();
            break;
        case 'buyer':
            displayBuyerDashboard();
            break;
        case 'delivery':
            displayDeliveryDashboard();
            break;
        case 'admin':
            displayAdminDashboard();
            break;
        default:
            alert('Invalid role');
    }
}

// Event Listeners
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
});

document.getElementById('back-btn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
});

// On Page Load
const loggedInUserRole = localStorage.getItem('loggedInUser');
if (loggedInUserRole) {
    handleRole(loggedInUserRole);
} else {
    window.location.href = 'index.html';
}

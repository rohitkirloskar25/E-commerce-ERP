// Global Variables
let products = JSON.parse(localStorage.getItem("products")) || [];
let activityLogs = JSON.parse(localStorage.getItem("logs")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Utility Functions
function logActivity(message) {
  const log = { timestamp: new Date(), message };
  activityLogs.push(log);
  localStorage.setItem("logs", JSON.stringify(activityLogs));
}

// Seller Dashboard
function displaySellerDashboard() {
  const container = document.getElementById("dashboard-container");
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
            <label for="product-image" class="block text-sm font-medium text-gray-700">Image URL:</label>
            <input type="url" id="product-image" required placeholder="https://example.com/image.jpg" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
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
    <h3 class="text-lg font-semibold mt-6 mb-4">My Products</h3>
    <div id="product-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
`;

  document.getElementById("product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const brand = document.getElementById("product-brand").value;
    const item = document.getElementById("product-item").value;
    const imageUrl = document.getElementById("product-image").value;
    const description = document.getElementById("product-description").value;
    const price = parseFloat(document.getElementById("product-price").value);

    const newProduct = {
      id: Date.now(),
      brand,
      item,
      imageUrl,
      description,
      price,
      clicks: 0,
    };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    logActivity(`Seller added a product: ${item}`);
    displayProductList();
    e.target.reset();
  });

  displayProductList();
}

// Update the displayProductList function to use the custom image URL and add remove button:
function displayProductList() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = products
    .map(
      (product) => `
            <div class="product-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img src="${
                  product.imageUrl ||
                  `https://source.unsplash.com/random/400x300?product=${product.item}`
                }" 
                     alt="${product.item}" 
                     class="w-full h-48 object-cover"/>
                <div class="p-4">
                    <div class="font-semibold text-lg text-gray-800">${
                      product.brand
                    }</div>
                    <div class="text-gray-600">${product.item}</div>
                    <p class="text-gray-500 text-sm mt-2">${
                      product.description
                    }</p>
                    <div class="mt-4 flex justify-between items-center">
                        <span class="text-2xl font-bold text-blue-600">$${product.price.toFixed(
                          2
                        )}</span>
                        ${
                          localStorage.getItem("loggedInUser") === "seller"
                            ? `<button onclick="removeProduct(${product.id})" 
                                    class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                                Remove
                            </button>`
                            : `<button onclick="addToCart(${product.id})" 
                                    class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                Add to Cart
                            </button>`
                        }
                    </div>
                    <div class="mt-2 text-sm text-gray-500">
                        ${product.clicks} views
                    </div>
                </div>
            </div>`
    )
    .join("");
}

// remove product
function removeProduct(productId) {
  if (confirm("Are you sure you want to remove this product?")) {
    products = products.filter((product) => product.id !== productId);
    localStorage.setItem("products", JSON.stringify(products));
    logActivity(`Seller removed product ID: ${productId}`);
    displayProductList();

    // notification
    const successAlert = `
            <div id="success-alert" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                Product removed successfully!
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", successAlert);

    setTimeout(() => {
      const alert = document.getElementById("success-alert");
      if (alert) {
        alert.remove();
      }
    }, 3000);
  }
}

function displayBuyerDashboard() {
  const container = document.getElementById("dashboard-container");
  container.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Buyer Dashboard</h2>
        <div id="product-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
        <h3 class="text-xl font-bold mt-8">My Cart</h3>
        <div id="cart-list" class="mt-4"></div>
    `;

  displayProductList();

  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.dataset.productId);
      addToCart(productId);
      incrementProductClicks(productId);
    });
  });

  displayCart();
}

function addToCart(productId) {
  cart.push(productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  logActivity(`Buyer added product ID ${productId} to cart`);
  displayCart();
}

// proceed to checkout modal
function checkout() {
  const modalHTML = `
        <div id="checkout-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 class="text-xl font-bold mb-4">Checkout</h3>
                
                <div class="mb-6">
                    <div class="flex items-center mb-4">
                        <input type="radio" id="cod" name="payment" value="cod" 
                               class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" checked>
                        <label for="cod" class="ml-2 block text-sm font-medium text-gray-900">
                            Cash on Delivery
                        </label>
                    </div>
                </div>

                <div class="border-t pt-4">
                    <div class="flex justify-between mb-2">
                        <span class="font-semibold">Total Amount:</span>
                        <span class="font-bold">$${calculateTotal().toFixed(
                          2
                        )}</span>
                    </div>
                </div>

                <div class="flex justify-end gap-4 mt-6">
                    <button onclick="closeModal()" 
                            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onclick="placeOrder()" 
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function calculateTotal() {
  const cartItems = cart.map((id) => products.find((p) => p.id === id));
  return cartItems.reduce((sum, item) => sum + item.price, 0);
}

function closeModal() {
  const modal = document.getElementById("checkout-modal");
  if (modal) {
    modal.remove();
  }
}

function placeOrder() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  closeModal();

  // notification
  const successAlert = `
        <div id="success-alert" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            Order placed successfully!
        </div>
    `;
  document.body.insertAdjacentHTML("beforeend", successAlert);

  setTimeout(() => {
    const alert = document.getElementById("success-alert");
    if (alert) {
      alert.remove();
    }
  }, 3000);

  displayCart();
}

function displayCart() {
  const cartList = document.getElementById("cart-list");
  const cartItems = cart.map((id) => products.find((p) => p.id === id));
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  cartList.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-4">
            ${cartItems
              .map(
                (product) => `
                <div class="flex justify-between items-center py-2 border-b">
                    <div>
                        <div class="font-semibold">${product.brand} - ${
                  product.item
                }</div>
                        <div class="text-gray-500">$${product.price.toFixed(
                          2
                        )}</div>
                    </div>
                    <button onclick="removeFromCart(${product.id})" 
                            class="text-red-500 hover:text-red-700">
                        Remove
                    </button>
                </div>
            `
              )
              .join("")}
            <div class="mt-4 flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            ${
              cartItems.length > 0
                ? `
                <button onclick="checkout()" 
                        class="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
                    Proceed to Checkout
                </button>
            `
                : `
                <div class="text-center text-gray-500 mt-4">Your cart is empty</div>
            `
            }
        </div>
    `;
}

function removeFromCart(productId) {
  cart = cart.filter((id) => id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function incrementProductClicks(productId) {
  products = products.map((product) => {
    if (product.id === productId) product.clicks++;
    return product;
  });
  localStorage.setItem("products", JSON.stringify(products));
}

// Delivery Dashboard
function displayDeliveryDashboard() {
  window.location.href = "http://127.0.0.1:5500/E-commerce-ERP/map.html";
}

// Admin Dashboard
function displayAdminDashboard() {
  const container = document.getElementById("dashboard-container");
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
  document.getElementById("admin-product-list").innerHTML = products
    .map(
      (product) => `
            <div>
                <h4>${product.brand} - ${product.item}</h4>
                <p>${product.description}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>Clicks: ${product.clicks}</p>
            </div>`
    )
    .join("");

  // Display activity logs
  document.getElementById("activity-logs").innerHTML = activityLogs
    .map(
      (log) =>
        `<div>
                    <p><strong>${new Date(
                      log.timestamp
                    ).toLocaleString()}:</strong> ${log.message}</p>
                </div>`
    )
    .join("");

  // Display login details
  const users = JSON.parse(localStorage.getItem("loginDetails")) || [];
  document.getElementById("login-details").innerHTML = users
    .map(
      (user) =>
        `<div>${user.username} - ${new Date(
          user.timestamp
        ).toLocaleString()}</div>`
    )
    .join("");
}

// Role-Based Navigation
function handleRole(role) {
  switch (role) {
    case "seller":
      displaySellerDashboard();
      break;
    case "buyer":
      displayBuyerDashboard();
      break;
    case "delivery":
      displayDeliveryDashboard();
      break;
    case "admin":
      displayAdminDashboard();
      break;
    default:
      alert("Invalid role");
  }
}

// Event Listeners
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

document.getElementById("back-btn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

// On Page Load
const loggedInUserRole = localStorage.getItem("loggedInUser");
if (loggedInUserRole) {
  handleRole(loggedInUserRole);
} else {
  window.location.href = "index.html";
}

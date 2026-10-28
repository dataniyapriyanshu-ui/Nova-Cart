
"use strict";

// ========================================
// 1. PRODUCT DATA
// ========================================

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Tech",
        price: 999,
        description: "Enjoy your favourite music.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Tech",
        price: 1499,
        description: "A smart companion for every day.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Casual Backpack",
        category: "Lifestyle",
        price: 799,
        description: "Carry your essentials in style.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Running Shoes",
        category: "Lifestyle",
        price: 1799,
        description: "Comfort for everyday adventures.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Classic Sunglasses",
        category: "Lifestyle",
        price: 599,
        description: "A timeless everyday accessory.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Table Lamp",
        category: "Home",
        price: 899,
        description: "Add a warm glow to your room.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Ceramic Coffee Mug",
        category: "Home",
        price: 299,
        description: "Make your coffee breaks special.",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Bluetooth Speaker",
        category: "Tech",
        price: 1199,
        description: "Bring music into every moment.",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
    }
];

// ========================================
// 2. HTML ELEMENTS
// ========================================

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-btn");
const emptyMessage = document.getElementById("emptyMessage");

const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const subtotal = document.getElementById("subtotal");

const loginPage = document.getElementById("loginPage");
const loginForm = document.getElementById("loginForm");
const loginOpen = document.getElementById("loginOpen");
const loginMessage = document.getElementById("loginMessage");

const paymentPage = document.getElementById("paymentPage");
const paymentClose = document.getElementById("paymentClose");
const paymentAmount = document.getElementById("paymentAmount");
const paymentWelcome = document.getElementById("paymentWelcome");
const paymentMessage = document.getElementById("paymentMessage");
const payNow = document.getElementById("payNow");

const checkout = document.getElementById("checkout");

// Check that the essential HTML exists.
if (!productsContainer || !searchInput || !cartItems) {
    console.error(
        "Nova Cart: Required HTML elements are missing. Check index.html."
    );
}

// ========================================
// 3. WEBSITE STATE
// ========================================

let selectedCategory = "All";
let cart = [];
let currentUser = null;
let checkoutAfterLogin = false;

// ========================================
// 4. DISPLAY PRODUCTS
// ========================================

function displayProducts() {
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    productsContainer.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="product-info">
                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">
                    <span class="price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </span>

                    <button
                        type="button"
                        class="add-btn"
                        data-add="${product.id}"
                    >
                        + Add to Cart
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    if (emptyMessage) {
        emptyMessage.hidden = filteredProducts.length !== 0;
    }
}

// ========================================
// 5. SEARCH PRODUCTS
// ========================================

searchInput.addEventListener("input", displayProducts);

// ========================================
// 6. CATEGORY FILTERS
// ========================================

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        categoryButtons.forEach(item => {
            item.classList.toggle("active", item === button);
        });

        displayProducts();
    });
});

// ========================================
// 7. ADD PRODUCTS TO CART
// ========================================

productsContainer.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    const productId = Number(button.dataset.add);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    displayCart();
});

// ========================================
// 8. DISPLAY CART AND SUBTOTAL
// ========================================

function displayCart() {
    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.id);

        return total + (product ? product.price * item.quantity : 0);
    }, 0);

    cartCount.textContent = totalItems;
    subtotal.textContent = totalPrice.toLocaleString("en-IN");

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return "";

        return `
            <div class="cart-item">
                <div>
                    <strong>${product.name}</strong>
                    <p>
                        ₹${product.price.toLocaleString("en-IN")}
                        × ${item.quantity}
                    </p>
                </div>

                <button
                    type="button"
                    class="remove-btn"
                    data-remove="${product.id}"
                >
                    Remove
                </button>
            </div>
        `;
    }).join("");
}

// ========================================
// 9. REMOVE PRODUCTS FROM CART
// ========================================

cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-remove]");

    if (!button) return;

    const productId = Number(button.dataset.remove);

    cart = cart.filter(item => item.id !== productId);

    displayCart();
});

// ========================================
// 10. OPEN AND CLOSE CART
// ========================================

document.getElementById("cartOpen").addEventListener("click", () => {
    cartPanel.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
});

document.getElementById("cartClose").addEventListener("click", () => {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
});

// ========================================
// 11. SHOP NOW BUTTON
// ========================================

document.getElementById("shopNow").addEventListener("click", () => {
    document.getElementById("collection").scrollIntoView({
        behavior: "smooth"
    });
});

// ========================================
// 12. DEMO SIGN-IN
// ========================================

function getDisplayName(email) {
    const username = email.split("@")[0];

    return username
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

loginOpen.addEventListener("click", () => {
    if (currentUser) {
        currentUser = null;
        loginOpen.textContent = "Sign In";
        loginMessage.textContent = "";
        alert("You have signed out.");
        return;
    }

    loginMessage.textContent = "";
    loginPage.hidden = false;
});

document.getElementById("loginClose").addEventListener("click", () => {
    loginPage.hidden = true;
    checkoutAfterLogin = false;
});

loginPage.addEventListener("click", event => {
    if (event.target === loginPage) {
        loginPage.hidden = true;
        checkoutAfterLogin = false;
    }
});

loginForm.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        loginMessage.textContent =
            "Please enter your email and password.";
        return;
    }

    // Frontend demonstration only; no account is verified.
    currentUser = {
        name: getDisplayName(email)
    };

    loginOpen.textContent = currentUser.name;
    loginMessage.textContent = "Demo sign-in successful!";

    loginForm.reset();

    if (checkoutAfterLogin) {
        checkoutAfterLogin = false;
        loginPage.hidden = true;
        openPaymentPage();
    } else {
        setTimeout(() => {
            loginPage.hidden = true;
        }, 600);
    }
});

// ========================================
// 13. OPEN PAYMENT PAGE
// ========================================

function openPaymentPage() {
    if (!currentUser) {
        checkoutAfterLogin = true;
        loginPage.hidden = false;
        return;
    }

    paymentAmount.textContent = subtotal.textContent;

    paymentWelcome.textContent =
        `Hello, ${currentUser.name}! Review your demo payment below.`;

    paymentMessage.textContent = "";
    paymentPage.hidden = false;
}

paymentClose.addEventListener("click", () => {
    paymentPage.hidden = true;
});

paymentPage.addEventListener("click", event => {
    if (event.target === paymentPage) {
        paymentPage.hidden = true;
    }
});

// ========================================
// 14. CHECKOUT BUTTON
// ========================================

checkout.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    if (!currentUser) {
        checkoutAfterLogin = true;
        loginMessage.textContent =
            "Please sign in before continuing to payment.";

        loginPage.hidden = false;
        return;
    }

    openPaymentPage();
});

// ========================================
// 15. DEMO PAYMENT - ALWAYS FAILS
// ========================================

payNow.addEventListener("click", () => {
    paymentMessage.textContent =
        "Payment Failed! This is a demo. No money was charged.";

    paymentMessage.style.color = "red";
});

// ========================================
// 16. INITIALIZE WEBSITE
// ========================================

displayProducts();
displayCart();

console.log("Nova Cart loaded successfully.");
console.log(`${products.length} products are available.`);

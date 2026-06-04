const API_URL = "http://localhost:4000";

   //  Sends a request to the /cart endpoint of the API.
  //  Parses the response JSON and stores it in the 'cart' variable.
  //  Calls the 'renderCart' function and passes the cart data to it.


// Load cart items
async function loadCart() {
  const res = await fetch(`${API_URL}/cart`);
  const cart = await res.json();
  renderCart(cart);
}

// Render cart UI
function renderCart(cart) {
  const container = document.getElementById("cart-items");
  const subtotalSpan = document.getElementById("subtotal");
  const grandtotalSpan = document.getElementById("grandtotal");
  const messageDiv = document.getElementById("checkout-message");

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-center">🛒 Your cart is empty.</p>`;
    subtotalSpan.textContent = "0";
    grandtotalSpan.textContent = "0";
    return;
  }

  container.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;

    const itemBox = document.createElement("div");
    itemBox.className = "cart-box";
    itemBox.innerHTML = `
      <div class="row align-items-center">
        <div class="col-md-3">
          <img src="../${item.image}" class="img-fluid rounded" alt="${item.title}" />
        </div>
        <div class="col-md-6">
          <div class="title">${item.title}</div>
          <div class="text-muted">Price: Rs. ${item.price}</div>
          <div class="qty-controls mt-2">
            <button class="btn btn-sm btn-outline-secondary" onclick="updateQty('${item.id}', ${item.qty - 1})">-</button>
            <span>${item.qty}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="updateQty('${item.id}', ${item.qty + 1})">+</button>
          </div>
        </div>
        <div class="col-md-3 text-end">
          <div class="text-muted mb-2">Total: Rs. ${item.price * item.qty}</div>
          <button class="cart-remove" onclick="removeItem('${item.id}')">Remove</button>
        </div>
      </div>
    `;
    container.appendChild(itemBox);
  });

  subtotalSpan.textContent = subtotal;
  grandtotalSpan.textContent = subtotal; 
}

// Update quantity
async function updateQty(id, newQty) {
  if (newQty <= 0) return removeItem(id);

  await fetch(`${API_URL}/cart/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qty: newQty })
  });

  loadCart();
}

// Remove item
async function removeItem(id) {
  await fetch(`${API_URL}/cart/${id}`, {
    method: "DELETE"
  });
  loadCart();
}

// Clear cart
async function clearCart() {
  const res = await fetch(`${API_URL}/cart`);
  const cart = await res.json();

  for (const item of cart) {
    await fetch(`${API_URL}/cart/${item.id}`, {
      method: "DELETE"
    });
  }

  loadCart();
}

//Proceed to checkout
async function proceedToCheckout() {
  const res = await fetch(`${API_URL}/cart`);
  const cart = await res.json();

  if (cart.length === 0) {
    alert("🛒 Your cart is empty.");
    return;
  }

  const summary = cart.map(item => `${item.title} x ${item.qty}`).join("<br>");
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  localStorage.setItem("checkoutSummary", summary);
  localStorage.setItem("checkoutTotal", total);

  window.location.href = "checkout.html";
}

// Initial load
document.addEventListener("DOMContentLoaded", loadCart);

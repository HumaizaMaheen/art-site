// Builtin event
// It runs as soon as the browser finishes reading and organizing the HTML forming the DOM (Document Object Model)
// it does not wait for images stylesheets or other external resources to finish loading just the HTML itself you can  run JavaScript that interacts with elements on the page as soon as DOMContentLoaded fires without waiting for everything (like images) to load
// API (Application Programming Interface) is a set of rules that lets two software programs talk to each other
// API URL Base URL for API call 
// allproducts Stores products loaded from the server 
// visibleProducts stores products currently displayed (useful when filtering or sorting)
// asynchronous in code = something in the background and dont block other code from running.
// async = this function will do something asynchronous and may return a promise
// A Promise in JavaScript is a way to handle asynchronous operations
// Promise is an object that represents a future result of an asynchronous task it has 3 states pending 
//  the operation hasn't finished yet fulfilled (Resolved) 
// the operation completed successfully rejected 
//  the operation failed
//  use await inside an async function to pause the code until the promise is resolved
// fetch() built-in browser function to make HTTP requests
//  res.json() reads the response and parses JSON
// returns promise resolving to the products array








document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:4000";
  let allProducts = [];
  let visibleProducts = [];

  const loadProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    return await res.json();
  };

  const getCart = async () => {
    const res = await fetch(`${API_URL}/cart`);
    return await res.json();
  };

  const addToCart = async (product) => {
    try {
      const cart = await getCart();
      const existingItem = cart.find(item => item.productId === product.id);

      if (existingItem) {
        await fetch(`${API_URL}/cart/${existingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qty: existingItem.qty + 1 })
        });
      } else {
        const newItem = {
          id: crypto.randomUUID(),
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty: 1
        };

        await fetch(`${API_URL}/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItem)
        });
      }

      alert("✅ Product added to cart!");
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      alert("❌ Failed to add to cart.");
    }
  };

  const renderProducts = async (products = null) => {
    if (!products) {
      allProducts = await loadProducts();
      visibleProducts = [...allProducts];
    } else {
      visibleProducts = products;
    }

    const container = document.getElementById("product-container");
    container.innerHTML = "";

    visibleProducts.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-sm-6 col-md-4 mb-4";
      col.innerHTML = `
        <div class="panel">
          <img src="../${product.image}" alt="${product.title}" />
          <div class="card-header">
            <h2 class="heading">${product.title}</h2>
            <p class="price">Price: PKR ${product.price}</p>
            <div class="heart">
              <button class="btn2 add-to-cart-btn" data-id="${product.id}">Add to cart</button>
              <button class="btn btn-info info-btn"
                      data-title="${product.title}"
                      data-price="${product.price}"
                      data-artist="${product.artist}"
                      data-story="${product.story}"
                      data-bs-toggle="modal"
                      data-bs-target="#infoModal">Info</button>
            </div>
          </div>
        </div>
      `;
      container.appendChild(col);
    });

    bindAddToCartButtons(visibleProducts);
    bindInfoButtons();
  };

  const bindAddToCartButtons = (products) => {
    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const product = products.find(p => p.id === id);
        if (product) addToCart(product);
      });
    });
  };

  const bindInfoButtons = () => {
    const style = document.createElement("style");
    style.textContent = `
      .info-btn {
        background-color: rgba(72, 102, 72, 0.6);
        color: whitesmoke;
        padding: 10px 20px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
      }

      .info-btn:hover {
        background-color: #f5f5f5;
        color: black;
      }
    `;
    document.head.appendChild(style);

    document.querySelectorAll(".info-btn").forEach(btn => {
      btn.classList.add("info-btn");
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title");
        const artist = btn.getAttribute("data-artist");
        const story = btn.getAttribute("data-story");
        const price = btn.getAttribute("data-price");

        const modalBody = document.getElementById("infoContent");
        modalBody.innerHTML = `
          <h4>${title}</h4>
          <p><strong>Artist:</strong> ${artist}</p>
          <p><strong>Price:</strong> PKR ${price}</p>
          <p><strong>Story:</strong> ${story}</p>
        `;
      });
    });
  };

  // Floating Cart Button
  const cartBtn = document.createElement("div");
  cartBtn.innerHTML = "🛒";
  cartBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #333;
    color: white;
    font-size: 24px;
    padding: 10px 20px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 9999;
  `;
  cartBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
  document.body.appendChild(cartBtn);

  renderProducts();

  // Filters
  document.getElementById("sort-low-high").addEventListener("click", () => {
    const sorted = [...allProducts].sort((a, b) => a.price - b.price);
    renderProducts(sorted);
  });

  document.getElementById("sort-high-low").addEventListener("click", () => {
    const sorted = [...allProducts].sort((a, b) => b.price - a.price);
    renderProducts(sorted);
  });

  document.getElementById("search-box").addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p => p.title.toLowerCase().includes(keyword));
    renderProducts(filtered);
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummaryElement = document.getElementById('cartSummary');
    const totalPriceElement = document.getElementById('totalPrice');
    const purchaseButton = document.getElementById('purchaseButton');

    function loadCartItems() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCartItems(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function createCartItemElement(item) {
        const cartItem = document.createElement('div');
        const displayDis = item.price > item.disPrice;
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <img src="${item.image}" class="col-2" alt="${item.name}">
            <div class="col-md-9 col-10">
                <h5>${item.name}</h5>
                ${displayDis ? `
                    <h6>Price: <span class="text-muted"><s>$${item.price.toFixed(2)}</s></span></h6>
                    <h6>Discounted Price: $${item.disPrice.toFixed(2)}</h6>
                ` : `
                    <h6>Price: $${item.price.toFixed(2)}</h6>
                `}
                <p>Gender: ${item.gender}</p>
                <div class="d-flex align-items-center">
                    <label for="quantity-${item.name}" class="me-2">Quantity:</label>
                    <input type="number" id="quantity-${item.name}" class="form-control quantity-input" value="${item.quantity}" min="1">
                </div>
            </div>
            <div class="col-md-1 col-12 align-self-center">
                <button class="btn btn-danger btn-sm remove-item" data-name="${item.name}">Remove</button>
            </div>
        `;

        cartItem.querySelector('.quantity-input').addEventListener('change', (event) => {
            updateCartItemQuantity(item.name, parseInt(event.target.value));
        });

        cartItem.querySelector('.remove-item').addEventListener('click', () => {
            removeCartItem(item.name);
        });

        return cartItem;
    }

    function renderCartItems() {
        const cartItems = loadCartItems();
        cartItemsContainer.innerHTML = '';
        cartItems.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            cartItemsContainer.appendChild(cartItemElement);
        });
        updateCartSummary();
    }

    function updateCartItemQuantity(name, quantity) {
        let cart = loadCartItems();
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity = quantity;
        }
        saveCartItems(cart);
        updateCartSummary();
    }

    function removeCartItem(name) {
        let cart = loadCartItems();
        cart = cart.filter(item => item.name !== name);
        saveCartItems(cart);
        renderCartItems();
    }

    function updateCartSummary() {
        const cartItems = loadCartItems();
        cartSummaryElement.innerHTML = `
            <table class="table text-white">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${cartItems.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>$${(item.disPrice * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        const totalPrice = cartItems.reduce((total, item) => total + (item.disPrice * item.quantity), 0);
        totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }

    function handlePurchase() {
        const cartItems = loadCartItems();
        if (cartItems.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        // Simulate the payment process
        alert('Thank you for your purchase!');

        // Store order history
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        const newOrder = {
            date: new Date().toLocaleString(),
            items: cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity
            })),
            totalAmount: cartItems.reduce((total, item) => total + (item.disPrice * item.quantity), 0)
        };
        orderHistory.push(newOrder);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

        // Clear the cart after purchase
        saveCartItems([]);
        renderCartItems();

        // Redirect to the orders page
        window.location.href = './index.html';
    }

    purchaseButton.addEventListener('click', handlePurchase);

    renderCartItems();
});
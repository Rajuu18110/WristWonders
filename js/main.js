// scripts/navbar.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('./components/navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
            updateNavbar()
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            const currentPath = window.location.pathname.split('/').pop();

            navLinks.forEach(link => {
                const href = link.getAttribute('href').split('/').pop();
                if (currentPath === href) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});
function updateNavbar() {
    // Example user authentication status
    // In a real-world scenario, this should be determined by your authentication logic
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true'; // Replace this with actual authentication check
    const userSection = document.getElementById('user-section');
    const name = JSON.parse(localStorage.getItem('user'));


    if (isLoggedIn) {
        userSection.innerHTML = `
            <div class="dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${name.firstName}
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="./profile.html">Edit Info</a></li>
                    <li><a class="dropdown-item" href="./orders.html">Orders</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li class="dropdown-item" id="logoutButton">Logout</li>
                </ul>
            </div>
        `;

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('loggedIn');
            window.location.href = 'index.html'; // Redirect to login page
        });
    } else {
        userSection.innerHTML = `
            <a class="nav-link" href="./login.html">Login</a>
        `;
    }
}
// // back to top
// document.addEventListener('DOMContentLoaded', () => {
//     const backToTopButton = document.getElementById('backToTop');

//     // Show the button when scrolling down
//     window.addEventListener('scroll', () => {
//         if (window.scrollY > 300) { // Show button after scrolling down 300px
//             backToTopButton.style.display = 'block';
//         } else {
//             backToTopButton.style.display = 'none';
//         }
//     });

//     // Scroll to top when button is clicked
//     backToTopButton.addEventListener('click', () => {
//         window.scrollTo({
//             top: 0,
//             behavior: 'smooth'
//         });
//     });
// });

let itemstopSellSlide = document.querySelectorAll('.carousel .carousel-item.topSellSlide')

itemstopSellSlide.forEach((el) => {
    const minPerSlide = 3
    let next = el.nextElementSibling
    for (var i = 1; i < minPerSlide; i++) {
        if (!next) {
            // wrap carousel by using first child
            next = itemstopSellSlide[0]
        }
        let cloneChild = next.cloneNode(true)
        el.appendChild(cloneChild.children[0])
        next = next.nextElementSibling
    }
})

document.addEventListener('DOMContentLoaded', function () {
    // Select all cards
    const cards = document.querySelectorAll('.card');

    // Loop through each card
    cards.forEach(function (card) {
        // Select the images inside the card
        const img1 = card.querySelector('.img1');
        const img2 = card.querySelector('.img2');

        // Add event listener for mouse enter
        card.addEventListener('mouseenter', function () {
            img1.style.display = 'none';
            img2.style.display = 'block';
        });

        // Add event listener for mouse leave
        card.addEventListener('mouseleave', function () {
            img1.style.display = 'block';
            img2.style.display = 'none';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');

    // Function to load cart items from local storage
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart;
    }

    // Function to save cart items to local storage
    function saveCartItems(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to create a cart item element
    function createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h5>${item.name}</h5>
                <h6>$${item.price.toFixed(2)}</h6>
            </div>
            <button class="btn btn-danger btn-sm remove-item" data-name="${item.name}">Remove</button>
        `;

        cartItem.querySelector('.remove-item').addEventListener('click', () => {
            removeCartItem(item.name);
        });

        return cartItem;
    }

    // Function to render cart items
    function renderCartItems() {
        const cartItems = loadCartItems();
        cartItemsContainer.innerHTML = '';
        cartItems.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            cartItemsContainer.appendChild(cartItemElement);
        });
        updateTotalPrice();
    }

    // Function to remove a cart item
    function removeCartItem(name) {
        let cart = loadCartItems();
        cart = cart.filter(item => item.name !== name);
        saveCartItems(cart);
        renderCartItems();
    }

    // Function to update the total price
    function updateTotalPrice() {
        const cartItems = loadCartItems();
        const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }

    // Load and display cart items on page load
    renderCartItems();
});

// document.addEventListener('DOMContentLoaded', () => {
//     const typeCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="type"]');
//     const brandCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="brand"]');
//     const priceFilter = document.getElementById('watchPrice');
//     const searchInput = document.getElementById('searchInput');
//     const productList = document.getElementById('productList');
//     const products = productList.getElementsByClassName('product');
//     const filterSection = document.querySelector('.filter-section');
//     const toggleFilter = document.getElementById('toggleFilter');
//     const clearFilters = document.getElementById('clearFilters');

//     function filterProducts() {
//         const selectedTypes = Array.from(typeCheckboxes)
//             .filter(checkbox => checkbox.checked)
//             .map(checkbox => checkbox.value);

//         const selectedBrands = Array.from(brandCheckboxes)
//             .filter(checkbox => checkbox.checked)
//             .map(checkbox => checkbox.value);

//         const priceValue = priceFilter.value;
//         const searchValue = searchInput.value.toLowerCase();

//         Array.from(products).forEach(product => {
//             const productType = product.getAttribute('data-type');
//             const productPrice = parseFloat(product.getAttribute('data-price'));
//             const productBrand = product.getAttribute('data-brand');
//             const productName = product.querySelector('.card-title').textContent.toLowerCase();

//             const showType = selectedTypes.length === 0 || selectedTypes.includes(productType);
//             const showBrand = selectedBrands.length === 0 || selectedBrands.includes(productBrand);
//             const showPrice = priceValue ?
//                 (priceValue === '500+' ? productPrice > 500 :
//                     (productPrice >= parseFloat(priceValue.split('-')[0]) && productPrice <= parseFloat(priceValue.split('-')[1]))) :
//                 true;
//             const showSearch = productName.includes(searchValue);

//             if (showType && showBrand && showPrice && showSearch) {
//                 product.style.display = '';
//             } else {
//                 product.style.display = 'none';
//             }
//         });
//     }

//     function clearAllFilters() {
//         typeCheckboxes.forEach(checkbox => checkbox.checked = false);
//         brandCheckboxes.forEach(checkbox => checkbox.checked = false);
//         priceFilter.value = '';
//         searchInput.value = '';
//         filterProducts(); // Reapply filters after clearing
//     }

//     function addToCart(event) {
//         if (event.target.classList.contains('add-to-cart')) {
//             const name = event.target.getAttribute('data-name');
//             const price = parseFloat(event.target.getAttribute('data-price'));

//             const cart = JSON.parse(localStorage.getItem('cart')) || [];
//             cart.push({ name, price });
//             localStorage.setItem('cart', JSON.stringify(cart));

//             alert(`${name} added to cart`);
//         }
//     }

//     typeCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterProducts));
//     brandCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterProducts));
//     priceFilter.addEventListener('change', filterProducts);
//     searchInput.addEventListener('input', filterProducts);

//     // Toggle filter section visibility on mobile
//     toggleFilter.addEventListener('click', () => {
//         filterSection.style.display = (filterSection.style.display === 'none' || filterSection.style.display === '') ? 'block' : 'none';
//     });

//     // Clear filters
//     clearFilters.addEventListener('click', clearAllFilters);

//     // Add to cart functionality
//     productList.addEventListener('click', addToCart);

//     filterProducts(); // Initial filter
// });

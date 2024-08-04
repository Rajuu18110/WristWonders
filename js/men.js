
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const typeCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="type"]');
    const brandCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="brand"]');
    const priceFilter = document.getElementById('watchPrice');
    const searchInput = document.getElementById('searchInput');
    const productList = document.getElementById('productList');
    const filterSection = document.querySelector('.filter-section');
    const toggleFilter = document.getElementById('toggleFilter');
    const clearFilters = document.getElementById('clearFilters');

    // Function to load products from JSON
    async function loadProducts() {
        try {
            const response = await fetch('./js/watches_catalog.json');
            const data = await response.json();
            return data.products.filter(product => product.gender === 'men');
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    // Function to create a product card
    function createProductCard(product) {
        const hasDiscount = product.discount > 0;
        const discountedPrice = product.price - (product.price * (product.discount / 100));
        const productUrl = `./productView.html?name=${encodeURIComponent(product.product_id)}`;

        // Generate star ratings
        const rating = product.rating || 0; // Assuming product.rating is a number between 0 and 5
        const numRatings = product.numRatings || 0; // Number of people who rated

        const stars = Array.from({ length: 5 }, (_, index) => {
            const isFull = index < Math.floor(rating);
            const isHalf = index === Math.floor(rating) && (rating % 1) >= 0.5;
            return `
                <i class="bi bi-star${isFull ? '-fill' : ''}${isHalf ? '-half' : ''}"></i>
            `;
        }).join('');

        return `
            <div class="col product" data-type="${product.watch_type}" data-price="${product.price}" data-brand="${product.company}">
                <div class="card h-100">
                    <img src="${product.image_url}" class="card-img-top p-2 product-image" data-url="${productUrl}" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title product-title" data-url="${productUrl}">${product.name}</h5>
                        <div class="star-rating mb-2">
                            ${stars}
                            <span class="ms-2">(${numRatings} ratings)</span>
                        </div>
                        <h5>Company: ${product.company}</h5>
                        ${hasDiscount ? `
                            <h6>Price: <span class="text-muted"><s>$${product.price.toFixed(2)}</s></span></h6>
                            <h6>Discounted Price: $${discountedPrice.toFixed(2)}</h6>
                        ` : `
                            <h6>Price: $${product.price.toFixed(2)}</h6>
                        `}
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary add-to-cart" data-name="${product.name}" data-price="${product.price}" data-disPrice="${discountedPrice.toFixed(2)}" data-image="${product.image_url}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Function to set up event listeners
    function setUpEventListeners() {
        // Add event listeners for product images and titles
        document.querySelectorAll('.product-image, .product-title').forEach(element => {
            element.addEventListener('click', function () {
                const productUrl = this.getAttribute('data-url');
                if (productUrl) {
                    window.location.href = productUrl;
                }
            });
        });
    }

    // Function to render products
    function renderProducts(products) {
        productList.innerHTML = products.map(createProductCard).join('');
        filterProducts(); // Apply filters to newly added products
        addCartEventListeners(); // Add event listeners to the new buttons
        setUpEventListeners(); // Set up event listeners for product images and titles
    }

    // Function to filter products
    function filterProducts() {
        const selectedTypes = Array.from(typeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const selectedBrands = Array.from(brandCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const priceValue = priceFilter.value;
        const searchValue = searchInput.value.toLowerCase();

        Array.from(productList.getElementsByClassName('product')).forEach(product => {
            const productType = product.getAttribute('data-type');
            const productPrice = parseFloat(product.getAttribute('data-price'));
            const productBrand = product.getAttribute('data-brand');
            const productName = product.querySelector('.card-title').textContent.toLowerCase();

            const showType = selectedTypes.length === 0 || selectedTypes.includes(productType);
            const showBrand = selectedBrands.length === 0 || selectedBrands.includes(productBrand);
            const showPrice = priceValue ?
                (priceValue === '500+' ? productPrice > 500 :
                    (productPrice >= parseFloat(priceValue.split('-')[0]) && productPrice <= parseFloat(priceValue.split('-')[1]))) :
                true;
            const showSearch = productName.includes(searchValue);

            if (showType && showBrand && showPrice && showSearch) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Function to clear all filters
    function clearAllFilters() {
        typeCheckboxes.forEach(checkbox => checkbox.checked = false);
        brandCheckboxes.forEach(checkbox => checkbox.checked = false);
        priceFilter.value = '';
        searchInput.value = '';
        filterProducts(); // Reapply filters after clearing
    }

    // Function to add item to cart
    function addToCart(name, price, disPrice, image) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1; // Increment quantity if item already exists
        } else {
            cart.push({ name, price, disPrice, image, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Item added to cart!');
    }

    // Function to add event listeners to "Add to Cart" buttons
    function addCartEventListeners() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const name = button.getAttribute('data-name');
                const price = parseFloat(button.getAttribute('data-price'));
                const disPrice = parseFloat(button.getAttribute('data-disPrice'));
                const image = button.getAttribute('data-image');
                addToCart(name, price, disPrice, image);
            });
        });
    }

    // Event listeners for filter changes
    typeCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterProducts));
    brandCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterProducts));
    priceFilter.addEventListener('change', filterProducts);
    searchInput.addEventListener('input', filterProducts);

    // Event listener for toggle filter button
    toggleFilter.addEventListener('click', () => {
        if (filterSection.style.display === 'none' || filterSection.style.display === '') {
            filterSection.style.display = 'block';
        } else {
            filterSection.style.display = 'none';
        }
    });

    // Event listener for clear filters button
    clearFilters.addEventListener('click', clearAllFilters);

    // Load and display products
    loadProducts().then(renderProducts);
});
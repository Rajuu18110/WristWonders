
document.addEventListener('DOMContentLoaded', () => {
    const typeCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="type"]');
    const brandCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="brand"]');
    const priceFilter = document.getElementById('watchPrice');
    const searchInput = document.getElementById('searchInput');
    const productList = document.getElementById('productList');
    const products = productList.getElementsByClassName('product');
    const filterSection = document.querySelector('.filter-section');
    const toggleFilter = document.getElementById('toggleFilter');
    const clearFilters = document.getElementById('clearFilters');

    function filterProducts() {
        const selectedTypes = Array.from(typeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        const selectedBrands = Array.from(brandCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const priceValue = priceFilter.value;
        const searchValue = searchInput.value.toLowerCase();

        Array.from(products).forEach(product => {
            const productType = product.getAttribute('data-type');
            const productPrice = parseFloat(product.getAttribute('data-price'));
            const productBrand = product.getAttribute('data-brand');
            const productName = product.querySelector('h4').textContent.toLowerCase();

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

    function clearAllFilters() {
        typeCheckboxes.forEach(checkbox => checkbox.checked = false);
        brandCheckboxes.forEach(checkbox => checkbox.checked = false);
        priceFilter.value = '';
        searchInput.value = '';
        filterProducts(); // Reapply filters after clearing
    }

    typeCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterProducts));
    brandCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterProducts));
    priceFilter.addEventListener('change', filterProducts);
    searchInput.addEventListener('input', filterProducts);

    // Toggle filter section visibility on mobile
    toggleFilter.addEventListener('click', () => {
        if (filterSection.style.display === 'none' || filterSection.style.display === '') {
            filterSection.style.display = 'block';
        } else {
            filterSection.style.display = 'none';
        }
    });

    // Clear filters
    clearFilters.addEventListener('click', clearAllFilters);

    filterProducts(); // Initial filter
});

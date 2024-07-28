
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
});

// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Select all elements with the class 'carousel-item'
    const carouselItems = document.querySelectorAll('.carousel-item');

    // Use a for loop to iterate over carouselItems
    carouselItems.forEach((item, index) => {
        // Index is 0-based, so add 1 to match your IDs
        const imgSell1 = item.querySelector(`#imgSell${index + 1}`);
        const imgSell2 = item.querySelector(`#imgSell${index + 1}${index + 1}`);

        // Check if both images exist in the current carousel item
        if (imgSell1 && imgSell2) {
            // Add mouseover event listener
            item.querySelector('.card-img').addEventListener('mouseover', () => {
                imgSell1.style.display = 'none';
                imgSell2.style.display = 'block';
            });

            // Add mouseout event listener
            item.querySelector('.card-img').addEventListener('mouseout', () => {
                imgSell1.style.display = 'block';
                imgSell2.style.display = 'none';
            });
        }
    });
});

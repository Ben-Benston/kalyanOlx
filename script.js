// Fetch product data from DummyJSON API
async function fetchProducts() {
    const response = await fetch('https://dummyjson.com/products?limit=0');
    const data = await response.json();
    // Return the products array (already limited to 30)
    return data.products.sort(() => 0.5 - Math.random()).slice(0, 30);
}

// Populate listings and special pick
async function loadContent() {
    const products = await fetchProducts();

    // Set Special Pick (first product)
    const specialPick = products[0];
    document.getElementById('specialImage').src = specialPick.thumbnail;
    document.getElementById('specialTitle').textContent = specialPick.title;
    document.getElementById('specialDetails').textContent = `Price: ₹${specialPick.price.toFixed(2)} | Quantity: ${specialPick.stock}`;

    // Populate Listings
    const listingsContainer = document.getElementById('listings');
    products.forEach((product, index) => {
        const card = `
            <div class="col">
                <div class="card h-100" data-bs-toggle="modal" data-bs-target="#productModal" onclick="showDetails(${index})">
                    <img src="${product.thumbnail}" class="card-img-top listing-img" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">Price: ₹${product.price.toFixed(2)} | Quantity: ${product.stock}</p>
                    </div>
                </div>
            </div>
        `;
        listingsContainer.innerHTML += card;
    });

    // Store products globally for modal access
    window.products = products;
}

// Show product details in modal
function showDetails(index) {
    const product = window.products[index];
    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalPrice').textContent = `₹${product.price.toFixed(2)}`;
    document.getElementById('modalQuantity').textContent = product.stock;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalImage').src = product.thumbnail;

    // Populate extra images, including the original thumbnail
    const extraImages = document.getElementById('extraImages');
    extraImages.innerHTML = '';

    // Start with the original thumbnail in the extra images list
    const allImages = [product.thumbnail, ...product.images.slice(0, 2)]; // Thumbnail + first 2 extra images
    allImages.forEach((imgSrc, imgIndex) => {
        const imgElement = document.createElement('img');
        imgElement.src = imgSrc;
        imgElement.alt = `Image ${imgIndex + 1}`;
        imgElement.classList.add('cursor-pointer');
        imgElement.addEventListener('click', () => {
            // Swap the main image with the clicked extra image
            const mainImage = document.getElementById('modalImage');
            mainImage.src = imgSrc;
        });
        extraImages.appendChild(imgElement);
    });

    // Reset form
    document.getElementById('contactForm').reset();
}

// Handle form submission (placeholder)
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Form submitted! Firebase integration coming soon.');
});

// Load content on page load
loadContent();
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCGY8ptnOXcS_i_Ja1n2_4Wyqn9Qi9VrlQ",
    authDomain: "kalyanolx.firebaseapp.com",
    projectId: "kalyanolx",
    storageBucket: "kalyanolx.firebasestorage.app",
    messagingSenderId: "773128527686",
    appId: "1:773128527686:web:8b29d715c07334fd944f47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

// Fetch products and return a Promise
function fetchProducts() {
    const colRef = collection(db, 'products');
    let products = [];
    return getDocs(colRef)
        .then((data) => {
            data.docs.forEach((file) => {
                products.push({ ...file.data(), id: file.id });
            });
            return products;
        })
        .catch(err => {
            console.log("Error fetching products:", err);
            return [];
        });
}

// Populate listings and special pick
function loadContent() {
    fetchProducts()
        .then(products => {
            // Set Special Pick (first product)
            const specialPick = products[0];
            document.getElementById('specialImage').src = specialPick.images[0];
            document.getElementById('specialTitle').textContent = specialPick.title;
            document.getElementById('specialDetails').textContent = `Price: ₹${specialPick.price.toFixed(2)} | Quantity: ${specialPick.stock}`;

            // Populate Listings
            const listingsContainer = document.getElementById('listings');
            listingsContainer.innerHTML = '';  // Clear existing content
            products.forEach((product, index) => {
                const card = `
                    <div class="col">
                        <div class="card h-100" data-bs-toggle="modal" data-bs-target="#productModal">
                            <img src="${product.images[0]}" class="card-img-top listing-img" alt="${product.title}">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">Price: ₹${product.price.toFixed(2)} | Quantity: ${product.stock}</p>
                            </div>
                        </div>
                    </div>
                `;
                listingsContainer.innerHTML += card;
            });

            // Add click event listeners to only listing cards (exclude Special Pick)
            const listingCards = listingsContainer.querySelectorAll('.card');
            listingCards.forEach((card, index) => {
                card.addEventListener('click', () => showDetails(index));
            });

            // Store products globally for modal access
            window.products = products;
        })
        .catch(err => {
            console.log("Error in loadContent:", err);
        });
}

// Show product details in modal
function showDetails(index) {
    const product = window.products[index];
    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalPrice').textContent = `₹${product.price.toFixed(2)}`;
    document.getElementById('modalQuantity').textContent = product.stock;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalImage').src = product.images[0];

    // Populate extra images
    const extraImages = document.getElementById('extraImages');
    extraImages.innerHTML = '';
    const allImages = product.images;
    allImages.forEach((imgSrc, imgIndex) => {
        const imgElement = document.createElement('img');
        imgElement.src = imgSrc;
        imgElement.alt = `Image ${imgIndex + 1}`;
        imgElement.classList.add('cursor-pointer');
        imgElement.addEventListener('click', () => {
            document.getElementById('modalImage').src = imgSrc;
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
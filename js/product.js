class Product {
    constructor() {
        this.originalPrice = 369.00;
        this.discountedPrice = 249.99;
        this.quantity = 1;
        this.maxQuantity = 10;
        
        this.quantityInput = document.getElementById('quantity');
        this.originalPriceElement = document.querySelector('.original-price');
        this.discountedPriceElement = document.querySelector('.discounted-price');
        this.minusBtn = document.querySelector('.quantity-btn.minus');
        this.plusBtn = document.querySelector('.quantity-btn.plus');
        this.addToCartBtn = document.querySelector('.add-to-cart-btn');
        
        // Set initial attributes for quantity input
        this.quantityInput.setAttribute('max', this.maxQuantity);
        this.quantityInput.setAttribute('min', 1);
        
        this.setupEventListeners();
        this.updatePrices();
        this.updateButtonStates();
    }

    setupEventListeners() {
        // Quantity controls
        this.minusBtn.addEventListener('click', () => this.decreaseQuantity());
        this.plusBtn.addEventListener('click', () => this.increaseQuantity());
        this.quantityInput.addEventListener('change', (e) => this.setQuantity(parseInt(e.target.value)));
        this.quantityInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value > this.maxQuantity) {
                e.target.value = this.maxQuantity;
                this.setQuantity(this.maxQuantity);
            }
        });
        
        // Add to cart
        this.addToCartBtn.addEventListener('click', () => this.addToCart());
        
        // Image gallery
        this.setupImageGallery();
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
            this.quantityInput.value = this.quantity;
            this.updatePrices();
            this.updateButtonStates();
        }
    }

    increaseQuantity() {
        if (this.quantity < this.maxQuantity) {
            this.quantity++;
            this.quantityInput.value = this.quantity;
            this.updatePrices();
            this.updateButtonStates();
        }
    }

    setQuantity(value) {
        if (value >= 1 && value <= this.maxQuantity) {
            this.quantity = value;
            this.quantityInput.value = value;
            this.updatePrices();
            this.updateButtonStates();
        } else {
            this.quantityInput.value = this.quantity;
        }
    }

    updateButtonStates() {
        this.minusBtn.disabled = this.quantity <= 1;
        this.plusBtn.disabled = this.quantity >= this.maxQuantity;
    }

    updatePrices() {
        const totalOriginal = (this.originalPrice * this.quantity).toFixed(2);
        const totalDiscounted = (this.discountedPrice * this.quantity).toFixed(2);
        
        this.originalPriceElement.textContent = `$${totalOriginal}`;
        this.discountedPriceElement.textContent = `$${totalDiscounted}`;
    }

    addToCart() {
        const quantity = parseInt(this.quantityInput.value);
        if (quantity >= 1 && quantity <= this.maxQuantity) {
            // Show success message
            const message = document.createElement('div');
            message.className = 'cart-message';
            message.textContent = `${quantity} item(s) added to cart!`;
            document.body.appendChild(message);

            // Remove message after 3 seconds
            setTimeout(() => {
                message.remove();
            }, 3000);
        }
    }

    setupImageGallery() {
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Update main image
                mainImage.src = thumb.src;
                
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }
}

// Initialize product when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.product = new Product();
}); 
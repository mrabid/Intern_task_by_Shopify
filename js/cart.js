class Cart {
    constructor() {
        this.items = [];
        this.drawer = document.getElementById('cartDrawer');
        this.overlay = document.getElementById('cartOverlay');
        this.cartContent = document.querySelector('.cart-content');
        this.totalElement = document.querySelector('.cart-total');
        this.cartCount = document.querySelector('.cart-count');
        this.cartBtn = document.getElementById('cartBtn');
        
        this.loadCart();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Open cart
        document.querySelector('.add-to-cart-btn').addEventListener('click', () => this.addToCart());
        this.cartBtn.addEventListener('click', () => this.openCart());
        
        // Close cart
        document.querySelector('.close-cart').addEventListener('click', () => this.closeCart());
        this.overlay.addEventListener('click', () => this.closeCart());
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeCart();
        });
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartUI();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    addToCart() {
        const quantity = parseInt(document.getElementById('quantity').value);
        
        const product = {
            id: 'helio-pet-device',
            name: 'Helio Pet Device™',
            price: 249.99,
            comparePrice: 369.00,
            image: 'assets/1.png',
            quantity: quantity
        };

        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity = Math.min(10, existingItem.quantity + quantity);
        } else {
            this.items.push(product);
        }

        this.saveCart();
        this.updateCartUI();
        this.openCart();
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, action, value) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return;

        let newQuantity;
        switch (action) {
            case 'increase':
                newQuantity = Math.min(10, item.quantity + 1);
                break;
            case 'decrease':
                newQuantity = Math.max(1, item.quantity - 1);
                break;
            case 'set':
                newQuantity = Math.max(1, Math.min(10, value));
                break;
            default:
                return;
        }

        item.quantity = newQuantity;
        this.saveCart();
        this.updateCartUI();
    }

    updateCartUI() {
        const cartContent = this.cartContent;
        const cartTotal = this.totalElement;
        const cartCount = this.cartCount;

        // Update cart count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update cart content
        if (this.items.length === 0) {
            cartContent.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartTotal.textContent = '$0.00';
            return;
        }

        cartContent.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">
                        <span class="unit-price">
                            <span class="compare-price">$${item.comparePrice.toFixed(2)}</span>
                            <span class="selling-price">$${item.price.toFixed(2)}</span>
                        </span>
                        <span class="total-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        // Update total
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;

        // Add event listeners for quantity buttons and remove buttons
        cartContent.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const action = e.target.classList.contains('plus') ? 'increase' : 'decrease';
                this.updateQuantity(id, action);
            });
        });

        cartContent.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                const quantity = parseInt(e.target.value);
                if (quantity >= 1 && quantity <= 10) {
                    this.updateQuantity(id, 'set', quantity);
                } else {
                    e.target.value = this.items.find(item => item.id === id).quantity;
                }
            });
        });

        cartContent.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.cart-item-remove').dataset.id;
                this.removeFromCart(id);
            });
        });
    }

    openCart() {
        this.drawer.classList.add('open');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        this.drawer.classList.remove('open');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
}); 
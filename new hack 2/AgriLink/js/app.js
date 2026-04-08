// AgriLink Main App Controller
// Coordinates UI, routing, and initializes modules

class App {
    constructor() {
        this.init();
    }

    init() {
        // Import modules
        this.auth = new Auth();
        this.products = new Products();
        this.orders = new Orders();

        // Handle page load
        this.handlePageLoad();
        
        // Listen for storage changes (simulates real-time updates)
        window.addEventListener('storage', this.handleStorageChange.bind(this));
    }

    handlePageLoad() {
        const currentUser = this.auth.getCurrentUser();
        
        // Protect dashboard routes
        if (window.location.pathname.includes('farmer.html') && (!currentUser || currentUser.role !== 'farmer')) {
            this.redirectToLogin();
            return;
        }
        
        if (window.location.pathname.includes('buyer.html') && (!currentUser || currentUser.role !== 'buyer')) {
            this.redirectToLogin();
            return;
        }

        // Initialize current page
        this.initCurrentPage();
    }

    initCurrentPage() {
        if (document.querySelector('.dashboard')) {
            this.renderDashboard();
        }
        if (document.querySelector('#product-list')) {
            this.renderProducts();
        }
        if (document.querySelector('#orders-list')) {
            this.renderOrders();
        }
        if (document.querySelector('#marketplace-products')) {
            this.renderMarketplace();
        }
    }

    redirectToLogin() {
        window.location.href = 'login.html';
    }

    handleStorageChange(e) {
        // Re-render affected sections on storage change
        if (e.key === 'products' || e.key === 'orders') {
            this.initCurrentPage();
        }
    }

    async renderDashboard() {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        if (currentUser.role === 'farmer') {
            const productsCount = await this.products.getProducts().length;
            const ordersCount = await this.orders.getOrders().filter(o => o.farmerId === currentUser.id).length;
            document.getElementById('products-count').textContent = productsCount;
            document.getElementById('orders-count').textContent = ordersCount;
        } else {
            const ordersCount = await this.orders.getOrders().filter(o => o.buyerId === currentUser.id).length;
            document.getElementById('buyer-orders-count').textContent = ordersCount;
            this.renderMarketplaceStats();
        }
    }

    async renderProducts() {
        const products = await this.products.getProducts();
        const container = document.getElementById('product-list');
        const currentUser = this.auth.getCurrentUser();
        const userProducts = products.filter(p => p.farmerId === currentUser.id);
        container.innerHTML = userProducts.map(product => `
            <div class="product-card">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price}</div>
                <div class="product-quantity">${product.quantity} available</div>
                <button onclick="app.products.deleteProduct('${product.id}')" class="btn btn-danger">Delete</button>
            </div>
        `).join('');
    }

    async renderOrders() {
        const currentUser = this.auth.getCurrentUser();
        const orders = await this.orders.getOrders();
        const userOrders = orders.filter(o => 
            (currentUser.role === 'farmer' && o.farmerId === currentUser.id) ||
            (currentUser.role === 'buyer' && o.buyerId === currentUser.id)
        );
        
        const container = document.getElementById('orders-list');
        container.innerHTML = userOrders.map(order => `
            <div class="order-item">
                <h4>Order #${order.id}</h4>
                <p>${order.productName} - $${order.total}</p>
                <p>Status: ${order.status}</p>
            </div>
        `).join('');
    }

    async renderMarketplace() {
        const products = await this.products.getProducts();
        const searchInput = document.getElementById('search-input');
        const container = document.getElementById('marketplace-products');
        
        const filterProducts = () => {
            const query = searchInput.value.toLowerCase();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.category.toLowerCase().includes(query)
            );
            container.innerHTML = filtered.map(p => this.createProductCardWithImage(p)).join('') || '<p style="text-align:center;color:#666;padding:2rem;">No products found. Farmers, add some products! 🌱</p>';
        };
        
        searchInput.addEventListener('input', filterProducts);
        
        // Initial render
        filterProducts();
    }

    createProductCardWithImage(product) {
        const currentUser = this.auth.getCurrentUser();
        const buyBtn = currentUser && currentUser.role === 'buyer' 
            ? `<button onclick="app.orders.placeOrder('${product.id}')" class="btn btn-primary" style="width:100%;">🛒 Buy Now</button>`
            : '<button disabled class="btn" style="opacity:0.6;background:#ccc;width:100%;">Login to Buy</button>';
        const imgSrc = this.getCategoryImage(product.category);
        return `
            <div class="product-card">
                <img src="${imgSrc}" alt="${product.name}" style="width:100%;height:200px;object-fit:cover;border-radius:15px 15px 0 0;">
                <div style="padding:1rem;">
                    <h3>${product.name}</h3>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-quantity">${product.quantity > 0 ? '${product.quantity} available' : 'Out of stock'}</div>
                    <div style="color:#666;">${product.category}</div>
                    ${buyBtn}
                </div>
            </div>
        `;
    }

    getCategoryImage(category) {
        const images = {
            'Vegetables': 'https://images.unsplash.com/photo-1504621240457-2f7431e9fa98?w=400&h=300&fit=crop',
            'Fruits': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
            'Grains': 'https://images.unsplash.com/photo-1610973366285-9dc6f6c93a1f?w=400&h=300&fit=crop',
            'Dairy': 'https://images.unsplash.com/photo-1514985662466-cd764c1c2305?w=400&h=300&fit=crop',
            'Other': 'https://images.unsplash.com/photo-1497812782815-56347156ebfe?w=400&h=300&fit=crop'
        };
        return images[category] || images['Other'];
    }

    renderMarketplaceStats() {
        // Could fetch stats from API in future
        document.getElementById('available-products').textContent = this.products.getProducts().length;
    }
}

// Global app instance
const app = new App();

// Expose methods globally for onclick handlers
window.app = app;

// Navbar logout functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('logout-btn')) {
        app.auth.logout();
        window.location.href = 'index.html';
    }
});

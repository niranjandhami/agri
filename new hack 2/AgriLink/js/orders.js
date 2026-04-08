// AgriLink Orders Module
// Handles order creation and management

class Orders {
    constructor() {
        this.STORAGE_KEY = 'agrilink_orders';
    }

    async getOrders() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async placeOrder(productId) {
        const currentUser = JSON.parse(localStorage.getItem('agrilink_currentUser'));
        if (!currentUser || currentUser.role !== 'buyer') {
            showMessage('Please login as buyer first', 'error');
            return;
        }

        const products = JSON.parse(localStorage.getItem('agrilink_products') || '[]');
        const product = products.find(p => p.id === productId);

        if (!product || product.quantity <= 0) {
            showMessage('Product not available', 'error');
            return;
        }

        try {
            const orders = await this.getOrders();
            const newOrder = {
                id: Date.now().toString(),
                buyerId: currentUser.id,
                farmerId: product.farmerId,
                productId,
                productName: product.name,
                total: product.price, // Single unit for simplicity
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            orders.push(newOrder);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));

            // Update product quantity
            product.quantity -= 1;
            const updatedProducts = products.map(p => p.id === productId ? {...p, quantity: product.quantity} : p);
            localStorage.setItem('agrilink_products', JSON.stringify(updatedProducts));

            showMessage('Order placed successfully!', 'success');
            app.renderOrders();
            app.renderDashboard();
        } catch (e) {
            showMessage('Error placing order', 'error');
        }
    }

    // Future API integration
    async createOrderAPI(orderData) {
        // return fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderData) })
        console.log('Future: Create order via API');
    }
}

// Global instance
window.Orders = new Orders();

// Expose placeOrder globally for onclick
window.placeOrder = (productId) => {
    window.Orders.placeOrder(productId);
};

function showMessage(text, type) {
    const existing = document.querySelector('.success, .error');
    if (existing) existing.remove();
    
    const div = document.createElement('div');
    div.className = `${type}`;
    div.textContent = text;
    document.querySelector('main').prepend(div);
    
    setTimeout(() => div.remove(), 3000);
}

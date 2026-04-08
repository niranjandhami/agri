// AgriLink Products Module
// CRUD operations with localStorage (API-ready)

class Products {
    constructor() {
        this.STORAGE_KEY = 'agrilink_products';
    }

    async getProducts() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async addProduct(productData) {
        try {
            const products = await this.getProducts();
            const newProduct = {
                id: Date.now().toString(),
                farmerId: JSON.parse(localStorage.getItem('agrilink_currentUser')).id,
                ...productData,
                createdAt: new Date().toISOString()
            };
            products.push(newProduct);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
            
            // Show success
            showMessage('Product added successfully!', 'success');
            return newProduct;
        } catch (e) {
            showMessage('Error adding product', 'error');
            console.error('Add product error:', e);
        }
    }

    async deleteProduct(productId) {
        try {
            const products = await this.getProducts();
            const filtered = products.filter(p => p.id !== productId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered.filter(p => p.quantity > 0 || p.farmerId !== JSON.parse(localStorage.getItem('agrilink_currentUser')).id)));
            
            // Re-render
            app.renderProducts();
            showMessage('Product deleted!', 'success');
        } catch (e) {
            showMessage('Error deleting product', 'error');
        }
    }

    // Future API methods
    async fetchProductsFromAPI() {
        // return fetch('/api/products')
        //     .then(res => res.json())
        console.log('Future: Fetch products from API');
    }
}

// Global instance
window.Products = new Products();

// Form handler
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-product-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('product-name').value,
                price: parseFloat(document.getElementById('product-price').value),
                quantity: parseInt(document.getElementById('product-quantity').value),
                category: document.getElementById('product-category').value
            };
            await window.Products.addProduct(formData);
            form.reset();
            app.renderDashboard();
        });
    }
});

function showMessage(text, type) {
    // Simple toast-like message
    const existing = document.querySelector('.success, .error');
    if (existing) existing.remove();
    
    const div = document.createElement('div');
    div.className = `${type}`;
    div.textContent = text;
    document.querySelector('main').prepend(div);
    
    setTimeout(() => div.remove(), 3000);
}

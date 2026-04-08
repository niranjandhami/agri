// Shopping Cart for Buyer
let cart = JSON.parse(localStorage.getItem('agrilink_cart') || '[]');

function addToCart(productId) {
    const product = JSON.parse(localStorage.getItem('agrilink_products') || '[]').find(p => p.id === productId);
    if (product && product.quantity > 0) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({id: productId, ...product, quantity: 1});
        }
        localStorage.setItem('agrilink_cart', JSON.stringify(cart));
        updateCartDisplay();
        alert('✅ Added to cart!');
    }
}

function updateCartDisplay() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    container.innerHTML = cart.length ? cart.map(item => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem;border-bottom:1px solid #eee;">
            <div>
                <h4>${item.name}</h4>
                <small>₹${item.price} x ${item.quantity}</small>
            </div>
            <div style="font-weight:bold;">₹${(item.price * item.quantity).toFixed(0)}</div>
        </div>
    `).join('') : '<p style="text-align:center;color:#666;">Cart empty. Browse marketplace!</p>';
    
    document.getElementById('buyer-orders-count').textContent = cart.length;
    document.getElementById('cart-total').textContent = total.toFixed(0);
    document.getElementById('total-price').textContent = `₹${total.toFixed(0)}`;
}

function checkout() {
    if (cart.length) {
        alert(`✅ Checkout complete! Paid ₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(0)}`);
        cart = [];
        localStorage.setItem('agrilink_cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Global access
window.addToCart = addToCart;
window.updateCartDisplay = updateCartDisplay;
window.checkout = checkout;


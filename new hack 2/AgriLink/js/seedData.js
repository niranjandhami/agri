// Simple seed - just products (no users)
function seedProducts() {
    const sampleProducts = [
        {id: '1', farmerId: 'farmer1', name: 'Organic Tomatoes', price: 249, quantity: 50, category: 'Vegetables'},
        {id: '2', farmerId: 'farmer1', name: 'Fresh Apples', price: 124, quantity: 100, category: 'Fruits'},
        {id: '3', farmerId: 'farmer1', name: 'Brown Rice', price: 416, quantity: 25, category: 'Grains'},
        {id: '4', farmerId: 'farmer1', name: 'Fresh Milk', price: 271, quantity: 30, category: 'Dairy'}
    ];

    if (!localStorage.getItem('agrilink_products')) {
        localStorage.setItem('agrilink_products', JSON.stringify(sampleProducts));
    }
}
seedProducts();

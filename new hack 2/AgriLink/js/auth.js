// AgriLink Authentication Module
// Future-ready for JWT/Firebase integration

class Auth {
    constructor() {
        this.STORAGE_KEY = 'agrilink_users';
        this.CURRENT_USER_KEY = 'agrilink_currentUser';
        this.initEventListeners();
    }

    initEventListeners() {
        const form = document.getElementById('auth-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleAuth(e));
        }
    }

    async handleAuth(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const btn = document.getElementById('auth-btn');
        const messageDiv = document.getElementById('auth-message');

        // Simulate API call
        btn.textContent = 'Signing in...';
        btn.disabled = true;

        // Try existing user first
        const users = await this.getUsers();
        const existingUser = users.find(u => u.email === email && u.password === password);

        let user;
        if (existingUser) {
            user = existingUser;
            this.setCurrentUser(user);
            this.showMessage('Welcome back!', 'success');
        } else if (role) {
            // Create new user
            user = {
                id: Date.now().toString(),
                email,
                password, // In production, hash this!
                role,
                createdAt: new Date().toISOString()
            };
            users.push(user);
            await this.saveUsers(users);
            this.setCurrentUser(user);
            this.showMessage('Account created successfully!', 'success');
        } else {
            this.showMessage('Please select a role or use demo credentials.', 'error');
            btn.textContent = 'Try Again';
            btn.disabled = false;
            return;
        }

        // Redirect based on role
        setTimeout(() => {
            if (user.role === 'farmer') {
                window.location.href = 'farmer.html';
            } else {
                window.location.href = 'buyer.html';
            }
        }, 1000);
    }

    async getUsers() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async saveUsers(users) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        } catch (e) {
            console.error('Auth save error:', e);
        }
    }

    setCurrentUser(user) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }

    getCurrentUser() {
        try {
            const data = localStorage.getItem(this.CURRENT_USER_KEY);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
    }

    // Future API integration
    async loginWithAPI(email, password) {
        // Replace with real API call
        // return fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({email, password}) })
        console.log('Future: API login');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new Auth();
});

function showMessage(text, type) {
    const div = document.getElementById('auth-message');
    div.textContent = text;
    div.className = `${type} ${div.className.replace(/error|success/g, '').trim()}`;
    div.classList.remove('hidden');
}

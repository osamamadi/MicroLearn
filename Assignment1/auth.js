// Authentication JavaScript for login and register pages

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Password visibility toggle
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = togglePassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember')?.checked || false;
            
            // Simple validation
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Check if user exists in localStorage (demo purposes)
            const users = JSON.parse(localStorage.getItem('microlearn_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Store logged in user
                localStorage.setItem('microlearn_user', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profileImage: user.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'
                }));
                
                showNotification('Login successful! Redirecting...', 'success');
                
                // Redirect to profile page after a short delay
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1500);
            } else {
                showNotification('Invalid email or password', 'error');
            }
        });
    }
    
    // Register form submission
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Hidden fields
            const searches = document.querySelector('input[name="searches"]').value;
            const videosWatched = document.querySelector('input[name="videosWatched"]').value;
            const quizzesCompleted = document.querySelector('input[name="quizzesCompleted"]').value;

            // Simple validation
            if (!name || !email || !password || !confirmPassword) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 8) {
                showNotification('Password must be at least 8 characters long', 'error');
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('microlearn_users') || '[]');
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                showNotification('Email already in use', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password, // In a real app, this would be hashed
                profileImage: 'https://www.w3schools.com/howto/img_avatar.png', // Default profile image
                createdAt: new Date().toISOString(),
                searches,
                videosWatched,
                quizzesCompleted
            };
            
            // Save to localStorage
            users.push(newUser);
            localStorage.setItem('microlearn_users', JSON.stringify(users));
            
            // Auto login
            localStorage.setItem('microlearn_user', JSON.stringify({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                profileImage: newUser.profileImage,
                searches: 0,
                videosWatched: 0,
                quizzesCompleted: 0
            }));

            
            showNotification('Account created successfully! Redirecting...', 'success');
            
            // Redirect to profile page after a short delay
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        });
    }
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('microlearn_user');
    
    if (isLoggedIn && (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html'))) {
        window.location.href = 'profile.html';
    }
});

// Notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}
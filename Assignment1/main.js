// Main JavaScript for the homepage

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('microlearn_user');
    
    // If logged in and on homepage, redirect to profile
    if (isLoggedIn && window.location.pathname === '/index.html') {
        const startLearningButtons = document.querySelectorAll('a[href="register.html"]');
        startLearningButtons.forEach(button => {
            button.href = 'search.html';
            if (button.textContent.trim() === 'Register' || 
                button.textContent.trim() === 'Create Free Account' ||
                button.textContent.trim() === 'Join MicroLearn Today') {
                button.textContent = 'Start Learning';
            }
        });
        
        // Update login links
        const loginLinks = document.querySelectorAll('a[href="login.html"]');
        loginLinks.forEach(link => {
            link.href = 'profile.html';
            if (link.textContent.trim() === 'Login') {
                link.textContent = 'My Profile';
            }
        });
    }
    
    // Animate on scroll (simple implementation)
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .step-card');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state for animation
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Check elements on load
    checkScroll();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkScroll);
});
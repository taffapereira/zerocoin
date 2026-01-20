// ===================================
// Zero Coin - Main JavaScript
// ===================================

// Contract Configuration
const ZERO_TOKEN = {
    address: '0xb918b6ad21211B075a0761b87b09561D2A5e5a1f',
    symbol: 'ZERO',
    decimals: 18,
    image: 'https://taffapereira.github.io/zerocoin/assets/logo-icon.png'
};

// ===================================
// Mobile Menu Toggle
// ===================================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// ===================================
// Smooth Scrolling
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip empty hash or just '#'
            if (!href || href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Add to MetaMask
// ===================================
async function addToMetaMask() {
    // Check if MetaMask is installed
    if (!window.ethereum) {
        alert('Please install MetaMask or another Web3 wallet to add ZERO token.\n\nYou can download MetaMask at: https://metamask.io');
        return;
    }
    
    try {
        // Request to add token to wallet
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: ZERO_TOKEN.address,
                    symbol: ZERO_TOKEN.symbol,
                    decimals: ZERO_TOKEN.decimals,
                    image: ZERO_TOKEN.image
                }
            }
        });
        
        if (wasAdded) {
            showNotification('ZERO token added to your wallet successfully!', 'success');
        } else {
            showNotification('Token was not added.', 'info');
        }
    } catch (error) {
        console.error('Error adding token to MetaMask:', error);
        
        if (error.code === 4001) {
            // User rejected the request
            showNotification('Request rejected. Please try again.', 'warning');
        } else {
            showNotification('Failed to add token. Please try again.', 'error');
        }
    }
}

// ===================================
// Copy Contract Address
// ===================================
function copyContractAddress() {
    const contractAddress = ZERO_TOKEN.address;
    const button = document.getElementById('copyContractBtn');
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(contractAddress)
            .then(() => {
                showCopyFeedback(button);
                showNotification('Contract address copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                fallbackCopy(contractAddress, button);
            });
    } else {
        fallbackCopy(contractAddress, button);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyFeedback(button);
            showNotification('Contract address copied to clipboard!', 'success');
        } else {
            showNotification('Failed to copy. Please copy manually.', 'error');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showNotification('Failed to copy. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textarea);
}

// Visual feedback for copy button
function showCopyFeedback(button) {
    if (!button) return;
    
    button.classList.add('copied');
    const originalHTML = button.innerHTML;
    
    button.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;
    
    setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = originalHTML;
    }, 2000);
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    const styles = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#00d4aa' : 
                         type === 'error' ? '#ff6b6b' : 
                         type === 'warning' ? '#ffa500' : '#4a90e2',
        color: '#ffffff',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease-out',
        maxWidth: '350px',
        fontSize: '0.9rem'
    };
    
    Object.assign(notification.style, styles);
    
    // Add animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        styleSheet.id = 'notification-styles';
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// ===================================
// FAQ Accordion
// ===================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===================================
// Navbar Background on Scroll
// ===================================
function initNavbarScroll() {
    const header = document.getElementById('header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 15, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 10, 15, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// ===================================
// Animate on Scroll
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll(
        '.feature-card, .tokenomics-card, .roadmap-phase, .faq-item'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// Event Listeners
// ===================================
function initEventListeners() {
    // Add to MetaMask button
    const addToMetaMaskBtn = document.getElementById('addToMetaMaskBtn');
    if (addToMetaMaskBtn) {
        addToMetaMaskBtn.addEventListener('click', addToMetaMask);
    }
    
    // Copy contract address button
    const copyContractBtn = document.getElementById('copyContractBtn');
    if (copyContractBtn) {
        copyContractBtn.addEventListener('click', copyContractAddress);
    }
}

// ===================================
// Initialize on DOM Load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Zero Coin - Initializing...');
    
    initMobileMenu();
    initSmoothScroll();
    initEventListeners();
    initFAQ();
    initNavbarScroll();
    initScrollAnimations();
    
    console.log('✅ Zero Coin - Ready!');
    console.log('Contract Address:', ZERO_TOKEN.address);
});

// ===================================
// Detect MetaMask
// ===================================
window.addEventListener('load', () => {
    if (window.ethereum) {
        console.log('✅ Web3 wallet detected');
    } else {
        console.log('⚠️ No Web3 wallet detected. Please install MetaMask.');
    }
});

// ===================================
// Handle visibility change (for animations)
// ===================================
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        console.log('👋 Welcome back!');
    }
});

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToMetaMask,
        copyContractAddress,
        showNotification
    };
}

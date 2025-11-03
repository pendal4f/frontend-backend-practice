// Accessibility enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupSkipLink();
        this.setupFormValidation();
        this.setupLiveRegions();
        this.setupFocusManagement();
        this.setupAriaUpdates();
    }

    setupSkipLink() {
        // Add skip link if not present
        if (!document.getElementById('skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.id = 'skip-link';
            skipLink.textContent = 'Перейти к основному контенту';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }
    }

    setupFormValidation() {
        // Enhanced form validation with ARIA
        const forms = document.querySelectorAll('form[novalidate]');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.announceFormErrors(form);
                }
                
                form.classList.add('was-validated');
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    if (input.classList.contains('is-invalid')) {
                        this.validateField(input);
                    }
                });
            });
        });
    }

    validateField(field) {
        const isValid = field.checkValidity();
        const errorElement = document.getElementById(`${field.id}-error`);
        
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            field.setAttribute('aria-invalid', 'false');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            field.setAttribute('aria-invalid', 'true');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
        }
    }

    announceFormErrors(form) {
        const invalidFields = form.querySelectorAll(':invalid');
        const errorCount = invalidFields.length;
        
        if (errorCount > 0) {
            const message = `В форме обнаружено ${errorCount} ошибок. Пожалуйста, исправьте выделенные поля.`;
            this.announceToScreenReader(message);
            
            // Focus first invalid field
            invalidFields[0].focus();
        }
    }

    setupLiveRegions() {
        // Create live region for dynamic updates
        if (!document.getElementById('a11y-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'a11y-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('a11y-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear message after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    setupFocusManagement() {
        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && document.querySelector('.modal.show')) {
                this.trapFocus(e);
            }
        });

        // Focus management for single page apps
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]') || 
                e.target.closest('a[href^="#"]')) {
                setTimeout(() => {
                    this.focusOnContent();
                }, 100);
            }
        });
    }

    trapFocus(e) {
        const modal = document.querySelector('.modal.show');
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    focusOnContent() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.focus();
        }
    }

    setupAriaUpdates() {
        // Update ARIA attributes dynamically
        this.updateMobileNavigationARIA();
        this.updateThemeToggleARIA();
    }

    updateMobileNavigationARIA() {
        const navToggle = document.getElementById('navToggle');
        const mainNav = document.getElementById('mainNav');
        
        if (navToggle && mainNav) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                
                const label = isExpanded ? 'Открыть меню' : 'Закрыть меню';
                navToggle.setAttribute('aria-label', label);
            });
        }
    }

    updateThemeToggleARIA() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isPressed = themeToggle.getAttribute('aria-pressed') === 'true';
                themeToggle.setAttribute('aria-pressed', !isPressed);
                
                const theme = !isPressed ? 'тёмную' : 'светлую';
                this.announceToScreenReader(`Тема переключена на ${theme} тему`);
            });
        }
    }
}

// Enhanced responsive.js with accessibility
class AccessibleResponsiveManager extends ResponsiveManager {
    setupMobileNavigation() {
        super.setupMobileNavigation();
        
        const navToggle = document.getElementById('navToggle');
        const mainNav = document.getElementById('mainNav');
        
        if (navToggle && mainNav) {
            // Update ARIA attributes on toggle
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mainNav.classList.contains('nav--mobile-open')) {
                    this.closeMobileNavigation();
                    navToggle.focus();
                }
            });

            // Trap focus in mobile navigation
            mainNav.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && mainNav.classList.contains('nav--mobile-open')) {
                    this.trapMobileNavigationFocus(e, mainNav);
                }
            });
        }
    }

    trapMobileNavigationFocus(e, nav) {
        const focusableElements = nav.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    setupCounterAnimation() {
        const counters = document.querySelectorAll('.stat-card__number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                    
                    // Announce completion to screen readers
                    const label = entry.target.parentElement.querySelector('.stat-card__label').textContent;
                    setTimeout(() => {
                        const value = entry.target.dataset.count;
                        accessibilityManager.announceToScreenReader(`${label}: ${value}`);
                    }, 2000);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }
}

// Initialize accessibility features
const accessibilityManager = new AccessibilityManager();

// Replace original ResponsiveManager with accessible version
document.addEventListener('DOMContentLoaded', () => {
    new AccessibleResponsiveManager();
});
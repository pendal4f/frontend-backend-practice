// Enhanced contacts form with accessibility
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            } else {
                // Focus first invalid field
                const firstInvalid = contactForm.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });

        function validateField(field) {
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
            
            return isValid;
        }

        function validateForm() {
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }

        function submitForm() {
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Отправка...';
            submitBtn.setAttribute('aria-label', 'Отправка сообщения');
            
            // Simulate API call
            setTimeout(() => {
                // Success message
                accessibilityManager.announceToScreenReader('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
                
                // Show success UI
                showSuccessMessage();
                
                // Reset form
                contactForm.reset();
                contactForm.classList.remove('was-validated');
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.setAttribute('aria-label', 'Отправить сообщение');
            }, 2000);
        }

        function showSuccessMessage() {
            // Create success alert
            const alert = document.createElement('div');
            alert.className = 'alert alert-success alert-dismissible fade show';
            alert.setAttribute('role', 'alert');
            alert.innerHTML = `
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong>Успешно!</strong> Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
            `;
            
            // Insert before form
            contactForm.parentNode.insertBefore(alert, contactForm);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 5000);
        }
    }
});
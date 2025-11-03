// Enhanced accessibility with Lighthouse optimizations
class LighthouseAccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupPerformanceOptimizations();
        this.setupLazyLoading();
        this.setupInteractionTracking();
        this.setupSEOOptimizations();
        this.setupCoreWebVitals();
    }

    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Defer non-critical CSS
        this.loadNonCriticalCSS();
        
        // Optimize images
        this.optimizeImages();
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }

    loadNonCriticalCSS() {
        // Load non-critical CSS after page load
        window.addEventListener('load', () => {
            const nonCriticalCSS = [
                // Add any non-critical CSS files here
            ];
            
            nonCriticalCSS.forEach(cssFile => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssFile;
                document.head.appendChild(link);
            });
        });
    }

    optimizeImages() {
        // Add loading lazy to non-critical images
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach((img, index) => {
            if (index > 2) { // First 3 images load normally
                img.loading = 'lazy';
            }
        });
    }

    setupLazyLoading() {
        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        this.handleLazyElement(element);
                        lazyObserver.unobserve(element);
                    }
                });
            });

            // Observe lazy elements
            document.querySelectorAll('[data-lazy]').forEach(el => {
                lazyObserver.observe(el);
            });
        }
    }

    handleLazyElement(element) {
        const lazyType = element.dataset.lazy;
        
        switch(lazyType) {
            case 'image':
                const src = element.dataset.src;
                if (src) {
                    element.src = src;
                    element.removeAttribute('data-src');
                }
                break;
            case 'background':
                const bgImage = element.dataset.bg;
                if (bgImage) {
                    element.style.backgroundImage = `url(${bgImage})`;
                    element.removeAttribute('data-bg');
                }
                break;
        }
    }

    setupInteractionTracking() {
        // Track user interactions for analytics
        this.trackClicks();
        this.trackFormSubmissions();
        this.trackScrollDepth();
    }

    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            const interactiveElements = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
            
            if (interactiveElements.includes(target.tagName)) {
                this.logInteraction('click', target);
            }
        });
    }

    trackFormSubmissions() {
        document.addEventListener('submit', (e) => {
            this.logInteraction('form_submit', e.target);
        });
    }

    trackScrollDepth() {
        let scrollDepth = 0;
        
        window.addEventListener('scroll', () => {
            const newDepth = Math.round((window.scrollY / document.body.scrollHeight) * 100);
            
            if (newDepth > scrollDepth) {
                scrollDepth = newDepth;
                
                // Log at 25%, 50%, 75%, 100%
                if ([25, 50, 75, 100].includes(scrollDepth)) {
                    this.logInteraction('scroll_depth', scrollDepth);
                }
            }
        });
    }

    logInteraction(type, element) {
        // Here you would send data to analytics
        console.log('User interaction:', type, element);
    }

    setupSEOOptimizations() {
        // Add structured data
        this.addStructuredData();
        
        // Optimize meta tags
        this.optimizeMetaTags();
    }

    addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Халин Пётр Сергеевич",
            "jobTitle": "Студент-разработчик",
            "description": "Студент-разработчик, увлекаюсь веб и мобильной разработкой",
            "url": window.location.href,
            "sameAs": [
                "https://github.com/pendal4f"
            ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    optimizeMetaTags() {
        // Ensure viewport tag is present
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0';
            document.head.appendChild(viewport);
        }

        // Ensure description is present
        if (!document.querySelector('meta[name="description"]')) {
            const description = document.createElement('meta');
            description.name = 'description';
            description.content = 'Портфолио Петра Халина - студента-разработчика. Специализация: веб-разработка, JavaScript, React';
            document.head.appendChild(description);
        }
    }

    setupCoreWebVitals() {
        // Monitor Core Web Vitals
        this.monitorLCP();
        this.monitorFID();
        this.monitorCLS();
    }

    monitorLCP() {
        // Largest Contentful Paint
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        });

        observer.observe({entryTypes: ['largest-contentful-paint']});
    }

    monitorFID() {
        // First Input Delay
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        });

        observer.observe({entryTypes: ['first-input']});
    }

    monitorCLS() {
        // Cumulative Layout Shift
        let cls = 0;
        
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                    console.log('CLS:', cls);
                }
            });
        });

        observer.observe({entryTypes: ['layout-shift']});
    }
}

// Initialize Lighthouse optimizations
document.addEventListener('DOMContentLoaded', () => {
    new LighthouseAccessibilityManager();
});

// Service Worker for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
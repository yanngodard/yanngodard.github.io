document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.reveal');
    elementsToAnimate.forEach(el => observer.observe(el));

    /* Staggered Animation Observer */
    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const children = container.querySelectorAll('.tag'); // Specifically target tags, or use generic child class

                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('active');
                    }, index * 100); // 100ms delay between each item
                });

                observer.unobserve(container);
            }
        });
    }, { threshold: 0.2 });

    const staggerGroups = document.querySelectorAll('.tags-reveal-group');

    // Delay the start of the tag animation by 0.5 seconds after page load
    setTimeout(() => {
        staggerGroups.forEach(el => staggerObserver.observe(el));
    }, 500);
    /* Counter Animation */
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function (easeOutExpo) for smooth deceleration
                    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                    const currentCount = Math.floor(ease * target);
                    counter.innerText = currentCount;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target; // Ensure exact final value
                    }
                };

                requestAnimationFrame(updateCount);
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => counterObserver.observe(counter));
    /* Accordion Logic */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');

            // Toggle active class
            item.classList.toggle('active');

            // Handle max-height for smooth transition
            if (content) {
                if (item.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = null;
                }
            }

            // Optional: Close others?
            // Uncomment to enable "one at a time" behavior
            /*
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });
            */
        });
    });

    // Initialize active items
    document.querySelectorAll('.accordion-item.active .accordion-content').forEach(content => {
        content.style.maxHeight = content.scrollHeight + 'px';
    });
});

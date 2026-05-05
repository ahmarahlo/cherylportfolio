// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Follower has a slight delay via CSS transition, but we update its position instantly
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 50);
});

// Cursor Hover Effects
const hoverElements = document.querySelectorAll('a, .hover-shift, .tool-item, .project-item, .interactive-link, .skill-category');

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('cursor-hover');
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll, .fade-up, .fade-left, .fade-right').forEach(el => {
    observer.observe(el);
});

// Initialize Vanilla Tilt for 3D hover effects
VanillaTilt.init(document.querySelectorAll(".tilt-effect"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    scale: 1.02
});

// Simple Parallax Effect for Backgrounds
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.querySelectorAll('.parallax-bg').forEach(bg => {
        // Move background slightly opposite to scroll
        bg.style.transform = `translateY(${scrollY * 0.2}px)`;
    });
});

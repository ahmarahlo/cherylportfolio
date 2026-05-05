// Intro to Sidebar Transformation Logic
let isSidebarMode = false;

function enterSidebarMode() {
    if (isSidebarMode) return;
    isSidebarMode = true;
    document.body.classList.add('sidebar-mode');
    
    // Trigger intersection observer for the newly visible main content
    setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll, .fade-up, .fade-left, .fade-right').forEach(el => {
            observer.observe(el);
        });
    }, 500);
}

// Listen for mouse wheel scroll
window.addEventListener('wheel', (e) => {
    if (!isSidebarMode && e.deltaY > 0) {
        enterSidebarMode();
    }
});

// Listen for touch swipe
let touchStartY = 0;
window.addEventListener('touchstart', (e) => { 
    touchStartY = e.touches[0].clientY; 
});
window.addEventListener('touchmove', (e) => {
    if (!isSidebarMode) {
        let touchEndY = e.touches[0].clientY;
        if (touchStartY - touchEndY > 30) { // Swiped up
            enterSidebarMode();
        }
    }
});

// Sidebar Navigation
document.querySelectorAll('.sidebar-nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);

        // Check if cursor is over a red background
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el) {
            if (el.closest('.slide-red') || (isSidebarMode && el.closest('.red-sidebar'))) {
                cursor.classList.add('cursor-white');
                cursorFollower.classList.add('cursor-white');
            } else {
                cursor.classList.remove('cursor-white');
                cursorFollower.classList.remove('cursor-white');
            }
        }
    });

    const hoverElements = document.querySelectorAll('a, .hover-shift, .tool-item, .project-item, .interactive-link, .skill-category');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('cursor-hover');
        });
    });
}

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

// Reveal elements immediately that are in the sidebar
document.querySelectorAll('.red-sidebar .fade-up').forEach(el => {
    el.classList.add('is-visible');
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
    if (!isSidebarMode) return;
    const scrollY = window.scrollY;
    document.querySelectorAll('.parallax-bg').forEach(bg => {
        bg.style.transform = `translateY(${scrollY * 0.2}px)`;
    });
});

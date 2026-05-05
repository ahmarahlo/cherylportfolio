// Intro to Sidebar Transformation Logic
let isSidebarMode = false;

function enterSidebarMode() {
    if (window.innerWidth <= 768) return; // Disable on mobile
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
    if (!isSidebarMode && e.deltaY > 0 && window.innerWidth > 768) {
        enterSidebarMode();
    }
});

// Listen for touch swipe
let touchStartY = 0;
window.addEventListener('touchstart', (e) => { 
    touchStartY = e.touches[0].clientY; 
});
window.addEventListener('touchmove', (e) => {
    if (!isSidebarMode && window.innerWidth > 768) {
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
let cursorX = 0, cursorY = 0, followerX = 0, followerY = 0;

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;

        // Check background color under cursor for dynamic color change
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el) {
            if (el.closest('.bg-red') || el.closest('.slide-red') || el.closest('#red-sidebar') || el.closest('.tools-box')) {
                cursor.classList.add('cursor-white');
                cursorFollower.classList.add('cursor-white');
            } else {
                cursor.classList.remove('cursor-white');
                cursorFollower.classList.remove('cursor-white');
            }
        }
    });

    // Animation Loop for Smooth Cursor
    function animateCursor() {
        // Direct update for cursor
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        
        // Eased update for follower
        followerX += (cursorX - followerX) * 0.2;
        followerY += (cursorY - followerY) * 0.2;
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverElements = document.querySelectorAll('a, .hover-shift, .tool-item, .project-item, .interactive-link, .skill-category, .logo-box, .cutout-img');

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

// On mobile, just trigger everything immediately or when scrolled naturally
if (window.innerWidth <= 768) {
    document.querySelectorAll('.animate-on-scroll, .fade-up, .fade-left, .fade-right').forEach(el => {
        observer.observe(el);
    });
}

// Initialize Vanilla Tilt for 3D hover effects
VanillaTilt.init(document.querySelectorAll(".tilt-effect"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    scale: 1.02
});

// Simple Parallax Effect for Backgrounds
// Disabled scroll parallax as it causes heavy lag
/* window.addEventListener('scroll', () => { ... }); */

// Dynamic Mouse Parallax to make it "Alive"
let mouseParallaxActive = false;
let mouseX = 0, mouseY = 0;

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;
        
        if (!mouseParallaxActive) {
            mouseParallaxActive = true;
            requestAnimationFrame(() => {
                document.querySelectorAll('.parallax-bg').forEach(bg => {
                    // Apply slight opposite movement to mouse with 3d transform for perf
                    bg.style.transform = `translate3d(${mouseX * -30}px, ${mouseY * -30}px, 0)`;
                });
                mouseParallaxActive = false;
            });
        }
    });
}

// Hamburger Menu Logic
const hamburger = document.getElementById('hamburger-btn');
const mobileNav = document.querySelector('.sidebar-nav');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });
}

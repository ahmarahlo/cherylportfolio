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

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);

        // Check background color under cursor for dynamic color change
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el) {
            // Check if element or its parent has a red background
            if (el.closest('.bg-red') || el.closest('.slide-red') || el.closest('#red-sidebar') || el.closest('.tools-box')) {
                cursor.classList.add('cursor-white');
                cursorFollower.classList.add('cursor-white');
            } else {
                cursor.classList.remove('cursor-white');
                cursorFollower.classList.remove('cursor-white');
            }
        }
    });

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
window.addEventListener('scroll', () => {
    if (!isSidebarMode && window.innerWidth > 768) return;
    const scrollY = window.scrollY;
    document.querySelectorAll('.parallax-bg').forEach(bg => {
        // Move background up slower than scroll
        bg.style.transform = `translateY(${scrollY * 0.2}px)`;
    });
});

// Dynamic Mouse Parallax to make it "Alive"
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        document.querySelectorAll('.parallax-bg').forEach(bg => {
            // Check if there is already a scrollY transform to preserve it
            let currentScrollTransform = "";
            if (bg.style.transform && bg.style.transform.includes('translateY')) {
                currentScrollTransform = bg.style.transform.split(' ')[0]; // keeping the translateY from scroll
            }
            
            // Apply slight opposite movement to mouse
            bg.style.transform = `${currentScrollTransform} translate(${mouseX * -30}px, ${mouseY * -30}px)`;
        });
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

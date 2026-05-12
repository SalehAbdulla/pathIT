/* ===================================
   PathIT Presentation - Interactive Navigation
   Full Mark Grade Functionality
   =================================== */

// ===== GLOBAL VARIABLES =====
let currentSlide = 1;
const totalSlides = 29;
const notesVisible = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializePresentation();
    setupEventListeners();
    updateUI();
});

// ===== INITIALIZE PRESENTATION =====
function initializePresentation() {
    // Set first slide as active
    const firstSlide = document.querySelector('.slide[data-slide="1"]');
    if (firstSlide) {
        firstSlide.classList.add('active');
    }
    
    // Update progress bar and counter
    updateProgressBar();
    updateSlideCounter();
    
    // Log initialization
    console.log('PathIT Presentation Initialized');
    console.log(`Total Slides: ${totalSlides}`);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                previousSlide();
            }
        }
    }
    
    // Mouse wheel navigation (optional)
    let wheelTimeout;
    document.addEventListener('wheel', (e) => {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                nextSlide();
            } else if (e.deltaY < 0) {
                previousSlide();
            }
        }, 100);
    }, { passive: true });
    
    // Click on progress bar to jump to slide
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            const targetSlide = Math.ceil(percentage * totalSlides);
            goToSlide(targetSlide);
        });
        progressBar.style.cursor = 'pointer';
    }
}

// ===== KEYBOARD NAVIGATION =====
function handleKeyPress(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
        case 'PageDown':
            e.preventDefault();
            nextSlide();
            break;
            
        case 'ArrowLeft':
        case 'PageUp':
            e.preventDefault();
            previousSlide();
            break;
            
        case 'Home':
            e.preventDefault();
            goToSlide(1);
            break;
            
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides);
            break;
            
        case 'n':
        case 'N':
            e.preventDefault();
            toggleNotes();
            break;
            
        case 'f':
        case 'F':
            e.preventDefault();
            toggleFullscreen();
            break;
            
        case 'Escape':
            if (document.fullscreenElement) {
                exitFullscreen();
            }
            break;
            
        // Number keys for quick navigation
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            e.preventDefault();
            const slideNum = parseInt(e.key);
            if (slideNum <= totalSlides) {
                goToSlide(slideNum);
            }
            break;
    }
}

// ===== NAVIGATION FUNCTIONS =====
function nextSlide() {
    if (currentSlide < totalSlides) {
        goToSlide(currentSlide + 1);
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        goToSlide(currentSlide - 1);
    }
}

function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) {
        return;
    }
    
    // Get current and target slides
    const currentSlideEl = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
    const targetSlideEl = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
    
    if (!currentSlideEl || !targetSlideEl) {
        console.error(`Slide ${slideNumber} not found`);
        return;
    }
    
    // Determine direction
    const direction = slideNumber > currentSlide ? 'forward' : 'backward';
    
    // Remove active class from current slide
    currentSlideEl.classList.remove('active');
    
    // Add exit animation
    if (direction === 'forward') {
        currentSlideEl.classList.add('exit-left');
    }
    
    // Remove exit class after animation
    setTimeout(() => {
        currentSlideEl.classList.remove('exit-left');
    }, 500);
    
    // Update current slide number
    currentSlide = slideNumber;
    
    // Add active class to target slide
    targetSlideEl.classList.add('active');
    
    // Update UI
    updateUI();
    
    // Scroll to top of slide content
    const slideContent = targetSlideEl.querySelector('.slide-content');
    if (slideContent) {
        slideContent.scrollTop = 0;
    }
    
    // Log slide change
    console.log(`Navigated to Slide ${currentSlide}`);
}

// ===== UPDATE UI =====
function updateUI() {
    updateProgressBar();
    updateSlideCounter();
    updateNotesDisplay();
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const percentage = (currentSlide / totalSlides) * 100;
        progressFill.style.width = `${percentage}%`;
    }
}

function updateSlideCounter() {
    const counter = document.getElementById('slideCounter');
    if (counter) {
        counter.textContent = `${currentSlide} / ${totalSlides}`;
    }
}

function updateNotesDisplay() {
    const currentSlideEl = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
    const speakerNotesEl = currentSlideEl?.querySelector('.speaker-notes');
    const allNotes = document.querySelectorAll('.speaker-notes');
    
    // Hide all notes first
    allNotes.forEach(note => {
        note.classList.remove('visible');
    });
    
    // Show current slide's notes if notes are visible
    if (notesVisible && speakerNotesEl) {
        speakerNotesEl.classList.add('visible');
    }
}

// ===== SPEAKER NOTES =====
function toggleNotes() {
    notesVisible = !notesVisible;
    
    const notesToggle = document.getElementById('notesToggle');
    if (notesToggle) {
        notesToggle.textContent = notesVisible ? 'Press \'N\' to Hide Notes' : 'Press \'N\' for Notes';
    }
    
    updateNotesDisplay();
    
    console.log(`Speaker Notes: ${notesVisible ? 'Visible' : 'Hidden'}`);
}

// ===== FULLSCREEN =====
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE11
        elem.msRequestFullscreen();
    }
    
    console.log('Entered Fullscreen Mode');
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE11
        document.msExitFullscreen();
    }
    
    console.log('Exited Fullscreen Mode');
}

// ===== SLIDE TIMER (Optional) =====
let slideTimer = null;
let slideStartTime = null;

function startSlideTimer() {
    slideStartTime = Date.now();
}

function getSlideTime() {
    if (!slideStartTime) return 0;
    return Math.floor((Date.now() - slideStartTime) / 1000);
}

// Start timer when slide changes
const originalGoToSlide = goToSlide;
goToSlide = function(slideNumber) {
    if (slideTimer) {
        const timeSpent = getSlideTime();
        console.log(`Time on Slide ${currentSlide}: ${timeSpent}s`);
    }
    originalGoToSlide(slideNumber);
    startSlideTimer();
};

// ===== PRESENTATION OVERVIEW (Optional Feature) =====
function showOverview() {
    console.log('Presentation Overview:');
    console.log(`Current Slide: ${currentSlide} / ${totalSlides}`);
    console.log(`Progress: ${Math.round((currentSlide / totalSlides) * 100)}%`);
    
    const currentSlideEl = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
    const slideTitle = currentSlideEl?.querySelector('h2')?.textContent || 'Title Slide';
    console.log(`Current Slide Title: ${slideTitle}`);
}

// ===== EXPORT FUNCTIONS FOR CONSOLE ACCESS =====
window.presentationControls = {
    nextSlide,
    previousSlide,
    goToSlide,
    toggleNotes,
    toggleFullscreen,
    showOverview,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides
};

// ===== KEYBOARD SHORTCUTS HELP =====
function showKeyboardShortcuts() {
    console.log('%c PathIT Presentation - Keyboard Shortcuts', 'font-size: 16px; font-weight: bold; color: #028090;');
    console.log('%c Navigation:', 'font-weight: bold; color: #0EA5E9;');
    console.log('  → or Space or Page Down: Next Slide');
    console.log('  ← or Page Up: Previous Slide');
    console.log('  Home: Go to First Slide');
    console.log('  End: Go to Last Slide');
    console.log('  1-9: Jump to Slide Number');
    console.log('');
    console.log('%c Features:', 'font-weight: bold; color: #0EA5E9;');
    console.log('  N: Toggle Speaker Notes');
    console.log('  F: Toggle Fullscreen');
    console.log('  Esc: Exit Fullscreen');
    console.log('');
    console.log('%c Tips:', 'font-weight: bold; color: #0EA5E9;');
    console.log('  - Swipe left/right on mobile to navigate');
    console.log('  - Scroll mouse wheel to navigate');
    console.log('  - Click on progress bar to jump to slide');
    console.log('');
    console.log('%c Console Commands:', 'font-weight: bold; color: #0EA5E9;');
    console.log('  presentationControls.goToSlide(5) - Jump to slide 5');
    console.log('  presentationControls.showOverview() - Show presentation info');
    console.log('  presentationControls.getCurrentSlide() - Get current slide number');
}

// Show keyboard shortcuts on load
setTimeout(showKeyboardShortcuts, 1000);

// ===== AUTO-SAVE POSITION (Optional) =====
function savePosition() {
    localStorage.setItem('pathit_presentation_slide', currentSlide);
}

function loadPosition() {
    const savedSlide = localStorage.getItem('pathit_presentation_slide');
    if (savedSlide) {
        const slideNum = parseInt(savedSlide);
        if (slideNum >= 1 && slideNum <= totalSlides) {
            console.log(`Restored position: Slide ${slideNum}`);
            goToSlide(slideNum);
        }
    }
}

// Save position on slide change
const originalGoToSlide2 = goToSlide;
goToSlide = function(slideNumber) {
    originalGoToSlide2(slideNumber);
    savePosition();
};

// Ask to restore position on load
window.addEventListener('load', () => {
    const savedSlide = localStorage.getItem('pathit_presentation_slide');
    if (savedSlide && parseInt(savedSlide) > 1) {
        const restore = confirm(`Resume from Slide ${savedSlide}?`);
        if (restore) {
            loadPosition();
        }
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load heavy content
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01
};

const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const slide = entry.target;
            // Trigger any animations or load heavy content
            slide.style.willChange = 'transform, opacity';
        } else {
            const slide = entry.target;
            slide.style.willChange = 'auto';
        }
    });
}, observerOptions);

// Observe all slides
document.querySelectorAll('.slide').forEach(slide => {
    slideObserver.observe(slide);
});

// ===== PRESENTATION TIMER =====
let presentationStartTime = Date.now();

function getPresentationTime() {
    const elapsed = Date.now() - presentationStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Log presentation time every 5 minutes
setInterval(() => {
    console.log(`Presentation Time: ${getPresentationTime()}`);
}, 300000);

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Announce slide changes for screen readers
function announceSlideChange() {
    const currentSlideEl = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
    const slideTitle = currentSlideEl?.querySelector('h2')?.textContent || 'Slide';
    
    // Create or update aria-live region
    let announcement = document.getElementById('slide-announcement');
    if (!announcement) {
        announcement = document.createElement('div');
        announcement.id = 'slide-announcement';
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        document.body.appendChild(announcement);
    }
    
    announcement.textContent = `Slide ${currentSlide} of ${totalSlides}: ${slideTitle}`;
}

// Call announceSlideChange when navigating
const originalGoToSlide3 = goToSlide;
goToSlide = function(slideNumber) {
    originalGoToSlide3(slideNumber);
    announceSlideChange();
};

// ===== PREVENT CONTEXT MENU (Optional - for presentation mode) =====
// Uncomment if you want to prevent right-click during presentation
/*
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.log('Right-click disabled during presentation');
});
*/

// ===== PRESENTATION MODE INDICATOR =====
console.log('%c🚀 PathIT Presentation Ready!', 'font-size: 20px; font-weight: bold; color: #028090; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%c📊 Full Mark Grade Presentation System', 'font-size: 14px; color: #0EA5E9;');
console.log('%c⌨️  Press any key or swipe to navigate', 'font-size: 12px; color: #64748B;');

// ===== SLIDE-SPECIFIC INTERACTIONS =====
// Add any slide-specific interactive elements here

// Example: Animate timeline on Slide 9
function animateTimeline() {
    if (currentSlide === 9) {
        const markers = document.querySelectorAll('.timeline-marker');
        markers.forEach((marker, index) => {
            setTimeout(() => {
                marker.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    marker.style.transform = 'scale(1)';
                }, 300);
            }, index * 200);
        });
    }
}

// Call slide-specific animations
const originalGoToSlide4 = goToSlide;
goToSlide = function(slideNumber) {
    originalGoToSlide4(slideNumber);
    
    // Trigger slide-specific animations
    setTimeout(() => {
        animateTimeline();
    }, 300);
};

// ===== EXPORT PRESENTATION DATA =====
function exportPresentationData() {
    const data = {
        title: 'PathIT - IT E-Learning Platform',
        totalSlides: totalSlides,
        currentSlide: currentSlide,
        presentationTime: getPresentationTime(),
        timestamp: new Date().toISOString()
    };
    
    console.log('Presentation Data:', data);
    return data;
}

window.presentationControls.exportData = exportPresentationData;

// ===== PRINT PREPARATION =====
window.addEventListener('beforeprint', () => {
    console.log('Preparing for print...');
    // Show all slides for printing
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.opacity = '1';
        slide.style.visibility = 'visible';
        slide.style.position = 'relative';
    });
    
    // Show all speaker notes
    document.querySelectorAll('.speaker-notes').forEach(note => {
        note.style.display = 'block';
    });
});

window.addEventListener('afterprint', () => {
    console.log('Print complete. Restoring presentation state...');
    // Restore presentation state
    goToSlide(currentSlide);
});

// ===== IDLE DETECTION (Optional) =====
let idleTimer;
const idleTimeout = 300000; // 5 minutes

function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        console.log('Presentation idle for 5 minutes');
        // Optional: Show screensaver or return to first slide
    }, idleTimeout);
}

document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('keypress', resetIdleTimer);
document.addEventListener('touchstart', resetIdleTimer);

resetIdleTimer();

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        console.log('%c🎉 KONAMI CODE ACTIVATED! 🎉', 'font-size: 24px; font-weight: bold; color: #FF6B6B; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
        console.log('%c🚀 PathIT - Built by Champions!', 'font-size: 16px; color: #028090;');
        console.log('%cTeam: Saleh, Ali, Jassim, Hadi, Faisal', 'font-size: 14px; color: #0EA5E9;');
        
        // Add fun animation
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== PRESENTATION COMPLETE =====
console.log('%c✅ PathIT Presentation System Loaded Successfully', 'font-size: 14px; font-weight: bold; color: #10B981;');
console.log(`%c📍 Currently on Slide ${currentSlide} of ${totalSlides}`, 'font-size: 12px; color: #64748B;');
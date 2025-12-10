document.addEventListener('DOMContentLoaded', () => {
    const entrancePage = document.getElementById('entrance-page');
    const enterButton = document.getElementById('enter-button');
    const transitionOverlay = document.getElementById('transition-overlay');
    const transitionVideo = document.getElementById('transition-video');
    const bgMusic = document.getElementById('bg-music');
    const page2Main = document.getElementById('page-2-main');
    const invitationBox = document.querySelector('.main-invitation-box');
    const weddingDate = new Date("March 28, 2026 06:30:00").getTime();
    

    let audioPlayed = false;

    // =========================================================
    // 0. STAGGERED REVEAL FOR ENTRANCE PAGE CONTENT (KEPT)
    // =========================================================

    function revealEntrancePage() {
        // Find all elements marked for animation within the entrance page
        document.querySelectorAll('#entrance-page .fade-in-item').forEach((item, index) => {
            
            // Apply stagger delay for the ENTRANCE page only
            item.style.transitionDelay = `${index * 0.15}s`; 
            
            // Immediately apply the 'is-visible' class after the delay is set
            item.classList.add('is-visible');
        });
    }

    // Run the staggered reveal immediately when the page structure is loaded
    revealEntrancePage();


    // =========================================================
    // 1. ENTRANCE LOGIC
    // =========================================================

    enterButton.addEventListener('click', () => {
        // 1. Hide the entrance page immediately
        entrancePage.style.display = 'none';

        // 2. Show the transition overlay
        transitionOverlay.style.display = 'flex';
        
        // 3. Ensure the global background video is playing
        const bgVideo = document.getElementById('global-bg-video');
        if (bgVideo) {
            bgVideo.play().catch(e => console.log("BG video autoplay failed:", e));
        }

        // 4. Start playing the transition video
        transitionVideo.currentTime = 0;
        transitionVideo.play();

        // 5. Start music on user interaction
        if (!audioPlayed) {
            bgMusic.volume = 0.5; // Set volume lower
            bgMusic.play().then(() => {
                audioPlayed = true;
            }).catch(e => {
                console.error("Music autoplay failed:", e);
            });
        }
    });

    // =========================================================
    // 2. TRANSITION END LOGIC
    // =========================================================

    transitionVideo.onended = () => {
        // 1. Hide the transition
        transitionOverlay.style.display = 'none';
        
        // 2. Show Page 2 content and enable scrolling
        page2Main.style.display = 'block';
        document.body.style.overflowY = 'scroll'; // Enable global scrolling

        // 3. Start the main invitation box border fade-in
        invitationBox.classList.add('border-fade-in');
        
        // 4. Initialize Scroll Reveal for all content
        setupScrollReveal();
    };

    // =========================================================
    // 3. SCROLL REVEAL IMPLEMENTATION (Page 2 Simultaneous Reveal)
    // =========================================================

    function setupScrollReveal() {
        // Observer options: Trigger when 10% of the element is visible
        const observerOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.1 
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    // Element IS in view: Apply final visible state
                    element.style.transitionDelay = '0s'; // Ensures immediate fade-in
                    setTimeout(() => {
                        element.classList.add('is-visible');
                    }, 10);
                } else {
                    // Element IS NOT in view: Remove final state
                    element.classList.remove('is-visible');
                }
            });
        }, observerOptions);

        // Find all elements marked for animation *only within Page 2*
        document.querySelectorAll('#page-2-main .fade-in-item').forEach((item) => {
            // 💥 CRITICAL CHANGE: Set delay to 0s for simultaneous reveal 💥
            item.style.transitionDelay = '0s'; 
            observer.observe(item);
        });
    }
    
    // =========================================================
    // 4. COUNTDOWN TIMER LOGIC
    // =========================================================
    function startCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const daysElement = document.getElementById("days");
        const hoursElement = document.getElementById("hours");
        const minutesElement = document.getElementById("minutes");
        const secondsElement = document.getElementById("seconds");

        if (distance < 0) {
            clearInterval(timerInterval);
            if(daysElement) daysElement.closest('.timer-grid').innerHTML = `<span class="number-gold" style="font-size: 1.5em; width: 100%;">កម្មវិធីបានប្រព្រឹត្តទៅហើយ!</span>`;
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update HTML elements, padded with leading zero
        if(daysElement) daysElement.innerHTML = String(days).padStart(2, '0');
        if(hoursElement) hoursElement.innerHTML = String(hours).padStart(2, '0');
        if(minutesElement) minutesElement.innerHTML = String(minutes).padStart(2, '0');
        if(secondsElement) secondsElement.innerHTML = String(seconds).padStart(2, '0');
    }

    // Update the count down every 1 second
    const timerInterval = setInterval(startCountdown, 1000);
    startCountdown(); // Run once immediately to prevent flicker

    // =========================================================
    // 5. ADD TO CALENDAR LOGIC (Google Calendar Link)
    // =========================================================

    function setupCalendarLink() {
        const title = "ពិធីមង្គលអាពាហ៍ពិពាហ៍ | ឃុន ខាយស៊ីន & ពេជ្រ ម៉ានីកា";
        const description = "សូមគោរពអញ្ជើញលោក លោកស្រី ចូលរួមពិធីមង្គលអាពាហ៍ពិពាហ៍កូនប្រុស កូនស្រីរបស់យើងខ្ញុំ។";
        const location = "ដឹ ព្រេមៀ សេនធ័រ សែនសុខ (អាគារ D&E)";
        
        // Date format: YYYYMMDDTHHMMSSZ (UTC time)
        // Wedding starts 2026-03-28 06:30:00 (Phnom Penh is UTC+7)
        // Event duration: 8 hours (ends at 14:30)
        const startDateTime = "20260328T063000"; // Start time for the event
        const endDateTime = "20260328T143000";   // End time for the event
        
        const googleCalendarLink = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

        const calendarButton = document.getElementById('add-to-calendar');
        if(calendarButton) {
            calendarButton.href = googleCalendarLink;
        }
    }

    // Call the function to set the link when the page loads
    setupCalendarLink();


    // ... (The bottom part of your existing script.js remains the same) ...
});
// COLLECT ALL ALBUM IMAGES
const albumImages = document.querySelectorAll("#wedding-album .album-photo");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

let currentIndex = 0;

// OPEN LIGHTBOX
albumImages.forEach((img, index) => {
    img.addEventListener("click", () => {
        currentIndex = index;
        openLightbox();
    });
});

function openLightbox() {
    lightbox.style.display = "flex";

    lightboxImg.classList.remove("show");
    setTimeout(() => {
        lightboxImg.src = albumImages[currentIndex].src;
        lightboxImg.classList.add("show");
    }, 10);
}

// CLOSE LIGHTBOX
lightboxClose.addEventListener("click", () => {
    lightbox.style.display = "none";
});

// TOUCH SWIPE
let startX = 0;

lightbox.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

lightbox.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if (diff > 50) swipeNext();
    if (diff < -50) swipePrev();
});

// DESKTOP DRAG SWIPE
let isDown = false;
let dragStartX = 0;

lightbox.addEventListener("mousedown", (e) => {
    isDown = true;
    dragStartX = e.clientX;
});

lightbox.addEventListener("mouseup", (e) => {
    if (!isDown) return;
    isDown = false;

    let diff = dragStartX - e.clientX;
    if (diff > 50) swipeNext();
    if (diff < -50) swipePrev();
});

function swipeNext() {
     if (currentIndex < albumImages.length - 1) {
        lightboxImg.classList.remove("show");
        animateSwipe("left");

        currentIndex++;

        setTimeout(() => {
            lightboxImg.classList.remove("swipe-left");
            lightboxImg.src = albumImages[currentIndex].src;

            setTimeout(() => {
                lightboxImg.classList.add("show");
            }, 20);
        }, 320);
    }
}

function swipePrev() {
    if (currentIndex > 0) {
        lightboxImg.classList.remove("show");
        animateSwipe("right");

        currentIndex--;

        setTimeout(() => {
            lightboxImg.classList.remove("swipe-right");
            lightboxImg.src = albumImages[currentIndex].src;

            setTimeout(() => {
                lightboxImg.classList.add("show");
            }, 20);
        }, 320);
    }
}

function animateSwipe(direction) {
    lightboxImg.classList.add(direction === "left" ? "swipe-left" : "swipe-right");
}
// =========================================================
    // X. WISH FORM SUBMISSION HANDLER (NEW)
    // =========================================================
    
    const wishForm = document.getElementById('wishForm');
    const submissionStatus = document.getElementById('submissionStatus');

    if (wishForm) {
        wishForm.addEventListener('submit', function(event) {
            // Stop the page from refreshing
            event.preventDefault();

            // Gather data and trim whitespace
            const guestName = document.getElementById('guestName').value.trim();
            const wishMessage = document.getElementById('wishMessage').value.trim();

            // Simple validation
            if (!guestName || !wishMessage) {
                submissionStatus.textContent = 'Please enter both your name and a message.';
                submissionStatus.style.color = 'red';
                return;
            }

            // --- Simulation of Submission ---
            // In a real project, you would use 'fetch' or AJAX here to send the data to a server.
            
            console.log("--- New Wish Submitted ---");
            console.log(`Name: ${guestName}`);
            console.log(`Message: ${wishMessage}`);

            // User Feedback
            submissionStatus.textContent = 'សូមអរគុណ! Your message has been sent to the couple!';
            submissionStatus.style.color = 'green';
            
            // Clear Form
            wishForm.reset();

            // Clear Status Message after a delay
            setTimeout(() => {
                submissionStatus.textContent = '';
            }, 5000); 
        });
    }
    
    // ... ensure this code is placed before the final closing '});' of your DOMContentLoaded listener.
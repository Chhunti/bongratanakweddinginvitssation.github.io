document.addEventListener('DOMContentLoaded', () => {
    // === DOM ELEMENT SELECTION ===
    const entrancePage = document.getElementById('entrance-page');
    const enterButton = document.getElementById('enter-button');
    const transitionOverlay = document.getElementById('transition-overlay');
    const transitionVideo = document.getElementById('transition-video');
    const bgMusic = document.getElementById('bg-music');
    const page2Main = document.getElementById('page-2-main');
    const invitationBox = document.querySelector('.main-invitation-box');
    
    // === GLOBAL VARIABLES ===
    const weddingDate = new Date("March 28, 2026 06:30:00").getTime();
    let audioPlayed = false;

    // 💥 IMPORTANT: REPLACE THIS URL with your actual Sheet Monkey/SheetDB API URL 💥
    const WISH_API_URL = 'YOUR_API_SUBMISSION_ENDPOINT_HERE'; 


    // =========================================================
    // 0. STAGGERED REVEAL FOR ENTRANCE PAGE CONTENT
    // =========================================================

    function revealEntrancePage() {
        document.querySelectorAll('#entrance-page .fade-in-item').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.15}s`; 
            item.classList.add('is-visible');
        });
    }
    revealEntrancePage(); 

    // =========================================================
    // 1. ENTRANCE LOGIC
    // =========================================================

    if (enterButton) {
        enterButton.addEventListener('click', () => {
            if (entrancePage) entrancePage.style.display = 'none';
            if (transitionOverlay) transitionOverlay.style.display = 'flex';
            
            const bgVideo = document.getElementById('global-bg-video');
            if (bgVideo) {
                bgVideo.play().catch(e => console.log("BG video autoplay failed:", e));
            }

            if (transitionVideo) {
                transitionVideo.currentTime = 0;
                transitionVideo.play();
            }

            if (!audioPlayed && bgMusic) {
                bgMusic.volume = 0.5; 
                bgMusic.play().then(() => {
                    audioPlayed = true;
                }).catch(e => {
                    console.error("Music autoplay failed:", e);
                });
            }
        });
    }

    // =========================================================
    // 2. TRANSITION END LOGIC
    // =========================================================

    if (transitionVideo) {
        transitionVideo.onended = () => {
            if (transitionOverlay) transitionOverlay.style.display = 'none';
            if (page2Main) page2Main.style.display = 'block';
            document.body.style.overflowY = 'scroll'; 

            if (invitationBox) invitationBox.classList.add('border-fade-in');
            
            setupScrollReveal();
        };
    }

    // =========================================================
    // 3. SCROLL REVEAL IMPLEMENTATION
    // =========================================================

    function setupScrollReveal() {
        const observerOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.1 
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    element.style.transitionDelay = '0s';
                    setTimeout(() => {
                        element.classList.add('is-visible');
                    }, 10);
                } else {
                    element.classList.remove('is-visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('#page-2-main .fade-in-item').forEach((item) => {
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

        if(daysElement) daysElement.innerHTML = String(days).padStart(2, '0');
        if(hoursElement) hoursElement.innerHTML = String(hours).padStart(2, '0');
        if(minutesElement) minutesElement.innerHTML = String(minutes).padStart(2, '0');
        if(secondsElement) secondsElement.innerHTML = String(seconds).padStart(2, '0');
    }

    const timerInterval = setInterval(startCountdown, 1000);
    startCountdown(); 

    // =========================================================
    // 5. ADD TO CALENDAR LOGIC
    // =========================================================

    function setupCalendarLink() {
        const title = "ពិធីមង្គលអាពាហ៍ពិពាហ៍ | ឃុន ខាយស៊ីន & ពេជ្រ ម៉ានីកា";
        const description = "សូមគោរពអញ្ជើញលោក លោកស្រី ចូលរួមពិធីមង្គលអាពាហ៍ពិពាហ៍កូនប្រុស កូនស្រីរបស់យើងខ្ញុំ។";
        const location = "ដឹ ព្រេមៀ សេនធ័រ សែនសុខ (អាគារ D&E)";
        const startDateTime = "20260328T063000";
        const endDateTime = "20260328T143000";
        
        const googleCalendarLink = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

        const calendarButton = document.getElementById('add-to-calendar');
        if(calendarButton) {
            calendarButton.href = googleCalendarLink;
        }
    }
    setupCalendarLink();


    // =========================================================
    // 6. PERSONALIZED GREETING HANDLER (CRITICAL FIX)
    // =========================================================

    function setPersonalizedGreeting() {
        const urlParams = new URLSearchParams(window.location.search);
        let guestName = urlParams.get('guestName');
        
        const guestNameDisplay = document.getElementById('personalized-guest-name');
        const wishGuestNameInput = document.getElementById('guestName'); 
        
        if (guestName) {
            // Decode the URL parameter
            guestName = decodeURIComponent(guestName.replace(/\+/g, ' '));
            
            // --- JOB 1: DISPLAY THE NAME ON PAGE 2 ---
            if (guestNameDisplay) {
                guestNameDisplay.textContent = guestName;
            }
            
            // --- JOB 2: FILL AND LOCK THE WISH FORM INPUT ---
            if (wishGuestNameInput) {
                wishGuestNameInput.value = guestName;
                wishGuestNameInput.readOnly = true; 
                wishGuestNameInput.classList.add('personalized-name-locked'); 
                console.log(`[Success] Wish form name pre-filled with: ${guestName}`);
            } else {
                 console.error("[Error] Could not find the wishing form input with ID 'guestName'.");
            }
            
        } else if (guestNameDisplay) {
            // Fallback for non-personalized link
            guestNameDisplay.textContent = "ភ្ញៀវកិត្តិយស"; 
             if (wishGuestNameInput) {
                wishGuestNameInput.value = ""; 
                wishGuestNameInput.readOnly = false;
            }
        }
    }
    setPersonalizedGreeting();


    // =========================================================
    // 7. WISH FORM SUBMISSION HANDLER (DATA STORAGE)
    // =========================================================
    
    const wishForm = document.getElementById('wishForm');
    const submissionStatus = document.getElementById('submissionStatus');

    if (wishForm) {
        wishForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const guestName = document.getElementById('guestName').value.trim();
            const wishMessage = document.getElementById('wishMessage').value.trim();

            if (!guestName || !wishMessage) {
                submissionStatus.textContent = 'Please enter both your name and a message.';
                submissionStatus.style.color = 'red';
                return;
            }

            submissionStatus.textContent = 'Sending message...';
            submissionStatus.style.color = '#f0e68c';
            
            try {
                const payload = {
                    Timestamp: new Date().toISOString(),
                    GuestName: guestName,
                    WishMessage: wishMessage
                };

                const response = await fetch(WISH_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload) 
                });

                if (response.ok) {
                    submissionStatus.textContent = 'សូមអរគុណ! Your message has been sent to the couple!';
                    submissionStatus.style.color = 'green';
                    wishForm.reset();
                } else {
                    throw new Error(`Server error: ${response.status}`);
                }
            } catch (error) {
                console.error('Submission failed:', error);
                submissionStatus.textContent = 'Submission failed. Please try again or contact the organizer.';
                submissionStatus.style.color = 'red';
            }

            setTimeout(() => {
                submissionStatus.textContent = '';
            }, 5000); 
        });
    }


    // =========================================================
    // 8. IMAGE LIGHTBOX/GALLERY LOGIC
    // =========================================================

    const albumImages = document.querySelectorAll("#wedding-album .album-photo");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    let currentIndex = 0;

    if (albumImages.length > 0 && lightbox) {
        albumImages.forEach((img, index) => {
            img.addEventListener("click", () => {
                currentIndex = index;
                openLightbox();
            });
        });

        function openLightbox() {
            lightbox.style.display = "flex";
            if (lightboxImg) {
                lightboxImg.classList.remove("show");
                setTimeout(() => {
                    lightboxImg.src = albumImages[currentIndex].src;
                    lightboxImg.classList.add("show");
                }, 10);
            }
        }

        if (lightboxClose) {
            lightboxClose.addEventListener("click", () => {
                lightbox.style.display = "none";
            });
        }

        let startX = 0;
        let isDown = false;
        let dragStartX = 0;

        lightbox.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        });

        lightbox.addEventListener("touchend", (e) => {
            let endX = e.changedTouches[0].clientX;
            let diff = startX - endX;
            if (diff > 50) swipeNext();
            if (diff < -50) swipePrev();
        });

        lightbox.addEventListener("mousedown", (e) => {
            isDown = true;
            dragStartX = e.clientX;
        });

        lightbox.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault(); 
        });

        lightbox.addEventListener("mouseup", (e) => {
            if (!isDown) return;
            isDown = false;
            let diff = dragStartX - e.clientX;
            if (diff > 50) swipeNext();
            if (diff < -50) swipePrev();
        });
        
        lightbox.addEventListener("mouseleave", () => {
            isDown = false;
        });

        function swipeNext() {
            if (!lightboxImg || currentIndex >= albumImages.length - 1) return;
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

        function swipePrev() {
            if (!lightboxImg || currentIndex <= 0) return;
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

        function animateSwipe(direction) {
            if (lightboxImg) {
                lightboxImg.classList.add(direction === "left" ? "swipe-left" : "swipe-right");
            }
        }
    }
});
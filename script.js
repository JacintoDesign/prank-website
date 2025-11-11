document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    
    const runawayButtonScreen = document.getElementById('runaway-button-screen');
    const runawayBtn = document.getElementById('runaway-btn');

    const tosModal = document.getElementById('tos-modal');
    const tosContent = document.getElementById('tos-content');
    const acceptTosBtn = document.getElementById('accept-tos-btn');

    const finaleScreen = document.getElementById('finale-screen');
    const restartBtn = document.getElementById('restart-btn');
    
    let runawayAttempts = 0;
    let popupsClosedCount = 0;
    const POPUP_CLOSE_LIMIT = 10; // End prank after this many popups are closed

    let availablePopups = [];
    let confettiInterval;

    // --- Prank Logic ---

    // Prank 1: Fake Loading (Now with Reverse!)
    function startLoadingPrank() {
        let width = 0;
        let loadingForward = true;

        const interval = setInterval(() => {
            if (loadingForward) {
                width++;
                loadingBar.style.width = width + '%';
                if (width > 30 && width < 60) loadingText.textContent = 'Calibrating flux capacitor...';
                if (width > 60) loadingText.textContent = 'Almost there...';

                if (width >= 100) {
                    loadingForward = false;
                    loadingText.textContent = 'Wait, something is not right... Unloading.';
                    loadingText.classList.add('text-yellow-400');
                }
            } else { // Reversing
                width--;
                loadingBar.style.width = width + '%';
                if (width > 50) loadingText.textContent = 'De-calibrating...';
                if (width < 50) loadingText.textContent = 'This is not supposed to happen.';

                if (width <= 0) {
                    clearInterval(interval);
                    loadingText.textContent = 'Just kidding. Let\'s try this for real.';
                    loadingText.classList.remove('text-yellow-400');
                    loadingText.classList.add('text-green-400');
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        runawayButtonScreen.classList.remove('hidden');
                        positionRunawayButton();
                    }, 2000);
                }
            }
        }, 40);
    }

    // Prank 2: The Runaway Button (with taunts)
    const runawayMessages = [
        'Almost...', 'Not quite.', 'Try again!', 'So close!',
        'Starting is a state of mind.', 'Faster!', 'Nope.', 'Haha!'
    ];
    
    function positionRunawayButton() {
        const x = Math.random() * (window.innerWidth - runawayBtn.offsetWidth - 40) + 20;
        const y = Math.random() * (window.innerHeight - runawayBtn.offsetHeight - 40) + 20;
        runawayBtn.style.left = `${x}px`;
        runawayBtn.style.top = `${y}px`;
    }

    function handleRunaway() {
        runawayAttempts++;
        if (runawayAttempts > 8) {
            runawayButtonScreen.classList.add('hidden');
            startTosPrank();
        } else {
            runawayBtn.textContent = runawayMessages[runawayAttempts % runawayMessages.length];
            positionRunawayButton();
        }
    }

    runawayBtn.addEventListener('mouseover', handleRunaway);
    runawayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleRunaway();
    });


    // Prank 3: Fake Terms of Service
    function startTosPrank() {
        const gibberish = "By clicking accept, you agree to forfeit your soul, your firstborn child, and your favorite coffee mug. You also agree to subscribe to our newsletter, which consists entirely of pictures of cats in hats. You grant us the right to replace your computer's wallpaper with a picture of Nicolas Cage. We are not responsible for any existential dread, sudden urges to yodel, or the spontaneous appearance of rubber chickens that may result from using this service. All your base are belong to us. This agreement is non-negotiable, especially the part about the coffee mug. ".repeat(10);
        tosContent.textContent = gibberish;
        tosModal.classList.remove('hidden');

        tosContent.addEventListener('scroll', () => {
            if (tosContent.scrollTop + tosContent.clientHeight >= tosContent.scrollHeight - 10) {
                acceptTosBtn.disabled = false;
                acceptTosBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                acceptTosBtn.classList.add('hover:bg-green-700');
            }
        });
    }

    acceptTosBtn.addEventListener('click', () => {
        if (!acceptTosBtn.disabled) {
            tosModal.classList.add('hidden');
            startPopupPrank();
        }
    });

    // Prank 4 & 5: Hydra Pop-ups with Confetti Finale
    const popupsData = [
        { title: "FREE V-BUCKS!", message: "You've won a lifetime supply of V-Bucks! Click to claim!", color: 'bg-blue-500' },
        { title: "System Alert", message: "Your PC is running slow. Download more RAM now!", color: 'bg-red-500' },
        { title: "You have a new follower!", message: "A mysterious stranger started following you. Are you famous?", color: 'bg-purple-500' },
        { title: "Cookie Consent", message: "We use cookies. And we ate them. All of them.", color: 'bg-yellow-600' },
        { title: "Update Available", message: "A critical update is available for your mouse cursor.", color: 'bg-green-500' },
        { title: "Free Cruise!", message: "You've won an all-expenses-paid cruise to a deserted island!", color: 'bg-teal-500' },
        { title: "Confirm Identity", message: "Please confirm you are not a robot by solving this impossible captcha.", color: 'bg-gray-600' },
        { title: "A Wild Snorlax Appears!", message: "It's blocking your path. And your screen.", color: 'bg-indigo-500' },
        { title: "This is not a pop-up.", message: "It's an interactive, user-initiated experience.", color: 'bg-pink-500' },
        { title: "Free Puppy!", message: "Click here to claim your free, non-existent puppy!", color: 'bg-orange-500' }
    ];

    function resetAvailablePopups() {
        availablePopups = [...popupsData];
    }

    function getUniquePopupData() {
        if (availablePopups.length === 0) {
            resetAvailablePopups(); // Refill if we run out
        }
        const index = Math.floor(Math.random() * availablePopups.length);
        const data = availablePopups[index];
        availablePopups.splice(index, 1); // Remove from pool to ensure uniqueness
        return data;
    }

    function triggerConfetti() {
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        // Clear any existing interval
        if (confettiInterval) {
            clearInterval(confettiInterval);
        }

        confettiInterval = setInterval(function() {
            const particleCount = 50;
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    function createPopup() {
        const data = getUniquePopupData();
        const popup = document.createElement('div');
        popup.className = `popup fixed w-72 p-4 rounded-lg shadow-2xl text-white ${data.color}`;
        popup.style.left = `${Math.random() * (window.innerWidth - 300)}px`;
        popup.style.top = `${Math.random() * (window.innerHeight - 200)}px`;
        
        popup.innerHTML = `
            <h3 class="font-bold text-lg">${data.title}</h3>
            <p class="text-sm mt-2">${data.message}</p>
            <button class="absolute top-2 right-2 text-white font-bold pointer-events-none">&times;</button>
        `;
        
        document.body.appendChild(popup);

        popup.addEventListener('click', () => {
            popup.remove();
            popupsClosedCount++;

            if (popupsClosedCount >= POPUP_CLOSE_LIMIT) {
                // End the prank
                document.querySelectorAll('.popup').forEach(p => p.remove());
                finaleScreen.classList.remove('hidden');
                finaleScreen.classList.add('flex');
                triggerConfetti();
            } else {
                // Spawn TEN more
                for (let i = 0; i < 10; i++) {
                    createPopup();
                }
            }
        });
    }

    function startPopupPrank() {
        resetAvailablePopups();
        // Start with 3 initial popups to get things going
        for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                createPopup();
                }, i * 200);
        }
    }

    // Finale: Restart button
    restartBtn.addEventListener('click', () => {
        if (confettiInterval) {
            clearInterval(confettiInterval);
        }
        if (typeof confetti !== 'undefined') {
            confetti.reset();
        }
        finaleScreen.classList.add('hidden');
        finaleScreen.classList.remove('flex');
        loadingScreen.classList.remove('hidden');
        loadingBar.style.width = '0%';
        loadingText.textContent = 'Loading resources...';
        loadingText.classList.remove('text-red-500', 'text-yellow-400', 'text-green-400');
        runawayAttempts = 0;
        popupsClosedCount = 0;
        runawayBtn.textContent = 'Press Start to Continue';
        document.querySelectorAll('.popup').forEach(p => p.remove());
        startLoadingPrank();
    });

    // --- Initial Start ---
    startLoadingPrank();
});
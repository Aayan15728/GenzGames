document.addEventListener('DOMContentLoaded', () => {
    const clickerBtn = document.getElementById('clickerBtn');
    const countDisplay = document.getElementById('count'); // Updated ID to match HTML
    const roastContainer = document.getElementById('roast-container');
    const roastText = document.getElementById('roast-text');
    const gameIcon = document.getElementById('game-icon');

    const clickSound = new Audio('https://cdn.jsdelivr.net/gh/Aayan15728/GenzGames@24c3e74c1226fa8478744dc59b82807ab89ac2b7/pop.mp3');
    const roastSound = new Audio('https://cdn.jsdelivr.net/gh/Aayan15728/GenzGames@24c3e74c1226fa8478744dc59b82807ab89ac2b7/boing.mp3');
    clickSound.preload = 'auto';
    roastSound.preload = 'auto';

    const roasts = {
        tease: [
            "Wow, you clicked. Truly groundbreaking. 🥱",
            "You’re single-handedly keeping this button employed. 💼",
            "The button is tired. Unlike your motivation levels. 📉",
            "Congrats, you did nothing… again! 🎉",
            "Clicking buttons won’t fix your life, but nice try. 👍",
            "You click like someone who says “just one more episode.” 📺",
            "Are you hoping for validation? Keep clicking, champ. 🏆",
            "A toddler could click faster. Just saying. 👶",
            "You’re basically mining for disappointment. ⛏️",
            "Button: 1 | You: 0",
            "Your dedication is inspiringly useless. ✨",
            "You’ve clicked more times than you’ve made good decisions. 🤔",
            "You’ve discovered infinite effort with zero reward. ♾️",
            "You’re performing the digital equivalent of talking to a wall. 🧱",
            "You must have a PhD in wasting time. 🎓",
            "Still here? Even I left already. 👋",
            "You’re farming disappointment at a professional level. 🚜",
            "Every click brings you closer to enlightenment… or carpal tunnel.🏥",
            "Imagine explaining this to your future self. 🤦",
            "Even ChatGPT is judging you. 🤖",
            "You’re playing a game that plays you. 🎭",
            "Achievement unlocked: Professional Clown. 🤡",
            "The boss fight is your self-control. 🤺",
            "You’d probably click a loading bar too. 🔄",
            "The button’s winning, btw. 🥇",
            "FPS? More like Fails Per Second. 📉",
            "You’re speedrunning your own embarrassment. 🏃‍♂️",
            "GG, loser. 👎",
            "You’re the human version of “buffering.” ⏳",
            "Bro thinks he’s hacking the matrix. 🕶️",
            "You ate… absolutely nothing. 🍽️",
            "Touch grass? No, touch this button. 👆",
            "That click gave 0 Riz. 📉",
            "Certified L moment. ✅",
            "This is peak side-quest energy. 🗺️",
            "Keep it up, sigma clicker. 🗿"
        ],
        savage: [
            "Wow, you’ve accomplished less than a progress bar stuck at 99%. 📉",
            "Keep going! Every click proves you’ve got nothing better to do. 🍿",
            "The button is starting to feel unsafe. 😨",
            "You’re one click away from discovering nothing. 🌌",
            "Even your reflection rolled its eyes. 👀",
            "This is what peak human evolution looks like, huh? 🐒",
            "Your mouse deserves hazard pay. 💰",
            "This isn’t therapy, stop trauma-dumping on the button. 🛋️",
            "Keep clicking — maybe you’ll unlock self-respect. 🔓",
            "You’re basically speedrunning uselessness. 💨",
            "Your wrist just filed for a restraining order. 📜",
            "If stupidity was cardio, you’d be shredded. 💪",
            "This is what failure looks like with a GUI. 🖥️",
            "Keep it up — mediocrity suits you. 🏅",
            "The button’s doing more work than your brain. 🧠",
            "Somewhere, your ancestors just sighed. 🌬️",
            "I’d roast you harder, but the button’s already melting. 🔥",
            "Congrats, you’ve wasted a perfectly good click. 🗑️",
            "Bro’s grinding XP in depression. 📉",
            "The button’s your most stable relationship. ❤️",
            "Clicking like that won’t make your parents proud. 👨‍👩‍👧",
            "This click brought to you by regret™. 💔",
            "You’re not addicted, just committed to bad decisions. 🤝",
            "This is why aliens don’t visit. 👽",
            "The button doesn’t love you back. 💔",
            "You’re the final boss of “why though?”",
            "I’ve seen calculators with more purpose. 🧮",
            "Every click screams “I peaked in kindergarten.” 🖍️",
            "Your spirit animal is a buffering wheel. 🔄",
            "The button’s in therapy now. Thanks. 🙏",
            "You’re farming disappointment faster than Bitcoin. ₿",
            "The button called HR. 📞",
            "You’ve unlocked nothing, congratulations! 🎁",
            "This is performance art, right? Please say yes. 🎭",
            "Keep clicking — denial looks good on you. 😎",
            "You’re like an NFT: useless but persistent. 🖼️",
            "The button’s lawyer will contact you shortly. ⚖️",
            "This click was brought to you by existential dread. 😨",
            "You’ve reached Level 0 — great job. 📉",
            "Your dedication is admirable…ly sad. 😢",
            "This button has more patience than your last ex. ⏳",
            "Are you trying to summon Satan or just boredom? 😈",
            "You’re like a motivational poster that gave up. 🖼️",
            "If stupidity had a leaderboard, you’d be in platinum rank. 🏆",
            "Even Google doesn’t know what you’re doing. ❓",
            "Somewhere in the cloud, a server just sighed. ☁️",
            "The button’s therapist says it’s not your fault… entirely. 👨‍⚕️",
            "You’re giving “404: Purpose Not Found.” 🚫",
            "This is peak button abuse. 👊",
            "You’ve been clicking for so long, I aged 3 years. 👴",
            "The button wants a raise. 💰",
            "Every click makes me question evolution. 🐒",
            "You’re the poster child for digital chaos. 🌪️",
            "This isn’t gameplay, it’s a cry for help. 🆘",
            "You’re in a committed relationship with disappointment. 💍",
            "Even the code’s embarrassed. 😳",
            "Congratulations, you’ve mastered doing nothing efficiently. ✅",
            "Your wrist’s endurance is impressive, your decisions — not so much. 🤔",
            "If effort was IQ, you’d still be in tutorial mode. 🧠",
            "You’re giving off “boss defeated by tutorial NPC” vibes. 🤖",
            "Click harder — it won’t fix your self-esteem. 💔",
            "Somewhere, your productivity app just died inside. 👻",
            "This is why aliens change channels when they see Earth. 👽",
            "The button’s considering early retirement. 🏝️",
            "You’re auditioning for “Human Spam Bot.” 🤖",
            "If dopamine was a scam, you’d be the CEO. 💼",
            "Congratulations, you’ve unlocked: carpal tunnel! 🖐️",
            "Keep it up — mediocrity needs role models. 🏅",
            "You’re the reason autoclickers were invented. 🖱️",
            "Even your shadow left out of boredom. 🚶‍♂️",
            "Click again — the void’s cheering. ⚫",
            "This is peak digital clownery. 🤡",
            "I’d say “keep going,” but haven’t you suffered enough? 😩",
            "You’ve officially lost an argument with a button. 📉",
            "Bro’s out here grinding XP in disappointment. 📉",
            "If procrastination had a sound, it’d be your clicks. 🔊",
            "This button’s seen more action than your social life. 💃",
            "You’ve achieved new lows in persistence. 📉",
            "I’d clap, but I’m busy judging you. 👏",
            "Keep clicking — you’re one click closer to realizing nothing matters. 🌌",
            "Your mouse called — it wants a new owner. 📞",
            "You’ve successfully outperformed background noise. 🦗",
            "The button’s proud of you… said no one ever. 🤥",
            "You’re now the world record holder for wasted enthusiasm. 🏆",
            "Somewhere in heaven, your productivity angel just facepalmed. 🤦‍♀️",
            "The button’s dying, and so is my patience. 💀",
            "Congrats! You’ve unlocked absolutely nothing. 🎁"
        ],
        ulta: [
            "Bro, if brain cells were currency, you’d still be on free trial. 🧠",
            "You click like someone who lost a fight to a captcha. 🤖",
            "Even autoclickers have more life goals than you. 🎯",
            "You’ve officially turned oxygen into disappointment. 💨",
            "If confidence had a refund policy, you’d be bankrupt. 💰",
            "The button said “ouch,” then whispered, “this is your peak.” 🏔️",
            "You’ve got main character energy… from a background extra.",
            "Your Wi-Fi disconnects just to avoid being associated with you. 📶",
            "You click like a side quest no one asked for. 🗺️",
            "The button tried to escape but realized you’d still find it somehow. 🏃‍♂️"
        ],
        god: [
            "You paused your life for this? {clicks} clicks say yes. ⏸️",
            "At 10,000 clicks your grandchildren will call you 'legend' ironically. 👴",
            "You came for validation and stayed for existential wage theft. 💸",
            "Your devotion to pointlessness is practically a superpower. 🦸‍♂️",
            "You clicked so hard reality updated to 'meh.' 🤷"
        ]
    };

    let totalClicksAllTime = 0;
    let lastSeenRoasts = [];
    const ROAST_BUFFER_SIZE = 10;
    const ROAST_CHANCE = 0.25;

    function loadProgress() {
        totalClicksAllTime = parseInt(localStorage.getItem('totalClicksAllTime')) || 0;
        lastSeenRoasts = JSON.parse(localStorage.getItem('lastSeenRoasts')) || [];
        updateCounter();
    }

    function saveProgress() {
        localStorage.setItem('totalClicksAllTime', totalClicksAllTime);
        localStorage.setItem('lastSeenRoasts', JSON.stringify(lastSeenRoasts));
    }
    
    function updateCounter() {
        countDisplay.textContent = totalClicksAllTime.toLocaleString();
    }

    function shouldShowRoast() {
        return Math.random() < ROAST_CHANCE;
    }

    function chooseTone() {
        if (totalClicksAllTime >= 1000 && Math.random() < 0.15) return 'god';
        if (totalClicksAllTime >= 500) return 'ulta';
        if (totalClicksAllTime >= 100) return 'savage';
        return 'tease';
    }

    function chooseRoast(tone) {
        const availableRoasts = roasts[tone].filter(r => !lastSeenRoasts.includes(r));
        const roastPool = availableRoasts.length > 0 ? availableRoasts : roasts[tone];
        const roast = roastPool[Math.floor(Math.random() * roastPool.length)];
        
        lastSeenRoasts.push(roast);
        if (lastSeenRoasts.length > ROAST_BUFFER_SIZE) {
            lastSeenRoasts.shift();
        }
        
        return roast;
    }

    function showRoast(roast) {
        roastText.textContent = roast.replace('{clicks}', totalClicksAllTime.toLocaleString());
        roastContainer.classList.add('show');
        roastSound.play().catch(e => {});

        setTimeout(() => {
            roastContainer.classList.remove('show');
        }, 3000); // Roast visible for 3 seconds
    }

    clickerBtn.addEventListener('click', function() {
        totalClicksAllTime++;
        updateCounter();
        
        clickSound.currentTime = 0;
        clickSound.play().catch(e => {});

        if (shouldShowRoast()) {
            const tone = chooseTone();
            const roast = chooseRoast(tone);
            showRoast(roast);
        }

        saveProgress();
    });


    // Handle game icon click to go to home page
    if (gameIcon) {
        gameIcon.addEventListener('click', () => {
            window.location.href = 'index.html'; // Navigate to home page
        });
    }

    loadProgress();
});

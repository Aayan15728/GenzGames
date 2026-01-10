// --- STATE ---
let currentGame = null;

// --- HELPERS ---
function Badge(type, size = 'small') {
    const styles = {
        Hot: "bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]",
        New: "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]",
        Updated: "bg-blue-500 text-white",
        Top: "bg-yellow-500 text-black font-bold",
        "3D": "bg-purple-600 text-white",
        Classic: "bg-gray-600 text-white",
        Tricky: "bg-rose-500 text-white",
        Unblocked: "bg-emerald-500 text-white",
        Multiplayer: "bg-orange-500 text-white",
        Funny: "bg-pink-500 text-white",
        ".io": "bg-indigo-500 text-white",
        Popular: "bg-purple-500 text-white",
        Hard: "bg-red-700 text-white",
        Challenge: "bg-orange-600 text-white",
        Brain: "bg-sky-500 text-white",
        Math: "bg-green-600 text-white",
        Stunts: "bg-yellow-600 text-white",
        Retro: "bg-gray-500 text-white",
        Skill: "bg-teal-500 text-white",
        Pixel: "bg-gray-800 text-white",
        "2 Player": "bg-blue-600 text-white",
        Idle: "bg-lime-500 text-black",
        Addictive: "bg-pink-600 text-white",
        "My Game": "bg-indigo-600 text-white"
    };
    const sizeClasses = size === 'large'
        ? "text-sm font-bold px-3 py-1 rounded-lg"
        : "text-[10px] font-bold px-1.5 py-0.5 rounded";

    return `<span class="${sizeClasses} uppercase tracking-wider ${styles[type] || "bg-gray-700 text-white"}">${type}</span>`;
}


// --- RENDER LOGIC ---

function renderGamePage() {
    const app = document.getElementById('game-page');
    if (!currentGame) {
        app.innerHTML = `<div class="flex h-screen items-center justify-center">
            <div class="text-center">
                <h1 class="text-4xl font-bold mb-4">Game not found!</h1>
                <a href="/" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold">
                    Go to Homepage
                </a>
            </div>
        </div>`;
        return;
    }

    document.title = `${currentGame.title} - Trendy Games`;

    const similarGames = GAME_DATABASE
        .filter(g => g.category === currentGame.category && g.id !== currentGame.id)
        .slice(0, 6);

    app.innerHTML = `
    <div class="min-h-screen bg-[#1a1125] font-sans">
        <header class="h-16 bg-[#0f0518]/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-50">
            <a href="/" class="flex items-center space-x-2">
                <div class="bg-purple-600 p-2 rounded-lg"><i data-lucide="gamepad-2" class="w-6 h-6 text-white"></i></div>
                <span class="font-bold text-xl">Trendy Games</span>
            </a>
            <div class="flex items-center space-x-4 ml-4">
                 <button onclick="toggleFullscreen()" class="p-2 rounded-full bg-white/10 text-white hover:bg-white/20" id="fullscreen-btn">
                    <i data-lucide="fullscreen" class="w-5 h-5"></i>
                </button>
                <button class="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-bold"><i data-lucide="user" class="w-4 h-4"></i> <span>Log In</span></button>
            </div>
        </header>

        <main class="max-w-7xl mx-auto p-4 md:p-6">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Main Game Area -->
                <div class="flex-1">
                    <div id="game-container" class="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/50 border-2 border-purple-800/50 relative">
                        <iframe src="${currentGame.url}" frameborder="0" class="w-full h-full" allowfullscreen></iframe>
                        <div class="absolute top-2 right-2">
                           
                        </div>
                    </div>
                     <div class="mt-6 bg-[#0f0518] p-5 rounded-2xl">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h1 class="text-4xl font-black text-white">${currentGame.title}</h1>
                                <p class="text-gray-400 mt-1">Developed by ${currentGame.developer}</p>
                            </div>
                            <div class="flex items-center gap-2 mt-4 sm:mt-0">
                                <div class="flex items-center gap-1 bg-yellow-400/10 text-yellow-400 px-3 py-1.5 rounded-full">
                                    <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                                    <span class="font-bold text-sm">${currentGame.rating}</span>
                                </div>
                                <div class="text-gray-400 text-sm">(${currentGame.voteCount} votes)</div>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-4">
                            ${(currentGame.badges || []).map(b => Badge(b, 'large')).join('')}
                        </div>
                    </div>

                    <div class="mt-8 bg-[#0f0518] p-5 rounded-2xl">
                        <h2 class="text-2xl font-bold mb-4">Description</h2>
                        <p class="text-gray-300 leading-relaxed">${currentGame.description || 'No description available.'}</p>
                        <h3 class="text-xl font-bold mt-6 mb-3">Controls</h3>
                        <p class="text-gray-300">${currentGame.controls || 'No controls specified.'}</p>
                    </div>
                </div>

                <!-- Similar Games Sidebar -->
                <aside class="w-full lg:w-80 lg:flex-shrink-0">
                    <div class="bg-[#0f0518] p-5 rounded-2xl">
                        <h2 class="text-2xl font-bold mb-4 text-white">Similar Games</h2>
                        <div class="space-y-4">
                            ${similarGames.map(game => `
                            <a href="game.html?id=${game.id}" class="flex items-center gap-4 group p-2 rounded-lg hover:bg-purple-600/20 transition-colors">
                                <img src="${game.image}" class="w-20 h-16 object-cover rounded-lg" />
                                <div>
                                    <h4 class="font-bold text-white group-hover:text-purple-300">${game.title}</h4>
                                    <p class="text-sm text-gray-400">${game.category}</p>
                                </div>
                            </a>
                            `).join('')}
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    </div>
    `;

    lucide.createIcons();
}

function toggleFullscreen() {
    const el = document.getElementById('game-container');
    const btnIcon = document.querySelector('#fullscreen-btn i');

    if (!document.fullscreenElement) {
        el.requestFullscreen().catch(err => console.log(err));
        btnIcon.setAttribute('data-lucide', 'minimize');
    } else {
        document.exitFullscreen();
        btnIcon.setAttribute('data-lucide', 'fullscreen');
    }
    lucide.createIcons(); // Redraw icon
}


// --- INITIALIZATION ---
function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = parseInt(urlParams.get('id'));

    if (gameId) {
        currentGame = GAME_DATABASE.find(g => g.id === gameId);
    }

    renderGamePage();
}

init();

document.addEventListener('fullscreenchange', () => {
    const btnIcon = document.querySelector('#fullscreen-btn i');
    if (!document.fullscreenElement) {
        btnIcon.setAttribute('data-lucide', 'fullscreen');
    } else {
        btnIcon.setAttribute('data-lucide', 'minimize');
    }
    lucide.createIcons();
});

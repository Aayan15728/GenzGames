// --- STATE MANAGEMENT ---
const state = {
    selectedGame: null,
    searchQuery: '',
    isDarkMode: true,
    activeTab: 'Home',
    isSidebarCollapsed: false,
    isMobileMenuOpen: false,
    heroIndex: 0
};

// --- HELPER COMPONENTS (Functions returning HTML strings) ---

function Badge(type) {
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
        ".io": "bg-indigo-500 text-white"
    };
    return `<span class="text-[10px] font-bold px-1.5 py-0.5 rounded absolute top-2 right-2 z-10 uppercase tracking-wider ${styles[type] || "bg-gray-700 text-white"}">${type}</span>`;
}

// --- RENDER LOGIC ---

function renderApp() {
    const app = document.getElementById('app');
    // We only clear InnerHTML if we are doing a full re-render.
    // In a real app we would diff DOM, but here we just rebuild strings.
    app.innerHTML = '';

    if (state.isDarkMode) {
        app.innerHTML = renderCrazyGamesLayout();
    } else {
        app.innerHTML = renderPokiLayout();
    }

    // Re-initialize icons after DOM update
    lucide.createIcons();

    // Restore search focus if needed
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = state.searchQuery;
        if (document.activeElement?.id === 'searchInput') searchInput.focus();
    }
}

// --- CRAZY GAMES LAYOUT ---

function renderCrazyGamesLayout() {
    const filteredGames = GAME_DATABASE.filter(game =>
        game.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(state.searchQuery.toLowerCase())
    );

    const SidebarItem = (icon, label, id) => {
        const active = state.activeTab === id;
        return `
        <button onclick="setTab('${id}')" 
            class="w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group relative
            ${active ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-[#2a1b3d] hover:text-white'}">
            <i data-lucide="${icon}" class="w-5 h-5 min-w-[20px] ${active ? 'fill-current' : ''}"></i>
            ${!state.isSidebarCollapsed ? `<span class="font-medium text-sm truncate">${label}</span>` : ''}
        </button>`;
    };

    const heroGame = GAME_DATABASE[state.heroIndex % 4];

    return `
    <div class="flex h-screen bg-[#0f0518] text-gray-100 font-sans selection:bg-purple-500 selection:text-white overflow-hidden">
        <aside class="bg-[#1a1125] border-r border-white/5 flex flex-col z-40 transition-all duration-300 ${state.isSidebarCollapsed ? 'w-20' : 'w-64'} fixed md:relative h-full ${state.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}">
            <div class="h-16 flex items-center px-4 border-b border-white/5">
                <button onclick="toggleMobileMenu()" class="md:hidden mr-4"><i data-lucide="x" class="w-6 h-6"></i></button>
<div class="flex items-center space-x-2">
                    <div class="bg-purple-600 p-2 rounded-lg"><i data-lucide="gamepad-2" class="w-6 h-6 text-white"></i></div>
                    ${!state.isSidebarCollapsed ? '<span class="font-bold text-xl">trendy67games</span>' : ''}
                </div>
            </div>
            <div class="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-purple-900">
                ${SidebarItem('home', 'Home', 'Home')}
                ${SidebarItem('clock', 'Recently Played', 'Recent')}
                ${SidebarItem('flame', 'Trending', 'Trending')}
                ${SidebarItem('trophy', 'Daily Challenge', 'DailyChallenge')}
                <div class="my-4 border-t border-white/5 mx-2"></div>
                <p class="px-4 mb-2 text-xs font-bold uppercase tracking-wider text-gray-500 ${state.isSidebarCollapsed ? 'hidden' : 'block'}">Categories</p>
                ${SidebarItem('swords', 'Action', 'Action')}
                ${SidebarItem('car', 'Driving', 'Driving')}
                ${SidebarItem('ghost', 'Horror', 'Horror')}
                ${SidebarItem('zap', 'Arcade', 'Arcade')}
                ${SidebarItem('users', 'Multiplayer', 'Multiplayer')}
            </div>
            <div class="p-4 border-t border-white/5 hidden md:flex justify-center">
                <button onclick="toggleSidebar()" class="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
                    ${state.isSidebarCollapsed ? '<i data-lucide="menu" class="w-5 h-5"></i>' : '<div class="flex items-center text-sm font-medium"><i data-lucide="menu" class="w-4 h-4 mr-2"></i> Collapse</div>'}
                </button>
            </div>
        </aside>

        <main class="flex-1 flex flex-col h-full relative overflow-hidden">
            <header class="h-16 bg-[#0f0518]/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-20">
                <div class="flex items-center flex-1 max-w-2xl">
                    <button onclick="toggleMobileMenu()" class="md:hidden mr-4 p-2 text-gray-300"><i data-lucide="menu" class="w-6 h-6"></i></button>
                    <div class="relative w-full max-w-md group">
                        <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"></i>
                        <input type="text" id="searchInput" placeholder="Search games..." value="${state.searchQuery}" oninput="setSearch(this.value)" class="w-full bg-[#1a1125] text-white pl-10 pr-4 py-2.5 rounded-full border border-white/5 focus:border-purple-500 focus:ring-1 focus:outline-none text-sm" />
                    </div>
                </div>
                <div class="flex items-center space-x-4 ml-4">
                    <button onclick="toggleTheme()" class="p-2 rounded-full bg-white/10 text-yellow-400 hover:bg-white/20"><i data-lucide="sun" class="w-5 h-5"></i></button>
                    <button class="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-bold"><i data-lucide="user" class="w-4 h-4"></i> <span>Log In</span></button>
                </div>
            </header>

            <div class="flex-1 overflow-y-auto p-4 md:p-6 pb-20 scroll-smooth">
                <div class="max-w-7xl mx-auto">
                    ${!state.searchQuery ? `
                    <div class="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden group shadow-2xl shadow-purple-900/30 mb-8">
                        <div class="absolute inset-0">
                            <img src="${heroGame.image}" class="w-full h-full object-cover" alt="${heroGame.title}" />
                            <div class="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#0f0518]/60 to-transparent"></div>
                        </div>
                        <div class="absolute bottom-0 left-0 p-8 z-10">
                            <h1 class="text-4xl font-black text-white mb-2">${heroGame.title}</h1>
                            <button onclick="playGame(${heroGame.id})" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2">
                                <i data-lucide="play" class="w-5 h-5 fill-white"></i> Play Now
                            </button>
                        </div>
                    </div>
                    ` : ''}

                    <h2 class="text-2xl font-bold text-white mb-4 flex items-center"><i data-lucide="zap" class="w-6 h-6 text-yellow-400 mr-2"></i> All Games</h2>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        ${filteredGames.map(game => `
                        <div onclick="playGame(${game.id})" class="group relative bg-[#2a1b3d] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:z-10 border border-transparent hover:border-purple-500/30">
                            <div class="aspect-[4/3] w-full overflow-hidden relative">
                                ${(game.badges || []).map(b => Badge(b)).join('')}
                                <img src="${game.image}" alt="${game.title}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                    <div class="bg-purple-600 rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <i data-lucide="play" class="w-6 h-6 text-white fill-current"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="p-3">
                                <h3 class="font-bold text-gray-100 truncate text-sm md:text-base group-hover:text-purple-400 transition-colors">${game.title}</h3>
                                <div class="flex justify-between items-center mt-1">
                                    <span class="text-xs text-gray-400">${game.category}</span>
                                    <div class="flex items-center space-x-1">
                                        <i data-lucide="star" class="w-3 h-3 text-yellow-400 fill-yellow-400"></i>
                                        <span class="text-xs text-gray-300">${game.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
<footer class="mt-12 pt-8 border-t border-white/5 text-center pb-8 text-gray-500 text-sm">
                    <p>© 2024 trendy67games. All rights reserved.</p>
                </footer>
            </div>
        </main>
    </div>
    `;
}

// --- POKI LAYOUT ---

function renderPokiLayout() {
    const filteredGames = GAME_DATABASE.filter(game =>
        game.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(state.searchQuery.toLowerCase())
    );

    const getSpanClass = (size) => {
        switch (size) {
            case 'large': return 'col-span-2 row-span-2';
            case 'wide': return 'col-span-2 row-span-1';
            case 'tall': return 'col-span-1 row-span-2';
            default: return 'col-span-1 row-span-1';
        }
    };

    return `
    <div class="min-h-screen font-sans selection:bg-cyan-200 selection:text-cyan-900 flex flex-col bg-[#A0EAFF]"
        style="background: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
                   radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
                   linear-gradient(135deg, #7DF9FF 0%, #00D2FF 100%)">
        <main class="flex-1 p-4 md:p-6 overflow-y-auto">
            <div class="max-w-[1600px] mx-auto">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 auto-rows-[150px] gap-3 md:gap-4" style="grid-auto-flow: dense">
                    <div class="col-span-2 row-span-1 bg-white rounded-3xl p-3 shadow-sm flex items-center gap-2 pr-4 relative overflow-hidden group">
                        <div class="bg-[#00D2FF] text-white font-black italic text-2xl px-5 py-3 rounded-3xl tracking-tighter transform -skew-x-6 shadow-[3px_3px_0px_rgba(0,0,0,0.1)] select-none cursor-pointer hover:scale-105 transition-transform">
                            Trendy
                        </div>
                        <div class="flex-1 ml-2">
                            <div class="flex gap-2 justify-end">
                                <button class="p-3 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-[#00D2FF] transition-colors">
                                    <i data-lucide="search" class="w-6 h-6"></i>
                                </button>
                                <button onclick="toggleTheme()" class="p-3 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors ml-auto">
                                    <i data-lucide="moon" class="w-6 h-6"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    ${filteredGames.map(game => `
                    <div onclick="playGame(${game.id})" class="group relative bg-white rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${getSpanClass(game.pokiSize)}">
                        <img src="${game.image}" alt="${game.title}" class="w-full h-full object-cover" loading="lazy" />
                        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-4"></div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </main>
<footer class="text-white/80 py-8 text-center mt-auto">
            <p class="text-xs font-bold">trendy67games v1.0</p>
        </footer>
    </div>
    `;
}

// --- ACTIONS ---

function titleToSlug(title) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function playGame(id) {
    const game = GAME_DATABASE.find(g => g.id === id);
    if (game) {
        const slug = titleToSlug(game.title);
        window.location.href = `${slug}.html`;
    }
}

function closeGame() {
    state.selectedGame = null;
    renderApp();
    document.body.style.overflow = '';
}

function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    renderApp();
}

function toggleSidebar() {
    state.isSidebarCollapsed = !state.isSidebarCollapsed;
    renderApp();
}

function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    renderApp();
}

function setTab(tab) {
    state.activeTab = tab;
    renderApp();
}

function setSearch(query) {
    state.searchQuery = query;
    renderApp();
}

function toggleFullscreen() {
    const el = document.getElementById('game-container');
    if (!document.fullscreenElement) {
        el.requestFullscreen().catch(err => console.log(err));
    } else {
        document.exitFullscreen();
    }
}

// --- INITIALIZATION ---

// Carousel Timer (FIXED: Only runs if NO game is open)
setInterval(() => {
    if (!state.selectedGame) {
        state.heroIndex++;
        renderApp();
    }
}, 5000);

// Initial Render
renderApp();

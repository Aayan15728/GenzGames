// --- DATA ---
const GAME_DATABASE = [
    // NEW: AMONG US
    {
        id: 204,
        title: "Among Us",
        developer: "Innersloth",
        image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80",
        url: "https://gamescons.com/among-us",
        category: "Multiplayer",
        rating: 4.9,
        voteCount: "100M",
        badges: ["Popular", "Multiplayer"],
        pokiSize: "wide",
        description: "Work together to fix the ship... but watch out for the Impostor! A game of teamwork and betrayal.",
        controls: "WASD or Arrows to Move. Mouse to Interact."
    },

    // YOUR GENZ GAMES
    {
        id: 201,
        title: "Flappy Block",
        developer: "GenZ Games",
        image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&w=600&q=80",
        url: "https://genzgames.fun/flappyblock",
        category: "Arcade",
        rating: 5.0,
        voteCount: "10K",
        badges: ["My Game", "Hot"],
        pokiSize: "large",
        description: "Navigate the block through the obstacles in this addictive arcade classic.",
        controls: "Space or Click to Fly."
    },
    {
        id: 202,
        title: "Flappy Block Impossible",
        developer: "GenZ Games",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
        url: "https://genzgames.fun/flappy-block-impossible",
        category: "Arcade",
        rating: 4.9,
        voteCount: "5K",
        badges: ["Hard", "Challenge"],
        pokiSize: "tall",
        description: "The ultimate test of reflexes. Can you survive the impossible mode?",
        controls: "Space or Click to Fly."
    },
    {
        id: 203,
        title: "8192",
        developer: "GenZ Games",
        image: "https://images.unsplash.com/photo-1611996900117-9643186c9eb2?auto=format&fit=crop&w=600&q=80",
        url: "https://genzgames.fun/8192",
        category: "Puzzle",
        rating: 4.8,
        voteCount: "8K",
        badges: ["Brain", "Math"],
        pokiSize: "wide",
        description: "A logic puzzle game. Join the numbers and get to the 8192 tile!",
        controls: "Arrow Keys or Swipe to Move."
    },

    // DEMO GAMES
    { id: 1, title: "Subway Surfers", developer: "Sybo", image: "https://images.unsplash.com/photo-1560201402-5c219757659a?auto=format&fit=crop&w=600&q=80", url: "https://tbg95.github.io/subway-surfers/", category: "Runner", rating: 4.9, voteCount: "1.2M", badges: ["Hot", "Popular"], pokiSize: "large", description: "Dash as fast as you can! Dodge the oncoming trains!", controls: "Arrow Keys to Move, Space to Jump." },
    { id: 2, title: "Chess Master 3D", developer: "GameDistribution", image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80", url: "https://html5.gamedistribution.com/5d2a6a68364841969632863920150616/", category: "Strategy", rating: 4.8, voteCount: "850K", badges: ["Classic", "Brain"], pokiSize: "tall", description: "Master the board and improve your strategy skills.", controls: "Mouse to select and move pieces." },
    { id: 3, title: "Moto X3M", developer: "MadPuffers", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80", url: "https://tbg95.github.io/moto-x3m/", category: "Racing", rating: 4.8, voteCount: "2.4M", badges: ["Classic", "Stunts"], pokiSize: "large", description: "Race your motorbike through 22 challenging levels.", controls: "Arrow Keys to Drive and Balance." },
    { id: 4, title: "Retro Bowl", developer: "New Star Games", image: "https://images.unsplash.com/photo-1520639893542-a84dfd92298c?auto=format&fit=crop&w=600&q=80", url: "https://tbg95.github.io/retro-bowl/", category: "Sports", rating: 4.8, voteCount: "900K", badges: ["Top", "Retro"], pokiSize: "wide", description: "Retro football management game.", controls: "Mouse / Touch to Pass and Dodge." },
    { id: 5, title: "Stickman Hook", developer: "Madbox", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80", url: "https://tbg95.github.io/stickman-hook/", category: "Arcade", rating: 4.6, voteCount: "1.5M", badges: ["Skill"], pokiSize: "tall", description: "Swing through the levels like a spider-man stickman.", controls: "Space / Left Click to Hook and Swing." },
    { id: 6, title: "Rooftop Snipers", developer: "New Eich Games", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", url: "https://tbg95.github.io/rooftop-snipers/", category: "Action", rating: 4.5, voteCount: "600K", badges: ["Multiplayer", "Pixel"], description: "Chaotic two-button local multiplayer sniper game.", controls: "W to Jump, E to Shoot." },
    { id: 7, title: "Basket Random", developer: "RHM Interactive", image: "https://images.unsplash.com/photo-1546519638-68e109498ee2?auto=format&fit=crop&w=600&q=80", url: "https://tbg95.github.io/basket-random/", category: "Sports", rating: 4.7, voteCount: "800K", badges: ["Funny", "2 Player"], pokiSize: "wide", description: "Score baskets in the most random way possible.", controls: "W to Jump/Throw." },
    { id: 16, title: "Level Devil", developer: "Unept", image: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=600&q=80", url: "https://gamescons.com/level-devil", category: "Puzzle", rating: 4.7, voteCount: "2.7M", badges: ["New", "Tricky"], pokiSize: "large", description: "A hilariously cruel 2D platformer.", controls: "WASD to Move." },
    { id: 20, title: "Cookie Clicker", developer: "Orteil", image: "https://images.unsplash.com/photo-1499636138143-bd649043ea52?auto=format&fit=crop&w=600&q=80", url: "https://tbg95.github.io/cookie-clicker/", category: "Simulation", rating: 4.7, voteCount: "3M", badges: ["Idle", "Addictive"], pokiSize: "small", description: "Bake billions of cookies.", controls: "Mouse Click to Bake." },
    { id: 99, title: "Survival Race", developer: "Unknown", image: "https://lh3.googleusercontent.com/sitesv/AAzXCkfyFMqqRaGPPwoyroXhWBILYAURKMO2ukmJR5IOJH988MnLLnX1AhaRrOXUG0vSfC_ZhlDGC53fawfl5cQ4e6aP2AlIAFWQoawMc0fIqtZPnN4Al-wLQhri2LVNWGuzD5t7L8miNpUNjNt8UrGj4pIUEsdx0Ndesr9krcaDJfv1F3OoBFso8U0HgsYQYZJiHysrDEka5o2v2vfLSLraaZ8swcauftfDIRe5=w1280", url: "#", type: "blob", category: "Racing", rating: 4.8, voteCount: "500K", badges: ["Unblocked", "3D"], pokiSize: "wide", description: "High speed racing game.", controls: "Arrow Keys." },

    // UPDATED TEMPLE RUN 2
    {
        id: 101,
        title: "Temple Run 2",
        developer: "Imangi",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        url: "https://archive.org/embed/templerun-2-v-1.55.5-hs_202502",
        category: "Action",
        pokiSize: "small",
        badges: [],
        rating: 4.3,
        voteCount: "100K",
        description: "Run, jump, turn and slide in this endless runner classic!",
        controls: "Arrow Keys to Move and Jump."
    },

    { id: 102, title: "Venge.io", developer: "Cem Demir", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80", url: "#", category: "FPS", pokiSize: "wide", badges: ["Multiplayer"], rating: 4.5, voteCount: "200K" },
];

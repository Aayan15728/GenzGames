/**
 * Build Your Own Universe Game
 * A game where users combine elements to create new ones and build their universe.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elementBoard = document.getElementById('element-board');
    const journalContent = document.getElementById('journal-content');
    const toastContainer = document.getElementById('toast-container');
    const resetButton = document.getElementById('reset-button');
    const searchInput = document.getElementById('search-elements');
    const discoveriesButton = document.getElementById('discoveries-button');
    const sortButton = document.getElementById('sort-button');

    // Game State
    let discovered = new Set(['Water', 'Fire', 'Earth', 'Wind']); // Starting elements
    let placedElements = []; // Elements currently on the board
    let undoStack = [];
    let redoStack = [];
    let draggedElement = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let originalPosition = { x: 0, y: 0 };
    let lastRenderTime = 0;
    let renderPending = false;

    // Element Combinations Dictionary
    const combinations = {
        // Basic Elements Combinations
        "Water+Fire": "Steam",
        "Water+Earth": "Mud",
        "Fire+Earth": "Lava",
        "Wind+Water": "Cloud",
        "Wind+Fire": "Smoke",
        "Wind+Earth": "Dust",
        "Steam+Earth": "Geyser",
        "Cloud+Cloud": "Rain",
        "Rain+Earth": "Plant",
        "Plant+Fire": "Ash",
        "Lava+Water": "Stone",
        "Stone+Wind": "Sand",
        "Sand+Fire": "Glass",
        "Plant+Water": "Algae",
        "Water+Water": "Lake",
        "Lake+Lake": "Ocean",
        "Fire+Fire": "Wildfire",
        "Earth+Earth": "Mountain",
        "Wind+Wind": "Hurricane",
        "Mountain+Fire": "Volcano",
        "Volcano+Water": "Obsidian",
        "Ocean+Wind": "Wave",
        "Wave+Wave": "Tsunami",
        "Ocean+Earth": "Beach",
        "Beach+Water": "Coast",
        "Mountain+Mountain": "Mountain Range",
        "Mountain Range+Snow": "Alps",
        "Ocean+Ocean": "Sea",
        "Sea+Earth": "Island",
        "Island+Island": "Archipelago",
        "Mountain+Cloud": "Fog",
        "Fog+Sun": "Rainbow",
        "Rain+Sun": "Rainbow",
        "Cloud+Electricity": "Lightning",
        "Lightning+Earth": "Thunder",
        "Lightning+Sand": "Fulgurite",
        "Ocean+Lightning": "Storm",
        "Hurricane+Lightning": "Thunderstorm",
        "Thunderstorm+Human": "Fear",

        // Life Evolution
        "Algae+Time": "Fish",
        "Fish+Land": "Amphibian",
        "Amphibian+Time": "Reptile",
        "Reptile+Time": "Dinosaur",
        "Dinosaur+Meteor": "Extinction",
        "Extinction+Time": "Mammal",
        "Mammal+Time": "Primate",
        "Primate+Time": "Human",
        "Ocean+Time": "Life",
        "Life+Earth": "Plant",
        "Life+Ocean": "Plankton",
        "Plankton+Time": "Coral",
        "Coral+Coral": "Reef",
        "Reef+Fish": "Ecosystem",
        "Plant+Plant": "Forest",
        "Forest+Time": "Jungle",
        "Jungle+Human": "Explorer",
        "Forest+Human": "Lumberjack",
        "Plant+Sun": "Photosynthesis",
        "Photosynthesis+Plant": "Oxygen",
        "Oxygen+Human": "Breath",
        "Oxygen+Fire": "Combustion",
        "Plant+Mud": "Swamp",
        "Swamp+Life": "Bacteria",
        "Bacteria+Time": "Virus",
        "Virus+Human": "Disease",
        "Disease+Science": "Medicine",
        "Medicine+Human": "Health",
        "Health+Time": "Longevity",
        "Longevity+Science": "Immortality",
        "Plant+Science": "GMO",
        "GMO+Farm": "Crop",
        "Crop+Human": "Food",
        "Food+Fire": "Cooking",
        "Cooking+Human": "Chef",
        "Food+Science": "Nutrition",
        "Nutrition+Human": "Diet",
        "Diet+Time": "Fitness",
        "Fitness+Human": "Athlete",
        "Athlete+Competition": "Sports",
        "Sports+Human": "Team",
        "Team+Competition": "Game",
        "Game+Electricity": "Video Game",
        "Video Game+Human": "Gamer",
        "Gamer+Time": "Streamer",
        "Streamer+Internet": "Content Creator",
        "Content Creator+Social Media": "Influencer",

        // Human Civilization
        "Human+Knowledge": "Civilization",
        "Civilization+Electricity": "Technology",
        "Technology+Human": "Internet",
        "Internet+Human": "Social Media",
        "Social Media+Time": "Meme",
        "Human+Fire": "Tool",
        "Tool+Knowledge": "Wheel",
        "Wheel+Tool": "Vehicle",
        "Vehicle+Electricity": "Electric Car",
        "Human+Plant": "Agriculture",
        "Agriculture+Tool": "Farm",
        "Farm+Time": "Village",
        "Village+Time": "City",
        "City+Time": "Nation",
        "Nation+Nation": "War",
        "War+Knowledge": "Peace",
        "Peace+Time": "Prosperity",
        "Prosperity+Knowledge": "Science",
        "Science+Energy": "Technology",
        "Technology+Time": "Future",
        "Future+Knowledge": "Space Travel",
        "Space Travel+Time": "Galaxy",
        "Galaxy+Galaxy": "Universe",
        "Universe+Time": "Multiverse",
        "Human+Human": "Family",
        "Family+Family": "Community",
        "Community+Community": "Society",
        "Society+Knowledge": "Culture",
        "Culture+Time": "History",
        "History+Knowledge": "Education",
        "Education+Human": "Student",
        "Student+Time": "Graduate",
        "Graduate+Knowledge": "Expert",
        "Expert+Society": "Professional",
        "Professional+Money": "Career",
        "Human+Stone": "Sculpture",
        "Human+Sound": "Music",
        "Music+Human": "Musician",
        "Human+Color": "Art",
        "Art+Human": "Artist",
        "Human+Story": "Literature",
        "Literature+Human": "Writer",
        "Human+Image": "Photography",
        "Photography+Human": "Photographer",
        "Human+Movement": "Dance",
        "Dance+Human": "Dancer",
        "Art+Music": "Entertainment",
        "Entertainment+Technology": "Movie",
        "Movie+Human": "Actor",
        "Human+Idea": "Philosophy",
        "Philosophy+Human": "Philosopher",
        "Human+Belief": "Religion",
        "Religion+Building": "Temple",
        "Human+Law": "Government",
        "Government+Building": "Capitol",
        "Human+Money": "Economy",
        "Economy+Technology": "Cryptocurrency",
        "Human+Medicine": "Doctor",
        "Human+Building": "Architect",
        "Human+Education": "Teacher",
        "Human+Food": "Chef",
        "Human+Plant": "Gardener",
        "Human+Animal": "Veterinarian",
        "Human+Space": "Astronaut",
        "Human+Ocean": "Sailor",
        "Human+Air": "Pilot",

        // Technology and Science
        "Science+Human": "Scientist",
        "Scientist+Space": "Astronomer",
        "Scientist+Life": "Biologist",
        "Scientist+Earth": "Geologist",
        "Scientist+Chemical": "Chemist",
        "Scientist+Electricity": "Physicist",
        "Scientist+Human": "Anthropologist",
        "Scientist+Mind": "Psychologist",
        "Scientist+Society": "Sociologist",
        "Scientist+Past": "Archaeologist",
        "Scientist+Ocean": "Oceanographer",
        "Scientist+Weather": "Meteorologist",
        "Technology+Information": "Computer",
        "Computer+Computer": "Network",
        "Network+Network": "Internet",
        "Internet+Information": "Website",
        "Website+Commerce": "E-commerce",
        "Internet+Communication": "Social Media",
        "Social Media+Image": "Instagram",
        "Social Media+Text": "Twitter",
        "Social Media+Video": "YouTube",
        "Social Media+Professional": "LinkedIn",
        "Technology+Sound": "Microphone",
        "Technology+Image": "Camera",
        "Camera+Time": "Video",
        "Technology+Information": "Data",
        "Data+Analysis": "Big Data",
        "Data+Learning": "AI",
        "AI+Human": "Robot",
        "Robot+Factory": "Automation",
        "Technology+Biology": "Biotechnology",
        "Biotechnology+Medicine": "Gene Therapy",
        "Technology+Atom": "Nuclear Power",
        "Nuclear Power+Weapon": "Nuclear Bomb",
        "Technology+Light": "Laser",
        "Technology+Distance": "Telescope",
        "Technology+Small": "Microscope",
        "Technology+Time": "Clock",
        "Technology+Location": "GPS",
        "Technology+Flight": "Airplane",
        "Airplane+Military": "Fighter Jet",
        "Technology+Space": "Rocket",
        "Rocket+Human": "Astronaut",
        "Technology+Ocean": "Submarine",
        "Technology+Information": "Smartphone",

        // Space and Cosmos
        "Space+Light": "Star",
        "Star+Star": "Binary Star",
        "Star+Time": "Supernova",
        "Supernova+Gravity": "Black Hole",
        "Star+Hydrogen": "Sun",
        "Sun+Planet": "Solar System",
        "Planet+Ring": "Saturn",
        "Planet+Storm": "Jupiter",
        "Planet+Water": "Earth",
        "Planet+Heat": "Venus",
        "Planet+Cold": "Mars",
        "Planet+Gas": "Gas Giant",
        "Earth+Moon": "Tide",
        "Moon+Sun": "Eclipse",
        "Earth+Orbit": "Year",
        "Earth+Rotation": "Day",
        "Earth+Axis": "Season",
        "Space+Human": "Astronaut",
        "Astronaut+Moon": "Moon Landing",
        "Space+Technology": "Satellite",
        "Satellite+Communication": "GPS",
        "Satellite+Weather": "Weather Forecast",
        "Space+Exploration": "Space Station",
        "Space Station+Time": "Space Colony",
        "Space+Debris": "Asteroid",
        "Asteroid+Asteroid": "Asteroid Belt",
        "Space+Ice": "Comet",
        "Comet+Earth": "Impact",
        "Impact+Dinosaur": "Extinction",
        "Space+Light": "Radiation",
        "Radiation+Human": "Mutation",
        "Space+Distance": "Light Year",
        "Space+Study": "Astronomy",
        "Astronomy+Technology": "Telescope",
        "Space+Theory": "Cosmology",
        "Cosmology+Origin": "Big Bang",
        "Big Bang+Time": "Universe",

        // Weather and Natural Phenomena
        "Earth+Atmosphere": "Weather",
        "Weather+Cold": "Snow",
        "Snow+Human": "Snowman",
        "Snow+Mountain": "Avalanche",
        "Weather+Heat": "Drought",
        "Weather+Wind": "Storm",
        "Storm+Rain": "Thunderstorm",
        "Storm+Cold": "Blizzard",
        "Storm+Rotation": "Tornado",
        "Storm+Ocean": "Hurricane",
        "Weather+Humidity": "Fog",
        "Weather+Electricity": "Lightning",
        "Weather+Pressure": "Barometer",
        "Weather+Study": "Meteorology",
        "Weather+Prediction": "Forecast",
        "Earth+Heat": "Geothermal Energy",
        "Earth+Pressure": "Earthquake",
        "Earthquake+Ocean": "Tsunami",
        "Earth+Water": "Erosion",
        "Erosion+Time": "Canyon",
        "Earth+Ice": "Glacier",
        "Glacier+Movement": "Moraine",
        "Earth+River": "Valley",
        "Earth+Wind": "Dune",
        "Earth+Heat": "Desert",
        "Desert+Water": "Oasis",
        "Earth+Cold": "Tundra",
        "Earth+Rain": "Rainforest",
        "Earth+Season": "Climate",
        "Climate+Change": "Global Warming",

        // Materials and Elements
        "Earth+Knowledge": "Chemistry",
        "Chemistry+Element": "Periodic Table",
        "Fire+Metal": "Forge",
        "Forge+Metal": "Steel",
        "Steel+Carbon": "Carbon Steel",
        "Metal+Technology": "Alloy",
        "Sand+Heat": "Glass",
        "Glass+Technology": "Lens",
        "Lens+Light": "Focus",
        "Lens+Eye": "Glasses",
        "Lens+Distance": "Telescope",
        "Lens+Small": "Microscope",
        "Stone+Pressure": "Gem",
        "Carbon+Pressure": "Diamond",
        "Sand+Shell": "Pearl",
        "Wood+Tool": "Furniture",
        "Plant+Process": "Paper",
        "Paper+Information": "Book",
        "Book+Collection": "Library",
        "Clay+Heat": "Pottery",
        "Pottery+Wheel": "Ceramics",
        "Oil+Process": "Plastic",
        "Plastic+Molding": "Toy",
        "Rubber+Wheel": "Tire",
        "Metal+Electricity": "Conductor",
        "Glass+Sand": "Fiber Optic",
        "Fiber Optic+Data": "Internet",

        // Energy and Forces
        "Fire+Knowledge": "Energy",
        "Energy+Motion": "Kinetic Energy",
        "Energy+Position": "Potential Energy",
        "Energy+Heat": "Thermal Energy",
        "Energy+Light": "Radiant Energy",
        "Energy+Atom": "Nuclear Energy",
        "Energy+Chemical": "Chemical Energy",
        "Energy+Electricity": "Electrical Energy",
        "Energy+Magnet": "Magnetic Energy",
        "Energy+Sound": "Sound Energy",
        "Energy+Conservation": "Efficiency",
        "Energy+Storage": "Battery",
        "Battery+Car": "Electric Vehicle",
        "Energy+Sun": "Solar Power",
        "Energy+Wind": "Wind Power",
        "Energy+Water": "Hydropower",
        "Energy+Earth": "Geothermal Power",
        "Energy+Atom": "Nuclear Power",
        "Energy+Plant": "Biofuel",
        "Energy+Transformation": "Power Plant",
        "Force+Motion": "Physics",
        "Force+Mass": "Gravity",
        "Gravity+Planet": "Orbit",
        "Force+Electricity": "Electromagnetism",
        "Force+Atom": "Strong Force",
        "Force+Radioactivity": "Weak Force",
        "Force+Opposite": "Reaction",

        // Abstract Concepts
        "Human+Thought": "Idea",
        "Idea+Communication": "Language",
        "Language+Writing": "Literature",
        "Language+Symbol": "Alphabet",
        "Language+Digital": "Programming",
        "Programming+Computer": "Software",
        "Human+Feeling": "Emotion",
        "Emotion+Joy": "Happiness",
        "Emotion+Sadness": "Depression",
        "Emotion+Fear": "Anxiety",
        "Emotion+Anger": "Rage",
        "Emotion+Surprise": "Shock",
        "Emotion+Anticipation": "Excitement",
        "Emotion+Trust": "Love",
        "Emotion+Disgust": "Hate",
        "Human+Sense": "Perception",
        "Perception+Reality": "Consciousness",
        "Consciousness+Study": "Psychology",
        "Human+Decision": "Choice",
        "Choice+Consequence": "Responsibility",
        "Human+Value": "Ethics",
        "Ethics+Society": "Morality",
        "Human+Beauty": "Aesthetics",
        "Human+Truth": "Knowledge",
        "Knowledge+Organization": "Science",
        "Knowledge+Belief": "Philosophy",
        "Philosophy+Existence": "Metaphysics",
        "Philosophy+Knowledge": "Epistemology",
        "Philosophy+Value": "Ethics",
        "Philosophy+Beauty": "Aesthetics",
        "Philosophy+Reasoning": "Logic",
        "Human+Time": "History",
        "History+Study": "Archaeology",
        "Human+Future": "Prediction",
        "Prediction+Math": "Probability",
        "Human+Imagination": "Creativity",
        "Creativity+Problem": "Innovation",
        "Human+Goal": "Ambition",
        "Ambition+Success": "Achievement",
        "Human+Rule": "Law",
        "Law+Society": "Justice",
        "Human+Exchange": "Economy",
        "Economy+Individual": "Capitalism",
        "Economy+Society": "Socialism",
        "Human+Belief": "Religion",
        "Religion+Practice": "Ritual",
        "Religion+Building": "Temple",
        "Religion+Leader": "Priest",
        "Religion+Text": "Scripture",

        // Fun and Whimsical
        "Human+Joke": "Comedy",
        "Comedy+Performance": "Stand-up",
        "Human+Story": "Fiction",
        "Fiction+Scare": "Horror",
        "Fiction+Future": "Science Fiction",
        "Fiction+Magic": "Fantasy",
        "Fiction+Crime": "Mystery",
        "Fiction+Love": "Romance",
        "Fiction+History": "Historical Fiction",
        "Fiction+Reality": "Non-fiction",
        "Human+Play": "Game",
        "Game+Competition": "Sport",
        "Game+Chance": "Gambling",
        "Game+Strategy": "Chess",
        "Game+Card": "Poker",
        "Game+Board": "Monopoly",
        "Game+Digital": "Video Game",
        "Video Game+Building": "Minecraft",
        "Video Game+Battle": "Fortnite",
        "Human+Celebration": "Party",
        "Party+Birth": "Birthday",
        "Party+Marriage": "Wedding",
        "Party+Achievement": "Graduation",
        "Party+Year": "New Year",
        "Human+Costume": "Halloween",
        "Human+Gift": "Christmas",
        "Human+Chocolate": "Easter",
        "Human+Freedom": "Independence Day",
        "Human+Gratitude": "Thanksgiving",
        "Human+Trick": "Magic",
        "Magic+Performance": "Magician",
        "Human+Rhythm": "Dance",
        "Dance+Performance": "Ballet",
        "Human+Voice": "Song",
        "Song+Instrument": "Music",
        "Music+Group": "Band",
        "Music+Classical": "Orchestra",
        "Music+Electronic": "DJ",
        "Music+Story": "Opera",
        "Human+Acting": "Theater",
        "Theater+Film": "Movie",
        "Movie+Scare": "Horror Movie",
        "Movie+Laugh": "Comedy Movie",
        "Movie+Action": "Action Movie",
        "Movie+Love": "Romance Movie",
        "Movie+Animation": "Cartoon",
        "Cartoon+Japan": "Anime",
        "Human+Collection": "Hobby",
        "Hobby+Stamp": "Philately",
        "Hobby+Coin": "Numismatics",
        "Hobby+Plant": "Gardening",
        "Hobby+Bird": "Birdwatching",
        "Hobby+Star": "Astronomy",
        "Hobby+Fish": "Fishing",
        "Hobby+Craft": "DIY",

        // Modern Technology
        "Computer+Small": "Laptop",
        "Computer+Portable": "Smartphone",
        "Smartphone+App": "Mobile App",
        "Computer+Touch": "Tablet",
        "Computer+Game": "Gaming PC",
        "Computer+TV": "Smart TV",
        "Computer+Home": "Smart Home",
        "Computer+Watch": "Smartwatch",
        "Computer+Car": "Self-driving Car",
        "Computer+Learning": "AI",
        "AI+Conversation": "Chatbot",
        "AI+Vision": "Computer Vision",
        "AI+Language": "NLP",
        "AI+Decision": "Machine Learning",
        "AI+Brain": "Neural Network",
        "AI+Robot": "Robotics",
        "Robot+Home": "Roomba",
        "Robot+Factory": "Industrial Robot",
        "Robot+Human": "Android",
        "Computer+Reality": "Virtual Reality",
        "Virtual Reality+Real": "Augmented Reality",
        "Computer+3D": "3D Printing",
        "Computer+Flight": "Drone",
        "Internet+Money": "Cryptocurrency",
        "Cryptocurrency+Contract": "Blockchain",
        "Internet+Video": "Streaming",
        "Internet+Shopping": "E-commerce",
        "Internet+Work": "Remote Work",
        "Internet+Education": "Online Learning",
        "Internet+Doctor": "Telemedicine",

        // Food and Cuisine
        "Plant+Human": "Agriculture",
        "Agriculture+Technology": "Farm",
        "Farm+Animal": "Livestock",
        "Farm+Plant": "Crop",
        "Crop+Process": "Food",
        "Food+Heat": "Cooking",
        "Cooking+Art": "Cuisine",
        "Cuisine+France": "French Cuisine",
        "Cuisine+Italy": "Italian Cuisine",
        "Cuisine+China": "Chinese Cuisine",
        "Cuisine+Japan": "Japanese Cuisine",
        "Cuisine+India": "Indian Cuisine",
        "Cuisine+Mexico": "Mexican Cuisine",
        "Food+Grain": "Bread",
        "Food+Milk": "Cheese",
        "Food+Sweet": "Dessert",
        "Food+Fruit": "Fruit Salad",
        "Food+Vegetable": "Salad",
        "Food+Meat": "Steak",
        "Food+Fish": "Seafood",
        "Food+Spice": "Curry",
        "Food+Rice": "Sushi",
        "Food+Noodle": "Pasta",
        "Food+Tortilla": "Taco",
        "Food+Morning": "Breakfast",
        "Food+Noon": "Lunch",
        "Food+Evening": "Dinner",
        "Food+Fast": "Fast Food",
        "Food+Health": "Organic Food",
        "Food+Plant": "Vegetarian",
        "Vegetarian+Animal": "Vegan",
        "Food+Frozen": "Ice Cream",
        "Food+Hot": "Soup",
        "Food+Drink": "Beverage",
        "Beverage+Alcohol": "Beer",
        "Beverage+Grape": "Wine",
        "Beverage+Coffee Bean": "Coffee",
        "Beverage+Tea Leaf": "Tea",
        "Beverage+Carbonation": "Soda",
        "Beverage+Fruit": "Juice",
        "Beverage+Milk": "Milkshake",
        "Food+Restaurant": "Dining",
        "Food+Home": "Home Cooking",
        "Food+Party": "Catering"
    };

    // Element Symbols
    const elementSymbols = {
        // Basic Elements
        "Water": "💧",
        "Fire": "🔥",
        "Earth": "🌍",
        "Wind": "🌬️",
        "Cloud": "☁️",
        "Steam": "♨️",
        "Mud": "🟤",
        "Lava": "🌋",
        "Smoke": "💨",
        "Dust": "✨",
        "Geyser": "⛲",
        "Rain": "🌧️",
        "Plant": "🌱",
        "Ash": "🥀",
        "Stone": "🪨",
        "Sand": "🏝️",
        "Glass": "🔍",
        "Algae": "🟢",
        "Lake": "🏞️",
        "Ocean": "🌊",
        "Wildfire": "🔥",
        "Mountain": "⛰️",
        "Hurricane": "🌀",
        "Volcano": "🌋",
        "Obsidian": "⬛",
        "Wave": "🌊",
        "Tsunami": "🌊",
        "Beach": "🏖️",
        "Coast": "🏝️",
        "Mountain Range": "🏔️",
        "Alps": "🏔️",
        "Sea": "🌊",
        "Island": "🏝️",
        "Archipelago": "🏝️",
        "Fog": "🌫️",
        "Rainbow": "🌈",
        "Lightning": "⚡",
        "Thunder": "🌩️",
        "Fulgurite": "⚡",
        "Storm": "🌩️",
        "Thunderstorm": "⛈️",
        "Fear": "😱",

        // Life Evolution
        "Fish": "🐟",
        "Amphibian": "🐸",
        "Reptile": "🦎",
        "Dinosaur": "🦖",
        "Meteor": "☄️",
        "Extinction": "💀",
        "Mammal": "🐘",
        "Primate": "🐒",
        "Human": "👤",
        "Life": "🧬",
        "Plankton": "🦠",
        "Coral": "🪸",
        "Reef": "🪸",
        "Ecosystem": "🌿",
        "Forest": "🌳",
        "Jungle": "🌴",
        "Explorer": "🧭",
        "Lumberjack": "🪓",
        "Photosynthesis": "☀️",
        "Oxygen": "💨",
        "Breath": "😮‍💨",
        "Combustion": "🔥",
        "Swamp": "🥗",
        "Bacteria": "🦠",
        "Virus": "🦠",
        "Disease": "🤒",
        "Medicine": "💊",
        "Health": "❤️",
        "Longevity": "⏳",
        "Immortality": "✨",
        "GMO": "🧪",
        "Crop": "🌽",
        "Food": "🍽️",
        "Cooking": "👨‍🍳",
        "Chef": "👨‍🍳",
        "Nutrition": "🥗",
        "Diet": "🥦",
        "Fitness": "💪",
        "Athlete": "🏃",
        "Competition": "🏆",
        "Sports": "⚽",
        "Team": "👥",
        "Game": "🎮",
        "Video Game": "🎮",
        "Gamer": "🎮",
        "Streamer": "🎥",
        "Content Creator": "📹",
        "Influencer": "📱",

        // Human Civilization
        "Knowledge": "📚",
        "Civilization": "🏙️",
        "Electricity": "⚡",
        "Technology": "💻",
        "Internet": "🌐",
        "Social Media": "📱",
        "Meme": "😂",
        "Tool": "🔨",
        "Wheel": "🛞",
        "Vehicle": "🚗",
        "Electric Car": "🔋",
        "Agriculture": "🌾",
        "Farm": "🚜",
        "Village": "🏘️",
        "City": "🏙️",
        "Nation": "🏛️",
        "War": "⚔️",
        "Peace": "☮️",
        "Prosperity": "💰",
        "Science": "🔬",
        "Energy": "⚡",
        "Future": "🔮",
        "Space Travel": "🚀",
        "Galaxy": "🌌",
        "Universe": "🌠",
        "Multiverse": "✨",
        "Family": "👪",
        "Community": "🏘️",
        "Society": "👥",
        "Culture": "🎭",
        "History": "📜",
        "Education": "🎓",
        "Student": "🧑‍🎓",
        "Graduate": "🎓",
        "Expert": "🧠",
        "Professional": "💼",
        "Career": "💼",
        "Sculpture": "🗿",
        "Music": "🎵",
        "Musician": "🎸",
        "Art": "🎨",
        "Artist": "👨‍🎨",
        "Literature": "📚",
        "Writer": "✍️",
        "Photography": "📷",
        "Photographer": "📸",
        "Dance": "💃",
        "Dancer": "🕺",
        "Entertainment": "🎬",
        "Movie": "🎬",
        "Actor": "🎭",
        "Philosophy": "🤔",
        "Philosopher": "🧠",
        "Religion": "🙏",
        "Temple": "🛕",
        "Government": "🏛️",
        "Capitol": "🏛️",
        "Economy": "📊",
        "Cryptocurrency": "💰",
        "Doctor": "👨‍⚕️",
        "Architect": "👷",
        "Teacher": "👨‍🏫",
        "Chef": "👨‍🍳",
        "Gardener": "🌱",
        "Veterinarian": "🐾",
        "Astronaut": "👨‍🚀",
        "Sailor": "⚓",
        "Pilot": "✈️",

        // Technology and Science
        "Computer": "💻",
        "Laptop": "💻",
        "Smartphone": "📱",
        "Tablet": "📱",
        "Robot": "🤖",
        "AI": "🧠",
        "Machine Learning": "🤖",
        "Data": "📊",
        "Algorithm": "🧮",
        "Code": "👨‍💻",
        "Software": "💿",
        "Hardware": "🔌",
        "Processor": "🖥️",
        "Memory": "💾",
        "Storage": "💽",
        "Cloud": "☁️",
        "Server": "🖥️",
        "Network": "🌐",
        "Wireless": "📶",
        "Bluetooth": "📶",
        "GPS": "📍",
        "Satellite": "🛰️",
        "Telescope": "🔭",
        "Microscope": "🔬",
        "Laboratory": "🧪",
        "Experiment": "🧪",
        "Discovery": "💡",
        "Innovation": "💡",
        "Patent": "📜",
        "Invention": "💡",
        "Inventor": "👨‍🔬",
        "Scientist": "👩‍🔬",
        "Researcher": "🔍",

        // Space and Cosmos
        "Future": "🔮",
        "Space Travel": "🚀",
        "Galaxy": "🌌",
        "Universe": "🌠",
        "Multiverse": "🌀",
        "Rocket": "🚀",
        "Spaceship": "🛸",
        "Space Station": "🛰️",
        "Moon": "🌕",
        "Mars": "🔴",
        "Venus": "☀️",
        "Jupiter": "🪐",
        "Saturn": "🪐",
        "Uranus": "🪐",
        "Neptune": "🪐",
        "Pluto": "🪐",
        "Comet": "☄️",
        "Asteroid": "☄️",
        "Black Hole": "⚫",
        "Supernova": "💥",
        "Nebula": "🌌",
        "Star": "⭐",
        "Sun": "☀️",
        "Solar System": "☀️",
        "Constellation": "✨",
        "Alien": "👽",
        "UFO": "🛸",
        "Extraterrestrial": "👽",

        // Weather and Natural Phenomena
        "Snow": "❄️",
        "Ice": "🧊",
        "Glacier": "🧊",
        "Blizzard": "🌨️",
        "Hail": "🌨️",
        "Frost": "❄️",
        "Winter": "⛄",
        "Spring": "🌸",
        "Summer": "☀️",
        "Autumn": "🍂",
        "Season": "🍂",
        "Climate": "🌡️",
        "Global Warming": "🔥",
        "Pollution": "💨",
        "Recycling": "♻️",
        "Sustainability": "🌱",
        "Renewable Energy": "♻️",
        "Solar Power": "☀️",
        "Wind Power": "🌬️",
        "Hydropower": "💧",
        "Geothermal": "♨️",

        // Materials and Elements
        "Metal": "⚙️",
        "Steel": "🔩",
        "Iron": "⚙️",
        "Gold": "🥇",
        "Silver": "🥈",
        "Bronze": "🥉",
        "Copper": "🔶",
        "Diamond": "💎",
        "Ruby": "❤️",
        "Emerald": "💚",
        "Sapphire": "💙",
        "Crystal": "✨",
        "Gem": "💎",
        "Jewel": "💎",
        "Plastic": "🧫",
        "Paper": "📄",
        "Wood": "🪵",
        "Fabric": "🧵",
        "Leather": "👜",
        "Rubber": "🏀",
        "Ceramic": "🏺",
        "Concrete": "🧱",
        "Brick": "🧱",

        // Energy and Forces
        "Gravity": "🧲",
        "Magnetism": "🧲",
        "Electricity": "⚡",
        "Nuclear": "☢️",
        "Radiation": "☢️",
        "Heat": "🔥",
        "Cold": "❄️",
        "Light": "💡",
        "Darkness": "🌑",
        "Sound": "🔊",
        "Silence": "🔇",
        "Pressure": "🔄",
        "Vacuum": "🕳️",
        "Force": "💪",
        "Motion": "➡️",
        "Speed": "⚡",
        "Time": "⏰",
        "Space": "🌌",
        "Dimension": "📏",

        // Abstract Concepts
        "Love": "❤️",
        "Hate": "💔",
        "Joy": "😄",
        "Sadness": "😢",
        "Anger": "😠",
        "Fear": "😱",
        "Hope": "🌈",
        "Despair": "😞",
        "Truth": "✅",
        "Lie": "❌",
        "Good": "👍",
        "Evil": "👿",
        "Beauty": "🌹",
        "Ugly": "🤢",
        "Wealth": "💰",
        "Poverty": "💸",
        "Success": "🏆",
        "Failure": "❌",
        "Freedom": "🕊️",
        "Prison": "🔒",
        "Dream": "💭",
        "Nightmare": "👻",
        "Memory": "🧠",
        "Imagination": "🌈",
        "Creativity": "🎨",
        "Logic": "🧮",
        "Emotion": "😊",
        "Reason": "🤔",
        "Wisdom": "🦉",
        "Intelligence": "🧠",

        // Fun and Whimsical
        "Unicorn": "🦄",
        "Dragon": "🐉",
        "Mermaid": "🧜‍♀️",
        "Fairy": "🧚",
        "Wizard": "🧙‍♂️",
        "Witch": "🧙‍♀️",
        "Magic": "✨",
        "Spell": "🔮",
        "Potion": "⚗️",
        "Zombie": "🧟",
        "Ghost": "👻",
        "Vampire": "🧛",
        "Werewolf": "🐺",
        "Monster": "👹",
        "Superhero": "🦸",
        "Supervillain": "🦹",
        "Ninja": "🥷",
        "Pirate": "🏴‍☠️",
        "Cowboy": "🤠",
        "Astronaut": "👨‍🚀",
        "Time Traveler": "⏰",
        "Robot": "🤖",
        "Cyborg": "🤖",
        "Alien": "👽",

        // Modern Technology
        "Virtual Reality": "🥽",
        "Augmented Reality": "👓",
        "3D Printing": "🖨️",
        "Drone": "🛩️",
        "Self-driving Car": "🚗",
        "Electric Vehicle": "🔋",
        "Solar Panel": "☀️",
        "Wind Turbine": "🌬️",
        "Smart Home": "🏠",
        "IoT": "📱",
        "Wearable": "⌚",
        "Smartwatch": "⌚",
        "Fitness Tracker": "⌚",
        "Headphones": "🎧",
        "Speaker": "🔊",
        "Camera": "📷",
        "Video": "🎥",
        "Streaming": "📺",
        "Podcast": "🎙️",
        "Blog": "📝",
        "Website": "🌐",
        "App": "📱",
        "Game": "🎮",
        "E-book": "📚",
        "Digital Art": "🎨",

        // Food and Cuisine
        "Bread": "🍞",
        "Cheese": "🧀",
        "Milk": "🥛",
        "Egg": "🥚",
        "Meat": "🥩",
        "Fish": "🐟",
        "Vegetable": "🥦",
        "Fruit": "🍎",
        "Apple": "🍎",
        "Banana": "🍌",
        "Orange": "🍊",
        "Grape": "🍇",
        "Strawberry": "🍓",
        "Watermelon": "🍉",
        "Pineapple": "🍍",
        "Tomato": "🍅",
        "Potato": "🥔",
        "Carrot": "🥕",
        "Corn": "🌽",
        "Rice": "🍚",
        "Pasta": "🍝",
        "Pizza": "🍕",
        "Burger": "🍔",
        "Sandwich": "🥪",
        "Taco": "🌮",
        "Sushi": "🍣",
        "Cake": "🍰",
        "Cookie": "🍪",
        "Ice Cream": "🍦",
        "Chocolate": "🍫",
        "Coffee": "☕",
        "Tea": "🍵",
        "Wine": "🍷",
        "Beer": "🍺",
        "Cocktail": "🍸"
    };

    // Initialize the game
    function initGame() {
        loadGameState();
        renderBoard();
        renderJournal();

        // Event Listeners
        resetButton.addEventListener('click', () => {
            if (typeof adBreak === 'function') {
                adBreak({
                    type: 'start',
                    name: 'restart-universe',
                    beforeAd: () => { },
                    afterAd: () => {
                        resetGame();
                    },
                });
            } else {
                resetGame();
            }
        });
        searchInput.addEventListener('input', filterJournal);
        discoveriesButton.addEventListener('click', () => {
            discoveriesButton.classList.add('active');
            sortButton.classList.remove('active');
            renderJournal();
        });
        sortButton.addEventListener('click', () => {
            sortButton.classList.add('active');
            discoveriesButton.classList.remove('active');
            renderJournal(true); // Sort alphabetically
        });

        // Setup initial elements
        setupInitialElements();

        // Setup drag and drop
        setupDragListeners();
    }

    // Setup initial elements on the board
    function setupInitialElements() {
        const initialElements = Array.from(discovered).slice(0, 4); // First 4 discovered elements

        initialElements.forEach((element, index) => {
            const x = 100 + (index % 2) * 150;
            const y = 100 + Math.floor(index / 2) * 100;

            placedElements.push({
                id: `element-${Date.now()}-${index}`,
                element: element,
                x: x,
                y: y
            });
        });

        renderBoard();
    }

    // Render the game board with all placed elements
    function renderBoard() {
        if (renderPending) return;

        renderPending = true;
        requestAnimationFrame(() => {
            elementBoard.innerHTML = '';

            placedElements.forEach(item => {
                const card = createElementCard(item);
                elementBoard.appendChild(card);
            });

            renderPending = false;
            lastRenderTime = performance.now();
        });
    }

    // Create an element card DOM element
    function createElementCard(item) {
        const card = document.createElement('div');
        card.className = 'element-card';
        card.id = item.id;
        card.dataset.element = item.element;
        card.style.left = `${item.x}px`;
        card.style.top = `${item.y}px`;
        card.style.transform = 'translate3d(0,0,0)';
        card.style.contain = 'layout paint';

        const symbol = document.createElement('div');
        symbol.className = 'element-symbol';
        symbol.textContent = getElementSymbol(item.element);

        const name = document.createElement('div');
        name.className = 'element-name';
        name.textContent = item.element;

        card.appendChild(symbol);
        card.appendChild(name);

        return card;
    }

    // Get the symbol for an element
    function getElementSymbol(element) {
        return elementSymbols[element] || '❓';
    }

    // Setup drag listeners for element cards
    function setupDragListeners() {
        // Using event delegation for better performance
        elementBoard.addEventListener('pointerdown', startDrag);
        elementBoard.addEventListener('pointermove', drag);
        elementBoard.addEventListener('pointerup', endDrag);
        elementBoard.addEventListener('pointercancel', endDrag);
    }

    // Start dragging an element
    function startDrag(e) {
        if (!e.target.closest('.element-card')) return;

        const card = e.target.closest('.element-card');
        draggedElement = card;

        // Calculate the offset from the pointer to the card's top-left corner
        const rect = card.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;

        // Store original position for undo
        originalPosition = {
            x: parseInt(card.style.left),
            y: parseInt(card.style.top)
        };

        // Add dragging class for visual feedback
        card.classList.add('dragging');

        // Set pointer capture to track movement even outside the element
        card.setPointerCapture(e.pointerId);

        e.preventDefault();
    }

    // Drag an element
    function drag(e) {
        if (!draggedElement) return;

        // Calculate new position based on pointer position and offset
        const boardRect = elementBoard.getBoundingClientRect();
        const x = e.clientX - boardRect.left - dragOffsetX;
        const y = e.clientY - boardRect.top - dragOffsetY;

        // Apply position with hardware acceleration
        draggedElement.style.left = `${x}px`;
        draggedElement.style.top = `${y}px`;
        draggedElement.style.transform = 'translate3d(0,0,0)';

        e.preventDefault();
    }

    // End dragging an element
    function endDrag(e) {
        if (!draggedElement) return;

        // Remove dragging class
        draggedElement.classList.remove('dragging');

        // Check for overlapping elements and potential combinations
        const overlappingElement = findOverlappingElement(draggedElement);

        if (overlappingElement) {
            // Try to combine elements
            const element1 = draggedElement.dataset.element;
            const element2 = overlappingElement.dataset.element;

            const combinationKey1 = `${element1}+${element2}`;
            const combinationKey2 = `${element2}+${element1}`;

            let newElement = null;

            if (combinations[combinationKey1]) {
                newElement = combinations[combinationKey1];
            } else if (combinations[combinationKey2]) {
                newElement = combinations[combinationKey2];
            }

            if (newElement) {
                // Create merge animation
                createMergeAnimation(draggedElement, overlappingElement);

                // Remove the combined elements
                placedElements = placedElements.filter(item =>
                    item.id !== draggedElement.id && item.id !== overlappingElement.id
                );

                // Add the new element at the midpoint between the two combined elements
                const x1 = parseInt(draggedElement.style.left);
                const y1 = parseInt(draggedElement.style.top);
                const x2 = parseInt(overlappingElement.style.left);
                const y2 = parseInt(overlappingElement.style.top);

                const newX = (x1 + x2) / 2;
                const newY = (y1 + y2) / 2;

                const newItem = {
                    id: `element-${Date.now()}`,
                    element: newElement,
                    x: newX,
                    y: newY
                };

                placedElements.push(newItem);

                // Check if this is a new discovery
                const isNewDiscovery = !discovered.has(newElement);
                if (isNewDiscovery) {
                    discovered.add(newElement);
                    showToast(`Discovered: ${newElement}!`);

                    // Trigger haptic feedback if supported
                    if (navigator.vibrate) {
                        navigator.vibrate(200);
                    }
                }

                // Save game state
                saveGameState();

                // Render the updated board and journal
                renderBoard();
                renderJournal();
            } else {
                // No combination found, just update the position in placedElements
                updateElementPosition(draggedElement.id,
                    parseInt(draggedElement.style.left),
                    parseInt(draggedElement.style.top)
                );
            }
        } else {
            // Just update the position in placedElements
            updateElementPosition(draggedElement.id,
                parseInt(draggedElement.style.left),
                parseInt(draggedElement.style.top)
            );
        }

        // Reset dragged element
        draggedElement = null;

        e.preventDefault();
    }

    // Find an overlapping element with the dragged element
    function findOverlappingElement(draggedCard) {
        const draggedRect = draggedCard.getBoundingClientRect();

        // Check all element cards except the dragged one
        const cards = Array.from(document.querySelectorAll('.element-card')).filter(card => card !== draggedCard);

        for (const card of cards) {
            const cardRect = card.getBoundingClientRect();

            // Calculate overlap
            const overlap = calculateOverlap(draggedRect, cardRect);

            // If overlap is significant (more than 30%), consider it a match
            if (overlap > 0.3) {
                return card;
            }
        }

        return null;
    }

    // Calculate the overlap percentage between two rectangles
    function calculateOverlap(rect1, rect2) {
        const xOverlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
        const yOverlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));

        const overlapArea = xOverlap * yOverlap;
        const rect1Area = rect1.width * rect1.height;
        const rect2Area = rect2.width * rect2.height;

        // Return the overlap as a percentage of the smaller rectangle
        return overlapArea / Math.min(rect1Area, rect2Area);
    }

    // Update the position of an element in the placedElements array
    function updateElementPosition(id, x, y) {
        const index = placedElements.findIndex(item => item.id === id);
        if (index !== -1) {
            placedElements[index].x = x;
            placedElements[index].y = y;
            saveGameState();
        }
    }

    // Create a merge animation between two elements
    function createMergeAnimation(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        // Create a temporary element for the animation
        const animElement = document.createElement('div');
        animElement.className = 'element-card merge-animation';

        // Position it at the midpoint between the two elements
        const midX = (rect1.left + rect2.left) / 2 + window.scrollX;
        const midY = (rect1.top + rect2.top) / 2 + window.scrollY;

        animElement.style.left = `${midX - elementBoard.getBoundingClientRect().left}px`;
        animElement.style.top = `${midY - elementBoard.getBoundingClientRect().top}px`;
        animElement.style.width = `${(rect1.width + rect2.width) / 2}px`;
        animElement.style.height = `${(rect1.height + rect2.height) / 2}px`;

        // Add it to the board
        elementBoard.appendChild(animElement);

        // Remove it after the animation completes
        setTimeout(() => {
            animElement.remove();
        }, 600); // Match the animation duration in CSS
    }

    // Render the journal with discovered elements
    function renderJournal(sortAlphabetically = false) {
        journalContent.innerHTML = '';

        let elements = Array.from(discovered);

        // Apply search filter if there's a search query
        const searchQuery = searchInput.value.toLowerCase();
        if (searchQuery) {
            elements = elements.filter(element =>
                element.toLowerCase().includes(searchQuery)
            );
        }

        // Sort elements
        if (sortAlphabetically) {
            elements.sort();
        } else {
            // Sort by discovery order (assuming the order in the Set)
        }

        elements.forEach(element => {
            const journalElement = document.createElement('div');
            journalElement.className = 'journal-element';
            journalElement.dataset.element = element;

            const symbol = document.createElement('div');
            symbol.className = 'journal-element-symbol';
            symbol.textContent = getElementSymbol(element);

            const name = document.createElement('div');
            name.className = 'journal-element-name';
            name.textContent = element;

            journalElement.appendChild(symbol);
            journalElement.appendChild(name);

            // Add click event to add this element to the board
            journalElement.addEventListener('click', () => {
                addElementToBoard(element);
            });

            journalContent.appendChild(journalElement);
        });
    }

    // Add an element from the journal to the board
    function addElementToBoard(element) {
        // Find a random position that's not too close to existing elements
        const boardRect = elementBoard.getBoundingClientRect();
        const margin = 50;

        let x, y, attempts = 0;
        let validPosition = false;

        while (!validPosition && attempts < 10) {
            x = margin + Math.random() * (boardRect.width - 2 * margin);
            y = margin + Math.random() * (boardRect.height - 2 * margin);

            // Check if this position is far enough from existing elements
            validPosition = true;
            for (const item of placedElements) {
                const distance = Math.sqrt(Math.pow(item.x - x, 2) + Math.pow(item.y - y, 2));
                if (distance < 100) {
                    validPosition = false;
                    break;
                }
            }

            attempts++;
        }

        // If we couldn't find a good position, just use a random one
        if (!validPosition) {
            x = margin + Math.random() * (boardRect.width - 2 * margin);
            y = margin + Math.random() * (boardRect.height - 2 * margin);
        }

        // Add the element to placedElements
        const newItem = {
            id: `element-${Date.now()}`,
            element: element,
            x: x,
            y: y
        };

        placedElements.push(newItem);

        // Save game state and render
        saveGameState();
        renderBoard();
    }

    // Filter journal elements based on search input
    function filterJournal() {
        renderJournal(sortButton.classList.contains('active'));
    }

    // Show a toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = document.createElement('div');
        icon.className = 'toast-icon';
        icon.textContent = type === 'success' ? '✨' : 'ℹ️';

        const text = document.createElement('div');
        text.className = 'toast-message';
        text.textContent = message;

        toast.appendChild(icon);
        toast.appendChild(text);

        toastContainer.appendChild(toast);

        // Remove the toast after a delay
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Reset the game
    function resetGame() {
        if (confirm('Are you sure you want to reset? This will clear all your discoveries.')) {
            discovered = new Set(['Water', 'Fire', 'Earth', 'Wind']);
            placedElements = [];
            undoStack = [];
            redoStack = [];

            saveGameState();
            setupInitialElements();
            renderJournal();

            showToast('Game reset successfully');
        }
    }

    // Save game state to localStorage
    function saveGameState() {
        const gameState = {
            discovered: Array.from(discovered),
            placedElements: placedElements
        };

        localStorage.setItem('universe-game-state', JSON.stringify(gameState));
    }

    // Load game state from localStorage
    function loadGameState() {
        const savedState = localStorage.getItem('universe-game-state');
        if (savedState) {
            try {
                const gameState = JSON.parse(savedState);
                discovered = new Set(gameState.discovered);
                placedElements = gameState.placedElements;
            } catch (e) {
                console.error('Error loading game state:', e);
            }
        }

        // Load theme preference
        const savedTheme = localStorage.getItem('universe-theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        }
    }

    // Initialize the game
    initGame();
});

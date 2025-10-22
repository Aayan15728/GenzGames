document.addEventListener('DOMContentLoaded', () => {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCYkdTNPTQ6JlAl4g29D3UNlUfaDMLVGt0",
      authDomain: "lets-settle-these-paradoxes.firebaseapp.com",
      databaseURL: "https://lets-settle-these-paradoxes-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "lets-settle-these-paradoxes",
      storageBucket: "lets-settle-these-paradoxes.firebasestorage.app",
      messagingSenderId: "584980044487",
      appId: "1:584980044487:web:d77209c9e94edafd5efce2",
      measurementId: "G-V266J153ND"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    const paradoxesContainer = document.getElementById('paradoxes-container');
    const paradoxesRef = database.ref('paradoxes');
    let userChoices = JSON.parse(localStorage.getItem('userChoices')) || {};

    const paradoxesData = [
        { id: 1, question: "If everything is predetermined, are you really choosing right now?", options: [{ text: "Yes, free will is real" }, { text: "No, everything is fate" }] },
        { id: 2, question: "If you replace every part of a ship one by one, is it still the same ship?", options: [{ text: "Yes, identity remains" }, { text: "No, it becomes something new" }] },
        { id: 3, question: "If you went back and killed your grandfather before your parent was born, what happens?", options: [{ text: "You vanish instantly" }, { text: "A new timeline begins" }] },
        { id: 4, question: "Can an all-powerful being create a rock so heavy that even they can’t lift it?", options: [{ text: "Yes, but it breaks logic" }, { text: "No, true omnipotence is impossible" }] },
        { id: 5, question: "If our world is simulated, how can we ever prove or disprove it?", options: [{ text: "We can break the simulation" }, { text: "It’s impossible to know" }] },
        { id: 6, question: "In a town where one barber shaves everyone who doesn’t shave themselves — who shaves the barber?", options: [{ text: "The barber himself" }, { text: "No one — the rule collapses" }] },
        { id: 7, question: "If you give your younger self the time machine you built, who built it first?", options: [{ text: "The older you" }, { text: "The younger you" }] },
        { id: 8, question: "A scientist receives blueprints for a time machine from their future self. They build it and later send it back in time.", options: [{ text: "The machine has no origin" }, { text: "The first scientist must have designed it" }] },
        { id: 9, question: "If every cause has a cause, what started it all?", options: [{ text: "Something outside time" }, { text: "Nothing — it’s eternal" }] },
        { id: 10, question: "If you remove one grain from a heap of sand at a time, when does it stop being a heap?", options: [{ text: "At a definable point" }, { text: "It never truly stops being one" }] },
        { id: 11, question: "“This statement is false.”", options: [{ text: "It’s true" }, { text: "It’s false" }] },
        { id: 12, question: "If a teleporter destroys your body and recreates it somewhere else, are you still you?", options: [{ text: "Yes, same consciousness" }, { text: "No, it’s just a copy" }] },
        { id: 13, question: "If saving five people requires killing one innocent, is it justified?", options: [{ text: "Yes, the greater good" }, { text: "No, morality forbids it" }] },
        { id: 14, question: "Should a tolerant society tolerate the intolerant?", options: [{ text: "Yes, tolerance means all" }, { text: "No, that destroys tolerance" }] },
        { id: 15, question: "Can machines ever be truly conscious — or only simulate it?", options: [{ text: "Yes, consciousness is emergent" }, { text: "No, only humans can feel" }] },
        { id: 16, question: "Would immortality be a blessing or a curse?", options: [{ text: "Eternal life is freedom" }, { text: "Eternal life is torment" }] },
        { id: 17, question: "If your memories were wiped and replaced with someone else’s, who would you be?", options: [{ text: "The new person" }, { text: "Still me — just forgotten" }] },
        { id: 18, question: "Does having more choices make you freer or more trapped?", options: [{ text: "More choices = more freedom" }, { text: "More choices = more confusion" }] },
        { id: 19, question: "Does observation create reality?", options: [{ text: "Yes, reality needs observation" }, { text: "No, it exists regardless" }] },
        { id: 20, question: "The more you chase happiness, the less you find it.", options: [{ text: "True — happiness comes when you stop searching" }, { text: "False — effort brings results" }] }
    ];

    function initializeDatabase() {
        paradoxesRef.once('value', (snapshot) => {
            if (!snapshot.exists()) {
                const initialData = {};
                paradoxesData.forEach(p => {
                    initialData[p.id] = {
                        question: p.question,
                        options: p.options,
                        votes: new Array(p.options.length).fill(0)
                    };
                });
                paradoxesRef.set(initialData);
            }
        });
    }

    function renderParadox(paradoxId, paradox) {
        const questionEl = document.createElement('div');
        questionEl.className = 'paradox-question';
        questionEl.dataset.id = paradoxId;

        const hasVoted = userChoices[paradoxId] !== undefined;
        
        let contentHTML = `<h2 class="question-text">${paradox.question}</h2>`;

        if (hasVoted) {
            contentHTML += renderResultsContent(paradox, userChoices[paradoxId]);
        } else {
            let optionsHTML = paradox.options.map((option, optionIndex) =>
                `<button class="option-btn" data-option-index="${optionIndex}">${option.text}</button>`
            ).join('');
            contentHTML += `<div class="options">${optionsHTML}</div>`;
            contentHTML += `<div class="results-container"></div>`; // Always include results container, but empty
        }
        
        questionEl.innerHTML = contentHTML;
        return questionEl;
    }

    // This function now returns only the inner HTML for the results container
    function renderResultsContent(paradox, selectedOptionIndex) {
        const totalVotes = paradox.votes.reduce((a, b) => a + b, 0);
        const percentages = paradox.options.map((_, index) => {
            return totalVotes > 0 ? Math.round((paradox.votes[index] / totalVotes) * 100) : 0;
        });
        const winnerIndex = percentages[0] >= percentages[1] ? 0 : 1;
        const winnerText = paradox.options[winnerIndex].text;

        return `
            <div class="results-header">THE INTERNET HAS DECIDED.</div>
            <div class="winner-text">☑️ It's ${winnerText.toLowerCase()}</div>
            <div class="results-bar-container">
                <div class="results-bar-segment left" style="width: ${percentages[0]}%;"></div>
                <div class="results-bar-segment right" style="width: ${percentages[1]}%;"></div>
            </div>
            <div class="vote-count">${totalVotes.toLocaleString()} votes</div>
            <div class="results-labels">
                <span>${paradox.options[0].text} (${percentages[0]}%)</span>
                <span>${paradox.options[1].text} (${percentages[1]}%)</span>
            </div>
        `;
    }

    function handleVote(e) {
        if (!e.target.classList.contains('option-btn')) return;

        const selectedBtn = e.target;
        const questionEl = selectedBtn.closest('.paradox-question');
        const paradoxId = questionEl.dataset.id;

        if (userChoices[paradoxId] !== undefined) return;

        const selectedOptionIndex = parseInt(selectedBtn.dataset.optionIndex);
        
        // Save user's choice locally immediately
        userChoices[paradoxId] = selectedOptionIndex;
        localStorage.setItem('userChoices', JSON.stringify(userChoices));

        // Increment the vote count in Firebase and then update UI
        const voteRef = paradoxesRef.child(paradoxId).child('votes').child(selectedOptionIndex);
        voteRef.transaction((currentVotes) => (currentVotes || 0) + 1)
            .then(() => {
                // After transaction, get the updated paradox data from Firebase
                paradoxesRef.child(paradoxId).once('value', (snapshot) => {
                    const updatedParadox = snapshot.val();
                    const optionsContainer = questionEl.querySelector('.options');
                    const resultsContainer = questionEl.querySelector('.results-container');

                    optionsContainer.style.display = 'none';
                    resultsContainer.innerHTML = renderResultsContent(updatedParadox, selectedOptionIndex);
                    resultsContainer.classList.add('visible');
                });
            })
            .catch((error) => {
                console.error("Firebase transaction failed: ", error);
                // Optionally, revert local choice if transaction fails
                delete userChoices[paradoxId];
                localStorage.setItem('userChoices', JSON.stringify(userChoices));
            });
    }

    // Listen for changes and re-render
    paradoxesRef.on('value', (snapshot) => {
        const allParadoxes = snapshot.val();
        userChoices = JSON.parse(localStorage.getItem('userChoices')) || {}; // Reload userChoices

        // Get current paradox IDs in the DOM
        const existingParadoxIds = new Set();
        paradoxesContainer.querySelectorAll('.paradox-question').forEach(el => {
            existingParadoxIds.add(el.dataset.id);
        });

        // Update existing or add new paradoxes
        for (const paradoxId in allParadoxes) {
            const paradox = allParadoxes[paradoxId];
            let existingEl = paradoxesContainer.querySelector(`[data-id="${paradoxId}"]`);

            if (!existingEl) {
                // If element doesn't exist, create and append it
                existingEl = renderParadox(paradoxId, paradox);
                paradoxesContainer.appendChild(existingEl);
            } else {
                // If element exists, replace it with a newly rendered one
                const newEl = renderParadox(paradoxId, paradox);
                paradoxesContainer.replaceChild(newEl, existingEl);
            }
            existingParadoxIds.delete(paradoxId); // Mark as processed
        }

        // Remove paradoxes that no longer exist in Firebase (if any)
        existingParadoxIds.forEach(paradoxId => {
            const elToRemove = paradoxesContainer.querySelector(`[data-id="${paradoxId}"]`);
            if (elToRemove) {
                elToRemove.remove();
            }
        });
    });

    initializeDatabase();
    paradoxesContainer.addEventListener('click', handleVote);
});

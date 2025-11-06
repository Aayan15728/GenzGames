document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const nameInput = document.getElementById('name');
    const birthMonthSelect = document.getElementById('birthMonth');
    const photoUploadInput = document.getElementById('photoUpload');
    const calculateAuraButton = document.getElementById('calculateAuraButton');
    const resetButton = document.getElementById('resetButton');

    const formSection = document.getElementById('form-section');
    const resultSection = document.getElementById('result-section');

    const previewImage = document.getElementById('previewImage');
    const auraGlow = document.getElementById('aura');
    const miniAura = document.getElementById('mini-aura');
    const auraNameSpan = document.getElementById('aura-name');
    const auraRatingSpan = document.getElementById('aura-rating');

    const auras = {
        'Red': { color: '#ff4757', ratingMultiplier: 1.1 },
        'Orange': { color: '#ffa502', ratingMultiplier: 1.3 },
        'Yellow': { color: '#ffd32a', ratingMultiplier: 1.5 },
        'Green': { color: '#2ed573', ratingMultiplier: 1.7 },
        'Blue': { color: '#1e90ff', ratingMultiplier: 1.9 },
        'Indigo': { color: '#4834d4', ratingMultiplier: 2.1 },
        'Violet': { color: '#be2edd', ratingMultiplier: 2.3 }
    };
    const auraKeys = Object.keys(auras);

    calculateAuraButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const birthMonth = parseInt(birthMonthSelect.value);
        const photoFile = photoUploadInput.files[0];

        if (!name || !photoFile) {
            alert('Please enter your name and upload a photo!');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;

            // --- Aura Calculation ---
            const nameFactor = name.length % auraKeys.length;
            const monthFactor = (birthMonth - 1) % auraKeys.length;
            const auraIndex = (nameFactor + monthFactor) % auraKeys.length;
            const auraName = auraKeys[auraIndex];
            const auraInfo = auras[auraName];

            // Calculate rating
            const baseRating = (name.length * 10) + (birthMonth * 50);
            const finalRating = Math.floor(baseRating * auraInfo.ratingMultiplier);

            // --- Display Results ---
            auraGlow.style.backgroundColor = auraInfo.color;
            miniAura.style.backgroundColor = auraInfo.color;
            auraNameSpan.textContent = auraName;
            auraRatingSpan.textContent = finalRating;

            // Switch views
            formSection.classList.add('hidden');
            resultSection.classList.remove('hidden');
        };
        reader.readAsDataURL(photoFile);
    });

    resetButton.addEventListener('click', () => {
        // Reset form fields
        nameInput.value = '';
        birthMonthSelect.value = '1';
        photoUploadInput.value = '';
        previewImage.src = '#';

        // Switch views
        resultSection.classList.add('hidden');
        formSection.classList.remove('hidden');
    });

    // Info Modal Logic
    const infoIcon = document.getElementById('info-icon');
    const infoModal = document.getElementById('info-modal');
    const closeButton = document.querySelector('.close-button');

    infoIcon.addEventListener('click', () => {
        infoModal.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        infoModal.classList.add('hidden');
    });

    // Also close modal if user clicks outside of the content area
    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.classList.add('hidden');
        }
    });
});

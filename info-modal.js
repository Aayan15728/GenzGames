document.addEventListener('DOMContentLoaded', () => {
    const infoIcon = document.getElementById('info-icon');
    const infoModal = document.getElementById('info-modal');
    const closeButton = document.querySelector('.close-button');

    if (infoIcon && infoModal && closeButton) {
        infoIcon.addEventListener('click', () => {
            infoModal.classList.remove('hidden');
        });

        closeButton.addEventListener('click', () => {
            infoModal.classList.add('hidden');
        });

        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) {
                infoModal.classList.add('hidden');
            }
        });
    }
});

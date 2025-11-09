document.addEventListener('DOMContentLoaded', () => {
    const dynamicDateElement = document.getElementById('dynamic-date');
    if (dynamicDateElement) {
        const today = new Date();
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(today.getFullYear() - 10);

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dynamicDateElement.textContent = tenYearsAgo.toLocaleDateString('en-US', options) + '.';
    }
});

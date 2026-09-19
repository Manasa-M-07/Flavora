document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (!themeToggleBtn) return;

    // Check for saved theme preference, otherwise use dark (luxury emerald) by default
    const savedTheme = localStorage.getItem('flavoraTheme') || 'dark';
    
    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.body.classList.remove('light-mode');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
        localStorage.setItem('flavoraTheme', theme);
    }

    // Apply initially
    applyTheme(savedTheme);

    // Toggle on click
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });
});

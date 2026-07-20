// Theme Toggle Logic
(function() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    // Apply theme immediately
    if (currentTheme == 'light') {
        document.body.setAttribute('data-theme', 'light');
    }

    // Wait for DOM to attach event listener if script is loaded in head,
    // or attach immediately if loaded at the end of body.
    function attachListener() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                let theme = document.body.getAttribute('data-theme');
                if (theme === 'light') {
                    document.body.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachListener);
    } else {
        attachListener();
    }
})();

// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Select all sections that have an 'id' attribute
    const sections = document.querySelectorAll('section[id]');
    // Select all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    // Select the main navbar element
    const navbar = document.querySelector('.navbar');

    // Define which sections are considered to have "dark" backgrounds.
    // When the navbar is over these sections, its text/logo should become light for better contrast.
    const darkBackgroundSections = ['services', 'staff', 'contact'];

    /**
     * Updates the active state of navigation links and adjusts navbar theme
     * based on the current scroll position.
     */
    function updateNavAndTheme() {
        let currentActiveSectionId = '';
        let shouldNavbarBeDarkThemed = false;

        // Determine which section is currently in view
        sections.forEach(section => {
            // Calculate section boundaries relative to the viewport.
            // Adjust 'offsetTop' by navbar height + a small buffer for better UX.
            const sectionTop = section.offsetTop - navbar.offsetHeight - 50;
            const sectionBottom = sectionTop + section.offsetHeight;

            // Check if the current scroll position is within the section's boundaries
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentActiveSectionId = section.id;

                // Check if the current section is one of the dark background sections
                if (darkBackgroundSections.includes(section.id)) {
                    shouldNavbarBeDarkThemed = true;
                }
            }
        });

        // 1. Update active navigation link:
        navLinks.forEach(link => {
            link.classList.remove('active'); // Remove 'active' from all links first
            // If the link's href matches the ID of the current active section, add 'active'
            if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                link.classList.add('active');
            }
        });

        // 2. Update navbar theme:
        if (shouldNavbarBeDarkThemed) {
            navbar.classList.add('dark-theme-active'); // Add class to make navbar elements light
        } else {
            navbar.classList.remove('dark-theme-active'); // Remove class to keep navbar elements dark (default)
        }

        // Handle initial state when at the very top of the page (before any section is definitively "active")
        if (!currentActiveSectionId && window.scrollY < sections[0].offsetTop - navbar.offsetHeight - 50) {
            navLinks[0].classList.add('active'); // Assume 'Home' is active if at the top
            navbar.classList.remove('dark-theme-active'); // Assume 'Home' is light background
        }
    }

    // Add scroll event listener to trigger the update function
    window.addEventListener('scroll', updateNavAndTheme);

    // Initial call to set the correct state on page load
    updateNavAndTheme();

    /**
     * Implements smooth scrolling when navigation links are clicked.
     */
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor jump behavior

            const targetId = this.getAttribute('href'); // Get the target section ID (e.g., '#about-us')
            const targetSection = document.querySelector(targetId); // Find the actual section element

            if (targetSection) {
                // Calculate the scroll position, accounting for the fixed navbar height
                const offsetTop = targetSection.offsetTop - navbar.offsetHeight + 1; // +1 to prevent flickering

                // Smoothly scroll to the calculated position
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
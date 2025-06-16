// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Select all sections that have an 'id' attribute
    const sections = document.querySelectorAll('section[id]');
    // Select all navigation links (desktop and mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    // Select the main navbar element
    const navbar = document.querySelector('.navbar');

    // NEW: Select hamburger menu elements by their IDs
    const hamburgerMenu = document.getElementById('hamburger-menu');
    // This is the <ul> element that holds the navigation links for mobile
    const mobileNavLinks = document.getElementById('nav-links'); 

    // Define which sections are considered to have "dark" backgrounds.
    // When the navbar is over these sections, its text/logo should become light for better contrast.
    // Ensure these IDs ('services', 'staff', 'contact') correspond to actual dark background sections in your HTML.
    const darkBackgroundSections = ['services', 'staff', 'contact']; 

    /**
     * Updates the active state of navigation links and adjusts navbar theme
     * based on the current scroll position.
     */
    function updateNavAndTheme() {
        let currentActiveSectionId = '';
        let shouldNavbarBeDarkThemed = false;
        const navbarHeight = navbar.offsetHeight; // Get current navbar height dynamically

        // Determine which section is currently in view
        sections.forEach(section => {
            // Calculate section boundaries relative to the viewport.
            // A buffer (e.g., 50px) is added to sectionTop to prevent links from becoming active too early/late,
            // making the active state feel more natural as the section enters the main viewport.
            const sectionTop = section.offsetTop - navbarHeight - 50; 
            const sectionBottom = section.offsetTop + section.offsetHeight;

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
            link.classList.remove('active'); // Remove 'active' class from all links first

            // If the link's href matches the ID of the current active section, add 'active' class
            if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                link.classList.add('active');
            }
        });

        // Handle the "Home" link specifically if at the very top of the page.
        // If no specific section is active and we are near the top, activate 'Home' link.
        // The '+ 100' provides a small scroll-down buffer before the 'Home' active state is removed.
        if (!currentActiveSectionId && window.scrollY < (sections[0] ? sections[0].offsetTop - navbarHeight - 50 + 100 : 100)) {
             document.querySelector('a[href="#home"]').classList.add('active');
        }

        // 2. Update navbar theme based on darkBackgroundSections:
        if (shouldNavbarBeDarkThemed) {
            navbar.classList.add('dark-theme-active'); // Add class to make navbar elements light/dark as per theme
        } else {
            // Only remove dark-theme-active if not currently over a dark section
            // AND if we are not at the very top where the hero section (light background) is visible
            if (window.scrollY < (sections[0] ? sections[0].offsetTop - navbarHeight - 50 : 0) + 100) {
                 navbar.classList.remove('dark-theme-active');
            } else if (!shouldNavbarBeDarkThemed) { // Ensure it's removed if not over a dark section
                 navbar.classList.remove('dark-theme-active');
            }
        }

        // Ensure navbar is light when at the very top of the page (e.g., hero section)
        if (window.scrollY === 0) {
            navbar.classList.remove('dark-theme-active');
        }
    }

    // Add scroll event listener to trigger the update function
    window.addEventListener('scroll', updateNavAndTheme);

    // Initial call to set the correct state on page load
    updateNavAndTheme();

    // --- Hamburger Menu Toggle Logic ---
    // Check if hamburgerMenu and mobileNavLinks elements exist before adding listeners
    if (hamburgerMenu && mobileNavLinks) {
        hamburgerMenu.addEventListener('click', function() {
            mobileNavLinks.classList.toggle('active');   // Toggle active class on mobile nav <ul>
            hamburgerMenu.classList.toggle('active');    // Toggle active class on hamburger icon
            document.body.classList.toggle('no-scroll'); // Toggle class to prevent/allow body scrolling
        });

        // Close mobile menu when a navigation link is clicked inside the menu
        mobileNavLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                // Check if the menu is open before trying to close it
                if (mobileNavLinks.classList.contains('active')) {
                    mobileNavLinks.classList.remove('active');
                    hamburgerMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    /**
     * Implements smooth scrolling when navigation links are clicked.
     */
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor jump behavior (instant scroll)

            const targetId = this.getAttribute('href'); // Get the target section ID (e.g., '#about-us')
            const targetSection = document.querySelector(targetId); // Find the actual section element

            if (targetSection) {
                // Calculate the scroll position, accounting for the fixed navbar height.
                // The '+ 1' is a small adjustment to prevent visual flickering at section boundaries.
                const offsetTop = targetSection.offsetTop - navbar.offsetHeight + 1; 

                // Smoothly scroll to the calculated position
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth' // Enables smooth scrolling animation
                });
            }
        });
    });
});

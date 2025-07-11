// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Select all sections that have an 'id' attribute on the CURRENT page
    const sections = document.querySelectorAll('section[id]');
    // Select all navigation links (desktop and mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    // Select the main navbar element
    const navbar = document.querySelector('.navbar');

    // Select hamburger menu elements by their IDs
    const hamburgerMenu = document.getElementById('hamburger-menu');
    // This is the <ul> element that holds the navigation links for mobile
    const mobileNavLinks = document.getElementById('nav-links'); 

    // Select the scroll indicator element (present on hero sections of various pages)
    const scrollDownIndicator = document.getElementById('scrollDownIndicator');

    // Define which sections on the index.html are considered to have "dark" backgrounds.
    const darkBackgroundSections = ['about-us', 'services', 'staff', 'contact']; 

    /**
     * Highlights the navigation link corresponding to the current HTML page.
     * This function runs once on page load for all pages.
     */
    function highlightCurrentPageNavLink() {
        // Get the current page's filename (e.g., "index.html", "about-us-detailed.html")
        const path = window.location.pathname;
        let currentPage = path.substring(path.lastIndexOf('/') + 1);

        // Handle root URL case (e.g., "http://localhost:8000/" might have currentPage as "")
        if (currentPage === '' || currentPage === '/') {
            currentPage = 'index.html'; // Treat root as index.html
        }

        navLinks.forEach(link => {
            link.classList.remove('active'); // Remove active from all links first
            
            // Get the target filename from the link's href attribute
            const linkHref = link.getAttribute('href');
            let linkFileName = linkHref.substring(linkHref.lastIndexOf('/') + 1);
            
            // Activate the link if its target filename matches the current page's filename
            if (linkFileName === currentPage) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Manages the active state for internal sections on the homepage (index.html)
     * based on scroll position, and controls the navbar's dark/light theme.
     * This function only runs if the current page is index.html.
     */
    function updateIndexPageNavAndThemeOnScroll() {
        // Only execute this logic if on the index.html page
        const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

        if (isIndexPage) {
            let currentActiveSectionId = '';
            let shouldNavbarBeDarkThemed = false;
            const navbarHeight = navbar.offsetHeight;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - navbarHeight - 50; 
                const sectionBottom = section.offsetTop + section.offsetHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    currentActiveSectionId = section.id;
                    if (darkBackgroundSections.includes(section.id)) {
                        shouldNavbarBeDarkThemed = true;
                    }
                }
            });

            // Iterate through nav links, but only affect internal links (`#id`)
            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                if (linkHref.startsWith('#')) {
                    link.classList.remove('active'); // Remove active from all internal links first
                    if (linkHref === `#${currentActiveSectionId}`) {
                        link.classList.add('active');
                    }
                }
            });

            // Special handling for the "Home" link based on scroll position at the very top
            // If at the top and no other internal section is active, make "Home" active.
            if (window.scrollY < (sections[0] ? sections[0].offsetTop - navbarHeight - 50 + 100 : 100)) {
                // Find the actual 'Home' link element by its full href to "index.html"
                const homeLink = document.querySelector('a[href="index.html"]');
                if (homeLink) {
                    homeLink.classList.add('active');
                }
            }

            // Update navbar theme based on sections
            if (shouldNavbarBeDarkThemed) {
                navbar.classList.add('dark-theme-active');
            } else {
                navbar.classList.remove('dark-theme-active');
            }
            // Ensure navbar is light when at the very top of the page (hero section)
            if (window.scrollY === 0) {
                 navbar.classList.remove('dark-theme-active');
            }
        } else {
            // If not on index.html, ensure the navbar is always in its default light theme state
            navbar.classList.remove('dark-theme-active');
        }
    }

    // Initial calls on page load
    highlightCurrentPageNavLink();          // Sets active link for the current HTML file
    updateIndexPageNavAndThemeOnScroll();   // Applies homepage-specific scroll logic (if on index.html)

    // Add scroll event listener
    window.addEventListener('scroll', updateIndexPageNavAndThemeOnScroll);

    // --- Hamburger Menu Toggle Logic ---
    if (hamburgerMenu && mobileNavLinks) {
        hamburgerMenu.addEventListener('click', function() {
            mobileNavLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when a navigation link is clicked inside the menu
        mobileNavLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNavLinks.classList.contains('active')) {
                    mobileNavLinks.classList.remove('active');
                    hamburgerMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    /**
     * Implements smooth scrolling when internal navigation links are clicked,
     * but only if on the index.html page. External links behave normally.
     */
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

            // ONLY prevent default and smooth scroll if it's an internal anchor link AND we are on index.html
            if (targetHref.startsWith('#') && isIndexPage) {
                e.preventDefault(); 
                const targetSection = document.querySelector(targetHref);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - navbar.offsetHeight + 1; 
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // If it's an external page link (e.g., "loans-detailed.html"), the browser's default behavior will handle it.
            // If it's an internal link but NOT on index.html, it will also default to normal browser behavior.
        });
    });

    // --- Loan Calculator Logic ---
    const calculateLoanBtn = document.getElementById('calculateLoan');
    const loanAmountInput = document.getElementById('loanAmount');
    const interestRateInput = document.getElementById('interestRate');
    const loanTermInput = document.getElementById('loanTerm');
    const repaymentResultDiv = document.getElementById('repaymentResult');

    if (calculateLoanBtn && loanAmountInput && interestRateInput && loanTermInput && repaymentResultDiv) {
        calculateLoanBtn.addEventListener('click', () => {
            const principal = parseFloat(loanAmountInput.value);
            const annualInterestRate = parseFloat(interestRateInput.value);
            const loanTermMonths = parseInt(loanTermInput.value);

            // Input Validation
            if (isNaN(principal) || principal <= 0) {
                repaymentResultDiv.innerHTML = '<p style="color: red;">Please enter a valid loan amount.</p>';
                return;
            }
            if (isNaN(annualInterestRate) || annualInterestRate < 0) {
                repaymentResultDiv.innerHTML = '<p style="color: red;">Please enter a valid interest rate.</p>';
                return;
            }
            if (isNaN(loanTermMonths) || loanTermMonths <= 0) {
                repaymentResultDiv.innerHTML = '<p style="color: red;">Please enter a valid loan term in months.</p>';
                return;
            }

            // Convert annual interest rate to monthly decimal rate
            const monthlyInterestRate = (annualInterestRate / 100) / 12;

            let monthlyPayment = 0;
            let totalPayable = 0;
            let totalInterest = 0;

            if (monthlyInterestRate === 0) {
                // Simple interest calculation if rate is 0
                monthlyPayment = principal / loanTermMonths;
                totalPayable = principal;
                totalInterest = 0;
            } else {
                // EMI formula
                const factor = Math.pow(1 + monthlyInterestRate, loanTermMonths);
                monthlyPayment = principal * (monthlyInterestRate * factor) / (factor - 1);
                totalPayable = monthlyPayment * loanTermMonths;
                totalInterest = totalPayable - principal;
            }

            // Display results, formatted to 2 decimal places
            repaymentResultDiv.innerHTML = `
                <p style="font-size: 1.2rem; color: var(--text-dark);">
                    Monthly Repayment: <span style="font-weight: bold; color: var(--primary-color);">KES ${monthlyPayment.toFixed(2)}</span>
                </p>
                <p style="font-size: 0.9rem; color: #777;">
                    Total Payable: KES ${totalPayable.toFixed(2)} | Total Interest: KES ${totalInterest.toFixed(2)}
                </p>
            `;
        });
    }

    // --- Clickable Scroll Indicator Logic for All Pages with Hero and subsequent content ---
    // This logic runs if the 'scrollDownIndicator' element is present on the page.
    if (scrollDownIndicator) {
        scrollDownIndicator.addEventListener('click', () => {
            const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
            let targetSection = null;

            if (isIndexPage) {
                // On the index page, scroll to the 'about-us' section
                targetSection = document.getElementById('about-us');
            } else {
                // On subpages, scroll to the section immediately following the hero-subpage
                const heroSubpage = document.querySelector('.hero-subpage');
                if (heroSubpage) {
                    // Find the next sibling that is a 'section'
                    let nextSibling = heroSubpage.nextElementSibling;
                    while (nextSibling) {
                        if (nextSibling.tagName === 'SECTION') {
                            targetSection = nextSibling;
                            break;
                        }
                        nextSibling = nextSibling.nextElementSibling;
                    }
                }
            }
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - navbar.offsetHeight + 1;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else {
                // Fallback: If no suitable section is found, scroll down by a viewport height
                window.scrollBy({
                    top: window.innerHeight * 0.8, // Scroll down by 80% of viewport height
                    behavior: 'smooth'
                });
            }
        });
    }
});

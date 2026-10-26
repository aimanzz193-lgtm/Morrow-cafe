
/* ==========================================
   MORROW ESPRESS CO.
   Website JavaScript
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. MOBILE NAVIGATION
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNavigation = document.querySelector("#mobile-navigation");

    if (menuToggle && mobileNavigation) {

        menuToggle.addEventListener("click", () => {
            const isOpen = mobileNavigation.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        // Close the menu after selecting a navigation link
        mobileNavigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileNavigation.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
                menuToggle.textContent = "☰";
            });
        });

        // Close the menu when clicking outside it
        document.addEventListener("click", event => {
            const clickedInsideMenu = mobileNavigation.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                mobileNavigation.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
                menuToggle.textContent = "☰";
            }
        });

        // Close mobile menu when returning to desktop width
        window.addEventListener("resize", () => {
            if (window.innerWidth > 650) {
                mobileNavigation.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
                menuToggle.textContent = "☰";
            }
        });
    }


    // 2. AUTOMATIC COPYRIGHT YEAR
    const yearElement = document.querySelector("#year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // 3. SMOOTH SCROLL FOR INTERNAL LINKS
    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                // Update the URL hash without jumping abruptly
                if (history.replaceState) {
                    history.replaceState(null, "", targetId);
                }
            }
        });
    });


    // 4. SUBTLE SCROLL REVEAL ANIMATIONS
    const animatedElements = document.querySelectorAll(
        ".story-heading, .story-description, .gallery-item, " +
        ".menu-item, .feature-content, .visit-content, .detail-item"
    );

    // Respect users who prefer reduced motion
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !prefersReducedMotion) {

        const observer = new IntersectionObserver((entries, observerInstance) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observerInstance.unobserve(entry.target);
                }

            });

        }, {
            threshold: 0.12
        });

        animatedElements.forEach(element => {
            element.classList.add("reveal");
            observer.observe(element);
        });
    }


    // 5. CONSOLE MESSAGE
    console.log("MORROW Espress Co. website loaded successfully.");

});

async function loadMenuFromBackend() {
    const menuContainer = document.querySelector("#backend-menu");

    // Do nothing if this container isn't on the page
    if (!menuContainer) return;

    try {
        const response = await fetch("/api/menu");

        if (!response.ok) {
            throw new Error("Failed to load menu");
        }

        const result = await response.json();

        menuContainer.innerHTML = "";

        result.data.forEach(item => {
            const card = document.createElement("article");
            card.className = "menu-item";

            const heading = document.createElement("h3");
            heading.textContent = item.name;

            const description = document.createElement("p");
            description.textContent = item.description;

            const category = document.createElement("span");
            category.textContent = item.category;

            const price = document.createElement("p");
            price.textContent = item.price == null
                ? "Price to be confirmed"
                : `PKR ${item.price}`;

            card.append(category, heading, description, price);
            menuContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Menu loading error:", error);
        menuContainer.textContent =
            "The menu could not load. Please try again later.";
    }
}

document.addEventListener("DOMContentLoaded", loadMenuFromBackend);

(function () {
    const academyData = globalThis.musicAcademyData || { classes: [] };
    const currency = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    });

    function getClasses() {
        return academyData.classes.slice();
    }

    function formatPrice(amount) {
        return currency.format(amount);
    }

    function getClassById(classId) {
        return getClasses().find((musicClass) => musicClass.id === classId);
    }

    function createClassCard(musicClass, compact) {
        const wrapper = document.createElement("div");
        wrapper.className = "col-md-6 col-xl-4";
        wrapper.innerHTML = `
            <article class="class-card">
                <div class="d-flex justify-content-between align-items-start gap-3">
                    <div class="class-symbol">${musicClass.icon}</div>
                    <span class="price-tag">${formatPrice(musicClass.monthlyFee)} / month</span>
                </div>
                <h3>${musicClass.name}</h3>
                <p>${musicClass.blurb}</p>
                <div class="class-meta">
                    <span class="meta-badge">${musicClass.category}</span>
                    <span class="meta-badge">${musicClass.level}</span>
                    <span class="meta-badge">${musicClass.batch}</span>
                </div>
                <div class="detail-grid">
                    <div class="detail-row">
                        <span>Schedule</span>
                        <strong>${musicClass.schedule}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Session length</span>
                        <strong>${musicClass.duration}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Instructor</span>
                        <strong>${musicClass.instructor}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Age group</span>
                        <strong>${musicClass.ageGroup}</strong>
                    </div>
                </div>
                <div class="mt-auto d-flex flex-wrap gap-2">
                    <a class="btn btn-accent" href="${compact ? "pages/enroll.html" : "enroll.html"}?class=${musicClass.id}#registration-form">Register</a>
                    <a class="btn btn-outline-dark" href="${compact ? "pages/enroll.html" : "enroll.html"}?class=${musicClass.id}#demo-form">${musicClass.demoAvailable ? "Book Demo" : "Join Waitlist"}</a>
                </div>
            </article>
        `;
        return wrapper;
    }

    function renderFeaturedClasses() {
        const container = document.querySelector("[data-featured-classes]");
        if (!container) {
            return;
        }

        getClasses()
            .slice(0, 3)
            .forEach((musicClass) => container.appendChild(createClassCard(musicClass, true)));
    }

    function populateCategoryFilter(classes) {
        const select = document.querySelector('[data-filter="category"]');
        if (!select) {
            return;
        }

        const categories = Array.from(new Set(classes.map((musicClass) => musicClass.category)));
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    }

    function renderCatalog(filteredClasses) {
        const list = document.querySelector("[data-class-list]");
        const emptyState = document.querySelector("[data-empty-state]");
        if (!list) {
            return;
        }

        list.innerHTML = "";
        filteredClasses.forEach((musicClass) => list.appendChild(createClassCard(musicClass, false)));

        if (emptyState) {
            emptyState.classList.toggle("d-none", filteredClasses.length > 0);
        }
    }

    function wireCatalogFilters() {
        const list = document.querySelector("[data-class-list]");
        if (!list) {
            return;
        }

        const classes = getClasses();
        populateCategoryFilter(classes);

        const controls = document.querySelectorAll("[data-filter]");
        const applyFilters = function () {
            const category = document.getElementById("instrumentFilter")?.value || "all";
            const level = document.getElementById("levelFilter")?.value || "all";
            const search = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();

            const filtered = classes.filter((musicClass) => {
                const matchesCategory = category === "all" || musicClass.category === category;
                const matchesLevel = level === "all" || musicClass.level === level;
                const haystack = `${musicClass.name} ${musicClass.category} ${musicClass.blurb} ${musicClass.instructor}`.toLowerCase();
                const matchesSearch = search.length === 0 || haystack.includes(search);
                return matchesCategory && matchesLevel && matchesSearch;
            });

            renderCatalog(filtered);
        };

        controls.forEach((control) => {
            control.addEventListener("input", applyFilters);
            control.addEventListener("change", applyFilters);
        });
        renderCatalog(classes);
    }

    function setActiveNavigation() {
        const page = document.body.dataset.page;
        const links = document.querySelectorAll(".nav-link");
        links.forEach((link) => {
            const href = link.getAttribute("href") || "";
            const normalizedHref = href.replace("../", "");
            const isHome = page === "home" && normalizedHref === "index.html";
            const isClasses = page === "classes" && normalizedHref.endsWith("classes.html");
            const isEnroll = page === "enroll" && normalizedHref.endsWith("enroll.html");
            link.classList.toggle("active", isHome || isClasses || isEnroll);
            if (isHome || isClasses || isEnroll) {
                link.setAttribute("aria-current", "page");
            }
        });
    }

    globalThis.musicAcademyApp = {
        getClasses,
        getClassById,
        formatPrice
    };

    setActiveNavigation();
    renderFeaturedClasses();
    wireCatalogFilters();
})();
(function () {
    const storageKey = "basic-music-academy-submissions";
    const academyApp = globalThis.musicAcademyApp;

    if (!academyApp) {
        return;
    }

    const classSelects = document.querySelectorAll("[data-class-select]");
    const forms = document.querySelectorAll("form[data-form]");
    const selectedClassSummary = document.querySelector("[data-selected-class-summary]");
    const submissionList = document.querySelector("[data-submission-list]");

    function getStoredSubmissions() {
        try {
            const raw = globalThis.localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch (error) {
            console.warn("Unable to read saved submissions from local storage.", error);
            return [];
        }
    }

    function saveStoredSubmissions(submissions) {
        try {
            globalThis.localStorage.setItem(storageKey, JSON.stringify(submissions));
        } catch (error) {
            console.warn("Unable to save submissions to local storage.", error);
        }
    }

    function buildClassOptionLabel(musicClass) {
        return `${musicClass.name} - ${academyApp.formatPrice(musicClass.monthlyFee)} / month`;
    }

    function populateClassOptions() {
        const classes = academyApp.getClasses();
        const selectedClassId = new URLSearchParams(globalThis.location.search).get("class");

        classSelects.forEach((select) => {
            select.innerHTML = '<option value="">Select a class</option>';
            classes.forEach((musicClass) => {
                const option = document.createElement("option");
                option.value = musicClass.id;
                option.textContent = buildClassOptionLabel(musicClass);
                select.appendChild(option);
            });

            if (selectedClassId && classes.some((musicClass) => musicClass.id === selectedClassId)) {
                select.value = selectedClassId;
            }
        });
    }

    function renderSelectedClass(classId) {
        if (!selectedClassSummary) {
            return;
        }

        const selectedClass = academyApp.getClassById(classId);
        if (!selectedClass) {
            selectedClassSummary.innerHTML = `
                <p class="text-body-secondary mb-2">Selected class</p>
                <h2 class="h4">Choose a class from the form</h2>
                <p class="mb-0">Monthly fee, schedule, and mode will appear here.</p>
            `;
            return;
        }

        selectedClassSummary.innerHTML = `
            <p class="text-body-secondary mb-2">Selected class</p>
            <h2 class="h4">${selectedClass.name}</h2>
            <p class="mb-3">${selectedClass.blurb}</p>
            <div class="detail-row mb-2">
                <span>Monthly fee</span>
                <strong>${academyApp.formatPrice(selectedClass.monthlyFee)}</strong>
            </div>
            <div class="detail-row mb-2">
                <span>Schedule</span>
                <strong>${selectedClass.schedule}</strong>
            </div>
            <div class="detail-row">
                <span>Batch</span>
                <strong>${selectedClass.batch}</strong>
            </div>
        `;
    }

    function renderSubmissionList() {
        if (!submissionList) {
            return;
        }

        const submissions = getStoredSubmissions().slice(-4).reverse();
        if (submissions.length === 0) {
            submissionList.innerHTML = '<p class="mb-0 text-body-secondary">No submissions yet.</p>';
            return;
        }

        submissionList.innerHTML = submissions.map((submission) => {
            const musicClass = academyApp.getClassById(submission.classId);
            const className = musicClass ? musicClass.name : "Unknown class";
            return `
                <div class="submission-item">
                    <strong>${submission.studentName}</strong>
                    <small>${submission.type === "demo" ? "Demo request" : "Registration"} for ${className}</small>
                </div>
            `;
        }).join("");
    }

    function persistSubmission(formType, formData) {
        const submissions = getStoredSubmissions();
        submissions.push({
            type: formType,
            studentName: formData.studentName,
            classId: formData.classId,
            timestamp: new Date().toISOString()
        });
        saveStoredSubmissions(submissions);
        renderSubmissionList();
    }

    function serializeForm(form) {
        const formData = new FormData(form);
        return Object.fromEntries(formData.entries());
    }

    function updateSelectionAcrossForms(classId) {
        classSelects.forEach((select) => {
            if (select.value !== classId) {
                select.value = classId;
            }
        });
        renderSelectedClass(classId);
    }

    function handleFormSubmit(form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                return;
            }

            const formType = form.dataset.form;
            const values = serializeForm(form);
            const message = document.querySelector(`[data-form-message="${formType}"]`);
            persistSubmission(formType, values);

            if (message) {
                message.textContent = formType === "demo"
                    ? "Demo request saved in local storage."
                    : "Registration saved in local storage.";
            }

            form.reset();
            form.classList.remove("was-validated");
            updateSelectionAcrossForms(values.classId);
        });
    }

    populateClassOptions();
    renderSubmissionList();

    classSelects.forEach((select) => {
        select.addEventListener("change", function () {
            updateSelectionAcrossForms(select.value);
        });
    });

    forms.forEach(handleFormSubmit);

    const initialClassId = classSelects[0]?.value || new URLSearchParams(globalThis.location.search).get("class") || "";
    renderSelectedClass(initialClassId);
})();
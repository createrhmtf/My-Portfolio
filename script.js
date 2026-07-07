document.addEventListener("DOMContentLoaded", () => {
    const typingText = document.getElementById("typing-text");
    const words = ["DEVELOPER", "DESIGNER", "ENGINEER", "PROGRAMMER", "BUILDER"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
        if (!typingText) return;
        const currentWord = words[wordIndex];
        typingText.textContent = currentWord.slice(0, charIndex + (isDeleting ? -1 : 1));
        charIndex += isDeleting ? -1 : 1;

        let delay = isDeleting ? 58 : 95;
        if (!isDeleting && charIndex === currentWord.length) {
            delay = 1350;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 430;
        }
        window.setTimeout(typeLoop, delay);
    }
    typeLoop();

    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (cursorDot && cursorOutline && hasFinePointer) {
        window.addEventListener("mousemove", (event) => {
            const posX = event.clientX;
            const posY = event.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 450, fill: "forwards" });
        });

        document.querySelectorAll("a, button, input, textarea, .floating-icon, .skill-card").forEach((element) => {
            element.addEventListener("mouseenter", () => cursorOutline.classList.add("hovered"));
            element.addEventListener("mouseleave", () => cursorOutline.classList.remove("hovered"));
        });
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("expanded", entry.isIntersecting);
        });
    }, { threshold: 0.28 });

    document.querySelectorAll(".scroll-reveal").forEach((element) => revealObserver.observe(element));

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.22 });

    document.querySelectorAll(".timeline-item").forEach((item) => timelineObserver.observe(item));

    function updateTimeline() {
        document.querySelectorAll(".timeline").forEach((timeline) => {
            const progress = timeline.querySelector(".timeline-progress");
            const dots = timeline.querySelectorAll(".timeline-dot");
            if (!progress) return;

            const rect = timeline.getBoundingClientRect();
            const start = window.innerHeight * 0.55;
            const distance = start - rect.top;
            const percent = Math.max(0, Math.min(100, (distance / rect.height) * 100));
            progress.style.height = `${percent}%`;

            const lineBottom = progress.getBoundingClientRect().bottom;
            dots.forEach((dot) => {
                dot.classList.toggle("active", lineBottom > dot.getBoundingClientRect().top);
            });
        });
    }

    updateTimeline();
    window.addEventListener("scroll", updateTimeline, { passive: true });
    window.addEventListener("resize", updateTimeline);

    document.querySelectorAll(".experience-card").forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
            card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
        });
    });

    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(".sub-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
        gsap.fromTo(".main-title", { opacity: 0, scale: 0.94, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, delay: 0.18, ease: "power2.out" });
        gsap.fromTo(".year", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.36, ease: "power2.out" });
        gsap.fromTo(".hero-buttons .btn-resume", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.52, stagger: 0.08, ease: "power2.out" });

        gsap.utils.toArray(".section-title").forEach((title) => {
            gsap.fromTo(title, { opacity: 0, y: 36 }, {
                opacity: 1,
                y: 0,
                duration: 0.75,
                ease: "power3.out",
                scrollTrigger: { trigger: title, start: "top 88%", toggleActions: "play none none reverse" }
            });
        });

        gsap.fromTo(".experience-card", { opacity: 0, y: 52, scale: 0.95 }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "back.out(1.35)",
            scrollTrigger: { trigger: ".experience-grid", start: "top 82%", toggleActions: "play none none reverse" }
        });

        gsap.fromTo(".skill-card", { opacity: 0, y: 34, scale: 0.92 }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.48,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: { trigger: ".skill-grid", start: "top 84%", toggleActions: "play none none reverse" }
        });

        gsap.fromTo(".cert-item, .profile-card", { opacity: 0, y: 40, filter: "blur(8px)" }, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.72,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: ".certifications-section", start: "top 86%", toggleActions: "play none none reverse" }
        });

        gsap.fromTo(".contact-container", { opacity: 0, scale: 0.94, filter: "blur(8px)" }, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: ".contact-container", start: "top 82%", toggleActions: "play none none reverse" }
        });
    }

    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        window.addEventListener("scroll", () => {
            const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
            backToTopBtn.classList.toggle("bounce", nearBottom);
        }, { passive: true });
    }

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const submit = contactForm.querySelector("button[type='submit']");
            const original = submit.innerHTML;
            const formData = new FormData(contactForm);
            const name = String(formData.get("name") || "").trim();
            const email = String(formData.get("email") || "").trim();
            const message = String(formData.get("message") || "").trim();
            const subject = encodeURIComponent(`Portfolio message from ${name || "visitor"}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
            submit.innerHTML = "<span>Message Ready</span><i class=\"fa-solid fa-check\"></i>";
            submit.style.borderColor = "#4ade80";
            formStatus.textContent = "Opening your email app with the message prepared.";
            window.location.href = `mailto:talhafahadhafiz@gmail.com?subject=${subject}&body=${body}`;
            contactForm.reset();
            window.setTimeout(() => {
                submit.innerHTML = original;
                submit.style.borderColor = "";
            }, 2600);
        });
    }

    const resumeModal = document.getElementById("resumeModal");
    const openResumeBtn = document.getElementById("openResumeBtn");
    const closeResumeBtn = document.getElementById("closeResumeBtn");
    const resumeFrame = document.getElementById("resumeFrame");
    const resumePlaceholder = document.getElementById("resumePlaceholder");
    const resumePath = "assets/Hafiz_Talha_CV.pdf";
    let resumeChecked = false;
    let resumeAvailable = false;

    async function checkResume() {
        if (resumeChecked) return resumeAvailable;
        resumeChecked = true;
        try {
            const response = await fetch(resumePath, { method: "HEAD", cache: "no-store" });
            resumeAvailable = response.ok;
        } catch {
            resumeAvailable = false;
        }
        return resumeAvailable;
    }

    async function openResume(event) {
        if (event) event.preventDefault();
        if (!resumeModal) return;
        resumeModal.classList.add("show");
        resumeModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        const available = await checkResume();
        if (available && resumeFrame && resumePlaceholder) {
            resumeFrame.src = resumePath;
            resumeFrame.style.display = "block";
            resumePlaceholder.style.display = "none";
        }
    }

    function closeResume() {
        if (!resumeModal) return;
        resumeModal.classList.remove("show");
        resumeModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    if (openResumeBtn) openResumeBtn.addEventListener("click", openResume);
    if (closeResumeBtn) closeResumeBtn.addEventListener("click", closeResume);
    if (resumeModal) {
        resumeModal.addEventListener("click", (event) => {
            if (event.target === resumeModal) closeResume();
        });
    }
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeResume();
    });
});

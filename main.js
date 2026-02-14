// Initialize scroll animations with more variety
AOS.init({
    duration: 650,
    easing: "ease-out-cubic",
    once: false,
    offset: 50,
    delay: 0,
    anchorPlacement: "top-bottom",
});

// Subtle entrance animation for hero content
document.addEventListener("DOMContentLoaded", function () {
    const heroText = document.querySelector(".hero-text");
    if (heroText) {
        heroText.style.animation = "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    }
});

// Add stagger animation delays to cards (reinforced via JS for reliability)
function addStaggerDelays() {
    document.querySelectorAll(".service-card").forEach((el, i) => {
        el.setAttribute("data-aos-delay", i * 100);
    });
    document.querySelectorAll(".achievement-card").forEach((el, i) => {
        el.setAttribute("data-aos-delay", i * 80);
    });
}
addStaggerDelays();

// Swiper for testimonials
const swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});

// Smooth scrolling for internal navigation
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const headerOffset = 72;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    });
});

// Active link highlight on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const setActiveLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${ sectionId }`
                );
            });
        }
    });
};

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);

// Mobile navigation toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinksContainer = document.querySelector(".nav-links");

if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("open");
        navLinksContainer.classList.toggle("open");
    });

    navLinks.forEach((link) =>
        link.addEventListener("click", () => {
            navToggle.classList.remove("open");
            navLinksContainer.classList.remove("open");
        })
    );
}

// Contact form: send via Formspree (real email) or fallback to mailto
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

if (contactForm && formStatus) {
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const action = contactForm.getAttribute("action");
        const formIdPlaceholder = "YOUR_FORMSPREE_FORM_ID";

        if (action.includes(formIdPlaceholder)) {
            // Fallback: open Gmail with pre-filled body
            const name = (contactForm.querySelector('[name="name"]') || {}).value || "";
            const email = (contactForm.querySelector('[name="email"]') || {}).value || "";
            const subject = (contactForm.querySelector('[name="subject"]') || {}).value || "Portfolio Contact";
            const message = (contactForm.querySelector('[name="message"]') || {}).value || "";
            const body = "Name: " + encodeURIComponent(name) + "%0D%0AEmail: " + encodeURIComponent(email) + "%0D%0A%0D%0A" + encodeURIComponent(message);
            window.open("https://mail.google.com/mail/?view=cm&fs=1&to=marwanyousef637@gmail.com&su=" + encodeURIComponent(subject) + "&body=" + body, "_blank");
            // formStatus.textContent = "تم فتح Gmail. إذا لم يفتح، استبدل YOUR_FORMSPREE_FORM_ID في الكود بمعرّف نموذجك من formspree.io";
            // formStatus.className = "form-status form-status-info";
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
        formStatus.textContent = "";
        formStatus.className = "form-status";

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(action, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" },
            });

            const data = await response.json().catch(() => ({}));
            if (response.ok && (data.ok || response.status === 200)) {
                formStatus.textContent = "تم إرسال رسالتك بنجاح. سأرد عليك قريباً.";
                formStatus.className = "form-status form-status-success";
                contactForm.reset();
            } else {
                formStatus.textContent = "حدث خطأ. جرّب إرسال بريد مباشر إلى marwanyousef637@gmail.com";
                formStatus.className = "form-status form-status-error";
            }
        } catch (err) {
            formStatus.textContent = "حدث خطأ في الاتصال. تأكد من استبدال YOUR_FORMSPREE_FORM_ID بمعرّفك من formspree.io";
            formStatus.className = "form-status form-status-error";
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال الرسالة';
    });
}

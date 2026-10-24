/* =====================================================
   PORTFOLIO INTERACTIONS
===================================================== */

/* MOBILE MENU */
const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("nav-menu");

if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("show");
        const icon = menuBtn.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("show");
            const icon = menuBtn.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });
}

/* TYPING EFFECT */
const typingElement = document.getElementById("typing");
const words = [
    "Data Visualization",
    "Programmer",
    "Web Developer",
    "Problem Solver"
];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
    if (!typingElement) return;
    const currentWord = words[wordIndex];

    if (!deleting) {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex >= currentWord.length) {
            deleting = true;
            setTimeout(typeEffect, 1400);
            return;
        }
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex <= 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }
    setTimeout(typeEffect, deleting ? 55 : 95);
}
if (typingElement) typeEffect();

/* ACTIVE NAVIGATION */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNavigation() {
    let currentSection = "";
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 140) {
            currentSection = section.id;
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentSection}`
        );
    });
}
window.addEventListener("scroll", updateActiveNavigation);
updateActiveNavigation();

/* BACK TO TOP */
const backTop = document.getElementById("back-top");
if (backTop) {
    window.addEventListener("scroll", () => {
        backTop.classList.toggle("show", window.scrollY > 500);
    });
    backTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* CURRENT YEAR */
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

/* SCROLL REVEAL */
const revealElements = document.querySelectorAll(
    ".skill-card, .project-card, .cert-card, .achievement-card, " +
    ".experience-card, .timeline-card"
);
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(element => {
        element.classList.add("reveal");
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => element.classList.add("revealed"));
}

/* DARK / LIGHT MODE — default is always DARK on page load */
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
    const isLight = theme === "light";
    document.body.classList.toggle("light-mode", isLight);
    if (themeToggle) {
        themeToggle.textContent = isLight ? "🌙 Dark Mode" : "☀️ Light Mode";
        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark mode" : "Switch to light mode"
        );
        themeToggle.setAttribute("aria-pressed", String(isLight));
    }
}

/* Start in dark mode every time the page is loaded */
applyTheme("dark");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isLightNow = document.body.classList.contains("light-mode");
        applyTheme(isLightNow ? "dark" : "light");
    });
}


/* REVIEWED ACTIVITY UPDATES
   Drafts stay in this browser. Only exported updates.json is public after deployment. */
(() => {
    const publishedContainer = document.getElementById('published-updates');
    const form = document.getElementById('update-form');
    const draftList = document.getElementById('draft-list');
    if (!publishedContainer || !form || !draftList) return;

    const STORAGE_KEY = 'anujPortfolioUpdateDrafts_v1';
    const readDrafts = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
        catch { return []; }
    };
    const saveDrafts = drafts => localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    const safeText = value => String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const validLink = value => {
        try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
        catch { return ''; }
    };
    const renderPublished = items => {
        if (!items.length) {
            publishedContainer.innerHTML = '<p class="activity-empty">No published updates yet. Add a draft below, review it, then export and deploy updates.json.</p>';
            return;
        }
        publishedContainer.innerHTML = items.slice().reverse().map(item => {
            const link = validLink(item.link || '');
            return `<article class="update-card"><span class="update-type">${safeText(item.type)}</span><h3>${safeText(item.title)}</h3><p>${safeText(item.summary)}</p><div class="update-meta">${item.status ? `<span>${safeText(item.status)}</span>` : ''}${item.date ? `<span>${safeText(item.date)}</span>` : ''}</div>${link ? `<a class="update-link" href="${safeText(link)}" target="_blank" rel="noopener noreferrer">View details <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}</article>`;
        }).join('');
    };
    const renderDrafts = () => {
        const drafts = readDrafts();
        if (!drafts.length) {
            draftList.innerHTML = '<p class="activity-empty">No local drafts yet.</p>';
            return;
        }
        draftList.innerHTML = drafts.map(item => `<article class="draft-card"><div class="draft-copy"><span class="update-type">${safeText(item.type)}</span><h4>${safeText(item.title)}</h4><p>${safeText(item.summary)}</p><small>${item.approved ? 'Approved for export' : 'Needs review'}${item.status ? ' · ' + safeText(item.status) : ''}</small></div><div class="draft-actions">${item.approved ? '<span class="approved-label"><i class="fa-solid fa-check"></i> Approved</span>' : `<button type="button" class="approve-btn" data-approve="${safeText(item.id)}">Approve</button>`}<button type="button" class="remove-btn" data-remove="${safeText(item.id)}">Remove</button></div></article>`).join('');
    };
    const loadPublished = async () => {
        try {
            const response = await fetch('updates.json', { cache: 'no-store' });
            if (!response.ok) throw new Error('No published data file');
            const data = await response.json();
            renderPublished(Array.isArray(data) ? data : []);
        } catch {
            renderPublished([]);
        }
    };

    form.addEventListener('submit', event => {
        event.preventDefault();
        const title = document.getElementById('update-title').value.trim();
        const summary = document.getElementById('update-summary').value.trim();
        const rawLink = document.getElementById('update-link').value.trim();
        if (rawLink && !validLink(rawLink)) {
            document.getElementById('update-feedback').textContent = 'Link must start with http:// or https://.';
            return;
        }
        const drafts = readDrafts();
        drafts.push({
            id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2),
            type: document.getElementById('update-type').value,
            title,
            status: document.getElementById('update-status').value.trim(),
            link: rawLink,
            summary,
            date: new Date().toISOString().slice(0, 10),
            approved: false
        });
        saveDrafts(drafts);
        form.reset();
        document.getElementById('update-feedback').textContent = 'Saved as a local draft. Review it below before exporting.';
        renderDrafts();
    });

    draftList.addEventListener('click', event => {
        const approveId = event.target.closest('[data-approve]')?.dataset.approve;
        const removeId = event.target.closest('[data-remove]')?.dataset.remove;
        let drafts = readDrafts();
        if (approveId) drafts = drafts.map(item => item.id === approveId ? {...item, approved: true} : item);
        if (removeId) drafts = drafts.filter(item => item.id !== removeId);
        saveDrafts(drafts);
        renderDrafts();
    });

    document.getElementById('clear-drafts')?.addEventListener('click', () => {
        if (confirm('Delete all drafts saved in this browser? This cannot be undone.')) {
            localStorage.removeItem(STORAGE_KEY);
            renderDrafts();
            document.getElementById('update-feedback').textContent = 'Local drafts cleared.';
        }
    });

    document.getElementById('export-updates')?.addEventListener('click', () => {
        const approved = readDrafts().filter(item => item.approved).map(({type, title, status, link, summary, date}) => ({type, title, status, link, summary, date}));
        const blob = new Blob([JSON.stringify(approved, null, 2) + '\n'], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'updates.json';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
        document.getElementById('update-feedback').textContent = `Exported ${approved.length} approved item(s). Replace the project's updates.json, then commit and deploy.`;
    });

    renderDrafts();
    loadPublished();
})();

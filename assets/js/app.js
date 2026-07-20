/**
 * app.js - Global Layout, Navigation & Utilities for Yemen Engineer Platform
 */

// --- Message Security Filter ---
const BLOCKED_PATTERNS = [
    /\b(0?7[1-9][0-9]{7})\b/g,         // Yemeni phone numbers
    /\b[\w.-]+@[\w.-]+\.\w{2,}\b/g,     // Emails
    /wa\.me\/\S+/gi,                     // WhatsApp links
    /https?:\/\/\S+/gi,                  // Any URL
    /واتس(اب)?|تيلجرام|تلغرام|viber/gi  // Messaging app names
];

function sanitizeMessage(text) {
    let sanitized = text;
    BLOCKED_PATTERNS.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '[محتوى محظور من المنصة]');
    });
    return sanitized;
}

function hasSensitiveContent(text) {
    return BLOCKED_PATTERNS.some(p => new RegExp(p.source, p.flags).test(text));
}

// --- Toast Notifications ---
function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
        document.body.appendChild(container);
    }
    const colors = { success:'#198754', error:'#dc3545', info:'#0f4c5c', warning:'#d97706' };
    const toast = document.createElement('div');
    toast.style.cssText = `background:${colors[type]||colors.info};color:#fff;padding:12px 24px;border-radius:8px;font-size:0.92rem;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,.2);pointer-events:all;direction:rtl;text-align:right;animation:slideDown .3s ease;min-width:250px;`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .4s'; setTimeout(() => toast.remove(), 400); }, duration);
}

// --- Dynamic Header Injection ---
async function injectGlobalLayouts() {
    const currentUser = getCurrentUser();
    const isInAdmin = window.location.pathname.includes('/admin/');
    const basePath = isInAdmin ? '../' : '';

    let unreadNotifs = 0;
    if (currentUser) {
        const notifs = await getData(STORAGE_KEYS.NOTIFICATIONS);
        unreadNotifs = notifs.filter(n => n.userId === currentUser.id && !n.read).length;
    }

    const notifBadge = unreadNotifs > 0 ? `<span class="notif-badge">${unreadNotifs}</span>` : '';

    const userMenuHtml = currentUser ? `
        <div class="user-menu">
            <a href="${basePath}notifications.html" class="nav-icon-btn" title="الإشعارات">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="${unreadNotifs > 0 ? 'bell-ringing' : ''}">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                ${notifBadge}
            </a>
            <div class="user-dropdown">
                <button class="user-avatar-btn">
                    <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50'}" class="user-avatar-sm" alt="${currentUser.fullName}">
                    <span class="user-name-sm">${currentUser.fullName.split(' ')[0]}</span>
                    <i class="icon-chevron"></i>
                </button>
                <div class="dropdown-menu" id="user-dropdown-menu">
                    <a href="${basePath}dashboard.html" class="dropdown-item">لوحة التحكم</a>
                    <a href="${basePath}profile.html" class="dropdown-item">إعدادات الحساب</a>
                    ${currentUser.type === 'admin' ? `<a href="${basePath}admin/index.html" class="dropdown-item">لوحة الإدارة</a>` : ''}
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item danger-item" onclick="logout(); return false;">تسجيل خروج</a>
                </div>
            </div>
        </div>
    ` : `
        <div class="auth-buttons">
            <a href="${basePath}login.html" class="btn btn-primary btn-sm">تسجيل دخول / إنشاء حساب</a>
        </div>
    `;

    const navLinks = [
        { href: `${basePath}index.html`, text: 'الرئيسية' },
        { href: `${basePath}engineers.html`, text: 'المهندسون' },
        { href: `${basePath}offices.html`, text: 'المكاتب والورش' },
        { href: `${basePath}services.html`, text: 'الخدمات' },
        { href: `${basePath}stores.html`, text: 'المتاجر' },
        { href: `${basePath}requests.html`, text: 'مشاريع ومناقصات' }
    ];

    const navHtml = navLinks.map(l => `<a href="${l.href}" class="nav-link">${l.text}</a>`).join('');

    const headerEl = document.getElementById('site-header');
    if (headerEl) {
        headerEl.innerHTML = `
        <div class="header-inner container">
            <a href="${basePath}index.html" class="site-logo">
                <span class="logo-icon">YE</span>
                <div class="logo-text"><span class="logo-title">Yemen Engineer</span><span class="logo-sub">منصة الخدمات الهندسية</span></div>
            </a>
            <nav class="main-nav" id="main-nav">${navHtml}</nav>
            <div class="header-actions">
                ${userMenuHtml}
                <button class="hamburger-btn" id="hamburger-btn" onclick="toggleMobileMenu()">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
        `;
        // Dropdown toggle
        const dropdownBtn = headerEl.querySelector('.user-avatar-btn');
        if (dropdownBtn) {
            dropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('user-dropdown-menu').classList.toggle('open');
            });
            document.addEventListener('click', () => {
                const m = document.getElementById('user-dropdown-menu');
                if (m) m.classList.remove('open');
            });
        }
    }

    const footerEl = document.getElementById('site-footer');
    if (footerEl) {
        footerEl.innerHTML = `
        <div class="footer-inner container">
            <div class="footer-brand">
                <span class="logo-icon">YE</span>
                <div>
                    <div class="logo-title" style="color:#fff;font-size:1.1rem;">Yemen Engineer</div>
                    <div style="font-size:.8rem;color:#adb5bd;">منصة الخدمات الهندسية في اليمن</div>
                </div>
            </div>
            <div class="footer-links">
                <a href="${basePath}engineers.html">المهندسون</a>
                <a href="${basePath}services.html">الخدمات</a>
                <a href="${basePath}stores.html">المتاجر</a>
                <a href="${basePath}requests.html">مشاريع ومناقصات</a>
            </div>
            <div class="footer-copy">جميع الحقوق محفوظة &copy; 2025 Yemen Engineer. نسخة تجريبية.</div>
        </div>
        `;
    }
}

function toggleMobileMenu() {
    const nav = document.getElementById('main-nav');
    if (nav) nav.classList.toggle('open');
}

// --- Format Helpers ---
function formatDate(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'منذ لحظات';
    if (diff < 3600) return `منذ ${Math.floor(diff/60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff/3600)} ساعة`;
    if (diff < 604800) return `منذ ${Math.floor(diff/86400)} يوم`;
    return d.toLocaleDateString('ar-YE', { year:'numeric', month:'short', day:'numeric' });
}

function formatNumber(n) {
    return Number(n).toLocaleString('ar-EG');
}

function getStatusLabel(status) {
    const map = {
        'NEW': { text: 'مفتوح للعروض', cls: 'badge-success' },
        'IN_PROGRESS': { text: 'جارٍ التنفيذ', cls: 'badge-primary' },
        'COMPLETED': { text: 'مكتمل', cls: 'badge-secondary' },
        'CANCELLED': { text: 'ملغي', cls: 'badge-danger' },
        'approved': { text: 'معتمد', cls: 'badge-verified' },
        'pending': { text: 'قيد المراجعة', cls: 'badge-pending' },
        'rejected': { text: 'مرفوض', cls: 'badge-danger' },
        'accepted': { text: 'مقبول', cls: 'badge-success' },
        'submitted': { text: 'مقدم', cls: 'badge-primary' }
    };
    return map[status] || { text: status, cls: 'badge-secondary' };
}

async function renderAllAds() {
    const placeholders = document.querySelectorAll('.ad-placeholder');
    if (!placeholders.length) return;

    const allAds = await getData(STORAGE_KEYS.ADS);
    placeholders.forEach(el => {
        const type = el.getAttribute('data-ad-type') || 'banner';
        const ads = allAds.filter(a => a.status === 'active' && a.type === type);
        if (!ads.length) {
            el.style.display = 'none';
            return;
        }
        const ad = ads[Math.floor(Math.random() * ads.length)];
        trackAdImpression(ad.id);
        
        if (type === 'banner') {
            el.innerHTML = `
                <div class="ad-banner-container animate-item" style="margin:24px 0; border:1px solid var(--border-color); background:#fffbeb; border-radius:var(--border-radius); padding:16px; display:flex; gap:16px; align-items:center; position:relative; overflow:hidden; box-shadow:var(--shadow-sm);">
                    <span style="position:absolute; top:0; left:0; font-size:.65rem; background:rgba(0,0,0,0.06); color:var(--text-muted); padding:3px 8px; border-radius:0 0 0 var(--border-radius-sm); font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">إعلان ممول</span>
                    <img src="${ad.image}" style="width:110px; height:75px; object-fit:cover; border-radius:var(--border-radius-sm); border:1px solid var(--border-color); flex-shrink:0;">
                    <div style="flex:1; padding-left:10px;">
                        <h4 style="margin:0 0 4px 0; font-size:.95rem; font-weight:800; color:var(--primary-color);">${ad.title}</h4>
                        <p style="margin:0; font-size:.82rem; color:var(--text-muted); line-height:1.5;">${ad.description}</p>
                    </div>
                    <a href="${ad.link}" onclick="trackAdClick('${ad.id}')" class="btn btn-primary btn-sm" style="flex-shrink:0; white-space:nowrap; padding:8px 16px;">التفاصيل</a>
                </div>`;
        } else if (type === 'sidebar') {
            el.innerHTML = `
                <div class="ad-sidebar-container animate-item" style="border:1px solid var(--border-color); background:#fffbeb; border-radius:var(--border-radius); padding:20px; margin-bottom:24px; position:relative; overflow:hidden; text-align:center; box-shadow:var(--shadow-sm);">
                    <span style="position:absolute; top:0; left:0; font-size:.65rem; background:rgba(0,0,0,0.06); color:var(--text-muted); padding:3px 8px; border-radius:0 0 0 var(--border-radius-sm); font-weight:800; text-transform:uppercase;">إعلان ممول</span>
                    <img src="${ad.image}" style="width:100%; height:130px; object-fit:cover; border-radius:var(--border-radius-sm); margin:10px 0; border:1px solid var(--border-color);">
                    <h4 style="margin:8px 0; font-size:.95rem; font-weight:800; color:var(--primary-color);">${ad.title}</h4>
                    <p style="margin:0 0 16px 0; font-size:.82rem; color:var(--text-muted); line-height:1.5;">${ad.description}</p>
                    <a href="${ad.link}" onclick="trackAdClick('${ad.id}')" class="btn btn-primary btn-sm" style="display:block; width:100%; text-align:center; padding:8px 0;">استكشفه الآن</a>
                </div>`;
        }
    });
}

async function initAdSliders() {
    const placeholders = document.querySelectorAll('.ad-slider-placeholder');
    if (!placeholders.length) return;

    const allAds = await getData(STORAGE_KEYS.ADS);
    placeholders.forEach(el => {
        const type = el.getAttribute('data-ad-type') || 'banner';
        const ads = allAds.filter(a => a.status === 'active' && a.type === type);
        
        if (!ads.length) {
            el.style.display = 'none';
            return;
        }
        
        if (ads.length === 1) {
            const ad = ads[0];
            trackAdImpression(ad.id);
            el.innerHTML = `
                <div class="ad-slider-container animate-item">
                    <div class="ad-slide-item">
                        <span class="ad-slide-badge">إعلان ممول</span>
                        <img src="${ad.image}">
                        <div class="ad-slide-content">
                            <h4 class="ad-slide-title">${ad.title}</h4>
                            <p class="ad-slide-desc">${ad.description}</p>
                        </div>
                        <a href="${ad.link}" onclick="trackAdClick('${ad.id}')" class="btn btn-primary btn-sm" style="flex-shrink:0;">التفاصيل</a>
                    </div>
                </div>`;
            return;
        }

        let slidesHtml = '';
        let dotsHtml = '';
        
        ads.forEach((ad, i) => {
            trackAdImpression(ad.id);
            slidesHtml += `
                <div class="ad-slide-item">
                    <span class="ad-slide-badge">إعلان ممول</span>
                    <img src="${ad.image}">
                    <div class="ad-slide-content">
                        <h4 class="ad-slide-title">${ad.title}</h4>
                        <p class="ad-slide-desc">${ad.description}</p>
                    </div>
                    <a href="${ad.link}" onclick="trackAdClick('${ad.id}')" class="btn btn-primary btn-sm" style="flex-shrink:0; margin-left: 10px;">التفاصيل</a>
                </div>`;
            dotsHtml += `<span class="ad-slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`;
        });

        // Set direction style of slides-wrapper dynamically so translation coordinates map correctly
        el.innerHTML = `
            <div class="ad-slider-container animate-item">
                <div class="ad-slides-wrapper" style="transform: translateX(0px);">${slidesHtml}</div>
                <div class="ad-slider-dots">${dotsHtml}</div>
            </div>`;

        const wrapper = el.querySelector('.ad-slides-wrapper');
        const dots = el.querySelectorAll('.ad-slider-dot');
        let currentIndex = 0;
        const totalSlides = ads.length;
        
        function showSlide(index) {
            currentIndex = index;
            // Shift slides wrapper. Because page has dir="rtl", moving to left translates to translateX positive percents (offset in RTL)
            const offset = currentIndex * 100;
            wrapper.style.transform = `translateX(${offset}%)`;
            
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }

        let timer = setInterval(() => {
            let nextIndex = (currentIndex + 1) % totalSlides;
            showSlide(nextIndex);
        }, 4000);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(timer);
                showSlide(index);
                timer = setInterval(() => {
                    let nextIndex = (currentIndex + 1) % totalSlides;
                    showSlide(nextIndex);
                }, 4000);
            });
        });
    });
}

// Auto-inject on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    await injectGlobalLayouts();
    await renderAllAds();
    await initAdSliders();
    
    // Inject Vercel Web Analytics (exclude localhost)
    if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
        window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
        const script = document.createElement('script');
        script.src = '/_vercel/insights/script.js';
        script.defer = true;
        document.head.appendChild(script);
    }

    // Animate items
    document.querySelectorAll('.animate-item').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`;
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 50);
    });
});

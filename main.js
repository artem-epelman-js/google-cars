document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.primary-nav') || document.querySelector('.main-nav');

    // Mobile Menu Logic
    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            primaryNav.classList.toggle('active');
            navToggle.classList.toggle('is-active');
        });
    }

    // Ad zones (static placeholder version)
    // We keep a consistent zone structure across pages without hardcoding it in every article file.
    const createAdUnit = (zone, extraClass) => {
        const wrap = document.createElement('div');
        wrap.className = `ad-unit ad-zone ${extraClass || ''}`.trim();
        wrap.dataset.adZone = zone;

        const placeholder = document.createElement('div');
        placeholder.className = 'ad-placeholder';
        placeholder.textContent = 'Advertisement';
        wrap.appendChild(placeholder);

        return wrap;
    };

    const ensureArticleAdZones = () => {
        const article = document.querySelector('article.single-post');
        if (!article) return;

        const postHeader = article.querySelector('.post-header');
        const entry = article.querySelector('.entry-content');
        if (!postHeader || !entry) return;

        const hasZone = (z) => article.querySelector(`[data-ad-zone="${z}"]`);

        // after_title: immediately after the post header (H1 area)
        if (!hasZone('after_title')) {
            postHeader.insertAdjacentElement('afterend', createAdUnit('after_title', 'ad-after-title'));
        }

        // after_paragraph_1: after first paragraph in entry content
        const paragraphs = Array.from(entry.querySelectorAll('p'));
        if (paragraphs.length && !hasZone('after_paragraph_1')) {
            paragraphs[0].insertAdjacentElement('afterend', createAdUnit('after_paragraph_1', 'ad-after-paragraph-1'));
        }

        // middle_content: after midpoint paragraph (keep it away from first two paras)
        if (paragraphs.length >= 6 && !hasZone('middle_content')) {
            const midIdx = Math.max(2, Math.floor(paragraphs.length / 2));
            paragraphs[midIdx].insertAdjacentElement('afterend', createAdUnit('middle_content', 'ad-middle'));
        }

        // end_content: near the end, but still inside the article
        if (paragraphs.length >= 4 && !hasZone('end_content')) {
            const endIdx = Math.max(2, paragraphs.length - 2);
            paragraphs[endIdx].insertAdjacentElement('afterend', createAdUnit('end_content', 'ad-end'));
        }

        // before_related: before sidebar/related zone if present, otherwise end of article
        if (!hasZone('before_related')) {
            const sidebar = document.querySelector('aside.sidebar');
            if (sidebar) {
                sidebar.insertAdjacentElement('beforebegin', createAdUnit('before_related', 'ad-before-related'));
            } else {
                article.appendChild(createAdUnit('before_related', 'ad-before-related'));
            }
        }

        // Sidebar top/bottom: only if sidebar exists
        const sidebar = document.querySelector('aside.sidebar');
        if (sidebar) {
            if (!sidebar.querySelector('[data-ad-zone="sidebar_top"]')) {
                sidebar.insertAdjacentElement('afterbegin', createAdUnit('sidebar_top', 'ad-sidebar-top'));
            }
            if (!sidebar.querySelector('[data-ad-zone="sidebar_bottom"]')) {
                sidebar.insertAdjacentElement('beforeend', createAdUnit('sidebar_bottom', 'ad-sidebar-bottom'));
            }
        }
    };

    const loadAds = () => {
        const adUnits = document.querySelectorAll('.ad-placeholder');
        adUnits.forEach(unit => {
            unit.innerHTML = '<!-- Insert Ins Tag Here --> <span style="font-size:12px">Advertisement</span>';
        });
    };

    ensureArticleAdZones();
    setTimeout(loadAds, 2000); // Simple delay to prioritize content
});
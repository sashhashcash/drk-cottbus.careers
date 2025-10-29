
class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
<style>
                nav {
                    background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 10;
                }
                .logo-container {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .logo-img {
                    height: 50px;
                    width: auto;
                }
                .logo-text {
                    color: white;
                    font-weight: 700;
                    font-size: 1.25rem;
                    display: flex;
                    flex-direction: column;
                }
                .logo-subtext {
                    font-size: 0.75rem;
                    font-weight: 400;
                    opacity: 0.8;
                }
                .nav-buttons {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .apply-btn {
                    background-color: white;
                    color: #dc2626;
                    padding: 0.5rem 1.5rem;
                    border-radius: 9999px;
                    font-weight: 600;
                    transition: all 0.2s;
                    text-decoration: none;
                    display: inline-block;
                }
                .apply-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .language-selector {
                    position: relative;
                    padding: 0.5rem;
                    margin: -0.5rem;
                }
                .language-btn {
                    background-color: rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 9999px;
                    font-weight: 600;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border: none;
                    cursor: pointer;
                }
                .language-btn:hover {
                    background-color: rgba(255, 255, 255, 0.3);
                }
                .language-dropdown {
                    position: absolute;
                    top: calc(100% + 0.75rem);
                    right: 0;
                    background: white;
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    display: none;
                    min-width: 140px;
                    z-index: 100;
                    padding: 0.5rem 0;
                }
                .language-selector:hover .language-dropdown,
                .language-dropdown:hover,
                .language-dropdown.show {
                    display: block;
                }
.language-dropdown a {
                    display: block;
                    padding: 0.5rem 1rem;
                    color: #333;
                    text-decoration: none;
                    transition: background 0.2s;
                }
                .language-dropdown a:hover {
                    background: #f5f5f5;
                }
                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                }
                @media (max-width: 768px) {
                    .nav-buttons {
                        display: none;
                    }
                    .mobile-menu-btn {
                        display: block;
                    }
                }
            </style>
            <nav>
                <div class="logo-container">
                    <img src="/images/drk-logo-new.png" alt="DRK Logo" class="logo-img">
                    <div class="logo-text">
                        <span>DRK Cottbus</span>
                        <span class="logo-subtext">Stellenangebote</span>
                    </div>
                </div>
                <div class="nav-buttons">
                    <a href="#pflegefachkraefte" class="apply-btn">Jetzt bewerben</a>
        <div class="language-selector">
            <button class="language-btn">
                <i data-feather="globe"></i>
                <span class="current-lang">DE</span>
            </button>
            <div class="language-dropdown">
                <a href="index.html" data-lang="de">Deutsch</a>
                <a href="index-en.html" data-lang="en">English</a>
                <a href="index-pl.html" data-lang="pl">Polski</a>
                <a href="index-cs.html" data-lang="cs">Čeština</a>
                <a href="index-pt.html" data-lang="pt">Português</a>
                <a href="index-es.html" data-lang="es">Español</a>
                <a href="index-it.html" data-lang="it">Italiano</a>
                <a href="index-ru.html" data-lang="ru">Русский</a>
                <a href="index-uk.html" data-lang="uk">Українська</a>
            </div>
</div>
                </div>
                <button class="mobile-menu-btn">
                    <i data-feather="menu"></i>
                </button>
            </nav>
        `;
        // Language selector functionality
        const languageBtn = this.shadowRoot.querySelector('.language-btn');
        const languageDropdown = this.shadowRoot.querySelector('.language-dropdown');
        const languageLinks = this.shadowRoot.querySelectorAll('.language-dropdown a');
        const currentLangSpan = this.shadowRoot.querySelector('.current-lang');
        // Set initial language based on current page
        const langMap = {
            'de': 'DE',
            'en': 'EN',
            'pl': 'PL',
            'cs': 'CS',
            'pt': 'PT',
            'es': 'ES',
            'it': 'IT',
            'ru': 'RU',
            'uk': 'UK'
        };
        
        // Detect current language from URL
        let currentLang = 'de';
        const path = window.location.pathname;
        if (path.includes('index-en')) currentLang = 'en';
        else if (path.includes('index-pl')) currentLang = 'pl';
        else if (path.includes('index-cs')) currentLang = 'cs';
        else if (path.includes('index-pt')) currentLang = 'pt';
        else if (path.includes('index-es')) currentLang = 'es';
        else if (path.includes('index-it')) currentLang = 'it';
        else if (path.includes('index-ru')) currentLang = 'ru';
        else if (path.includes('index-uk')) currentLang = 'uk';
        
        currentLangSpan.textContent = langMap[currentLang] || 'DE';
// Toggle dropdown on button click
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
        
        // Handle language selection
        languageLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const lang = this.getAttribute('data-lang');
                currentLangSpan.textContent = langMap[lang] || 'DE';
                languageDropdown.classList.remove('show');
                
                // Store selected language in localStorage
                localStorage.setItem('preferredLanguage', lang);
                
                // Navigate to selected language page
                window.location.href = this.getAttribute('href');
});
        });
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            const isClickInside = languageBtn.contains(e.target) || 
                                languageDropdown.contains(e.target);
            if (!isClickInside) {
                languageDropdown.classList.remove('show');
            }
});
    }
}
customElements.define('custom-navbar', CustomNavbar);

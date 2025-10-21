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
                .language-selector:hover .language-dropdown {
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
                    <img src="https://www.drk.de/fileadmin/_processed_/3/1/csm_drk-logo_web_2c8c9b1a75.png" alt="DRK Logo" class="logo-img">
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
                            DE
                        </button>
                        <div class="language-dropdown">
                            <a href="#" data-lang="en">English</a>
                            <a href="#" data-lang="pl">Polski</a>
                            <a href="#" data-lang="cs">Čeština</a>
                            <a href="#" data-lang="ru">Русский</a>
                            <a href="#" data-lang="uk">Українська</a>
                            <a href="#" data-lang="it">Italiano</a>
                            <a href="#" data-lang="es">Español</a>
                            <a href="#" data-lang="pt">Português</a>
                        </div>
                    </div>
                </div>
<button class="mobile-menu-btn">
                    <i data-feather="menu"></i>
                </button>
            </nav>
`;
    }
}
customElements.define('custom-navbar', CustomNavbar);
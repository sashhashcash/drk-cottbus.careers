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
                .nav-links {
                    display: flex;
                    gap: 2rem;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                .nav-link {
                    color: white;
                    text-decoration: none;
                    font-weight: 500;
                    padding: 0.5rem 0;
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .nav-link:hover::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: white;
                }
                .apply-btn {
                    background-color: white;
                    color: #dc2626;
                    padding: 0.5rem 1.5rem;
                    border-radius: 9999px;
                    font-weight: 600;
                    transition: all 0.2s;
                    margin-left: 2rem;
                }
                .apply-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                }
                @media (max-width: 768px) {
                    .nav-links, .apply-btn {
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
                <ul class="nav-links">
                    <li><a href="/" class="nav-link"><i data-feather="home"></i>Startseite</a></li>
                    <li><a href="#pflegefachkraefte" class="nav-link"><i data-feather="heart"></i>Stellen</a></li>
                    <li><a href="#" class="nav-link"><i data-feather="info"></i>Über uns</a></li>
                    <li><a href="#" class="nav-link"><i data-feather="mail"></i>Kontakt</a></li>
                </ul>
                <a href="#pflegefachkraefte" class="apply-btn">Jetzt bewerben</a>
                <button class="mobile-menu-btn">
                    <i data-feather="menu"></i>
                </button>
            </nav>
        `;
    }
}
customElements.define('custom-navbar', CustomNavbar);
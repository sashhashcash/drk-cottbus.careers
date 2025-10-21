class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    background: #1a202c;
                    color: white;
                    padding: 3rem 2rem;
                    margin-top: auto;
                }
                .footer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                }
                .footer-logo {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .footer-logo img {
                    width: 120px;
                    height: auto;
                }
                .footer-links h3 {
                    font-weight: 600;
                    margin-bottom: 1rem;
                    font-size: 1.125rem;
                }
                .footer-links ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .footer-links li {
                    margin-bottom: 0.75rem;
                }
                .footer-links a {
                    color: #a0aec0;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer-links a:hover {
                    color: white;
                }
                .social-links {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .social-links a {
                    color: white;
                    background: rgba(255, 255, 255, 0.1);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }
                .social-links a:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                .copyright {
                    text-align: center;
                    padding-top: 2rem;
                    margin-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    color: #a0aec0;
                    font-size: 0.875rem;
                }
                @media (max-width: 768px) {
                    .footer-container {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
            <footer>
                <div class="footer-container">
                    <div class="footer-logo">
                        <img src="https://www.drk.de/fileadmin/_processed_/3/1/csm_drk-logo_web_2c8c9b1a75.png" alt="DRK Logo">
                        <p>Das Deutsche Rote Kreuz rettet Menschen, hilft in Notlagen und bietet eine Gemeinschaft.</p>
                        <div class="social-links">
                            <a href="#"><i data-feather="facebook"></i></a>
                            <a href="#"><i data-feather="instagram"></i></a>
                            <a href="#"><i data-feather="twitter"></i></a>
                            <a href="#"><i data-feather="youtube"></i></a>
                        </div>
                    </div>
                    <div class="footer-links">
                        <h3>Stellenangebote</h3>
                        <ul>
                            <li><a href="#pflegefachkraefte">Pflegefachkräfte</a></li>
                            <li><a href="#altenpfleger">Altenpfleger</a></li>
                            <li><a href="#altenpfleger">Altenpfleger</a></li>
                            <li><a href="#krankenpfleger">Krankenpfleger</a></li>
                            <li><a href="#betreuungskraft">Betreuungskräfte</a></li>
                        </ul>
</div>
                    <div class="footer-links">
                        <h3>Über uns</h3>
                        <ul>
                            <li><a href="#">Das DRK Cottbus</a></li>
                            <li><a href="#">Karriere</a></li>
                            <li><a href="#">Aktuelles</a></li>
                            <li><a href="#">Spenden</a></li>
                        </ul>
                    </div>
                    <div class="footer-links">
                        <h3>Kontakt</h3>
                        <ul>
                            <li><a href="#"><i data-feather="map-pin" class="mr-2 w-4 h-4"></i>DRK-Kreisverband Cottbus e.V.</a></li>
                            <li><a href="#"><i data-feather="mail" class="mr-2 w-4 h-4"></i>info@drk-cottbus.de</a></li>
                            <li><a href="#"><i data-feather="phone" class="mr-2 w-4 h-4"></i>0355 123456</a></li>
                            <li><a href="#"><i data-feather="clock" class="mr-2 w-4 h-4"></i>Mo-Fr: 8-16 Uhr</a></li>
                        </ul>
                    </div>
                </div>
                <div class="copyright">
                    <p>&copy; 2024 DRK-Kreisverband Cottbus e.V. | Alle Rechte vorbehalten | <a href="#" class="text-red-400">Impressum</a> | <a href="#" class="text-red-400">Datenschutz</a></p>
                </div>
            </footer>
        `;
    }
}
customElements.define('custom-footer', CustomFooter);
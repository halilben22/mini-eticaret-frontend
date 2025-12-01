import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// 1. IMPORTLAR
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faGoogle, faInstagram, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons'; // Markalar
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'; // Arayüz ikonları

export default function Footer() {
    return (
        <footer style={{ backgroundColor: "#232f3e", color: "#ddd", marginTop: "auto" }}>
            <Container className="py-5">
                <Row>

                    {/* 1. Kısım: Hakkımızda */}
                    <Col md={4} className="mb-4">
                        <h5 className="fw-bold text-white mb-3">🛒 MiniShop</h5>
                        <p className="small text-secondary">
                            En yeni teknolojik ürünlerden giyime, ev yaşamından kitaba kadar aradığınız her şey burada.
                            Güvenli ödeme ve hızlı kargo ile alışverişin keyfini çıkarın.
                        </p>
                    </Col>

                    {/* 2. Kısım: Hızlı Linkler */}
                    <Col md={4} className="mb-4">
                        <h5 className="fw-bold text-warning mb-3">Hızlı Erişim</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="text-decoration-none text-secondary hover-link">Ana Sayfa</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/cart" className="text-decoration-none text-secondary hover-link">Sepetim</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/orders" className="text-decoration-none text-secondary hover-link">Siparişlerim</Link>
                            </li>
                        </ul>
                    </Col>

                    {/* 3. Kısım: İletişim */}
                    <Col md={4}>
                        <h5 className="fw-bold text-warning mb-3">Bize Ulaşın</h5>
                        <ul className="list-unstyled">

                            {/* WHATSAPP */}
                            <li className="mb-3">
                                <a
                                    href="https://wa.me/905551234567"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-decoration-none text-white d-flex align-items-center gap-3"
                                >
                                    {/* İkon */}
                                    <FontAwesomeIcon icon={faWhatsapp} className="fs-3 text-success" />
                                    <div>
                                        <div className="small text-secondary">WhatsApp Destek</div>
                                        <span className="fw-bold">+90 555 123 45 67</span>
                                    </div>
                                </a>
                            </li>

                            {/* EMAIL */}
                            <li className="mb-3">
                                <a
                                    href="mailto:destek@minishop.com"
                                    className="text-decoration-none text-white d-flex align-items-center gap-3"
                                >
                                    <FontAwesomeIcon icon={faGoogle} className="fs-3 text-danger" />
                                    <div>
                                        <div className="small text-secondary">E-Posta</div>
                                        <span className="fw-bold">destek@minishop.com</span>
                                    </div>
                                </a>
                            </li>

                            <li className="small text-secondary mt-4 d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-warning" />
                                Teknoloji Vadisi, Yazılım Cad. No:1, İstanbul
                            </li>
                        </ul>
                    </Col>
                </Row>

                <hr className="border-secondary my-4" />

                <Row className="align-items-center">
                    <Col md={6} className="text-center text-md-start small text-secondary">
                        &copy; {new Date().getFullYear()} MiniShop E-Ticaret A.Ş. Tüm hakları saklıdır.
                    </Col>

                    {/* Sosyal Medya İkonları */}
                    <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
                        <a href="#" className="text-white me-3 fs-5"><FontAwesomeIcon icon={faInstagram} className="hover-text-white" /></a>
                        <a href="#" className="text-white me-3 fs-5"><FontAwesomeIcon icon={faTwitter} className="hover-text-white" /></a>
                        <a href="#" className="text-white fs-5"><FontAwesomeIcon icon={faLinkedin} className="hover-text-white" /></a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
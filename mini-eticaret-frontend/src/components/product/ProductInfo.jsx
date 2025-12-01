import { useState } from 'react';
import { Row, Col, Badge, Image, Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
// YENİ PROP: currentCartQty
export default function ProductInfo({ product, averageRating, totalReviews, onAddToCart, currentCartQty }) {

    const [quantity, setQuantity] = useState(1);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < rating ? "#ffc107" : "#e4e5e9", fontSize: "1.2rem" }}>★</span>
        ));
    };

    const increaseQty = () => {
        if (quantity < product.stock_quantity) setQuantity(prev => prev + 1);
    };

    const decreaseQty = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    return (
        console.log("item sayısı: " + currentCartQty),
        <Card className="shadow-sm border-0 mb-5 overflow-hidden">
            <Card.Body className="p-4">
                <Row>
                    {/* SOL: Resim */}
                    <Col md={6} className="d-flex align-items-center justify-content-center bg-light rounded-3 p-3 position-relative">
                        <Image
                            src={product.image_url ? `http://localhost:8080${product.image_url}` : "https://via.placeholder.com/500"}
                            alt={product.name}
                            fluid
                            style={{ maxHeight: "400px", objectFit: "contain" }}
                        />
                        {/* Resim Üzerinde Sepet Rozeti (Opsiyonel) */}
                        {currentCartQty > 0 && (
                            <Badge bg="primary" className="position-absolute top-0 start-0 m-3 p-2 shadow">
                                <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
                                Sepette: {currentCartQty}
                            </Badge>
                        )}
                    </Col>

                    {/* SAĞ: Bilgiler */}
                    <Col md={6} className="mt-4 mt-md-0 d-flex flex-column justify-content-center">

                        {/* Stok Rozeti */}
                        <div className="mb-2">
                            {product.stock_quantity > 0 ? (
                                <Badge bg="success" className="px-3 py-2">Stokta Var ({product.stock_quantity})</Badge>
                            ) : (
                                <Badge bg="danger" className="px-3 py-2">Tükendi</Badge>
                            )}
                        </div>

                        <h1 className="fw-bold text-dark mb-3">{product.name}</h1>

                        <div className="d-flex align-items-center gap-2 mb-4">
                            <div className="d-flex">{renderStars(Math.round(averageRating))}</div>
                            <span className="text-muted small">({totalReviews} Değerlendirme)</span>
                        </div>

                        <h2 className="text-primary display-6 fw-bold mb-3">
                            {product.price} <span className="fs-4 text-dark">₺</span>
                        </h2>

                        {/* --- YENİ EKLENEN KISIM: SEPET BİLGİSİ UYARISI --- */}
                        {currentCartQty > 0 && (
                            <Alert variant="info" className="d-flex align-items-center py-2 mb-4">
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2 fs-5" />
                                <div>
                                    <strong>Sepetinizde bu üründen {currentCartQty} adet var.</strong>
                                    <br />
                                    <small>Daha fazla ekleyerek siparişinizi büyütebilirsiniz.</small>
                                </div>
                            </Alert>
                        )}
                        {/* ------------------------------------------------ */}

                        <p className="text-secondary lead fs-6">{product.description}</p>

                        <div className="d-flex align-items-center gap-3 mt-3">
                            <InputGroup style={{ width: "130px" }}>
                                <Button variant="outline-secondary" onClick={decreaseQty}>-</Button>
                                <Form.Control className="text-center fw-bold bg-white" value={quantity} readOnly />
                                <Button variant="outline-secondary" onClick={increaseQty}>+</Button>
                            </InputGroup>

                            <Button
                                variant="primary"
                                size="lg"
                                className="flex-grow-1 fw-bold shadow-sm"
                                onClick={() => onAddToCart(quantity)}
                                disabled={product.stock_quantity === 0}
                            >
                                Sepete Ekle
                            </Button>
                        </div>

                        <div className="mt-4 p-3 bg-light rounded border border-light">
                            <small className="text-muted">
                                🚚 <strong>Hızlı Kargo:</strong> Saat 15:00'a kadar verilen siparişler aynı gün kargoda.
                            </small>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}
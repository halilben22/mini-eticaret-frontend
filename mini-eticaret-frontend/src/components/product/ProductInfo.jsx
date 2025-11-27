
import renderStars from "../../helper/StarRatingHelper";
import { Row, Col, Badge, Image, Card } from 'react-bootstrap';
export default function ProductInfo({ product, averageRating, totalReviews }) {
    return (
        <Card className="shadow-sm border-0 mb-5 overflow-hidden">
            <Card.Body className="p-4">
                <Row>
                    {/* SOL TARA: Ürün Resmi */}
                    <Col md={6} className="d-flex align-items-center justify-content-center bg-light rounded-3 p-3">
                        <Image
                            src={product.image_url ? `http://localhost:8080${product.image_url}` : "https://via.placeholder.com/500"}
                            alt={product.name}
                            fluid // Resmi kapsayıcıya sığdırır (Responsive)
                            style={{ maxHeight: "400px", objectFit: "contain" }}
                        />
                    </Col>

                    {/* SAĞ TARAF: Bilgiler */}
                    <Col md={6} className="mt-4 mt-md-0 d-flex flex-column justify-content-center">

                        {/* Stok Rozeti */}
                        <div className="mb-2">
                            {product.stock_quantity > 0 ? (
                                <Badge bg="success" className="px-3 py-2">Stokta Var</Badge>
                            ) : (
                                <Badge bg="danger" className="px-3 py-2">Tükendi</Badge>
                            )}
                        </div>

                        <h1 className="fw-bold text-dark mb-3">{product.name}</h1>

                        {/* Yıldızlar ve Yorum Sayısı */}
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <div className="d-flex">{renderStars(Math.round(averageRating))}</div>
                            <span className="text-muted small">({totalReviews} Değerlendirme)</span>
                            <span className="fw-bold text-warning ms-2">{averageRating.toFixed(1)}</span>
                        </div>

                        {/* Fiyat */}
                        <h2 className="text-primary display-6 fw-bold mb-4">
                            {product.price} <span className="fs-4 text-dark">₺</span>
                        </h2>

                        <p className="text-secondary lead fs-6">
                            {product.description}
                        </p>

                        <div className="mt-4 p-3 bg-light rounded border border-light">
                            <small className="text-muted">
                                🚚 <strong>Ücretsiz Kargo:</strong> 500 TL ve üzeri alışverişlerde kargo bedava.
                                <br />
                                🛡️ <strong>Güvenli Ödeme:</strong> 256-bit SSL koruması.
                            </small>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
} 

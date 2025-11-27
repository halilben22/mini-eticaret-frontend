import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import renderStars from "../../helper/StarRatingHelper";
import { Form, Button, ListGroup, Card, Row, Col, ProgressBar } from 'react-bootstrap';
export default function ProductReviews({ productId, reviews, onReviewAdded }) {


    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const navigate = useNavigate();


    //helper fonksiyonu kullanmak için import eklenmeli

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.post(`http://localhost:8080/products/${productId}/reviews`,
                { rating: parseInt(newRating), comment: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Yorumunuz başarıyla eklendi!");
            setNewComment("");
            setNewRating(5);
            onReviewAdded(); // Yorum eklendikten sonra üst bileşene bildirim gönder
            if (onReviewAdded) onReviewAdded();
        }

        catch (error) {
            console.error("Yorum eklenirken hata oluştu:", error);
            alert("Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
    }

    return (
        <Row>
            {/* SOL: Yorum Listesi */}
            <Col lg={7} className="mb-4">
                <h4 className="mb-4 fw-bold text-secondary">📝 Müşteri Yorumları ({reviews.length})</h4>

                {reviews.length === 0 ? (
                    <div className="text-center p-5 bg-light rounded text-muted">
                        Henüz yorum yapılmamış. İlk yorumu sen yap!
                    </div>
                ) : (
                    <ListGroup variant="flush" className="shadow-sm rounded bg-white">
                        {reviews.map((review) => (
                            <ListGroup.Item key={review.id} className="p-4 border-bottom">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0 fw-bold text-dark">{review.user?.full_name || "Kullanıcı"}</h6>
                                    <small className="text-muted">{new Date(review.created_at).toLocaleDateString()}</small>
                                </div>
                                <div className="mb-2">{renderStars(review.rating)}</div>
                                <p className="text-secondary mb-0">{review.comment}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>

            {/* SAĞ: Yorum Yapma Formu */}
            <Col lg={5}>
                <Card className="shadow-sm border-0 bg-light sticky-top" style={{ top: "100px" }}>
                    <Card.Body>
                        <h5 className="mb-3 fw-bold">Yorum Yap</h5>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Puanınız</Form.Label>
                                <Form.Select
                                    value={newRating}
                                    onChange={(e) => setNewRating(e.target.value)}
                                    className="form-select-lg"
                                >
                                    <option value="5">★★★★★ (Mükemmel)</option>
                                    <option value="4">★★★★☆ (Çok İyi)</option>
                                    <option value="3">★★★☆☆ (Orta)</option>
                                    <option value="2">★★☆☆☆ (Kötü)</option>
                                    <option value="1">★☆☆☆☆ (Çok Kötü)</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Yorumunuz</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Ürün hakkındaki düşünceleriniz..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
                                Yorumu Gönder
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );


}
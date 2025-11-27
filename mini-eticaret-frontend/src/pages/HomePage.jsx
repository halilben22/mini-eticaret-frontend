import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Carousel, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './css/HomePage.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    const searchQuery = searchParams.get("name");

    const fetchData = async () => {
      try {
        // 1. Ürünleri Çek (Sadece Arama Filtresi Var)
        let url = "http://localhost:8080/products";
        if (searchQuery) {
          url += `?name=${searchQuery}`;
        }

        const prodRes = await axios.get(url);
        setProducts(prodRes.data.data || []);

        // 2. Slider İçin En İyileri Çek
        const topRes = await axios.get("http://localhost:8080/products/top-rated");
        setTopProducts(topRes.data.data || []);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();

  }, [searchParams]);

  const addToCart = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Lütfen giriş yapın");
      navigate("/login");
      return;
    }
    try {
      await axios.post("http://localhost:8080/cart", { product_id: id, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Sepete eklendi! 🛒");
    } catch (err) {
      toast.error("Hata oluştu");
    }
  }

  if (loading) return (
    <Container className="text-center mt-5"><Spinner animation="border" variant="primary" /></Container>
  );

  return (
    <Container className="py-5">

      {/* --- SLIDER (CAROUSEL) --- */}
      {/* Sadece arama yapılmadıysa göster */}
      {!searchParams.get("name") && topProducts.length > 0 && (
        <div className="mb-5">
          <h3 className="fw-bold text-secondary mb-3">🔥 Haftanın Yıldızları</h3>
          <Carousel className="shadow-lg rounded-3 overflow-hidden">
            {topProducts.map((prod) => (
              <Carousel.Item key={prod.id} interval={3000}>
                <div style={{ height: "400px", background: "#f8f9fa", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <img
                    className="d-block w-100 h-100"
                    src={prod.image_url ? `http://localhost:8080${prod.image_url}` : "https://via.placeholder.com/800x400"}
                    alt={prod.name}
                    style={{ objectFit: "cover", filter: "brightness(0.7)" }}
                  />
                </div>
                <Carousel.Caption className="text-start">
                  <Badge bg="warning" text="dark" className="mb-2">★ {prod.average_rating.toFixed(1)} Puan</Badge>
                  <h2 className="fw-bold">{prod.name}</h2>
                  <p className="lead">{prod.description}</p>
                  <Link to={`/product/${prod.id}`}>
                    <Button variant="light" size="lg" className="fw-bold">İncele & Satın Al</Button>
                  </Link>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}

      {/* --- BAŞLIK VE ARAMA TEMİZLEME --- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-secondary">
          {searchParams.get("name") ? `🔍 "${searchParams.get("name")}" Sonuçları` : "✨ Vitrin Fırsatları"}
        </h2>

        {searchParams.get("name") && (
          <Button variant="outline-danger" size="sm" onClick={() => navigate("/")}>
            Aramayı Temizle ❌
          </Button>
        )}
      </div>

      {/* --- ÜRÜN LİSTESİ (TAM EKRAN) --- */}
      {products.length === 0 ? (
        <div className="text-center py-5 bg-white rounded shadow-sm">
          <h3>😔 Üzgünüz, ürün bulunamadı.</h3>
          <p>Farklı bir arama terimi deneyin.</p>
          <Button variant="primary" onClick={() => navigate("/")}>Tüm Ürünleri Gör</Button>
        </div>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="product-card shadow-sm h-100 border-0">
                <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={product.image_url ? `http://localhost:8080${product.image_url}` : "https://via.placeholder.com/300"}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </div>
                </Link>
                <Card.Body className="d-flex flex-column">
                  <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                    <Card.Title className="text-truncate" style={{ fontSize: "1rem" }}>{product.name}</Card.Title>
                  </Link>
                  <div className="mt-auto d-flex justify-content-between align-items-center pt-3">
                    <span className="price-tag text-primary fw-bold">{product.price} ₺</span>
                    <Button variant="outline-primary" size="sm" onClick={() => addToCart(product.id)}>
                      + Ekle
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
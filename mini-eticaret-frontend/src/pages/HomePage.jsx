import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // useSearchParams Ekle
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './css/HomePage.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL'deki parametreleri okumak için (Örn: ?name=telefon)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    // URL'den 'name' parametresini al
    const searchQuery = searchParams.get("name");

    // API Adresini Dinamik Yap
    let url = "http://localhost:8080/products";

    // Eğer arama yapılmışsa URL'e ekle
    if (searchQuery) {
      url += `?name=${searchQuery}`;
    }

    axios.get(url)
      .then((res) => {
        setProducts(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

  }, [searchParams]); // DİKKAT: searchParams değişince (arama yapılınca) useEffect tekrar çalışsın!

  const addToCart = async (productId) => {
    // 1. Token var mı kontrol et
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Sepete eklemek için önce giriş yapmalısınız!");
      navigate("/login"); // Giriş sayfasına yönlendir
      return;
    }

    try {
      // 2. Backend'e istek at (Header'da Token ile)
      await axios.post(
        "http://localhost:8080/cart",
        {
          product_id: productId,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // <--- Kritik Nokta!
          }
        }
      );

      alert("Ürün sepete eklendi! 🛒");

    } catch (error) {
      console.error("Sepet hatası:", error);
      alert("Bir hata oluştu. (Stok bitmiş veya token süresi dolmuş olabilir)");
    }
  };

  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold text-secondary">
          {searchParams.get("name") ? `🔍 "${searchParams.get("name")}" Sonuçları` : "✨ Vitrin Fırsatları"}
        </h2>

        {/* Arama yapıldıysa "Tümünü Göster" butonu çıkar */}
        {searchParams.get("name") && (
          <Button variant="outline-secondary" onClick={() => navigate("/")}>
            ❌ Aramayı Temizle
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5">
          <h3>Üzgünüz, aradığınız kriterlere uygun ürün bulunamadı. 😔</h3>
          <Button variant="primary" className="mt-3" onClick={() => navigate("/")}>Tüm Ürünleri Gör</Button>
        </div>
      ) : (
        <Row>
          {/* ... Harita (Map) Döngüsü Aynı Kalsın ... */}
          {products.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              {/* ... Card Kodları Aynı ... */}
              <Card className="product-card shadow-sm">
                <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                  <Card.Img variant="top" src={product.image_url ? `http://localhost:8080${product.image_url}` : "..."} className="card-img-top" />
                </Link>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate">{product.name}</Card.Title>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="price-tag">{product.price} ₺</span>
                    <Button variant="outline-primary" size="sm" onClick={() => addToCart(product.id)}>Sepete Ekle</Button>
                    {/* ... Buton ... */}
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











import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Carousel, Badge, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './css/HomePage.css';
import ProductSkeleton from "../components/skeletons/ProductSkeleton";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sepetteki ürünleri tutacağımız State
  const [cartItems, setCartItems] = useState([]);

  // --- MODAL İÇİN STATE'LER ---
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // quantity: Ekranda görünen sayı
  // initialQty: Modal açıldığında sepette kaç tane vardı? (Farkı hesaplamak için)
  const [quantity, setQuantity] = useState(0);
  const [initialQty, setInitialQty] = useState(0);
  // -----------------------------

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. Ürünleri ve SEPETİ Çekme Fonksiyonu
  const fetchAllData = async () => {
    try {
      const searchQuery = searchParams.get("name");
      let url = "http://localhost:8080/products";
      if (searchQuery) url += `?name=${searchQuery}`;

      // A. Ürünleri Çek
      const prodRes = await axios.get(url);
      setProducts(prodRes.data.data || []);

      const topRes = await axios.get("http://localhost:8080/products/top-rated");
      setTopProducts(topRes.data.data || []);

      // B. Sepeti Çek (Giriş yapmışsa)
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const cartRes = await axios.get("http://localhost:8080/cart", {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Sepetteki itemları kaydet
          setCartItems(cartRes.data.data.items || []);
        } catch (err) {
          console.log("Sepet çekilemedi veya boş");
        }
      }

      setTimeout(() => { setLoading(false); }, 500); // Yükleme efektini göstermek için küçük bir gecikme

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [searchParams]); // URL değişince tekrar çalışır

  // 2. ADIM: PENCEREYİ AÇMA (Sepet Kontrolü ile)
  const openAddModal = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Lütfen giriş yapın");
      navigate("/login");
      return;
    }

    // Sepette bu üründen var mı? Bulalım.
    const existingItem = cartItems.find(item => item.product_id === product.id);

    // Varsa onun adedini, yoksa 1'i başlangıç yap
    const currentQty = existingItem ? existingItem.quantity : 1;

    // Eğer sepette varsa başlangıç değeri o olsun, yoksa 1 olsun.
    // Ancak sepette varsa, mantıken kullanıcı "artırmak" ister.
    // Eğer sepette hiç yoksa 1 ile başlarız.
    // Eğer sepette 5 tane varsa, modal 5 ile açılır.

    setSelectedProduct(product);
    setQuantity(currentQty);
    setInitialQty(existingItem ? existingItem.quantity : 0); // Başlangıç miktarını kaydet

    setShowModal(true);
  };

  // 3. ADIM: ONAYLAMA (Farkı Hesaplama)
  // 3. ADIM: ONAYLAMA (GÜNCELLEME VEYA EKLEME)
  const handleConfirmAddToCart = async () => {
    if (!selectedProduct) return;

    const token = localStorage.getItem("token");

    try {
      if (initialQty > 0) {
        // SENARYO 1: Ürün sepette zaten var -> GÜNCELLE (PUT)
        // quantity state'i modalda seçilen son sayıdır (Örn: 5)
        await axios.put("http://localhost:8080/cart",
          { product_id: selectedProduct.id, quantity: quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`Sepet güncellendi: ${quantity} adet ✅`);
      } else {
        // SENARYO 2: Ürün sepette yok -> EKLE (POST)
        await axios.post("http://localhost:8080/cart",
          { product_id: selectedProduct.id, quantity: quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`${quantity} adet sepete eklendi! 🛒`);
      }

      // Verileri tazele
      fetchAllData();
      setShowModal(false);

    } catch (err) {
      toast.error("Hata oluştu: " + (err.response?.data?.error || "Bilinmeyen hata"));
    }
  };

  const increaseQty = () => {
    if (selectedProduct && quantity < selectedProduct.stock_quantity) {
      setQuantity(prev => prev + 1);
    } else {
      toast.info("Stok sınırına ulaştınız!");
    }
  };

  const decreaseQty = () => {
    // 1'in altına inmesin
    if (quantity > 0) setQuantity(prev => prev - 1);
  };

  if (loading) {
    return (
      <Container className="py-5">


        <Row>
          {/* 8 tane iskelet kartı oluşturup ekrana basıyoruz */}
          {[...Array(8)].map((_, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <ProductSkeleton />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ minHeight: "75vh" }}>

      {/* SLIDER KISMI (Aynı kalıyor) */}
      {!searchParams.get("name") && topProducts.length > 0 && (
        <div className="mb-5">
          <h3 className="fw-bold text-secondary mb-3">Haftanın Yıldızları</h3>
          <Carousel className="shadow-lg rounded-3 overflow-hidden">
            {topProducts.map((prod) => (
              <Carousel.Item key={prod.id} interval={3000}>
                <div style={{ height: "400px", background: "#f8f9fa", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <img className="d-block w-100 h-100" src={prod.image_url ? `http://localhost:8080${prod.image_url}` : "https://via.placeholder.com/800x400"} alt={prod.name} style={{ objectFit: "cover", filter: "brightness(0.7)" }} />
                </div>
                <Carousel.Caption className="text-start">
                  <Badge bg="warning" text="dark" className="mb-2">★ {prod.average_rating.toFixed(1)} Puan</Badge>
                  <h2 className="fw-bold">{prod.name}</h2>
                  <p className="lead">{prod.description}</p>
                  <Link to={`/product/${prod.id}`}><Button variant="light" size="lg" className="fw-bold">İncele & Satın Al</Button></Link>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}

      {/* ÜRÜN LİSTESİ */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-secondary">
          {searchParams.get("name") ? `🔍 "${searchParams.get("name")}" Sonuçları` : " Ürünleri inceleyin"}
        </h2>
        {searchParams.get("name") && <Button variant="outline-danger" size="sm" onClick={() => navigate("/")}>Aramayı Temizle ❌</Button>}
      </div>

      <Row>
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="product-card shadow-sm h-100 border-0">
              <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                <div className="position-relative">
                  <Card.Img variant="top" src={product.image_url ? `http://localhost:8080${product.image_url}` : "https://via.placeholder.com/300"} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
                </div>
              </Link>
              <Card.Body className="d-flex flex-column">
                <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                  <Card.Title className="text-truncate" style={{ fontSize: "1rem" }}>{product.name}</Card.Title>
                </Link>
                <div className="mt-auto d-flex justify-content-between align-items-center pt-3">
                  <span className="price-tag text-primary fw-bold">{product.price} ₺</span>
                  <Button variant="outline-primary" size="sm" onClick={() => openAddModal(product)}>
                    + Ekle
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* --- SEPETE EKLEME PENCERESİ (MODAL) --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary">Sepete Ekle / Güncelle</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedProduct && (
            <>
              <img
                src={selectedProduct.image_url ? `http://localhost:8080${selectedProduct.image_url}` : "https://via.placeholder.com/150"}
                alt={selectedProduct.name}
                style={{ height: "150px", objectFit: "contain", marginBottom: "15px" }}
              />
              <h4 className="fw-bold">{selectedProduct.name}</h4>
              <p className="text-muted">{selectedProduct.price} ₺</p>

              {/* Mevcut Durum Bilgisi */}
              {initialQty > 0 && (
                <div className="alert alert-info py-2 small">
                  Sepetinizde bu üründen <strong>{initialQty}</strong> adet var.
                </div>
              )}

              <div className="d-flex justify-content-center align-items-center mt-3">
                <Button variant="outline-secondary" onClick={decreaseQty} disabled={quantity <= 0}>-</Button>
                <span className="mx-3 fs-4 fw-bold" style={{ minWidth: "30px" }}>{quantity}</span>
                <Button variant="outline-secondary" onClick={increaseQty} disabled={quantity >= selectedProduct.stock_quantity}>+</Button>
              </div>

            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Vazgeç
          </Button>
          <Button variant="primary" inactive={initialQty > 0} className="px-4 fw-bold" onClick={handleConfirmAddToCart}>
            {quantity > 0 ? "Sepeti güncelle" : "Sepete Ekle ✅"}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
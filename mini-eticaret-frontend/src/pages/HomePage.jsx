import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// Pagination eklendi 👇
import { Container, Row, Col, Card, Button, Spinner, Carousel, Badge, Modal, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './css/HomePage.css';
import ProductSkeleton from "../components/skeletons/ProductSkeleton";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- PAGINATION STATE'LERİ (YENİ) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // ------------------------------------

  // Sepetteki ürünleri tutacağımız State
  const [cartItems, setCartItems] = useState([]);

  // --- MODAL İÇİN STATE'LER ---
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState(0);
  const [initialQty, setInitialQty] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. Verileri Çekme Fonksiyonu
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const searchQuery = searchParams.get("name");

      // --- URL GÜNCELLEMESİ (SAYFALAMA İÇİN) ---
      // Varsayılan olarak sayfa ve limiti ekliyoruz
      let url = `http://localhost:8080/products?page=${currentPage}&limit=8`;

      // Arama varsa URL'in sonuna &name=... olarak ekliyoruz
      if (searchQuery) url += `&name=${searchQuery}`;

      // A. Ürünleri Çek
      const prodRes = await axios.get(url);
      setProducts(prodRes.data.data || []);

      // Meta verisinden toplam sayfa sayısını al (Backend'de bu yapıyı kurmuştuk)
      if (prodRes.data.meta) {
        setTotalPages(prodRes.data.meta.total_pages);
      }

      // Slider sadece 1. sayfada ve arama yoksa görünsün istersen buraya if koyabilirsin
      const topRes = await axios.get("http://localhost:8080/products/top-rated");
      setTopProducts(topRes.data.data || []);

      // B. Sepeti Çek (Giriş yapmışsa)
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const cartRes = await axios.get("http://localhost:8080/cart", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCartItems(cartRes.data.data.items || []);
        } catch (err) {
          console.log("Sepet çekilemedi veya boş");
        }
      }

      setTimeout(() => { setLoading(false); }, 500);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // useEffect hem arama değişince hem de sayfa (currentPage) değişince çalışmalı
  useEffect(() => {
    fetchAllData();
    // Sayfa değişince en yukarı kaydır
    window.scrollTo(0, 0);
  }, [searchParams, currentPage]);

  // Sayfa Değiştirme Yardımcısı
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 2. ADIM: PENCEREYİ AÇMA
  const openAddModal = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Lütfen giriş yapın");
      navigate("/login");
      return;
    }

    const existingItem = cartItems.find(item => item.product_id === product.id);
    const currentQty = existingItem ? existingItem.quantity : 1;

    setSelectedProduct(product);
    setQuantity(currentQty);
    setInitialQty(existingItem ? existingItem.quantity : 0);

    setShowModal(true);
  };

  // 3. ADIM: ONAYLAMA
  const handleConfirmAddToCart = async () => {
    if (!selectedProduct) return;
    const token = localStorage.getItem("token");

    try {
      if (initialQty > 0) {
        await axios.put("http://localhost:8080/cart",
          { product_id: selectedProduct.id, quantity: quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`Sepet güncellendi: ${quantity} adet ✅`);
      } else {
        await axios.post("http://localhost:8080/cart",
          { product_id: selectedProduct.id, quantity: quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`${quantity} adet sepete eklendi! 🛒`);
      }

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
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row>
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
    <Container className="py-5 d-flex flex-column flex-grow-1" style={{ minHeight: "95vh" }}>

      {/* SLIDER KISMI (Sadece arama yoksa ve 1. sayfadaysak gösterelim - Opsiyonel) */}
      {!searchParams.get("name") && currentPage === 1 && topProducts.length > 0 && (
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

      {/* ÜRÜN LİSTESİ BAŞLIK */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-secondary">
          {searchParams.get("name") ? ` "${searchParams.get("name")}" Sonuçları` : " Vitrin Fırsatları"}
        </h2>
        {searchParams.get("name") && <Button variant="outline-danger" size="sm" onClick={() => navigate("/")}>Aramayı Temizle ❌</Button>}
      </div>

      {/* ÜRÜN KARTLARI */}
      <Row className="mb-auto">
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
                  <Button variant="outline-primary" size="sm" onClick={() => openAddModal(product)}>
                    Sepete Ekle
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-auto pt-4">
          <Pagination>
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      )}
      {/* ------------------------------------------------ */}

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary">
            {initialQty > 0 ? "Sepeti Güncelle" : "Sepete Ekle"}
          </Modal.Title>
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

              {initialQty > 0 && (
                <div className="alert alert-info py-2 small">
                  Sepetinizde bu üründen <strong>{initialQty}</strong> adet var.
                </div>
              )}

              <div className="d-flex justify-content-center align-items-center mt-3">
                <Button variant="outline-secondary" onClick={decreaseQty} disabled={quantity <= 1}>-</Button>
                <span className="mx-3 fs-4 fw-bold" style={{ minWidth: "30px" }}>{quantity}</span>
                <Button variant="outline-secondary" onClick={increaseQty} disabled={quantity >= selectedProduct.stock_quantity}>+</Button>
              </div>
              <small className="text-muted mt-2 d-block">Stok: {selectedProduct.stock_quantity}</small>
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Vazgeç</Button>
          <Button variant="primary" className="px-4 fw-bold" onClick={handleConfirmAddToCart}>
            {initialQty > 0 ? "Sepeti Güncelle 🔄" : "Sepete Ekle ✅"}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
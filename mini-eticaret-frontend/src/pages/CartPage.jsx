import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// InputGroup'u import listesine ekledim
import { Container, Row, Col, Card, Button, Form, Spinner, Image, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CartSkeleton from "../components/skeletons/CartSkeleton";
import { useCart } from '../context/CartContext.jsx'; // Senin context importun

// FontAwesome ikonlarını ekledim
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Güncelleme sırasında butonları kilitlemek için
  const [updatingId, setUpdatingId] = useState(null);

  // Adres State'i (Senin kodunla aynı)
  const [addrForm, setAddrForm] = useState({
    city: "",
    district: "",
    detail: ""
  });

  // Promosyon Kodu State'i (Senin kodunla aynı)
  const [promoCode, setPromoCode] = useState("");

  const navigate = useNavigate();

  // Context'ten fetchCartCount'u alıyoruz
  const { fetchCartCount } = useCart();

  const fetchCart = () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    axios.get("http://localhost:8080/cart", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        const items = response.data.data.items || [];
        setCartItems(items);
        setTimeout(() => setLoading(false), 500);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => { fetchCart(); }, []);

  // --- YENİ: ADET GÜNCELLEME FONKSİYONU ---
  const handleUpdateQuantity = async (productId, newQuantity) => {
    // 1'in altına inmesin
    if (newQuantity < 1) return;

    setUpdatingId(productId); // Yükleniyor durumuna al
    const token = localStorage.getItem("token");

    try {
      await axios.put("http://localhost:8080/cart",
        { product_id: productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // State'i güncelle
      const updatedItems = cartItems.map(item =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);

      // Navbar sayacını güncelle
      fetchCartCount();

    } catch (error) {
      toast.error("Stok yetersiz veya hata oluştu");
    } finally {
      setUpdatingId(null);
    }
  };

  // --- YENİ: SİLME FONKSİYONU ---
  const handleRemoveItem = async (productId) => {
    if (!window.confirm("Ürünü sepetten silmek istiyor musunuz?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.warning("Ürün silindi ");

      // Listeden çıkar
      setCartItems(cartItems.filter(item => item.product_id !== productId));

      // Navbar sayacını güncelle
      fetchCartCount();

    } catch (error) {
      toast.error("Silinemedi!");
    }
  };

  const handleCheckout = async () => {
    // (Senin kodunla aynı)
    if (!addrForm.city || !addrForm.district || !addrForm.detail) {
      toast.warning("Lütfen adres bilgilerini tam giriniz!");
      return;
    }

    const combinedAddress = `${addrForm.detail}, ${addrForm.district} / ${addrForm.city}`;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:8080/create-order",
        {
          shipping_address: combinedAddress,
          promo_code: promoCode
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order_id, total, sub_total, shipping, discount_amount } = response.data;
      navigate("/payment", {
        state: {
          orderId: order_id,
          totalAmount: total,
          subTotal: sub_total,
          shipping: shipping,
          discount: discount_amount
        }
      });

    } catch (error) {
      toast.error(error.response?.data?.error || "Hata oluştu");
    }
  };

  // Sepet Toplamı
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) return <CartSkeleton />

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-secondary">Sepetim ({cartItems.length} Ürün)</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5 bg-white rounded shadow-sm">
          <h3 className="text-muted">Sepetinizde ürün yok. 😔</h3>
          <Button as={Link} to="/" variant="primary" className="mt-3">Alışverişe Başla</Button>
        </div>
      ) : (
        <Row>
          {/*  ÜRÜN LİSTESİ KISMI */}
          <Col lg={8}>
            {cartItems.map((item) => (
              <Card key={item.id} className="mb-3 border-0 shadow-sm">
                <Card.Body>
                  <Row className="align-items-center">
                    {/* Resim */}
                    <Col xs={3} md={2}>
                      <Image
                        src={item.product.image_url ? `http://localhost:8080${item.product.image_url}` : "https://via.placeholder.com/150"}
                        fluid rounded
                        style={{ height: "80px", objectFit: "cover" }}
                      />
                    </Col>

                    {/* Bilgiler */}
                    <Col xs={9} md={5}>
                      <h6 className="mb-1 text-truncate">
                        <Link to={`/product/${item.product_id}`} className="text-decoration-none text-dark">
                          {item.product.name}
                        </Link>
                      </h6>
                      <small className="text-muted">Birim Fiyat: {item.product.price} ₺</small>
                    </Col>

                    {/* Adet Değiştirme ve Silme (GÜNCELLENDİ) */}
                    <Col xs={12} md={5} className="mt-3 mt-md-0 d-flex justify-content-between align-items-center">

                      {/* Adet Değiştirici */}
                      <InputGroup size="sm" style={{ width: "110px" }}>
                        <Button
                          variant="outline-secondary"
                          onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingId === item.product_id}
                        >
                          -
                        </Button>

                        <Form.Control
                          className="text-center bg-white"
                          value={item.quantity}
                          readOnly
                        />

                        <Button
                          variant="outline-secondary"
                          onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock_quantity || updatingId === item.product_id}
                        >
                          +
                        </Button>
                      </InputGroup>

                      <div className="d-flex align-items-center gap-3">
                        <span className="fw-bold text-primary fs-5">
                          {(item.product.price * item.quantity).toFixed(2)} ₺
                        </span>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product_id)}
                          title="Sepetten Sil"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/*  SİPARİŞ ÖZETİ KISMI  */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm sticky-top" style={{ top: "100px" }}>
              <Card.Header className="bg-white fw-bold py-3">Sipariş Özeti</Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Ara Toplam</span>
                  <span>{totalPrice.toFixed(2)} ₺</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-success">
                  <span>Kargo</span>
                  <span>Alıcı Ödemeli</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
                  <span>Toplam</span>
                  <span className="text-primary">{totalPrice.toFixed(2)} ₺</span>
                </div>

                {/* ADRES FORMU */}
                <div className="mb-3">
                  <Form.Label className="small fw-bold text-muted">Teslimat Adresi</Form.Label>
                  <Row className="mb-2">
                    <Col>
                      <Form.Control type="text" placeholder="İl" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} />
                    </Col>
                    <Col>
                      <Form.Control type="text" placeholder="İlçe" value={addrForm.district} onChange={(e) => setAddrForm({ ...addrForm, district: e.target.value })} />
                    </Col>
                  </Row>
                  <Form.Control as="textarea" rows={2} placeholder="Mahalle, Sokak..." value={addrForm.detail} onChange={(e) => setAddrForm({ ...addrForm, detail: e.target.value })} style={{ resize: "none" }} />
                </div>

                {/* KUPON KODU */}
                <div className="mb-4">
                  <Form.Label className="small fw-bold text-muted">İndirim Kuponu</Form.Label>
                  <Form.Control type="text" placeholder="Kupon Kodu (Opsiyonel)" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} />
                  <Form.Text className="text-muted small">*İndirim ödeme ekranında düşecektir.</Form.Text>
                </div>

                <Button variant="success" size="lg" className="w-100 fw-bold" onClick={handleCheckout}>
                  Siparişi Onayla
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
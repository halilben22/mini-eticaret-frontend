import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Badge, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './css/OrdersPage.css'; // <--- CSS dosyasını import etmeyi unutma!
import OrdersSkeleton from '../components/skeletons/OrdersPageSkeleton.jsx';
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://localhost:8080/orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        const data = response.data.data || [];
        setOrders(data.reverse());

        setTimeout(() => {
          setLoading(false);
        }, 500); // Yükleme efektini göstermek için küçük bir gecikme ekleyelim
      })
      .catch((error) => {
        console.error("Siparişler çekilemedi:", error);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid": return <Badge bg="success" className="p-2">Ödendi ✅</Badge>;
      case "waiting_payment": return <Badge bg="warning" text="dark" className="p-2">Ödeme Bekliyor ⏳</Badge>;
      case "shipped": return <Badge bg="info" className="p-2">Kargolandı </Badge>;
      case "delivered": return <Badge bg="primary" className="p-2">Teslim Edildi </Badge>;
      default: return <Badge bg="secondary" className="p-2">{status}</Badge>;
    }
  };

  if (loading) return (
    <OrdersSkeleton></OrdersSkeleton>
  );

  return (
    // 'h-100' ve 'd-flex flex-column' ile sayfayı tam boyuta yayıyoruz
    <Container className="py-4 h-100 d-flex flex-column">
      <h2 className="mb-4 fw-bold text-secondary"> Sipariş Geçmişim</h2>

      {orders.length === 0 ? (
        <div className="text-center p-5 bg-white rounded shadow-sm">
          <h4>Henüz siparişiniz yok.</h4>
          <p>İlk siparişinizi vermek için ana sayfaya göz atın.</p>
        </div>
      ) : (

        /* --- KAYDIRILABİLİR ALAN BAŞLANGICI --- */
        <div className="orders-scroll-container">
          <Row>
            {orders.map((order) => (
              <Col md={6} lg={4} key={order.id} className="mb-4">
                <Card className="shadow-sm border-0 h-100" style={{ background: "#fff" }}>
                  <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom-0 pt-3">
                    <span className="fw-bold text-primary">#{order.id}</span>
                    <small className="text-muted">{new Date(order.created_at).toLocaleDateString()}</small>
                  </Card.Header>

                  <Card.Body>
                    <div className="mb-3 text-center">
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="bg-light p-3 rounded mb-3" style={{ height: "120px", overflowY: "auto" }}>
                      <small className="fw-bold text-muted d-block mb-2">İÇERİK:</small>
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="d-flex justify-content-between small mb-1 border-bottom pb-1">
                          <span className="text-truncate" style={{ maxWidth: "150px" }}>{item.quantity}x {item.product.name}</span>
                          <span className="fw-bold">{item.unit_price} ₺</span>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-auto border-top pt-3">
                      <span className="text-muted small">Toplam Tutar:</span>
                      <span className="fs-5 fw-bold text-dark">{order.total_amount} ₺</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        /* --- KAYDIRILABİLİR ALAN BİTİŞİ --- */
      )}
    </Container>
  );
}
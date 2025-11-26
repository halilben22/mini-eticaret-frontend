import { useEffect, useState } from "react";
import axios from "axios";

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
        // Backend yapısı: { data: [...] }
        const data = response.data.data || [];
        // Yeniden eskiye sıralayalım (Opsiyonel)
        setOrders(data.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.error("Siparişler çekilemedi:", error);
        setLoading(false);
      });
  }, []);

  // Sipariş Durumuna Göre Renk Ayarı
  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span style={{ backgroundColor: "#d4edda", color: "#155724", padding: "5px 10px", borderRadius: "15px", fontWeight: "bold" }}>Ödendi ✅</span>;
      case "waiting_payment":
        return <span style={{ backgroundColor: "#fff3cd", color: "#856404", padding: "5px 10px", borderRadius: "15px", fontWeight: "bold" }}>Ödeme Bekliyor ⏳</span>;
      case "shipped":
        return <span style={{ backgroundColor: "#cce5ff", color: "#004085", padding: "5px 10px", borderRadius: "15px", fontWeight: "bold" }}>Kargolandı 🚛</span>;
      default:
        return <span>{status}</span>;
    }
  };

  if (loading) return <h3>Siparişler yükleniyor...</h3>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>📦 Siparişlerim</h1>

      {orders.length === 0 ? (
        <p>Henüz siparişiniz yok.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div key={order.id} style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "10px" }}>
                <div>
                  <strong>Sipariş No: #{order.id}</strong>
                  <div style={{ fontSize: "12px", color: "#888" }}>{new Date(order.created_at).toLocaleString()}</div>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Sipariş İçeriği (Backend'de Preload yaptıysak gelir) */}
              <div>
                {order.order_items?.map((item) => (
                  console.log(item),
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>

                    <span>{item.quantity}x {item.product.name}</span>
                    <span>{item.unit_price * item.quantity} TL</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #eee", paddingTop: "10px", marginTop: "10px", textAlign: "right", fontSize: "18px", fontWeight: "bold" }}>
                Toplam: {order.total_amount} TL
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
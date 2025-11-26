import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Parametreleri almak için
import axios from "axios";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // CartPage'den gelen verileri al (Order ID ve Tutar)
  const { orderId, totalAmount } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) {
      alert("Geçersiz işlem!");
      navigate("/cart");
    }
  }, [orderId, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // Backend'e Ödeme İsteği At
      await axios.post("http://localhost:8080/payment", 
        { 
          order_id: orderId, 
          payment_method: paymentMethod 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Ödeme Başarılı! Siparişiniz Hazırlanıyor.");
      navigate("/orders"); // Siparişlerim sayfasına yönlendir (Henüz yapmadıysak Home'a at)

    } catch (error) {
      console.error("Ödeme hatası:", error);
     alert("Ödeme Başarısız: " + (error.response?.data || "Bilinmeyen Hata"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", textAlign: "center" }}>
      <h2>💳 Ödeme Ekranı</h2>
      <p>Sipariş No: <strong>#{orderId}</strong></p>
      <h1 style={{ color: "#28a745" }}>{totalAmount} TL</h1>

      <div style={{ margin: "20px 0", textAlign: "left" }}>
        <label style={{ display: "block", marginBottom: "10px" }}>Ödeme Yöntemi Seçin:</label>
        
        <select 
          value={paymentMethod} 
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        >
          <option value="credit_card">Kredi Kartı / Banka Kartı</option>
          <option value="bank_transfer">Havale / EFT</option>
          <option value="cash_on_delivery">Kapıda Ödeme</option>
        </select>
      </div>

      {/* Sahte Kredi Kartı Formu (Görsel Amaçlı) */}
      {paymentMethod === "credit_card" && (
        <div style={{ background: "#f9f9f9", padding: "10px", marginBottom: "20px", borderRadius: "5px" }}>
            <input type="text" placeholder="Kart Numarası (Sahte)" style={{ width: "100%", padding: "8px", marginBottom: "5px" }} />
            <div style={{ display: "flex", gap: "10px" }}>
                <input type="text" placeholder="SKT (AA/YY)" style={{ flex: 1, padding: "8px" }} />
                <input type="text" placeholder="CVV" style={{ flex: 1, padding: "8px" }} />
            </div>
        </div>
      )}

      <button 
        onClick={handlePayment} 
        disabled={loading}
        style={{ width: "100%", padding: "15px", backgroundColor: "#007bff", color: "white", border: "none", fontSize: "18px", cursor: "pointer", borderRadius: "5px" }}
      >
        {loading ? "İşleniyor..." : "Ödemeyi Tamamla"}
      </button>
    </div>
  );
}
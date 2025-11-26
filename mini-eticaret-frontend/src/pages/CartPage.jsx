import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(""); // Adres için state
  
  const navigate = useNavigate();

  // Sepeti Çekme Fonksiyonu
  const fetchCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
        return;
    }

    axios.get("http://localhost:8080/cart", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      // Backend yapımız: { data: { items: [...] } }
      // Eğer sepet boşsa items null gelebilir, boş dizi verelim
      const items = response.data.data.items || [];
      setCartItems(items);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Sepet çekilemedi:", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // --- SİPARİŞİ TAMAMLA (CHECKOUT) ---
  const handleCheckout = async () => {
    if (!address) {
      alert("Lütfen bir teslimat adresi girin!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8080/checkout",
        { shipping_address: address }, // Backend bu alanı bekliyor
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Siparişiniz başarıyla alındı! 🎉");
      setCartItems([]); // Sepeti ekrandan temizle
      setAddress("");   // Adresi temizle

    } catch (error) {
      console.error("Sipariş hatası:", error);
      alert("Sipariş oluşturulamadı: " + (error.response?.data || "Bilinmeyen hata"));
    }
  };

  // Sepet Toplamını Hesapla
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  if (loading) return <h3>Sepet Yükleniyor...</h3>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🛒 Sepetim</h1>

      {cartItems.length === 0 ? (
        <p>Sepetinizde ürün yok.</p>
      ) : (
        <>
          {/* Ürün Listesi */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                <th style={{ padding: "10px" }}>Ürün</th>
                <th>Adet</th>
                <th>Fiyat</th>
                <th>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.product.price} TL</td>
                  <td>{item.product.price * item.quantity} TL</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Adres ve Ödeme Alanı */}
          <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
            <h3>Toplam Tutar: {totalPrice} TL</h3>
            
            <textarea
              placeholder="Teslimat Adresini Giriniz..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%", height: "80px", padding: "10px", marginBottom: "10px" }}
            />

            <button 
              onClick={handleCheckout}
              style={{ padding: "15px 30px", backgroundColor: "#28a745", color: "white", border: "none", fontSize: "16px", cursor: "pointer", width: "100%" }}
            >
              Siparişi Onayla ve Satın Al ✅
            </button>
          </div>
        </>
      )}
    </div>
  );
}
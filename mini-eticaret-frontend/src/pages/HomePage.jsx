import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Yönlendirme için

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Ürünleri Çek
  useEffect(() => {
    axios.get("http://localhost:8080/products")
      .then((response) => {
        const gelenVeri = response.data.data || response.data || [];
        setProducts(gelenVeri);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ürünler çekilemedi:", error);
        setLoading(false);
      });
  }, []);

  // --- YENİ: SEPETE EKLEME FONKSİYONU ---
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

  if (loading) return <h3>Yükleniyor...</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ürünler</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>

        {Array.isArray(products) && products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px", width: "220px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
            <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              {/* Resim Alanı */}
              {product.image_url ? (

                <img
                  src={`http://localhost:8080${product.image_url}`}
                  alt={product.name}
                  style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }}
                />
              ) : (
                <div style={{ height: "150px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", color: "#888" }}>
                  Resim Yok
                </div>
              )}

              <h3>{product.name}</h3>
            </Link>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#2c3e50" }}>{product.price} TL</p>

            {/* --- BUTONA TIKLAMA OLAYI EKLENDİ --- */}
            <button
              onClick={() => addToCart(product.id)}
              style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Sepete Ekle 🛒
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}
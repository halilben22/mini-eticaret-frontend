// 1. DÜZELTME: useState'i buraya ekledik!
import { useEffect, useState } from "react"; 
import axios from "axios";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/products")
      .then((response) => {
        // 2. DÜZELTME (Önemli):
        // Bizim Go backend'imiz veriyi şöyle gönderiyor: { "data": [...] }
        // Axios ise cevabı 'data' içine koyar.
        // Yani ürünlere ulaşmak için "response.data.data" dememiz gerekebilir.
        // Eğer direkt liste dönüyorsan "response.data" kalabilir.
        
        console.log("Gelen Veri:", response.data); // Konsoldan kontrol et
        
        // Güvenli atama: Eğer .data.data varsa onu al, yoksa direkt .data'yı al
        const urunListesi = response.data.data || response.data;
        
        setProducts(urunListesi);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      })
  }, []);

  if (loading) return <h1>Yükleniyor...</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ürünler</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        
        {/* Güvenlik Kontrolü: products bir dizi (array) mi? */}
        {Array.isArray(products) && products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
            
            {product.image_url ? (
               <img 
                 src={`http://localhost:8080${product.image_url}`} 
                 alt={product.name} 
                 style={{ width: "100%", height: "150px", objectFit: "cover" }}
               />
            ) : (
              <div style={{ height: "150px", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  Resim Yok
              </div>
            )}
            
            <h3>{product.name}</h3>
            <p>{product.price} TL</p>
            <button>Sepete Ekle</button>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
// Yeni bileşenlerimizi çağırıyoruz
import ProductInfo from "../components/product/ProductInfo";
import ProductReviews from "../components/product/ProductReviews";
import ProductDetailSkeleton from "../components/skeletons/ProductDetailSkeleton";
export default function ProductDetailPage() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [cartQuantity, setCartQuantity] = useState(0);

    // Veri Çekme Fonksiyonu (Tekrar kullanılacağı için ayırdık)
    const fetchProductData = useCallback(async () => {
        try {
            const productRes = await axios.get(`http://localhost:8080/products/${id}`);
            setProduct(productRes.data.data);

            const reviewRes = await axios.get(`http://localhost:8080/products/${id}/reviews`);
            setReviews(reviewRes.data.reviews || []);
            setAverageRating(reviewRes.data.average_rating || 0);

            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const cartRes = await axios.get("http://localhost:8080/cart", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log(cartRes);

                    const cartItems = cartRes.data.data.items || [];
                    console.log(cartItems);
                    const existingItem = cartItems.find(item => item.product_id === parseInt(id));
                    if (existingItem) {
                        setCartQuantity(existingItem.quantity);
                    }
                }
                catch (error) {
                    console.error("Sepet verisi alınamadı:", error);
                }
            }
            setTimeout(() => { setLoading(false); }, 500); // Yükleme efektini göstermek için küçük bir gecikme

        } catch (error) {
            console.error("Veri hatası:", error);
            setLoading(false);
        }
    }, [id]);

    // Sayfa açılınca çalış
    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);


    // --- YENİ FONKSİYON: SEPETE EKLEME ---
    const handleAddToCart = async (quantity) => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.warning("Sepete eklemek için giriş yapmalısınız 🔒");
            navigate("/login");
            return;
        }

        try {
            // Backend'deki POST /cart (Ekleme) endpoint'ini kullanıyoruz.
            // Bu endpoint mevcut sayının üzerine ekleme yapar (+=).
            await axios.post("http://localhost:8080/cart",
                { product_id: parseInt(id), quantity: quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(`${quantity} adet ürün sepete eklendi! `);

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Sepete eklenemedi");
        }
    };

    if (loading) return <ProductDetailSkeleton />;
    if (!product) return <h3 style={{ textAlign: "center", marginTop: "50px" }}>Ürün Bulunamadı!</h3>;

    return (
        <div style={{ padding: "20px", maxWidth: "1100px", minHeight: "75vh", margin: "0 auto" }}>

            {/* 1. Ürün Bilgisi Parçası */}
            <ProductInfo
                product={product}
                averageRating={averageRating}
                totalReviews={reviews.length}
                onAddToCart={handleAddToCart}
                currentCartQty={cartQuantity} // <--- BAĞLANTI BURADA
            />

            {/* 2. Yorumlar Parçası */}
            {/* onReviewAdded prop'una veri çekme fonksiyonunu veriyoruz. 
          Böylece yorum yapılınca sayfa otomatik güncellenir. */}
            <ProductReviews
                productId={id}
                reviews={reviews}
                onReviewAdded={fetchProductData}
            />

        </div>
    );
}

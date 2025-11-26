import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Yeni bileşenlerimizi çağırıyoruz
import ProductInfo from "../components/product/ProductInfo";
import ProductReviews from "../components/product/ProductReviews";
export default function ProductDetailPage() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);

    // Veri Çekme Fonksiyonu (Tekrar kullanılacağı için ayırdık)
    const fetchProductData = useCallback(async () => {
        try {
            const productRes = await axios.get(`http://localhost:8080/products/${id}`);
            setProduct(productRes.data.data);

            const reviewRes = await axios.get(`http://localhost:8080/products/${id}/reviews`);
            setReviews(reviewRes.data.reviews || []);
            setAverageRating(reviewRes.data.average_rating || 0);

            setLoading(false);
        } catch (error) {
            console.error("Veri hatası:", error);
            setLoading(false);
        }
    }, [id]);

    // Sayfa açılınca çalış
    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

    if (loading) return <h3 style={{ textAlign: "center", marginTop: "50px" }}>Ürün Yükleniyor...</h3>;
    if (!product) return <h3 style={{ textAlign: "center", marginTop: "50px" }}>Ürün Bulunamadı!</h3>;

    return (
        <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>

            {/* 1. Ürün Bilgisi Parçası */}
            <ProductInfo
                product={product}
                averageRating={averageRating}
                totalReviews={reviews.length}
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

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import renderStars from "../../helper/StarRatingHelper";

export default function ProductReviews({ productId, reviews, onReviewAdded }) {


    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const navigate = useNavigate();


    //helper fonksiyonu kullanmak için import eklenmeli

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.post(`http://localhost:8080/products/${productId}/reviews`,
                { rating: parseInt(newRating), comment: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Yorumunuz başarıyla eklendi!");
            setNewComment("");
            setNewRating(5);
            onReviewAdded(); // Yorum eklendikten sonra üst bileşene bildirim gönder
            if (onReviewAdded) onReviewAdded();
        }

        catch (error) {
            console.error("Yorum eklenirken hata oluştu:", error);
            alert("Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
    }

    return (
        <div>
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>📝 Yorumlar</h3>

            {/* --- FORM KISMI --- */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", marginBottom: "30px" }}>
                <h4>Yorum Yap</h4>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ marginRight: "10px" }}>Puanınız:</label>
                        <select value={newRating} onChange={(e) => setNewRating(e.target.value)}>
                            <option value="5">5 - Mükemmel</option>
                            <option value="4">4 - Çok İyi</option>
                            <option value="3">3 - Orta</option>
                            <option value="2">2 - Kötü</option>
                            <option value="1">1 - Çok Kötü</option>
                        </select>
                    </div>
                    <textarea
                        placeholder="Bu ürün hakkında ne düşünüyorsunuz?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{ width: "100%", height: "80px", marginBottom: "10px", resize: "vertical" }}
                        required
                    />
                    <button type="submit" style={{ backgroundColor: "#007bff", color: "white", padding: "10px 25px", border: "none", borderRadius: "5px" }}>
                        Gönder
                    </button>
                </form>
            </div>

            {/* --- LİSTE KISMI --- */}
            {reviews.length === 0 ? (
                <p style={{ color: "#777", fontStyle: "italic" }}>Henüz yorum yapılmamış.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {reviews.map((review) => (

                        <div key={review.id} style={{ background: "white", padding: "15px", borderRadius: "8px", border: "1px solid #eee" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                <strong>{review.user?.full_name || "Kullanıcı"}</strong>
                                <small style={{ color: "#999" }}>{new Date(review.created_at).toLocaleDateString()}</small>
                            </div>
                            <div style={{ marginBottom: "5px" }}>{renderStars(review.rating)}</div>
                            <p style={{ margin: 0, color: "#444" }}>{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );


}
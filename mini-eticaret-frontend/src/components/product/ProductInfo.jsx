
import renderStars from "../../helper/StarRatingHelper";

export default function ProductInfo({ product, averageRating, totalReviews }) {

    return (
        <div style={{ display: "flex", gap: "20px", marginBottom: "40px", padding: "20px", background: "white", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
            <img
                src={product.image_url ? `http://localhost:8080${product.image_url}` : "https://via.placeholder.com/300"}
                alt={product.name}
                style={{ width: "300px", height: "300px", objectFit: "cover", borderRadius: "10px" }}
            />

            <div>
                <h1>{product.name}</h1>
                <h2 style={{ color: "#28a745", fontSize: "28px", margin: "10px 0" }}>{product.price} TL</h2>
                <p style={{ lineHeight: "1.6", color: "#555" }}>{product.description}</p>

                <div style={{ marginTop: "20px", padding: "10px", background: "#f8f9fa", borderRadius: "8px", display: "inline-block" }}>
                    <strong>Stok Durumu: </strong>
                    <span style={{ color: product.stock_quantity > 0 ? "green" : "red" }}>
                        {product.stock_quantity > 0 ? `${product.stock_quantity} Adet` : "Tükendi"}
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px" }}>
                    <div style={{ fontSize: "30px", fontWeight: "bold", color: "#333" }}>{averageRating.toFixed(1)}</div>
                    <div>{renderStars(Math.round(averageRating))}</div>
                    <div style={{ color: "#888" }}>({totalReviews} Değerlendirme)</div>
                </div>
            </div>
        </div>
    );
} 

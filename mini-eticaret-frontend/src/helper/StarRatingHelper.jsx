const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < rating ? "#ffd700" : "#ddd", fontSize: "20px" }}>
            ★
        </span>
    ));
};

export default renderStars;
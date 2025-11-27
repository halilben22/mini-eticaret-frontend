export default function Button({ children, onClick, variant = "primary", className = "", ...props }) {
    // Ortak stiller (Yuvarlatılmış köşe, font, geçiş efekti)
    const baseStyle = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center gap-2";

    // Renk varyasyonları (Temamızdan gelen renkler)
    const variants = {
        primary: "bg-ecommerce-accent text-white hover:bg-orange-600 shadow-orange-200", // Satın Al / Sepete Ekle
        secondary: "bg-ecommerce-secondary text-white hover:bg-blue-600 shadow-blue-200", // Genel Butonlar
        outline: "border-2 border-ecommerce-primary text-ecommerce-primary hover:bg-ecommerce-primary hover:text-white", // Detay Butonu
        danger: "bg-red-500 text-white hover:bg-red-600", // Sil / Çıkış
        ghost: "text-gray-600 hover:bg-gray-100" // Arkaplansız butonlar
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
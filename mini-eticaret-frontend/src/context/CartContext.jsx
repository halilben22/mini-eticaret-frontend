import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";



//Bu dosya, sepet bilgisini ve "Sepeti Güncelle" fonksiyonunu tüm uygulamaya dağıtacak
// 1. Context'i yarat
const CartContext = createContext();

// 2. Provider Bileşeni (Veri Sağlayıcı)
export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    // Sepet sayısını backend'den çeken fonksiyon
    const fetchCartCount = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setCartCount(0);
            return;
        }

        try {
            const res = await axios.get("http://localhost:8080/cart", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const items = res.data.data.items || [];
            const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalQty);
        } catch (err) {
            setCartCount(0);
        }
    };

    // Uygulama ilk açıldığında çalışsın
    useEffect(() => {
        fetchCartCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, fetchCartCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

// 3. Kullanımı kolaylaştıran özel hook
export const useCart = () => useContext(CartContext);
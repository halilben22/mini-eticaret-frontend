import { Navigate } from "react-router-dom";

// Token Çözücü (Rol kontrolü için lazım)
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

// children: Korumaya çalıştığımız sayfa (Örn: <AdminDashboard />)
// adminOnly: Bu sayfa sadece adminler için mi? (true/false)
export default function ProtectedRoute({ children, adminOnly = false }) {

    const token = localStorage.getItem("token");

    // 1. KONTROL: Giriş yapmış mı?
    if (!token) {
        // Giriş yapmamışsa Login sayfasına yönlendir
        return <Navigate to="/login" replace />;
    }

    // 2. KONTROL: Admin yetkisi gerekiyor mu?
    if (adminOnly) {
        const decoded = parseJwt(token);
        const role = decoded?.role?.toLowerCase(); // 'admin' mi diye bak

        if (role !== "admin") {
            // Giriş yapmış ama Admin değilse Ana Sayfaya at
            return <Navigate to="/" replace />;
        }
    }

    // Her şey yolundaysa, istediği sayfayı göster
    return children;
}
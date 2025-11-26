import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; // Toast ekledik

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // Backend'e Kayıt İsteği
            await axios.post("http://localhost:8080/register", {
                full_name: fullName,
                email: email,
                password: password
            });

            toast.success("Kayıt Başarılı! Şimdi giriş yapabilirsin. 🎉");

            // Başarılı olursa Giriş Sayfasına at
            navigate("/login");

        } catch (error) {
            console.error("Kayıt hatası:", error);
            // Backend'den gelen hatayı göster (Örn: Email kullanımda)
            const errorMsg = error.response?.data?.error || "Kayıt olunamadı!";
            toast.error(errorMsg);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "30px", background: "white", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📝 Kayıt Ol</h2>

            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: "15px" }}>
                    <label>Ad Soyad:</label>
                    <input
                        type="text"
                        placeholder="Örn: Ahmet Yılmaz"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                        required
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="ornek@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                        required
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label>Şifre:</label>
                    <input
                        type="password"
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                        required
                    />
                </div>

                <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", fontSize: "16px" }}>
                    Kayıt Ol
                </button>
            </form>

            <p style={{ marginTop: "20px", textAlign: "center" }}>
                Zaten hesabın var mı? <Link to="/login" style={{ color: "#007bff" }}>Giriş Yap</Link>
            </p>
        </div>
    );
}
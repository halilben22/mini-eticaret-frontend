import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {

    const [stats, setStats] = useState({total_orders:0,total_revenue:0});
    const [orders,setOrders]=useState([])
    const [loading,setLoading]=useState(true)



    const navigate=useNavigate()

//Verileri çekme
    useEffect(()=>{

const fetchData=async()=>{
    const token=localStorage.getItem("token")
    if(!token){navigate("/login");return;}
try{
   //istatistikleri çek
   const statsRes=await axios.get("http://localhost:8080/admin/stats",{
  headers: { Authorization: `Bearer ${token}` }
   });
   console.log(statsRes.data)
   setStats(statsRes.data)


   //Siparişlerin hepsini çek

 const ordersRes = await axios.get("http://localhost:8080/admin/orders", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(ordersRes.data.data)
        setLoading(false)
}catch(err){
   console.error("Admin yetkisi yok veya hata:", err);
        alert("Bu sayfaya sadece Admin girebilir!");
        navigate("/"); 
}

};

fetchData();


    },[navigate]);


    // Durum Güncelleme Fonksiyonu
  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
        await axios.put(`http://localhost:8080/admin/orders/${orderId}`, 
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Sipariş #${orderId} durumu güncellendi: ${newStatus}`);
        // Listeyi yenilemek yerine manuel güncelleyelim (Performans için)
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
        alert("Güncelleme başarısız!");
    }
  };

  if (loading) return <h3>Panel Yükleniyor...</h3>;

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>👮‍♂️ Admin Paneli</h1>

      {/* İstatistik Kartları */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ flex: 1, padding: "20px", background: "#4b6cb7", color: "white", borderRadius: "10px", textAlign: "center" }}>
            <h3>Toplam Satış</h3>
            <h2>{stats.total_revenue} TL</h2>
        </div>
        <div style={{ flex: 1, padding: "20px", background: "#182848", color: "white", borderRadius: "10px", textAlign: "center" }}>
            <h3>Toplam Sipariş</h3>
            <h2>{stats.total_orders} Adet</h2>
        </div>
      </div>

      {/* Sipariş Yönetim Tablosu */}
      <h2>Sipariş Yönetimi</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
            <tr style={{ background: "#eee", textAlign: "left" }}>
                <th style={{ padding: "10px" }}>ID</th>
                <th>Müşteri ID</th>
                <th>Tutar</th>
                <th>Durum</th>
                <th>İşlem</th>
            </tr>
        </thead>
        <tbody>
            {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "10px" }}>#{order.id}</td>
                    <td>User-{order.user_id}</td>
                    <td>{order.total_amount} TL</td>
                    <td>
                        {/* Renkli Badge */}
                        <span style={{ 
                            padding: "5px 10px", borderRadius: "5px", fontWeight: "bold",
                            backgroundColor: order.status === 'paid' ? '#d4edda' : order.status === 'shipped' ? '#cce5ff' : '#fff3cd',
                            color: order.status === 'paid' ? '#155724' : order.status === 'shipped' ? '#004085' : '#856404'
                        }}>
                            {order.status}
                        </span>
                    </td>
                    <td>
                        {/* Dropdown ile Durum Değiştirme */}
                        <select 
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            style={{ padding: "5px" }}
                        >
                            <option value="waiting_payment">Ödeme Bekliyor</option>
                            <option value="paid">Ödendi</option>
                            <option value="shipped">Kargolandı 🚛</option>
                            <option value="delivered">Teslim Edildi ✅</option>
                            <option value="cancelled">İptal ❌</option>
                        </select>
                    </td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
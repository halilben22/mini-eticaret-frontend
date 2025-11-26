import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";



export default function LoginPage(){

const [email,setEmail]=useState();
const [password, setPassword] = useState("");
const [error, setError] = useState("");


const navigate=useNavigate();

const handleLogin=async(e)=>{
    e.preventDefault();
    setError("");


    try{
        const response=await axios.post("http://localhost:8080/login",{
            email:email,
            password:password
        });

const token=response.data.token;

//Tarayıcıya kaydet
//Artık tarayıcı kapansa bile kullanıcı giriş yapmış sayılacak
localStorage.setItem("token", token);

alert("Giriş başarılı!");
navigate("/");
    }

    catch(err){
        console.error("Login hatası:", err);
        setError("Giriş başarısız. Lütfen giriş bilgilerinizi kontrol edin.");
    }
};

return(
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Giriş Yap</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Şifre:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>

        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", cursor: "pointer" }}>
          Giriş Yap
        </button>
      </form>
    </div>
  );


}


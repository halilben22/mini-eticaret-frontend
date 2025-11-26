
import { BrowserRouter, Routes, Route,Link,useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";
import PaymentPage from "./pages/PaymentPage";
import OrdersPage from "./pages/OrdersPage";


function App() {
return(  
  <BrowserRouter>
<Navbar />
  <Routes>
  <Route path="/" element={<HomePage/>}/>
  <Route path="/login" element={<LoginPage/>}/>
<Route path="/cart" element={<CartPage />} />
<Route path="/payment" element={<PaymentPage />} />

<Route path="/orders" element={<OrdersPage />} />
  </Routes>
  </BrowserRouter>
  );
}
export default App;
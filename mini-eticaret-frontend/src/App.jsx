
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";


function App() {
return(
  <BrowserRouter>
  <h1 style={{color: 'red'}}>REACT ÇALIŞIYOR MU?</h1>
  <Routes>
  <Route path="/" element={<HomePage/>}/>

    {/* İleride eklenecekler: */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
  </Routes>
  </BrowserRouter>
  );
}
export default App;
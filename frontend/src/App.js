import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./page/login";
import Register from "./page/register";
import Home from "./page/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-page" element={<LoginForm />} />
        <Route path="/register-page" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

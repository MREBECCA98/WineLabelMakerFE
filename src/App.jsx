import "./App.css";
import MyNavbar from "./components/MyNavbar.jsx";
import MyHome from "./pages/MyHome.jsx";
import MyWork from "./pages/MyWork.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyFooter from "./components/MyFooter.jsx";
import {} from "react-bootstrap-icons";
import { Route, Routes } from "react-router-dom";
// path home: /,
// path i nostri lavori: work,
// path login: login
// path register: register

function App() {
  return (
    <div className="app-wrapper">
      <MyNavbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<MyHome />} />
          <Route path="/work" element={<MyWork />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <MyFooter />
    </div>
  );
}

export default App;

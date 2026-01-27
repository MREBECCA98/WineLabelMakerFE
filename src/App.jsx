import "./App.css";
import MyNavbar from "./components/MyNavbar.jsx";
import MyHome from "./pages/Public/MyHome.jsx";
import MyWork from "./pages/Public/MyWork.jsx";
import Login from "./pages/Public/Login.jsx";
import Register from "./pages/Public/Register.jsx";
import MyFooter from "./components/MyFooter.jsx";
import {} from "react-bootstrap-icons";
import { Route, Routes } from "react-router-dom";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import UserPage from "./pages/Client/UserPage.jsx";
//path home: /,
//path i nostri lavori: work,
//path login: login
//path register: register
//path adminPage: adminPage
//path userPage: userPage

function App() {
  return (
    <div className="app-wrapper">
      <main className="content">
        <Routes>
          <Route path="/" element={<MyHome />} />
          <Route path="/work" element={<MyWork />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/userPage" element={<UserPage />} />
        </Routes>
      </main>
      <MyFooter />
    </div>
  );
}

export default App;

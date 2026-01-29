import "./App.css";
import MyHome from "./pages/Public/MyHome.jsx";
import MyWork from "./pages/Public/MyWork.jsx";
import Login from "./pages/Public/Login.jsx";
import Register from "./pages/Public/Register.jsx";
import MyFooter from "./components/MyFooter.jsx";
import {} from "react-bootstrap-icons";
import { Route, Routes } from "react-router-dom";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import UserWineLabel from "./pages/Client/UserWineLabel.jsx";
import UserRequest from "./pages/Client/UserRequest.jsx";
//path home: /,
//path i nostri lavori: work,
//path login: login
//path register: register
//path adminPage: message
//path userWineLabel: wineLabel
//path userRequest: userRequest

function App() {
  return (
    <div className="app-wrapper">
      <main className="content">
        <Routes>
          <Route path="/" element={<MyHome />} />
          <Route path="/work" element={<MyWork />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/message" element={<AdminPage />} />
          <Route path="/wineLabel" element={<UserWineLabel />} />
          <Route path="/userRequest" element={<UserRequest />} />
        </Routes>
      </main>
      <MyFooter />
    </div>
  );
}

export default App;

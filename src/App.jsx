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
import UserRequestMade from "./pages/Client/UserRequestMade.jsx";
import UpdateRequest from "./pages/Client/UpdateRequest.jsx";
import AdminRequestUser from "./pages/Admin/AdminRequestUser.jsx";
//path home: /,
//path i nostri lavori: work,
//path login: login
//path register: register
//path adminPage: message
//path userWineLabel: wineLabel
//path userRequest: userRequest
//path UserRequestMade: userRequestMade
//path UpdateRequest: updateRequest
//path AdminRequestUser: adminRequestUser
function App() {
  return (
    <div className="app-wrapper">
      <main className="content">
        <Routes>
          <Route path="/" element={<MyHome />} />
          <Route path="/work" element={<MyWork />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wineLabel" element={<UserWineLabel />} />
          <Route path="/userRequest" element={<UserRequest />} />
          <Route path="/userRequestMade" element={<UserRequestMade />} />
          <Route path="/updateRequest/:id" element={<UpdateRequest />} />
          <Route path="/adminRequestUser/:email" element={<AdminRequestUser />} />
          <Route path="/message" element={<AdminPage />} />
        </Routes>
      </main>
      <MyFooter />
    </div>
  );
}

export default App;

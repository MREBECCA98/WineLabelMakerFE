import "./App.css";
import { Route, Routes } from "react-router-dom";
import MyHome from "./pages/Public/MyHome.jsx";
import MyWork from "./pages/Public/MyWork.jsx";
import Login from "./pages/Public/Login.jsx";
import Register from "./pages/Public/Register.jsx";
import MyFooter from "./components/MyFooter.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import UserRequest from "./pages/Client/UserRequest.jsx";
import UserRequestMade from "./pages/Client/UserRequestMade.jsx";
import UpdateRequest from "./pages/Client/UpdateRequest.jsx";
import AdminRequestUser from "./pages/Admin/AdminRequestUser.jsx";

//Root component of the application
//Handles client-side routing using React Router
//The footer is persistent and rendered outside the Routes, so it is displayed on every page

function App() {
  return (
    <div className="app-wrapper">
      <main className="content">
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<MyHome />} />
          <Route path="/work" element={<MyWork />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* USER */}
          <Route path="/userRequest" element={<UserRequest />} />
          <Route path="/userRequestMade" element={<UserRequestMade />} />
          <Route path="/updateRequest/:id" element={<UpdateRequest />} />

          {/* ADMIN */}
          <Route path="/adminRequestUser/:email" element={<AdminRequestUser />} />
          <Route path="/message" element={<AdminPage />} />
        </Routes>
      </main>

      {/* COMPONENTS */}
      <MyFooter />
    </div>
  );
}

export default App;

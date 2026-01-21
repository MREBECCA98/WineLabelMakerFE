import "./App.css";
import MyNavbar from "./components/MyNavbar.jsx";
import MyHome from "./pages/MyHome.jsx";
import MyFooter from "./components/MyFooter.jsx";
import {} from "react-bootstrap-icons";
// path home: home,
// path i nostri lavori: work,
// path login: login
// path register: register

function App() {
  return (
    <div className="app-wrapper">
      <MyNavbar />
      <main className="content">
        <MyHome />
      </main>
      <MyFooter />
    </div>
  );
}

export default App;

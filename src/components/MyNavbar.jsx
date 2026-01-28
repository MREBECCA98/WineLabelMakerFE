import { Navbar, Container, Nav, Button } from "react-bootstrap";
import Logo from "../assets/logoRed4.png";
import { People, BoxArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";

function MyNavbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  // const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="bg-navbar sticky-top">
      <Container>
        {/* LOGO & HOME */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={Logo} alt="LogoWLM" width={270} />
          <span className="bubbler-one-regular d-none d-sm-inline fs-1  ">Wine Label Maker</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* I NOSTRI LAVORI */}
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/work" className="d-flex align-items-center bubbler-one-regular fs-3 text-black" style={{ fontSize: "24px" }}>
              I nostri lavori
            </Nav.Link>

            {/*LOGIN & LOGOUT*/}
            {!token ? (
              <Nav.Link as={Link} to="/login" className="d-flex align-items-center ms-4">
                <People size={30} />
              </Nav.Link>
            ) : (
              <Button variant="white" className="ms-4 p-0 m-0" onClick={handleLogout} style={{ width: "30px" }}>
                <BoxArrowLeft size={30} />
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;

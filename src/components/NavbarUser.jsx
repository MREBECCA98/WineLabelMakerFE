import { Navbar, Container, Nav, Button } from "react-bootstrap";
import Logo from "../assets/logoRed4.png";
import { BoxArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";

function NavbarUser() {
  const navigate = useNavigate();

  //LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="bg-navbar sticky-top">
      <Container>
        {/* LOGO & ETICHETTE PERSONALIZZATE */}
        <Navbar.Brand className="d-flex align-items-center">
          <img src={Logo} alt="LogoWLM" width={270} />
          <span className="bubbler-one-regular d-none d-md-inline fs-1 ">Custom Wine Label</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/*RICHIESTE  */}
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/userRequestMade" className="d-flex align-items-center bubbler-one-regular fs-3 text-black" style={{ fontSize: "24px" }}>
              Racconta il tuo vino
            </Nav.Link>

            {/*LOGOUT*/}
            <Button variant="white" className="ms-4 p-0 m-0" onClick={handleLogout} style={{ width: "30px" }}>
              <BoxArrowLeft size={30} />
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default NavbarUser;

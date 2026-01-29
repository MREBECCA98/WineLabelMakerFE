import { Navbar, Container, Nav, Button } from "react-bootstrap";
import Logo from "../assets/logoRed4.png";
import { People, BoxArrowLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function MyNavbar() {
  return (
    <Navbar expand="lg" className="bg-navbar sticky-top">
      <Container>
        {/* LOGO & HOME */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={Logo} alt="LogoWLM" width={270} />
          <span
            className="bubbler-one-regular d-none d-md-inline fs-1 
            "
          >
            Wine Label Maker
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* I NOSTRI LAVORI */}
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/work" className="d-flex align-items-center bubbler-one-regular fs-3 text-black" style={{ fontSize: "24px" }}>
              I nostri lavori
            </Nav.Link>

            {/*LOGIN & LOGOUT*/}
            <Nav.Link as={Link} to="/login" className="d-flex align-items-center ms-4">
              <People size={30} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;

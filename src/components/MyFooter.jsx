import { Container, Row, Col } from "react-bootstrap";
import { Facebook, Instagram, Linkedin } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-footer py-4 mt-5">
      <Container>
        <Row>
          {/* CONTATTI */}
          <Col md={4} className="text-center mb-4 mb-md-0">
            <h5 className="mb-4 bubbler-one-regular border-bottom border-white fs-4">Contatti</h5>

            <div>
              <p className="text-decoration mb-1  fw-semibold fs-5">Junior Web Developer</p>
              <p className="mb-0">Email: reb.matarozzo@gmail.com</p>
              <p>Telefono: +39 348 800 3680</p>
            </div>
            <div>
              <p className="text-decoration mb-1  fw-semibold fs-5">Wine Label Illustrator</p>
              <p className="mb-0">Email: deluca.giovanna0691.com</p>
              <p>Telefono: +39 389 090 6175</p>
            </div>
          </Col>

          {/* SEGUICI */}
          <Col md={4} className="text-center  mb-4 mb-md-0">
            <h5 className="mb-4 bubbler-one-regular border-bottom border-white fs-4">Seguici</h5>
            <div className="d-flex flex-column align-items-center gap-2">
              {/* Linkedin */}
              <Linkedin size={25} className="mb-3" />
              <p>
                Junior Web Developer: <span className="fw-semibold fs-5 ">Rebecca Matarozzo</span>
              </p>

              <p>
                Illustrator: <span className="fw-semibold fs-5">Giovanna De Luca</span>
              </p>
            </div>
          </Col>

          {/* LINK UTILI */}
          <Col md={4} className="text-center">
            <h5 className="mb-4 bubbler-one-regular border-bottom border-white fs-4">Link utili</h5>
            <p>
              <Link to="/work" className="text-white text-decoration-none fs-5">
                I nostri lavori
              </Link>
            </p>
            <p>
              <Link to="/register" className="text-white text-decoration-none fs-5">
                Registrati
              </Link>
            </p>
          </Col>
        </Row>
        <hr />
        <p className="text-center mb-0">&copy; 2026 Wine Label Maker. Tutti i diritti riservati.</p>
      </Container>
    </footer>
  );
}

export default Footer;

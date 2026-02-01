import { Container, Row, Col } from "react-bootstrap";
import { Facebook, Instagram, Linkedin } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function FooterUser() {
  return (
    <footer className="bg-footer py-4 mt-5">
      <Container>
        <Row>
          {/* CONTATTI */}
          <Col md={4} className="text-center mb-4 mb-md-0">
            <h5 className="mb-4 bubbler-one-regular border-bottom border-white fs-4">Contatti</h5>
            <div>
              <p className="text-decoration mb-1  fw-semibold">Wine Label Maker</p>
              <p className="mb-0">Email: WineLabelMaker@gmail.com</p>
              <p>Telefono: +39 123 456 789</p>
            </div>
            <div>
              <p className="text-decoration mb-1  fw-semibold">Junior Web Developer</p>
              <p className="mb-0">Email: reb.matarozzo@gmail.com</p>
              <p>Telefono: +39 348 800 3680</p>
            </div>
            <div>
              <p className="text-decoration mb-1  fw-semibold">Wine Label Illustrator</p>
              <p className="mb-0">Email: deluca.giovanna0691.com</p>
              <p>Telefono: +39 389 090 6175</p>
            </div>
          </Col>
        </Row>
        <hr />
        <p className="text-center mb-0">&copy; 2026 Wine Label Maker. Tutti i diritti riservati.</p>
      </Container>
    </footer>
  );
}

export default FooterUser;

import { Col, Container, Row } from "react-bootstrap";
import SideNavbar from "../components/SideNavbar";

function MyHome() {
  return (
    <Container className="py-5">
      <Row>
        {/* SIDEBAR LATERALE */}
        <Col xs={12} md={3}>
          <SideNavbar />
        </Col>

        {/* HOME */}
        <Col xs={12} md={9}>
          <section id="intro">
            <p className="bubbler-one-regular text-center mb-0" style={{ fontSize: "1.5rem" }}>
              Benvenuto in
            </p>
            <h1 className="bubbler-one-regular text-center fw-semibold ">Wine Label Maker</h1>
            <p>Scopri come creare etichette di vino personalizzate e uniche.</p>
          </section>

          <section id="chi-siamo" className="py-5 bg-light">
            <h2>Chi siamo</h2>
            <p>Siamo un team appassionato di vino e design.</p>
          </section>

          <section id="contatti" className="py-5">
            <h2>Contatti</h2>
            <p>Email: WineLabelMaker@gmail.com</p>
            <p>Telefono: +39 123 456 789</p>
          </section>
        </Col>
      </Row>
    </Container>
  );
}

export default MyHome;

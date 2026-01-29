import { Col, Container, Row } from "react-bootstrap";
import SideNavbar from "../../components/SideNavbar";
import MyNavbar from "../../components/MyNavbar";

function MyHome() {
  return (
    <>
      <MyNavbar />
      <Container className="py-4">
        <Row>
          {/* SIDEBAR LATERALE */}
          <Col md={3}>
            <SideNavbar />
          </Col>

          {/* HOME */}
          <Col xs={12} md={9}>
            <section id="intro">
              <div className="text-center">
                <h1 className="bubbler-one-regular d-md-none   ">Wine Label Maker</h1>
              </div>
            </section>

            <section id="chi-siamo" className="py-5 ">
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
    </>
  );
}

export default MyHome;

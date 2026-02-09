import { Col, Container, Row } from "react-bootstrap";
import MyNavbar from "../../components/MyNavbar";
import AEQUUS from "../../assets/AEQUUS.png";
import EQUILIBRIUM from "../../assets/EQUILIBRIUM.png";
import ESSENZA from "../../assets/ESSENZA.png";
import LUNAROSSA from "../../assets/LUNA-ROSSA.png";
import NOCTIS from "../../assets/NOCTIS-RUBRUM.png";
import THLEIA from "../../assets/THLEIA.png";

function Work() {
  return (
    <>
      <MyNavbar />
      <Container className="py-4  bubbler-one-regular">
        <h1 className="text-center mt-4  bubbler-one-regular fw-bold fs-1 ">I NOSTRI LAVORI</h1>
        <h4 className="fw-bold text-center bubbler-one-regular fs-4">STORIE CHE HANNO PRESO FORMA, PARTENDO DALLE PAROLE DI CHI IL VINO LO VIVE OGNI GIORNO</h4>

        {/* ETICHETTA 1 */}
        <Row className="mt-5">
          <Col xs={12} md={12} lg={6}>
            <img src={AEQUUS} alt="aequus" style={{ width: "100%" }} className="mb-4 mb-lg-0" />
          </Col>
          <Col xs={12} md={12} lg={6}>
            <p className="fw-bold ">LINEA CONTINUA - Aequus (Langhe DOC Nebbiolo 2022) </p>
            <p>
              Un Nebbiolo contemporaneo, essenziale e misurato che unisce eleganza e profondità.
              <br />
              Ogni dettaglio, dalla vinificazione alla presentazione, riflette equilibrio e precisione.
              <br />
              L'etichetta ispirata all'arte contemporanea, trasmette calma e armonia, invitando chi lo osserva a lasciarsi guidare dal carattere misurato del
              vino stesso.
            </p>
          </Col>
        </Row>

        {/* ETICHETTA 2 */}
        <Row className="mt-5">
          <Col xs={12} md={12} lg={6}>
            <img src={EQUILIBRIUM} alt="aequus" style={{ width: "100%" }} className="mb-4 mb-lg-0" />
          </Col>
          <Col xs={12} md={12} lg={6}>
            <p className="fw-bold ">MANO FERMA - Equilibrium Rosè (Toscana IGT Rosè 2023) </p>
            <p>
              Un rosè vibrante e raffinato, dove equilibrio e spontaneità si incontrano ad ogno sorso.
              <br />
              Fresco, elegante e leggermente ironico, accompagna aperitivi raffinati, pranzi estivi, e momenti di pura leggerezza.
              <br />
              L'etichetta minimale, esprime il gesto della mano e il movimento del liquido, invitando a scoprire un vino che conquista senza mai urtare, leggero
              ma intenso
            </p>
          </Col>
        </Row>

        {/* ETICHETTA 5 */}
        <Row className="mt-5">
          <Col xs={12} md={12} lg={6}>
            <img src={THLEIA} alt="aequus" style={{ width: "100%" }} className="mb-4 mb-lg-0" />
          </Col>
          <Col xs={12} md={12} lg={6}>
            <p className="fw-bold "> MAISON FUORIMISURA - Θάλεια – THALEIA (Champagne AOC 2018) </p>
            <p>
              Uno Champagne raffinato e audace, dove eleganza e intensità si incontrano in ogni bollicina.
              <br />
              Il perlage fine e persistente accompagna aromi di pesca bianca, crosta di pane e mandorla tostata.
              <br />
              L'etichetta con figura femminile stilizzata e sfumatura oro-rosa, esprime raffinatezza e movimento, invitando a vivere un'esperienza sensoriale
              indimenticabile. Θάλεια conquista per precisione, sensualità e carattere
            </p>
          </Col>
        </Row>

        {/* ETICHETTA 3 */}
        <Row className="mt-5">
          <Col xs={12} md={12} lg={6}>
            <img src={ESSENZA} alt="aequus" style={{ width: "100%" }} className="mb-4 mb-lg-0" />
          </Col>
          <Col xs={12} md={12} lg={6}>
            <p className="fw-bold "> TENUTA SAN LORENZO - Essenza ( IGT Toscana 2022) </p>
            <p>
              Un Sangiovese con un tocco di Canaiolo, intenso e avvolgente, che celebra la passione e l'abbondanza della Toscana.
              <br />
              L'etichetta, impreziosita dal melograno, riflette eleganza e mistero, invitando a scoprire un vino morbido ma deciso, perfetto per momenti
              conviviali o cene importanti.
              <br />
              Essenza è tradizione, natura e carattere in ogni sorso
            </p>
          </Col>
        </Row>

        {/* ETICHETTA 4 */}
        <Row className="mt-5">
          <Col xs={12} md={12} lg={6}>
            <img src={NOCTIS} alt="aequus" style={{ width: "100%" }} className="mb-4 mb-lg-0" />
          </Col>
          <Col xs={12} md={12} lg={6}>
            <p className="fw-bold "> CANTINA SAN MICHELE - Noctis Rubrum (DOC Barbera d'Alba 2021) </p>
            <p>
              UN Barbera elegante e avvolgente, dal carattere deciso e raffinato.
              <br />
              Profondo e seducente, evoca il mistero della notte con note di ciliegia matura e spezie dolci.
              <br />
              L'etichetta, con il grappolo d'uva su sfondo scuro, cattura immediatamento lo sguardo e invita a scoprire un vino strutturato e intenso, perfetto
              per cene eleganti e degustazioni raffinate.
            </p>
          </Col>
        </Row>

        {/* ETICHETTA 5 */}
        <Row className="mt-5">
          <Col xs={12} md={12} lg={6}>
            <img src={LUNAROSSA} alt="aequus" style={{ width: "100%" }} className="mb-4 mb-lg-0" />
          </Col>
          <Col xs={12} md={12} lg={6}>
            <p className="fw-bold "> CANTINA DELLE VIGNE DORATE - Luna Rossa (DOC Valpolicella Classico 2023) </p>
            <p>
              Rosso vivace e armonico, che unisce freschezza fruttata e una sottile spezia.
              <br />
              Ispirato alla forza e grazia femminile, il vino sprigiona energia e fascino in ogni sorso.
              <br />
              L'etichetta, con la figura capovolta della donna in rosso, riflette personalità vibrante, ideale per aperitivi e cene leggere.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default Work;

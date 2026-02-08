import { Col, Container, Row } from "react-bootstrap";
import SideNavbar from "../../components/SideNavbar";
import MyNavbar from "../../components/MyNavbar";
import Donna from "../../assets/donna.png";
import { Link } from "react-router-dom";

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
            <section>
              <div className="text-center">
                <h1 className="bubbler-one-regular d-md-none ">Wine Label Maker</h1>
              </div>
            </section>
            {/* LA NOSTRA STORIA */}
            <section id="chi-siamo" className="pb-5 bubbler-one-regular text-center mt-4 text-black">
              <div>
                <img src={Donna} alt="" style={{ width: "70%" }} />
              </div>

              <h2 className="text-center mt-4  bubbler-one-regular fw-bold fs-1 ">LA NOSTRA STORIA</h2>
              <h4 className="fw-bold">DA PERCORSI DIVERSI NASCE LA STESSA PASSIONE</h4>

              <p className="fs-4 mt-5 ">
                Wine Label Maker nasce dall’incontro di due vite che, per un periodo, non sembravano più appartenersi.
                <br /> Non ci siamo mai dimenticate da dove siamo partite: io responsabile di sala, lei chef, due donne cresciute nel ritmo serrato della
                ristorazione, in ruoli che a un certo punto hanno iniziato a stare stretti.
              </p>
              <p className="fs-4 ">
                Ogni giorno era una prova di resistenza, una lotta silenziosa per farsi ascoltare, per affermare il proprio valore in un mondo che spesso chiede
                forza senza concedere spazio.
                <br /> Da lì è nato il desiderio di cambiare. Non una fuga, ma un atto di coraggio: scegliere strade diverse senza rinnegare ciò che eravamo
                state, perché ogni esperienza, anche la più dura, lascia radici profonde.
              </p>
              <p className="fs-4 ">
                A volte le strade si separano, ma il destino sa come riunirle.
                <br />È successo davanti a un calice di vino. Tra risate, racconti e ricordi di una vita che credevamo passata, ma che continuava a pulsare
                dentro di noi.
              </p>
              <p className="fs-4">
                Il mio sguardo, intanto, tornava sempre lì: alle bottiglie di vino appese al soffitto, come stelle sospese nel cielo. Ognuna racchiudeva mesi,
                anni di lavoro, di attese, di mani sporche di terra e di pazienza.
                <br />
                Eppure le etichette, troppo spesso, erano silenziose: semplici, anonime, incapaci di raccontare la storia che proteggevano.
              </p>
              <p className="fs-4">
                È stato in quel momento che ho capito una cosa: dietro ogni vino c’è un percorso fatto di sacrifici, scelte difficili e passione assoluta. E un
                lavoro così profondo merita di essere raccontato, visto, riconosciuto.
              </p>
              <p className="fs-4">
                Mentre ascoltavo il suo cambiamento, pensavo anche al mio. Ero bloccata, senza direzione, travolta dall’ansia davanti al progetto finale del
                corso di Full Stack. Poi l’idea è arrivata, senza forzarla. Unire di nuovo le nostre forze, come avevamo sempre fatto.
              </p>

              <p className="fs-4">
                Io avevo bisogno di costruire. Lei di dare forma alla propria visione. <br /> Così è nata Wine Label Maker: un progetto fatto di passione,
                collaborazione e desiderio di dare voce a ciò che troppo spesso resta invisibile. Ogni etichetta racconta una storia, ogni dettaglio prende
                vita, e insieme il vino e la creatività diventano un racconto unico, degno di essere vissuto e condiviso.
              </p>
            </section>

            {/* IL TUO VINO, LA TUA IDENTITA' */}
            <section id="per-chi-è" className="pb-5 bubbler-one-regular text-center mt-4 text-black ">
              <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">IL VINO, LA TUA IDENTITA'</h2>
              <h4 className="fw-bold">PER CHI CREDE CHE OGNI BOTTIGLIA POSSA TRASMETTERE UNA STORIA</h4>

              <p className="fs-4 mt-5 ">
                Wine Label Maker è per chi al proprio vino tiene davvero.
                <br /> Per chi conosce il valore di ciò che produce e sente il bisogno di raccontarlo, senza compromessi.
                <br />
                Non è un servizio pensato per tutti, perché ogni vino ha una storia che non può essere adattata a uno schema già esistente.
              </p>

              <p className="fs-4">
                Partiamo dalle parole dei produttori: dalle loro descrizioni, dai ricordi, dalle scelte difficili, dai sogni che hanno accompagnato ogni
                vendemmia. Da lì nasce tutto...
                <br />
                Ogni etichetta è progettata su misura, costruita per dare forma visiva all’identità del vino, ai suoi colori, alla sua anima.
                <br />
                Nulla è casuale, nulla è replicabile.
              </p>

              <p className="fs-4">
                Crediamo che dietro ogni bottiglia ci siano mani, tempo, attese e passione assoluta.
                <br />
                Ed è proprio questo che vogliamo rendere visibile. Perché un vino così non ha bisogno di gridare per farsi notare: ha bisogno di essere
                raccontato nel modo giusto.
                <br /> Un’etichetta diventa il primo sguardo, il primo incontro, il primo passo per dare al tuo vino il valore che merita.
              </p>
            </section>

            {/* INIZIA IL VIAGGIO */}
            <section id="come iniziare" className="pb-5 bubbler-one-regular text-center mt-4 text-black ">
              <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">INIZIA IL VIAGGIO</h2>
              <h4 className="fw-bold">OGNI STORIA HA BISOGNO DEL SUO TEMPO... E QUESTO E' IL PRIMO PASSO</h4>

              <p className="fs-4 mt-5 ">
                Registrati e accedi alla tua area personale: da lì potrai inviarci la descrizione dettagliata del tuo vino.
                <br /> Non serve sapere come raccontarlo, ma solo essere sinceri.
                <br /> Ti guideremo passo dopo passo con tutte le indicazioni necessarie, già disponibili all’interno della piattaforma.
              </p>

              <p className="fs-4 ">
                Una volta inviata la richiesta, il viaggio continua insieme. <br />
                Ti terremo aggiornato su ogni fase del processo tramite email, così saprai sempre a che punto siamo. <br /> Allo stesso tempo, potrai seguire lo
                stato della tua etichetta direttamente dalla tua pagina personale, in modo semplice e trasparente.
              </p>

              <p className="fs-4 fw-bold">
                Da quel momento in poi, il tuo vino smette di essere solo un prodotto.
                <br />
                Inizia a diventare un racconto.
              </p>
              <p className="fs-4 mt-5 text-center">
                Non hai ancora un account? <br />
                <Link to="/register" className="text-black text-decoration-none fw-bold">
                  Inizia il tuo viaggio
                </Link>
              </p>
            </section>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MyHome;

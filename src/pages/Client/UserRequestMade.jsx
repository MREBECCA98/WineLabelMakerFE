import { Alert, Button, Col, Container, Modal, Row, Table } from "react-bootstrap";
import NavbarUser from "../../components/NavbarUser";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { JournalText, PencilSquare, Trash3 } from "react-bootstrap-icons";

//USER REQUEST MADE E' LA PAGINA PER L'UTENTE DOVE POTRA' VEDERE LO STORICO E LO STATO DELLE SUE RICHIESTE
//E' LA PRIMA PAGINA DOPO IL LOGIN CHE L'UTENTE VISUALIZZA
//SE NON SONO ANCORA STATE CREATE RICHIESTE LA PAGINA MOSTRA UN LINK CHE PORTERA' ALLA PAGINA PER CREARE LA DESCRIZIONE DELL'ETICHETTA
//SE CI SONO RICHIESTE SI VISUALIZZA LA TABELLA CON :
//- DATA DI CREAZIONE
//- DESCRIZIONE PRODOTTO (MODALE)
//- STATO DELLA RICHIESTA:
// --> SE LO STATO E' IN ATTESA, QUINDI L'ADMIN NON HA ANCORA VISUALIZZATO LA DESCRIZIONE,
//L'UTENTE POTRA' MODIFICARNE IL TESTO O ELIMINARE LA RICHIESTA,
//ALTRIMENTI POTRA' VISUALIZZARE LO STATO DELLA SUA RICHIESTA SENZA POTER APPORTARE CAMBIAMENTI

//AD OGNI STATO SUCCESSIVO A "IN ATTESA" VERRA' INVIATA UNA MAIL ALL'UTENTE:
//-IN LAVORAZIONE (EMAIL DI DEFAULT) --> TESTO EMAIL: $"Gentile {request.User.Name} {request.User.Surname},\n\n"
//$"La sua richiesta con id: {request.IdRequest} per la nuova etichetta di vino è stata presa in carico. " +
//"La nostra illustratrice ha iniziato a lavorare sulla creazione dell’etichetta, seguendo le indicazioni da lei fornite.\n\n" +
//"A breve riceverà una seconda email con il preventivo per la realizzazione dell’etichetta.\n\n" +
//"Grazie per aver scelto Wine Label Maker."

//-PREVENTIVO INVIATO --> VERRA' INVIATA UN'EMAIL DALL'ADMIN CHE CONTERRA' IL PREVENTIVO IN BASE AL BUDGET DEFINITO DALL'UTENTE IN FASE DI RICHIESTA
//PAGAMENTO CONFERMATO (EMAIL DI DEFAULT) --> TESTO EMAIL: $"Gentile {request.User.Name} {request.User.Surname},\n\n" +
//$"Abbiamo ricevuto il pagamento relativo alla sua richiesta con id: {request.IdRequest} per la nuova etichetta di vino. " +
//"Il nostro team ha iniziato la lavorazione e procederà con la creazione dell’etichetta secondo le sue indicazioni.\n\n" +
//"A breve riceverà l’email con l’etichetta completata in allegato.\n\n" +
//"Grazie per aver scelto Wine Label Maker."

//-COMPLETATA --> VERRA' INVIATA UN'EMAIL DALL'ADMIN DOVE POTRA' SCEGLIERE SE INVIARE IL TESTO DI DEFAULT PREIMPOSTATO,
//O SCRIVERE UN TESTO PERSONALIZZATO IN BASE ALLA RICHIESTA DELL'UTENTE,
//ALLEGANDO L'IMMAGINE DELL'ETICHETTA PERSONALIZZATA

//-RIFIUTATA (EMAIL DI DEFAULT) --> TESTO EMAIL: $"Gentile {request.User.Name} {request.User.Surname},\n\n" +
//$"Siamo spiacenti di informarla che la sua richiesta con id: {request.IdRequest} per la nuova etichetta di vino non può essere completata. " +
//"Se desidera ulteriori dettagli o assistenza, non esiti a contattarci.\n\n" +
//"Ci auguriamo di poterla aiutare con altre richieste in futuro.\n\n" +
//"Grazie per aver scelto Wine Label Maker.",

function UserRequestMade() {
  const [requests, setRequests] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  //MODALE DESCRIZIONE ETICHETTA
  const [modal, setModal] = useState(false);
  const [modalRequest, setModalRequest] = useState(null);

  //SCADENZA TOKEN
  const navigate = useNavigate();
  const [messageToken, setMessageToken] = useState();

  //DELETE SE LO STATO E' IN ATTESA
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`https://localhost:7046/api/Request/deleteRequest/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        //SCADENZA TOKEN
        if (response.status == 401) {
          localStorage.removeItem("token");
          setMessageToken("Sessione scaduta. Effettua di nuovo il login");
          setTimeout(() => {
            setMessageToken("");
            navigate("/login");
          }, 4000);
          return;
        }
        throw new Error("Errore durante l'eliminazione!");
      }
      setRequests((allRequest) => allRequest.filter((deleteRequest) => deleteRequest.idRequest !== id));
      setSuccess("Descrizione del prodotto eliminata con successo!");
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  //TUTTE LE RICHIESTE DELL'UTENETE (L'UTENTE PUO' VISUALIZZARE SOLO LE SUE RICHIESTE)
  useEffect(() => {
    const allRequests = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("https://localhost:7046/api/Request/allRequest", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (!response.ok) {
          //SCADENZA TOKEN
          if (response.status == 401) {
            localStorage.removeItem("token");
            setMessageToken("Sessione scaduta. Effettua di nuovo il login");
            setTimeout(() => {
              setMessageToken("");
              navigate("/login");
            }, 4000);
            return;
          }
          throw new Error("Errore nel recupero delle richieste!");
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        setError(error.message);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    };

    allRequests();
  }, []);

  return (
    <>
      {/* NAVBAR PER LE PAGINE DELL'UTENTE */}
      <NavbarUser />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={12} lg={12}>
            {/* RICHIESTE EFFETTUATE */}
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">LE STORIE DEI TUOI VINI... </h2>
            <p className="mt-3 mb-0 text-center bubbler-one-regular fs-sm-5 fs-3 ">Racconta i tuoi vini e segui le loro storie</p>
            <p className="text-center bubbler-one-regular fs-sm-5 fs-3 ">In questa pagina troverai tutte le descrizioni inviate e il loro progresso</p>

            {/* SCADENZA TOKEN */}
            {messageToken && (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                {messageToken}
              </Alert>
            )}

            {/* ALERT SUCCESS */}
            {success && (
              <Alert variant="success" className="bubbler-one-regular fs-5 fw-bold">
                {success}
              </Alert>
            )}

            {/* ALERT ERROR */}
            {error && (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                {error}
              </Alert>
            )}

            {/* PAGINA SENZA RICHIESTE */}
            {requests.length === 0 && (
              <>
                <Alert
                  style={{ height: "300px" }}
                  variant="light"
                  className="d-flex justify-content-center flex-column bubbler-one-regular fs-4 p-5 text-center mt-5 fw-bold border border-gray"
                >
                  IL TUO VINO ASPETTA DI ESSERE RACCONTATO...
                  <div>
                    <Link to="/userRequest" className="bubbler-one-regular fs-5 fw-bold text-decoration-none">
                      Clicca qui per dare vita alla sua storia !
                    </Link>
                  </div>
                </Alert>
              </>
            )}

            {/* SE CI SONO RICHIESTE */}
            {requests.length > 0 && (
              <>
                <Table responsive hover className="mt-4 bubbler-one-regular fs-4">
                  <thead className="text-center">
                    <tr>
                      <th>DATA DI CREAZIONE</th>
                      <th>DESCRIZIONE PRODOTTO</th>
                      <th>STATO DELLA RICHIESTA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((request) => (
                        <tr key={request.idRequest}>
                          <td className="text-center fs-4">{new Date(request.createdAt).toLocaleDateString()}</td>

                          {/* BOTTONE MODALE DESCRIZIONE */}
                          <td className="text-center">
                            <Button
                              onClick={() => {
                                setModalRequest(request);
                                setModal(true);
                              }}
                              className="text-black bg-white border border-white"
                            >
                              <JournalText className="fs-1" />
                            </Button>
                          </td>

                          {/* COLORE DEL TESTO IN BASE AL CAMBIO DELLO STATO */}
                          <td
                            className="text-center"
                            style={{
                              color:
                                request.status === "Completed"
                                  ? "green"
                                  : request.status === "Pending"
                                    ? "blue"
                                    : request.status === "InProgress"
                                      ? "orange"
                                      : request.status === "QuoteSent"
                                        ? "purple"
                                        : "red",
                            }}
                          >
                            {/* SE LO STATO E' COMPLETED --> TRADUZIONE IN ITALIANO  */}
                            {request.status === "Completed" ? (
                              "COMPLETATA"
                            ) : // SE LO STAO E' IN PENDING --> TRADUZIONE IN ITALIANO, BOTTONE MODIFICA E DELETE
                            request.status === "Pending" ? (
                              <div className="d-flex align-items-center flex-column">
                                <span>IN ATTESA</span>
                                <div className="d-flex gap-1">
                                  <Button as={Link} to={`/updateRequest/${request.idRequest}`} size="lg" variant="light">
                                    <PencilSquare />
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleDelete(request.idRequest);
                                    }}
                                    size="lg"
                                    variant="light"
                                  >
                                    <Trash3 />
                                  </Button>
                                </div>
                              </div>
                            ) : // SE LO STATO E' IN PROGRESS --> TRADUZIONE IN ITALIANO
                            request.status === "InProgress" ? (
                              "IN LAVORAZIONE"
                            ) : // SE LO STATO E' QUOT SENT --> TRADUZIONE IN ITALIANO
                            request.status === "QuoteSent" ? (
                              "PREVENTIVO INVIATO"
                            ) : // SE LO STATO E' PAYMENT CONFIRMED --> TRADUZIONE IN ITALIANO
                            request.status === "PaymentConfirmed" ? (
                              "PAGAMENTO CONFERMATO"
                            ) : (
                              // SE LO STATO E' REJECTED --> TRADUZIONE IN ITALIANO
                              "RIFIUTATA"
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>

                {/* MODALE DESCRIZIONE*/}
                <Modal show={modal} onHide={() => setModal(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title className="bubbler-one-regular text-black fw-bold">Descrizione prodotto</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <p className="fs-3 bubbler-one-regular text-black ">{modalRequest?.description}</p>
                  </Modal.Body>
                </Modal>

                {/* LINK PER POTER EFFETTUARE UNA NUOVA RICHIESTA */}
                <div className="text-center mt-5 bubbler-one-regular fw-bold">
                  <p className="fs-3 m-0">VUOI CONDIVIDERE LA STORIA DI UN NUOVO VINO?</p>
                  <Link to="/userRequest" className="text-decoration-none fs-3 ">
                    Clicca qui per procedere con la tua richiesta
                  </Link>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default UserRequestMade;

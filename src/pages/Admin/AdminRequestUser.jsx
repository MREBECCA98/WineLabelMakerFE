import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
import { Alert, Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { JournalText, PencilSquare } from "react-bootstrap-icons";

//ADMIN REQUEST USER E' LA PAGINA DOVE L'ADMIN PUO' VEDERE TUTTE LE RICHIESTE DI UN SINGOLO UTENTE
//E' COMPOSTA DA UNA TABELLA SUDDIVISA IN:
//-DATA DI CREAZIONE DELLA RICHIESTA
//-DESCRIZIONE PRODOTTO: MODALE PER VISUALIZZARE LA DESCRIZIONE E ID RICHIESTA
//-STATO DELLA RICHIESTA

//L'ADMIN PUO' MODIFICARE LO STATO DELLA RICHIESTA SOLO QUANDO E':
//- "IN ATTESA"
//-"IN LAVORAZIONE" --> AL SALVATAGGIO DELLO STATO VIENE INVIATA ALL'UTENTE UN'EMAIL DI DEFAULT
//-"PREVENTIVO INVIATO" --> AL CAMBIO DI STATO L'ADMIN INVIA UN'EMAIL PERSONALIZZATA IN BASE AL BUDGET DEL CLIENTE PER IL PREVENTIVO
//-"PAGAMENTO CONFERMATO" --> AL SALVATAGGIO DELLO STATO VIENE INVIATA ALL'UTENTE UN'EMAIL DI DEFAULT

//QUANDO SONO "COMPLETATE" O "RIFIUTATE" L'ADMIN NON HA PIU' LA POSSIBILITA' DI CAMBIARE LO STATO
//-"COMPLETATA" --> AL CAMBIO DI STATO L'ADMIN INVIA UN'EMAIL CON L'IMMAGINE DELL ETICHETTA ALLEGATA (REQUIRED)
// E PUO' SCEGLIERE SE UTILIZZARE IL BODY DI DEFAULT O SE PERSONALIZZARLO IN BASE ALLA RISPOSTA DELL'UTENTE

function AdminRequestUser() {
  const { email } = useParams();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  //MODALE DESCRIZIONE
  const [modalDescription, setModalDescription] = useState(false);
  const [modalDescriptionRequest, setModalDescriptionRequest] = useState(null);

  //MODALE STATO
  const [modalStatus, setModalStatus] = useState(false);
  const [modalStatusRequest, setModalStatusRequest] = useState("");
  const [newStatus, setNewStatus] = useState("");

  //EMAIL COMPLETED
  const [imgCompleted, setImgCompleted] = useState(null);
  const [bodyCompleted, setBodyCompleted] = useState("");
  const [successEmail, setSuccessEmail] = useState("");
  const [errorImg, setErrorImg] = useState("");

  //EMAIL PREVENTIVO
  const [bodyQuote, setBodyQuote] = useState("");
  const [successEmailQuote, setSuccessEmailQuote] = useState("");
  const [errorEmailQuote, setErrorEmailQuote] = useState("");

  const status = {
    Pending: 0,
    InProgress: 1,
    QuoteSent: 2,
    PaymentConfirmed: 3,
    Completed: 4,
    Rejected: 5,
  };

  //MODIFICA STATO, SE COMPLETED INVIA EMAIL CON ALLEGATO IMMAGINE ETICHETTA
  const handleActionStatus = async () => {
    const token = localStorage.getItem("token");
    //STATO
    //------------------------------------------------------------------------------------------------------------------
    try {
      const updateStatus = await fetch(`https://localhost:7046/api/Request/updateAdmin/${modalStatusRequest.idRequest}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!updateStatus.ok) {
        throw new Error("Errore aggiornamento stato");
      }

      //SE LO STATO E' COMPLETED(4) L'IMMAGINE DELL'ETICHETTA E' OBBLIGATORIA
      if (newStatus === 4) {
        if (!imgCompleted) {
          setErrorImg("L'immagine dell'etichetta è obbligatoria");
          setTimeout(() => {
            setErrorImg("");
          }, 2000);
          return;
        }

        //IMMAGINE ETICHETTA
        //------------------------------------------------------------------------------------------------------------------

        //UPLOAD IMMAGINE
        const formData = new FormData();
        formData.append("labelImage", imgCompleted);

        const uploadResponse = await fetch("https://localhost:7046/api/Email/uploadLabel", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Errore upload immagine");
        }

        //EMAIL
        //------------------------------------------------------------------------------------------------------------------

        // INVIO EMAIL
        const emailResponse = await fetch("https://localhost:7046/api/Email/completed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            requestId: modalStatusRequest.idRequest,
            imageName: imgCompleted.name,
            customBody: bodyCompleted,
          }),
        });

        if (!emailResponse.ok) throw new Error("Errore invio email");

        setSuccessEmail("Email inviata con successo!");
      }

      //SE LO STATO E' QUOTE-SENT(2)
      if (newStatus === 2) {
        const emailQuoteStatus = await fetch("https://localhost:7046/api/Email/sendQuote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            requestId: modalStatusRequest.idRequest,
            customBody: bodyQuote,
          }),
        });

        if (!emailQuoteStatus.ok) {
          setErrorEmailQuote("Errore invio email preventivo");
          setTimeout(() => {
            setErrorEmailQuote("");
          }, 2000);
        }

        setSuccessEmailQuote("Email preventivo inviata con successo!");
      }

      userRequest();
      setModalStatus(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setTimeout(() => {
        setErrorImg("");
      }, 2000);
    }
  };

  //FETCH RICHIESTE IN BASE ALL'UTENTE
  const userRequest = async () => {
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
        throw new Error("Errore nel recupero delle richieste!");
      }

      const data = await response.json();

      // FILTRO PER POTER VISUALIZZARE TUTTE LE RICHIESTE DI UN SINGOLO UTENTE
      const filtered = data.filter((request) => request.userEmail === email);
      setRequests(filtered);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  useEffect(() => {
    userRequest();
  }, [email]);

  return (
    <>
      {/* NAVBAR PER LE PAGINE DELL'ADMIN */}
      <NavbarAdmin />
      <Container className="mt-5">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">RICHIESTE</h2>

            {/* ALERT ERROR SE NON CI SONO UTENTI */}
            {requests.length === 0 && (
              <>
                <Alert
                  style={{ height: "300px" }}
                  variant="light"
                  className="d-flex justify-content-center flex-column bubbler-one-regular fs-4 p-5 text-center mt-5 fw-bold border border-gray"
                >
                  {error}
                </Alert>
              </>
            )}
            {requests.length > 0 && (
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
                        <td>
                          <div className="text-center fs-4">{new Date(request.createdAt).toLocaleDateString()}</div>
                        </td>

                        {/* BOTTONE MODALE DESCRIZIONE */}
                        <td className="text-center">
                          <div className="text-center fs-5">{request.idRequest}</div>
                          <Button
                            onClick={() => {
                              setModalDescriptionRequest(request);
                              setModalDescription(true);
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
                          ) : // SE LO STAO E' IN PENDING --> TRADUZIONE IN ITALIANO, BOTTONE MODIFICA
                          request.status === "Pending" ? (
                            <div className="d-flex align-items-center flex-column">
                              <span>IN ATTESA</span>
                              <div className="d-flex gap-1">
                                {/* BOTTONE MODALE STATO */}
                                <Button
                                  size="lg"
                                  variant="light"
                                  onClick={() => {
                                    setModalStatusRequest(request);
                                    setModalStatus(true);
                                    setNewStatus(status[request.status]);
                                  }}
                                >
                                  <PencilSquare />
                                </Button>
                              </div>
                            </div>
                          ) : // SE LO STAO E' IN PROGRESS --> TRADUZIONE IN ITALIANO, BOTTONE MODIFICA
                          request.status === "InProgress" ? (
                            <div className="d-flex align-items-center flex-column">
                              <span>IN LAVORAZIONE</span>
                              <div className="d-flex gap-1">
                                {/* BOTTONE MODALE STATO */}
                                <Button
                                  size="lg"
                                  variant="light"
                                  onClick={() => {
                                    setModalStatusRequest(request);
                                    setModalStatus(true);
                                    setNewStatus(status[request.status]);
                                  }}
                                >
                                  <PencilSquare />
                                </Button>
                              </div>
                            </div>
                          ) : // SE LO STAO E' QUOT SENT --> TRADUZIONE IN ITALIANO, BOTTONE MODIFICA
                          request.status === "QuoteSent" ? (
                            <div className="d-flex align-items-center flex-column">
                              <span>PREVENTIVO INVIATO</span>
                              <div className="d-flex gap-1">
                                {/* BOTTONE MODALE STATO */}
                                <Button
                                  size="lg"
                                  variant="light"
                                  onClick={() => {
                                    setModalStatusRequest(request);
                                    setModalStatus(true);
                                    setNewStatus(status[request.status]);
                                  }}
                                >
                                  <PencilSquare />
                                </Button>
                              </div>
                            </div>
                          ) : // SE LO STAO E' PAYMENT CONFIRMED --> TRADUZIONE IN ITALIANO, BOTTONE MODIFICA
                          request.status === "PaymentConfirmed" ? (
                            <div className="d-flex align-items-center flex-column">
                              <span>PAGAMENTO COMPLETATO</span>
                              <div className="d-flex gap-1">
                                {/* BOTTONE MODALE STATO */}
                                <Button
                                  size="lg"
                                  variant="light"
                                  onClick={() => {
                                    setModalStatusRequest(request);
                                    setModalStatus(true);
                                    setNewStatus(status[request.status]);
                                  }}
                                >
                                  <PencilSquare />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // SE LO STAO E' REJECTED --> TRADUZIONE IN ITALIANO
                            "RIFIUTATA"
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}

            {/* MODALE DESCRIZIONE --> PER VISUALIZZARE LA DESCRIZIONE DELL'UTENTE*/}
            <Modal show={modalDescription} onHide={() => setModalDescription(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title className="bubbler-one-regular text-black fw-bold">Descrizione prodotto</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p className="fs-3 bubbler-one-regular text-black">{modalDescriptionRequest?.description}</p>
              </Modal.Body>
            </Modal>

            {/* MODALE STATO --> PER POTER CAMBIARE LO STATO DELLA RICHIESTA ED INVIARE L'EMAIL IN BASE ALLO STATO*/}
            <Modal show={modalStatus} onHide={() => setModalStatus(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title className="bubbler-one-regular text-black fw-bold">Stato della richiesta</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form.Select className="fs-3" value={newStatus} onChange={(e) => setNewStatus(Number(e.target.value))}>
                  <option value={0}>In attesa</option>
                  <option value={1}>In lavorazione</option>
                  <option value={2}>Preventivo inviato</option>
                  <option value={3}>Pagamento confermato</option>
                  <option value={4}>Completata</option>
                  <option value={5}>Rifiutata</option>
                </Form.Select>

                {/* SOLO SE COMPLETED */}
                {newStatus === 4 && (
                  <>
                    <Form.Group className="mt-3">
                      <Form.Label className="fs-4 fw-bold">Messaggio email (opzionale)</Form.Label>
                      <Form.Control as="textarea" rows={5} value={bodyCompleted} onChange={(e) => setBodyCompleted(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mt-3">
                      <Form.Label className="fs-4 fw-bold">Immagine etichetta</Form.Label>
                      <Form.Control type="file" accept="image/*" onChange={(e) => setImgCompleted(e.target.files[0])} />
                    </Form.Group>

                    {errorImg && (
                      <Alert variant="danger" className="mt-2">
                        {errorImg}
                      </Alert>
                    )}
                    {successEmail && (
                      <Alert variant="success" className="mt-2">
                        {successEmail}
                      </Alert>
                    )}
                  </>
                )}

                {/* SOLO SE QUOTE-SENT */}
                {newStatus === 2 && (
                  <>
                    <Form.Group className="mt-3">
                      <Form.Label className="fs-4 fw-bold">Messaggio email preventivo</Form.Label>
                      <Form.Control as="textarea" rows={5} value={bodyQuote} onChange={(e) => setBodyQuote(e.target.value)} />
                    </Form.Group>

                    {errorEmailQuote && (
                      <Alert variant="danger" className="mt-2">
                        {errorEmailQuote}
                      </Alert>
                    )}
                    {successEmailQuote && (
                      <Alert variant="success" className="mt-2">
                        {successEmailQuote}
                      </Alert>
                    )}
                  </>
                )}
              </Modal.Body>

              {/* BUTTON */}
              <Modal.Footer>
                <Button onClick={handleActionStatus} className="bubbler-one-regular bg-white border text-black fs-4 fw-bold">
                  Salva
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default AdminRequestUser;

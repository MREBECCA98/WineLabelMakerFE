import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  //SEARCH BAR PER LA RICERCA DI UN SINGOLO UTENTE
  const [search, setSearch] = useState("");

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

  //EMAIL DEFAULT
  const [successEmailDefault, setSuccessEmailDefault] = useState("");

  //SCADENZA TOKEN
  const navigate = useNavigate();
  const [messageToken, setMessageToken] = useState();

  const status = {
    Pending: 0,
    InProgress: 1,
    QuoteSent: 2,
    PaymentConfirmed: 3,
    Completed: 4,
    Rejected: 5,
  };

  //MODIFICA STATO
  //------------------------------------------------------------------------------------------------------------------
  const handleActionStatus = async () => {
    const token = localStorage.getItem("token");

    try {
      //STATO
      //------------------------------------------------------------------------------------------------------------------
      const updateStatus = await fetch(`https://localhost:7046/api/Request/updateAdmin/${modalStatusRequest.idRequest}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!updateStatus.ok) {
        //SCADENZA TOKEN
        if (updateStatus.status == 401) {
          localStorage.removeItem("token");
          setMessageToken("Sessione scaduta. Effettua di nuovo il login");
          setTimeout(() => {
            setMessageToken("");
            navigate("/login");
          }, 4000);
          return;
        }
        throw new Error("Errore aggiornamento stato");
      }

      //EMAIL DEFAULT "IN PROGRESS", "PAYMENT CONFIRMED", "JEGECTED"
      //------------------------------------------------------------------------------------------------------------------
      if (newStatus === 1 || newStatus === 3 || newStatus === 5) {
        setSuccessEmailDefault("Email inviata con successo!");
        setTimeout(() => {
          setSuccessEmailDefault("");
        }, 2000);
      }

      //EMAIL COMPLETED(4)
      //------------------------------------------------------------------------------------------------------------------
      // L'IMMAGINE DELL'ETICHETTA E' OBBLIGATORIA
      if (newStatus === 4) {
        if (!imgCompleted) {
          setErrorImg("L'allegato è obbligatorio");
          setTimeout(() => {
            setErrorImg("");
          }, 2000);
          return;
        }

        //UPLOAD IMMAGINE
        //------------------------------------------------------------------------------------------------------------------
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
          //SCADENZA TOKEN
          if (uploadResponse.status == 401) {
            localStorage.removeItem("token");
            setMessageToken("Sessione scaduta. Effettua di nuovo il login");
            setTimeout(() => {
              setMessageToken("");
              navigate("/login");
            }, 4000);
            return;
          }
          throw new Error("Errore upload immagine");
        }

        //INVIO EMAIL COMPLETED
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

        if (!emailResponse.ok) {
          //SCADENZA TOKEN
          if (emailResponse.status == 401) {
            localStorage.removeItem("token");
            setMessageToken("Sessione scaduta. Effettua di nuovo il login");
            setTimeout(() => {
              setMessageToken("");
              navigate("/login");
            }, 4000);
            return;
          }
          throw new Error("Errore invio email");
        }

        setSuccessEmail("Email inviata con successo!");
        setTimeout(() => {
          setSuccessEmail("");
        }, 2000);
      }
      //------------------------------------------------------------------------------------------------------------------

      //EMAIL PREVENTIVO (2)
      //------------------------------------------------------------------------------------------------------------------
      if (newStatus === 2) {
        if (!bodyQuote || bodyQuote.trim() === "") {
          setErrorEmailQuote("Il testo della mail è obbligatorio");
          setTimeout(() => {
            setErrorEmailQuote("");
          }, 2000);
          return;
        }
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
          //SCADENZA TOKEN
          if (emailQuoteStatus.status == 401) {
            localStorage.removeItem("token");
            setMessageToken("Sessione scaduta. Effettua di nuovo il login");
            setTimeout(() => {
              setMessageToken("");
              navigate("/login");
            }, 4000);
            return;
          }
          throw new Error("Errore invio email preventivo");
        }

        setSuccessEmailQuote("Email preventivo inviata con successo!");
        setTimeout(() => {
          setSuccessEmailQuote("");
        }, 2000);
      }
      //------------------------------------------------------------------------------------------------------------------

      userRequest();

      setTimeout(() => {
        setModalStatus(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  //FETCH RICHIESTE IN BASE ALL'UTENTE
  //------------------------------------------------------------------------------------------------------------------
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

  //GESTIONE PER LA VISIBILITA' DEL PROCESSO DEGLI STATI
  //------------------------------------------------------------------------------------------------------------------
  const isStatusDisabled = (disabledStatus) => {
    const currentStatus = modalStatusRequest.status;
    // console.log("stato corrente", currentStatus);

    switch (currentStatus) {
      //IN ATTESA --> si può modificare lo stato solo in "IN LAVORAZIONE" e "RIFIUTATA"
      case "Pending":
        return !(disabledStatus === "InProgress" || disabledStatus === "Rejected");

      //IN LAVORAZIONE --> si può modificare lo stato in "PREVENTIVO INVIATO"
      case "InProgress":
        return disabledStatus !== "QuoteSent";

      //PREVENTIVO INVIATO --> si può modificare lo stato solo in "PAGAMENTO CONFERMATO"
      case "QuoteSent":
        return disabledStatus !== "PaymentConfirmed";

      //PAGAMENTO CONFERMATO --> si può cambiare lo stato solo in "COMPLETATA"
      case "PaymentConfirmed":
        return disabledStatus !== "Completed";

      case "Completed":
      case "Rejected":
        return true;

      default:
        return true;
    }
  };

  useEffect(() => {
    userRequest();
  }, [email]);

  //SEARCH --> RICERCA PER ID RICHIESTA
  const filteredRequest = requests.filter((r) => r.idRequest.toString().includes(search));

  return (
    <>
      {/* NAVBAR PER LE PAGINE DELL'ADMIN */}
      <NavbarAdmin />
      <Container className="mt-5">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">RICHIESTE</h2>

            {/* SCADENZA TOKEN */}
            {messageToken && (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                {messageToken}
              </Alert>
            )}

            {/* SEARCH */}
            <Form.Control
              type="text"
              placeholder="Cerca richiesta per ID"
              className="my-3 fs-3 bubbler-one-regular fw-bold text-black"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />

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
                  {filteredRequest
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

              {/* GESTIONE PER LA VISIBILITA' DEL PROCESSO DEGLI STATI */}
              <Modal.Body>
                <Form.Select className="fs-3" value={newStatus} onChange={(e) => setNewStatus(Number(e.target.value))}>
                  <option value={0} disabled={isStatusDisabled("Pending")}>
                    In attesa
                  </option>
                  <option value={1} disabled={isStatusDisabled("InProgress")}>
                    In lavorazione
                  </option>
                  <option value={2} disabled={isStatusDisabled("QuoteSent")}>
                    Preventivo inviato
                  </option>
                  <option value={3} disabled={isStatusDisabled("PaymentConfirmed")}>
                    Pagamento confermato
                  </option>
                  <option value={4} disabled={isStatusDisabled("Completed")}>
                    Completata
                  </option>
                  <option value={5} disabled={isStatusDisabled("Rejected")}>
                    Rifiutata
                  </option>
                </Form.Select>

                {/* SOLO SE COMPLETED */}
                {newStatus === 4 && (
                  <>
                    <Form.Group className="mt-3">
                      <Form.Label className="fs-4 fw-bold">Messaggio email</Form.Label>
                      <Form.Control
                        className="bubbler-one-regular fs-3"
                        as="textarea"
                        rows={5}
                        value={bodyCompleted}
                        onChange={(e) => setBodyCompleted(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mt-3">
                      <Form.Label className="fs-4 fw-bold">Immagine etichetta</Form.Label>
                      <Form.Control type="file" accept="image/*" onChange={(e) => setImgCompleted(e.target.files[0])} />
                    </Form.Group>
                  </>
                )}

                {/* SOLO SE QUOTE-SENT */}
                {newStatus === 2 && (
                  <>
                    <Form.Group className="mt-3">
                      <Form.Label className="fs-4 fw-bold">Messaggio email preventivo</Form.Label>
                      <Form.Control
                        className="bubbler-one-regular fs-3"
                        as="textarea"
                        rows={5}
                        value={bodyQuote}
                        onChange={(e) => setBodyQuote(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}
              </Modal.Body>

              <Modal.Footer>
                {/* SUCCESS EMAIL DEFAULT */}
                {successEmailDefault && (
                  <Alert variant="success" className="mt-2 fs-5">
                    {successEmailDefault}
                  </Alert>
                )}

                {/* SUCCESS AND ERROR EMAIL COMPLETED */}
                {successEmail && (
                  <Alert variant="success" className="mt-2 fs-5">
                    {successEmail}
                  </Alert>
                )}
                {errorImg && (
                  <Alert variant="danger" className="mt-2 fs-5">
                    {errorImg}
                  </Alert>
                )}

                {/* SUCCESS AND ERROR EMAIL QUOTE */}
                {successEmailQuote && (
                  <Alert variant="success" className="mt-2 fs-5">
                    {successEmailQuote}
                  </Alert>
                )}
                {errorEmailQuote && (
                  <Alert variant="danger" className="mt-2 fs-5">
                    {errorEmailQuote}
                  </Alert>
                )}

                {/* BUTTON */}
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

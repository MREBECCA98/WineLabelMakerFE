import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
import { Alert, Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { JournalText, PencilSquare } from "react-bootstrap-icons";

//ADMIN REQUEST USER IS THE PAGE WHERE THE ADMIN CAN VIEW ALL REQUESTS FROM A SINGLE USER
//IT CONSISTS OF A TABLE DIVIDED INTO:
//-REQUEST CREATION DATE
//-PRODUCT DESCRIPTION: MODAL TO VIEW THE DESCRIPTION AND REQUEST ID
//-REQUEST STATUS

//THE ADMIN CHANGE THE STATUS OF THE REQUEST BASED ON THE PROGRESS

//AN EMAIL IS SENT WHEN THE STATUS IS UPDATED:
//-DEFAULT: FOR "IN PROGRESS", "PAYMENT CONFIRMED", "REJECTED"
//-QUOTSENT: THE ADMIN WRITES THE CUSTOM BODY BASED ON THE QUOTE
//-COMPLETED: THE ADMIN MUST ATTACH THE LABEL IMAGE AND CAN CUSTOMIZE THE BODY

function AdminRequestUser() {
  const { email } = useParams();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  //SEARCH FOT REQUEST BY ID
  const [search, setSearch] = useState("");

  //MODAL DESCRIPTION
  const [modalDescription, setModalDescription] = useState(false);
  const [modalDescriptionRequest, setModalDescriptionRequest] = useState(null);

  //MODAL STATUS
  const [modalStatus, setModalStatus] = useState(false);
  const [modalStatusRequest, setModalStatusRequest] = useState("");
  const [newStatus, setNewStatus] = useState("");

  //EMAIL COMPLETED
  const [imgCompleted, setImgCompleted] = useState(null);
  const [bodyCompleted, setBodyCompleted] = useState("");
  const [successEmail, setSuccessEmail] = useState("");
  const [errorImg, setErrorImg] = useState("");

  //EMAIL QUOTE
  const [bodyQuote, setBodyQuote] = useState("");
  const [successEmailQuote, setSuccessEmailQuote] = useState("");
  const [errorEmailQuote, setErrorEmailQuote] = useState("");

  //EMAIL DEFAULT
  const [successEmailDefault, setSuccessEmailDefault] = useState("");

  //TOKEN EXPIRY
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

  //UPDATE STATUS
  //------------------------------------------------------------------------------------------------------------------
  const handleActionStatus = async () => {
    const token = localStorage.getItem("token");

    try {
      //STATUS
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
        //TOKEN EXPIRY
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

      //EMAIL DEFAULT "IN PROGRESS", "PAYMENT CONFIRMED", "REJECTED"
      //------------------------------------------------------------------------------------------------------------------
      if (newStatus === 1 || newStatus === 3 || newStatus === 5) {
        setSuccessEmailDefault("Email inviata con successo!");
        setTimeout(() => {
          setSuccessEmailDefault("");
        }, 2000);
      }

      //EMAIL COMPLETED(4)
      //------------------------------------------------------------------------------------------------------------------
      if (newStatus === 4) {
        if (!imgCompleted) {
          setErrorImg("L'allegato è obbligatorio");
          setTimeout(() => {
            setErrorImg("");
          }, 2000);
          return;
        }

        //UPLOAD LABEL IMAGE
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
          //TOKEN EXPIRY
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

        //SEND EMAIL COMPLETED
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
          //TOKEN EXPIRY
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

      //EMAIL QUOTE (2)
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
          //TOKEN EXPIRY
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

  //REQUESTS BASED ON USER
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
        //TOKEN EXPIRY
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

      //FILTER TO VIEW ALL REQUESTS FROM A SINGLE USER
      const filtered = data.filter((request) => request.userEmail === email);
      setRequests(filtered);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  //STATE MANAGEMENT
  //------------------------------------------------------------------------------------------------------------------
  const isStatusDisabled = (disabledStatus) => {
    const currentStatus = modalStatusRequest.status;

    switch (currentStatus) {
      case "Pending":
        return !(disabledStatus === "InProgress" || disabledStatus === "Rejected");

      case "InProgress":
        return disabledStatus !== "QuoteSent";

      case "QuoteSent":
        return disabledStatus !== "PaymentConfirmed";

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

  //SEARCH FOT REQUEST BY ID
  const filteredRequest = requests.filter((r) => r.idRequest.toString().includes(search));

  return (
    <>
      {/* NAVBAR ADMIN PAGE */}
      <NavbarAdmin />
      <Container className="mt-5">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">RICHIESTE</h2>

            {/* TOKEN EXPIRY */}
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
                          {request.status === "Completed" ? (
                            "COMPLETATA"
                          ) : request.status === "Pending" ? (
                            <div className="d-flex align-items-center flex-column">
                              <span>IN ATTESA</span>
                              <div className="d-flex gap-1">
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
                          ) : request.status === "InProgress" ? (
                            <div className="d-flex align-items-center flex-column">
                              <span>IN LAVORAZIONE</span>
                              <div className="d-flex gap-1">
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
                          ) : request.status === "QuoteSent" ? (
                            <div className="d-flex align-items-center flex-column">
                              <span>PREVENTIVO INVIATO</span>
                              <div className="d-flex gap-1">
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
                          ) : request.status === "PaymentConfirmed" ? (
                            <div className="d-flex align-items-center flex-column">
                              <span>PAGAMENTO COMPLETATO</span>
                              <div className="d-flex gap-1">
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
                            "RIFIUTATA"
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}

            {/* MODAL DESCRIPTION*/}
            <Modal show={modalDescription} onHide={() => setModalDescription(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title className="bubbler-one-regular text-black fw-bold">Descrizione prodotto</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p className="fs-3 bubbler-one-regular text-black">{modalDescriptionRequest?.description}</p>
              </Modal.Body>
            </Modal>

            {/* MODAL STATUS*/}
            <Modal show={modalStatus} onHide={() => setModalStatus(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title className="bubbler-one-regular text-black fw-bold">Stato della richiesta</Modal.Title>
              </Modal.Header>

              {/* STATE MANAGEMENT */}
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

                {/* COMPLETED */}
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

                {/* QUOTE-SENT */}
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

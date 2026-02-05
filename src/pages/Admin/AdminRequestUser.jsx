import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
import { Alert, Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { JournalText, Pen, PencilSquare } from "react-bootstrap-icons";

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

  const status = {
    Pending: 0,
    InProgress: 1,
    Completed: 2,
    Rejected: 3,
  };

  const handleUpdateStatus = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`https://localhost:7046/api/Request/updateAdmin/${modalStatusRequest.idRequest}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento dello stato!");
      }

      userRequest();
    } catch (error) {
      console.error(error);
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
                        <td className="text-center fs-4">{new Date(request.createdAt).toLocaleDateString()}</td>

                        {/* BOTTONE MODALE DESCRIZIONE */}
                        <td className="text-center">
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
                                    : "red",
                          }}
                        >
                          {request.status === "Completed" ? (
                            "COMPLETATA"
                          ) : request.status === "Pending" ? (
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
                          ) : request.status === "InProgress" ? (
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
                          ) : (
                            "RIFIUTATA"
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}

            {/* MODALE DESCRIZIONE*/}
            <Modal show={modalDescription} onHide={() => setModalDescription(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title className="bubbler-one-regular text-black fw-bold">Descrizione prodotto</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p className="fs-3 bubbler-one-regular text-black">{modalDescriptionRequest?.description}</p>
              </Modal.Body>
            </Modal>

            {/* const [modalStatus, setModalStatus] = useState(false);
  const [modalStatusRequest, setModalStatusRequest] = useState("");
  const [newStatus, setNewStatus] = useState(""); */}

            {/* MODALE STATO*/}
            <Modal show={modalStatus} onHide={() => setModalStatus(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title className="bubbler-one-regular text-black fw-bold">Stato della richiesta</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form.Select className="fs-3" value={newStatus} onChange={(e) => setNewStatus(Number(e.target.value))}>
                  <option value={0}>In attesa</option>
                  <option value={1}>In lavorazione</option>
                  <option value={2}>Completata</option>
                  <option value={3}>Rifiutata</option>
                </Form.Select>
              </Modal.Body>

              <Modal.Footer>
                <Button onClick={handleUpdateStatus} className="bubbler-one-regular bg-white border text-black fs-4 fw-bold">
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

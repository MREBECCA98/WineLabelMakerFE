import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
import { Alert, Button, Col, Container, Modal, Row, Table } from "react-bootstrap";
import { JournalText } from "react-bootstrap-icons";

function AdminRequestUser() {
  const { email } = useParams();
  const [request, setRequest] = useState([]);
  const [error, setError] = useState("");

  // MODALE
  const [modal, setModal] = useState(false);
  const [modalRequest, setModalRequest] = useState(null);

  useEffect(() => {
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
        setRequest(filtered);
        console.log("filtered", filtered);
      } catch (error) {
        setError(error.message);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    };
    userRequest();
  }, [email]);

  return (
    <>
      <NavbarAdmin />
      <Container className="mt-5">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">RICHIESTE SINGOLO UTENTE</h2>
            {request.length === 0 && (
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

            {request.length > 0 && (
              <Table responsive hover className="mt-4 bubbler-one-regular fs-4">
                <thead className="text-center">
                  <tr>
                    <th>DATA DI CREAZIONE</th>
                    <th>DESCRIZIONE PRODOTTO</th>
                    <th>STATO DELLA RICHIESTA</th>
                  </tr>
                </thead>
                <tbody>
                  {request
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((request) => (
                      <tr key={request.idRequest}>
                        <td className="text-center fs-5">{new Date(request.createdAt).toLocaleDateString()}</td>

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
                              <div className="d-flex gap-1">{/* AGGIUNGERE IL BOTTONE PER POTER CAMBIARE LO STATO */}</div>
                            </div>
                          ) : request.status === "InProgress" ? (
                            "IN LAVORAZIONE"
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
            <Modal show={modal} onHide={() => setModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title className="bubbler-one-regular text-black fw-bold">Descrizione prodotto</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p className="fs-5 bubbler-one-regular text-black">{modalRequest?.description}</p>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default AdminRequestUser;

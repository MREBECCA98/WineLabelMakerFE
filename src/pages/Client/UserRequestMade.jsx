import { Alert, Button, Col, Container, Modal, Row, Table } from "react-bootstrap";
import NavbarUser from "../../components/NavbarUser";
import { Link, Links } from "react-router-dom";
import { useEffect, useState } from "react";
import { JournalText, PencilSquare, Trash3 } from "react-bootstrap-icons";

function UserRequestMade() {
  const [requests, setRequests] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // MODALE
  const [modal, setModal] = useState(false);
  const [modalRequest, setModalRequest] = useState(null);

  // DELETE
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

  // TUTTE LE RICHIESTE PER UTENETE
  useEffect(() => {
    const allRequests = async () => {
      const token = localStorage.getItem("token");
      console.log("token", token);
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
        setRequests(data);
        console.log(data);
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
      <NavbarUser />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={12} lg={12}>
            {/* RICHIESTE EFFETTUATE */}
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">LE STORIE DEI TUOI VINI... </h2>
            <p className="mt-3 mb-0 text-center bubbler-one-regular fs-sm-5 fs-3 ">Racconta i tuoi vini e segui le loro storie</p>
            <p className="text-center bubbler-one-regular fs-sm-5 fs-3 ">In questa pagina troverai tutte le descrizioni inviate e il loro progresso</p>
            {/* ALERT SUCCESS */}
            {success ? (
              <Alert variant="success" className="bubbler-one-regular fs-6 fw-bold">
                {success}
              </Alert>
            ) : null}

            {/* ALERT ERROR */}
            {error ? (
              <Alert variant="danger" className="bubbler-one-regular fs-6 fw-bold">
                {error}
              </Alert>
            ) : null}

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

                          <td
                            className="text-center "
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

                {/* MODALE DESCRIZIONE*/}
                <Modal show={modal} onHide={() => setModal(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title className="bubbler-one-regular text-black fw-bold">Descrizione prodotto</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <p className="fs-3 bubbler-one-regular text-black ">{modalRequest?.description}</p>
                  </Modal.Body>
                </Modal>

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

import { Alert, Button, Col, Container, Modal, Row, Table } from "react-bootstrap";
import NavbarUser from "../../components/NavbarUser";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { JournalText, PencilSquare, Trash3 } from "react-bootstrap-icons";

//USER-REQUEST-MADE
//-SHOWS THE USER'S REQUEST HISTORY AND THEIR STATUS
//-IF NO REQUEST: SHOWS A LINK TO CREATE A NEW REQUEST
//-IF REQUEST EXIST: SHOWS TABLE WITH CREATION DATE, DESCRIPTION (MODAL) AND STATUS
//-ONLY THE "PENDING" STATUS ALLOWS EDIT/ DELETE

function UserRequestMade() {
  const [requests, setRequests] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  //MODAL DESCRIPTION LABEL
  const [modal, setModal] = useState(false);
  const [modalRequest, setModalRequest] = useState(null);

  //TOKEN EXPIRY
  const navigate = useNavigate();
  const [messageToken, setMessageToken] = useState();

  //DELETE IF STATUS IS "PENDING"
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

  //ALL USER REQUESTS (USER CAN ONLY VIEW HIS OWN REQUESTS)
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
      {/* NAVBAR USER PAGE */}
      <NavbarUser />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={12} lg={12}>
            {/* REQUESTS MADE */}
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">LE STORIE DEI TUOI VINI... </h2>
            <p className="mt-3 mb-0 text-center bubbler-one-regular fs-sm-5 fs-3 ">Racconta i tuoi vini e segui le loro storie</p>
            <p className="text-center bubbler-one-regular fs-sm-5 fs-3 ">In questa pagina troverai tutte le descrizioni inviate e il loro progresso</p>

            {/* TOKEN EXPIRY */}
            {messageToken && (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                {messageToken}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="bubbler-one-regular fs-5 fw-bold">
                {success}
              </Alert>
            )}

            {error && (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                {error}
              </Alert>
            )}

            {/* PAGE WITHOUT REQUESTS */}
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

            {/* PAGE WITH REQUESTS */}
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

                          {/* DESCRIPTION MODAL*/}
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
                            ) : request.status === "QuoteSent" ? (
                              "PREVENTIVO INVIATO"
                            ) : request.status === "PaymentConfirmed" ? (
                              "PAGAMENTO CONFERMATO"
                            ) : (
                              "RIFIUTATA"
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>

                {/* DESCRIPTION MODAL */}
                <Modal show={modal} onHide={() => setModal(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title className="bubbler-one-regular text-black fw-bold">Descrizione prodotto</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <p className="fs-3 bubbler-one-regular text-black ">{modalRequest?.description}</p>
                  </Modal.Body>
                </Modal>

                {/* LINK FOR NEW REQUEST */}
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

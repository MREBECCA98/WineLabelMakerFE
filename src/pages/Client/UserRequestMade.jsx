import { Alert, Col, Container, Row, Table } from "react-bootstrap";
import NavbarUser from "../../components/NavbarUser";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function UserRequestMade() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

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

        if (data.length === 0) {
          setError("IL TUO VINO ASPETTA DI ESSERE RACCONTATO...");
        } else {
          setError("");
        }
      } catch (error) {
        setError(error.message);
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

            {/* SE CI SONO RICHIESTE */}
            {requests.length > 0 ? (
              <>
                <h1 className="text-center bubbler-one-regular fw-bold fs-1"> Richieste Effettuate</h1>

                <Table bordered hover className="mt-4">
                  <thead className="text-center">
                    <tr>
                      <th>Data di creazione</th>
                      <th>Descrizione prodotto</th>
                      <th>Stato della richiesta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((r) => (
                        <tr key={r.idRequest}>
                          <td className="text-center">{new Date(r.createdAt).toLocaleDateString()}</td>
                          <td>{r.description}</td>
                          <td
                            className="text-center"
                            style={{
                              color: r.status === "Completed" ? "green" : r.status === "Pending" ? "blue" : r.status === "InProgress" ? "orange" : "red",
                            }}
                          >
                            {r.status === "Completed"
                              ? "COMPLETATA"
                              : r.status === "Pending"
                                ? "IN ATTESA"
                                : r.status === "InProgress"
                                  ? "IN LAVORAZIONE"
                                  : "RIFIUTATA"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <div className="text-center mt-5 bubbler-one-regular fs-5 fw-bold">
                  <p className="fs-4">VUOI CONDIVIDERE LA STORIA DI UN NUOVO VINO?</p>
                  <Link to="/userRequest" className="text-decoration-none ">
                    Clicca qui per procedere con la tua richiesta
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-center bubbler-one-regular fw-bold fs-1"> Effettua una richiesta</h1>

                <Alert variant="light" className="bubbler-one-regular fs-4 p-5 text-center mt-5 fw-bold border border-dark">
                  {error}
                  <div>
                    <Link to="/userRequest" className="bubbler-one-regular fs-5 fw-bold text-decoration-none">
                      Clicca qui per dare vita alla sua storia !
                    </Link>
                  </div>
                </Alert>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default UserRequestMade;

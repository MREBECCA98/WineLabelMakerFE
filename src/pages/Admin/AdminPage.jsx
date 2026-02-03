import { Alert, Col, Container, Row, Table } from "react-bootstrap";
import NavbarAdmin from "../../components/NavbarAdmin";
import { useEffect, useState } from "react";
import { Envelope, EnvelopeFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  // FETCH RICHIESTE
  useEffect(() => {
    const allRequest = async () => {
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
        setRequests(data);
      } catch (error) {
        setError(error.message);
        setTimeout(() => setError(""), 2000);
      }
    };

    allRequest();
  }, []);

  // LISTA UTENTI
  const users = [];

  requests.forEach((request) => {
    let user = users.find((user) => user.email === request.userEmail);

    if (!user) {
      users.push({
        email: request.userEmail,
        name: request.userName,
        surname: request.userSurname,
        status: request.status === "Pending",
      });
    } else {
      if (request.status === "Pending") {
        user.status = true;
      }
    }
  });

  return (
    <>
      <NavbarAdmin />
      <Container className="mt-5">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">RICHIESTE UTENTI</h2>

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
                  NON CI SONO RICHIESTE DISPONIBILI
                </Alert>
              </>
            )}

            {/* SE CI SONO RICHIESTE */}
            {requests.length > 0 && (
              <Table responsive hover className="mt-4 bubbler-one-regular fs-4  ">
                <thead>
                  <tr>
                    <th>Nome e Cognome</th>

                    <th className="text-center">Richieste</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email}>
                      <td>
                        <div>
                          {user.name} {user.surname}
                        </div>
                        <div className="text-muted">{user.email}</div>
                      </td>

                      <td className="text-center">
                        <Link to={`/adminRequestUser/${user.email}`}>{user.status ? <EnvelopeFill color="green" size={30} /> : <Envelope size={30} />}</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AdminPage;

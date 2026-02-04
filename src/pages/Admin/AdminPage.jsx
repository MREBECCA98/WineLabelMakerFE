import { Alert, Col, Container, Form, Row, Table } from "react-bootstrap";
import NavbarAdmin from "../../components/NavbarAdmin";
import { useEffect, useState } from "react";
import { Envelope, EnvelopeFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  //SEARCH BAR
  const [search, setSearch] = useState("");

  //FETCH RICHIESTE
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

  //LISTA UTENTI
  const users = [];

  requests.forEach((request) => {
    const newUser = {
      email: request.userEmail,
      companyName: request.companyName,
      name: request.userName,
      surname: request.userSurname,
      status: request.status === "Pending",
    };
    let user = users.find((user) => user.email === request.userEmail);

    if (!user) {
      users.push(newUser);
    } else {
      if (request.status === "Pending") {
        user.status = true;
      }
    }
  });

  //SEARCH
  const searchLower = search.toLowerCase();

  const filteredUsers = users.filter(
    (u) =>
      u.companyName.toLowerCase().includes(searchLower) ||
      u.name.toLowerCase().includes(searchLower) ||
      u.surname.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower),
  );

  return (
    <>
      <NavbarAdmin />
      <Container className="mt-5">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">RICHIESTE UTENTI</h2>
            {/* SEARCH */}
            <Form.Control
              type="text"
              placeholder="Cerca azienda..."
              className="my-3"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            {/* ALERT ERROR */}
            {error ? (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
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
                    <th>AZIENDA</th>

                    <th className="text-center">RICHIESTE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.email}>
                      <td>
                        <div className="fw-bold ">{user.companyName}</div>
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

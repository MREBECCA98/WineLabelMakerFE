import { Alert, Col, Container, Form, Row, Table } from "react-bootstrap";
import NavbarAdmin from "../../components/NavbarAdmin";
import { useEffect, useState } from "react";
import { Envelope, EnvelopeFill } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";

//ADMIN PAGE E' LA PAGINA UTILIZZATA DALL'ADMIN PER POTER VEDERE LE RICHIESTE SUDDIVISE PER UTENTE
//E' COMPOSTA DA UNA TABELLA SUDDIVISA IN:
//-AZIENDA: NOME AZIENDA, NOME E COGNOME DELL' UTENTE, EMAIL
//-RICHIESTA: QUANDO CI SONO NUOVE RICHIESTE (STATO IN ATTESA) LA POSTA DIVENTA VERDE
//AL CLICK DELLA POSTA SI VERRA' INDIRIZZATI ALLA PAGINA ADMIN REQUEST PAGE,
//PER POTER VEDERE TUTTE LE RICHIESTE DI UN SINGOLO UTENTE

function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  //SEARCH BAR PER LA RICERCA DI UN SINGOLO UTENTE
  const [search, setSearch] = useState("");

  //SCADENZA TOKEN
  const navigate = useNavigate();
  const [messageToken, setMessageToken] = useState();

  //FETCH RICHIESTE PER POTER VISUALIZZARE TUTTE LE RICHIESTE SUDDIVISE PER UTENTI
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
        setRequests(data);
      } catch (error) {
        setError(error.message);
        setTimeout(() => setError(""), 2000);
      }
    };

    allRequest();
  }, []);

  //LISTA UTENTI PER VISUALIZZARE UNA VOLTA SOLA L'UTENTE ANCHE SE HA TANTE RICHIESTE
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

    //SE L'UTENTE NON ESISTE VERRA' AGGIUNTO
    //E SE L'UTENTE ESISTE MA LO STATO E' "IN ATTESA" SIGNIFICA CHE C'E' UNA NUOVA RICHIEST
    if (!user) {
      users.push(newUser);
    } else {
      if (request.status === "Pending") {
        user.status = true;
      }
    }
  });

  //SEARCH --> RICERCA PER NOME AZIENDA, NOME, COGNOME ED EMAIL
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
      {/* NAVBAR PER LE PAGINE DELL'ADMIN */}
      <NavbarAdmin />
      <Container className="mt-5">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">RICHIESTE UTENTI</h2>

            {/* SCADENZA TOKEN */}
            {messageToken && (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                {messageToken}
              </Alert>
            )}

            {/* SEARCH */}
            <Form.Control
              type="text"
              placeholder="Cerca azienda..."
              className="my-3 fs-3 bubbler-one-regular fw-bold text-black"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />

            {/* ALERT ERROR */}
            {error && (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                {error}
              </Alert>
            )}

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
                      {/* AZIENDA */}
                      <td>
                        <div className="fw-bold ">{user.companyName}</div>
                        <div>
                          {user.name} {user.surname}
                        </div>
                        <div className="text-muted">{user.email}</div>
                      </td>

                      {/* RICHIESTE CON COLLEGAMENTO ALLA PAGINA "ADMIN REQUEST USER", DOVE SI POTRANNO VEDERE TUTTE LE RICHIESTE PER SINGOLO UTENTE*/}
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

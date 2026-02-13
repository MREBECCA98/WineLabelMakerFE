import { Alert, Col, Container, Form, Row, Table } from "react-bootstrap";
import NavbarAdmin from "../../components/NavbarAdmin";
import { useEffect, useState } from "react";
import { Envelope, EnvelopeFill } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";

//THE ADMIN PAGE IS THE PAGE USED BY THE ADMIN TO VIEW REQUESTS BY USER
//IT CONSISTS OF A TABLE DIVIDED INTO:
//-COMPANY: COMPANY NAME, USER'S FIRST AND LAST NAME, EMAIL
//-REQUEST: WHEN THERE ARE NEW REQUESTS (PENDING STATUS), THE INBOX TURNS GREEN
//WHEN YOU CLICK ON THE INBOX, YOU WILL BE DIRECTED TO THE ADMIN REQUEST PAGE
//TO VIEW ALL REQUESTS FROM A SINGLE USER.

function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  //SEARCH FOR USER
  const [search, setSearch] = useState("");

  //TOKEN EXPIRY
  const navigate = useNavigate();
  const [messageToken, setMessageToken] = useState();

  //FETCH REQUESTS TO BE ABLE TO VIEW ALL REQUESTS DIVIDED BY USER
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
        setTimeout(() => setError(""), 2000);
      }
    };

    allRequest();
  }, []);

  //USER LIST TO VIEW THE USER ONLY ONCE EVEN IF THEY HAVE MANY REQUESTS
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

    //IF THE USER DOESN'T EXIST, IT WILL BE ADDED
    //AND IF THE USER EXISTS BUT THE STATUS IS "PENDING," IT MEANS THERE IS A NEW REQUEST
    if (!user) {
      users.push(newUser);
    } else {
      if (request.status === "Pending") {
        user.status = true;
      }
    }
  });

  //SEARCH FOR USER
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
      {/* NAVBAR ADMIN PAGE */}
      <NavbarAdmin />
      <Container className="mt-5">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">RICHIESTE UTENTI</h2>

            {/* TOKEN EXPIRY */}
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

            {error && (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                {error}
              </Alert>
            )}

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

                      {/* REQUESTS WITH A LINK TO THE "ADMIN REQUEST USER" PAGE, WHERE YOU CAN SEE ALL REQUESTS FOR EACH USER */}
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

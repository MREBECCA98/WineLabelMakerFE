import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import NavbarUser from "../../components/NavbarUser";
import { useEffect, useState } from "react";

//UPDATE REQUEST
//THIS IS THE PAGE THAT ALLOWS YOU TO MODIFY THE DESCRIPTION WHEN THE STATUS IS "PENDING"

function UpdateRequest() {
  const { id } = useParams();
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  //TOKEN EXPIRY
  const navigate = useNavigate();
  const [messageToken, setMessageToken] = useState();

  //GET REQUEST TO FETCH A USER'S WINE LABEL DESCRIPTION BY ID
  useEffect(() => {
    const getRequest = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`https://localhost:7046/api/Request/requestById/${id}`, {
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
          throw new Error("Errore nel recupero della richiesta!");
        }

        const data = await response.json();
        setDescription(data.description);
      } catch (error) {
        setError(error.message);
        setTimeout(() => {
          setError("");
          setDescription("");
        }, 2000);
      }
    };
    getRequest();
  }, [id]);

  //PUT REQUEST TO UPDATE THE DESCRIPRION WHEN THE STATUS IS "PENDING"
  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`https://localhost:7046/api/Request/updateClient/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ description }),
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
        throw new Error("Errore durante la modifica della descrizione!");
      }

      await response.json();
      setSuccess("La descrizione è stata modificata!");

      setTimeout(() => {
        setSuccess("");
        navigate("/userRequestMade");
      }, 2000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };
  return (
    <>
      {/* NAVBAR USER PAGE */}
      <NavbarUser />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h1 className="text-center bubbler-one-regular fw-bold fs-1">Modifica descrizione </h1>

            {/* TOKEN EXPIRY */}
            {messageToken && (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                {messageToken}
              </Alert>
            )}

            {/* UPDATE FORM */}
            <Form onSubmit={handleUpdate} className="mt-4">
              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label className="bubbler-one-regular fs-5">Modifica la descrizione del tuo prodotto</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-3"
                  as="textarea"
                  rows={9}
                  maxLength={5000}
                  placeholder="Modifica la descrizione del tuo prodotto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* REQUIREMENTS DESCRIPTION */}
                <ul className="fs-6" style={{ marginTop: "10px" }}>
                  <li style={{ color: description.length >= 5000 ? "red" : "green" }}>Raccontaci tutto sul tuo prodotto, in massimo 5000 caratteri</li>
                </ul>
              </Form.Group>

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

              <div className="d-flex justify-content-center mt-5">
                <Button variant="white" type="submit" className="border border-dark bubbler-one-regular fs-5 fw-bold w-100">
                  Modifica descrizione
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default UpdateRequest;

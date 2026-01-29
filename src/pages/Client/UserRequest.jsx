import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import NavbarUser from "../../components/NavbarUser";
import { useState } from "react";

function UserRequest() {
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    //SE MANCA LA DESCRIZIONE MOSTRA ERRORE
    if (!description) {
      setError("Inserisci la descrizione del tuo prodotto!");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    const token = localStorage.getItem("token");
    //FETCH CREATE DESCRIPTION
    try {
      const response = await fetch("https://localhost:7046/api/Request/CreateRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ description }),
      });
      if (!response.ok) {
        throw new Error("Errore nella creazione della richiest!");
      }

      const data = await response.json();
      console.log("La creazione della richiesta è andata a buon fine!", data);

      setSuccess("La creazione della richiesta è andata a buon fine!");
      setTimeout(() => {
        setSuccess("");
        setDescription("");
      }, 2000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError("");
        setDescription("");
      }, 2000);
    }
  };

  return (
    <>
      <NavbarUser />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h1 className="text-center bubbler-one-regular fw-bold fs-1">Benvenuto nella pagina Richieste</h1>

            <Form onSubmit={handleCreate}>
              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label className="bubbler-one-regular fs-5">Descrizione prodotto</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-6"
                  as="textarea" //TYPE
                  rows={9}
                  maxLength={5000}
                  placeholder="Inserisci la descrizione del tuo prodotto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* REQUISITI DESCRIZIONE */}
                <ul className="fs-6" style={{ marginTop: "10px" }}>
                  <li style={{ color: description.length >= 5000 ? "red" : "green" }}>Raccontaci tutto sul tuo prodotto, in massimo 5000 caratteri</li>
                </ul>
              </Form.Group>

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

              <div className="d-flex justify-content-center mt-5">
                <Button variant="white" type="submit" className="border border-dark bubbler-one-regular fs-5 fw-bold w-100">
                  Invia descrizione
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default UserRequest;

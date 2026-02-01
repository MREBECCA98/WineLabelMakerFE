import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import NavbarUser from "../../components/NavbarUser";
import { useEffect, useState } from "react";

function UpdateRequest() {
  const { id } = useParams();
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //GET PER RECUPERARE LA DESCRIZIONE
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

  //MODIFICA DELLA DESCRIZIONE
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
        throw new Error("Errore durante la modifica della descrizione!");
      }

      const data = await response.json();
      setSuccess("La descrizione è stata modificata!", data);

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
      <NavbarUser />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h1 className="text-center bubbler-one-regular fw-bold fs-1">Modifica descrizione </h1>

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

            {/* FORM MODIFICA */}
            <Form onSubmit={handleUpdate} className="mt-4">
              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label className="bubbler-one-regular fs-5">Modifica la descrizione del tuo prodotto</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-6"
                  as="textarea" //TYPE
                  rows={9}
                  maxLength={5000}
                  placeholder="Modifica la descrizione del tuo prodotto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* REQUISITI DESCRIZIONE */}
                <ul className="fs-6" style={{ marginTop: "10px" }}>
                  <li style={{ color: description.length >= 5000 ? "red" : "green" }}>Raccontaci tutto sul tuo prodotto, in massimo 5000 caratteri</li>
                </ul>
              </Form.Group>

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

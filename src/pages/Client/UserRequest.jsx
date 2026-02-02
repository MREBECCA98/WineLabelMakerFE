import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import NavbarUser from "../../components/NavbarUser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserRequest() {
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //BUTTON-CLICK
  const handleClick = () => {
    setTimeout(() => {
      navigate("/userRequestMade");
    }, 2000);
  };

  //CREATE
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
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">RACCONTACI LA MAGIA DEL TUO VINO</h2>
            <p className="mt-3 mb-0 text-center bubbler-one-regular fs-sm-5 fs-3 ">Compila la descrizione del tuo vino includendo tutti gli elementi chiave:</p>
            <div className="mt-4 bubbler-one-regular fs-5">
              <p>
                <strong>Identità -</strong> Personalità profonde del vino : nome, linea, filosofia del produttore
              </p>
              <p>
                <strong>Origine -</strong> Contesto in cui viene prodotto: territorio, denominazione e vitigno, storia del luogo e della cantina
              </p>
              <p>
                <strong>Carattere -</strong> Che tipo di "persona" sarebbe il suo vino?
              </p>
              <p>
                <strong>Destinatario -</strong> Per quale clientela ha prodotto questo vino? (fascia di prezzo e occasione di consumo)
              </p>
              <p>
                <strong>Priorità visive -</strong> Cosa deve risalire per primo nell'etichetta?
              </p>
              <p>
                <strong>Vincoli -</strong> Cosa non si può fare? (obblighi legali, limiti di stampa, budget)
              </p>
              <p>
                <strong>Emozione finale -</strong> Il cliente dovrà provare un emozione quando guarda la sua bottiglia, esattamente come quando si osserva un
                dipinto per ore..
              </p>
            </div>

            {/* FORM RICHIESTA */}
            <Form onSubmit={handleCreate} className="mt-4">
              <Form.Group className="mb-3" controlId="formDescription">
                {/* <Form.Label className="bubbler-one-regular fs-5">Descrizione prodotto</Form.Label> */}
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
                <Button onClick={handleClick} variant="white" type="submit" className="border border-dark bubbler-one-regular fs-5 fw-bold w-100">
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

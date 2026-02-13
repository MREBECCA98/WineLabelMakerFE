import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import NavbarUser from "../../components/NavbarUser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//USER REQUEST
//IS THE PAGE WHERE THE USER CAN SUBMIT A REQUEST
//BASED ON KEY ELEMENTS REQUIRED TO CREATE THE LABEL
//ONCE THE REQUEST IS SUBMITTED, THE USER WILL BE REDIRECTED TO THE "USER REQUEST MADE" PAGE
//WHERE THEY CAN VIEW ALL THEIR REQUESTS AND THEIR CURRENT STATUS

function UserRequest() {
  //LABEL DESCRIPTION FORM
  const [clientData, setClientData] = useState("");
  const [productionParams, setProductionParams] = useState("");
  const [identity, setIdentity] = useState("");
  const [origin, setOrigin] = useState("");
  const [character, setCharacter] = useState("");
  const [target, setTarget] = useState("");
  const [visuals, setVisuals] = useState("");
  const [constraints, setConstraints] = useState("");
  const [emotion, setEmotion] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  //TOKEN EXPIRY
  const navigate = useNavigate();
  const [messageToken, setMessageToken] = useState();

  //CREATE
  const handleCreate = async (e) => {
    e.preventDefault();

    //IF DESCRIPTION IS MISSING IT SHOWS ERROR
    if (!clientData || !productionParams || !identity || !origin || !character || !target || !visuals || !constraints || !emotion) {
      setError("I campi sono obbligatori!");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    //DISPLAY OF THE FINAL DESCRIPTION
    const finalDescription = `
    /DATI DEL CLIENTE :
    ${clientData}

    /PARAMETRI DI PRODUZIONE :
    ${productionParams}

    /IDENTITÀ :
    ${identity}

    /ORIGINE :
    ${origin}

    /CARATTERE :
    ${character}

    /DESTINATARIO :
    ${target}

    /PRIORITÀ VISIVE :
    ${visuals}

    /VINCOLI :
    ${constraints}

    /EMOZIONE FINALE :
    ${emotion}`;

    //TOKEN
    const token = localStorage.getItem("token");

    //FETCH CREATE DESCRIPTION
    try {
      const response = await fetch("https://localhost:7046/api/Request/CreateRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ description: finalDescription }),
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
        throw new Error("Errore nella creazione della richiest!");
      }

      await response.json();

      setSuccess("La creazione della richiesta è andata a buon fine!");
      setTimeout(() => {
        setSuccess("");
        setClientData("");
        setProductionParams("");
        setIdentity("");
        setOrigin("");
        setCharacter("");
        setTarget("");
        setVisuals("");
        setConstraints("");
        setEmotion("");

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
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">RACCONTACI LA MAGIA DEL TUO VINO</h2>
            <p className="mt-3 mb-0 text-center bubbler-one-regular fs-sm-5 fs-3 ">Compila la descrizione del tuo vino includendo tutti gli elementi chiave:</p>

            {/* TOKEN EXPIRY */}
            {messageToken && (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                {messageToken}
              </Alert>
            )}

            {/* MANDATORY REQUIREMENTS FOR LABEL CREATION */}

            <Form onSubmit={handleCreate} className="mt-4 bubbler-one-regular fs-3">
              {/* CUSTOMER DATA */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>DATI DEL CLIENTE -</strong> Cantina di produzione, indirizzo di spedizione, referente, email
                </Form.Label>
                <Form.Control className="bubbler-one-regular fs-3" as="textarea" rows={3} value={clientData} onChange={(e) => setClientData(e.target.value)} />
              </Form.Group>

              {/* PRODUCTION PARAMETERS */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>PARAMETRI DI PRODUZIONE -</strong> Numero di etichette e budjet indicativo
                </Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-3"
                  as="textarea"
                  rows={3}
                  value={productionParams}
                  onChange={(e) => setProductionParams(e.target.value)}
                />
              </Form.Group>

              {/* IDENTITY */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>IDENTITA' -</strong> Personalità profonde del vino : nome, linea, filosofia del produttore
                </Form.Label>
                <Form.Control className="bubbler-one-regular fs-3" as="textarea" rows={3} value={identity} onChange={(e) => setIdentity(e.target.value)} />
              </Form.Group>

              {/* ORIGIN */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>ORIGINE -</strong> Contesto in cui viene prodotto: territorio, denominazione e vitigno, storia del luogo e della cantina
                </Form.Label>
                <Form.Control className="bubbler-one-regular fs-3" as="textarea" rows={3} value={origin} onChange={(e) => setOrigin(e.target.value)} />
              </Form.Group>

              {/* CHARACTER */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>CARATTERE -</strong> Che tipo di "persona" sarebbe il suo vino?
                </Form.Label>
                <Form.Control className="bubbler-one-regular fs-3" as="textarea" rows={3} value={character} onChange={(e) => setCharacter(e.target.value)} />
              </Form.Group>

              {/* TARGET AUDIENCE */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>DESTINATARIO -</strong> Per quale clientela ha prodotto questo vino? (fascia di prezzo e occasione di consumo)
                </Form.Label>
                <Form.Control className="bubbler-one-regular fs-3" as="textarea" rows={3} value={target} onChange={(e) => setTarget(e.target.value)} />
              </Form.Group>

              {/* VISUAL PRIORITIES */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>PRIORITA' VISIVE -</strong> Quale elemento desideri valorizzare sull’etichetta?
                </Form.Label>
                <Form.Control className="bubbler-one-regular fs-3" as="textarea" rows={3} value={visuals} onChange={(e) => setVisuals(e.target.value)} />
              </Form.Group>

              {/* CONSTRAINTS */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>VINCOLI -</strong> Cosa non si può fare? (obblighi legali, limiti di stampa, formato etichetta)
                </Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-3"
                  as="textarea"
                  rows={3}
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                />
              </Form.Group>

              {/* FINAL EMOTION */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>EMOZIONE FINALE -</strong> Il cliente dovrà provare un emozione quando guarda la sua bottiglia, esattamente come quando si osserva un
                  dipinto per ore..
                </Form.Label>
                <Form.Control className="bubbler-one-regular fs-3" as="textarea" rows={3} value={emotion} onChange={(e) => setEmotion(e.target.value)} />
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
                <Button variant="white" type="submit" className="border border-dark bubbler-one-regular fs-4 fw-bold w-100">
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

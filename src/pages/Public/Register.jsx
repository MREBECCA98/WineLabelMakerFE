import { Alert, Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useState } from "react";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../../components/MyNavbar";

//PAGINA REGISTRAZIONE UTENTE
//EFFETTUATA LA REGISTRAZIONE, L'UTENTE VERRA' INDIRIZZATO DIRETTAMENTE NELLA PAGINA LOGIN

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    //CONTROLLO CAMPPI VUOTI
    if (!name || !surname || !email || !companyName || !phoneNumber || !password || !confirmPassword) {
      setError("Compila tutti i campi!");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    //CONTROLLO PASSWORD E CONFERMA PASSWORD
    if (password !== confirmPassword) {
      setError("Le password non coincidono!");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    //OGGETTO BODY
    const body = {
      Email: email,
      Password: password,
      Name: name,
      Surname: surname,
      CompanyName: companyName,
      PhoneNumber: phoneNumber,
    };

    //FETCH REGISTER
    try {
      const response = await fetch("https://localhost:7046/api/AspNetUser/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Errore nella registrazione!");
      }

      setSuccess("Registrazione effettuata con successo!");
      setTimeout(() => {
        setSuccess("");

        //PULIZIA CAMPI FORM
        setName("");
        setSurname("");
        setEmail("");
        setCompanyName("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");

        //QUANDO LA REGISTRAZIONE E' ANDATA A BUON FINE --> NAVIGATE VERSO LOGIN PAGE
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log("Errore durante la registrazione:", error);
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <>
      {/* NAVBAR HOME-WORK-REGISTER-LOGIN */}
      <MyNavbar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">OGNI VINO HA UN RACCONTO..</h2>
            <p className="text-center bubbler-one-regular  fs-3"> Registrati per dare vita a un percorso esclusivo, dove il tuo vino diventa protagonista</p>

            <Form className=" " onSubmit={handleSubmit}>
              {/* NAME --> INPUT CON NOME UTENTE */}
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label className="bubbler-one-regular fs-4 text-black fw-bold">Nome</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-4 mb-3 fw-bold"
                  type="text"
                  placeholder="Inserisci il tuo nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              {/* SURNAME --> INPUT CON COGNOME UTENTE */}
              <Form.Group className="mb-3" controlId="formSurname">
                <Form.Label className="bubbler-one-regular fs-4 text-black fw-bold">Cognome</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-4 mb-3 fw-bold"
                  type="text"
                  placeholder="Inserisci il tuo cognome"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </Form.Group>

              {/* EMAIL --> INPUT EMAIL AZIENDALE (REQUIRED)*/}
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="bubbler-one-regular fs-4 text-black fw-bold">Email aziendale</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-4 mb-3 fw-bold"
                  type="email"
                  placeholder="Inserisci la tua email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              {/* COMPANY NAME --> INPUT NOME AZIENDA (REQUIRED)*/}
              <Form.Group className="mb-3" controlId="formCompanyName">
                <Form.Label className="bubbler-one-regular fs-4 text-black fw-bold">Nome dell'azienda</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-4 mb-3 fw-bold"
                  type="text"
                  placeholder="Inserisci il nome della tua azienda"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </Form.Group>

              {/* PHONE NUMBER --> INPUT NUMERO DI TELEFONO  */}
              <Form.Group className="mb-3" controlId="formPhoneNumber">
                <Form.Label className="bubbler-one-regular fs-4 text-black fw-bold">Numero di telefono</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-4 mb-3 fw-bold"
                  type="tel"
                  placeholder="Inserisci il tuo numero di telefono"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>

              {/* PASSWORD --> INPUT PASSWORD (REQUIRED) */}
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label className="bubbler-one-regular fs-4 text-black fw-bold">Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    className="bubbler-one-regular fs-4 mb-3 fw-bold"
                    type={showPassword ? "text" : "password"}
                    placeholder="Inserisci password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {/* INPUT PER POTER VISUALIZZARE O NASCONDERE LA PASSWORD */}
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Nascondi password" : "Mostra password"}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                </InputGroup>

                {/* REQUISITI PASSWORD --> OBBLIGO PER CREAZIONE PASSWORD */}
                <ul className="fs-5" style={{ marginTop: "10px" }}>
                  <li style={{ color: password.length >= 8 ? "green" : "red" }}>Minimo 8 caratteri</li>
                  <li style={{ color: /[A-Z]/.test(password) ? "green" : "red" }}>Almeno una lettera maiuscola</li>
                  <li style={{ color: /[0-9]/.test(password) ? "green" : "red" }}>Almeno un numero</li>
                  <li style={{ color: /[\W_]/.test(password) ? "green" : "red" }}>Almeno un simbolo speciale</li>
                </ul>
              </Form.Group>

              {/* CONFERMA PASSWORD */}
              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label className="bubbler-one-regular fs-4 text-black fw-bold">Conferma Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    className="bubbler-one-regular fs-4 mb-3 fw-bold"
                    type={showPassword ? "text" : "password"}
                    placeholder="Inserisci password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {/* INPUT PER POTER VISUALIZZARE O NASCONDERE LA PASSWORD */}
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Nascondi password" : "Mostra password"}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              {/* ALERT SUCCESS --> REGISTRAZIONE EFFETTUATA CON SUCCESSO */}
              {success && (
                <Alert variant="success" className="bubbler-one-regular fs-5 fw-bold">
                  {success}
                </Alert>
              )}

              {/* ALERT ERROR --> ERRORE DURANTE LA REGISTRAZIONE - SE LE PASSWORD NON COINCIDONO*/}
              {error && (
                <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                  {error}
                </Alert>
              )}

              <div className="d-flex justify-content-center my-5">
                <Button variant="white" type="submit" className="border border-dark bubbler-one-regular fs-4 fw-bold w-100">
                  Registrati
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default Register;

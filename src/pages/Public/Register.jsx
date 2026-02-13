import { Alert, Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useState } from "react";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../../components/MyNavbar";

//REGISTER PAGE
//-VALIDATE ALL REQUIRED FIELDS
//-CHECKS THAT PASSWORD AND CONFIRM-PASSWORD MATCH
//-SENDS REGISTRATION REQUEST TO BACKEND
//-MANAGES SUCCESS/ ERROR STATES
//-RESETS FORM AND REDIRECTS TO LOGIN PAGE ON SUCCESS

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

    //BASIC CLIENT-SIDE VALIDATION TO ENSURE ALL FIELDS ARE FILLED
    if (!name || !surname || !email || !companyName || !phoneNumber || !password || !confirmPassword) {
      setError("I campi sono obbligatori!");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    //CHECKS THAT PASSWORD AND CONFIRM-PASSWORD MACTH
    if (password !== confirmPassword) {
      setError("Le password non coincidono!");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    const body = {
      Email: email,
      Password: password,
      Name: name,
      Surname: surname,
      CompanyName: companyName,
      PhoneNumber: phoneNumber,
    };

    //SEND REGISTRATION REQUEST TO BACKEND API
    try {
      const response = await fetch("https://localhost:7046/api/AspNetUser/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("L'email inserita è già esistente!");
      }

      setSuccess("Registrazione effettuata con successo!");
      setTimeout(() => {
        setSuccess("");
        setName("");
        setSurname("");
        setEmail("");
        setCompanyName("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");

        //REDIRECT TO LOGIN PAGE AFTER SUCCESSFULL REGISTRATION
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
              {/*USER INFORMATION */}
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

              {/* COMPANY DETAILS*/}
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

              {/* SECURITY */}
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

                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Nascondi password" : "Mostra password"}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                </InputGroup>

                <ul className="fs-5" style={{ marginTop: "10px" }}>
                  <li style={{ color: password.length >= 8 ? "green" : "red" }}>Minimo 8 caratteri</li>
                  <li style={{ color: /[A-Z]/.test(password) ? "green" : "red" }}>Almeno una lettera maiuscola</li>
                  <li style={{ color: /[0-9]/.test(password) ? "green" : "red" }}>Almeno un numero</li>
                  <li style={{ color: /[\W_]/.test(password) ? "green" : "red" }}>Almeno un simbolo speciale</li>
                </ul>
              </Form.Group>

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

                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Nascondi password" : "Mostra password"}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </InputGroup.Text>
                </InputGroup>
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

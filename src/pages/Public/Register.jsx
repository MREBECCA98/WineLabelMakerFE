import { Alert, Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useState } from "react";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../../components/MyNavbar";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    //CONTROLLO CAMPPI VUOTI
    if (!name || !surname || !email || !birthday || !phoneNumber || !password || !confirmPassword) {
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
      PhoneNumber: phoneNumber,
      Birthday: birthday ? `${birthday}T00:00:00` : null,
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
        throw new Error("Errore nella registrazione");
      }

      setSuccess("Registrazione effettuata con successo!");
      setTimeout(() => {
        setSuccess("");

        //PULIZIA CAMPI FORM
        setName("");
        setSurname("");
        setEmail("");
        setBirthday("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");

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
      <MyNavbar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">OGNI VINO HA UN RACCONTO..</h2>
            <p className="text-center bubbler-one-regular  fs-3"> Registrati per dare vita a un percorso esclusivo, dove il tuo vino diventa protagonista</p>

            <Form onSubmit={handleSubmit}>
              {/* NAME */}
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label className="bubbler-one-regular fs-5">Nome</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-6 mb-3"
                  type="text"
                  placeholder="Inserisci il tuo nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              {/* SURNAME */}
              <Form.Group className="mb-3" controlId="formSurname">
                <Form.Label className="bubbler-one-regular fs-5">Cognome</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-6 mb-3"
                  type="text"
                  placeholder="Inserisci il tuo cognome"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </Form.Group>

              {/* EMAIL */}
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="bubbler-one-regular fs-5">Email</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-6 mb-3"
                  type="email"
                  placeholder="Inserisci la tua email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              {/* BIRTHDAY */}
              <Form.Group className="mb-3" controlId="formBirthday">
                <Form.Label className="bubbler-one-regular fs-5">Data di nascita</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-6 mb-3"
                  type="date"
                  placeholder="Inserisci la tua data di nascita"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </Form.Group>

              {/* PHONE NUMBER */}
              <Form.Group className="mb-3" controlId="formPhoneNumber">
                <Form.Label className="bubbler-one-regular fs-5">Numero di telefono</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-6 mb-3"
                  type="tel"
                  placeholder="Inserisci il tuo numero di telefono"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>

              {/* PASSWORD */}
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label className="bubbler-one-regular fs-5">Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    className="bubbler-one-regular fs-6"
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

                {/* REQUISITI PASSWORD */}
                <ul className="fs-6" style={{ marginTop: "10px" }}>
                  <li style={{ color: password.length >= 8 ? "green" : "red" }}>Minimo 8 caratteri</li>
                  <li style={{ color: /[A-Z]/.test(password) ? "green" : "red" }}>Almeno una lettera maiuscola</li>
                  <li style={{ color: /[0-9]/.test(password) ? "green" : "red" }}>Almeno un numero</li>
                  <li style={{ color: /[\W_]/.test(password) ? "green" : "red" }}>Almeno un simbolo speciale</li>
                </ul>
              </Form.Group>

              {/* CONFERMA PASSWORD */}
              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label className="bubbler-one-regular fs-5">Conferma Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    className="bubbler-one-regular fs-6"
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

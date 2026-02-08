import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "../../components/MyNavbar";

//localStorage.setItem("chiave", "valore") - salva un dato.
//localStorage.getItem("chiave") - recupera un dato.
//localStorage.removeItem("chiave") - elimina un dato specifico.
//localStorage.clear() - elimina tutti i dati salvati.

function Login() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "Admin") navigate("/message");
      else navigate("/userRequestMade");
    }
  }, []);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    //SE USERNAME O PASSWORD SONO VUOTI MOSTRA ERRORE
    if (!username || !password) {
      setError("Inserisci Username e Password!");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    //FETCH LOGIN
    try {
      const response = await fetch("https://localhost:7046/api/AspNetUser/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Username o password errati");
      }

      const data = await response.json();
      console.log("Login riuscito:", data);

      //TOKEN - ROLE
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      setSuccess("Login effettuato con successo!");
      setTimeout(() => {
        setSuccess("");

        //PULIZIA CAMPI FORM
        setUsername("");
        setPassword("");

        //USE NAVIGATE IN BASE AL RUOLO
        if (data.role === "Admin") {
          navigate("/message");
        } else {
          navigate("/userRequestMade");
        }
      }, 2000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError("");

        //PULIZIA CAMPI FORM
        setUsername("");
        setPassword("");
      }, 2000);
    }
  };

  return (
    <>
      <MyNavbar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h2 className="text-center mt-4 bubbler-one-regular fw-bold fs-1 ">IL TUO PRODOTTO - LA TUA STORIA!</h2>
            <p className="text-center bubbler-one-regular  fs-3">
              Accedi per raccontarci l'esprit del tuo prodotto, lasciaci trasformare il tuo vino in un’opera d’arte!
            </p>

            {/*ALERT SUCCESS */}
            {success ? (
              <Alert variant="success" className="bubbler-one-regular fs-5 fw-bold">
                {success}
              </Alert>
            ) : null}

            {/*ALERT ERROR */}
            {error ? (
              <Alert variant="danger" className="bubbler-one-regular fs-5 fw-bold">
                {error}
              </Alert>
            ) : null}

            <Form onSubmit={handleSubmit}>
              {/* USERNAME */}
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label className="bubbler-one-regular fs-4 text-black fw-bold">Email</Form.Label>
                <Form.Control
                  className="bubbler-one-regular fs-4 mb-3 fw-bold"
                  type="email"
                  placeholder="Inserisci username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              {/* PASSWORD */}
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
              </Form.Group>

              <div className="d-flex justify-content-center mt-5">
                <Button variant="white" type="submit" className="border border-dark bubbler-one-regular fs-4 fw-bold w-100">
                  Accedi
                </Button>
              </div>
            </Form>

            {/* //REGISTER LINK */}
            <div className="text-center mt-5">
              <span className="bubbler-one-regular fs-3">Non hai un account? </span>
              <Link to="/register" className="bubbler-one-regular fs-3 fw-bold text-decoration-none">
                Registrati !
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;

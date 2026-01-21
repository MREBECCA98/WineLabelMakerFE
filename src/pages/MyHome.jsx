import { Container } from "react-bootstrap";

function Home() {
  return (
    <Container>
      <div>
        <p className="bubbler-one-regular text-center mt-4 mb-0" style={{ fontSize: "1.5rem" }}>
          Benvenuto in
        </p>
        <h1 className="bubbler-one-regular text-center ">Wine Label Maker</h1>
      </div>
    </Container>
  );
}

export default Home;

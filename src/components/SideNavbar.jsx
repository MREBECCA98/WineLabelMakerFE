import { Link } from "react-scroll";

function SideNavbar() {
  return (
    <nav className="side-navbar d-none d-md-flex flex-row flex-md-column justify-content-around bubbler-one-regular fs-4 mt-4">
      <Link to="chi-siamo" smooth={true} duration={250} spy={true} offset={-150} className="mb-2 text-dark text-decoration-none">
        La nostra storia
      </Link>
      <Link to="per-chi-è" smooth={true} duration={250} spy={true} offset={-150} className="mb-2 text-dark text-decoration-none">
        Il vino, la tua identità
      </Link>
      <Link to="come-iniziare" smooth={true} duration={250} spy={true} offset={-80} className="mb-2 text-dark text-decoration-none">
        Inizia il viaggio
      </Link>
    </nav>
  );
}
export default SideNavbar;

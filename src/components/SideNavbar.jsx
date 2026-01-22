import { Link } from "react-scroll";

function SideNavbar() {
  return (
    <nav className="side-navbar d-none d-md-flex flex-row flex-md-column justify-content-around bubbler-one-regular fs-4">
      <Link to="intro" smooth={true} duration={250} spy={true} offset={-50} className="mb-2 text-dark text-decoration-none">
        Intro
      </Link>
      <Link to="chi-siamo" smooth={true} duration={250} spy={true} offset={-50} className="mb-2 text-dark text-decoration-none">
        Chi siamo
      </Link>
      <Link to="contatti" smooth={true} duration={250} spy={true} offset={-50} className="mb-2 text-dark text-decoration-none">
        Contatti
      </Link>
    </nav>
  );
}
export default SideNavbar;

import { Link } from "react-scroll";

function SideNavbar() {
  return (
    <nav className="side-navbar d-none d-md-flex flex-row flex-md-column justify-content-around bubbler-one-regular fs-4 mt-4">
      <Link to="chi-siamo" smooth={true} duration={250} spy={true} offset={-150} className="mb-4 text-black text-decoration-none">
        LA NOSTRA STORIA
      </Link>
      <Link to="per-chi-è" smooth={true} duration={250} spy={true} offset={-150} className="mb-4 text-black text-decoration-none">
        IL VINO, LA TUA IDENTITA'
      </Link>
      <Link to="come-iniziare" smooth={true} duration={250} spy={true} offset={-150} className=" text-black text-decoration-none">
        INIZIA IL VIAGGIO
      </Link>
    </nav>
  );
}
export default SideNavbar;

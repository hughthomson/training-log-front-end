import './style/Nav.css';
import { logout } from "../firebase";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from "react-router-dom";

function NavFull() {
  const navigate = useNavigate();

  return (
    <div className='nav'>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand style={{cursor: "pointer"}} onClick={() => {
            navigate('/dashboard')
          }}>Training Log</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
            </Nav>
            <Nav className="d-flex">
              <Nav.Link href="" onClick={logout}>Log out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavFull;

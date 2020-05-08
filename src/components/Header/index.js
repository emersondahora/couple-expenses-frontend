import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";

import { signOut } from "~/store/modules/auth/actions";

import { Navbar } from "./styles";

import logo from "~/assets/logo-header.svg";

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.profile);
  function handleSignOut() {
    dispatch(signOut());
  }
  return (
    <Navbar variant="dark" bg="dark" expand="md">
      <Navbar.Brand as={Link} to="/">
        <img src={logo} className="logo" alt="Couple Expenses" />
      </Navbar.Brand>
      <Nav>
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboard">
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/categories">
            Categorias
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/paymant-forms">
            Formas de Pagamento
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          {user.name}
          <Button variant="link" onClick={handleSignOut}>
            Sair
          </Button>
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}
/*
 <Container>

      <ul>
        {links.map(([label, url]) => (
          <li key={url}>
            <Link
              to={url}
              className={
                history.location.pathname.indexOf(url) !== -1 ? "selected" : ""
              }
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <strong>{user.name}</strong>
        <button type="button" onClick={handleSignOut}>
          Sair do sistema
        </button>
      </div>
    </Container> */

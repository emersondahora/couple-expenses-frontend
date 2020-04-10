import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

import { signOut } from "~/store/modules/auth/actions";

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.profile);
  const categories = useSelector(state => state.category.categories);
  const paymentforms = useSelector(state => state.paymentform.paymentforms);
  function handleSignOut() {
    dispatch(signOut());
  }
  return (
    <Navbar variant="dark" bg="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        Couple expenses
      </Navbar.Brand>
      <Nav>
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboard">
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/expenses">
            Histórico de compras
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/categories">
            Categorias ({categories.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/paymant-forms">
            Formas de Pagamento ({paymentforms.length})
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

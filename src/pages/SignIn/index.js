import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";

import { signInRequest, signFailure } from "~/store/modules/auth/actions";

import logo from "~/assets/logo.svg";
import { prepareSubmit } from "~/util/form";

export default function SignIn() {
  const [validated, setValidated] = useState(false);
  const dispath = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  useEffect(() => {
    dispath(signFailure());
  }, [dispath]);

  const handleSubmit = event => {
    const data = prepareSubmit(event);
    if (loading) return;
    setValidated(true);
    if (data) {
      const { email, password } = data;
      dispath(signInRequest(email, password));
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <img src={logo} alt="Couple Expenses" />
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          name="email"
          required
          type="email"
          placeholder="Usuário"
        />
        <Form.Control.Feedback type="invalid">
          Por favor, informe um e-mail válido
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Control
          required
          name="password"
          type="password"
          placeholder="Senha"
        />
        <Form.Control.Feedback type="invalid">
          Por favor, informe a senha
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? "Carregando..." : "Login"}
      </Button>
    </Form>
  );
}

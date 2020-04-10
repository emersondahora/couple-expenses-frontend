import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { prepareSubmit } from "~/util/form";
import api from "~/service/api";

export default function PaymentFormForm({ paymentId, onCancel, onFinish }) {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const paymentform = useSelector(state =>
    state.paymentform.paymentforms.filter(item => item.id === paymentId)
  )[0];

  useEffect(() => {
    setValidated(false);
    setLoading(false);
  }, [paymentId]);

  const handleSubmit = async event => {
    const data = prepareSubmit(event);
    if (loading) return;
    setValidated(true);
    if (data) {
      setLoading(true);
      try {
        if (!paymentform) {
          await api.post("/payment-forms", data);
        } else {
          await api.put(`/payment-forms/${paymentId}`, data);
        }
        onFinish();
        toast.success("Forma de pagamento salva com sucesso.");
      } finally {
        setLoading(false);
      }
    }
  };
  const days = Array.from(Array(31).keys()).map(item => item + 1);
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          name="name"
          required
          type="text"
          placeholder="Nome da forma de pagamento"
          defaultValue={paymentform?.name}
        />
        <Form.Control.Feedback type="invalid">
          Por favor, o nome da forma de pagamento
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label>Dia de Vencimento</Form.Label>
        <Form.Control as="select" name="expiration_day">
          <option value="">Selecione</option>
          {days.map(day => (
            <option
              key={day}
              value={day}
              selected={paymentform?.expiration_day === day}
            >
              {day}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          Por favor, informe a senha
        </Form.Control.Feedback>
      </Form.Group>
      <Button
        variant="danger"
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="mr-2"
      >
        Cancelar
      </Button>
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? "Carregando..." : "Salvar"}
      </Button>
    </Form>
  );
}

PaymentFormForm.propTypes = {
  paymentId: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired
};

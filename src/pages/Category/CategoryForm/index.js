import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { prepareSubmit } from "~/util/form";
import api from "~/service/api";

export default function CategoryForm({ categoryId, onCancel, onFinish }) {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const category = useSelector(state =>
    state.category.categories.filter(item => item.id === categoryId)
  )[0];
  const users = useSelector(state => state.user.users);
  const [hasCategoryDivision, setHasCategoryDivision] = useState();
  useEffect(() => {
    setValidated(false);
    setLoading(false);
    setHasCategoryDivision(category?.division.length > 0);
  }, [category, categoryId]);

  const handleSubmit = async event => {
    const data = prepareSubmit(event);
    if (loading) return;
    setValidated(true);

    if (data) {
      if (data.division) {
        data.division = data.division.map((item, index) => ({
          user_id: users[index].id,
          percent: Number(item)
        }));
      }
      setLoading(true);
      try {
        if (!category) {
          await api.post("/categories", data);
        } else {
          await api.put(`/categories/${categoryId}`, data);
        }
        onFinish();
        toast.success("Categoria salva com sucesso.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group controlId="name">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          name="name"
          required
          type="text"
          placeholder="Nome da categoria"
          defaultValue={category?.name}
        />
        <Form.Control.Feedback type="invalid">
          Por favor, o nome da categoria
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="expenseDivision">
        <Form.Check
          type="checkbox"
          checked={hasCategoryDivision}
          onChange={event => setHasCategoryDivision(event.target.checked)}
          label=" Divisão das despesas"
        />
      </Form.Group>

      {hasCategoryDivision &&
        users.map(user => (
          <Form.Group controlId="name">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>{user.name}</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required
                type="number"
                min="0"
                max="100"
                maxLength="3"
                minLength="1"
                // 100 / users.length
                defaultValue={
                  category?.division.find(item => item.user_id === user.id)
                    ?.percent || 100 / users.length
                }
                name="division[]"
              />
              <InputGroup.Append>
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup.Append>
              <Form.Control.Feedback type="invalid">
                Por favor, informe um valor entre 0% e 100%
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        ))}
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

CategoryForm.propTypes = {
  categoryId: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired
};

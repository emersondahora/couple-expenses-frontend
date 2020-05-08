import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  parseISO,
  setMonth,
  startOfMonth,
  setYear,
  isAfter,
  setDate,
  addMonths,
  getYear,
  getMonth
} from "date-fns";
import DatePicker from "react-datepicker";
import { Button, Modal, Form, InputGroup, Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Proptypes from "prop-types";

import { dateFormat, monthList } from "~/util/format";
import api from "~/service/api";

import { validateExpense } from "./functions";

export default function ExpenseForm(props) {
  const { onHide, show } = props;
  const userProfile = useSelector(state => state.user.profile);
  const users = useSelector(state => state.user.users);
  const categories = useSelector(state => state.category.categories);
  const paymentforms = useSelector(state => state.paymentform.paymentforms);

  const descriptionInput = useRef(null);

  const initialExpense = useMemo(
    () => ({
      user_id: userProfile.id,
      description: "",
      category_id: "",
      payment_form_id: "",
      expense_date: dateFormat(new Date(), "yyyy-MM-dd"),
      month: "",
      year: "",
      installment_total: 1,
      amount: 0,
      division: users.map(u => ({ user_id: u.id, amount: 0 }))
    }),
    [userProfile.id, users]
  );

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [expense, setExpense] = useState(initialExpense);
  const [options, setOptions] = useState({
    nextExpenseOnSave: true,
    customMonth: false,
    customDivision: false
  });

  const calculateMonthExpense = () => {
    if (options.customMonth) return;
    if (expense.expense_date) {
      const paymentForm = paymentforms.find(
        pf => pf.id === Number(expense.payment_form_id)
      );
      const expense_date = parseISO(expense.expense_date);
      const expiration_day = setDate(expense_date, paymentForm?.expiration_day);
      const dateMonthExpense = isAfter(expense_date, expiration_day)
        ? addMonths(expense_date, 1)
        : expense_date;
      setExpense(prevState => ({
        ...prevState,
        year: getYear(dateMonthExpense),
        month: getMonth(dateMonthExpense)
      }));
    }
  };

  const calculateAmountDivision = () => {
    if (options.customDivision) return;
    const { category_id, amount, division } = expense;
    const { division: catDivision } =
      categories.find(k => k.id === Number(category_id)) || {};
    if (catDivision) {
      const newDivision = division.map(dv => {
        const { percent } =
          catDivision.find(cd => cd.user_id === dv.user_id) || {};
        return { ...dv, amount: (amount * percent) / 100 };
      });
      const rest = amount - newDivision.reduce((sum, dv) => sum + dv.amount, 0);
      newDivision[0].amount += rest;
      setExpense(prev => ({ ...prev, division: newDivision }));
    }
  };

  useEffect(calculateMonthExpense, [
    expense.expense_date,
    expense.payment_form_id,
    options.customMonth
  ]);
  useEffect(calculateAmountDivision, [
    expense.amount,
    expense.category_id,
    options.customDivision
  ]);
  useEffect(() => {
    if (show) {
      descriptionInput.current.focus();
    }
  }, [show]);

  const resetForm = keepBases => {
    const { description, installment_total, amount, division } = initialExpense;
    const resetedForm = keepBases
      ? { ...expense, description, installment_total, amount, division }
      : { ...initialExpense };
    setValidated(false);
    setErrors({});
    setExpense(resetedForm);
  };

  const handleOptionsChange = (option, checked) => {
    setOptions(prevState => ({ ...prevState, [option]: checked }));
  };

  const handleHide = () => {
    if (loading) return;
    resetForm();
    onHide();
  };

  const handleFieldChange = (field, subField, value) => {
    const data = { ...expense };
    switch (field) {
      case "expense_date":
        data[field] = dateFormat(value, "yyyy-MM-dd");
        break;
      case "division":
        data.division[subField].amount = value;
        break;
      default:
        data[field] = value;
        break;
    }
    setExpense(data);
    if (errors[field] || field === "amount" || field === "division") {
      const cleanError = { ...errors };
      delete cleanError[field];
      if (field === "amount" || field === "division") {
        delete cleanError.sumAmount;
      }
      setErrors(cleanError);
      setValidated(false);
    }
  };

  const handleSubmit = async event => {
    setValidated(true);
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const errList = await validateExpense(expense);
    if (!errList) {
      setLoading(true);
      try {
        const expenseSend = { ...expense };
        expenseSend.month = startOfMonth(
          setYear(setMonth(new Date(), expense.month), expense.year)
        );
        await api.post("expenses", expenseSend);
      } finally {
        setLoading(false);
      }
      toast.success("Categoria salva com sucesso.");
      resetForm(true);
      descriptionInput.current.focus();
    }
    setErrors(errList);
    return false;
  };
  return (
    <Modal
      {...props}
      onHide={handleHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Despesa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="category">
                <Form.Label>Proprietário</Form.Label>
                <Form.Control
                  name="user_id"
                  as="select"
                  required
                  value={expense.user_id}
                  onChange={e =>
                    handleFieldChange(e.target.name, null, e.target.value)
                  }
                  isInvalid={errors.user_id}
                  isValid={validated && !errors.user_id}
                >
                  {users.map(user => (
                    <option value={user.id} key={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.user_id}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="name">
                <Form.Label>Despesa</Form.Label>
                <Form.Control
                  name="description"
                  required
                  type="text"
                  placeholder="Descrição da despesa"
                  onChange={e =>
                    handleFieldChange(e.target.name, null, e.target.value)
                  }
                  value={expense.description}
                  isInvalid={errors.description}
                  isValid={validated && !errors.description}
                  ref={descriptionInput}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="category">
                <Form.Label>Categoria</Form.Label>
                <Form.Control
                  name="category_id"
                  as="select"
                  required
                  value={expense.category_id}
                  onChange={e =>
                    handleFieldChange(e.target.name, null, e.target.value)
                  }
                  isInvalid={errors.category_id}
                  isValid={validated && !errors.category_id}
                >
                  <option value="">Selecione a categoria</option>
                  {categories.map(category => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.category_id}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="name">
                <Form.Label>Forma de Pagamento</Form.Label>
                <Form.Control
                  as="select"
                  name="payment_form_id"
                  value={expense.payment_form_id}
                  onChange={e =>
                    handleFieldChange(e.target.name, null, e.target.value)
                  }
                  isInvalid={errors.payment_form_id}
                  isValid={validated && !errors.payment_form_id}
                >
                  <option value="">Selecione a forma de pagamento</option>
                  {paymentforms.map(paymentForm => (
                    <option value={paymentForm.id} key={paymentForm.id}>
                      {paymentForm.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.payment_form_id}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Group controlId="category">
                <Form.Label>Data da Despesa</Form.Label>
                <DatePicker
                  className={[
                    "form-control",
                    errors.expense_date ? "is-invalid" : "",
                    validated && !errors.expense_date ? "is-valid" : ""
                  ]}
                  dateFormat="dd/MM/yyyy"
                  selected={
                    expense.expense_date ? parseISO(expense.expense_date) : null
                  }
                  onChange={date => handleFieldChange("expense_date", 0, date)}
                />

                <Form.Control.Feedback
                  type="invalid"
                  className={errors.expense_date && "d-block"}
                >
                  {errors.expense_date}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Label>Mês da despesa</Form.Label>
              <InputGroup>
                <Form.Control
                  as="select"
                  name="month-month"
                  value={expense.month}
                  onChange={e =>
                    handleFieldChange("month", null, e.target.value)
                  }
                  isInvalid={errors.month}
                  isValid={validated && !errors.month}
                  disabled={!options.customMonth}
                >
                  <option value="">Mês</option>
                  {monthList().map(month => (
                    <option value={month.value} key={month.value}>
                      {month.label}
                    </option>
                  ))}
                </Form.Control>
                <InputGroup.Text>/</InputGroup.Text>
                <Form.Control
                  placeholder="Ano"
                  value={expense.year}
                  onChange={e =>
                    handleFieldChange("year", null, e.target.value)
                  }
                  type="number"
                  isInvalid={errors.year}
                  isValid={validated && !errors.year}
                  disabled={!options.customMonth}
                />
              </InputGroup>
              <Form.Control.Feedback
                type="invalid"
                className={(errors.month || errors.year) && "d-block"}
              >
                <Row>
                  <Col>
                    <div>{errors.month}</div>
                  </Col>
                  <Col>
                    <div>{errors.year}</div>
                  </Col>
                </Row>
              </Form.Control.Feedback>
              <Form.Check
                id="customMonth"
                label="Personalizado"
                type="checkbox"
                checked={options.customMonth}
                onChange={({ target }) =>
                  handleOptionsChange("customMonth", target.checked)
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="name">
                <Form.Label>Quantidade de parcelas</Form.Label>
                <Form.Control
                  name="installment_total"
                  required
                  type="number"
                  placeholder="Parcelas"
                  value={expense.installment_total}
                  onChange={e =>
                    handleFieldChange("installment_total", null, e.target.value)
                  }
                  isInvalid={errors.installment_total}
                  isValid={validated && !errors.installment_total}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.installment_total}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="name">
                <Form.Label>Valor das parcelas</Form.Label>
                <InputGroup>
                  <InputGroup.Text>R$</InputGroup.Text>
                  <CurrencyFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    className={[
                      "form-control",
                      errors.amount || errors.sumAmount ? "is-invalid" : "",
                      validated && !errors.amount ? "is-valid" : ""
                    ].join(" ")}
                    allowNegative={false}
                    isNumericString
                    value={expense.amount}
                    onValueChange={values => {
                      const { value } = values;
                      handleFieldChange("amount", null, value);
                    }}
                  />
                </InputGroup>

                <Form.Control.Feedback
                  type="invalid"
                  className={errors.amount && "d-block"}
                >
                  {errors.amount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <Form.Label>Divisão da despesa</Form.Label>
          <Form.Check
            id="customDivision"
            label="Personalizado"
            type="checkbox"
            checked={options.customDivision}
            onChange={({ target }) =>
              handleOptionsChange("customDivision", target.checked)
            }
          />
          <Form.Control.Feedback type="invalid" className="d-block">
            {errors.sumAmount}
          </Form.Control.Feedback>
          <Row>
            {expense.division.map((dv, index) => {
              const user = users.find(us => us.id === dv.user_id);

              return (
                <Col
                  key={user.id}
                  style={{
                    backgroundColor: user.display_color,
                    paddingTop: 10
                  }}
                >
                  <Form.Group controlId="name">
                    <Form.Label>{user.short_name}</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>R$</InputGroup.Text>
                      <CurrencyFormat
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        isNumericString
                        value={expense.division[index].amount}
                        onValueChange={({ value }) =>
                          handleFieldChange("division", index, value)
                        }
                        disabled={!options.customDivision}
                        className={[
                          "form-control",
                          (errors.division && errors.division[index]) ||
                          errors.sumAmount
                            ? "is-invalid"
                            : "",
                          validated && !errors.division && !errors.sumAmount
                            ? "is-valid"
                            : ""
                        ].join(" ")}
                      />
                    </InputGroup>
                    <Form.Control.Feedback
                      type="invalid"
                      className={
                        errors.division && errors.division[index]
                          ? "d-block"
                          : null
                      }
                    >
                      {errors.division && errors.division[index]}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              );
            })}
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleHide} variant="danger" disabled={loading}>
          Fechar
        </Button>
        <Button
          onClick={() => handleSubmit()}
          variant="success"
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="rotate mr-2" />
              <span>Enviando...</span>
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ExpenseForm.propTypes = {
  onHide: Proptypes.func.isRequired,
  show: Proptypes.bool.isRequired
};

import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Table, Button, Overlay, Popover } from "react-bootstrap";
import { useSelector } from "react-redux";
import { MdEdit, MdDelete } from "react-icons/md";
import PropTypes from "prop-types";

import api from "~/service/api";

export default function PaymentList({ onEdit, onDelete }) {
  const paymentforms = useSelector(state => state.paymentform.paymentforms);

  const excludeElementInitalState = {
    paymentItem: null,
    target: null,
    show: false
  };
  const [excludeElement, setExcludeElement] = useState(
    excludeElementInitalState
  );
  const ref = useRef(null);

  const handleClickExcludePayment = (event, paymentItem) => {
    if (!paymentItem || paymentItem?.id === excludeElement.paymentItem?.id) {
      setExcludeElement(excludeElementInitalState);
    } else {
      setExcludeElement({
        ...excludeElementInitalState,
        paymentItem,
        target: event.target,
        show: true
      });
    }
  };

  const handleConfirmExcludePayment = async () => {
    handleClickExcludePayment();
    await api.delete(`/payment-forms/${excludeElement.paymentItem.id}`);
    toast.success("Forma de pagamento apagada.");
    onDelete();
  };

  return (
    <>
      <Overlay
        show={excludeElement.show}
        target={excludeElement.target}
        placement="bottom"
        container={ref.current}
      >
        <Popover id="popover-contained">
          <Popover.Title as="h3">Popover bottom</Popover.Title>
          <Popover.Content>
            <Button
              variant="dark"
              className="mr-1"
              onClick={() => handleClickExcludePayment()}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmExcludePayment}>
              Confirmar
            </Button>
          </Popover.Content>
        </Popover>
      </Overlay>
      <Table striped bordered hover ref={ref}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Vencimento</th>
            <th align="right" width={180}>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {paymentforms.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.expiration_day}</td>
              <td align="right">
                <Button onClick={() => onEdit(item.id)} className="mr-1">
                  <MdEdit />
                </Button>

                <Button
                  variant="danger"
                  onClick={event => handleClickExcludePayment(event, item)}
                >
                  <MdDelete />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

PaymentList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

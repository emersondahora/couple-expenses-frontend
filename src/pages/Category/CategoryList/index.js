import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Table, Button, Overlay, Popover, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { MdEdit, MdDelete } from "react-icons/md";
import PropTypes from "prop-types";

import api from "~/service/api";

export default function CategoryList({ onEdit, onDelete }) {
  const categories = useSelector(state => state.category.categories);
  const excludeElementInitalState = {
    categoryItem: null,
    target: null,
    show: false
  };
  const [excludeElement, setExcludeElement] = useState(
    excludeElementInitalState
  );
  const ref = useRef(null);

  const handleClickExcludeCategory = (event, categoryItem) => {
    if (!categoryItem || categoryItem?.id === excludeElement.categoryItem?.id) {
      setExcludeElement(excludeElementInitalState);
    } else {
      setExcludeElement({
        ...excludeElementInitalState,
        categoryItem,
        target: event.target,
        show: true
      });
    }
  };

  const handleConfirmExcludePayment = async () => {
    handleClickExcludeCategory();
    await api.delete(`/categories/${excludeElement.categoryItem.id}`);
    toast.success("Categoria apagada.");
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
          <Popover.Title as="h3">Exluir categoria?</Popover.Title>
          <Popover.Content>
            <Button
              variant="dark"
              className="mr-1"
              onClick={() => handleClickExcludeCategory()}
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
            <th>Divisão</th>
            <th align="right" width={180}>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <ListGroup>
                  {item.division?.map(division => (
                    <ListGroup.Item>
                      {division.User.name} (<strong>{division.percent}%</strong>
                      )
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </td>
              <td align="right">
                <Button onClick={() => onEdit(item.id)} className="mr-1">
                  <MdEdit />
                </Button>

                <Button
                  variant="danger"
                  onClick={event => handleClickExcludeCategory(event, item)}
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

CategoryList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

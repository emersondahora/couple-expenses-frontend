import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Button, Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import Proptypes from "prop-types";

import { ExpensiveBlock, Collapse } from "../styles";

export default function CategoryList({ owner_id, category }) {
  const users = useSelector(state => state.user.users);
  const [openList, setopenList] = useState(true);
  const openListToggle = () => {
    setopenList(!openList);
  };

  return (
    <ExpensiveBlock>
      <h1>
        {category.name}
        <div>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip id="button-tooltip">
                {users.map(user => (
                  <div key={user.short_name}>
                    {user.short_name} (
                    {
                      category.divisions.find(item => item.user_id === user.id)
                        .amountFormated
                    }
                    )
                  </div>
                ))}
              </Tooltip>
            }
          >
            <span>{category.amountFormated}</span>
          </OverlayTrigger>

          <Button variant="link" onClick={() => openListToggle()}>
            {openList ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Button>
        </div>
      </h1>

      <Collapse in={openList}>
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Despesa</th>
                <th width="10" className="text-center">
                  Data
                </th>
                <th width="10" className="text-center">
                  Parcelas
                </th>
                <th width="10" className="text-center">
                  Valor
                </th>
                {users
                  .filter(item => item.id !== owner_id)
                  .map(user => (
                    <th width="10" key={user.short_name}>
                      {user.short_name}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {category.expenses.map(expense => (
                <tr key={String(expense.id)}>
                  <td>{expense.description}</td>
                  <td>{expense.date}</td>
                  <td className="text-center">
                    {expense.installment_current}/{expense.installment_total}
                  </td>
                  <td>{expense.amountFormated}</td>
                  {expense.divisions
                    .filter(item => item.user_id !== owner_id)
                    .map(division => (
                      <th key={division.user_id}>{division.amountFormated}</th>
                    ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Collapse>
    </ExpensiveBlock>
  );
}

CategoryList.propTypes = {
  owner_id: Proptypes.number.isRequired,
  category: Proptypes.shape({
    name: Proptypes.string,
    amountFormated: Proptypes.string,
    divisions: Proptypes.arrayOf(Proptypes.shape({})),
    expenses: Proptypes.arrayOf(Proptypes.shape({}))
  }).isRequired
};

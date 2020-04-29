import React from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Button, Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import Proptypes from "prop-types";

import { formatPrice } from "~/util/format";
import { ExpensiveBlock, Collapse } from "../styles";

export default function CategoryList({
  owner_id,
  ownerIndex,
  categoryIndex,
  category,
  users,
  handleToggleCategory
}) {
  return (
    <ExpensiveBlock key={String(category.category_id)}>
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
                    {formatPrice(
                      category.divisions.find(item => item.user_id === user.id)
                        .amount
                    )}
                    )
                  </div>
                ))}
              </Tooltip>
            }
          >
            <span>{formatPrice(category.amount)}</span>
          </OverlayTrigger>

          <Button
            variant="link"
            onClick={() => handleToggleCategory(ownerIndex, categoryIndex)}
          >
            {category.open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Button>
        </div>
      </h1>

      <Collapse in={category.open}>
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
                  <td>{formatPrice(expense.amount)}</td>
                  {users
                    .filter(item => item.id !== owner_id)
                    .map(user => (
                      <th key={user.short_name}>
                        {formatPrice(
                          expense.divisions.find(
                            item => item.user_id === user.id
                          ).amount
                        )}
                      </th>
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
  ownerIndex: Proptypes.number.isRequired,
  categoryIndex: Proptypes.number.isRequired,
  category: Proptypes.objectOf().isRequired,
  users: Proptypes.arrayOf().isRequired,
  handleToggleCategory: Proptypes.func.isRequired
};

import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { startOfMonth } from "date-fns";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Button, Table, OverlayTrigger, Tooltip } from "react-bootstrap";

import { formatPrice, dateFormat } from "~/util/format";
import { findOrCreateArray } from "~/util/general";
import api from "~/service/api";

import { ExpensiveBlock, Collapse } from "./styles";
import { Container } from "~/styles/mainStyles";

function processExpenses(expenses) {
  const formatExpenses = expense => {
    expense.amountFormated = formatPrice(expense.amount);
    expense.date = dateFormat(expense.expense_date);
    return expense;
  };

  const reducerExpensesOwners = (draft, expense) => {
    return findOrCreateArray(
      draft,
      item => item.user_id === expense.user_id,
      {
        user_id: expense.user_id,
        name: expense.user.name,
        display_color: expense.user.display_color,
        open: true,
        expenses: [expense]
      },
      owner => {
        owner.expenses.push(expense);
      }
    );
  };

  const summirazeExpenses = groupExpenses => {
    groupExpenses.amount = groupExpenses.expenses.reduce(
      (amount, expense) => amount + expense.amount,
      0
    );
    groupExpenses.amountFormated = formatPrice(groupExpenses.amount);

    // Summarize groupExpenses division
    groupExpenses.divisions = groupExpenses.expenses.reduce(
      (divisions, expense) => {
        expense.divisions.forEach(division => {
          divisions = findOrCreateArray(
            divisions,
            item => item.user_id === division.user_id,
            { ...division, amountFormated: formatPrice(division.amount) },
            userDivision => {
              userDivision.amount += division.amount;
              userDivision.amountFormated = formatPrice(userDivision.amount);
            }
          );
        });
        return divisions;
      },
      []
    );

    return groupExpenses;
  };

  const groupCategories = owner => {
    const reducerCategories = (draft, expense) => {
      return findOrCreateArray(
        draft,
        category => category.category_id === expense.category_id,
        {
          category_id: expense.category_id,
          name: expense.category.name,
          open: true,
          expenses: [expense]
        },
        category => {
          category.expenses.push(expense);
        }
      );
    };

    owner.categories = owner.expenses
      .reduce(reducerCategories, [])
      .map(summirazeExpenses);
    return owner;
  };
  return expenses
    .map(formatExpenses)
    .reduce(reducerExpensesOwners, [])
    .map(summirazeExpenses)
    .map(groupCategories);
}

export default function Dashboard() {
  const [summaryExpenses, setSummaryExpenses] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState([]);
  const [monthExpenses] = useState(startOfMonth(new Date()));
  const users = useSelector(state => state.user.users);
  useEffect(() => {
    const loadExpenses = async () => {
      const response = await api.get("/expenses", { month: monthExpenses });
      const expenses = response.data;
      setGroupedExpenses(processExpenses(expenses));
    };
    loadExpenses();
  }, [monthExpenses]);

  const handleToggleOwner = index => {
    const _expenses = [...groupedExpenses];
    _expenses[index].open = !_expenses[index].open;
    setGroupedExpenses(_expenses);
  };
  const handleToggleCategory = (ownerIndex, categoryIndex) => {
    const _expenses = [...groupedExpenses];
    _expenses[ownerIndex].categories[categoryIndex].open = !_expenses[
      ownerIndex
    ].categories[categoryIndex].open;
    setGroupedExpenses(_expenses);
  };

  return (
    <Container>
      {groupedExpenses.map((ownerExpense, ownerIndex) => (
        <ExpensiveBlock display_color={ownerExpense.display_color}>
          <h1 variant="dark">
            <span>{ownerExpense.name}</span>
            <div>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip id="button-tooltip">
                    {users
                      .filter(item => item.id !== ownerExpense.user_ids)
                      .map(user => (
                        <div>
                          {user.short_name} (
                          {formatPrice(
                            ownerExpense.divisions.find(
                              item => item.user_id === user.id
                            ).amount
                          )}
                          )
                        </div>
                      ))}
                  </Tooltip>
                }
              >
                <span>{formatPrice(ownerExpense.amount)}</span>
              </OverlayTrigger>

              <Button
                variant="link"
                onClick={() => handleToggleOwner(ownerIndex)}
              >
                {ownerExpense.open ? (
                  <MdKeyboardArrowUp />
                ) : (
                  <MdKeyboardArrowDown />
                )}
              </Button>
            </div>
          </h1>
          <Collapse in={ownerExpense.open}>
            <div>
              {ownerExpense.categories.map((category, categoryIndex) => (
                <ExpensiveBlock>
                  <h1>
                    {category.name}
                    <div>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                          <Tooltip id="button-tooltip">
                            {users
                              .filter(item => item.id !== ownerExpense.user_ids)
                              .map(user => (
                                <div>
                                  {user.short_name} (
                                  {formatPrice(
                                    category.divisions.find(
                                      item => item.user_id === user.id
                                    ).amount
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
                        onClick={() =>
                          handleToggleCategory(ownerIndex, categoryIndex)
                        }
                      >
                        {category.open ? (
                          <MdKeyboardArrowUp />
                        ) : (
                          <MdKeyboardArrowDown />
                        )}
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
                              .filter(item => item.id !== ownerExpense.user_id)
                              .map(user => (
                                <th width="10">{user.short_name}</th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {category.expenses.map(expense => (
                            <tr>
                              <td>{expense.description}</td>
                              <td>{expense.date}</td>
                              <td className="text-center">
                                {expense.installment_current}/
                                {expense.installment_total}
                              </td>
                              <td>{formatPrice(expense.amount)}</td>
                              {users
                                .filter(
                                  item => item.id !== ownerExpense.user_id
                                )
                                .map(user => (
                                  <th>
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
              ))}
            </div>
          </Collapse>
        </ExpensiveBlock>
      ))}
    </Container>
  );
}

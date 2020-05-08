import React from "react";
import { useSelector } from "react-redux";
import Proptypes from "prop-types";

import { Table } from "react-bootstrap";
import { SummaryContainer } from "../styles";

export default function Summary({ summary }) {
  const users = useSelector(state => state.user.users);
  const userDeficit = users.find(us => us.id === summary.deficitResult.user_id);
  return (
    <SummaryContainer>
      <div>
        <h1>Resumo do Mês</h1>
        <Table striped>
          <tbody>
            <tr>
              <th>Total de Despesas</th>
              <th>{summary.amountFormated}</th>
            </tr>
            {users.map(user => {
              const owner = summary.owners.find(ow => ow.user_id === user.id);
              return (
                <tr
                  key={user.id}
                  style={{ backgroundColor: user.display_color }}
                >
                  <th>{user.short_name} tem que receber</th>
                  <td>{owner?.deficitFormated || "R$ 0,00"}</td>
                </tr>
              );
            })}
            <tr>
              <th> Diferença</th>
              <td>{summary.deficitResult.deficitFormated}</td>
            </tr>
            <tr style={{ backgroundColor: userDeficit.display_color }}>
              <th>Quem deve receber:</th>
              <th>{userDeficit.name}</th>
            </tr>
          </tbody>
        </Table>
      </div>
      <div>
        <h1>Resumo por Categoria</h1>
        <Table striped hover>
          <thead>
            <tr>
              <th>Categoria</th>
              {users.map(user => (
                <th key={user.id}>{user.short_name}</th>
              ))}
              <th>Total (R$)</th>
              <th className="text-center">Porcentagem</th>
            </tr>
          </thead>
          <tbody>
            {summary.categories.map(category => (
              <tr key={category.category_id}>
                <th>{category.name}</th>
                {users.map(user => (
                  <td key={user.id}>
                    {category.owners.find(owner => owner.user_id === user.id)
                      ?.amountFormated || "R$ 0,00"}
                  </td>
                ))}

                <td>{category.amountFormated}</td>
                <td className="text-center">{category.percent}%</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </SummaryContainer>
  );
}

Summary.propTypes = {
  summary: Proptypes.shape({
    amountFormated: Proptypes.string,
    owners: Proptypes.arrayOf(
      Proptypes.shape({
        user_id: Proptypes.number,
        deficitFormated: Proptypes.string
      })
    ),
    categories: Proptypes.arrayOf(
      Proptypes.shape({
        category_id: Proptypes.number,
        name: Proptypes.string,
        amountFormated: Proptypes.string,
        owners: Proptypes.arrayOf(
          Proptypes.shape({
            user_id: Proptypes.number,
            deficitFormated: Proptypes.string
          })
        )
      })
    ),
    deficitResult: Proptypes.shape({
      deficitFormated: Proptypes.string,
      user_id: Proptypes.number
    })
  }).isRequired
};

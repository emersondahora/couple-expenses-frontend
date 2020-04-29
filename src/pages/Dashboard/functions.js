import { ArrayMerge } from "~/util/general";

import { formatPrice, dateFormat } from "~/util/format";

export function processExpenses(expenses) {
  const formatExpenses = expense => {
    expense.amountFormated = formatPrice(expense.amount);
    expense.date = dateFormat(expense.expense_date);
    return expense;
  };

  const reducerExpensesOwners = (draft, expense) => {
    return ArrayMerge(
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
          divisions = ArrayMerge(
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
      return ArrayMerge(
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

export const summarizeExpenses = groupedExpenses => {
  const summirazed = {
    amount: groupedExpenses.reduce(
      (amount, owners) => amount + owners.amount,
      0
    ),
    owners: groupedExpenses.map(owner => ({
      user_id: owner.user_id,
      name: owner.name,
      amount: owner.amount,
      deficit: owner.divisions.reduce(
        (deficit, user) =>
          owner.user_id !== user.user_id ? deficit + user.amount : deficit,
        0
      )
    })),
    categories: groupedExpenses.reduce((draft, owner) => {
      owner.categories.forEach(category =>
        ArrayMerge(
          draft,
          categoryFinder => categoryFinder.category_id === category.category_id,
          {
            category_id: category.category_id,
            name: category.name,
            amount: category.amount,
            amountFormated: category.amountFormated,
            owners: [
              {
                user_id: owner.user_id,
                amount: category.amount,
                amountFormated: formatPrice(category.amount)
              }
            ]
          },
          categoryFound => {
            categoryFound.amount += category.amount;
            categoryFound.amountFormated = formatPrice(categoryFound.amount);
            categoryFound.owners.push({
              user_id: owner.user_id,
              amount: category.amount,
              amountFormated: formatPrice(category.amount)
            });
          }
        )
      );
      return draft;
    }, [])
  };
  summirazed.amountFormated = formatPrice(summirazed.amount);
  // calculating who owes who
  summirazed.deficitResult = summirazed.owners.reduce(
    (draft, owner) => {
      if (owner.deficit > draft.deficit) {
        draft = {
          deficit: owner.deficit - draft.deficit,
          user_id: owner.user_id
        };
        draft.deficitFormated = formatPrice(draft.deficit);
      }
      return draft;
    },
    { deficit: 0 }
  );
  return summirazed;
};

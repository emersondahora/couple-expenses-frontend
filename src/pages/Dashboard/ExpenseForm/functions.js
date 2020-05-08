import * as Yup from "yup";

const schema = Yup.object().shape({
  user_id: Yup.number().required("Selecione o proprietário da despesa."),
  description: Yup.string().required("Informe a descrição da despesa."),
  category_id: Yup.number().typeError("Selecione a categoria da despesa."),
  payment_form_id: Yup.number().typeError(
    "Selecione a forma de pagamento da despesa."
  ),
  expense_date: Yup.date()
    .required("Informe a data da despesa.")
    .typeError("Informe a data da despesa."),
  month: Yup.number()
    .required("Informe o mês da despesa")
    .typeError("Informe o mês da despesa"),
  year: Yup.number()
    .min(2019, "O ano não pode ser inferior a 2019")
    .max(2050, "O ano não pode ser superior a 2050")
    .typeError("Informe o ano da despesa")
    .required("Selecione o ano da despesa"),
  installment_total: Yup.number()
    .typeError("Informe a quantidade de parcelas")
    .required("Informe a quantidade de parcelas")
    .max(99, "Número de parcelas inválida")
    .min(1, "Número de parcelas inválida"),
  amount: Yup.number()
    .typeError("Informe o valor da parcela")
    .required("Informe o valor da parcela")
    .min(0.01, "Informe um valor válido"),
  division: Yup.array()
    .of(
      Yup.object().shape({
        user_id: Yup.number().required(),
        amount: Yup.number()
          .required("Informe um valor válido")
          .typeError("Informe um valor válido")
      })
    )
    .required()
});

export const validateExpense = async expense => {
  const errList = {};
  let isValid = true;
  try {
    // Validate expense data
    await schema.validate(expense, { abortEarly: false });
  } catch (err) {
    isValid = false;
    if (err instanceof Yup.ValidationError) {
      err.inner.forEach(error => {
        const obj = /division\[([0-9]*)\]\.amount/.exec(error.path);
        if (obj) {
          if (!errList.division) {
            errList.division = [];
          }
          errList.division[obj[1]] = error.message;
        } else {
          errList[error.path] = error.message;
        }
      });
    }
  }
  const divisionAmount = expense.division.reduce(
    (amount, division) => amount + Number(division.amount),
    0
  );
  if (divisionAmount !== Number(expense.amount)) {
    isValid = false;
    errList.sumAmount =
      "A soma da divisão tem que ser igual ao valor das parcelas.";
  }
  return !isValid ? errList : false;
};

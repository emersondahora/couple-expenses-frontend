import pt from "date-fns/locale/pt";
import { format, parseISO } from "date-fns";

export const { format: formatPrice } = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export const dateFormat = date =>
  format(parseISO(date), "dd/MM/yyyy", { locale: pt });

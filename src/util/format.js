import pt from "date-fns/locale/pt";
import { format, parseISO, startOfYear, addMonths } from "date-fns";

export const { format: formatPrice } = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export const { format: formatNumber } = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2
});

export const capitalizeFirstLetter = string => {
  try {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } catch (error) {
    return "";
  }
};

export const dateFormat = (date, format_type = "dd/MM/yyyy") => {
  try {
    const date_ = typeof date === "string" ? parseISO(date) : date;
    return format(date_, format_type, { locale: pt });
  } catch (error) {
    return null;
  }
};

export const monthList = () => {
  const initalDate = startOfYear(new Date());
  const mounths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return mounths.map(mounth => ({
    label: capitalizeFirstLetter(
      dateFormat(addMonths(initalDate, mounth), "MMMM")
    ),
    value: mounth
  }));
};

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  startOfMonth,
  setMonth,
  addMonths,
  subMonths,
  setYear
} from "date-fns";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdAdd
} from "react-icons/md";

import { Button, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

import { dateFormat, capitalizeFirstLetter, monthList } from "~/util/format";
import api from "~/service/api";

import { HeaderMonth, AddButton } from "./styles";
import { Container } from "~/styles/mainStyles";

import { processExpenses, summarizeExpenses } from "./functions";
import OwnerList from "./Components/OwnerList";
import Summary from "./Components/Summary";
import ExpenseForm from "./ExpenseForm";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(true);
  const [monthExpenses, setMonthExpenses] = useState(startOfMonth(new Date()));

  const groupedExpenses = useMemo(() => processExpenses(expenses), [expenses]);
  const summaryExpenses = useMemo(() => summarizeExpenses(groupedExpenses), [
    groupedExpenses
  ]);

  const mounthActual = useMemo(
    () => capitalizeFirstLetter(dateFormat(monthExpenses, "MMMM")),
    [monthExpenses]
  );
  const yearActual = useMemo(() => dateFormat(monthExpenses, "yyyy"), [
    monthExpenses
  ]);

  const handleLoadExpenses = () => {
    const loadExpenses = async () => {
      setLoading(true);
      const response = await api.get("/expenses", {
        params: { month: monthExpenses }
      });
      setLoading(false);
      setExpenses(response.data);
    };
    loadExpenses();
  };

  useEffect(handleLoadExpenses, [monthExpenses]);

  const handleExpenseFormShow = show => {
    setShowExpenseForm(show);
    if (!show) {
      handleLoadExpenses();
    }
  };

  const handleChangeDate = useCallback(
    (type, value) => {
      switch (type) {
        case "next":
          setMonthExpenses(addMonths(monthExpenses, 1));
          break;
        case "prev":
          setMonthExpenses(subMonths(monthExpenses, 1));
          break;
        case "setMonth":
          setMonthExpenses(setMonth(monthExpenses, value));
          break;
        case "setYear":
          setMonthExpenses(setYear(monthExpenses, value));
          break;
        default:
          return false;
      }
      return false;
    },
    [monthExpenses]
  );

  return (
    <Container>
      <ExpenseForm
        show={showExpenseForm}
        onHide={() => handleExpenseFormShow(false)}
      />
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip id="button-tooltip">Adicionar Despesa</Tooltip>}
      >
        <AddButton onClick={() => handleExpenseFormShow(true)}>
          <MdAdd />
        </AddButton>
      </OverlayTrigger>
      <HeaderMonth>
        <Button variant="light" onClick={() => handleChangeDate("prev")}>
          <MdKeyboardArrowLeft />
        </Button>
        <Dropdown>
          <Dropdown.Toggle variant="light">{mounthActual}</Dropdown.Toggle>

          <Dropdown.Menu>
            {useMemo(
              () =>
                monthList().map(mounth => (
                  <Dropdown.Item
                    key={mounth.label}
                    active={mounth.label === mounthActual}
                    as="button"
                    onClick={() => handleChangeDate("setMonth", mounth.value)}
                  >
                    {mounth.label}
                  </Dropdown.Item>
                )),
              [handleChangeDate, mounthActual]
            )}
          </Dropdown.Menu>
        </Dropdown>
        <span>/</span>
        <Dropdown>
          <Dropdown.Toggle variant="light">{yearActual}</Dropdown.Toggle>
          <Dropdown.Menu>
            {useMemo(() => {
              const nYear = Number(yearActual);
              return new Array(5)
                .fill(nYear)
                .map((year, iterator) => year + iterator - 2)
                .map(year => (
                  <Dropdown.Item
                    key={year}
                    active={year === nYear}
                    onClick={() => handleChangeDate("setYear", year)}
                  >
                    {year}
                  </Dropdown.Item>
                ));
            }, [handleChangeDate, yearActual])}
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="light" onClick={() => handleChangeDate("next")}>
          <MdKeyboardArrowRight />
        </Button>
      </HeaderMonth>
      {groupedExpenses.length > 0 && !loading ? (
        <>
          <Summary summary={summaryExpenses} />
          {groupedExpenses.map(owner => (
            <OwnerList key={owner.user_id} owner={owner} />
          ))}
        </>
      ) : (
        <h1 className="text-center d-block">
          {loading
            ? "Carregando..."
            : "Sem movimentação financeira para este mês"}
        </h1>
      )}
    </Container>
  );
}

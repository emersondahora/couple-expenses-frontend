import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { startOfMonth, startOfYear, addMonths, subMonths } from "date-fns";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import { Button, Dropdown } from "react-bootstrap";

import { dateFormat, capitalizeFirstLetter, monthList } from "~/util/format";
import api from "~/service/api";

import { HeaderMonth } from "./styles";
import { Container } from "~/styles/mainStyles";
import { processExpenses, summarizeExpenses } from "./functions";
import OwnerList from "./Components/OwnerList";

export default function Dashboard() {
  const [_, setSummaryExpenses] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState([]);
  const [monthExpenses, setMonthExpenses] = useState(startOfMonth(new Date()));
  const users = useSelector(state => state.user.users);

  useEffect(() => {
    const loadExpenses = async () => {
      const response = await api.get("/expenses", {
        params: { month: monthExpenses }
      });
      const expenses = response.data;
      const grupedExpenses = processExpenses(expenses);
      summarizeExpenses(grupedExpenses);
      setSummaryExpenses(setGroupedExpenses(grupedExpenses));
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

  const handleChangeMonth = useCallback(
    month => {
      setMonthExpenses(addMonths(startOfYear(monthExpenses), month));
    },
    [monthExpenses]
  );
  const handleNextMonth = useCallback(() => {
    setMonthExpenses(addMonths(monthExpenses, 1));
  }, [monthExpenses]);
  const handlePreviousMonth = useCallback(() => {
    setMonthExpenses(subMonths(monthExpenses, 1));
  }, [monthExpenses]);

  const mounthActual = useMemo(
    () => capitalizeFirstLetter(dateFormat(monthExpenses, "MMMM")),
    [monthExpenses]
  );
  const yearActual = useMemo(() => dateFormat(monthExpenses, "yyyy"), [
    monthExpenses
  ]);

  const mounthList = useMemo(
    () =>
      monthList().map(mounth => (
        <Dropdown.Item
          key={mounth.label}
          active={mounth.label === mounthActual}
          as="button"
          onClick={() => handleChangeMonth(mounth.value)}
        >
          {mounth.label}
        </Dropdown.Item>
      )),
    [handleChangeMonth, mounthActual]
  );
  const yearList = useMemo(() => {
    const nYear = Number(yearActual);
    return new Array(5)
      .fill(nYear)
      .map((year, iterator) => year + iterator - 2)
      .map(year => (
        <Dropdown.Item key={year} active={year === nYear}>
          {year}
        </Dropdown.Item>
      ));
  }, [yearActual]);
  return (
    <Container>
      <HeaderMonth>
        <Button variant="light" onClick={() => handlePreviousMonth()}>
          <MdKeyboardArrowLeft />
        </Button>
        <Dropdown>
          <Dropdown.Toggle variant="light">{mounthActual}</Dropdown.Toggle>

          <Dropdown.Menu>{mounthList}</Dropdown.Menu>
        </Dropdown>
        <span>/</span>
        <Dropdown>
          <Dropdown.Toggle variant="light">{yearActual}</Dropdown.Toggle>
          <Dropdown.Menu>{yearList}</Dropdown.Menu>
        </Dropdown>
        <Button variant="light" onClick={() => handleNextMonth()}>
          <MdKeyboardArrowRight />
        </Button>
      </HeaderMonth>
      {groupedExpenses.map((owner, index) => (
        <OwnerList
          key={owner.id}
          ownerIndex={index}
          owner={owner}
          users={users}
          handleToggleOwner={handleToggleOwner}
          handleToggleCategory={handleToggleCategory}
        />
      ))}
    </Container>
  );
}

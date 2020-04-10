import React, { useState } from "react";
import { Tabs, Tab, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { MdAdd, MdList, MdRefresh } from "react-icons/md";

import { loadPaymentFormRequest } from "~/store/modules/paymentform/actions";

import { Container } from "./styles";

import PaymentFormForm from "./PaymentFormForm";
import PaymentFormList from "./PaymentFormList";

export default function PaymentForms() {
  const [currentTab, setCurrentTab] = useState("report");
  const [paymentId, setPaymentId] = useState(null);

  const dispatch = useDispatch();

  const handleTab = (tab, id) => {
    setPaymentId(id);
    setCurrentTab(tab);
  };

  const handleEditButton = id => {
    handleTab("form", id);
  };

  const handleFinish = () => {
    dispatch(loadPaymentFormRequest());
    handleTab("report");
  };
  return (
    <Container>
      <h1>
        Formas de Pagamento
        <Button variant="link" title="Atualizar Lista" onClick={handleFinish}>
          <MdRefresh />
        </Button>
      </h1>
      <Tabs
        variant="pills"
        id="controlled-tab-example"
        activeKey={currentTab}
        onSelect={tab => handleTab(tab)}
      >
        <Tab
          eventKey="report"
          title={
            <span>
              <MdList /> Lista
            </span>
          }
        >
          <PaymentFormList onEdit={handleEditButton} onDelete={handleFinish} />
        </Tab>
        <Tab
          eventKey="form"
          title={
            <span>
              <MdAdd /> Formulário
            </span>
          }
        >
          <PaymentFormForm
            paymentId={paymentId}
            onCancel={() => handleTab("report")}
            onFinish={handleFinish}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}

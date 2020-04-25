import React, { useState } from "react";
import { Tabs, Tab, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { MdAdd, MdList, MdRefresh } from "react-icons/md";

import { loadCategoryRequest } from "~/store/modules/category/actions";

import { Container } from "~/styles/mainStyles";

import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";

export default function Categorys() {
  const [currentTab, setCurrentTab] = useState("report");
  const [categoryId, setCategoryId] = useState(null);

  const dispatch = useDispatch();

  const handleTab = (tab, id) => {
    setCategoryId(id);
    setCurrentTab(tab);
  };

  const handleEditButton = id => {
    handleTab("form", id);
  };

  const handleFinish = () => {
    dispatch(loadCategoryRequest());
    handleTab("report");
  };
  return (
    <Container>
      <h1>
        Categorias
        <Button variant="link" title="Atualizar Lista" onClick={handleFinish}>
          <MdRefresh />
        </Button>
      </h1>
      <Tabs
        variant="pills"
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
          <CategoryList onEdit={handleEditButton} onDelete={handleFinish} />
        </Tab>
        <Tab
          eventKey="form"
          title={
            <span>
              <MdAdd /> Formulário
            </span>
          }
        >
          <CategoryForm
            categoryId={categoryId}
            onCancel={() => handleTab("report")}
            onFinish={handleFinish}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}

import React, { useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import { useField } from "@unform/core";
import PropTypes from "prop-types";

export default function Input({ name, ...rest }) {
  const inputRef = useRef(null);
  const { fieldName, defaultValue = "", registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value"
    });
  }, [fieldName, registerField]);

  return (
    <>
      <Form.Control ref={inputRef} defaultValue={defaultValue} {...rest} />
      {error && <Form.Text className="text-muted">{error}</Form.Text>}
      <Form.Control.Feedback type="invalid">Testando</Form.Control.Feedback>
    </>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired
};

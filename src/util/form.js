import * as Yup from "yup";

export const schemaValidate = async (schema, data, formRef) => {
  try {
    // Remove all previous errors
    formRef.current.setErrors({});

    await schema.validate(data, {
      abortEarly: false
    });
    return true;
  } catch (err) {
    const validationErrors = {};

    if (err instanceof Yup.ValidationError) {
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });

      formRef.current.setErrors(validationErrors);
    }
    return false;
  }
};

export const getFormData = form => {
  const formData = new FormData(form);
  const object = {};
  formData.forEach(function(value, key) {
    if (value) object[key] = value;
  });
  return object;
};

export const prepareSubmit = event => {
  event.preventDefault();
  event.stopPropagation();
  const form = event.currentTarget;

  if (form.checkValidity() === false) {
    event.stopPropagation();
    return false;
  }
  return getFormData(form);
};

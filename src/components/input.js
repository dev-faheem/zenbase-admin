import { Field, ErrorMessage } from "formik";

export default function Input({
  id,
  label,
  placeholder,
  type,
  disabled = false,
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <Field
        id={id}
        name={id}
        placeholder={placeholder}
        type={type}
        className="form-control"
        disabled={disabled}
      />
      <ErrorMessage name={id} component="div" className="text-danger" />
    </div>
  );
}

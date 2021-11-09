import { Field, ErrorMessage } from "formik";

export default function AuthInput({
  id,
  label,
  placeholder,
  helper = null,
  type = "text",
}) {
  return (
    <div className="form-group">
      <div className="form-label-group">
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
        {helper}
      </div>
      <Field
        type={type}
        className="form-control form-control-lg"
        id={id}
        name={id}
        placeholder={placeholder}
      />
      <ErrorMessage component="div" className="text-danger" name={id} />
    </div>
  );
}

const FormRow = ({
  type,
  name,
  value,
  handleChange,
  labelText,
  max = '',
  disabled = false,
}) => {
  return (
    <div className='form-row'>
      <label htmlFor={name} className='form-label'>
        {labelText || name}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        className='form-input'
        maxLength={max}
        disabled={disabled}
      />
    </div>
  );
};
export default FormRow;

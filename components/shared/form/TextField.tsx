import { InputProps } from "@/lib/interfaces/form"

function TextField({
  type,
  value,
  placeholder = 'Enter input',
  onChange,
  minLength,
  maxLength,
  width = 100,
  height = 40,
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      minLength={minLength}
      maxLength={maxLength}
      autoComplete="on"
      className={`px-4 py-2 text-main rounded-md border border-gray-300 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary ${className}`}
      style={{ width: `${width}%`, height: `${height}px` }}
      {...props}
    />
  )
}

export default TextField

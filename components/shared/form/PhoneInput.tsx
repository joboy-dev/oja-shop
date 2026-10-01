import React from "react"
import locationHandler from 'countrycitystatejson';
import SearchableSelectField from "./SearchableSelect";
import FormInput from "./FormInput";


interface PhoneInputProps {
  label?: string
  control: any
  phoneName: string
  className?: string
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  control,
  phoneName,
  className = ""
}) => {
  const countries = locationHandler.getCountries()

  return (
    <div className="w-full space-y-1 mb-4">
      {label && <label className="block mb-4 text-sm font-medium text-foreground">{label}</label>}

      <div
        className={`h-[40px] flex items-center gap-1 ${className}`}
      >
        <SearchableSelectField
            name="phone_country_code"
            control={control}
            placeholder='Code'
            className="text-sm border-none outline-none bg-transparent pr-2 max-w-[200px]"
            onChange={(option) => {
                console.log(option?.value)
            }}
            options={countries.map((country, i) => ({
                key: i,
                label: `${country.emoji} +${country.phone}- ${country.name}`,
                value: `+${country.phone}`
            }))}
        />

        <FormInput
            placeholder="Phone number"
            name={phoneName}
            className="flex-1"
        />
      </div>
    </div>
  )
}

export default PhoneInput

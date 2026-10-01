import { useState } from 'react'
import locationHandler from 'countrycitystatejson';
import FormInput from './FormInput';
import SearchableSelectField from './SearchableSelect';

interface SelectLocationProps {
  showCountryField?: boolean
  showStateField?: boolean
  showCityField?: boolean
  postalCodeName?: string
  control: any
  className?: string
  defaultCountry?: string
  defaultState?: string
  defaultCity?: string
}

function SelectLocationFields({
    control,
    showCountryField = true,
    showStateField = true,
    showCityField = true,
    postalCodeName,
    className,
    defaultCountry,
    defaultState,
    defaultCity
}: SelectLocationProps) {
    
  const countries = locationHandler.getCountries()
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [states, setStates] = useState<string[]>(defaultState ? [defaultState] : [])
  const [cities, setCities] = useState<string[]>(defaultCity ? [defaultCity] : [])

  return (
    <div className={`grid grid-cols-2 gap-x-6 max-md:grid-cols-1 ${className}`}>
        {showCountryField &&<SearchableSelectField
            name="country"
            control={control}
            label="Country"
            placeholder='Select country'
            onChange={(option) => {
                // field.onChange(option?.value)
                let selectedCountryData = countries.find((country) => country.name === option?.value)
                setSelectedCountry(selectedCountryData?.shortName ?? "")
                setStates(locationHandler.getStatesByShort(selectedCountryData?.shortName ?? "") ?? [])
                setCities([])
                console.log(option?.value)
                console.log(selectedCountryData)
            }}
            options={countries.map((country, i) => ({
                key: i,
                label: `${country.emoji} ${country.name}`,
                value: country.name
            }))}
            defaultValue={defaultCountry}
        />}

        {showStateField &&<SearchableSelectField
            name="state"
            control={control}
            disabled={states.length === 0}
            label="State"
            placeholder='Select state'
            onChange={(option) => {
                // field.onChange(option?.value)
                console.log(selectedCountry)
                console.log(option?.value)
                setCities(locationHandler.getCities(
                    selectedCountry ?? "", 
                    option?.value ?? ""
                ) ?? [])
                console.log(cities)
            }}
            options={states.map((state, i) => ({
                key: i,
                label: state,
                value: state
            }))}
            defaultValue={defaultState}
        />}

        {showCityField && <SearchableSelectField
            name="city"
            control={control}
            label="City"
            disabled={cities.length === 0}
            placeholder='Select city'
            onChange={(option) => {
                console.log(option?.value)
            }}
            options={cities.map((city, i) => ({
                key: i,
                label: city,
                value: city
            }))}
            defaultValue={defaultCity}
        />}

        {postalCodeName && <FormInput
            name={postalCodeName}
            label='Postal Code'
            placeholder="Postal Code"
        />}
    </div>
  )
}

export default SelectLocationFields
import SearchableSelectField from './SearchableSelect'
import locationHandler from 'countrycitystatejson';

export default function CurrencySelect({
    control,
    name='currency'
}: {control: any, name?: string}) {
  const countries = locationHandler.getCountries()
  
  return (
    <SearchableSelectField
        name={name ?? "currency"}
        control={control}
        label="Currency"
        placeholder='Select currency'
        onChange={(option) => {
            console.log(option?.value)
        }}
        options={countries.map((country, i) => ({
            key: i,
            label: `${country.emoji} ${country.currency} (${country.name})`,
            value: country.currency
        }))}
    />
  )
}

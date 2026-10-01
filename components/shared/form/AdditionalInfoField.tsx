import { useState } from 'react';
import DynamicFormGroup, { type FieldGroup } from './DynamicFormGroup';

export default function AdditionalInfoField({
    header="Additional Info",
    methods,
    name="additional_info",
    keyToRemoveName,
    // onRemove,
    defaultFields
}: {
  header?: string, 
  methods: any, 
  name?: string, 
  keyToRemoveName?: string, 
  // onRemove?: (group: FieldGroup) => void,
  defaultFields?: FieldGroup[];
}) {

  const [keysToRemove, setKeysToRemove] = useState<string[]>([])

  return (
    <DynamicFormGroup
        header={header}
        label1='Key'
        label2='Value'
        onChange={(groups) => {
            const formatted = groups.map(group => ({
                key: group.first,
                value: group.second
            }));
            methods.setValue(name, formatted);
        }}
        onRemove={(group) => {
          if (keyToRemoveName) {
            const updatedKeys = [group.first, ...keysToRemove];
            setKeysToRemove(updatedKeys);
            console.log(updatedKeys);
            methods.setValue(keyToRemoveName, updatedKeys);
          }
        }}
        defaultFields={defaultFields}
    />
  )
}

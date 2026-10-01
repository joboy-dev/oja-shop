import { useState } from 'react'
import TextField from './TextField';
import Button from '../button/Button';
import { generateRandomString } from '@/lib/utils/string';

export interface FieldGroup {
  id: string;
  first: string;
  second: string;   
}

interface DynamicFieldGroupProps {
  header?: string;
  label1: string;
  label2: string;
  onChange: (groups: FieldGroup[]) => void;
  defaultFields?: FieldGroup[];
  onRemove?: (group: FieldGroup) => void
}

export default function DynamicFormGroup({
    header,
    label1,
    label2,
    onChange,
    onRemove,
    defaultFields
}: DynamicFieldGroupProps) {

    const [fields, setFields] = useState<FieldGroup[]>(
        defaultFields && defaultFields.length > 0
            ? defaultFields
            : [{ id: generateRandomString(10), first: "", second: "" }]
    );

    const updateFields = (updated: FieldGroup[]) => {
        setFields(updated);
        onChange(updated);
    };

    const handleChange = (index: number, key: "first" | "second", value: string) => {
        const updated = [...fields];
        updated[index][key] = value;
        updateFields(updated);
    };

    const handleAdd = () => {
        updateFields([...fields, { id: generateRandomString(10), first: "", second: "" }]);
    };

    const handleRemove = (index: number) => {
        if (onRemove) {
            onRemove(fields[index])
        }
        const updated = [...fields];
        updated.splice(index, 1);
        updateFields(updated);
    };

    return (
        <div className='mb-4'>
            {header && <p className='text-bold text-base mb-2'>{header}</p>}
            {fields.map((field, index) => (
                <div key={field.id} className='flex gap-4 items-end mb-4'>
                    <div className="flex-1">
                        <TextField
                            type='text'
                            value={field.first}
                            onChange={(e) => handleChange(index, "first", e.target.value)}
                            placeholder={label1}
                        />
                    </div>

                    <div className="flex-1">
                        <TextField
                            type='text'
                            value={field.second}
                            onChange={(e) => handleChange(index, "second", e.target.value)}
                            placeholder={label2}
                        />
                    </div>

                    <Button 
                        type='button'
                        variant='dangerOutline' 
                        size='sm'
                        onClick={() => handleRemove(index)}
                    >
                        -
                    </Button>
                </div>
            ))}
            <Button 
                type='button'
                variant='primary' 
                size='sm'
                onClick={handleAdd}
            >
                + Add
            </Button>
        </div>
    )
}

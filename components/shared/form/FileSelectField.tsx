"use client"

import { useEffect } from 'react'
import SearchableSelectField from './SearchableSelect'
import { filterDocumentFiles, filterImageFiles } from '@/lib/utils/file'
import ImageComponent from '../Image'
import { useFileStore } from '@/lib/stores/file/file'

export default function FileSelectField({
    control,
    name="file_id",
    label="Select file",
    placeholder="Select file",
    model_name="others",
    file_type="image",
}: {
    control: any
    name?: string
    label?: string
    placeholder?: string
    model_name?: string
    file_type?: "image" | "document"
}) {
    const { files, selectedFile, fetchFiles, setSelectedFile } = useFileStore()

    useEffect(() => {
        fetchFiles({
            model_name: model_name,
        })
    }, [])

    return (
        <div>
            <SearchableSelectField
                label={label}
                name={name}
                placeholder={placeholder}
                options={
                    file_type === "image" ? filterImageFiles(files).map(file => ({
                        label: file.file_name,
                        value: file.id,
                        key: file.file_name.length,
                    })) : filterDocumentFiles(files).map(file => ({
                        label: file.file_name,
                        value: file.id,
                        key: file.file_name.length,
                    }))
                }
                control={control}
                onChange={(value) => {
                    setSelectedFile(files.find(file => file.id === value?.value) ?? undefined)
                }}
            />

            {selectedFile && (
            <div className='flex items-center gap-2 mt-4'>
                <ImageComponent
                    src={selectedFile?.url ?? ""}
                    alt={selectedFile?.file_name ?? ""}
                    width={100}
                    lazy={false}
                    />
            </div>
            )}
        </div>
    )
}

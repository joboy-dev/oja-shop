"use client"

import { useEffect, useState } from 'react'
import ImageComponent from './Image'
import FormModal from './modal/FormModal'
import Button from './button/Button'
import FormFileUpload from './form/FormFileUpload'
import { useZodForm } from '@/lib/hooks/useZodForm'
import { fileBaseSchema, type FileBaseFormData } from '@/lib/validators/file'
import { objectToFormData } from '@/lib/utils/objectToFormData'
import Loading from '@/app/loading'
import { useFileStore } from '@/lib/stores/file/file'

export default function Gallery({   
    model_name,
    model_id
}: {
    model_name: string
    model_id?: string
}) {
    const { files, isLoading, fetchFiles, createFile } = useFileStore()

    const [ openFileUploadModal, setOpenFileUploadModal ] = useState<boolean>(false)
    const methods = useZodForm(fileBaseSchema)

    useEffect(() => {
        fetchFiles({
            model_id: model_id,
            model_name: model_name,
        })
    }, [])

    const submitCreateForm = (data: FileBaseFormData) => {
        console.log(data)
        const formData = objectToFormData(data)
        createFile(formData)
    }

    return isLoading ? <Loading/> : (
        <div>
            <FormModal
                title='Upload File'
                subtitle='Upload a file'
                isOpen={openFileUploadModal}
                setIsOpen={setOpenFileUploadModal}
                onSubmit={methods.handleSubmit(submitCreateForm as any)}
                isSubmitting={isLoading}
                methods={methods}
            >
                <FormFileUpload
                    name='file'
                    accept='image/*'
                />

            </FormModal>

            {files.length === 0
                ? <div className='h-[15vh] flex items-center justify-center flex-col'>
                    <p>No images available</p>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setOpenFileUploadModal(true)}
                    >
                        Add
                    </Button>
                </div>
                // :  <div className=' p-6 grid items-center justify-center grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4'>
                : <div className='p-6'>
                    <div className="flex items-center justify-between">
                        <p className='p mb-4'>Number of images: <span className='text-lg text-foreground font-bold'>{files.length}</span> </p>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setOpenFileUploadModal(true)}
                        >
                            Add
                        </Button>
                    </div>
                    <div className='flex items-center justify-start flex-wrap gap-4'>
                        {files.map((file) => (
                            <div className='relative'>
                                <ImageComponent
                                    src={file.url ?? ""}
                                    alt='image'
                                    width={100}
                                    height={100}
                                    objectFit='cover'
                                    lazy
                                    rounded
                                />
                            </div>
                        ))}
                    </div>
                </div>  
            }
        </div>
    )
}

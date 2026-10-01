import { create } from "zustand"
import { ProcessError } from "@/lib/utils/Error"
import toaster from "@/lib/utils/toaster"
import type { FileInterface } from "@/lib/interfaces/file"
import { fileService, type GetFilesParams } from "./file.service"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"

interface FileState {
    files: FileInterface[]
    selectedFile?: FileInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    next?: string
    previous?: string

    // Actions
    fetchFiles: (params?: GetFilesParams) => Promise<void>
    fetchFileById: (params: GetByIdParams) => Promise<void>
    createFile: (payload: FormData) => Promise<FileInterface | undefined>
    createFileMinio: (payload: FormData) => Promise<FileInterface | undefined>
    createFileFirebase: (payload: FormData) => Promise<FileInterface | undefined>
    bulkUploadFile: (payload: FormData) => Promise<FileInterface[] | undefined>
    updateFile: (params: UpdateParams<FormData>) => Promise<FileInterface | undefined>
    deleteFile: (params: GetByIdParams) => Promise<void>
    setFiles: (files: FileInterface[]) => void
    setSelectedFile: (file?: FileInterface) => void
    setCurrentPage: (page: number) => void
    setPageSize: (size: number) => void
    setTotal: (total: number) => void
    setTotalPages: (pages: number) => void
}

export const useFileStore = create<FileState>((set, get) => ({
    files: [],
    selectedFile: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 30,
    totalPages: 1,
    isLoading: false,
    next: undefined,
    previous: undefined,

    setFiles: (files) => set({ files }),
    setSelectedFile: (file) => set({ selectedFile: file }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setPageSize: (size) => set({ pageSize: size }),
    setTotal: (total) => set({ total }),
    setTotalPages: (pages) => set({ totalPages: pages }),

    fetchFiles: async (params) => {
        set({ isLoading: true })
        try {
            const data = await fileService.getFiles(params ?? {})
            set({
                isLoading: false,
                total: data?.pagination_data?.total,
                totalPages: data?.pagination_data?.pages,
                pageSize: data?.pagination_data?.size,
                currentPage: data?.pagination_data?.current_page,
                next: data?.pagination_data?.next_page,
                previous: data?.pagination_data?.previous_page,
                files: data?.data ?? []
            })
        } catch (error) {
            set({ isLoading: false, files: [] })
            ProcessError(error)
        }
    },

    fetchFileById: async ({ id }) => {
        set({ isLoading: true })
        try {
            const data = await fileService.getFileById(id)
            set({
                isLoading: false,
                selectedFile: data?.data
            })
        } catch (error) {
            set({ isLoading: false, selectedFile: undefined })
            ProcessError(error)
        }
    },

    createFile: async (payload) => {
        set({ isLoading: true })
        try {
            const data = await fileService.createFile(payload)
            const newFile = data?.data
            if (newFile) {
                set(state => ({
                    isLoading: false,
                    total: (state.total ?? 0) + 1,
                    files: [...state.files, newFile]
                }))
                toaster.success("File created successfully")
            } else {
                set({ isLoading: false })
            }
            return newFile
        } catch (error) {
            set({ isLoading: false })
            ProcessError(error)
            return undefined
        }
    },

    createFileMinio: async (payload) => {
        set({ isLoading: true })
        try {
            const data = await fileService.createFileMinio(payload)
            const newFile = data?.data
            if (newFile) {
                set(state => ({
                    isLoading: false,
                    total: (state.total ?? 0) + 1,
                    files: [...state.files, newFile]
                }))
                toaster.success("File created successfully")
            } else {
                set({ isLoading: false })
            }
            return newFile
        } catch (error) {
            set({ isLoading: false })
            ProcessError(error)
            return undefined
        }
    },

    createFileFirebase: async (payload) => {
        set({ isLoading: true })
        try {
            const data = await fileService.createFileFirebase(payload)
            const newFile = data?.data
            if (newFile) {
                set(state => ({
                    isLoading: false,
                    total: (state.total ?? 0) + 1,
                    files: [...state.files, newFile]
                }))
                toaster.success("File created successfully")
            } else {
                set({ isLoading: false })
            }
            return newFile
        } catch (error) {
            set({ isLoading: false })
            ProcessError(error)
            return undefined
        }
    },

    bulkUploadFile: async (payload) => {
        set({ isLoading: true })
        try {
            const data = await fileService.bulkUploadFile(payload)
            const uploadedFiles = data?.data ?? []
            if (uploadedFiles.length) {
                set(state => ({
                    isLoading: false,
                    total: (state.total ?? 0) + uploadedFiles.length,
                    files: [...state.files, ...uploadedFiles],
                }))
                toaster.success("Files uploaded successfully")
            } else {
                set({ isLoading: false })
            }
            return uploadedFiles
        } catch (error) {
            set({ isLoading: false })
            ProcessError(error)
            return undefined
        }
    },

    updateFile: async ({ id, payload }) => {
        set({ isLoading: true })
        try {
            const data = await fileService.updateFile(id, payload)
            const updatedFile = data?.data
            if (updatedFile) {
                set(state => {
                    const files = state.files.map(f =>
                        f.id === updatedFile.id ? updatedFile : f
                    )
                    return {
                        isLoading: false,
                        files,
                        selectedFile: updatedFile,
                    }
                })
                toaster.success("File updated successfully")
            } else {
                set({ isLoading: false })
            }
            return updatedFile
        } catch (error) {
            set({ isLoading: false })
            ProcessError(error)
            return undefined
        }
    },

    deleteFile: async ({ id }) => {
        set({ isLoading: true })
        try {
            const data = await fileService.deleteFile(id)
            const deletedFile = data?.data
            set(state => {
                const filteredFiles = state.files.filter((f) => f.id !== id)
                return {
                    isLoading: false,
                    total: (state.total ?? 0) - 1,
                    files: filteredFiles,
                    selectedFile: state.selectedFile?.id === id ? undefined : state.selectedFile,
                }
            })
            toaster.success("File deleted successfully")
        } catch (error) {
            set({ isLoading: false })
            ProcessError(error)
        }
    }
}))

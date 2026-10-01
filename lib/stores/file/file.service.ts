import type { BaseGetParams } from '@/lib/interfaces/general';
import type { FileInterface } from '@/lib/interfaces/file';
import API from '@/lib/utils/API';
import { ApiResponse } from '@/lib/interfaces/response';

export interface GetFilesParams extends BaseGetParams {
  model_name?: string;
  model_id?: string;
  file_name?: string;
  label?: string;
};

const getFiles = async (params: GetFilesParams): Promise<ApiResponse<FileInterface[]>> => {
  const { data } = await API.get("/files", { params });
  return data;
};

const getFileById = async (id: string): Promise<ApiResponse<FileInterface>> => {
    const { data } = await API.get(`/files/${id}`)
    return data
}

const deleteFile = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/files/${id}`)
    return data
}

const createFile = async (payload: FormData): Promise<ApiResponse<FileInterface>> => {
    const { data } = await API.post("/files", payload)
    return data
}

const createFileMinio = async (payload: FormData): Promise<ApiResponse<FileInterface>> => {
    const { data } = await API.post("/files/minio-upload", payload)
    return data
}

const createFileFirebase = async (payload: FormData): Promise<ApiResponse<FileInterface>> => {
    const { data } = await API.post("/files/firebase-upload", payload)
    return data
}

const bulkUploadFile = async (payload: FormData): Promise<ApiResponse<FileInterface[]>> => {
    const { data } = await API.post("/files/bulk-upload", payload)
    return data
}

const updateFile = async (id: string, payload: FormData): Promise<ApiResponse<FileInterface>> => {
    const { data } = await API.patch(`/files/${id}`, payload)
    return data
}

export const fileService = {
    getFiles,
    getFileById,
    deleteFile,
    createFile,
    createFileMinio,
    createFileFirebase,
    bulkUploadFile,
    updateFile,
}
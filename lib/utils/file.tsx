import { ImageIcon, Video, Music, FileText, Archive, File } from "lucide-react"
import { FileInterface } from "../interfaces/file"

export const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "webp":
            return <ImageIcon className="h-5 w-5" />
            
        case "mp4":
        case "avi":
        case "mov":
        case "wmv":
            return <Video className="h-5 w-5" />

        case "mp3":
        case "wav":
        case "flac":
            return <Music className="h-5 w-5" />

        case "pdf":
        case "doc":
        case "docx":
        case "txt":
            return <FileText className="h-5 w-5" />

        case "zip":
        case "rar":
        case "7z":
            return <Archive className="h-5 w-5" />

        default:
            return <File className="h-5 w-5" />
    }
}

export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"]
const documentExtensions = ["pdf", "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx", "odt", "rtf"]

export function filterImageFiles(files: FileInterface[]) {
    return files.filter(file => {
        const ext = file.file_path?.split('.').pop()?.toLowerCase()
        return ext && imageExtensions.includes(ext)
    })
}

export function filterDocumentFiles(files: FileInterface[]) {
    return files.filter(file => {
        const ext = file.file_path?.split('.').pop()?.toLowerCase()
        return ext && documentExtensions.includes(ext)
    })
}


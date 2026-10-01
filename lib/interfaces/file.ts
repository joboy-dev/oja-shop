import { BaseModelInterface } from "./general"

export interface FileInterface extends BaseModelInterface {
  file_name: string
  file_path?: string
  file_size?: number
  model_id?: string
  model_name?: string
  url?: string
  external_url?: string
  description?: string
  content?: string
  label?: string
  position?: number
}

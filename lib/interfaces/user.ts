import { BaseModelInterface } from "./general"

export interface UserInterface extends BaseModelInterface {
    email: string
    last_login: Date
    is_active: boolean
    is_superuser: boolean
}
import { UserInterface } from "@/lib/interfaces/user"
import API from "@/lib/utils/API"

const getCurrentUser = async (): Promise<UserInterface> => {
    const { data } = await API.get("/users/me")
    return data.data
}

export const userService = {
    getCurrentUser
}
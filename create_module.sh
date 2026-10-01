#!/bin/bash

# Usage: bash create_module.sh <module_name>
# Example: bash create_module.sh book

if [ -z "$1" ]; then
  echo "Please provide a module name. Usage: bash create_module.sh <module_name>"
  exit 1
fi

MODULE_NAME=$1
CAP_MODULE_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}"

INTERFACE_FILE="lib/interfaces/${MODULE_NAME}.ts"
VALIDATOR_FILE="lib/validators/${MODULE_NAME}.ts"
SERVICE_FILE="lib/stores/${MODULE_NAME}/${MODULE_NAME}.service.ts"
SLICE_FILE="lib/stores/${MODULE_NAME}/${MODULE_NAME}.ts"

mkdir -p lib/interfaces lib/validators lib/stores/${MODULE_NAME}

# Create interface file
cat > $INTERFACE_FILE <<EOL
import { BaseModelInterface } from "@/lib/interfaces/general";

export interface ${CAP_MODULE_NAME}Interface extends BaseModelInterface {

}
EOL

# Create validator file
cat > $VALIDATOR_FILE <<EOL
import { z } from "zod"

export const ${MODULE_NAME}BaseSchema = z.object({

})

export const update${CAP_MODULE_NAME}Schema = ${MODULE_NAME}BaseSchema.partial()

export type ${CAP_MODULE_NAME}BaseFormData = z.infer<typeof ${MODULE_NAME}BaseSchema>
export type Update${CAP_MODULE_NAME}FormData = z.infer<typeof update${CAP_MODULE_NAME}Schema>
EOL

# Create service file
cat > $SERVICE_FILE <<EOL
import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { ${CAP_MODULE_NAME}Interface } from "@/lib/interfaces/${MODULE_NAME}";
import API from "@/lib/utils/API";
import { ${CAP_MODULE_NAME}BaseFormData, Update${CAP_MODULE_NAME}FormData } from "@/lib/validators/${MODULE_NAME}";

export interface Get${CAP_MODULE_NAME}sParams extends BaseGetParams {
  // Add filter params here
};

const get${CAP_MODULE_NAME}s = async (params: Get${CAP_MODULE_NAME}sParams): Promise<ApiResponse<${CAP_MODULE_NAME}Interface[]>> => {
  const { data } = await API.get("/${MODULE_NAME}s", { params });
  return data;
};

const get${CAP_MODULE_NAME}ById = async (id: string): Promise<ApiResponse<${CAP_MODULE_NAME}Interface>> => {
    const { data } = await API.get(\`/${MODULE_NAME}s/\${id}\`)
    return data
}

const delete${CAP_MODULE_NAME} = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(\`/${MODULE_NAME}s/\${id}\`)
    return data
}

const create${CAP_MODULE_NAME} = async (payload: ${CAP_MODULE_NAME}BaseFormData): Promise<ApiResponse<${CAP_MODULE_NAME}Interface>> => {
    const { data } = await API.post(\`/${MODULE_NAME}s\`, payload)
    return data
}

const update${CAP_MODULE_NAME} = async ({
    id,
    payload,
}: {id: string, payload: Update${CAP_MODULE_NAME}FormData}
): Promise<ApiResponse<${CAP_MODULE_NAME}Interface>> => {
    const { data } = await API.patch(\`/${MODULE_NAME}s/\${id}\`, payload)
    return data
}

export const ${MODULE_NAME}sService = {
    get${CAP_MODULE_NAME}s,
    get${CAP_MODULE_NAME}ById,
    delete${CAP_MODULE_NAME},
    create${CAP_MODULE_NAME},
    update${CAP_MODULE_NAME}
}
EOL

# Create slice file
cat > $SLICE_FILE <<EOL
import { create } from "zustand"
import { ProcessError } from "@/lib/utils/Error"
import type { ${CAP_MODULE_NAME}Interface } from "@/lib/interfaces/${MODULE_NAME}"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { ${MODULE_NAME}sService, type Get${CAP_MODULE_NAME}sParams } from "../${MODULE_NAME}/${MODULE_NAME}.service"
import type { ${CAP_MODULE_NAME}BaseFormData, Update${CAP_MODULE_NAME}FormData } from "@/lib/validators/${MODULE_NAME}"

interface Update${CAP_MODULE_NAME}Params extends UpdateParams<Update${CAP_MODULE_NAME}FormData> {}

interface ${CAP_MODULE_NAME}State {
    ${MODULE_NAME}s: ${CAP_MODULE_NAME}Interface[]
    selected${CAP_MODULE_NAME}?: ${CAP_MODULE_NAME}Interface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string

    // Actions
    fetch${CAP_MODULE_NAME}s: (params?: Get${CAP_MODULE_NAME}sParams) => Promise<void>
    fetch${CAP_MODULE_NAME}ById: (params: GetByIdParams) => Promise<void>
    create${CAP_MODULE_NAME}: (payload: ${CAP_MODULE_NAME}BaseFormData) => Promise<${CAP_MODULE_NAME}Interface | undefined>
    update${CAP_MODULE_NAME}: (params: Update${CAP_MODULE_NAME}Params) => Promise<${CAP_MODULE_NAME}Interface | undefined>
    delete${CAP_MODULE_NAME}: (params: GetByIdParams) => Promise<void>
    set${CAP_MODULE_NAME}s: (data: ${CAP_MODULE_NAME}Interface[]) => void
    setSelected${CAP_MODULE_NAME}: (data?: ${CAP_MODULE_NAME}Interface) => void
    setCurrentPage: (page: number) => void
    setPageSize: (size: number) => void
    setTotal: (total: number) => void
    setTotalPages: (pages: number) => void
}

export const use${CAP_MODULE_NAME}Store = create<${CAP_MODULE_NAME}State>((set, get) => ({
    ${MODULE_NAME}s: [],
    selected${CAP_MODULE_NAME}: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,

    set${CAP_MODULE_NAME}s: (${MODULE_NAME}s) => set({ ${MODULE_NAME}s }),
    setSelected${CAP_MODULE_NAME}: (selected${CAP_MODULE_NAME}) => set({ selected${CAP_MODULE_NAME} }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setPageSize: (pageSize) => set({ pageSize }),
    setTotal: (total) => set({ total }),
    setTotalPages: (totalPages) => set({ totalPages }),

    fetch${CAP_MODULE_NAME}s: async (params?: Get${CAP_MODULE_NAME}sParams) => {
        set({ isLoading: true });
        try {
            const data = await ${MODULE_NAME}sService.get${CAP_MODULE_NAME}s(params || {});
            set({
                isLoading: false,
                total: data?.pagination_data?.total,
                totalPages: data?.pagination_data?.pages,
                pageSize: data?.pagination_data?.size,
                currentPage: data?.pagination_data?.current_page,
                next: data?.pagination_data?.next_page,
                previous: data?.pagination_data?.previous_page,
                ${MODULE_NAME}s: data?.data ?? [],
            });
        } catch (error) {
            set({ isLoading: false, ${MODULE_NAME}s: [] });
            ProcessError(error);
        }
    },

    fetch${CAP_MODULE_NAME}ById: async ({ id }) => {
        set({ isLoading: true });
        try {
            const data = await ${MODULE_NAME}sService.get${CAP_MODULE_NAME}ById(id)
            set({
                isLoading: false,
                selected${CAP_MODULE_NAME}: data?.data
            });
        } catch (error) {
            set({ isLoading: false, selected${CAP_MODULE_NAME}: undefined });
            ProcessError(error);
        }
    },

    create${CAP_MODULE_NAME}: async (payload: ${CAP_MODULE_NAME}BaseFormData) => {
        set({ isSubmitting: true });
        try {
            const data = await ${MODULE_NAME}sService.create${CAP_MODULE_NAME}(payload)
            const created = data?.data
            set(state => ({
                isSubmitting: false,
                total: (state.total ?? 0) + 1,
                ${MODULE_NAME}s: created ? [created, ...state.${MODULE_NAME}s] : state.${MODULE_NAME}s
            }))
            if (created) {
                toaster.success("${CAP_MODULE_NAME} created successfully")
            }
            return created
        } catch (error) {
            set({ isSubmitting: false });
            ProcessError(error)
            return undefined
        }
    },

    update${CAP_MODULE_NAME}: async ({ id, payload }: Update${CAP_MODULE_NAME}Params) => {
        set({ isSubmitting: true });
        try {
            const data = await ${MODULE_NAME}sService.update${CAP_MODULE_NAME}({ id, payload })
            const updated = data?.data
            set(state => {
                let arr = state.${MODULE_NAME}s ? [...state.${MODULE_NAME}s] : []
                if (updated) {
                    const idx = arr.findIndex(x => x.id === updated.id)
                    if (idx !== -1) arr[idx] = updated
                }
                return {
                    isSubmitting: false,
                    ${MODULE_NAME}s: arr,
                    selected${CAP_MODULE_NAME}: updated ?? state.selected${CAP_MODULE_NAME}
                }
            })
            if (updated) {
                toaster.success("${CAP_MODULE_NAME} updated successfully")
            }
            return updated
        } catch (error) {
            set({ isSubmitting: false });
            ProcessError(error)
            return undefined
        }
    },

    delete${CAP_MODULE_NAME}: async ({ id }) => {
        set({ isSubmitting: true });
        try {
            await ${MODULE_NAME}sService.delete${CAP_MODULE_NAME}(id)
            set(state => {
                const arr = state.${MODULE_NAME}s.filter(x => x.id !== id)
                return {
                    isSubmitting: false,
                    total: (state.total ?? 0) - 1,
                    ${MODULE_NAME}s: arr,
                    selected${CAP_MODULE_NAME}: state.selected${CAP_MODULE_NAME}?.id === id ? undefined : state.selected${CAP_MODULE_NAME}
                }
            })
            toaster.success("${CAP_MODULE_NAME} deleted successfully")
        } catch (error) {
            set({ isSubmitting: false });
            ProcessError(error)
        }
    }
}));

EOL

echo "Module files for '$MODULE_NAME' created:"
echo "  - $INTERFACE_FILE"
echo "  - $VALIDATOR_FILE"
echo "  - $SERVICE_FILE"
echo "  - $SLICE_FILE"

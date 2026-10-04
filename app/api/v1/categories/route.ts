import { route } from "../_lib/handler";
import { getCategories } from "@/server/services/catalog.service";

export const GET = route({ cache: "public" }, () => getCategories());

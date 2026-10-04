import { getBankDetails } from "@/server/services/payment.service";
import { route } from "../../_lib/handler";

/** Bank-transfer details, or null until the shop sets them. Signed-in only, like the order page. */
export const GET = route({ access: "user" }, async () => getBankDetails());

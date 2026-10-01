import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, DefaultValues, useForm } from "react-hook-form";
import { ZodType } from "zod";

export function useZodForm<T extends FieldValues>(
  schema: ZodType<T, any, any>,
  defaultValues?: DefaultValues<T>
) {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });
}
import { ZodError, ZodNumber, ZodOptional, ZodTypeAny, z } from "zod";
import { Order } from "../../../interfaces";

function IntegerString
  <schema extends (ZodNumber | ZodOptional<ZodNumber>)>
  (schema:schema)
{
  return (
    z.preprocess((value) => (
      ( (typeof value === "string") ? parseInt(value, 10)
      : (typeof value === "number") ? value
      :                               undefined
    )), schema)
  )
}

export const orderInput = z.object({
    orderId: z.string(),
    side: z.enum(["B", "S"]),
    price: IntegerString(z.number().max(999999).min(1)),
    quantity: IntegerString(z.number().max(999999999).min(1)),
    createdAt: z.number()
});


function validate<T>(type: ZodTypeAny, input: unknown): T {
    try {
        return type.parse(input);
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            throw new Error(`Validation errors:\n ${error.issues.map((issue) => JSON.stringify(issue)).join("\n")}`);
        }
        throw error;
    }
}


export const validateOrderInput = (data: unknown) => validate<Order>(orderInput, data);

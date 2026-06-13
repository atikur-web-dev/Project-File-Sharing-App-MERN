// Backend/src/Utils/errors/formatErrors.ts
import z from "zod";
export function formatErrors(error: z.ZodError) {
    const flattened = error.flatten();
    return flattened.fieldErrors;
}
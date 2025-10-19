import * as z from "zod/mini";

export const FileReference = z.nullable(z.instanceof(File));

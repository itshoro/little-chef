import { VISIBILITIES } from "@/lib/domain/shared/visibility";
import { z } from "zod";

export const visibilitySchema = z.enum(VISIBILITIES);

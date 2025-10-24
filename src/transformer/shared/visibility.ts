import { z } from "zod";
import { VISIBILITIES } from "../../lib/constants";

export const visibilitySchema = z.enum(VISIBILITIES);

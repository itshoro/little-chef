import { z } from "zod";
import { VISIBILITIES } from "../../constants";

export const visibilitySchema = z.enum(VISIBILITIES);

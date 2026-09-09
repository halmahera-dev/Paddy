import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_PORT: z.number().default(5173),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

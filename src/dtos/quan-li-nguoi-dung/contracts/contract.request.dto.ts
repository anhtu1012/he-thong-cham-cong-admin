import { z } from "zod";
import { CreateContractSchema, UpdateContractSchema } from "./contract.dto";

export type CreateContractRequest = z.infer<typeof CreateContractSchema>;
export type UpdateContractRequest = z.infer<typeof UpdateContractSchema>;

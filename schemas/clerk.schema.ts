import z from "zod";

const ClerkUserActionEnum = z.enum(["approve", "reject"]);

export const ActionApprovalUserSchema = z.object({
  action: ClerkUserActionEnum,
});

export type TActionApprovalUser = z.infer<typeof ActionApprovalUserSchema>;

export const CreateOrUpdateClerkUserSchema = z.object({
  emailAddress: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export type TCreateOrUpdateClerkUserSchema = z.infer<typeof CreateOrUpdateClerkUserSchema>;

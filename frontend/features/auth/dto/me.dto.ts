export type UserRole = "ADMIN" | "USER";

export type MeDto = {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
};

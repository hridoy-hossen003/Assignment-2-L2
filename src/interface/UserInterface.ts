export interface AUser {
  name?: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}

export type typeRoles = "contributor" | "maintainer";
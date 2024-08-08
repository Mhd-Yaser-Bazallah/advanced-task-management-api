import { UserRole } from "../user/entities/user-role.enum";

export interface JwtPayload {
    sub: number;
    username: string;
    role: UserRole;
  }
  
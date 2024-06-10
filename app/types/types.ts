import { User } from "@prisma/client";

export type WithoutId<T> = Omit<T, 'id'>;

export interface UserAuthData {
  token: number
}

// User with information safe to display.
export type UserPublic = Omit<User, 'password'>;
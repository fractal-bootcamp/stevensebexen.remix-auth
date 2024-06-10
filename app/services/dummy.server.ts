import { Prisma, User } from "@prisma/client";
import prisma from "~/prisma";
import { UserAuthData, UserPublic, WithoutId } from "~/types/types";

async function changeUserProfileName(userAuthData: UserAuthData, newName: string) {
  const result: UserPublic = await prisma.user.update({ where: { id: userAuthData.token }, data: { name: newName } });
  return result ? { success: true, newName } : undefined;
}

async function createUser(user: Prisma.UserCreateInput): Promise<User | undefined> {
  
  const duplicateUser = await prisma.user.findFirst({
    select: { id: true },
    where: { email: user.email }
  });
  if (duplicateUser) {
    return undefined;
  }
  
  const createdUser = await prisma.user.create({ data: { email: user.email, password: user.password }});
  return createdUser;
}

async function getUserByAuthData(authData: UserAuthData): Promise<UserPublic | undefined> {
  const findResult = await prisma.user.findUnique({ where: {id: authData.token }});
  if (!findResult) return undefined;
  const { password, ...user } = findResult; 
  return user;
}

async function login(email: string, password: string): Promise<UserAuthData> {

  const user = await prisma.user.findFirst({
    select: { id: true },
    where: { email, password }
  });

  if (!user) {
    throw new Error('UserNotFoundError');
  }

  const result: UserAuthData = { token: user.id };
  return result;

}

const dummyServer = {
  changeUserProfileName,
  createUser,
  getUserByAuthData,
  login
}
export default dummyServer;
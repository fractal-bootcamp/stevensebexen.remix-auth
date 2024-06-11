import { Prisma, User } from "@prisma/client";
import prisma from "~/prisma";
import { UserAuthData, UserPublic, WithoutId } from "~/types/types";

async function changeUserProfileName(userAuthData: UserAuthData, newName: string) {
  try {
    await prisma.user.update({ where: { id: userAuthData.token }, data: { name: newName } });
  } catch (e) {
    console.error(e);
    return { success: false };
  }
  return { success: true, newName };
}

async function createUser(user: Prisma.UserCreateInput): Promise<Boolean> {
  try {
    await prisma.user.create({ data: { email: user.email, password: user.password }});
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('Attempt to create duplicate record:', user);
    } else {
      console.error(e);
    }
    return false;
  }
  return true;
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
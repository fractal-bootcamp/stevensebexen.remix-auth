import { Authenticator } from "remix-auth";
import { FormStrategy } from 'remix-auth-form';

import { UserAuthData } from '~/types/types';

import dummyServer from '~/services/dummy.server.ts';
import { sessionStorage } from "~/services/session.server";

export const authenticator = new Authenticator<UserAuthData>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");

    if (!email || !password) {throw new Error('Email and password are required.')}
    const user: UserAuthData = await dummyServer.login(email.toString(), password.toString());

    return user;
  }),
  "auth-user"
);
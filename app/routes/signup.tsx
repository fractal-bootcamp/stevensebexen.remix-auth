import { User } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { useEffect, useState } from "react";
import dummyServer from "~/services/dummy.server";
import { WithoutId } from "~/types/types";

export default function Signup() {
  const actionData: any = useActionData();
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (actionData?.message && actionData?.message === 'UserAlreadyExistsError') {
      setShowError(true);
    } else if (actionData?.success === true) {
      setShowSuccess(true);
    }
  }, [actionData]);

  return (
    <>
      <Link to="/">Home</Link>
      <Form method="POST">
        <input name="email" placeholder="Email" required />
        <input name="password" placeholder="Password" required />
        <input type="submit" value="Sign up" />
        {showSuccess && <p>Your account has been created! You may now log in from the <Link to="/">main page.</Link></p>}
        {showError && <p>A user with that email already exists.</p>}
      </Form>
    </>
  )
}

export async function action ({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const [email, password] = [formData.get('email')?.toString(), formData.get('password')?.toString()];
  if (!email || !password) { throw new Error('Email and password are required.') }

  const userToCreate: WithoutId<User> = { email, password };
  const userCreateResult = await dummyServer.createUser(userToCreate);

  if (!userCreateResult) {
    return {
      success: false,
      message: 'UserAlreadyExistsError',
    };
  }
  else {
    return { success:true };
  }
}
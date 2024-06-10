import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react"
import { useEffect, useState } from "react";
import { authenticator } from "~/services/auth.server";

export default function Login() {
  const actionData: any = useActionData();
  const [showError, setShowError] = useState<Boolean>(false);

  useEffect(() => {
    if (actionData?.message && actionData.message === 'UserNotFoundError') {
      setShowError(true);
    }
  }, [actionData])

  return (
    <>
      <Link to="/">Home</Link>
      <Form method="post">
        <input name="email" placeholder="Email" required />
        <input name="password" placeholder="Password" required />
        <input type="submit" value="Login"/>
        { showError && <p>Invalid email and/or password.</p> }
      </Form>
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  try {
      await authenticator.authenticate('auth-user', request, {
      successRedirect: '/dashboard'
    });
  } catch(e) {
    console.error(e);
    return e;
  }

  return null;
}
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react";
import { authenticator } from "~/services/auth.server";
import dummyServer from "~/services/dummy.server";
import { UserAuthData, UserPublic } from "~/types/types";

export default function Dashboard() {
  const loaderData: any = useLoaderData();
  const actionData: any = useActionData();
  const [showEdit, setShowEdit] = useState<Boolean>(false);

  useEffect(() => {
    if (actionData) {
      setShowEdit(false);
    }
  }, [actionData]);

  return (
    <>
      <p>Welcome, {loaderData?.name || 'Mysterious Dragon'}!</p>
      <p>Click <a onClick={() => setShowEdit(true)} style={{ color: 'blue', cursor: 'pointer' }}>here</a> to edit your profile.</p>
      {showEdit &&
        <>
          <Form method="POST">
            <input name="newName" placeholder="Enter a name" required />
            <input type="submit" value="Submit" />
            <input type="button" value="Cancel" onClick={() => setShowEdit(false)} />
          </Form>
        </>
      }
      <p>Ready to leave? <Link to="/logout">Log out.</Link></p>
    </>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const userAuthData = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login'
  });

  const formData = await request.formData();
  const newName = formData.get('newName')?.toString();
  if (!newName) return null;

  const result = await dummyServer.changeUserProfileName(userAuthData, newName);
  return result;
}

export async function loader({ request }: LoaderFunctionArgs): Promise<UserPublic | null> {
  const userAuthData = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login'
  });
  const user = await dummyServer.getUserByAuthData(userAuthData);
  return user || null;
}
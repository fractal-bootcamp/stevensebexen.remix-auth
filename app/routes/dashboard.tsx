import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react"
import { authenticator } from "~/services/auth.server";
import dummyServer from "~/services/dummy.server";
import { UserPublic } from "~/types/types";

export default function Dashboard() {
  const loaderData: any = useLoaderData();

  return (
    <>
      <p>Welcome, {loaderData.email || 'mysterious dragon'}!</p>
      <p>Ready to leave? <Link to="/logout">Log out.</Link></p>
    </>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userAuthData = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login'
  });
  const user = await dummyServer.getUserByAuthData(userAuthData);
  return user;
}
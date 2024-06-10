import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <h1>Hi!</h1>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign up</Link>
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { successRedirect: '/dashboard' });
  return null;
}
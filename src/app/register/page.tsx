import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { AuthForm } from "@/components/AuthForm";

import { authOptions } from "@/lib/auth";



export default async function RegisterPage() {

  const session = await getServerSession(authOptions);

  if (session) redirect("/");

  return (

    <main className="app-shell app-shell--auth">

      <div className="app-shell__content">

        <AuthForm mode="register" />

      </div>

    </main>

  );

}


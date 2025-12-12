"use server";

import { signIn } from "@/auth";
type Error = {
  type: string,
  kind: string,
  code: string
}
export async function doCredentialsSignin(formdata: FormData) {
  const email = formdata.get("email")?.toString() ?? "";
  const password = formdata.get("password")?.toString() ?? "";

  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // Sometimes signIn might return undefined if failed
    if (!response) {
      return { error: "SERVER_ERROR" };
    }

    return response;
  } catch (error: unknown) {
    const catchError = error as { type?: string; kind?: string; code?: string };

    if (catchError.type === "CredentialsSignin") {
      return { error: "CredentialsSignin" };
    }

    return { error: "SERVER_ERROR" };
  }

}

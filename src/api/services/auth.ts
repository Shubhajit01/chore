import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";

import { client } from "../client";

export async function signIn(creds: SignInWithPasswordCredentials) {
  const { data, error } = await client.auth.signInWithPassword(creds);
  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
  return data;
}

export async function signup(creds: SignUpWithPasswordCredentials) {
  const { data, error } = await client.auth.signUp(creds);
  if (error) {
    const message =
      error.status === 429
        ? "There was some error while creating the account. Please try again after some time or login as guest."
        : error.message;
    throw new Error(message);
  }
  return data;
}

export async function signout() {
  const { error } = await client.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

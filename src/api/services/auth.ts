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
    console.log("join", error);
    throw new Error(error.message);
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

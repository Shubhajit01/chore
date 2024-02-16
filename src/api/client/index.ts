import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const API_URL = "https://pyfanrosucnoxtxgixlo.supabase.co";
const API_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZmFucm9zdWNub3h0eGdpeGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMzQ1OTEsImV4cCI6MjAyMjkxMDU5MX0.CLdCs8TnzT4L-L2B_My_z3tvHi6346vIp_Qre4FeaBM";

export const client = createClient<Database>(API_URL, API_ANON);

"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const AddQuote = async (formData: FormData) => {
  const title = formData.get("quote") as string;
  if (title.trim() === "") return;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  console.log("title", title);
  const { data, error } = await supabase.from("quotes").insert([{ title }]);

  if (error) {
    throw error;
  }

  revalidatePath("/quotes");
};

export const ClearAllQuotes = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  await supabase.from("quotes").delete().eq("user_id", session?.user?.id);

  if (error) {
    throw error;
  }

  revalidatePath("/quotes");
};

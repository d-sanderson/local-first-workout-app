import { supabase } from "$lib/supabaseClient.js";
import type { Exercise } from "$lib/types.js";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
  const { userId, exercises } = await request.json();

  const promises = exercises.map((exercise: Exercise) => {
    // remove id, it will be generated as a unique uuid by supabase
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = exercise;
    return supabase
      .from('exercises')
      .upsert({ ...rest, userId })
  });

  const results = await Promise.allSettled(promises);
  console.log(results)
  return json({ status: 200, results });
}


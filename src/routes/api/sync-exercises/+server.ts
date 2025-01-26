import { supabase } from "$lib/supabaseClient.js";
import type { Exercise } from "$lib/types.js";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
  const payload = await request.json();

  const promises = payload.exercises.map((exercise: Exercise) =>
    supabase.from('exercises').insert({ ...exercise, userId: payload.userId })
  );

  const results = await Promise.all(promises);
  console.log(results)
  return json({ status: 200, results });
}

import { supabase } from "$lib/supabaseClient.js";
import type { Exercise } from "$lib/types.js";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
  const payload = await request.json();

  const promises = payload.exercises.map((exercise: Exercise) =>
    supabase.from('exercises').upsert({ ...exercise, userId: payload.userId })
  );

  const results = await Promise.allSettled(promises);
  return json({ status: 200, results });
}

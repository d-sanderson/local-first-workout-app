// src/routes/api/completion/+server.js
// import { useCloudFlareAI } from '$lib/ai.js';
// import { json } from '@sveltejs/kit';

import { ACCOUNT_ID, API_TOKEN } from "$env/static/private";
import { json } from "@sveltejs/kit";


async function useCloudFlareAI(model: string = '@cf/meta/llama-3-8b-instruct', payload: string) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model}`;
  console.log(payload)
  const response = await fetch(
    url,
    {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  const result = await response.json();
  return result;
}

export async function POST({ request }) {
	const payload  = await request.json();
console.log(payload)
console.log({ ACCOUNT_ID, API_TOKEN })
const response = await useCloudFlareAI(undefined, payload);
return json({ response });
	// try {
	// 	const response = await useCloudFlareAI(undefined, prompt);

  //   console.log(response)

	// 	return json(response);
	// } catch (error) {
	// 	return json({ error: error.message }, { status: 500 });
	// }
}



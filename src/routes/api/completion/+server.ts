import { ACCOUNT_ID, API_TOKEN } from "$env/static/private";
import { json } from "@sveltejs/kit";


async function useCloudFlareAI(model: string = '@cf/meta/llama-3-8b-instruct', payload: string) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model}`;
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
  const payload = await request.json();
  const response = await useCloudFlareAI(undefined, payload);
  return json({ response });
}



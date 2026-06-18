import { get, put } from "@vercel/blob";

const PATHNAME = "app-state.json";

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
};

async function readState() {
  try {
    const result = await get(PATHNAME, { access: "private" });
    if (!result?.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text);
  } catch (error) {
    if (error?.name === "BlobNotFoundError" || error?.message?.includes("not found")) return null;
    throw error;
  }
}

async function writeState(state) {
  const current = await readState();
  const safeState = { ...state };

  // Older browser tabs can still be running a previous bundle. Do not let those
  // clients replace the full ESPN fixture list with the old short seed list.
  if (Array.isArray(current?.matches) && Array.isArray(state.matches) && current.matches.length > state.matches.length) {
    safeState.matches = current.matches;
  }

  await put(PATHNAME, JSON.stringify({ ...safeState, updatedAt: Date.now() }), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      return json(res, 200, await readState());
    }

    if (req.method === "POST") {
      const state = req.body && typeof req.body === "object" ? req.body : null;
      if (!state) return json(res, 400, { error: "Invalid state" });
      await writeState(state);
      return json(res, 200, { ok: true });
    }

    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return json(res, 500, { error: error?.message || "App state unavailable" });
  }
}

import { get, put } from "@vercel/blob";

const PATHNAME = "fan-comments.json";
const MAX_COMMENTS = 1000;

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
};

async function readComments() {
  try {
    const result = await get(PATHNAME, { access: "private" });
    if (!result?.stream) return [];
    const text = await new Response(result.stream).text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error?.name === "BlobNotFoundError" || error?.message?.includes("not found")) return [];
    throw error;
  }
}

async function writeComments(comments) {
  await put(PATHNAME, JSON.stringify(comments), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
  });
}

const cleanComment = (raw) => {
  const type = ["comment", "wish", "prediction"].includes(raw?.type) ? raw.type : "comment";
  const text = String(raw?.text || "").trim().replace(/\s+/g, " ").slice(0, 220);
  const author = String(raw?.author || "").trim().slice(0, 32);
  if (!text || !author) return null;
  return {
    id: raw?.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    matchId: Number(raw?.matchId),
    type,
    text,
    author,
    role: String(raw?.role || "fan").slice(0, 20),
    hidden: false,
    createdAt: Number(raw?.createdAt) || Date.now(),
  };
};

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const comments = await readComments();
      return json(res, 200, comments.filter((item) => !item.hidden));
    }

    if (req.method === "POST") {
      const comment = cleanComment(req.body);
      if (!comment || !Number.isFinite(comment.matchId)) return json(res, 400, { error: "Invalid comment" });
      const comments = await readComments();
      const next = [comment, ...comments].slice(0, MAX_COMMENTS);
      await writeComments(next);
      return json(res, 201, comment);
    }

    if (req.method === "PATCH") {
      const id = String(req.body?.id || "");
      if (!id) return json(res, 400, { error: "Missing id" });
      const comments = await readComments();
      const next = comments.map((item) => (String(item.id) === id ? { ...item, hidden: true } : item));
      await writeComments(next);
      return json(res, 200, { ok: true });
    }

    res.setHeader("Allow", "GET, POST, PATCH");
    return json(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return json(res, 500, { error: error?.message || "Fan comments unavailable" });
  }
}

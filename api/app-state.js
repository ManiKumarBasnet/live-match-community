import { get, put } from "@vercel/blob";

const PATHNAME = "app-state.json";
const ESPN_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=300";
const APP_TIME_ZONE = "Asia/Thimphu";

const NAME_MAP = {
  "United States": "USA",
  US: "USA",
  "Korea Republic": "South Korea",
  "Republic of Korea": "South Korea",
  Korea: "South Korea",
  "Czech Republic": "Czechia",
  "Cape Verde": "Cabo Verde",
  "Cote d'Ivoire": "Ivory Coast",
  "DR Congo": "Congo",
  "Congo DR": "Congo",
  "Democratic Republic of the Congo": "Congo",
  "Bosnia and Herzegovina": "Bosnia",
  "Bosnia & Herzegovina": "Bosnia",
  "Bosnia-Herzegovina": "Bosnia",
  Curacao: "Curacao",
  Turkiye: "Turkey",
};

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

const cleanName = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const normalizeName = (name) => NAME_MAP[cleanName(name)] || cleanName(name);
const toScore = (value) => (value == null || value === "" ? null : Number.parseInt(String(value), 10));
const sameFixture = (left, right) => (
  (left.a === right.a && left.b === right.b) ||
  (left.a === right.b && left.b === right.a)
);

function espnDate(value) {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function espnTime(value) {
  return `${new Date(value).toLocaleTimeString("en-US", {
    timeZone: APP_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  })} BTT`;
}

function espnStage(event) {
  return String(event.season?.slug || event.season?.type?.name || "World Cup")
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

async function getEspnMatches() {
  const response = await fetch(ESPN_URL);
  if (!response.ok) return null;
  const data = await response.json();
  return (data.events || []).map((event) => {
    const teams = event.competitions?.[0]?.competitors || [];
    const home = teams.find((team) => team.homeAway === "home") || teams[0];
    const away = teams.find((team) => team.homeAway === "away") || teams[1];
    if (!home || !away) return null;
    const state = event.status?.type?.state;
    return {
      id: `espn-${event.id}`,
      a: normalizeName(home.team?.displayName),
      b: normalizeName(away.team?.displayName),
      date: espnDate(event.date),
      time: espnTime(event.date),
      stage: espnStage(event),
      status: state === "in" ? "live" : state === "post" ? "completed" : "upcoming",
      sa: toScore(home.score),
      sb: toScore(away.score),
      source: "espn",
    };
  }).filter(Boolean);
}

async function normalizeMatches(state) {
  if (!Array.isArray(state.matches)) return state;
  try {
    const espnMatches = await getEspnMatches();
    if (!espnMatches?.length) return state;
    const used = new Set();
    const matches = espnMatches.map((fixture) => {
      const existing = state.matches.find((match) => !used.has(match.id) && sameFixture(match, fixture));
      if (!existing) return fixture;
      used.add(existing.id);
      const flipped = existing.a === fixture.b;
      return {
        ...existing,
        date: fixture.date,
        time: fixture.time,
        stage: fixture.stage,
        status: fixture.status,
        sa: flipped ? fixture.sb : fixture.sa,
        sb: flipped ? fixture.sa : fixture.sb,
        source: "espn",
      };
    });
    return { ...state, matches };
  } catch {
    return state;
  }
}

function mergePlayers(currentPlayers = [], incomingPlayers = []) {
  if (!Array.isArray(incomingPlayers)) return currentPlayers;
  const currentById = new Map(currentPlayers.map((player) => [String(player.id), player]));
  const currentByName = new Map(currentPlayers.map((player) => [player.name, player]));
  return incomingPlayers.map((player) => {
    const current = currentById.get(String(player.id)) || currentByName.get(player.name) || {};
    return {
      ...player,
      avatar: player.avatar || current.avatar || null,
    };
  });
}

function mergeVoteBucket(current = {}, incoming = {}) {
  const merged = { ...current, ...incoming };
  const currentByUser = current.byUser || {};
  const incomingByUser = incoming.byUser || {};
  if (Object.keys(currentByUser).length || Object.keys(incomingByUser).length) {
    merged.byUser = { ...currentByUser, ...incomingByUser };
  }
  Object.entries(current).forEach(([key, value]) => {
    if (key === "byUser" || typeof value !== "number") return;
    merged[key] = Math.max(value, typeof incoming[key] === "number" ? incoming[key] : 0);
  });
  return merged;
}

function mergeVoteMap(current = {}, incoming = {}) {
  const next = { ...current };
  Object.entries(incoming || {}).forEach(([key, value]) => {
    next[key] = mergeVoteBucket(current?.[key] || {}, value || {});
  });
  return next;
}

function mergeRequests(current = [], incoming = []) {
  const byId = new Map();
  [...current, ...incoming].forEach((request) => {
    if (!request?.id) return;
    const previous = byId.get(request.id) || {};
    byId.set(request.id, { ...previous, ...request });
  });
  return [...byId.values()].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 100);
}

function mergeAnalytics(current = {}, incoming = {}) {
  const byId = new Map();
  [...(current.sessions || []), ...(incoming.sessions || [])].forEach((session) => {
    if (!session?.id) return;
    const previous = byId.get(session.id) || {};
    byId.set(session.id, {
      ...previous,
      ...session,
      startedAt: previous.startedAt || session.startedAt,
      lastSeenAt: Math.max(Number(previous.lastSeenAt || 0), Number(session.lastSeenAt || 0)),
    });
  });
  return {
    sessions: [...byId.values()]
      .sort((a, b) => Number(b.lastSeenAt || 0) - Number(a.lastSeenAt || 0))
      .slice(0, 1000),
    events: Math.max(Number(current.events || 0), Number(incoming.events || 0)),
  };
}

async function writeState(state) {
  const current = await readState();
  let safeState = await normalizeMatches({ ...state });

  if (current) {
    safeState = {
      ...safeState,
      players: Array.isArray(safeState.players) ? mergePlayers(current.players || [], safeState.players) : current.players,
      votes: mergeVoteMap(current.votes || {}, safeState.votes || {}),
      pollVotes: mergeVoteMap(current.pollVotes || {}, safeState.pollVotes || {}),
      verificationRequests: mergeRequests(current.verificationRequests || [], safeState.verificationRequests || []),
      analytics: mergeAnalytics(current.analytics || {}, safeState.analytics || {}),
      customPolls: Array.isArray(safeState.customPolls)
        ? [...safeState.customPolls, ...(current.customPolls || []).filter((poll) => !safeState.customPolls.some((item) => item.id === poll.id))]
        : current.customPolls,
    };
  }

  // Older browser tabs can still be running a previous bundle. Do not let those
  // clients replace the full ESPN fixture list with the old short seed list.
  if (Array.isArray(current?.matches) && Array.isArray(safeState.matches) && current.matches.length > safeState.matches.length) {
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

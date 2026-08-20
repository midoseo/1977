import { getStore } from "@netlify/blobs";

/* 에스원 50주년 미션 — 실시간 랭킹·축하벽 저장 함수
   GET  /api/data                 → { board, wall }
   POST /api/data { type, rec }   → 갱신 후 { board, wall }
   저장소: Netlify Blobs (별도 DB 불필요) */

const CAP = 400;               // 각 목록 최대 보관 개수
const clip = (v, n) => (typeof v === "string" ? v.slice(0, n) : "");

const cleanScore = (r) => ({
  name: clip(r.name, 24) || "익명",
  dept: clip(r.dept, 40),
  score: Math.max(0, Math.min(99999, Number(r.score) || 0)),
  seconds: Math.max(0, Math.min(99999, Number(r.seconds) || 0)),
  wrong: Math.max(0, Math.min(999, Number(r.wrong) || 0)),
  grade: clip(r.grade, 2),
  t: Number(r.t) || Date.now(),
});

const cleanMsg = (r) => ({
  name: clip(r.name, 24) || "익명",
  msg: clip(r.msg, 140),
  t: Number(r.t) || Date.now(),
});

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export default async (req) => {
  const store = getStore("s1-50th");
  const load = async (k) => (await store.get(k, { type: "json" })) || [];

  if (req.method === "GET") {
    const [board, wall] = await Promise.all([load("board"), load("wall")]);
    return json({ board, wall });
  }

  if (req.method === "POST") {
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }
    const { type, rec } = body || {};

    if (type === "score" && rec) {
      const board = await load("board");
      board.push(cleanScore(rec));
      board.sort((a, b) => b.score - a.score || a.seconds - b.seconds);
      await store.setJSON("board", board.slice(0, CAP));
    } else if (type === "msg" && rec && rec.msg) {
      const wall = await load("wall");
      wall.unshift(cleanMsg(rec));
      await store.setJSON("wall", wall.slice(0, CAP));
    }

    const [board, wall] = await Promise.all([load("board"), load("wall")]);
    return json({ board, wall });
  }

  return json({ error: "Method Not Allowed" }, 405);
};

/* /api/data 경로로 접근할 수 있게 하는 라우팅 설정 */
export const config = { path: "/api/data" };

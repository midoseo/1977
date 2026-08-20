import { getStore } from "@netlify/blobs";

/* 랭킹·축하벽 초기화용 함수 (리허설 후 실제 이벤트 전에 한 번 실행)
   사용법: 브라우저에서  https://<사이트>/api/reset?key=본인이정한값  접속
   아래 SECRET 값을 원하는 문자열로 바꾸세요. */
const SECRET = "s1-50th-reset";

export default async (req) => {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== SECRET) {
    return new Response("forbidden", { status: 403 });
  }
  const store = getStore("s1-50th");
  await store.setJSON("board", []);
  await store.setJSON("wall", []);
  return new Response("초기화 완료: 랭킹·축하벽이 비워졌습니다.", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};

export const config = { path: "/api/reset" };

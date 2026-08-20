# 에스원 창립 50주년 · 기록보관소 잠금해제 미션

사내 참여형 방탈출 퀴즈. Netlify에 배포하면 접속한 **모든 기기의 랭킹·축하 메시지가 실시간으로 함께** 모입니다.

## 폴더 구조
```
.
├── index.html                    # 게임 본체 (이 파일 하나로 화면 전체가 동작)
├── netlify.toml                  # Netlify 설정 (함수 폴더 + /api 라우팅)
├── package.json                  # 서버 함수 의존성(@netlify/blobs)
└── netlify/
    └── functions/
        ├── data.mjs              # 실시간 랭킹·축하벽 저장 API (/api/data)
        └── reset.mjs             # 랭킹·축하벽 초기화 API (/api/reset)
```

## 배포 방법 (GitHub → Netlify)

### 1) GitHub 저장소에 올리기
- github.com 에서 **New repository** → 이름 예) `s1-50th-mission` (Private 권장)
- 이 폴더의 **모든 파일**을 그 저장소에 업로드
  - 웹에서 할 경우: 저장소 화면 → **Add file → Upload files** → 이 폴더 내용을 통째로 드래그 → **Commit**
  - (`netlify` 폴더 구조가 그대로 유지되도록 폴더째 올리세요)

### 2) Netlify에 연결
1. app.netlify.com → **Add new site → Import an existing project**
2. **GitHub** 선택 → 방금 만든 저장소 선택
3. 빌드 설정은 그대로 두고(설정 없음) **Deploy**
   - `netlify.toml`이 발행 폴더와 함수 폴더를 자동으로 잡아줍니다
4. 1~2분 후 `https://<사이트이름>.netlify.app` 링크 생성 → 바로 사용 가능

이후 GitHub에 파일을 수정해 커밋하면 Netlify가 **자동으로 재배포**합니다.

## 이벤트 운영 팁
- **리허설 후 초기화**: 테스트로 쌓인 기록을 비우려면
  `netlify/functions/reset.mjs` 안의 `SECRET` 값을 원하는 문자열로 바꿔 커밋한 뒤,
  브라우저에서 `https://<사이트>/api/reset?key=바꾼값` 에 한 번 접속하세요.
- **문제 수정**: `index.html` 안 `STAGES`(과거 봉인) / `FUTURE`(미래 인증) 배열만 고치면 됩니다.
  - 과거 봉인은 정답 시 마스터코드 자리(1·9·7·7·★)를 채우므로 개수를 바꾸면 코드도 함께 조정하세요.
  - 미래 인증은 코드와 무관하여 자유롭게 추가/삭제 가능합니다.
- **제한시간**: `index.html` 상단의 `BASE_TIME`(문제당 초) 값으로 조절합니다.

## 참고
- 저장은 Netlify Blobs를 사용하므로 별도 DB가 필요 없습니다.
- 서버(함수)에 연결되지 않은 환경(로컬에서 index.html만 열기 등)에서는
  자동으로 그 브라우저 세션 안에서만 랭킹·축하글이 동작합니다.

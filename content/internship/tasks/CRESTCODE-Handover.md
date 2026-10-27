---
title: CRESTCODE V2-1／V2-2 專案交接文件
description: 專案情境、遊戲流程、前端回饋、資料與 API 設計，以及開發問題和交接狀態。
date: 2026-10-27
author: Oscar
status: completed
tags:
  - 實習
  - 專案交接
  - CRESTCODE
  - LINE LIFF
  - AstraZeneca
---

# CRESTCODE V2-1／V2-2 專案交接文件

> 本文件記錄我負責期間的需求決策、V2-2 前端初版、驗證紀錄與交接事項。V2-2 後續已不由我負責，本文不把未確認的後續工作寫成已完成。

## 1. 專案情境與範圍

CRESTCODE 是提供 HCP 使用的 LINE LIFF 家族案例挑戰。V2-1 將舊版兩題式體驗改成選擇家族角色、回答一題、查看解析與影片，再完成角色挑戰；V2-2 在既有流程加入 11 張卡牌抽取與收藏。主要前端是 Angular LIFF，後端使用 Bun／Elysia API、Firebase Authentication 與 Firestore。

我在 V2-1 參與前後端主要流程、身份／角色／題目狀態、事件與報表的整理和實作；V2-2 負責需求收斂、OpenSpec 規格、前端卡牌結果／收藏初版、測試站 API 串接、前端 build 與元件測試。V2-2 後端與我離開後的 review 修正、整合驗收及部署由其他工程師接手。

### 版本關係

| 版本 | 交接定位 | 主要範圍 |
| --- | --- | --- |
| V2-1 | V2-2 的既有 baseline；應保持相容，不重寫既有功能。 | 六角色一題式挑戰、身份分流、profile、影片／教材、完成解鎖、邀請計數、事件追蹤與每日報表。 |
| V2-2 | 在既有 parent challenge 與 V2-1 流程上新增卡牌 child records。 | 11 張卡、按角色遊玩紀錄日期抽卡、跨局收藏推導、卡牌動畫與報表欄位。 |

| 資源 | 位置 |
| --- | --- |
| 前端 Repository | [astrazeneca-liff-med](https://github.com/Aiii-Developers/astrazeneca-liff-med) |
| 後端 Repository | [astrazeneca-hcp-api](https://github.com/Aiii-Developers/astrazeneca-hcp-api) |
| PRD | [AZTW CRESTCODE PRD](https://github.com/Aiii-Developers/astrazeneca-docs/blob/main/%E5%B0%88%E6%A1%88_crestcode_V2/AZTW_CRESTCODE_PRD.md) |
| 抽卡問題清單 | [LIFF issue #54](https://github.com/Aiii-Developers/astrazeneca-liff-med/issues/54) |
| OpenSpec changes | Backend：`crestcode-v2-2-card-collection-backend`；Frontend：`crestcode-v2-2-card-collection-frontend` |
| Figma 主檔 | [AstraZeneca HCP 業代 LIFF](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=4828-5759&p=f&m=dev) |
| 一般抽卡／集滿畫面 | [一般抽卡](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6305-10099&m=dev) · [集滿卡牌](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6305-10155&m=dev) |
| 收藏／卡牌詳情畫面 | [家族樹收藏入口](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6290-9285&m=dev) · [完成頁收藏入口](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6290-9674&m=dev) · [卡牌正面](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6302-9927&m=dev) · [卡牌背面](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6305-10045&m=dev) · [翻面文字](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6302-10017&m=dev) |

## 2. 六個案例情境

六位家族角色各有一組單題案例。以下只作交接識別，正式題目、答案、解析及 Reference 必須以 AZ Medical／Compliance 核准版本為準。

| 角色 | 案例背景摘要 |
| --- | --- |
| 冠嬸婆 | 65 歲、有高血壓；生活型態調整三個月後 LDL-C 仍為 140 mg/dL。 |
| 冠爺 | 75 歲，近期急性心肌梗塞，住院檢驗 LDL-C 為 120 mg/dL。 |
| 冠媽 | 50 歲，健檢 HbA1C 9.0%、LDL-C 200 mg/dL。 |
| 冠爸 | 55 歲，近期急性缺血性中風，LDL-C 為 120 mg/dL。 |
| 冠叔 | 45 歲、有抽菸及高血壓；生活型態調整後 LDL-C 仍為 140 mg/dL。 |
| 阿冠 | 20 歲大學生，急性心肌梗塞並診斷 ASCVD；出院後 LDL-C 為 150 mg/dL。 |

## 3. 身分情境與基本流程

LIFF 初始化後由後端依 Firebase ID token 判定身份。前端不可用 URL 中的 LINE UID 作為登入身份依據。

| 身分 | 進入流程 |
| --- | --- |
| 已驗證 HCP | 直接進家族樹。 |
| 待驗證 HCP | 依既有資料進家族樹；已有 profile 不要求重填。 |
| 未驗證 HCP | 沒有既存 profile 時先填姓名、縣市與服務院所，再進家族樹。 |
| 已註銷 HCP | 顯示阻擋頁，不允許開始遊戲。 |

### V2-1 基本流程

```text
LIFF 初始化 → 身分判定 →（必要時填基本資料）→ 家族樹選角
→ 題目 → 後端判分 → 解析／Reference → 影片 → 教材／結果
→ 角色完成並解鎖
```

- 同角色未完成流程要恢復原進度；切換角色時載入該角色自己的狀態。
- 作答由後端判分；前端不自行決定正解或提早顯示解析。
- 只有後端狀態到達 completed 才解鎖角色。
- 影片以原生 video controls／playsinline 播放，並保留外部開啟方式。

### V2-1 既有功能邊界

- Parent player document 使用 `sites/{site}/hcpChallengeV2/{challengeId}`；六角色以 `memberProgress` 保存目前狀態與完成投影。題目內容另存 `sites/{site}/hcpChallengeV2Scenarios/{scenarioVersionId}`，資料庫優先、核准程式碼內容作 fallback。
- V2-1 服務 API 的主要路徑（均為 POST；實際 host／`/az-hcp` 前綴依環境設定）：`identity`、`family-members`、`scenario-content`、`medical-institutions`、`start`、`profile-status`、`profile`、`select-member`、`answer`、`advance`、`track`、`reports`，皆位於 `/hcp-challenge/v2/` 下。V2-2 增加的 `draw-card`、`card-collection` 是附加端點，不取代這些既有端點；改動前先對照目前 OpenAPI 與前端 service。
- 既有玩家資料、身份、profile、邀請來源、角色進度、events 與完成欄位屬於 V2-1 相容面。V2-2 不應改寫 V1 的 `hcpChallenge`、V1 題庫、Sales 統計或其他 site 資料。
- 邀請頁「參與」是首次完成任一角色、按 LINE user ID 去重；六角色全完成另由 all-members completion 記錄，不可混為同一口徑。
- V2-1 每日報表曾核對為 24 欄、逐遊玩列；V2-2 只增加「當次遊戲抽的卡牌」欄，其他完成統計沿用既有判定。

### V2-2 抽卡與收藏流程

```text
家族樹選角色 → 題目 → 解析 → 影片頁
→ 點「持續關注 Galaxy News」→ 後端保存抽卡結果
→ 抽卡彈窗由下往上滑入
→ 彈窗到位後背景切換至下一頁
→ 卡片正面顯示 3 秒 → 翻至背面並停留
```

- 抽卡入口是**影片頁**的「持續關注 Galaxy News」，不是結果頁按鈕，也不要求影片播完。
- 收藏查看入口只在家族樹與挑戰完成頁；使用固定懸浮右下角的圖片，不額外疊文字。
- 收藏詳情中的卡片由使用者點下方文字翻面；不套用抽卡的 3 秒動畫。
- 每次顯示抽卡結果（新抽、同日重複、恢復已存結果）都先顯示正面 3 秒再翻面；重試不得換卡。
- 卡牌放大／觸控縮放曾提出，但後來決定暫緩，不列入本次範圍。

### 最終抽卡規則

- 固定 11 張；V2-1 舊遊玩不補發收藏。
- 每局有效日期依角色遊玩記錄的 `startedAt`，以 `Asia/Taipei` 換日；抽卡按鈕時間另記為實際抽卡時間。23:59 開始角色、00:01 點擊 Galaxy News，仍屬前一天。
- 同一有效日期首抽：從尚未收藏卡牌等機率抽一張；同日其他局沿用該日第一張。
- 集滿 11 張後，新有效日期從全部 11 張等機率抽一張，收藏數維持 11/11。
- 同一 `cardDrawId` 重送或恢復時回傳原結果，不重新抽卡。

## 4. 前端回饋與 UI 定案

| 回饋／狀況 | 定案或處理方式 |
| --- | --- |
| 前端要求以 PRD 為主，不採早期 HTML 機率表與「同卡四次」上限。 | 抽卡規則收斂為每日首張、同日同卡；滿卡後新日期在 11 張間等機率抽取。 |
| 抽卡曾被放在完成頁，與流程不一致。 | 更正為影片頁點 Galaxy News 才抽卡。 |
| 同日重抽或恢復結果原本可能直接顯示背面。 | 定為任何抽卡結果畫面都正面 3 秒後翻背面。 |
| 抽卡結果彈窗的呈現方式。 | 由下往上滑入；到位後背景才切至下一頁；右上角叉叉為黑色。 |
| 家族樹／完成頁找不到卡牌收藏入口，或入口位置不穩。 | 只在這兩頁顯示右下角固定懸浮圖片入口，圖片本身已有文案，不另外疊字。 |
| 收藏內卡片詳情需可翻面、可退出。 | 點下方文字翻面並播放旋轉動畫；右上角顯示叉叉。 |
| 卡牌畫質看起來模糊。 | 檢查時圖片已載入原始 1000×1400 檔，畫面顯示約 242×340；根因未確認。放大／縮放功能後續被暫緩，勿記成已解決的畫質修正。 |
| 素材檔案名稱與位置。 | 11 張卡的正／背／黑卡素材使用小寫檔名，位於 `src/assets/image/hcp-challenge/v2/cards`。 |

## 5. 資料模型與 API 契約

### Firestore 結構

```text
sites                                      ← collection
└─ {site}                                  ← site document，例如 astrazeneca
   └─ hcpChallengeV2                       ← challenge 子集合
      └─ {challengeId}                     ← 玩家／challenge 文件
         └─ cardDraws                       ← 這份 challenge 文件底下的子集合
            └─ {cardDrawId}                 ← 一局遊戲的卡牌紀錄文件
```

- 例如完整文件路徑是 `sites/astrazeneca/hcpChallengeV2/abc123/cardDraws/run456`。`sites`、`hcpChallengeV2`、`cardDraws` 是集合；`astrazeneca`、`abc123`、`run456` 是文件。
- `cardDraws` 不在 `challengeId` 文件內當作欄位或陣列，也不是 Firestore 最上層的獨立集合；它是 `sites/{site}/hcpChallengeV2/{challengeId}` 這份文件底下的子集合。
- `challengeId` 沿用既有玩家／challenge parent，不是每一局都重新建立；每次角色遊玩在其 `cardDraws` 子集合新增一份 `cardDrawId` 文件。
- 每份 `cardDraws/{cardDrawId}` 文件保存一局的開始時間、角色、遊戲進度、完成狀態、事件、`drawnCardId`、`drawnCardName`、`cardDrawDate`、`cardDrawnAt`；parent 的角色摘要保留目前或可恢復的 `cardDrawId`。
- 不新增獨立玩家收藏、收藏摘要或每日卡牌文件。收藏由該已驗證玩家的有效 `cardDraws` 記錄推導。
- V2-1 舊 parent 沒有 `cardDraws` 時沿用既有流程與報表，不搬資料、不補發卡牌。

### 前端會用到的 API

API 共用前綴為 `/az-hcp/hcp-challenge/v2`。主要卡牌端點：

| Method／Path | 用途／重要欄位 |
| --- | --- |
| `POST /az-hcp/hcp-challenge/v2/draw-card` | Request `{site, challengeId, cardDrawId}`；身份取自 Bearer token。回應包含 `effectiveDate`、`drawnAt`、`reusedExistingResult`、collection 狀態。 |
| `POST /az-hcp/hcp-challenge/v2/card-collection` | 依 token owner 查詢 11 張卡；收藏摘要在 `summary.collectedCount`、`summary.totalCount`、`summary.isComplete`。 |
| `POST /az-hcp/hcp-challenge/v2/start` | 新 V2-2 流程需傳 `cardDrawId: null` 啟用單局 lifecycle；回應帶回 `cardDrawId`／`cardDraw` 以供續玩。 |

抽卡 response 使用後端欄位 `effectiveDate`、`reusedExistingResult`；collection response 的數量與集滿狀態在 `summary`。前端 model 若使用其他命名，需在 normalizer 明確 mapping。

### 報表

V2-2 以每份有效 `cardDraws` 文件輸出一筆遊玩資料，新增欄位名稱為 **「當次遊戲抽的卡牌」**。有有效抽卡結果時填英文卡名，缺少或無效時填 `N`；完成／統計欄沿用原本的遊戲判定，不由卡牌欄反推。V2-1 舊資料仍走既有 flatten，卡牌欄填 `N`。

## 6. 開發問題、解法與交接狀態

### V2-1 前端回饋與問題處理紀錄

| 問題／前端回饋 | 當時處理方向 | 接手時注意 |
| --- | --- | --- |
| A 角色的影片／進度狀態洩漏到 B 角色。 | 進度與 session key 按角色隔離；切換角色後重新載入該角色狀態。 | 回歸 A→B→A 與未完成續玩。 |
| 角色被選取後看起來像已完成。 | 將目前選取狀態與已完成／解鎖狀態分開呈現。 | 不要以 selected 推導 completed。 |
| Box iframe 在手機影片體驗不佳。 | 改用 GCS MP4 與原生 video controls／playsinline，保留外開連結。 | 驗證 LINE WebView 的播放與離頁行為。 |
| 題目或案例圖片載入前空白。 | 預載情境圖片並顯示載入狀態。 | 影像錯誤與慢網路需保留可理解的狀態。 |
| 邀請參與數與六角色全完成數被混用。 | 首次完成任一角色的參與數以 LINE user 去重；全角色完成使用另一個完成欄位。 | 報表口徑需維持分開。 |
| localhost LIFF 缺少 site 或 redirect 設定錯誤。 | LIFF 狀態帶 `site`，以 Angular server 搭配 LIFF CLI 測試。 | `npm start` 與 `npm run serve:liff` 是本機啟動方式，不代表可用瀏覽器直接開網址完成 LIFF 驗收。 |

以上是 V2-1 開發時的處理紀錄摘要；目前分支是否仍維持相同實作，需由接手者檢查。

### V2-2 問題與交接狀態

| 問題 | 處理／解法 | 狀態 |
| --- | --- | --- |
| PRD、會議 HTML 與早期機率規則互相衝突。 | 以後續確認的 PRD 方向為主；逐項明確定義跨日、同日重抽、滿卡與 replay 案例。 | 規則已收斂並寫入 OpenSpec。 |
| local route 直接開啟時 LIFF guard 回報缺少 `site` 或跳 LINE 400。 | 本機網址需帶 `site=astrazeneca`；需要 LIFF 時先啟動 Angular (`npm start`)，再執行 `npm run serve:liff`。redirect URL 必須符合 LINE LIFF channel 設定；瀏覽器直開不等同 LIFF 驗收。 | 本機使用流程已確認；環境設定需由接手者核對。 |
| 早期 review 指出已完成但未抽卡的續玩頁沒有抽卡入口。 | 恢復該狀態時導回有 Galaxy News CTA 的影片／完成互動流程，不可只留在無抽卡按鈕的結果畫面。 | 前端曾依 review 修正；接手者需以當前 branch 驗證。 |
| 收藏彈窗關閉後重開，舊 request 可能覆蓋新資料或 loading。 | 關閉時 cancel request 或使用 request generation/token 忽略過期 response，並測試先舊後新的回應順序。 | 1 項 P2 已交接；我離開後是否修好未知。 |
| 重送抽卡可能播放／略過錯誤動畫或改變卡片。 | 後端以 cardDraw record 保存固定結果；前端重用同一結果，不重抽，但每次顯示結果都依產品要求正面 3 秒再翻背面。 | 需求已定；API 串接 review 後續交接。 |
| 卡牌畫面看起來模糊。 | 確認 `src` 有載入、自然尺寸 1000×1400、顯示尺寸約 242×340；因此不能直接認定 asset 被壓縮。檢視放大／手勢縮放曾提出後又暫停，未確認 CSS 根因或最終修復。 | 根因未確認；不列為已解決。 |

### 前端當時的驗證紀錄

- `npm run build-stage` 成功。
- 抽卡元件 targeted tests 41 項通過。
- 以上是本機 build／unit test 證據，不代表 Stage 端到端、LINE WebView 或正式環境驗收已完成。
- V2-1 收尾紀錄曾記載後端 `bun test` 為 230 項通過、0 項失敗（698 expectations、24 個測試檔）；這是歷史驗證快照，不代表目前 branch 的測試結果。

## 7. 交接給接手工程師

1. 先以最新 remote branch 確認 V2-2 的真實 code／OpenSpec 狀態；不要只依本文件中的 commit 或測試歷史判斷。
2. 優先核對已交接的前端 review 問題是否已修正，並補上 request／response contract tests。
3. 用測試站驗證 `startedAt` 的台北有效日期、同日固定卡、集滿後全卡池等機率抽取，以及所有 draw presentation 正面 3 秒翻面。
4. 驗證 collection summary UI、關閉重開的 request race、V2-1 legacy flow／report 沒有回歸。
5. 由新負責人決定 Stage／Production 部署、報表與客戶文字驗收；本文件作者已退出後續負責範圍。

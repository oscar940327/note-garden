---
title: CRESTCODE V2-1／V2-2 專案交接文件
description: 專案情境、遊戲流程、前端回饋、資料與 API 設計，以及開發問題和交接狀態。
date: 2026-10-28
author: Oscar
status: completed
tags:
  - 實習
  - 專案交接
  - CRESTCODE
  - LINE-LIFF
  - AstraZeneca
---

# CRESTCODE V2-1／V2-2 專案交接文件

> 本文件記錄我負責期間的需求決策、V2-2 前端初版、驗證紀錄與交接事項。V2-2 後續已不由我負責，本文不把未確認的後續工作寫成已完成。

## 1. 專案情境與範圍

CRESTCODE 是提供 HCP 使用的 LINE LIFF 家族案例挑戰。V2-1 將舊版兩題式體驗改成選擇家族角色、回答一題、查看解析與影片，再完成角色挑戰；V2-2 在既有流程加入 11 張卡牌抽取與收藏。主要前端是 Angular LIFF，後端使用 Bun／Elysia API、Firebase Authentication 與 Firestore。

我在 V2-1 參與前後端主要流程、身份／角色／題目狀態、事件與報表的整理和實作；V2-2 負責需求收斂、OpenSpec 規格、前端卡牌結果／收藏初版、測試站 API 串接、前端 build 與元件測試。V2-2 的交接紀錄以本人負責的前端開發為主，後續前端修正已交接接手工程師。

### V2-1 完成進度

V2-1 個人負責的開發項目已完成，目前沒有另外列出的未完成開發事項。

| 項目           | 完成內容                                                                   | 狀態   |
| -------------- | -------------------------------------------------------------------------- | ------ |
| 身份判斷       | 依 HCP 驗證狀態決定進入基本資料頁、家族選角頁或阻擋頁。                    | 已完成 |
| 基本資料頁     | 未驗證使用者可填寫姓名、縣市及服務院所，資料寫入資料庫並供報表使用。       | 已完成 |
| 六角色遊玩流程 | 完成選角、題目、作答、解析、影片及結果頁流程。                             | 已完成 |
| 獨立角色進度   | 各角色分別記錄進度，同角色可續玩，切換角色時讀取各自狀態。                 | 已完成 |
| 角色完成狀態   | 角色完成後顯示彩色，重新整理後保留完成狀態。                               | 已完成 |
| 題目與資料庫   | 整理 `hcpChallengeV2` 玩家資料結構，題目採資料庫優先、程式碼內容作為備援。 | 已完成 |
| 前端畫面       | 依 Figma 調整案例版面、文字粗體與顏色、載入動畫、圖片預載及結果頁。        | 已完成 |
| 影片播放       | 改用 Google Cloud Storage 影片網址及原生播放器，保留外部開啟連結。         | 已完成 |
| 業務邀請頁     | QR Code 與分享連結帶入業務 `medSalesKey`，導向 V2 遊玩頁。                 | 已完成 |
| 邀請參與計數   | 首次完成任一角色後計入參與人數，同一 LINE 使用者僅計算一次。               | 已完成 |
| 每日報表       | 完成遊玩紀錄整理、Excel 產生與寄送功能，並進行測試站測試。                 | 已完成 |

### V2-1 協作分支與 PR

本人沿用 Tiffany（`tiffanyaiii`）既有的 `feature/hcp-challenge-dynamic-scenarios` 分支進行 V2-1 開發，並透過該分支原有的 PR 提交成果。下列兩個 PR 皆由 Tiffany 建立，提交清單均包含本人的 `oscaraiii` 提交。PR 作者、來源分支、合併狀態及提交清單於 2026-10-28 以 GitHub 紀錄核對。

| Repo                        | 協作分支                                  | Tiffany 建立的 PR                                                      | PR 狀態                                    |
| --------------------------- | ----------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| 後端 `astrazeneca-hcp-api`  | `feature/hcp-challenge-dynamic-scenarios` | [#64](https://github.com/Aiii-Developers/astrazeneca-hcp-api/pull/64)  | 2026-09-15 已合併至 `main`，包含本人提交。 |
| 前端 `astrazeneca-liff-med` | `feature/hcp-challenge-dynamic-scenarios` | [#45](https://github.com/Aiii-Developers/astrazeneca-liff-med/pull/45) | 2026-09-15 已合併至 `main`，包含本人提交。 |

原始 Draft PR 歷史：本人另曾以 Stage 分支向 `main` 建立後端 [#90](https://github.com/Aiii-Developers/astrazeneca-hcp-api/pull/90) 與前端 [#52](https://github.com/Aiii-Developers/astrazeneca-liff-med/pull/52)，這兩個 Draft PR 均已關閉、未合併。

### V2-1 我的測試站部署

開發期間將 V2-1 成果整合至測試分支，建立並推送測試版本 tag，透過既有 GitHub Actions 自動部署。

| Repo                        | 測試分支       | 部署方式                                                           |
| --------------------------- | -------------- | ------------------------------------------------------------------ |
| 後端 `astrazeneca-hcp-api`  | `stage/s1.3.0` | 推送 `s*` tag，觸發 Docker image 建置及 Cloud Run 部署。           |
| 前端 `astrazeneca-liff-med` | `stage/s1.7.0` | 推送 `s*` tag，觸發 Angular Stage build 及 Firebase Hosting 部署。 |

以下為截至 2026-10-28 查得最後由 `oscaraiii` 觸發且部署成功的版本；時間採 GitHub Actions 啟動時間，均已換算為台北時間。

| 專案／環境                    | 最後由本人發布的版本                                         | 部署紀錄                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `astrazeneca-hcp-api` 測試站  | `s1.3.133`；2026-09-15 11:23（台北時間）；提交 `e42818f`。   | 由 `oscaraiii` 觸發，[GitHub Actions 成功](https://github.com/Aiii-Developers/astrazeneca-hcp-api/actions/runs/34924821931)。  |
| `astrazeneca-liff-med` 測試站 | `s1.7.65-65`；2026-09-15 11:27（台北時間）；提交 `622b211`。 | 由 `oscaraiii` 觸發，[GitHub Actions 成功](https://github.com/Aiii-Developers/astrazeneca-liff-med/actions/runs/34925035032)。 |

兩個 repo 均未查到由 `oscaraiii` 觸發且成功的正式站部署紀錄。部署後曾於測試站測試遊玩流程、角色完成狀態、邀請計數、報表資料及寄信功能。

### V2-1 申請過的權限

| 權限                  | 申請情況 | 使用目的                                                                           |
| --------------------- | -------- | ---------------------------------------------------------------------------------- |
| PAM `firebase-editor` | 已申請   | 查看 Firebase／Firestore 資料庫內容，並執行新增 collection、文件及遊戲資料等操作。 |

### V2-2 我的完成進度

本人負責的前端初版與需求整理已交接。下表記錄交接時已完成的內容；後續 review 修正結果以接手工程師的紀錄為準。

| 項目       | 已完成內容                                                                                       | 交接時狀態                                                 |
| ---------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| 需求與規格 | 收斂 11 張卡牌、每日抽卡、滿卡後抽卡與收藏規則，建立前後端 OpenSpec。                            | 本人負責的規格整理已完成。                                 |
| 卡牌素材   | 素材放入前端 `src/assets/image/hcp-challenge/v2/cards`，檔名統一小寫，隨 repo 管理。             | 已完成。                                                   |
| 抽卡畫面   | 影片頁 Galaxy News 觸發抽卡、彈窗由下往上滑入、正面停留 3 秒後翻至背面；重複抽卡也播放相同動畫。 | 已完成前端初版。                                           |
| 收藏畫面   | 家族樹／完成頁右下角收藏入口、收藏清單、卡牌詳情、手動翻面動畫及關閉功能。                       | 已完成前端初版。                                           |
| API 串接   | 本機前端使用測試站 API 進行抽卡與收藏串接。                                                      | 已完成初版串接；review 發現的 API 契約問題已交接他人處理。 |
| 本機驗證   | `npm run build-stage` 成功，抽卡元件測試 41 項通過。                                             | 已完成當時的本機驗證；完整環境驗收結果未記錄。             |

### V2-2 我的開發分支與 PR

截至 2026-10-28，本機前端 repo 確認位於下列分支與提交；PR 連結及遠端合併狀態尚未核實。

| Repo                        | 本機開發分支／最新提交                                                                          | PR／合併狀態                                              |
| --------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 前端 `astrazeneca-liff-med` | `feature/crestcode-card-collection`；`7458acf`（`fix(change): complete V2-2 card draw flow`）。 | PR 連結、開啟／關閉／合併狀態待接手者依 GitHub 紀錄補齊。 |

開發期間曾在 `git push` 遇到 HTTP 400；這是當時的操作紀錄，遠端是否收到該提交需以 GitHub／remote hash 核對。

### V2-2 前端部署紀錄

| 環境  | 交接文件可確認的狀態                                                               | 本機 repo 的部署設定                                                                                                                                     |
| ----- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stage | 已完成本機 `build-stage`；本文未記錄 V2-2 前端成功部署的 tag、時間或 Actions run。 | 推送 `s*` tag，GitHub Actions 執行 `npm run build-stage`，部署至 Firebase project `astrazeneca-hcp-stage` 的 Hosting target `astrazeneca-liff-med-dev`。 |

以上部署方式依 2026-10-28 本機 repo 的 workflow 記錄；build 成功與實際部署成功需分別確認。

### V2-2 素材與權限紀錄

卡牌圖片放在前端 repo 的 `src/assets/image/hcp-challenge/v2/cards`，隨前端版本一起發布。PAM `firebase-editor` 的既有申請與用途見前述權限表；本文沒有另列 V2-2 新增權限申請紀錄。

### 版本關係

| 版本 | 交接定位                                                       | 主要範圍                                                                                  |
| ---- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| V2-1 | V2-2 的既有 baseline；應保持相容，不重寫既有功能。             | 六角色一題式挑戰、身份分流、profile、影片／教材、完成解鎖、邀請計數、事件追蹤與每日報表。 |
| V2-2 | 在既有 parent challenge 與 V2-1 流程上新增卡牌 child records。 | 11 張卡、按角色遊玩紀錄日期抽卡、跨局收藏推導、卡牌動畫與報表欄位。                       |

| 資源               | 位置                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 前端 Repository    | [astrazeneca-liff-med](https://github.com/Aiii-Developers/astrazeneca-liff-med)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 後端 Repository    | [astrazeneca-hcp-api](https://github.com/Aiii-Developers/astrazeneca-hcp-api)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| PRD                | [AZTW CRESTCODE PRD](https://github.com/Aiii-Developers/astrazeneca-docs/blob/main/%E5%B0%88%E6%A1%88_crestcode_V2/AZTW_CRESTCODE_PRD.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 抽卡問題清單       | [LIFF issue #54](https://github.com/Aiii-Developers/astrazeneca-liff-med/issues/54)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| OpenSpec changes   | Backend：`crestcode-v2-2-card-collection-backend`；Frontend：`crestcode-v2-2-card-collection-frontend`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Figma 主檔         | [AstraZeneca HCP 業代 LIFF](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=4828-5759&p=f&m=dev)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 一般抽卡／集滿畫面 | [一般抽卡](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6305-10099&m=dev) · [集滿卡牌](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6305-10155&m=dev)                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 收藏／卡牌詳情畫面 | [家族樹收藏入口](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6290-9285&m=dev) · [完成頁收藏入口](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6290-9674&m=dev) · [卡牌正面](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6302-9927&m=dev) · [卡牌背面](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6305-10045&m=dev) · [翻面文字](https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6302-10017&m=dev) |

## 2. 六個案例情境

六位家族角色各有一組單題案例。以下只作交接識別，正式題目、答案、解析及 Reference 必須以 AZ Medical／Compliance 核准版本為準。

| 角色   | 案例背景摘要                                                       |
| ------ | ------------------------------------------------------------------ |
| 冠嬸婆 | 65 歲、有高血壓；生活型態調整三個月後 LDL-C 仍為 140 mg/dL。       |
| 冠爺   | 75 歲，近期急性心肌梗塞，住院檢驗 LDL-C 為 120 mg/dL。             |
| 冠媽   | 50 歲，健檢 HbA1C 9.0%、LDL-C 200 mg/dL。                          |
| 冠爸   | 55 歲，近期急性缺血性中風，LDL-C 為 120 mg/dL。                    |
| 冠叔   | 45 歲、有抽菸及高血壓；生活型態調整後 LDL-C 仍為 140 mg/dL。       |
| 阿冠   | 20 歲大學生，急性心肌梗塞並診斷 ASCVD；出院後 LDL-C 為 150 mg/dL。 |

## 3. 身分情境與基本流程

LIFF 初始化後由後端依 Firebase ID token 判定身份。前端不可用 URL 中的 LINE UID 作為登入身份依據。

| 身分       | 進入流程                                                  |
| ---------- | --------------------------------------------------------- |
| 已驗證 HCP | 直接進家族樹。                                            |
| 待驗證 HCP | 依既有資料進家族樹；已有 profile 不要求重填。             |
| 未驗證 HCP | 沒有既存 profile 時先填姓名、縣市與服務院所，再進家族樹。 |
| 已註銷 HCP | 顯示阻擋頁，不允許開始遊戲。                              |

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

| 回饋／狀況                                                    | 定案或處理方式                                                                                                        |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 前端要求以 PRD 為主，不採早期 HTML 機率表與「同卡四次」上限。 | 抽卡規則收斂為每日首張、同日同卡；滿卡後新日期在 11 張間等機率抽取。                                                  |
| 抽卡曾被放在完成頁，與流程不一致。                            | 更正為影片頁點 Galaxy News 才抽卡。                                                                                   |
| 同日重抽或恢復結果原本可能直接顯示背面。                      | 定為任何抽卡結果畫面都正面 3 秒後翻背面。                                                                             |
| 抽卡結果彈窗的呈現方式。                                      | 由下往上滑入；到位後背景才切至下一頁；右上角叉叉為黑色。                                                              |
| 家族樹／完成頁找不到卡牌收藏入口，或入口位置不穩。            | 只在這兩頁顯示右下角固定懸浮圖片入口，圖片本身已有文案，不另外疊字。                                                  |
| 收藏內卡片詳情需可翻面、可退出。                              | 點下方文字翻面並播放旋轉動畫；右上角顯示叉叉。                                                                        |
| 卡牌畫質看起來模糊。                                          | 檢查時圖片已載入原始 1000×1400 檔，畫面顯示約 242×340；根因未確認。放大／縮放功能後續被暫緩，勿記成已解決的畫質修正。 |
| 素材檔案名稱與位置。                                          | 11 張卡的正／背／黑卡素材使用小寫檔名，位於 `src/assets/image/hcp-challenge/v2/cards`。                               |

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

| Method／Path                                    | 用途／重要欄位                                                                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `POST /az-hcp/hcp-challenge/v2/draw-card`       | Request `{site, challengeId, cardDrawId}`；身份取自 Bearer token。回應包含 `effectiveDate`、`drawnAt`、`reusedExistingResult`、collection 狀態。 |
| `POST /az-hcp/hcp-challenge/v2/card-collection` | 依 token owner 查詢 11 張卡；收藏摘要在 `summary.collectedCount`、`summary.totalCount`、`summary.isComplete`。                                   |
| `POST /az-hcp/hcp-challenge/v2/start`           | 新 V2-2 流程需傳 `cardDrawId: null` 啟用單局 lifecycle；回應帶回 `cardDrawId`／`cardDraw` 以供續玩。                                             |

抽卡 response 使用後端欄位 `effectiveDate`、`reusedExistingResult`；collection response 的數量與集滿狀態在 `summary`。前端 model 若使用其他命名，需在 normalizer 明確 mapping。

### 報表

V2-2 以每份有效 `cardDraws` 文件輸出一筆遊玩資料，新增欄位名稱為 **「當次遊戲抽的卡牌」**。有有效抽卡結果時填英文卡名，缺少或無效時填 `N`；完成／統計欄沿用原本的遊戲判定，不由卡牌欄反推。V2-1 舊資料仍走既有 flatten，卡牌欄填 `N`。

## 6. 開發問題、解法與交接狀態

### V2-1 前端回饋與問題處理紀錄

| 問題／前端回饋                                  | 當時處理方向                                                              | 接手時注意                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| A 角色的影片／進度狀態洩漏到 B 角色。           | 進度與 session key 按角色隔離；切換角色後重新載入該角色狀態。             | 回歸 A→B→A 與未完成續玩。                                                                      |
| 角色被選取後看起來像已完成。                    | 將目前選取狀態與已完成／解鎖狀態分開呈現。                                | 不要以 selected 推導 completed。                                                               |
| Box iframe 在手機影片體驗不佳。                 | 改用 GCS MP4 與原生 video controls／playsinline，保留外開連結。           | 驗證 LINE WebView 的播放與離頁行為。                                                           |
| 題目或案例圖片載入前空白。                      | 預載情境圖片並顯示載入狀態。                                              | 影像錯誤與慢網路需保留可理解的狀態。                                                           |
| 邀請參與數與六角色全完成數被混用。              | 首次完成任一角色的參與數以 LINE user 去重；全角色完成使用另一個完成欄位。 | 報表口徑需維持分開。                                                                           |
| localhost LIFF 缺少 site 或 redirect 設定錯誤。 | LIFF 狀態帶 `site`，以 Angular server 搭配 LIFF CLI 測試。                | `npm start` 與 `npm run serve:liff` 是本機啟動方式，不代表可用瀏覽器直接開網址完成 LIFF 驗收。 |

以上是 V2-1 開發時的處理紀錄摘要；目前分支是否仍維持相同實作，需由接手者檢查。

### V2-2 問題與交接狀態

| 問題                                                              | 處理／解法                                                                                                                                                                         | 狀態                                               |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| PRD、會議 HTML 與早期機率規則互相衝突。                           | 以後續確認的 PRD 方向為主；逐項明確定義跨日、同日重抽、滿卡與 replay 案例。                                                                                                        | 規則已收斂並寫入 OpenSpec。                        |
| local route 直接開啟時 LIFF guard 回報缺少 `site` 或跳 LINE 400。 | 本機網址需帶 `site=astrazeneca`；需要 LIFF 時先啟動 Angular (`npm start`)，再執行 `npm run serve:liff`。redirect URL 必須符合 LINE LIFF channel 設定；瀏覽器直開不等同 LIFF 驗收。 | 本機使用流程已確認；環境設定需由接手者核對。       |
| 早期 review 指出已完成但未抽卡的續玩頁沒有抽卡入口。              | 恢復該狀態時導回有 Galaxy News CTA 的影片／完成互動流程，不可只留在無抽卡按鈕的結果畫面。                                                                                          | 前端曾依 review 修正；接手者需以當前 branch 驗證。 |
| 收藏彈窗關閉後重開，舊 request 可能覆蓋新資料或 loading。         | 關閉時 cancel request 或使用 request generation/token 忽略過期 response，並測試先舊後新的回應順序。                                                                                | 1 項 P2 已交接；我離開後是否修好未知。             |
| 重送抽卡可能播放／略過錯誤動畫或改變卡片。                        | 後端以 cardDraw record 保存固定結果；前端重用同一結果，不重抽，但每次顯示結果都依產品要求正面 3 秒再翻背面。                                                                       | 需求已定；API 串接 review 後續交接。               |
| 卡牌畫面看起來模糊。                                              | 確認 `src` 有載入、自然尺寸 1000×1400、顯示尺寸約 242×340；因此不能直接認定 asset 被壓縮。檢視放大／手勢縮放曾提出後又暫停，未確認 CSS 根因或最終修復。                            | 根因未確認；不列為已解決。                         |

### 前端當時的驗證紀錄

- `npm run build-stage` 成功。
- 抽卡元件 targeted tests 41 項通過。
- 以上是本機 build／unit test 證據，不代表 Stage 端到端、LINE WebView 或正式環境驗收已完成。
- V2-1 收尾紀錄曾記載後端 `bun test` 為 230 項通過、0 項失敗（698 expectations、24 個測試檔）；這是歷史驗證快照，不代表目前 branch 的測試結果。

## 7. 交接給接手工程師

| 後續事項                 | 建議接手角色                                   | 交接狀態                                     |
| ------------------------ | ---------------------------------------------- | -------------------------------------------- |
| API 契約、卡牌畫質排查。 | 接手前端工程師；API 契約部分與後端工程師確認。 | 已交接；後續修正與驗證結果由接手工程師更新。 |

本文件作者已退出 V2-2 後續負責範圍。

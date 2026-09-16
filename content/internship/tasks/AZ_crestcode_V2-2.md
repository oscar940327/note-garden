---
title: AZTW CRESTCODE V2-2 卡牌收藏與每日抽卡功能
status: in-progress
start_date: 2026-09-15
updated_date: 2026-09-16
assigned_by: AZ
tags:
  - 實習
  - AstraZeneca
  - CRESTCODE
  - LINE LIFF
  - HCP
  - PRD
  - Angular
  - TypeScript
  - Firestore
  - OpenSpec
  - SDD
  - Software Engineering
---
# AZTW CRESTCODE V2-2 卡牌收藏與每日抽卡功能

## 任務目標

延續 [[AZ_crestcode_V2-1|AZTW CRESTCODE V2-1 遊戲使用流程改版]]，為既有 CRESTCODE 家族挑戰新增「每日抽卡」與「卡牌收藏」機制。HCP 完成任一角色挑戰後，可透過「持續關注 Galaxy News」取得卡牌；系統需保留跨遊戲、跨角色及跨日期的收藏進度，並在家族樹頁與挑戰完成頁提供卡牌收藏入口。

本階段不只是增加一個抽卡畫面，也需要處理抽卡規則、日期邊界、重複遊玩、未完成流程恢復、Firestore 資料生命週期、併發一致性、報表欄位，以及 Figma 動畫與素材對應。目標是在 Repository 分支整理完成後，能直接以 OpenSpec／SDD 進入開發。

## 目前進度摘要（2026-09-16）

- **需求釐清：** 已完成 PRD、Issue、會議 HTML 與 Figma 的交叉核對，確認本版以 PRD 的「同日只取得一張新卡」規則為準，不採用早期 HTML 的機率表與同卡四次上限。
- **核心規則：** 卡池共 11 張；每日第一次有效抽卡從未收藏卡牌隨機取得 1 張，同日後續有效抽卡固定顯示該日第一張卡。
- **資料方向：** 每一局仍使用獨立 `challengeId`；長期收藏狀態另存玩家層級文件，不把所有歷史遊玩塞入同一份 challenge 文件。
- **互動規格：** 抽中後卡片正面顯示 3 秒，再自動翻至背面並停留；收藏頁卡片不自動翻面，由使用者點擊下方文字手動翻面。
- **素材盤點：** 已取得 11 張卡牌各自的正面、背面與黑卡素材，共 33 張卡牌圖，另有星星與查看卡牌按鈕素材，共 35 張。
- **尚未實作：** 目前仍在等其他工程師修正 Repository 分支混入 Stage 歷史的問題；乾淨基準確定後，先建立後端 OpenSpec change，再完成前端 change。

> 本文件記錄的是已確認規格、技術設計方向與開發準備，不把尚未完成的程式實作寫成既有成果。實作、測試、Stage 驗收與量化結果會在開發後補上。

## 專案資訊

- 客戶：AstraZeneca Taiwan（AZTW），租戶代號 `astrazeneca`
- 平台：LINE LIFF 前端＋HCP API＋Firestore
- 版本：CRESTCODE V2-2
- 前一版本：CRESTCODE V2-1，一題制家族挑戰與角色解鎖流程
- 後端 Repository：<https://github.com/Aiii-Developers/astrazeneca-hcp-api>
- 前端 Repository：<https://github.com/Aiii-Developers/astrazeneca-liff-med>
- PRD：<https://github.com/Aiii-Developers/astrazeneca-docs/blob/main/%E5%B0%88%E6%A1%88_crestcode_V2/AZTW_CRESTCODE_PRD.md>
- 抽卡邏輯問題清單：<https://github.com/Aiii-Developers/astrazeneca-liff-med/issues/54>

## 我的角色與責任範圍

我負責承接 V2-1 的既有前後端流程，先把分散且互相衝突的需求收斂為可實作、可測試的規格，再規劃 V2-2 的 Firestore 資料模型、API 責任、前端互動、報表欄位與 OpenSpec 開發順序。

本階段實際負責的工作包括：

- 比對 PRD、會議 HTML、GitHub Issue 與 Figma，找出卡片數量、機率、每日限制、抽卡時機及動畫描述之間的矛盾。
- 逐項向 PM／前端確認，以 PRD 為規格主體，將「機率抽卡」收斂成「每日一張新卡、同日重複同卡」。
- 將遊玩紀錄與跨局收藏拆成不同生命週期，避免單一 `challengeId` 文件隨遊玩次數無限增長。
- 規劃玩家收藏的原子交易，避免快速重複點擊、雙分頁或兩台裝置同時抽卡時發出兩張不同卡。
- 盤點 11 組卡牌正面、背面與黑卡素材，對照抽卡、收藏與滿卡畫面所需資產。
- 將需求拆成後端與前端兩個 OpenSpec change，安排單人開發時先穩定資料與 API 契約，再串接前端。

醫療文案、最終視覺、Production 部署時間、Repository 歷史修復，以及客戶是否調整集滿畫面的文字，不屬於我單獨決定的範圍。

## 需求來源與追溯

- V2 PRD 下半部的抽卡與收藏功能描述。
- GitHub Issue #54：團隊整理的抽卡邏輯問題。
- `/Users/oscar/Downloads/0909_meeting_slides.html`：早期會議版規則；部分機率與上限內容已被最新 PRD 決策取代。
- `/Users/oscar/Downloads/AZ_CRESTCODE_V2_交接摘要_20260915.md`：前一階段交接資訊。
- Figma 主頁：<https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=4828-5759&p=f&m=dev>
- 一般抽卡結果：<https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6305-10099&m=dev>
- 最後一張／集滿結果：<https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6305-10155&m=dev>
- 家族樹與完成頁收藏入口：<https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6290-9285&m=dev>、<https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6290-9674&m=dev>
- 卡牌詳情正反面：<https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6302-9927&m=dev>、<https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6305-10045&m=dev>
- 手動翻面文字：<https://www.figma.com/design/OXErFSa4skc4885havEMrZ/AstraZeneca-HCP-%E6%A5%AD%E4%BB%A3-Liff%E5%85%AC%E7%89%88?node-id=6302-10017&m=dev>

## 功能範圍

### 本次納入

- 11 張固定卡牌的收藏進度。
- 完成角色後，由「持續關注 Galaxy News」觸發抽卡。
- 新日期第一次抽卡取得尚未收藏卡；同日再抽固定取得同一張。
- 中途離開後恢復尚未抽卡或已抽卡的原局狀態。
- 家族樹頁與挑戰完成頁的「點選查看卡牌」入口。
- 收藏總覽、未取得卡片黑卡狀態、卡牌詳情與手動翻面。
- 集滿 11 張後的冠軍畫面。
- 每局報表新增「抽到的卡牌名稱」。

### 本次不納入

- 早期 HTML 的依持有張數分配抽中新卡機率。
- 最後一張 30%／下一次 100% 的保底機制。
- 同一卡牌當日最多重複四次。
- 卡牌「降低或排除」的權重調整。
- 影片觀看完成作為抽卡條件。
- 動態擴充卡池或後台管理卡牌主檔。
- 將 V2-1 舊玩家的歷史遊玩回填成卡牌收藏。

## 已確認的抽卡規則

### 卡池與收藏

- 卡牌總數以最新 PRD 為準，共 **11 張**；Figma 若有頁面顯示其他數字，視為該頁設計稿文字待修正。
- 玩家在 V2-2 上線時一律從 `0 / 11` 開始，V2-1 的歷史遊玩不補發卡牌。
- 卡牌為固定集合，本版不考慮增加第 12 張或由後台動態擴充。
- 玩家跨日期、跨角色與跨遊戲保留同一份收藏狀態。

### 有效抽卡與日期

- 使用者按下「持續關注 Galaxy News」即構成一次抽卡請求；不必先觀看或播完影片。
- 抽卡歸屬日期以伺服器收到有效按鈕請求的時間為準，不以角色完成時間或動畫播完時間為準。
- 日期切換使用 `Asia/Taipei`，每日 `00:00` 重置「本日第一張卡」狀態。
- 例如玩家在 23:59 完成角色、00:01 才點擊按鈕，抽卡屬於新的一天。
- 「有效」表示通過登入、site、遊戲所有權、角色完成狀態及可抽卡條件驗證，不能由前端自行宣告成功。

### 每日抽卡結果

| 情況 | 抽卡結果 |
| --- | --- |
| 新日期第一次有效抽卡，尚未集滿 | 從尚未收藏卡牌中等機率隨機取得 1 張 |
| 同日後續有效抽卡 | 固定取得該日第一次抽到的同一張卡牌 |
| 重複點擊同一局的抽卡按鈕 | 回傳並顯示該局原本的抽卡結果，不重抽 |
| 已收藏 11 / 11 張 | 無尚未收藏卡可抽，不產生第 12 張；顯示集滿冠軍狀態 |

因此，早期「玩家手上有幾張牌就套用不同機率」、「最後一張保底」與「卡池被排除到空」等問題，在最新 PRD 規則下已不再成立。

### 角色、遊戲與恢復規則

- 一局對應一個角色與一個 `challengeId`。
- 玩家尚未完成某角色時，再次進入同一角色需恢復原局，不建立另一個未完成局。
- 角色已完成但尚未抽卡時，之後再次進入該角色仍可完成這一局的抽卡；日期以實際按鈕點擊當日計算。
- 同一局已抽過卡時，重新整理、回上一頁或重按按鈕皆顯示原本抽到的卡。
- 玩家完成一局後再玩同角色，建立新的 `challengeId`，但收藏仍連到同一份玩家層級進度。
- 不論從哪個分頁操作，只要指向同一局／同一角色的未完成狀態，都必須遵守同一份伺服器資料，不能各自多抽一次。

## HCP 身分與遊戲流程

V2-2 不改變 V2-1 的身分判定與進場資格，僅在可完成遊戲的身分流程後加入抽卡與收藏。

| 身分 | 既有流程 | V2-2 新增行為 |
| --- | --- | --- |
| 已驗證 HCP | 自動登入 → 家族樹 → 挑戰 → 完成頁 | 可點 Galaxy News 抽卡、查看收藏 |
| 待驗證 HCP | 依既有資料進入家族挑戰 | 可點 Galaxy News 抽卡、查看收藏 |
| 非已驗證 HCP | 首次填基本資料 → 家族挑戰 | 可點 Galaxy News 抽卡、查看收藏；保留既有註冊 LINE CTA |
| 已註銷 HCP | 顯示阻擋頁，不能開始遊戲 | 不提供抽卡與收藏流程 |

單局流程如下：

```txt
身分判定
  → 家族樹選角
  → 題目
  → 解析
  → 影片／教材
  → 挑戰完成頁
  → 點擊「持續關注 Galaxy News」
  → 後端決定並保存抽卡結果
  → 卡片正面 3 秒
  → 自動翻至背面並停留
```

## UI 與互動規格

### 抽卡結果

- 後端成功回傳並保存結果後才播放抽卡畫面，避免畫面先翻牌、資料卻寫入失敗。
- 卡牌先顯示正面 3 秒，再以翻牌動畫自動轉至背面。
- 動畫結束後停在背面，不再自動翻回正面。
- 同一局重開時顯示原本抽到的卡，不重新執行抽卡決策。
- 若抽到第 11 張，使用最後一張／集滿版本畫面，文案目前為「你已集滿所有卡牌，榮登【降血脂冠軍】🏆」；客戶仍可能調整呈現文字。

### 收藏入口

- 只有 **家族樹頁** 與 **挑戰完成頁** 顯示右下角「點選查看卡牌」入口。
- 其他題目、解析或影片頁不額外放入口，避免干擾主要遊戲流程。
- 點擊入口後開啟 11 張卡牌收藏總覽；已取得卡片顯示收藏素材，未取得卡片顯示黑卡／未解鎖狀態。

### 卡牌詳情與翻面

- 從收藏總覽點擊卡牌後進入該卡詳情。
- 詳情頁不套用抽卡時的 3 秒自動翻牌。
- 點擊下方「旋轉查看卡牌詳細內容」文字後手動翻面；再次操作可查看另一面。
- 自動抽卡動畫與收藏詳情的手動翻面是兩個不同互動，不共用觸發條件。

## 卡牌素材盤點

素材位於 `/Users/oscar/Downloads/crestcode_V2-2`。目前已確認 11 張卡各有正面、背面與黑卡三種狀態：

1. `CENTAURUS`
2. `COMETS`
3. `COSMOS`
4. `DISCOVERY`
5. `ECLIPSE`
6. `MERCURY_II`
7. `METEOR`
8. `ORION`
9. `PLUTO`
10. `PULSAR`
11. `STELLAR`

另有 `Golden_star.png` 與 `see_card.png`。合計 33 張卡牌狀態圖＋2 張介面素材，共 35 張。前端應建立穩定的 card ID 與素材 mapping。

## Firestore 資料設計

### 為什麼不能只用一份永久 challenge 文件

V2-1 的 `challengeId` 代表一筆遊玩。若把同一玩家所有角色、每日抽卡與每次重玩都持續 append 到同一份文件，文件會隨時間增長，也會讓單局報表、恢復流程、寫入競爭與 Firestore 文件大小風險混在一起。

因此採用兩種不同生命週期：

```txt
單局紀錄：sites/astrazeneca/hcpChallengeV2/{challengeId}
玩家收藏：sites/astrazeneca/hcpChallengeV2CardProgress/{playerKey}
```

- `challengeId`：一局一筆，保存該角色的實際遊玩與抽卡結果。
- `playerKey`：由後端驗證後的穩定 LINE／Firebase 身分建立，一名玩家一筆，保存跨局收藏與當日抽卡摘要。
- 不以瀏覽器 localStorage 作為真相來源，也不直接信任前端傳入的 LINE UID。
- 不需要在 challenge 下建立會無限累積的 `plays` subcollection，因為每一局本身就是一筆 challenge 文件。

### 單局文件新增欄位方向

```ts
{
  drawnCardId: string | null,
  drawnCardName: string | null,
  cardDrawnAt: Timestamp | null,
  cardDrawDate: 'YYYY-MM-DD' | null
}
```

這些欄位讓報表可直接查出該局是否抽卡及抽到哪張，也確保同一局 retry 回傳相同結果。

### 玩家收藏文件方向

```ts
{
  lineUserId: string,
  collectedCardIds: string[],
  lastDrawDate: 'YYYY-MM-DD' | null,
  lastDrawCardId: string | null,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  schemaVersion: number
}
```

- `collectedCardIds` 的最大集合固定為 11，文件大小有明確上限。
- `lastDrawDate`＋`lastDrawCardId` 用來確保同日後續抽卡固定回傳同卡。
- 不需要保存「每張卡抽過幾次」或四次上限，因為最新規則沒有使用這項資訊。
- 卡牌主檔可先由程式碼中的固定 registry 管理；本版沒有擴充卡需求，因此不新增動態 card master collection。

### 原子抽卡交易

後端需要在 Firestore transaction 中完成：

1. 驗證使用者、site、`challengeId` ownership 與角色完成狀態。
2. 讀取單局文件及玩家收藏文件。
3. 若單局已有 `drawnCardId`，直接回傳原結果。
4. 以 `Asia/Taipei` 取得伺服器端當日日期。
5. 若收藏已滿 11 張，回傳 completed collection 狀態，不新增卡片。
6. 若 `lastDrawDate` 為當日，沿用 `lastDrawCardId`。
7. 否則從固定 11 張扣除 `collectedCardIds`，從剩餘卡中隨機選 1 張。
8. 同一交易更新玩家收藏及該局抽卡欄位。
9. 回傳卡牌與 `isNewCard`、`isCollectionComplete` 等前端顯示所需狀態。

這樣即使使用者快速雙擊、同時開兩個分頁或從兩台裝置抽卡，也不會在同一天得到兩張不同卡。

### V2-1 相容與資料遷移

- V2-1 遊玩文件繼續保留，不搬移、不刪除。
- 收藏文件採 lazy creation：玩家第一次使用 V2-2 抽卡或查看收藏時才建立。
- 所有既有玩家從 0 張開始，不根據舊完成角色數量補卡。
- 報表需容忍舊遊玩文件沒有 V2-2 抽卡欄位，輸出時視為 `N`。

## API 契約方向

OpenSpec 階段需依現有 API 命名慣例確認實際 endpoint；責任至少包含：

- **Draw Card：** 接收 `challengeId`，由後端驗證並原子決定抽卡結果；支援 retry／idempotency。
- **Card Collection：** 取得 11 張卡的收藏狀態、當日抽卡摘要及是否已集滿。
- **既有 Challenge Response：** 在家族樹與完成頁所需 response 補上可否抽卡、該局是否已抽及收藏摘要，避免前端自行拼湊狀態。

前端只能傳遞目前操作的 `challengeId`，不能指定想抽的 `cardId`、自行判斷新日期或覆寫收藏。

## 報表需求

V2 報表維持「每次遊玩一筆」的粒度，新增一欄：`抽到的卡牌名稱`。

| 單局情況 | 抽到的卡牌名稱 | 遊戲完成欄位 |
| --- | --- | --- |
| 已抽卡且完成遊戲 | 實際卡牌名稱 | `Y` |
| 已抽卡但該局其他統計判定未完成 | 實際卡牌名稱 | `N` |
| 尚未抽卡 | `N` | `N` |
| V2-1 舊資料沒有抽卡欄位 | `N` | 保留原紀錄 |

目前確認的一般規則是「沒有抽到卡就不可能完成」；但玩家已經集滿 11 張後本來就沒有新卡可抽，因此滿卡後再玩一局時，完成欄位要如何呈現是這條規則的例外，需在後端 OpenSpec／報表驗收時明確寫成 scenario。

同日重玩抽到同一張卡時，每一局仍各自保留並輸出該卡名稱，因為報表追蹤的是實際遊玩，不是只有收藏新增事件。

## OpenSpec／SDD 開發計畫

由於只有一位工程師依序處理前後端，拆成兩個 change 比把跨 Repository 工作混成一個 change 更容易驗證與回溯。

### Backend change

建議名稱：`crestcode-v2-2-card-collection-api`

預計 tasks：

1. 補齊抽卡、收藏、日期與滿卡的 spec scenarios。
2. 建立固定 11 張 card registry 與型別。
3. 建立玩家收藏 repository／service 與 Firestore schema。
4. 實作原子抽卡 transaction、ownership 與 idempotency。
5. 提供抽卡與收藏 API。
6. 在 V2 報表新增「抽到的卡牌名稱」。
7. 補單元、整合、併發與日期邊界測試。
8. 更新 API 文件及部署／migration 說明。

### Frontend change

建議名稱：`crestcode-v2-2-card-collection-liff`

預計 tasks：

1. 建立卡牌型別、API service 與 11 組素材 mapping。
2. 在完成頁串接 Galaxy News 抽卡按鈕與 retry 狀態。
3. 實作正面 3 秒後自動翻至背面的動畫。
4. 在家族樹及完成頁加入收藏入口。
5. 實作收藏總覽、黑卡、詳情與手動翻面。
6. 實作 11 / 11 冠軍畫面及 reduced-motion fallback。
7. 補 component、service 與主要流程測試。
8. 依 Figma 在手機與 LINE WebView 驗收。

### 開發順序

1. 等 Repository 修復完成，確認乾淨的 V2-1 baseline。
2. 先完成 backend OpenSpec proposal、design、specs 與 tasks。
3. 實作後端並以測試固定 API response 與錯誤行為。
4. 再建立 frontend change，依後端契約完成介面與動畫。
5. 前後端整合、Stage 手機驗收、報表核對。
6. 驗收完成後 archive changes，將 delta specs 同步回主規格。

## Repository 與分支風險

目前原功能分支曾混入 Stage 分支的提交歷史。`git pull --ff-only` 顯示的是本地分支成功 fast-forward 到同名遠端分支，不代表這些歷史已被清除；若直接由受污染分支開發，日後合併 main 仍可能夾帶不屬於 V2-2 的變更。

因此在其他工程師完成整理前，可以完成需求與 OpenSpec 草稿，但不應在未確認 baseline 的分支直接展開正式實作。開始前至少確認：

- `git status` 沒有未預期修改。
- `git branch --show-current` 是團隊指定的乾淨分支。
- `git log --graph` 與 `git diff main...HEAD` 不再包含 Stage 專屬提交。
- 後端與前端分別從正確的 V2-1 基準建立 V2-2 工作分支。

## 關鍵問題與設計決策

| 問題 | 最終處理 | 工程價值 |
| --- | --- | --- |
| PRD 寫 11 張、部分會議或設計資訊不一致 | 以最新 PRD 為準，固定 11 張 | 建立明確 source of truth |
| 早期 HTML 使用機率、保底、重複四次上限 | 最新規格全部取消，改每日一張新卡 | 移除互斥規則與空卡池問題 |
| 23:59 完成、00:01 抽卡的日期歸屬 | 以伺服器收到 Galaxy News 點擊的台北日期為準 | 邊界可測、前後端一致 |
| 同日多次重玩是否新增卡 | 當日第一局決定卡片，後續局固定同卡 | 防止刷卡且保留遊玩自由 |
| 未抽卡就離開 | 原局保留可抽狀態，下次進同角色續抽 | 不因離頁遺失資格 |
| 重複點擊或雙分頁 | 單局結果＋玩家收藏在 transaction 內原子更新 | 避免 double draw |
| 一個 challenge 長期存所有遊玩會持續變大 | 一局一個 challenge，收藏另存玩家文件 | 分離事件與長期狀態生命週期 |
| 收藏需要跨角色保存 | 以驗證後玩家 identity 作收藏 key | 不依角色或前端裝置切割資料 |
| 抽卡動畫與收藏翻面描述混淆 | 抽卡自動翻面；收藏詳情手動翻面 | 讓兩種使用情境各自清楚 |
| 報表如何表示未抽卡 | 每局一筆，卡名欄有卡填名稱、無卡填 `N` | 相容既有報表與舊資料 |

## 驗收條件

### 後端

- [ ] 同一玩家第一次抽卡會建立收藏文件與單局抽卡結果。
- [ ] 新日期第一抽只會從未收藏的 11 張卡中選取。
- [ ] 同日第二局起固定回傳當日第一張卡。
- [ ] 同一 `challengeId` 重試永遠回傳原卡。
- [ ] 台北時間 23:59／00:00 邊界測試通過。
- [ ] 雙擊、平行 request 與雙裝置不會發出兩張不同卡。
- [ ] 未完成角色、非 owner、無效 site 或未驗證 token 不能抽卡。
- [ ] 已集滿 11 張時不新增卡片，回傳 collection complete。
- [ ] 舊 V2-1 文件沒有抽卡欄位時仍可正常讀取及產生報表。
- [ ] 報表新增卡牌名稱，無抽卡時輸出 `N`。

### 前端

- [ ] 只有家族樹與挑戰完成頁顯示收藏入口。
- [ ] 點 Galaxy News 後等待 API 成功才進入結果動畫。
- [ ] 卡牌正面顯示 3 秒後自動翻至背面並停留。
- [ ] 網路失敗可安全重試，不會在 UI 顯示另一張卡。
- [ ] 收藏總覽正確呈現已取得與未取得黑卡。
- [ ] 詳情頁點下方文字才翻面，不自動執行 3 秒動畫。
- [ ] 第 11 張使用集滿冠軍畫面，不出現第 12 張。
- [ ] LINE WebView、目標手機尺寸、重新整理與返回流程驗收通過。

## 驗證與可量化成果

### 目前已驗證的設計證據

- 需求衝突已從機率制、保底制與四次上限收斂為一套可執行的每日規則。
- 卡片總數確認為 11，素材目錄共有 35 個所需圖檔。
- 抽卡結果、收藏入口、卡片正反面與翻面文字已對應到 7 個 Figma node。
- 資料模型已將無上限的遊玩歷史與最多 11 張的收藏集合分離。
- 單局與玩家層級的 idempotency／transaction 責任已定義。

### 實作後需補的量化證據

- 後端測試數、通過率與涵蓋的併發／日期案例。
- 前端 build、component test 與整合測試結果。
- Stage 實機與 LINE WebView 驗收裝置。
- 報表實際欄數、範例列及卡牌名稱核對結果。
- PR、commit、release tag 與部署環境。

## 待確認與風險

- Repository 清理完成後的正確 base branch 與 commit SHA。
- 玩家收藏 collection 的最終命名及既有 Firestore rules／index 是否需更新。
- `playerKey` 應沿用現有後端哪個 canonical identity 欄位，需依實際程式碼與資料確認，不能直接用可偽造的 request 值。
- 集滿 11 張冠軍畫面的最終客戶文案仍可能調整，但功能狀態已明確。
- API endpoint 名稱、response schema 與錯誤碼需在 backend OpenSpec 對照現有 codebase 後定案。
- 卡牌顯示名稱需確認使用英文 asset ID、中文名稱或報表指定文案；內部 card ID 應保持穩定。
- 已集滿 11 張後重玩時沒有新卡可抽，報表的「遊戲完成」欄位如何對應既有「沒抽卡就不可能完成」規則，需由 PM／報表 owner 確認。
- 正式上線日、V2-2 功能旗標及是否只計算上線後抽卡資料需在部署規格明確記錄。

以上項目不會推翻核心抽卡規則，但必須在進入相對應實作 task 前鎖定。

## 我的學習與反思

### 先找出規格主體，再討論技術

最初的 PRD、HTML、Issue 與 Figma 同時出現機率、最後一張保底、四次上限與每日限制。如果直接照單實作，很容易產生沒有可抽卡、規則互相覆蓋，或前後端各自理解的結果。我學到應先確認哪份文件是 source of truth，再把每一個案例寫成輸入與預期輸出。

### 資料生命週期比 collection 數量更重要

一開始直覺是把收藏與每次遊玩都放進 `challengeId`，但遊玩是持續新增的事件，收藏則是每名玩家最多 11 張的長期狀態。把兩者拆開，才同時保留「一局一筆報表」與「跨局收藏」，也讓文件大小與查詢責任有清楚邊界。

### 動畫也需要後端一致性

抽卡不是只做 CSS 翻牌。若前端先隨機顯示、後端再寫資料，網路重試或多分頁會使畫面與收藏不一致。正確順序是由後端 transaction 決定並保存卡牌，前端再依結果播放動畫。視覺互動因此建立在可恢復、可稽核的資料狀態上。

### 將不確定性留在文件，不偽裝成成果

這份筆記用「已確認」、「設計方向」、「尚未實作」區分證據強度。對研究所申請材料而言，能清楚說明決策過程、限制與驗證方法，比把規劃誤寫成已完成更能呈現工程判斷。

## 研究所申請可用素材

### STAR 專案摘要

- **Situation：** CRESTCODE V2-1 上線後要新增 11 張卡牌收藏，但 PRD、會議 HTML、Issue 與 Figma 對抽卡機率、每日限制、最後一張與動畫的描述互相衝突；既有 `challengeId` 又以單局為核心，無法直接承擔跨局收藏。
- **Task：** 在單人負責前後端且 Repository 分支仍待整理的情況下，先把需求收斂成可實作規格，設計可持續的資料模型、API 邊界、報表與驗收案例，讓分支修復後可直接進入 SDD。
- **Action：** 我逐項比對四種需求來源，確認以 PRD 為準，將規則化簡為「每日首抽取得未收藏卡、同日重複同卡」；把一局一份的 challenge 與玩家層級收藏分離，規劃 Firestore transaction、台北日期邊界、retry idempotency、35 個素材 mapping，並拆出前後端 OpenSpec tasks。
- **Result：** 在寫程式前先排除機率衝突、空卡池、雙擊重抽與文件無限增長等風險，形成一份可由後端測試、前端 Figma 驗收及報表核對的完整規格。程式成果與量化測試將在實作完成後補入。

### 備審自述草稿

在 AstraZeneca CRESTCODE V2-2 任務中，我面對的不是一份可以直接照做的需求，而是 PRD、會議紀錄、Issue 與介面稿之間互相衝突的抽卡規則。我先與團隊確認 PRD 的優先級，再用具體案例釐清午夜跨日、同日重玩、未抽卡離開、集滿 11 張及多分頁點擊的行為。接著，我沒有把所有狀態堆進既有遊戲文件，而是依資料生命週期將每局紀錄與玩家收藏分開，並用伺服器時間、原子交易及 idempotency 保護結果一致性。這個過程讓我體會到軟體工程不只是完成畫面，而是將模糊需求轉化成可驗證、可維護，也能由下一位工程師理解的系統契約。

### 履歷條列草稿

- 收斂 PRD、GitHub Issue、會議文件與 Figma 的衝突需求，定義 11 張卡牌的每日抽卡、跨日、重玩及滿卡規則。
- 為 LINE LIFF 遊戲規劃 Firestore 資料邊界，將每局 challenge 與跨局玩家收藏分離，避免長期文件無限增長。
- 設計具 idempotency 的原子抽卡流程，涵蓋雙擊、多分頁、雙裝置及 `Asia/Taipei` 午夜邊界。
- 盤點 35 個視覺素材並將 7 個 Figma 畫面轉化為抽卡動畫、收藏總覽與手動翻面的驗收條件。
- 以 OpenSpec／SDD 拆分前後端 change、API 契約、報表欄位與測試任務，降低單人跨 Repository 開發風險。

> NDA／面試說明：對外材料應以架構、決策方法與去識別化流程為主；不要公開真實 LINE UID、HCP 個資、內部 Firebase 設定、Production URL、憑證、未公開醫療內容或完整客戶資料。

## Progress

### 2026-09-15

- 承接 V2-1 完成狀態，閱讀交接摘要與最新版 PRD。
- 比對 PRD 下半部、`0909_meeting_slides.html` 與 GitHub Issue #54 的抽卡描述。
- 整理卡片總數、機率、最後一張、每日限制、抽卡觸發、日期與報表等疑點。
- 確認最新功能以 PRD 為主：同日只取得一張新卡，不再採用早期機率制。

### 2026-09-16

- 確認卡池最終為 11 張，V2-1 舊玩家於 V2-2 上線後從 0 張開始。
- 確認 Galaxy News 按鈕即為抽卡觸發，不要求影片觀看完成。
- 確認日期依點擊時的 `Asia/Taipei` 伺服器時間判定。
- 定義同日首抽未收藏卡、後續固定同卡，以及 11 / 11 不再新增卡。
- 確認同角色未完成局需恢復，已完成後重玩建立新 `challengeId`。
- 決定採「一局一個 challenge＋玩家層級收藏文件」，不把長期歷史放進單一 challenge。
- 確認報表每局一筆並新增「抽到的卡牌名稱」，未抽卡填 `N`。
- 對照 Figma 確認抽卡自動翻牌、收藏詳情手動翻牌，以及收藏入口只出現在家族樹與完成頁。
- 盤點 11 組正面／背面／黑卡及 2 個介面素材，共 35 個檔案。
- 規劃後端、前端各一個 OpenSpec change；因單人開發，預計先完成後端契約與資料層。
- 發現目前分支混入 Stage 歷史，暫停正式實作並等待團隊修復乾淨 baseline。

## 相關人物與角色

- **我（實習工程師）：** 需求釐清、資料與 API 設計、前後端 OpenSpec／實作規劃、測試與整合驗證。
- **PM／需求窗口：** 確認 PRD 優先級、抽卡規則、客戶文案與驗收範圍。
- **前端工程師／設計協作者：** 說明 PRD 為主、確認 Figma 互動及視覺素材。
- **Repository 維護工程師：** 處理 feature branch 混入 Stage 歷史的問題，提供乾淨開發基準。
- **AZ／Medical／Compliance：** 核定對外文案、醫療內容與正式上線版本。

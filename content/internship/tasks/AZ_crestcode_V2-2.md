---
title: AZTW CRESTCODE V2-2 卡牌收藏與每日抽卡功能
status: completed
start_date: 2026-09-15
modified: 2026-10-27
assigned_by: AZ
tags:
  - 實習
  - AstraZeneca
  - CRESTCODE
  - LINE-LIFF
  - HCP
  - PRD
  - Angular
  - TypeScript
  - Firestore
  - OpenSpec
  - SDD
  - Software-Engineering
---

# AZTW CRESTCODE V2-2 卡牌收藏與每日抽卡功能

## 任務目標

延續 [[AZ_crestcode_V2-1|AZTW CRESTCODE V2-1 遊戲使用流程改版]]，為既有 CRESTCODE 家族挑戰新增「每日抽卡」與「卡牌收藏」機制。玩家在影片頁點擊「持續關注 Galaxy News」觸發抽卡；家族樹頁與挑戰完成頁提供收藏入口。卡牌收藏由每局 `cardDraws` 紀錄推導，不建立獨立玩家收藏文件。

本文件記錄需求釐清、資料/API 設計、前端實作與交接。我的工作已告一段落，後續後端／整合修正、Stage 驗收與部署由接手工程師負責。

## 目前進度摘要（2026-10-27）

- **需求釐清：** 已完成 PRD、Issue、會議 HTML 與 Figma 的交叉核對，確認本版以 PRD 的「同日只取得一張新卡」規則為準，不採用早期 HTML 的機率表與同卡四次上限。
- **核心規則：** 卡池共 11 張；同一有效日期首抽從未收藏卡牌等機率抽 1 張，同日其他局固定沿用該日首張；集滿 11 張後，每個新有效日期改為從全部 11 張等機率抽 1 張。
- **資料方向：** 保留玩家的 V2 parent `challengeId`；每次角色遊玩以 `cardDraws/{cardDrawId}` 保存單局資料。不新增獨立玩家、收藏摘要或每日卡牌文件。
- **後端狀態（最後掌握：2026-09-23）：** 當時後端抽卡與收藏 API 已部署至測試站，前端本機以測試站 API 串接。
- **前端狀態（最後掌握：2026-09-23）：** 抽卡結果與收藏介面已有初版實作；`build-stage` 成功，抽卡元件測試 41 項通過。這些是初步驗證，不代表前後端契約已完整驗收。
- **交接狀態：** Review 發現的 4 項 P1 API／資料契約問題及 1 項 P2 非同步競態已交接其他工程師；此後修正與驗收不屬於我的工作範圍，文件不宣稱這些項目已由我修復。
- **素材盤點：** 11 張卡牌各有正面、背面與黑卡素材，另有 2 張介面素材；前端素材已放入 LIFF repository 的卡牌 assets 目錄。
- **工作範圍結束：** 我不再負責此專案後續修正、遠端推送狀態確認、Stage 驗收或正式部署；交接後由接手者決定與追蹤。

> 本文件用於記錄我負責期間的需求決策、前端工作與交接內容；後續狀態以接手團隊的紀錄為準，不把已移交項目列為我的待辦。

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

我負責承接 V2-1 的既有流程，釐清 V2-2 需求、整理 OpenSpec 規格，並完成前端卡牌互動與 API 串接的初版。後端由其他工程師負責；前端 Code Review 所列後續問題已交接，我不再負責後續開發與部署。

本階段實際負責的工作包括：

- 比對 PRD、會議 HTML、GitHub Issue 與 Figma，找出卡片數量、機率、每日限制、抽卡時機及動畫描述之間的矛盾。
- 逐項向 PM／前端確認，以 PRD 為規格主體，將「機率抽卡」收斂成「每日一張新卡、同日重複同卡」。
- 規劃在既有 `challengeId` 下以 `cardDraws/{cardDrawId}` 保存每局遊玩，不讓 parent 文件無限制累積歷史。
- 釐清後端抽卡／收藏 API 契約與每局 `cardDrawId` 的用途，並依 review 結果將跨前後端問題交接給接手工程師。
- 盤點 11 組卡牌正面、背面與黑卡素材，對照抽卡、收藏與滿卡畫面所需資產。
- 以後端與前端兩個 OpenSpec change 管理需求；後端實作與後續整合由接手工程師延續，我負責的工作以規格、前端初版和交接為止。

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
- 在影片頁點擊「持續關注 Galaxy News」觸發抽卡。
- 新日期第一次抽卡取得尚未收藏卡；同日再抽固定取得同一張。
- 集滿 11 張後，每個新有效日期從全部 11 張等機率抽取，收藏仍維持 `11 / 11`。
- 中途離開後恢復尚未抽卡或已抽卡的原局狀態。
- 家族樹頁與挑戰完成頁的「點選查看卡牌」入口。
- 收藏總覽、未取得卡片黑卡狀態、卡牌詳情與手動翻面。
- 集滿 11 張後的冠軍畫面。
- 每局報表新增「當次遊戲抽的卡牌」。

### 本次不納入

- 早期 HTML 的依持有張數分配抽中新卡機率。
- 最後一張 30%／下一次 100% 的保底機制。
- 同一卡牌當日最多重複四次。
- 卡牌「降低或排除」的權重調整。
- 影片觀看完成作為抽卡條件。
- 動態擴充卡池或後台管理卡牌主檔。
- 卡牌放大／觸控縮放功能（已暫緩，不列入本次交付範圍）。
- 將 V2-1 舊玩家的歷史遊玩回填成卡牌收藏。

## 已確認的抽卡規則

### 卡池與收藏

- 卡牌總數以最新 PRD 為準，共 **11 張**；Figma 若有頁面顯示其他數字，視為該頁設計稿文字待修正。
- 玩家在 V2-2 上線時一律從 `0 / 11` 開始，V2-1 的歷史遊玩不補發卡牌。
- 卡牌為固定集合，本版不考慮增加第 12 張或由後台動態擴充。
- 玩家跨日期、跨角色與跨遊戲保留同一份收藏狀態。

### 有效抽卡與日期

- 使用者在影片頁按下「持續關注 Galaxy News」即觸發抽卡；不必先觀看或播完影片。
- 抽卡規則使用該角色遊玩紀錄的伺服器 `startedAt`，以 `Asia/Taipei` 換算有效日期；按鈕點擊時間另外記錄為實際抽卡時間。
- 日期切換使用 `Asia/Taipei`，每日 `00:00` 重置「本日第一張卡」狀態。
- 例如玩家在 23:59 開始遊玩角色、00:01 才點擊按鈕，該局仍歸屬前一天；恢復原局也沿用原始 `startedAt` 日期。
- 「有效」表示通過登入、site、遊戲所有權、角色完成狀態及可抽卡條件驗證，不能由前端自行宣告成功。

### 每日抽卡結果

| 情況                              | 抽卡結果                                              |
| --------------------------------- | ----------------------------------------------------- |
| 新日期第一次有效抽卡，尚未集滿    | 從尚未收藏卡牌中等機率隨機取得 1 張                   |
| 同日後續有效抽卡                  | 固定取得該日第一次抽到的同一張卡牌                    |
| 重複點擊同一局的抽卡按鈕          | 回傳並顯示該局原本的抽卡結果，不重抽                  |
| 已收藏 11 / 11 張，新有效日期首抽 | 從全部 11 張卡牌等機率隨機取得 1 張；收藏維持 11 / 11 |

同一有效日期的其他局仍沿用當日首張；滿卡後只改變新日期首抽的候選池，不新增第 12 張。早期「最後一張保底」與「同卡四次上限」不採用。

### 角色、遊戲與恢復規則

- `challengeId` 是既有 V2 玩家／挑戰 parent；每次角色遊玩使用一個 `cardDrawId`，詳細記錄存於 parent 下的 `cardDraws` subcollection。
- 玩家尚未完成某角色時，再次進入同一角色需恢復原局，不建立另一個未完成局。
- 角色已完成但尚未抽卡時，之後再次進入該角色仍可完成這一局的抽卡；日期仍以該局原始 `startedAt` 計算。
- 同一局已抽過卡時，重新整理、回上一頁或重按按鈕皆顯示原本抽到的卡。
- 玩家完成一局後再玩同角色，在同一 `challengeId` 下建立新的 `cardDrawId`；收藏由該玩家有效 card draw records 推導。
- 不論從哪個分頁操作，只要指向同一局／同一角色的未完成狀態，都必須遵守同一份伺服器資料，不能各自多抽一次。

## HCP 身分與遊戲流程

V2-2 不改變 V2-1 的身分判定與進場資格，僅在可完成遊戲的身分流程後加入抽卡與收藏。

| 身分       | 既有流程                  | V2-2 新增行為                                                        |
| ---------- | ------------------------- | -------------------------------------------------------------------- |
| 已驗證 HCP | 自動登入 → 家族樹 → 挑戰  | 影片頁可點 Galaxy News 抽卡；家族樹與挑戰完成頁可查看收藏            |
| 待驗證 HCP | 依既有資料進入家族挑戰    | 影片頁可點 Galaxy News 抽卡；家族樹與挑戰完成頁可查看收藏            |
| 未驗證 HCP | 首次填基本資料 → 家族挑戰 | 影片頁可點 Galaxy News 抽卡；保留既有註冊 LINE CTA，收藏入口位置相同 |
| 已註銷 HCP | 顯示阻擋頁，不能開始遊戲  | 不提供抽卡與收藏流程                                                 |

單局流程如下：

```txt
身分判定
  → 家族樹選角
  → 題目
  → 解析
  → 影片頁
  → 點擊「持續關注 Galaxy News」
  → 後端決定並保存抽卡結果
  → 抽卡彈窗由下往上進場
  → 彈窗到位後背景切換至下一頁
  → 卡片正面 3 秒後自動翻至背面並停留
  → 教材／挑戰完成頁
```

## UI 與互動規格

### 抽卡結果

- 後端成功回傳並保存結果後才播放抽卡畫面，避免畫面先翻牌、資料卻寫入失敗。
- 卡牌先顯示正面 3 秒，再以翻牌動畫自動轉至背面。
- 動畫結束後停在背面，不再自動翻回正面。
- 新抽、同日重複結果或恢復已保存結果，只要呈現抽卡畫面，一律先顯示正面 3 秒，再翻到背面；重試不得重新決定另一張卡。
- 抽卡彈窗由下往上滑入；彈窗到位後背景才切換至下一頁。抽卡彈窗右上角關閉圖示為黑色。
- 抽到第 11 張時顯示集滿畫面，文案曾定為「你已集滿所有卡牌，榮登【降血脂冠軍】🏆」；集滿後新日期仍可抽卡，但從全部 11 張等機率抽取。

### 收藏入口

- 只有 **家族樹頁** 與 **挑戰完成頁** 顯示固定懸浮於右下角的查看卡牌圖片入口；不額外疊加文字。
- 其他題目、解析或影片頁不額外放入口，避免干擾主要遊戲流程。
- 點擊入口後開啟 11 張卡牌收藏總覽；已取得卡片顯示收藏素材，未取得卡片顯示黑卡／未解鎖狀態。

### 卡牌詳情與翻面

- 從收藏總覽點擊卡牌後進入該卡詳情。
- 詳情頁不套用抽卡時的 3 秒自動翻牌；卡牌檢視的放大／觸控縮放功能目前不納入本次實作。
- 點擊下方「旋轉查看卡牌詳細內容」文字後手動翻面；再次操作可查看另一面。
- 自動抽卡動畫與收藏詳情的手動翻面是兩個不同互動，不共用觸發條件。

## 卡牌素材盤點

素材已整理至前端 repository：`/Users/oscar/Documents/astrazeneca-liff-med/src/assets/image/hcp-challenge/v2/cards`。程式使用小寫檔名；目前 11 張卡各有正面、背面與黑卡三種狀態：

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

### Parent challenge 與單局 `cardDraws`

V2-2 保留既有 challenge parent，避免重寫 V2-1 身分、profile 與家族樹流程；每次角色遊玩則存入 parent 下的 `cardDraws` subcollection，避免把不斷增加的每局歷史堆進 parent。

```txt
sites/{site}/hcpChallengeV2/{challengeId}
  └─ cardDraws/{cardDrawId}
```

- `challengeId`：既有玩家／挑戰 parent ID，不是每局新建一份。
- `cardDrawId`：每次角色遊玩一個 ID；同角色完成後再玩，仍在同一 parent 下建立新的 child record。
- `cardDraws/{cardDrawId}`：單局的開始時間、角色、進度、完成狀態、事件與當次抽卡結果的權威來源；parent 只保留目前／可恢復 `cardDrawId` 等有限摘要。
- 不新增獨立玩家文件、收藏摘要文件或每日卡牌文件；也不把收藏真相放在 localStorage。

單局記錄中的抽卡欄位包括 `drawnCardId`、`drawnCardName`、`cardDrawDate` 與 `cardDrawnAt`。`cardDrawDate` 由不可變的 `startedAt` 按 `Asia/Taipei` 推導；`cardDrawnAt` 則記錄實際抽卡時間。報表以每份 V2-2 `cardDraws` 文件輸出一局。

### 收藏推導與抽卡一致性

收藏不是獨立資料文件；後端從已驗證玩家所屬的有效 `cardDraws` 記錄推導 distinct card collection。新有效日期首抽從尚未收藏卡牌等機率抽取；同一有效日期其他局沿用首張。已集滿 11 張後，新有效日期改從全部 11 張等機率抽取，收藏數仍維持 `11 / 11`。

後端以伺服器驗證的玩家身分、`challengeId` 與 `cardDrawId` 驗證權限，保存單局結果並確保重送、恢復或併發請求不會改變已保存結果。收藏查詢回傳固定 11 張卡與 summary；不建立額外的 player/card summary projection。

### V2-1 相容與資料遷移

- V2-1 parent 文件不搬移、不刪除、不回填卡片，沒有 `cardDraws` 的舊資料沿用既有流程與報表 flatten。
- 舊 V2-1 報表列的「當次遊戲抽的卡牌」輸出 `N`；新 V2-2 以每份 `cardDraws` child 輸出一局。
- 新舊資料判定依文件本身有無 V2-2 card draw record／關聯欄位，不依全域上線時間猜測版本。

## API 契約與前後端交接

前端串接的 API 路徑為：

- `POST /az-hcp/hcp-challenge/v2/draw-card`
- `POST /az-hcp/hcp-challenge/v2/card-collection`

抽卡 request 必須包含 `{ site, challengeId, cardDrawId }`；玩家身份由有效 Bearer token 決定，前端不得傳入 LINE UID 或自行指定抽中的卡。新局透過既有 `/start` 流程明確傳入 `cardDrawId: null` 啟用 V2-2 單局紀錄，並保存後端回傳的 `cardDrawId`／`cardDraw` 狀態供恢復與抽卡使用。

抽卡回應含卡牌 ID／名稱、`effectiveDate`、`drawnAt`、`collectionCount`、`collectionComplete` 及 `reusedExistingResult` 等資訊。收藏回應包含 11 張卡牌項目及巢狀 `summary`，前端需依實際 DTO 正規化，不以舊欄位名稱猜測。

Code Review 曾指出前端與上述 lifecycle／DTO 有不一致，相關項目已交接其他工程師處理；此處記錄的是交接契約方向，不代表後續修正已完成。

## 報表需求

V2-2 報表以每份 `cardDraws/{cardDrawId}` 輸出一筆遊玩資料，新增欄位：`當次遊戲抽的卡牌`。

| 單局情況                               | 當次遊戲抽的卡牌 | 遊戲完成／統計欄位       |
| -------------------------------------- | ---------------- | ------------------------ |
| 有有效抽卡結果                         | 實際英文卡牌名稱 | 沿用該局既有遊戲完成判定 |
| 尚未抽卡或抽卡欄位無效                 | `N`              | 依該局實際進度判定       |
| V2-1 舊資料沒有對應的 card draw record | `N`              | 沿用舊報表邏輯           |

抽卡欄位只表示該局實際抽到的卡，不反推或改變遊戲完成／統計欄位。集滿 11 張後仍會抽到一張既有卡，因此新局照樣輸出實際英文卡名；舊 V2-1 資料沒有 card draw record 時輸出 `N`。

## OpenSpec／SDD change 與工作交接

本功能分為前後端兩個 OpenSpec change；後端由接手工程師持續負責，前端由我完成初版後交接 review 發現的契約差異。

### Backend change

Change：`crestcode-v2-2-card-collection-backend`

原規劃範圍（實際完成狀態以接手團隊的 repository 為準）：

1. 補齊抽卡、收藏、日期與滿卡的 spec scenarios。
2. 建立固定 11 張 card registry 與型別。
3. 建立 parent challenge 下的 `cardDraws` repository／service 與 schema，不另建玩家收藏文件。
4. 實作抽卡、收藏推導、ownership 與 idempotency。
5. 提供抽卡與收藏 API。
6. 在 V2 報表新增「當次遊戲抽的卡牌」。
7. 補單元、整合、併發與日期邊界測試。
8. 更新 API 文件及部署／migration 說明。

### Frontend change

Change：`crestcode-v2-2-card-collection-frontend`

原規劃範圍（前端由我完成初版，後續狀態以接手團隊的 repository 為準）：

1. 建立卡牌型別、API service 與 11 組素材 mapping。
2. 在影片頁串接 Galaxy News 抽卡按鈕、`cardDrawId` 與 retry／resume 狀態。
3. 實作正面 3 秒後自動翻至背面的動畫。
4. 在家族樹及完成頁加入收藏入口。
5. 實作收藏總覽、黑卡、詳情與手動翻面。
6. 實作 11 / 11 冠軍畫面及 reduced-motion fallback。
7. 補 component、service 與主要流程測試。
8. 依 Figma 在手機與 LINE WebView 驗收。

### 實際分工與交接

後端先完成 API／資料模型並部署測試站；我以測試站 API 開發前端卡牌畫面、動畫與收藏介面，完成初步 build／元件測試。Code Review 發現的 API lifecycle、DTO 與 modal 非同步問題已移交其他工程師。Stage 後續整合驗收、部署與 OpenSpec 收尾不再由我負責。

## Repository 與分支交接紀錄

開發初期曾發現 feature branch 混入 Stage 歷史，當時先確認分支狀態再開始 V2-2。後續前端工作使用 `feature/crestcode-card-collection`；這是歷史風險與開發背景，不再是我的進行中待辦。前端最後一次 push 曾回報 HTTP 400，當時遠端是否收到提交尚未確認；此後 repository 狀態由接手團隊負責確認。

## 關鍵問題與設計決策

| 問題                                              | 最終處理                                                         | 工程價值                                   |
| ------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| PRD 寫 11 張、部分會議或設計資訊不一致            | 以最新 PRD 為準，固定 11 張                                      | 建立明確 source of truth                   |
| 早期 HTML 使用機率、保底、重複四次上限            | 最新規格全部取消，改每日一張新卡                                 | 移除互斥規則與空卡池問題                   |
| 23:59 開始角色、00:01 才點 Galaxy News 的日期歸屬 | 以單局 `startedAt` 的台北日期為準；抽卡點擊時間另存              | 跨日恢復仍能使用同一個有效日期             |
| 同日多次重玩是否新增卡                            | 當日第一局決定卡片，後續局固定同卡                               | 防止刷卡且保留遊玩自由                     |
| 集滿 11 張後還能否抽卡                            | 每個新有效日期從全部 11 張等機率抽一張；收藏仍為 `11 / 11`       | 保留持續遊玩與抽卡結果                     |
| 未抽卡就離開                                      | 原局保留可抽狀態，下次進同角色續抽                               | 不因離頁遺失資格                           |
| 重複點擊或雙分頁                                  | 單局結果＋玩家收藏在 transaction 內原子更新                      | 避免 double draw                           |
| 遊玩歷史會讓 parent challenge 持續變大            | 保留既有 `challengeId` parent，每局放在 `cardDraws/{cardDrawId}` | 分離 parent 摘要與每局歷史，降低舊流程改動 |
| 收藏需要跨角色保存但不另建玩家文件                | 由已驗證玩家的有效 `cardDraws` 記錄推導收藏                      | 避免重複保存可推導的 collection summary    |
| 抽卡動畫與收藏翻面描述混淆                        | 抽卡自動翻面；收藏詳情手動翻面                                   | 讓兩種使用情境各自清楚                     |
| 報表卡牌欄位                                      | 新增「當次遊戲抽的卡牌」；有有效結果填英文卡名，無效／未抽填 `N` | V2-2 每局一列，舊 V2-1 flatten 維持相容    |

## 後續功能驗收清單（接手團隊）

以下是功能驗收基準，不代表我仍負責追蹤或完成這些項目；後續結果由接手團隊更新。

### 後端

- [ ] 抽卡結果寫入目前局別的 `cardDraws/{cardDrawId}`；不建立獨立玩家收藏文件。
- [ ] 尚未集滿時，新有效日期首抽從未收藏的卡牌中等機率選取；已集滿時從全部 11 張卡中等機率選取。
- [ ] 同日第二局起固定回傳當日第一張卡。
- [ ] 同一局的 `cardDrawId` 重試永遠回傳該局原卡；同一 `challengeId` 下的新局依有效日期套用首抽或同日沿用規則。
- [ ] 台北時間 23:59／00:00 邊界測試通過。
- [ ] 雙擊、平行 request 與雙裝置不會發出兩張不同卡。
- [ ] 未完成角色、非 owner、無效 site 或未驗證 token 不能抽卡。
- [ ] 已集滿 11 張時，新有效日期仍從全部 11 張等機率抽一張，收藏維持 `11 / 11`。
- [ ] 舊 V2-1 文件沒有抽卡欄位時仍可正常讀取及產生報表。
- [ ] 報表新增「當次遊戲抽的卡牌」，無有效抽卡時輸出 `N`。

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
- 資料方向已定為 parent challenge 加 `cardDraws` 單局 subcollection，不另建玩家／收藏摘要文件。
- 每局抽卡冪等、有效日期與收藏推導契約已由 OpenSpec 定義；後續落地與驗收由接手工程師跟進。

### 已由我完成的前端驗證

- `npm run build-stage` 成功。
- 抽卡元件測試 41 項通過。
- 前端使用測試站 API 的初步串接與 code review 已完成；review 後續項目已交接，不代表 Stage 端到端驗收通過。
- 後端／報表完整測試、Stage 實機與 LINE WebView 驗收、PR／部署版本由接手團隊維護，本文件不追蹤為我的待辦。

## 前端實作與 Code Review 交接紀錄（2026-09-23）

前端抽卡與收藏功能已有初版，並完成 build 與元件測試。Review 對照前端和已部署測試站的後端 API 契約後指出以下問題，當時已交接其他工程師處理。因我已不再負責本專案，以下僅保留交接內容；接手後是否修正及驗收，請以團隊後續紀錄為準。

| 嚴重度 | Review 發現                                                                                                                      | 交接修正與驗收方向                                                                                                        |
| ------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| P1     | 新局呼叫 `/start` 沒有傳 `cardDrawId`；後端只有收到 `cardDrawId: null` 才建立該局的 V2-2 抽卡紀錄。                              | 新局明確傳 `null`，並保存／傳遞回應中的 `cardDrawId` 與 `cardDraw`；驗證完成但尚未抽卡的局能正確恢復抽卡。                |
| P1     | 抽卡 API request 缺少後端要求的 `cardDrawId`。                                                                                   | 呼叫抽卡 API 時傳入目前局別的伺服器 `cardDrawId`，並以 request 測試確認 body 同時含 `site`、`challengeId`、`cardDrawId`。 |
| P1     | 前端抽卡 response normalizer 使用 `drawDate`、`reusedDailyResult`，與後端回傳的 `effectiveDate`、`reusedExistingResult` 不一致。 | 將後端 DTO 正確轉為前端呈現模型，並以實際 API response fixture 驗證新抽、同日重用與重新載入結果。                         |
| P1     | 前端從 response 最外層讀收藏數量；後端實際將欄位放在 `summary` 物件內。                                                          | 依後端 DTO 從巢狀 `summary` 讀取已收藏數、總數及集滿狀態，驗證收藏視窗能顯示有效結果。                                    |
| P2     | 收藏請求尚未完成時關閉並重開視窗，較舊請求可能晚於新請求回來並覆蓋新狀態。                                                       | 關閉時取消請求或使其回應失效；測試舊請求晚回、視窗重開及 loading 狀態不被舊請求清除的情境。                               |

P1 項目涉及抽卡紀錄建立、抽卡與收藏資料解析；P2 項目涉及視窗重開時的非同步競態。上述問題已交接，本文不再將其列為我的待辦，也不推定接手者已完成修正。

## 已定案方向與責任交接

- 每局資料位於既有 challenge parent 的 `cardDraws/{cardDrawId}`；不新增獨立玩家收藏、摘要或每日卡牌文件。
- 有效日期依每局 `startedAt` 的 `Asia/Taipei` 日期；滿 11 張後新日期改由全部 11 張等機率抽取。
- Galaxy News 抽卡觸發在影片頁；報表新增欄名為「當次遊戲抽的卡牌」。
- 前端 API 契約依 `/draw-card`、`/card-collection` 及 `cardDrawId`／DTO 規格串接；Review 指出的差異已交接。
- Stage 後續修正、測試、報表核對、遠端分支狀態與正式部署由接手團隊負責，不列為我的待確認工作。
- 以上是我離開時已確認的方向；若接手團隊後續變更規格，以新 owner 的決定為準。

## 我的學習與反思

### 先找出規格主體，再討論技術

最初的 PRD、HTML、Issue 與 Figma 同時出現機率、最後一張保底、四次上限與每日限制。如果直接照單實作，很容易產生沒有可抽卡、規則互相覆蓋，或前後端各自理解的結果。我學到應先確認哪份文件是 source of truth，再把每一個案例寫成輸入與預期輸出。

### 資料生命週期比 collection 數量更重要

資料設計曾比較過獨立玩家收藏文件與 challenge 子集合方案；最後採用既有 parent challenge 加 `cardDraws/{cardDrawId}`，並由有效單局紀錄推導收藏，不另存可推導的玩家摘要。這個決策保留 V2-1 parent 相容性，也讓每局報表有明確來源。

### 動畫也需要後端一致性

抽卡不是只做 CSS 翻牌。若前端先隨機顯示、後端再寫資料，網路重試或多分頁會使畫面與收藏不一致。正確順序是由後端 transaction 決定並保存卡牌，前端再依結果播放動畫。視覺互動因此建立在可恢復、可稽核的資料狀態上。

### 將不確定性留在文件，不偽裝成成果

這份筆記用「已確認」、「設計方向」、「尚未實作」區分證據強度。對研究所申請材料而言，能清楚說明決策過程、限制與驗證方法，比把規劃誤寫成已完成更能呈現工程判斷。

## 研究所申請可用素材

### STAR 專案摘要

- **Situation：** CRESTCODE V2-1 上線後要新增 11 張卡牌收藏，但 PRD、會議 HTML、Issue 與 Figma 對抽卡機率、每日限制、最後一張與動畫的描述互相衝突；既有 `challengeId` 又以單局為核心，無法直接承擔跨局收藏。
- **Task：** 負責需求整理、OpenSpec 與前端初版；後端實作由其他工程師負責，後續 API review 修正也交接給接手者。
- **Action：** 我比對 PRD、會議文件、Issue 與 Figma，收斂每日卡池、同日重抽、滿卡隨機、角色開始日期及恢復流程；依最終方向記錄 parent challenge 加 `cardDraws/{cardDrawId}` 的資料模型，並實作前端卡牌動畫、收藏介面與測試站 API 串接初版。
- **Result：** 前端 `build-stage` 成功、抽卡元件測試 41 項通過；Code Review 發現的 4 項 P1 契約差異及 1 項 P2 非同步問題已交接其他工程師。此記錄呈現我的規格釐清、前端實作與交接成果，不宣稱整個專案已完成端到端驗收。

### 備審自述草稿

在 AstraZeneca CRESTCODE V2-2 任務中，我面對的是 PRD、會議紀錄、Issue 與介面稿之間互相衝突的抽卡規則。我先與團隊釐清 PRD 優先級，再用具體案例收斂跨日、同日重玩、未抽卡離開、集滿 11 張等行為，並將結論整理為 OpenSpec 與前後端契約。之後我負責前端初版的卡牌呈現、收藏介面與測試站 API 串接；Review 發現的契約差異則交接給接手工程師。這段經驗讓我看到規格清晰、測試證據與交接邊界同樣是軟體工程成果的一部分。

### 履歷條列草稿

- 收斂 PRD、GitHub Issue、會議文件與 Figma 的衝突需求，整理 11 張卡牌每日抽卡、角色開始日期、同日重玩與滿卡規則。
- 與後端工程師對齊 parent challenge 加 `cardDraws/{cardDrawId}` 的 API／資料契約，避免新增獨立玩家收藏文件。
- 實作 LINE LIFF 卡牌抽卡動畫與收藏介面初版，串接測試站 API，完成 `build-stage` 與 41 項抽卡元件測試。
- 將 code review 發現的前後端契約與非同步競態問題整理交接，由接手工程師負責後續修正及 Stage 驗收。
- 以 OpenSpec／SDD 拆分前後端 change 與驗收邊界，清楚區分個人交付和後續團隊責任。

> NDA／面試說明：對外材料應以架構、決策方法與去識別化流程為主；不要公開真實 LINE UID、HCP 個資、內部 Firebase 設定、Production URL、憑證、未公開醫療內容或完整客戶資料。

## Progress

### 2026-09-15

- 承接 V2-1 完成狀態，閱讀交接摘要與最新版 PRD。
- 比對 PRD 下半部、`0909_meeting_slides.html` 與 GitHub Issue #54 的抽卡描述。
- 整理卡片總數、機率、最後一張、每日限制、抽卡觸發、日期與報表等疑點。
- 確認最新功能以 PRD 為主：同日只取得一張新卡，不再採用早期機率制。

### 2026-09-16

- 確認卡池最終為 11 張，V2-1 舊玩家於 V2-2 上線後從 0 張開始。
- 初步確認 Galaxy News 按鈕為抽卡觸發、不要求影片觀看完成；後續明確按鈕位於影片頁。
- 初步討論日期與同日抽卡規則；後續定案以角色遊玩 `startedAt` 換算台北日期。
- 初步提出集滿後不再新增卡；後續補定集滿後的新有效日期從全部 11 張等機率抽卡。
- 確認角色未完成或已完成未抽卡需恢復；後續重玩在同一 `challengeId` 建立新 `cardDrawId`。
- 曾評估獨立玩家收藏文件；後續改定為 `cardDraws/{cardDrawId}`，不新增獨立玩家收藏文件。
- 確認報表每局一筆；後續將欄位名稱定為「當次遊戲抽的卡牌」，無有效卡牌資料填 `N`。
- 對照 Figma 確認抽卡自動翻牌、收藏詳情手動翻牌，以及收藏入口只出現在家族樹與完成頁。
- 盤點 11 組正面／背面／黑卡及 2 個介面素材，共 35 個檔案。
- 規劃後端、前端各一個 OpenSpec change，後端先完成契約再供前端串接。
- 發現目前分支混入 Stage 歷史，暫停正式實作並等待團隊修復乾淨 baseline。

### 2026-09-23

- 後端抽卡與收藏 API 已部署至測試站，前端本機串接該測試站 API。
- 前端已有抽卡結果呈現與收藏介面初版；`build-stage` 成功，抽卡元件測試 41 項通過。
- Code Review 發現 4 項 P1 前後端 lifecycle／DTO 契約不一致，以及 1 項 P2 收藏視窗非同步競態；當時已交接其他工程師處理，後續結果不屬於我的責任範圍。
- 前端本機提交為 `7458acf`；當次 `git push` 曾回報 HTTP 400。該次之後的遠端分支狀態交由接手團隊確認，不再由我追蹤。

### 2026-10-27

- 更新交接文件，將資料模型修正為既有 challenge parent 下的 `cardDraws/{cardDrawId}`，並補上滿卡後每個新有效日期從全部 11 張等機率抽卡的規則。
- 明確記錄有效日期依角色遊玩紀錄 `startedAt`，Galaxy News 抽卡在影片頁觸發。
- V2-2 後續已不由我負責；Stage 整合、Review 後續修正、報表驗證與部署由接手團隊處理。

## 相關人物與角色

- **我（實習工程師）：** 需求釐清、OpenSpec、前端卡牌互動／收藏初版、測試站串接與初步測試，並完成交接。
- **PM／需求窗口：** 確認 PRD 優先級、抽卡規則、客戶文案與驗收範圍。
- **前端工程師／設計協作者：** 說明 PRD 為主、確認 Figma 互動及視覺素材。
- **接手工程師：** 負責後續 API／前端 Review 修正、Stage 整合驗收與部署；我不再負責後續追蹤。
- **AZ／Medical／Compliance：** 核定對外文案、醫療內容與正式上線版本。

---
title: Awiqli HCP Learning Game UI
status: in-progress
updated_date: 2026-10-05
tags:
  - 實習
  - 任務
  - Awiqli
  - HCP
  - Angular
  - LINE LIFF
  - Figma
  - RWD
  - OpenSpec
---
# Awiqli HCP Learning Game UI

## 任務目標

依照 Figma，在既有 `nnhcp-liff-main` 專案中實作 Awiqli HCP 學習遊戲畫面。目前先完成首頁的靜態 UI，讓不同尺寸的直式手機可以等比例瀏覽長版地圖，並在捲動時保留頂部標題與底部進度／控制區。

本階段以首頁為範圍，進度使用 Figma 的預設值，地圖與控制器先作為視覺素材呈現。題目、作答、影片、真實進度與地圖導覽等後續功能，待對應需求與文案確認後再安排。

## 目前進度摘要（2026-10-05）

- **Stage 1 已完成：** 匯入地圖、外框、Logo、進度筆及控制器素材，建立 standalone `learning-game` 頁面並接上既有路由。
- **Stage 2 已完成：** 建立等比例可捲動地圖、固定 banner 與底部 HUD；加入動態視窗高度及底部安全區處理，進度固定為 `0 / 6`。
- **最新畫面調整：** 捲到地圖底端不增加額外空白，進度筆與控制器疊在地圖前景；外框位於標題列之上。Logo 已改用 Figma 提供的透明底原始素材，避免出現獨立白色矩形。
- **手機觀察：** 使用者回饋手機版呈現不錯；這是目前的畫面觀察，完整尺寸矩陣驗收仍待完成。
- **尚未結案：** Stage 3 的 RWD 驗收與 `npm run build` 尚未勾選完成。平板版型調整依使用者決定暫緩。
- **提交狀態：** 首頁初版已有本機 commit `0cd7799`（`feat(awiqli): add learning game home`）。最新 SCSS、Logo 路徑與透明 Logo 素材仍為本機未提交變更；本紀錄未確認遠端 PR、合併或部署狀態。

## 專案資訊

- Repository：<https://github.com/Aiii-Developers/nnhcp-liff-main>
- 本機 Repository：`/Users/oscar/Documents/nnhcp-liff-main`
- 目前 Feature branch：`feat/awiqli-dose-converter`
- 功能目錄：`src/app/awiqli/learning-game/`
- 功能路由：`/awiqli/learning-game`
- 素材目錄：`src/assets/awiqli/learning-game/`
- 技術組合：Angular 17、TypeScript、HTML、SCSS、standalone component。
- OpenSpec change：`awiqli-home-rwd`
- OpenSpec capability：`awiqli-learning-game-home`

最終實作位置已改為 `nnhcp-liff-main`，與先前討論的 `nnhcp-awiqli-liff` prototype repo 不同。這份文件記錄的是目前主專案中的學習遊戲首頁。

## 需求來源

- [Figma 首頁（4899:1335）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4899-1335&m=dev)：本次首頁的版面參考。
- [Figma 遊戲畫面（4889:5918）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4889-5918&m=dev)：整體遊戲畫面參考；設計仍持續更新。
- [Figma banner 樣式（4894:1271）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4894-1271&m=dev)：最新頂部標題與透明 Logo 的來源。
- [Awiqli 藥品上線 HCP 功能更新 PRD](https://github.com/Aiii-Developers/nnhcp-docs/blob/main/%5B專案%5D%20Awiqli藥品上線HCP功能更新/評估文件/Awiqli藥品上線HCP功能更新_PRD_TBD.md)：整體功能需求來源，正式文案與後續互動需再對照最新版本。
- 本機 OpenSpec：`openspec/changes/awiqli-home-rwd/`，包含 `proposal.md`、`design.md`、`tasks.md` 與 `specs/awiqli-learning-game-home/spec.md`。

目前 repo 的 `.gitignore` 會忽略 OpenSpec 文件。若需要交接 proposal、spec、design 與 tasks，需確認團隊要採用的文件保存方式。

## 我負責的工作

- 確認實作 repo、分支與既有 Awiqli 路由結構。
- 讀取 Figma，辨識地圖、外框、標題、進度筆與控制器各自的素材及排列方式。
- 以 OpenSpec 整理首頁的需求、設計決策與分階段任務，並將文件轉為中文。
- 在現有 standalone 頁面中實作靜態首頁與直式手機 RWD。
- 依畫面回饋修正捲動底端、外框層級與 Logo 白底問題。
- 記錄已完成的實作與尚待執行的驗收，供後續 review 與開發使用。

## 已確認的畫面規格

### 地圖與捲動

- Figma 首頁參考畫面為 `390 × 844`，其中包含 LIFF 宿主介面；Angular 頁面填滿實際可用的內容視窗。
- 地圖素材比例為 `390:1040`，等同 `3:8`；依可用寬度縮放，保持比例。
- 島嶼插圖與地圖標籤已包含在同一張圖片中，初版不拆開重新排列。
- 地圖高度超出可視區域時可垂直捲動；捲到圖片底端後不增加額外的空白區。
- 底部 HUD 疊在地圖前景，因此底端的部分背景會被 HUD 覆蓋。這是目前採用的畫面決策，驗收需以此構圖為準。

### 頂部 banner 與外框

- 頂部固定顯示 Awiqli Logo，以及「Awiqli® 認識學習／HCP LEARNING HUB」兩行文字。
- Banner 使用半透明白色背景，Logo 與標題以 flex 排列。
- Logo 使用 Figma 提供的透明底 PNG，保留比例並顯示於 `120 × 40` 的區域。
- 外框顯示在 banner 與 HUD 上層，讓邊線不會被標題背景蓋住。

### 底部進度與控制器

- 靜態進度維持為 `0 / 6`，不呼叫進度資料服務。
- `0 / 6` 是目前首頁的 Figma 展示值，不代表正式題目數量已定稿。
- 進度筆與控制器固定於遊戲區域底部，捲動地圖時保持定位。
- 使用 `100dvh` 配合可視高度，並以 `env(safe-area-inset-bottom, 0px)` 避開底部系統介面；保留 `100vh` 作為 fallback。
- 地圖與控制器目前不提供點擊導覽或遊戲操作。

### 本階段版型範圍

- 以寬度 `320–430 CSS px` 的直式手機為主要目標。
- 較矮與較高視窗都需能捲動地圖，固定區域不得因高度變化而失去定位。
- 平板上曾觀察到標題與進度筆分散至畫面兩側的情況；平板版型改善目前暫緩，不能列為已完成的驗收成果。

## 元件與素材對照

| 檔案 | 用途 |
| --- | --- |
| `src/app/awiqli/awiqli.module.ts` | Awiqli 功能路由入口，使用 `loadComponent` lazy load standalone 學習遊戲頁面。 |
| `learning-game.component.ts` | 元件設定與本機素材路徑。 |
| `learning-game.component.html` | 地圖、外框、banner 與底部 HUD 的畫面結構。 |
| `learning-game.component.scss` | 等比例地圖、捲動區、疊加層級、視窗高度及安全區樣式。 |
| `map.png` | 長版地圖，含島嶼插圖與標籤。 |
| `frame.png` | 遊戲外框。 |
| `awiqli-logo.png` | 目前使用的透明底 Logo，原始尺寸為 `450 × 150`。 |
| `progress-pen.png` | 進度筆素材。 |
| `controller.png` | 底部控制器素材。 |

素材統一放在 `src/assets/awiqli/learning-game/` 並使用本機路徑，避免依賴會過期的 Figma 暫存網址。原本的 `logo.png` 仍保留在目錄中，頁面已改用 `awiqli-logo.png`。

## 完成條件

- [x] Stage 1.1：取得首頁素材並存入 repo 的專用 assets 目錄。
- [x] Stage 1.2：建立 standalone 頁面結構並接上 `/awiqli/learning-game` 路由。
- [x] Stage 2.1：完成等比例地圖、banner、外框、進度與控制器構圖。
- [x] Stage 2.2：加入動態視窗高度、安全區與固定 HUD；地圖底端不留額外空白，外框覆蓋標題列。
- [x] Stage 2.3：維持靜態 `0 / 6`，地圖與控制器不觸發互動或導覽。
- [x] 改用 Figma 的透明底 Logo，移除素材本身的白色矩形背景。
- [ ] Stage 3.1：檢查 `320`、`360`、`390`、`430 CSS px`，搭配不同高度，確認沒有水平溢出、比例正確、固定區域與安全區正常。
- [ ] Stage 3.2：執行 `npm run build` 並確認 Angular build 成功。
- [ ] 最新本機修正提交後，補上 PR／部署與驗收結果。

## 本機檢視與驗收方式

目前 repo 的 `package.json` 沒有 `local` script，因此不能沿用另一個 prototype repo 的 `npm run local`。

在目前專案啟動開發伺服器：

```bash
cd /Users/oscar/Documents/nnhcp-liff-main
npm start
```

開啟 `http://localhost:4200/awiqli/learning-game`。這條路由繼承父層 `AuthGuard` 與 LIFF 登入流程；若進入登入或授權流程，需依專案既有的 LIFF 測試方式操作。

使用瀏覽器裝置模式檢查各手機寬度與不同高度，特別確認地圖捲到底時的前景疊加、頂部外框及 Logo 背景。底部安全區的效果另需在會回報 safe-area inset 的裝置／WebView 中觀察，不能只以桌面縮小視窗代替。

完成畫面檢視後，執行建置：

```bash
npm run build
```

以上是待執行的驗收步驟；目前 OpenSpec 的 Stage 3 仍未完成，不將啟動或建置成功視為已有證據。

## 遇到的問題與處理方式

### 固定 HUD 與地圖底端

Review 指出固定 HUD 會覆蓋地圖最下方；增加底部捲動空間可以讓背景移至 HUD 上方，但會形成使用者不希望出現的尾端空白。後續確認採用「HUD 疊在地圖前景、圖片後方不留白」的構圖，並同步更新 OpenSpec 的設計與驗收描述。

### 底部安全區與外框層級

Edge-to-edge 畫面需要讓 HUD 避開 home indicator，因此加入底部安全區位移。頂部則依畫面回饋提升外框層級，使外框邊線蓋在 banner 之上。實際裝置的 safe-area 效果仍待 Stage 3 確認。

### Awiqli Logo 出現白底

原始 `logo.png` 雖然是 RGBA PNG，但所有像素的 alpha 都是完全不透明，因此在半透明 banner 上形成白色矩形。改用 Figma banner 節點提供的透明底原始圖，另存為 `awiqli-logo.png` 並更新元件引用；新素材已確認包含透明像素，畫面效果仍需在最新頁面中檢視。

## 待確認與後續工作

- 完成 Stage 3 的手機尺寸矩陣、實際 safe-area 檢視與 build，記錄結果。
- 正式文案與持續更新的 Figma 定稿後，確認首頁標題與後續題目內容。
- 正式題目數量、關卡定義與進度計算方式需再對照最新 PRD；不可直接由靜態 `0 / 6` 推定。
- 後續遊戲流程已確認不要求看完影片才能作答；影片、題目與作答頁仍需另行安排實作。
- 地圖互動、控制器行為、真實進度資料及後端契約需另行定義。
- 平板與橫式版型是否納入後續工作，待排程確認。
- 確認最新修正的提交、PR 與部署狀態，再補上相關連結與驗收證據。

## 我的學習與反思

這次的 RWD 不只是把所有物件改成 flex。地圖是一張含插圖與標籤的完整素材，適合保留比例；標題與進度區則適合用彈性排列組合。將可捲動的背景與固定的 UI 分層，才能同時維持構圖和手機瀏覽體驗。

固定區域還需要一起考慮可視高度、安全區、捲動尾端與素材透明度。透過 OpenSpec 先記錄這些畫面行為，再依實際回饋修正設計，可以避免規格與程式對「底端要不要留白」產生不同理解。

## Progress

### 2026-10-05

- 確認目前實作位於 `nnhcp-liff-main` 的 `feat/awiqli-dose-converter` 分支與 `src/app/awiqli/learning-game/`。
- 建立並使用中文 OpenSpec change `awiqli-home-rwd`；Stage 1、2 共 5 項任務已勾選完成，Stage 3 的 2 項驗收仍待執行。
- 首頁初版已有本機 commit `0cd7799`，包含路由、頁面與本機素材。
- 依使用者回饋調整地圖底端不留空白、HUD 疊在背景前景，以及外框顯示於標題列上層。
- 依 Figma banner 節點取得 `450 × 150` 透明底 Logo，新增 `awiqli-logo.png` 並更新元件路徑；這次素材替換尚未執行 build。
- 使用者回饋手機版表現不錯，平板版型調整暫緩。
- 更新本任務文件；整體狀態維持 `in-progress`，待完成尺寸矩陣、建置與後續 review。

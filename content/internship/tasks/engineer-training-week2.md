---
title: 團隊 TODO LIST 機器人練習任務
status: in-progress
start_date: 2026-09-29
tags:
  - 實習
  - 任務
  - Angular
  - LIFF
  - Mock Service
  - CRUD
  - Firebase Hosting
---
# 團隊 TODO LIST 機器人練習任務

## 任務目標

依據 Aiii 新進工程師訓練題目，使用 Angular + LIFF 製作團隊共用的待辦清單畫面，完成待辦事項的新增、編輯與刪除。待辦功能先使用 mock service 與記憶體資料，讓資料存取可在後續替換成 API，而不讓畫面元件直接依賴資料來源。目前已加入 LIFF 登入並部署至 Firebase Hosting；正式待辦 API 尚未實作。

這是教育訓練練習，不是上線產品規格，也不對應客戶專案。

## 專案資訊

- 目標 Repository：`/Users/oscar/Documents/Oscar-liff-demo`
- 需求來源：[練習題：團隊 TODO LIST 機器人](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/training-assignment.md)
- 來源狀態：文件標示 `status: draft`，並有 `generated` 標記；本任務記錄依該版本整理，尚未視為人工查證版本。
- 來源更新日期：2026-09-22

## 範圍與非目標

| 類別 | 本次範圍 |
| --- | --- |
| 畫面 | 使用 Angular 製作可在 LIFF 中開啟的待辦清單畫面 |
| 必做功能 | 顯示清單，以及新增、編輯、切換完成狀態、刪除待辦事項 |
| 資料來源 | local 模式使用 mock service 與 in-memory 假資料；正式模式仍是 API stub |
| 平台整合 | LIFF 初始化、LINE 登入與暱稱顯示；Firebase Hosting 部署 |

本次不要求撰寫後端 API、接資料庫、webhook 推播或 LINE Bot 對話邏輯，也不要求資料持久化。重新整理後回到初始假資料是預期行為。權限、多團隊隔離、搜尋、排序、分頁、標籤與期限不在主線範圍；若要擴充，另開 Issue。

## 目前實作狀態（2026-10-07）

- TODO 頁面使用黑、白、灰色系；移除進度摘要與手機滑動刪除，改為直接點擊刪除按鈕，保留每列的圓滑編輯按鈕。
- 新增、編輯、完成切換與刪除成功時直接更新清單，不再跳成功彈窗。新增空白標題使用提醒彈窗，編輯空白標題在編輯欄位下方提示；操作失敗使用錯誤彈窗，清單載入失敗則顯示頁面內的重試區塊。
- LIFF 登入由 `LiffAuthService` 處理，頁面可顯示登入狀態、LINE 暱稱或錯誤訊息。使用者已回報手機可以開啟畫面。
- Firebase Hosting 已完成建置與部署，網站入口：[TODO 頁面](https://oscar-todo-list.web.app/todo-list)。
- **網站部署與待辦 API 是兩件事。** `npm run local` 使用 mock service；`npm run build` 使用正式 service，目前尚未接上 API，載入待辦會回報未設定 API 的錯誤。部署完成不代表線上 CRUD 已可操作。
- LINE channel 的 Published 狀態及未加入角色的一般使用者登入結果，仍待確認。
- 任務狀態維持 `in-progress`；本次 LIFF／Hosting 變更的提交、PR review、合併及 Issue 結案結果仍待補記。

## 功能需求

### 主線（全部必做）

| # | 需求 | 驗收結果 |
| --- | --- | --- |
| 主-1 | 新增待辦事項 | 輸入並送出後，mock service 建立新資料；清單立即多一筆，狀態預設未完成，且有唯一 `id` 與建立時間；輸入框清空 |
| 主-2 | 編輯待辦事項 | 可修改既有事項內容，或切換完成／未完成；清單顯示新值，原本的 `id` 與 `createdAt` 保持不變 |
| 主-3 | 刪除待辦事項 | 指定資料從清單移除，其他資料不受影響；刪除最後一筆時顯示空狀態 |

清單顯示是三項操作的共同前提：初次開啟時需呈現 mock service 資料，並讓完成與未完成狀態可辨識。

### 待辦資料欄位

| 欄位 | 型別 | 必填 | 規則 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 每筆唯一；建立後不可因編輯而改變 |
| `title` | `string` | 是 | 待辦內容；不得為空字串或只有空白 |
| `completed` | `boolean` | 是 | 新增時預設 `false` |
| `createdAt` | `string` | 是 | ISO 8601 建立時間；建立後不可改變 |
| `updatedAt` | `string` | 否 | ISO 8601 最後編輯時間；新增時與 `createdAt` 相同 |
| `createdBy` | `string` | 否 | 建立者顯示名稱；主線可留空或使用假值 |
| `updatedBy` | `string` | 否 | 最後編輯者顯示名稱；主線可留空或使用假值 |

題目使用 `isCompleted` 描述完成狀態；目前 repo 的 UI model 使用 `completed`。正式 API 欄位尚未確認，後續若名稱不同，應在 service 內轉換。`createdBy`、`updatedBy` 是需求預留欄位，目前 `TodoItem` 尚未加入。

### 初始 mock 資料

至少提供三筆穩定的初始資料，至少一筆已完成，以便畫面能展示兩種狀態。目前 `todo-list.mock.ts` 使用下列資料：

| `id` | `title` | `completed` |
| --- | --- | --- |
| `todo-001` | 建好 LIFF app 並跑起來 | `true` |
| `todo-002` | 熟悉 Angular 20 專案結構 | `false` |
| `todo-003` | 完成 TODO 清單功能驗收 | `false` |

每筆資料都要有固定的 `createdAt` 與 `updatedAt`；不要使用隨機資料或每次載入都變動的初始值。

### Mock service 行為

元件透過同一個 service 查詢與更新資料，不直接讀寫 mock 陣列。主線操作應符合下表：

| 操作 | 輸入 | Service 行為 | 可觀察結果 |
| --- | --- | --- | --- |
| 查詢 | 無 | 回傳目前所有待辦事項 | 清單顯示所有資料及其完成狀態 |
| 新增 | `title` | 產生唯一 `id`；設定 `createdAt`、`updatedAt`；`completed` 設為 `false`；加入並回傳新資料 | 清單增加一筆，輸入框清空 |
| 編輯 | `id` 與更新欄位 | 更新 `title` 或 `completed` 及 `updatedAt`；保留 `id`、`createdAt` | 目標資料更新，其他資料與總筆數不變 |
| 刪除 | `id` | 從資料集合移除指定項目 | 目標資料消失，其他資料不變 |

邊界行為：

- 空白 `title` 不送進 service，畫面顯示提示。
- 編輯或刪除時找不到 `id`，service 必須明確回報失敗，畫面不可顯示成功。
- 資料保存在記憶體中；重新整理後回到初始三筆。

## 技術與實作條件

- 使用 Angular + LIFF；LIFF app 依訓練文件使用個人帳號建立，不使用公司站台測試。
- 畫面不要求指定稿；至少有清單、新增輸入欄位，以及每筆資料的編輯和刪除入口。
- 資料操作集中在 service，讓之後可替換為 API 實作而不必重寫元件。
- 命名、註解與排版遵循公司程式風格；不要提交 `console.log` 或 `debugger`。
- Issue、分支、PR、review、merge 與部署流程依第二週課綱及公司工程規範辦理，本文件只記錄題目需求。

## 驗收條件

以下勾選記錄已完成的 mock 主線驗收；本次 LIFF 整合與部署後的完整回歸測試尚未重新記錄。

### 功能與資料

- [x] 初次開啟時顯示 mock service 提供的待辦事項，完成與未完成狀態可辨識。
- [x] 新增後清單立即增加一筆，內容正確且預設未完成。
- [x] 編輯內容後顯示新內容，該筆 `id` 與 `createdAt` 不變。
- [x] 切換完成狀態後顯示新狀態，清單總筆數不變。
- [x] 刪除後目標資料消失，其他資料保留；空清單時顯示空狀態。
- [x] 空白內容無法送出；新增時以彈窗提醒，編輯時在欄位下方提示。
- [x] 編輯／刪除不存在的 `id` 時，不會呈現成功結果。
- [x] 所有資料操作均透過 mock service，元件不直接維護資料陣列。

### 結構與範圍

- [x] 更換 service 內部資料來源時，畫面元件不需跟著修改。
- [x] 主-1、主-2、主-3 全部完成才算主線通過。
- [x] 支線未完成不影響主線通過；主線可獨立操作與驗收。

### 開發流程

Issue、PR 實際 review 往返、merge 後關閉 Issue，以及任務連結要求，依[第二週：LIFF 前端與 Mock 資料](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/week-2-liff-mock.md)的驗收點辦理。分支、PR、review 與 API 規範見需求來源的相關文件。

## 程式碼閱讀入口

以下路徑均相對於 `Oscar-liff-demo` repo 根目錄。

| 功能 | 檔案 | 要看的地方 |
| --- | --- | --- |
| 畫面與事件綁定 | `src/app/features/todo-list/todo-list.component.html` | `[formGroup]`、`formControlName`、`(ngSubmit)`、`(click)` 與 `@if`／`@for` |
| 表單與 CRUD 操作 | `src/app/features/todo-list/todo-list.component.ts` | `addTodo()`、`startEditing()`、`saveEdit()`、`toggleCompletion()`、`deleteTodo()`；呼叫 service 後更新畫面狀態 |
| 頁面樣式 | `src/app/features/todo-list/todo-list.component.scss` | 黑白灰主題、待辦列排版、編輯／刪除按鈕與手機版樣式 |
| mock 資料操作 | `src/app/features/todo-list/todo-list.mock.service.ts` | 以 signal 保存清單，並在新增、更新、刪除時改變資料 |
| 正式 API 接口 | `src/app/features/todo-list/todo-list.service.ts` | 目前各方法回傳 `TODO(api)` 錯誤，等待後端串接 |
| 共用契約與資料欄位 | `todo-list.service.interface.ts`、`todo-list.models.ts`（同 feature 目錄） | service 的 public methods 與 `TodoItem` 型別 |
| 提醒與錯誤彈窗 | `src/app/features/todo-list/todo-feedback-dialog.component.ts` | `MatDialog` 顯示的內容與關閉按鈕 |
| LIFF 登入 | `src/app/core/auth/liff-auth.service.ts` | `initialize()` 讀取設定，執行 `liff.init()`、登入判斷與 `liff.getProfile()` |
| 啟動時初始化登入 | `src/app/app.config.ts` | `provideAppInitializer()` 在應用程式啟動時呼叫登入服務 |
| mock／正式 service 切換 | `angular.json` | local configuration 的 `fileReplacements` |
| 程式流程圖與介紹 | `docs/onboarding/todo-list-code-walkthrough.md` | HTML → component → service 的流程圖與功能對照；其中「尚未初始化 LIFF」的描述待同步更新 |
| API 交接文件 | `docs/tech/api-contract.md` | 待辦欄位、操作契約及 UI 狀態對照 |

## LIFF 登入與 Hosting 更新方式

登入流程：

1. Angular 啟動時，`provideAppInitializer()` 呼叫 `LiffAuthService.initialize()`。
2. 服務讀取 `/assets/liff-config.json` 的 LIFF ID，再呼叫 `liff.init()`。
3. 外部瀏覽器尚未登入時，透過 `liff.login()` 導向 LINE 登入。
4. 已登入時，透過 `liff.getProfile()` 取得暱稱並更新登入狀態 signal。
5. TODO 頁面的 HTML 讀取這些 signal，顯示登入結果。

`src/assets/liff-config.json` 已加入 `.gitignore`，本筆記不記錄 LIFF ID 或 token。設定檔在建置時會複製到網站資源中；日後若改用自動部署，需要在部署環境提供這份設定。

LINE Login channel 保持 Developing 時，只有該 channel 的 Admin 或 Tester 可以登入測試；若要讓一般使用者使用，需要改為 Published。Published 無法改回 Developing。使用者目前已能在手機開啟，公開發布狀態與其他帳號測試仍待確認。[LINE 官方發布說明](https://developers.line.biz/en/docs/line-login/getting-started/)

對外分享 LIFF 分頁提供的 `https://liff.line.me/{LIFF_ID}`。使用者開啟後，LIFF 會導向設定的 Endpoint URL；第一次使用可能需要登入與授權。[LIFF 官方網址說明](https://developers.line.biz/en/docs/liff/registering-liff-apps/)

Firebase Hosting 的 `public` 設為 `dist/eng-onboarding-assignment/browser`，並將路由導回 `index.html`。修改程式後，先建置，再部署到自己的 Firebase 專案。執行前把 `YOUR_FIREBASE_PROJECT_ID` 換成自己的 project id：

```sh
npm run build
firebase deploy --only hosting --project YOUR_FIREBASE_PROJECT_ID
```

Published 只改變 LINE channel 的存取範圍，不會更新網站程式。Repo 現有 GitHub Actions 是推送指定 tag 後部署至 Cloud Run，目前 repo 內沒有 Firebase Hosting 自動部署流程。

## 下一步與待確認事項

- [x] 加入 LIFF SDK、啟動初始化與登入狀態／暱稱顯示。
- [x] 依使用者提供的輸出確認 `npm run build` 成功，並完成 Firebase Hosting 部署。
- [x] 使用者回報手機已可開啟畫面。
- [ ] 確認 LINE Login channel 顯示 Published，並讓未加入 Admin／Tester 的帳號透過 LIFF URL 登入測試。
- [ ] 記錄手機上暱稱、登入失敗訊息及外部瀏覽器登入流程的實際驗收結果。
- [ ] 完成簡化程式碼與 LIFF 整合後的 local 操作驗收、建置及相關測試，更新 OpenSpec 勾選狀態；`todo-list-simple-delete-action/tasks.md` 目前仍未勾選。
- [ ] 同步 repo 的程式碼導覽等文件，修正尚未加入 LIFF 的舊描述。
- [ ] 提交本次變更，補上 PR／review／merge／Issue 結案連結與結果。

正式待辦 API、資料庫持久化及操作者身分紀錄屬後續整合工作，目前尚未完成。這些事項與第二週 mock 主線分開追蹤。

## 支線（非主線通過條件）

主線完成後，可逐項另開 Issue 延伸：

1. 以真正的 RESTful API 取代 mock service。
2. 實作具基本 CRUD 功能的 RESTful API。
3. 新增待辦時以 webhook 推播新增紀錄。
4. 待辦完成時以 webhook 推播完成紀錄。
5. 首次進入時詢問並記錄使用者身分。
6. 新增、修改時記錄操作者身分（依賴支-5）。
7. 討論刪除操作是否也要記錄操作者；可提交設計討論或 Issue，不一定要實作。

支線 1、2 是第三週主題。身分來源尚未指定；開始支-5 至支-7 前，先在 Issue 說明採用的身分來源與做法。主線資料可預留 `createdBy`、`updatedBy`，但不需取得真實身分。

## 風險與注意事項

- 元件直接操作假資料會讓後續替換 API 時需要重寫，service 邊界是主線驗收項目。
- 支線 1 至 4 牽涉後端與部署前置；先完成三項主線再評估。
- 「機器人」在本題指 LIFF 操作畫面，不包含 Bot 對話功能。

## 相關文件

- [第一週：環境建置與認識框架](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/week-1-environment.md)
- [第二週：LIFF 前端與 Mock 資料](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/week-2-liff-mock.md)
- [第三週：API 開發與部署](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/week-3-api-deploy.md)
- [三週實作制怎麼跑](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/how-it-runs.md)

## Progress

### 2026-09-29

- 依訓練題目整理任務目標、必做範圍、mock 資料規格、驗收條件與支線項目。
- 本文件建立完成；Angular 畫面與互動流程尚未開始實作。

### 2026-10-05

- 完成待辦清單 mock UI 主線：清單顯示、新增、編輯、切換完成狀態與刪除均透過 service 操作。
- 手機版左滑時，刪除區會跟著手勢露出；放開後依位移吸附，點擊刪除按鈕才會刪除。
- 新增空白標題時以彈窗提示；新增、編輯、完成狀態與刪除操作的成功或失敗結果也以置中彈窗顯示。彈窗可按「知道了」或 Escape 關閉，點擊背景不會關閉。
- 驗證通過：headless 測試 30/30、`npx ng build --configuration local`、app/spec Angular 型別與模板檢查，以及 `git diff --check`。
- 本次更新已提交至 `feature/todo-list-liff`，commit `8371b68`。
- 待補：手機 LINE／LIFF 實際驗收，以及依第二週流程完成 PR review 與合併；在這些事項確認前，任務狀態維持進行中。

### 2026-10-07

- 為了能理解並解釋程式，簡化 TODO component：移除進度摘要與手勢刪除，保留直接點擊刪除；成功時直接更新清單，保留輸入提醒與錯誤訊息。2026-10-05 的左滑與成功彈窗紀錄是當時版本，現已被這次簡化取代。
- 新增 `docs/onboarding/todo-list-code-walkthrough.md`，整理流程圖、HTML 與 TS 的溝通方式及各功能入口。
- 加入 LIFF 登入服務，透過應用程式初始化流程執行登入，並在 TODO 頁面顯示登入狀態、LINE 暱稱或錯誤。
- 建置時曾因 LINE SDK 的相依型別宣告引用 Node 型別而失敗；目前在 `tsconfig.app.json` 設定 `skipLibCheck: true`，使用者重新執行 production build 已成功。這個設定略過相依套件宣告檔檢查，應用程式本身仍維持 strict 型別檢查。
- Build 尚有兩項警告：TODO component SCSS 為 7.91 kB，超過 6 kB 的警告預算；LIFF 相依的 `tiny-sha256` 使用 CommonJS。兩者未阻止本次建置與部署。
- 使用者以 Firebase CLI 完成 Hosting 部署；手機原先遇到 400，確認涉及 LINE channel 的 Developing 狀態與測試角色限制後，已回報可以看到畫面。Published 與一般使用者存取仍待實際確認。
- 最近一次使用者提供的 `npm audit` 結果仍有 12 項漏洞（1 low、3 moderate、7 high、1 critical）；依使用者決定先繼續 LIFF／部署工作，未視為漏洞已修復。
- 本次筆記更新依 repo 內容與使用者提供的 build／deploy 輸出整理，未重新執行建置或測試；既有 30/30 測試紀錄仍屬 2026-10-05 的版本。

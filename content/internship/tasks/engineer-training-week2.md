---
title: 團隊 TODO LIST 機器人練習任務
status: in-progress
start_date: 2026-09-29
tags:
  - 實習
  - 任務
  - Angular
  - LIFF
  - Mock-Service
  - CRUD
  - Firebase-Hosting
  - API-串接
---

# 團隊 TODO LIST 機器人練習任務

## 任務目標

依據 Aiii 新進工程師訓練題目，使用 Angular + LIFF 製作團隊共用的待辦清單畫面，完成待辦事項的新增、編輯與刪除。待辦功能先使用 mock service 與記憶體資料，讓資料存取可在後續替換成 API，而不讓畫面元件直接依賴資料來源。目前已加入 LIFF 登入並部署至 Firebase Hosting，前端也已實作 Cloud Run Todo API 串接與 LINE ID token 認證；最新後端部署與端到端驗收結果仍待補記。

這是教育訓練練習，不是上線產品規格，也不對應客戶專案。

## 專案資訊

- 目標 Repository：`/Users/oscar/Documents/Oscar-liff-demo`
- 需求來源：[練習題：團隊 TODO LIST 機器人](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/training-assignment.md)
- 來源狀態：文件標示 `status: draft`，並有 `generated` 標記；本任務記錄依該版本整理，尚未視為人工查證版本。
- 來源更新日期：2026-09-22（沿用原需求快照，本次未重新查閱課綱）
- 目前分支：`feature/todo-list-liff`
- 任務 Issue：[Issue #2：team TODO list with mock data](https://github.com/Aiii-Developers/Oscar-liff-demo/issues/2)，2026-10-14 查詢為 Open。
- PR：[PR #1：team todo list for LIFF WebView](https://github.com/Aiii-Developers/Oscar-liff-demo/pull/1)，2026-10-14 查詢為 Open、非 draft、未合併；GitHub 尚無正式 review 紀錄。
- 最近已推送的提交：[`93c95ee`](https://github.com/Aiii-Developers/Oscar-liff-demo/commit/93c95ee)，LINE ID token 認證與重新登入處理。

## 範圍與非目標

| 類別     | 本次範圍                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------- |
| 畫面     | 使用 Angular 製作可在 LIFF 中開啟的待辦清單畫面                                                                      |
| 必做功能 | 顯示清單，以及新增、編輯、切換完成狀態、刪除待辦事項                                                                 |
| 資料來源 | 第二週原需求使用 mock；目前 Todo 的 local、development、production 均使用 API service，mock 檔案保留供閱讀與既有測試 |
| 平台整合 | LIFF 登入、ID token、重新登入、Cloud Run API 串接與 Firebase Hosting 部署                                            |

第二週 mock 主線不要求後端 API、資料庫、webhook 推播、LINE Bot 對話或資料持久化。目前已延伸進入 API 整合：Todo 改由後端回應提供資料，重新整理會重新查詢 API；只有早期 mock service 才會回到初始假資料。多團隊隔離、搜尋、排序、分頁、標籤與期限仍不在原主線範圍。

## 目前實作狀態（2026-10-14）

- TODO 頁面維持黑、白、灰色系，使用直接點擊刪除與圓滑編輯按鈕；進度摘要與手機手勢刪除已移除。
- CRUD 成功時直接更新清單，不跳成功彈窗。新增空白標題使用提醒彈窗，編輯空白標題在欄位下方提示；操作失敗使用錯誤彈窗，載入失敗顯示後端或連線錯誤訊息。
- `TodoListService` 已實作 HTTP CRUD，取代原本的 API stub；前端在後端確認成功後才更新 signal，不在失敗時改用 mock 資料。
- Todo 已移除 local 的 mock file replacement。`npm run local`、`npm run start` 與 `npm run build` 的 Todo 均使用 API service；`/demo` 的 local mock 切換仍保留。
- API base URL 從忽略提交的 `src/assets/api-config.json` 讀取；`isCompleted` 在 service mapper 中轉為 UI model 的 `completed`。
- 每個 Todo 請求附上 LINE ID token，UI model 已加入選填的 `createdBy`／`updatedBy`。API contract 約定後端驗證 token 後記錄 LINE 使用者 ID，所有通過同一 channel 驗證的使用者共用清單；本次未查驗後端實作或線上資料。
- API 回傳 401 時，登入服務切換為錯誤狀態；清單載入錯誤區可提供「重新登入」。重新登入不會自動重送新增、修改或刪除。
- Firebase Hosting 在 10/07 已有部署成功與手機可開啟的使用者回報，網站入口：[TODO 頁面](https://oscar-todo-list.web.app/todo-list)。10/12、10/13 的最新 API／認證提交是否已重新部署並通過線上驗收，仍待確認。
- 目前分支工作目錄乾淨，最新 API／認證提交已出現在 PR #1。PR 尚未合併、Issue #2 尚未結案，任務狀態維持 `in-progress`。
- LINE channel 的 Published 狀態及未加入 Admin／Tester 的一般使用者測試，仍待確認。

## 第二週功能需求（mock 階段）

### 主線（全部必做）

| #    | 需求         | 驗收結果                                                                                                    |
| ---- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| 主-1 | 新增待辦事項 | 輸入並送出後，mock service 建立新資料；清單立即多一筆，狀態預設未完成，且有唯一 `id` 與建立時間；輸入框清空 |
| 主-2 | 編輯待辦事項 | 可修改既有事項內容，或切換完成／未完成；清單顯示新值，原本的 `id` 與 `createdAt` 保持不變                   |
| 主-3 | 刪除待辦事項 | 指定資料從清單移除，其他資料不受影響；刪除最後一筆時顯示空狀態                                              |

清單顯示是三項操作的共同前提：初次開啟時需呈現 mock service 資料，並讓完成與未完成狀態可辨識。

### 待辦資料欄位

| 欄位        | 型別      | 必填 | 規則                                             |
| ----------- | --------- | ---- | ------------------------------------------------ |
| `id`        | `string`  | 是   | 每筆唯一；建立後不可因編輯而改變                 |
| `title`     | `string`  | 是   | 待辦內容；不得為空字串或只有空白                 |
| `completed` | `boolean` | 是   | 新增時預設 `false`                               |
| `createdAt` | `string`  | 是   | ISO 8601 建立時間；建立後不可改變                |
| `updatedAt` | `string`  | 否   | ISO 8601 最後編輯時間；新增時與 `createdAt` 相同 |
| `createdBy` | `string`  | 否   | 建立者顯示名稱；主線可留空或使用假值             |
| `updatedBy` | `string`  | 否   | 最後編輯者顯示名稱；主線可留空或使用假值         |

題目與目前 API DTO 使用 `isCompleted`，UI model 使用 `completed`；service 的 `toTodoItem()` 負責轉換。`TodoItem` 已加入選填的 `createdBy`／`updatedBy`，用於接收後端驗證後的 LINE 使用者 ID，畫面目前不顯示這兩個欄位。API 契約中的 `updatedAt` 為必填字串。

### 初始 mock 資料

第二週 mock 主線要求至少三筆穩定初始資料，至少一筆已完成。保留的 `todo-list.mock.ts` 使用下列資料；目前網站改查詢 API，不會自動載入這三筆示範資料：

| `id`       | `title`                  | `completed` |
| ---------- | ------------------------ | ----------- |
| `todo-001` | 建好 LIFF app 並跑起來   | `true`      |
| `todo-002` | 熟悉 Angular 20 專案結構 | `false`     |
| `todo-003` | 完成 TODO 清單功能驗收   | `false`     |

每筆資料都要有固定的 `createdAt` 與 `updatedAt`；不要使用隨機資料或每次載入都變動的初始值。

### Mock service 行為（早期驗收紀錄）

元件透過同一個 service 查詢與更新資料，不直接讀寫 mock 陣列。主線操作應符合下表：

| 操作 | 輸入            | Service 行為                                                                             | 可觀察結果                         |
| ---- | --------------- | ---------------------------------------------------------------------------------------- | ---------------------------------- |
| 查詢 | 無              | 回傳目前所有待辦事項                                                                     | 清單顯示所有資料及其完成狀態       |
| 新增 | `title`         | 產生唯一 `id`；設定 `createdAt`、`updatedAt`；`completed` 設為 `false`；加入並回傳新資料 | 清單增加一筆，輸入框清空           |
| 編輯 | `id` 與更新欄位 | 更新 `title` 或 `completed` 及 `updatedAt`；保留 `id`、`createdAt`                       | 目標資料更新，其他資料與總筆數不變 |
| 刪除 | `id`            | 從資料集合移除指定項目                                                                   | 目標資料消失，其他資料不變         |

邊界行為：

- 空白 `title` 不送進 service，畫面顯示提示。
- 編輯或刪除時找不到 `id`，service 必須明確回報失敗，畫面不可顯示成功。
- 資料保存在記憶體中；重新整理後回到初始三筆。

## 技術與實作條件

- 使用 Angular + LIFF；LIFF app 依訓練文件使用個人帳號建立，不使用公司站台測試。
- 畫面不要求指定稿；至少有清單、新增輸入欄位，以及每筆資料的編輯和刪除入口。
- 資料操作集中在 service，讓之後可替換為 API 實作而不必重寫元件。
- 命名、註解與排版遵循公司程式風格；不要提交 `console.log` 或 `debugger`。
- Issue、分支、PR、review、merge 與部署流程依第二週課綱及公司工程規範辦理；本文件同時記錄原始 mock 需求及後續 API 整合進度。

## 驗收條件

以下勾選記錄已完成的早期 mock 主線驗收；不代表 10/12、10/13 的 API／認證版本已完成線上驗收。最新版本的建置、測試及端到端驗收結果仍待補記。

### 功能與資料

- [x] 初次開啟時顯示 mock service 提供的待辦事項，完成與未完成狀態可辨識。
- [x] 新增後清單立即增加一筆，內容正確且預設未完成。
- [x] 編輯內容後顯示新內容，該筆 `id` 與 `createdAt` 不變。
- [x] 切換完成狀態後顯示新狀態，清單總筆數不變。
- [x] 刪除後目標資料消失，其他資料保留；空清單時顯示空狀態。
- [x] 空白內容無法送出；新增時以彈窗提醒，編輯時在欄位下方提示。
- [x] 編輯／刪除不存在的 `id` 時，不會呈現成功結果。
- [x] mock 主線的資料操作均透過 mock service，元件不直接維護資料陣列；目前資料異動已改由 API service 執行。

### 結構與範圍

- [x] 更換 service 內部資料來源時，畫面元件不需跟著修改。
- [x] 主-1、主-2、主-3 全部完成才算主線通過。
- [x] 支線未完成不影響主線通過；主線可獨立操作與驗收。

### 開發流程

Issue、PR 實際 review 往返、merge 後關閉 Issue，以及任務連結要求，依[第二週：LIFF 前端與 Mock 資料](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/week-2-liff-mock.md)的驗收點辦理。分支、PR、review 與 API 規範見需求來源的相關文件。

## 程式碼閱讀入口

以下路徑均相對於 `Oscar-liff-demo` repo 根目錄。

| 功能                 | 檔案                                                                       | 要看的地方                                                                                                     |
| -------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 畫面與事件綁定       | `src/app/features/todo-list/todo-list.component.html`                      | `[formGroup]`、`formControlName`、`(ngSubmit)`、`(click)` 與 `@if`／`@for`                                     |
| 表單與 CRUD 操作     | `src/app/features/todo-list/todo-list.component.ts`                        | `addTodo()`、`startEditing()`、`saveEdit()`、`toggleCompletion()`、`deleteTodo()`；呼叫 service 後更新畫面狀態 |
| 頁面樣式             | `src/app/features/todo-list/todo-list.component.scss`                      | 黑白灰主題、待辦列排版、編輯／刪除按鈕與手機版樣式                                                             |
| 早期 mock 資料操作   | `src/app/features/todo-list/todo-list.mock.service.ts`                     | 保留給既有測試與閱讀；目前 Todo 網站執行時不使用                                                               |
| API CRUD 與欄位轉換  | `src/app/features/todo-list/todo-list.service.ts`                          | `HttpClient` 呼叫 GET／POST／PATCH／DELETE，附上認證 header；`toTodoItem()` 轉換欄位，成功後更新 signal        |
| API 網址設定         | `src/app/core/config/api-config.service.ts`                                | 讀取 `/assets/api-config.json`、檢查 HTTPS 網址並快取；讀取失敗時允許重試                                      |
| 共用契約與資料欄位   | `todo-list.service.interface.ts`、`todo-list.models.ts`（同 feature 目錄） | service 的 public methods 與 `TodoItem` 型別                                                                   |
| 提醒與錯誤彈窗       | `src/app/features/todo-list/todo-feedback-dialog.component.ts`             | `MatDialog` 顯示的內容與關閉按鈕                                                                               |
| LIFF 登入與 API 憑證 | `src/app/core/auth/liff-auth.service.ts`                                   | `initialize()` 初始化登入，`getIdToken()` 取得 ID token，`requireLogin()`／`relogin()` 處理憑證失效            |
| 啟動時初始化登入     | `src/app/app.config.ts`                                                    | `provideAppInitializer()` 在應用程式啟動時呼叫登入服務                                                         |
| 執行模式             | `angular.json`                                                             | Todo 的 mock replacement 已移除；`/demo` 仍保留 local mock replacement                                         |
| 程式流程圖與介紹     | `docs/onboarding/todo-list-code-walkthrough.md`                            | HTML → component → API → Firestore 的說明、Network 練習及 401 重新登入流程                                     |
| API 交接文件         | `docs/tech/api-contract.md`                                                | 待辦欄位、操作契約及 UI 狀態對照                                                                               |

## LIFF 登入與 Hosting 更新方式

登入流程：

1. Angular 啟動時，`provideAppInitializer()` 呼叫 `LiffAuthService.initialize()`。
2. 服務讀取 `/assets/liff-config.json` 的 LIFF ID，再呼叫 `liff.init()`。
3. 外部瀏覽器尚未登入時，透過 `liff.login()` 導向 LINE 登入。
4. 已登入時，透過 `liff.getProfile()` 取得暱稱並更新登入狀態 signal。
5. TODO 頁面的 HTML 讀取這些 signal，顯示登入結果。
6. Todo API 每次請求前透過 `getIdToken()` 取得 `liff.getIDToken()`，附在 `Authorization: Bearer <LINE ID token>` header；缺少 token 時停止送出。
7. 後端回傳 401 時，service 呼叫 `requireLogin()`；清單載入錯誤區顯示重新登入入口，component 的 `retryLogin()` 呼叫 `relogin()`。外部瀏覽器先登出再登入，LINE 內重新開啟 LIFF URL。

LIFF 現在需要 `openid` scope 以取得 ID token，後端需設定對應的 `LINE_LOGIN_CHANNEL_ID`；token 不寫入設定檔或 Todo 資料。

`src/assets/liff-config.json` 與 `src/assets/api-config.json` 均已加入 `.gitignore`。部署環境需要提供兩份檔案，建置時會複製到網站資源；內容會被瀏覽器讀取，不放密鑰或 token。

API 設定可由 `src/assets/api-config.example.json` 複製建立，`apiBaseUrl` 填入 Cloud Run HTTPS 網址並包含 `/api` 前綴，service 會接上 `/todos`。

LINE Login channel 保持 Developing 時，只有該 channel 的 Admin 或 Tester 可以登入測試；若要讓一般使用者使用，需要改為 Published。Published 無法改回 Developing。使用者目前已能在手機開啟，公開發布狀態與其他帳號測試仍待確認。[LINE 官方發布說明](https://developers.line.biz/en/docs/line-login/getting-started/)

對外分享 LIFF 分頁提供的 `https://liff.line.me/{LIFF_ID}`。使用者開啟後，LIFF 會導向設定的 Endpoint URL；第一次使用可能需要登入與授權。[LIFF 官方網址說明](https://developers.line.biz/en/docs/liff/registering-liff-apps/)

Firebase Hosting 的 `public` 設為 `dist/eng-onboarding-assignment/browser`，並將路由導回 `index.html`。修改程式後，先建置，再部署到自己的 Firebase 專案。執行前把 `YOUR_FIREBASE_PROJECT_ID` 換成自己的 project id：

```sh
npm run build
firebase deploy --only hosting --project YOUR_FIREBASE_PROJECT_ID
```

Published 只改變 LINE channel 的存取範圍，不會更新網站程式。Repo 現有 GitHub Actions 是推送指定 tag 後部署至 Cloud Run，目前 repo 內沒有 Firebase Hosting 自動部署流程。

加入 ID token 認證後，應先確認後端的 channel 設定與驗證功能已部署，再部署最新前端。只有提交或推送程式碼，不代表 Firebase Hosting 或 Todo 後端已更新。

## 下一步與待確認事項

- [x] 加入 LIFF SDK、啟動初始化與登入狀態／暱稱顯示。
- [x] 10/07 使用者提供 production build 與 Firebase Hosting 部署成功輸出，並回報手機已可開啟畫面。
- [x] 10/12 前端已實作 Todo API CRUD、網址設定、欄位轉換與錯誤處理，並移除 Todo 的 mock replacement。
- [x] 10/13 前端已實作 LINE ID token header、身分欄位接收、401 狀態與重新登入處理。
- [x] README、程式碼導覽與 API contract 已更新 API／認證資料流說明。
- [x] 最新 API／認證提交已推送至 PR #1；本機工作目錄乾淨。
- [ ] 確認 LINE Login channel 為 Published，並讓未加入 Admin／Tester 的帳號透過 LIFF URL 登入測試。
- [ ] 確認 LIFF 啟用 `openid`，後端設定正確的 `LINE_LOGIN_CHANNEL_ID`，且最新後端與前端均已部署。
- [ ] 以最新版本驗收 CRUD：新增、編輯、完成狀態、刪除與空清單；重新整理後資料仍由 API 載入，不回到初始 mock。
- [ ] 核對後端驗證後記錄的 `createdBy`／`updatedBy`：修改保留建立者、更新修改者；不同登入者可操作同一團隊清單。
- [ ] 驗收外部瀏覽器／LINE 內的登入與 401 重新登入；確認登入後不自動重送失敗的寫入操作。
- [ ] 補記最新版本的 local／production build、相關測試與 Network 請求驗收結果；過去 mock 測試不能取代這次 API 驗收。
- [ ] 對齊 OpenSpec 的早期 mock 規格、已移除的手機手勢及最新 API 實作；`todo-list-simple-delete-action/tasks.md` 仍未勾選，不能僅依目前程式碼直接標記驗收完成。
- [ ] 完成 PR #1 的 review 與合併，確認 Issue #2 結案；兩者在 10/14 查詢時仍為 Open。

本次只核對前端程式、文件、提交及 GitHub PR／Issue 狀態，未重新建置、執行測試、部署，或直接驗證後端／Firestore。

## 支線（非主線通過條件）

主線完成後，可逐項另開 Issue 延伸：

1. 以真正的 RESTful API 取代 mock service。
2. 實作具基本 CRUD 功能的 RESTful API。
3. 新增待辦時以 webhook 推播新增紀錄。
4. 待辦完成時以 webhook 推播完成紀錄。
5. 首次進入時詢問並記錄使用者身分。
6. 新增、修改時記錄操作者身分（依賴支-5）。
7. 討論刪除操作是否也要記錄操作者；可提交設計討論或 Issue，不一定要實作。

支線 1、2 是第三週主題，目前前端已完成 REST API 串接；後端功能與持久化驗收需另外核對。身分來源已採 LINE ID token：前端傳送憑證，API contract 約定由後端驗證並記錄 LINE 使用者 ID。這不包含支-5 的「首次詢問身分」表單。支-6 的前端憑證與資料欄位已具備，後端實際身分記錄仍待驗收；webhook 推播與刪除稽核尚未在本次前端核對範圍內確認。

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

### 2026-10-12

- 提交 [`356ec02`](https://github.com/Aiii-Developers/Oscar-liff-demo/commit/356ec02)：前端串接 Cloud Run Todo API，取代原 API stub，實作 GET／POST／PATCH／DELETE 與 signal 更新。
- 新增 `ApiConfigService` 與 API 設定範本，將實際 base URL 放在忽略提交的設定檔；service 將 API 的 `isCompleted` 轉成 UI 的 `completed`。
- 移除 Todo 的 local mock replacement，所有網站執行模式均使用 API service；保留 mock 檔案供閱讀與既有測試使用。
- README、API contract 與程式碼導覽已同步 API 資料流；本紀錄依提交整理，不代表已確認線上部署與 CRUD 驗收。

### 2026-10-13

- 提交 [`93c95ee`](https://github.com/Aiii-Developers/Oscar-liff-demo/commit/93c95ee)：每個 Todo 請求附上 LINE ID token，加入 `getIdToken()`、401 登入錯誤狀態與重新登入處理。
- `TodoItem` 加入 `createdBy`／`updatedBy`；API contract 約定後端驗證身分後記錄操作者，同一 channel 的登入者共用清單。
- 清單載入成功前停用新增，避免載入結果覆蓋新資料；載入失敗時顯示可讀錯誤。
- 本紀錄依前端程式及文件整理，後端 token 驗證、身分記錄與部署結果仍需實際驗收。

### 2026-10-14

- 重新核對 repo、提交紀錄與 GitHub：目前分支為 `feature/todo-list-liff`，工作目錄乾淨；PR #1 已包含 `7d0ef0e`、`356ec02` 與 `93c95ee`。
- PR #1 為 Open、非 draft、尚未合併，GitHub 正式 review 紀錄為空；關聯 Issue #2 仍為 Open。
- 更新筆記中「API 尚未實作」「local 使用 mock」「身分欄位尚未加入」等過時描述，保留第二週 mock 主線與後續 API 整合的階段紀錄。
- 未重新執行建置或測試，未進行部署或變更 repo 程式碼；最新線上版本、Published 狀態及一般帳號／API 端到端驗收仍待確認。

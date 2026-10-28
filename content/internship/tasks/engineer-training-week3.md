---
title: 工程師訓練第三週：Todo API 與測試環境部署
status: in-progress
start_date: 2026-10-07
tags:
  - 實習
  - 任務
  - API
  - Firestore
  - Cloud-Run
  - Angular
  - LIFF
---

# 工程師訓練第三週：Todo API 與測試環境部署

## 任務目標與依據

把第二週的 Todo Mock 換成真正的 API；後端用 Elysia/Bun 操作 Firestore，前端用 Angular + LIFF 呼叫 API，並用 `s*` tag 部署到自己的 GCP 專案。除了功能可用，也要能從瀏覽器 Network 指出每個請求，並說明從畫面到資料庫、再回到畫面的程式流程。

這是教育訓練練習，不是上線產品或客戶專案。依據：[第三週課綱](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/week-3-api-deploy.md)、[Todo 題目](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/training-assignment.md)、[三週實作流程](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/how-it-runs.md)。這些 wiki 頁面目前是 `draft`、有 AI `generated` 標記；2026-10-13 的課綱已把資料層改為 Firestore，並要求部署到受訓者私人 GCP 專案。

## 專案實作與部署快照（2026-10-14）

| 項目     | 目前狀態                                                                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 後端     | [Oscar-api-demo](https://github.com/Aiii-Developers/Oscar-api-demo) 的 `feat/todo-list-api` 已實作 `GET`、`POST`、`PATCH`、`DELETE /api/todos`，Todo 資料存在 Firestore `todos` collection。 |
| 前端     | [Oscar-liff-demo](https://github.com/Aiii-Developers/Oscar-liff-demo) 的 Todo service 已用 `HttpClient` 呼叫 API，請求附上 LINE ID token；Todo 畫面執行時不再切換到 Mock。                   |
| 前端網站 | [Firebase Hosting Todo 頁面](https://oscar-todo-list.web.app/todo-list)。使用者先前回報 LINE 重新登入成功；本次文件更新未重新做瀏覽器端完整 CRUD 驗收。                                      |
| 後端部署 | `s0.1.2` 已部署至個人 GCP 專案 `oscar-todo-list`、`asia-east1` 的 Cloud Run 服務 `oscar-todo-api`。最新就緒 revision `oscar-todo-api-00004-pf7` 承接 100% 流量。                             |
| API 網址 | `https://oscar-todo-api-by6af26kva-de.a.run.app/api`                                                                                                                                         |
| 流程     | stage 分支已建立並下 `s0.1.2` tag；這次部署設定是直接推到 stage，沒有 stage PR。後端 main PR #2 仍是 draft，前端 main PR #1 仍開啟。                                                         |

### 已確認的部署證據

- [GitHub Actions：`s0.1.2`](https://github.com/Aiii-Developers/Oscar-api-demo/actions/runs/38365016302) 第 3 次執行成功：建置 image、推送 Artifact Registry、部署 Cloud Run 都通過。
- Cloud Run 顯示使用 `asia-east1-docker.pkg.dev/oscar-todo-list/cloud-run-source-deploy/oscar-todo-api:s0.1.2`，流量 100% 指向上述 revision。
- 實際呼叫 `GET /api/` 回 `200 OK`；不帶 LINE token 呼叫 `GET /api/todos` 回 `401`、`AUTH_001`、`請先登入 LINE。`。健康端點只證明服務有回應，不證明 Firestore 讀寫成功。
- 2026-10-12 曾在本機操作 Firestore Todo；使用者提供的新增與修改結果顯示 `id` 不變、`createdAt` 不變、`isCompleted` 與 `updatedAt` 已更新。部署後帶有效 LINE token 的 CRUD 尚未在此紀錄完整驗證。

## 實際資料與 API 設計

後端的 `src/models/todo.ts` 定義 Todo 型別；`src/services/firestore.ts` 使用 Firestore 預設資料庫的 `todos` collection，每筆文件的 **document ID 等於 Todo 的 `id`**。Todo 新增時由後端產生 UUID 與 ISO 8601 時間；修改只動指定欄位、`updatedAt`、`updatedBy`，保留 `id`、`createdAt`、`createdBy`。

| 欄位                     | 目前規則                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| `id`                     | 後端產生的唯一字串；建立後不變。                                                                |
| `title`                  | 必填；前後空白會去除，不接受空白標題。                                                          |
| `isCompleted`            | boolean；新增時預設 `false`。前端畫面模型叫 `completed`，由 service 轉換。                      |
| `createdAt`、`updatedAt` | ISO 8601；新增時相同，修改時只更新 `updatedAt`。                                                |
| `createdBy`、`updatedBy` | 型別維持選填以容納舊資料；現在的新增會填入後端驗證過的 LINE 使用者 ID，修改會更新 `updatedBy`。 |

| 方法與路徑              | Request body                                         | 成功回應      |
| ----------------------- | ---------------------------------------------------- | ------------- |
| `GET /api/todos`        | 無                                                   | Todo 陣列     |
| `POST /api/todos`       | `{ "title": "內容" }`                                | 新增的 Todo   |
| `PATCH /api/todos/:id`  | `{ "title": "新內容" }` 或 `{ "isCompleted": true }` | 修改後的 Todo |
| `DELETE /api/todos/:id` | 無                                                   | `{}`          |

四個路由都要求 `Authorization: Bearer <LINE ID token>`。後端向 LINE 驗證 token 和 Channel ID，再取得使用者 ID；沒有 token 的請求會在讀寫 Firestore 前被拒絕。OpenAPI 在 `public/openapi.yaml`，前端契約在 `Oscar-liff-demo/docs/tech/api-contract.md`。

## 程式閱讀路線

| 步驟             | 檔案與要看的函式                                                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 使用者按鈕／表單 | 前端 `todo-list.component.html` 的事件綁定，接到 `todo-list.component.ts` 的 `addTodo()`、`saveEdit()`、`toggleCompletion()`、`deleteTodo()`。                             |
| 前端發送請求     | 前端 `todo-list.service.ts` 的 `loadTodos()`、`addTodo()`、`updateTodo()`、`deleteTodo()`；`getAuthHeaders()` 加 LINE token，`getTodosUrl()` 組網址。                      |
| 後端收請求       | 後端 `src/index.ts` 的 Todo 路由先呼叫 `requireLineUser()`，再呼叫 `src/functions/todo.ts`。                                                                               |
| 資料庫           | `src/services/firestore.ts` 的 `findTodos()`、`insertTodo()`、`updateTodoById()`、`deleteTodoById()`；修改和刪除使用 transaction。                                         |
| 回應與畫面       | 後端 `src/plugins/error-handler.ts` 轉換錯誤；前端 `sendRequest()` 處理 HTTP 失敗，`toTodoItem()` 將 `isCompleted` 轉成 `completed`，更新 `todosState` signal 後畫面重繪。 |

練習說明新增的完整路徑：在輸入框打標題並送出 → component `addTodo()` → service `addTodo()` 發 `POST /api/todos` → `src/index.ts` 驗證 LINE token → `createTodo()` 產生 ID、時間與操作者 → Firestore `insertTodo()` 寫入 `todos/{id}` → API 回傳 Todo → service 更新 signal → Angular 清單多一筆。每個 `if` 都要能指出它擋掉什麼情況，以及失敗時為何不更新畫面。

## 部署經過與目前設定

1. `s0.1.0` 使用舊範本 workflow，Docker 建置失敗：`Dockerfile.development` 要複製不存在的 `bun.lock`，`.npmrc` 也不在 Docker build context。
2. 更新 workflow，改用目前的 `Dockerfile`、`bun.lockb`、個人專案的 Artifact Registry 和 `oscar-todo-api` 服務。`s0.1.1` 成功建置，但 image 上傳被拒絕。
3. `s0.1.2` 確認既有 GitHub Secret 使用 `github-action-ci-cd@aiii-developer.iam.gserviceaccount.com`。先在個人專案的單一 Artifact Registry 儲存庫授予 Writer；重跑後發現 Cloud Run 權限不足，再在單一 Cloud Run 服務授予 Developer、在執行帳號授予 Service Account User。第 3 次執行完成部署。

**部署憑證仍需調整。** 現行 workflow 借用公司的 `GCP_SA_GKE_KEY_AIII_DEVELOPER` Secret，讓公司部署帳號跨專案部署到個人 GCP。這能跑通，但與 2026-10-13 [第三週課綱](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/week-3-api-deploy.md)要求「在自己的私人專案建立部署服務帳號與金鑰」不同。後續應換成個人專案專用的部署身分與 GitHub Secret，並撤銷目前授給公司帳號的三處 IAM binding。金鑰內容不可放入本文件、repo 或聊天。

此外，`package.json` 的名稱、`config.stageImage` 與手動部署 scripts 仍沿用範本；目前成功的是 GitHub Actions workflow，不能把舊的手動指令當作已驗證的部署方式。

## 完成勾選與佐證狀態

以下保留原筆記的完成勾選。前文是 2026-10-14 的部署快照；後續勾選未附完成日期、實測輸出或 PR 合併紀錄，因此不能由勾選反推每項驗收的實際結果。文件中的 `in-progress` 表示驗收紀錄仍待收斂，功能開發是否完成應與個人交接範圍分開閱讀。

- [x] 後端有 Todo CRUD 路由、欄位驗證、Firestore `todos` 讀寫程式與 OpenAPI。
- [x] 前端 Todo service 改呼叫 API，所有執行模式的 Todo 都不使用 Mock file replacement；Mock 檔案只供閱讀與既有測試。
- [x] `s0.1.2` 部署至自己的 Cloud Run，確認最新 revision 承接 100% 流量且 `GET /api/` 回 `200`。
- [x] 不帶 LINE token 的 Todo 請求回 `401`，不會匿名讀取資料。
- [x] 在已部署的 LIFF 網頁，以有效 LINE 登入實際完成新增、查詢、修改、刪除；重新整理後確認資料仍從 Firestore 讀回，並記錄結果。
- [x] 在 DevTools Network 記下「新增」請求的 URL、method、request body、response body、status；其餘三種操作也能指出對應請求。
- [x] 用自己的話說明每個操作對應的前端 function、後端 route/function、Firestore 操作、錯誤分支與 signal 更新。
- [x] 改用私人專案的部署身分與 Secret，撤銷公司部署帳號在個人專案上的授權；確認私人 Gmail 下的帳單、預算與警示設定。
- [x] 完成 stage 與 main 各自的 PR、review、merge 流程；只在允許的分支下 tag。

### Network 實測佐證（尚未補錄）

上方已勾選完成 Network 檢查，但本表沒有保留實際結果。待補當時的紀錄；若已無法取得，註明「未保留」，不補造 request、response 或 status。

| 操作 | URL 與 method                                                         | Request body   | Status 與 response |
| ---- | --------------------------------------------------------------------- | -------------- | ------------------ |
| 查詢 | `GET https://oscar-todo-api-by6af26kva-de.a.run.app/api/todos`        | 無             | 待從 Network 記錄  |
| 新增 | `POST https://oscar-todo-api-by6af26kva-de.a.run.app/api/todos`       | 待記錄實際標題 | 待從 Network 記錄  |
| 修改 | `PATCH https://oscar-todo-api-by6af26kva-de.a.run.app/api/todos/:id`  | 待記錄實際欄位 | 待從 Network 記錄  |
| 刪除 | `DELETE https://oscar-todo-api-by6af26kva-de.a.run.app/api/todos/:id` | 無             | 待從 Network 記錄  |

不要在截圖或筆記中貼完整的 `Authorization` token。卡住超過 30 分鐘就回報做到哪裡、看到什麼錯誤、已試過什麼。

## Issue、PR 與收尾紀錄（2026-10-14 快照）

- [後端 Issue #1](https://github.com/Aiii-Developers/Oscar-api-demo/issues/1) 仍開啟，標題還寫 MongoDB；應更新為已採用 Firestore 的實際範圍。
- [後端 PR #2](https://github.com/Aiii-Developers/Oscar-api-demo/pull/2) 指向 main，目前是 draft；已請求 reviewer，但截至 2026-10-14 尚無提交的 review。
- [前端 PR #1](https://github.com/Aiii-Developers/Oscar-liff-demo/pull/1) 指向 main，已請求 reviewer，但截至 2026-10-14 尚無提交的 review。
- stage 分支 `stage/s0.0.0` 已有 `s0.1.2`，但這次是直接推送，沒有 stage PR；課綱要求的 stage PR 流程尚未完成。

當時規劃的收尾順序是 LIFF 登入後的部署版 CRUD 與 Network 紀錄、個人部署憑證、範本殘留與 PR review。後續完成勾選已保留，但仍需補記實際驗收、身分調整與合併日期。訓練收尾依[第三週課綱的收尾順序](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/week-3-api-deploy.md)停用帳單、清理專案與金鑰。

## Progress

### 2026-10-07

- 建立第三週任務紀錄，盤點當時的 Elysia 範本、MongoDB 範例與前端 Mock。這是當日狀態，後續已改用 Firestore。

### 2026-10-12 至 2026-10-13

- 實作 Firestore Todo CRUD、LINE ID token 驗證與操作者欄位；前端改接 API，使用者回報重新登入成功。
- 更新 stage workflow，推送 `s0.1.1`、`s0.1.2`。處理 Artifact Registry 與 Cloud Run 權限後，`s0.1.2` 的第 3 次 Actions 執行成功。

### 2026-10-14

- 重新核對程式碼、PR 狀態與 Cloud Run：`s0.1.2` 仍是最新就緒 revision，承接 100% 流量；本文件更新為實際現況與待驗收項目。

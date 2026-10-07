---
title: 工程師訓練第三週：Todo API 與測試環境部署
status: in-progress
start_date: 2026-10-07
tags:
  - 實習
  - 任務
  - API
  - MongoDB
  - Cloud Run
  - Angular
  - LIFF
---

# 工程師訓練第三週：Todo API 與測試環境部署

## 任務目標

承接第二週的團隊 TODO LIST 練習，在 API repo 實作待辦事項 CRUD，部署至測試環境 Cloud Run，讓前端透過 API 操作資料。開發時同步練習讀取瀏覽器 Network request，並能用自己的話說明從畫面操作、HTTP 呼叫、後端處理、資料庫異動到畫面更新的完整流程。

這是教育訓練練習，不是上線產品規格，也不對應客戶專案。

## 專案資訊

- API repo：/Users/oscar/Documents/Oscar-api-demo
- 前端 repo：/Users/oscar/Documents/Oscar-liff-demo
- 第三週課綱：[第三週：API 開發與部署](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/week-3-api-deploy.md)
- 題目規格：[練習題：團隊 TODO LIST 機器人](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/training-assignment.md)
- 流程說明：[三週實作制怎麼跑](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/how-it-runs.md)
- API 慣例：[API 回應與錯誤處理慣例](https://github.com/Aiii-Developers/aiii-wiki/blob/main/engineering/standards/api-response-and-error-convention.md)

兩份訓練文件目前都標示 draft；第三週課綱也註明內容尚未經人工查證。若課綱與訓練 repo 的實際設定不同，先在 Issue 或訓練會議確認，不自行補定未決規格。

## 範圍與非目標

| 項目 | 本週範圍 |
| --- | --- |
| 後端 API | 使用 Elysia/Bun 實作 Todo 的查詢、新增、修改與刪除 |
| 資料庫 | 使用 MongoDB；MongoDB 連線資訊由負責人提供並安全注入 |
| 前端 | 改由前端呼叫已部署的 API，操作結果由 API 回應 |
| 部署 | 只部署到測試環境 Cloud Run；不碰正式環境 |
| 學習驗收 | 使用 DevTools Network 說明 API request/response，並能解釋程式流程 |

Webhook、LINE Bot 對話、身分稽核、多團隊隔離、搜尋、排序、分頁、標籤與期限不屬於本週必要範圍。需要延伸時另開 Issue。

本週前端操作以 API 作為實際資料來源，不做 Mock 與 API 雙寫。題目 PRD 另要求完成支線時仍能獨立驗收 Mock 主線；是否保留單獨的 local Mock 驗收模式，需先向任務負責人確認，再決定是否移除現有 Mock service 與 file replacement。

## Todo 資料規格

欄位依題目 PRD：

| 欄位 | 型別 | 規則 |
| --- | --- | --- |
| id | string | 每筆唯一；建立後不可因編輯而改變 |
| title | string | 必填；不得為空字串或只有空白 |
| isCompleted | boolean | 新增時預設 false |
| createdAt | string | ISO 8601；建立後不可因編輯而改變 |
| updatedAt | string | ISO 8601；新增時與 createdAt 相同，修改時更新 |
| createdBy | string | 選填；真實身分紀錄屬後續支線 |
| updatedBy | string | 選填；真實身分紀錄屬後續支線 |

API endpoint、request/response DTO、資料庫 collection 名稱、認證方式與錯誤格式尚待和 SE 確認。確認後同步更新前端的 docs/tech/api-contract.md 與 API 的 public/openapi.yaml，不將 TBD 自行寫成正式契約。

## 目前程式狀態（2026-10-07）

### API repo

- src/index.ts 仍註冊範例 GET /hello 和 POST /user/:id，base path 是 /demo，尚無 Todo CRUD。
- src/services/mongodb.ts 使用範例資料庫 sample_mflix/users；src/functions/user.ts 同時呼叫 MongoDB 與 Firestore 範例。
- public/openapi.yaml 描述範例 User API，且與目前實際路由方法不一致。
- package.json 的套件及映像名稱仍是 template-api-elysia。
- .github/workflows/deploy-to-stage-on-push-tag.yml 會由 s* tag 觸發，但目前仍部署範例服務與映像；GitHub Environment 名稱為 production，部署命令未看到 MONGODB_URI 的 runtime 注入。
- 第三週課綱記載 template-api-elysia 的 Actions 尚無執行紀錄，因此不能把範本 workflow 當成已驗證部署流程。

### 前端 repo

- src/app/features/todo-list/todo-list.mock.service.ts 已有 in-memory CRUD、初始三筆資料、空白標題拒絕及不存在 id 回報失敗。
- angular.json 的 local configuration 以 file replacement 使用 Mock service；目前 API service 尚未串接，方法會回報 TODO(api) 錯誤。
- docs/tech/api-contract.md 中 Todo endpoints 與 API 欄位仍為 TBD。
- TodoItem model 使用 completed；題目 PRD 使用 isCompleted。開始串接前，先把前端模型與 API 契約對齊，或明確記錄 service mapper 如何轉換。

以上是程式碼盤點，尚不代表已完成第三週 API、部署或瀏覽器 Network 驗收。

## 工作順序

### 1. 立即確認前置與未定事項

先向 SE／運維確認負責人與提供時間；缺少的設定不可猜測或自行尋找替代值。

| 待確認項目 | 要確認的內容 |
| --- | --- |
| 訓練 repo | Oscar-api-demo 與 Oscar-liff-demo 是否就是本梯實際訓練 repo，或需改在 SE 建立的 private training repo 作業 |
| API 契約 | endpoint、HTTP method、DTO 欄位、成功回應、錯誤狀態碼及錯誤格式 |
| 認證與 CORS | 前端如何呼叫 API；不可把共享 API key 寫入瀏覽器程式 |
| MongoDB | MongoDB URI 由誰提供、collection/schema 如何命名，以及 Cloud Run 如何安全取得連線資訊 |
| GCP 部署 | 測試 Cloud Run service、project、service account、GitHub secrets 與 workflow 的負責人 |
| Workflow | 請 SE 先在訓練 repo 跑通 stage workflow，確認實際部署目標與 runtime 設定 |
| 分支流程 | 第三週課綱寫 main 與 stage 各開 PR；分支與 PR 規範寫 PR 只開往預設分支、進 stage 直接合併。請 SE 指定訓練 repo 採用哪一套 |
| Mock 驗收 | 題目 PRD 要求完成支線後仍可獨立驗收 Mock；本任務要求前端用 API、不做 Mock/API 雙寫。確認是否保留獨立 local Mock 模式 |

MONGODB_URI、服務帳號金鑰與其他部署憑證只由負責人放入核准的 secrets/runtime 設定，不提交到 repo、不貼在 Issue、PR 或聊天訊息。執行部署前依課綱再與 CTO 對一次。

### 2. 實作後端 CRUD

1. 先建立符合 Todo 規格的型別、驗證與資料庫操作，再替換範例路由。
2. 提供查詢清單、新增、更新標題或完成狀態、刪除等操作；路徑與 method 依已確認的 API 契約實作。
3. 新增時產生唯一 id；設定 isCompleted=false，createdAt 與 updatedAt 為當下 ISO 8601 時間。
4. 修改時只更新指定欄位與 updatedAt，保留原 id 及 createdAt。
5. 空白 title 回報驗證錯誤；找不到 id 的修改或刪除回報明確錯誤，不回報成功。
6. 使用 MongoDB；移除 Todo API 路徑上的範例 User、sample_mflix 與 Firestore 邏輯。
7. 更新 OpenAPI 文件，記錄 request、response、狀態碼與錯誤情境。

### 3. 前端改接 API

- 依確認後的契約實作 TodoListService，使用 Angular HttpClient 呼叫 API。
- API 回應轉成前端共用 Todo model；如果 API 欄位與 UI 欄位不同，在 service mapper 轉換。
- API 回應成功後，以回傳資料更新 signal，讓畫面反映伺服器結果；失敗時保留目前畫面資料並顯示錯誤。
- 不在前端存放共享密鑰或 MongoDB 連線字串。
- 確認畫面只有一個作用中的資料來源，不對 Mock 與 API 同時送出同一操作。
- 每完成一種操作就同步更新 docs/tech/api-contract.md 與程式導覽，不把 Network 與程式解說留到最後。

### 4. 部署至測試環境並驗 runtime

- 等 SE 確認 service、workflow、secrets 與 MongoDB runtime 設定已就緒，再部署。
- 使用課綱要求的 stage tag 流程；tag 只能放在核准的分支，僅部署測試環境，不建立或推送正式 v* tag。
- Actions 成功後確認 Cloud Run 實際接收流量的 revision 是本次部署版本。
- 對部署後的 API 實際呼叫查詢、新增、修改、刪除；記錄 URL、method、狀態碼及回應，確認資料真的寫入並可讀回。
- 只看到 workflow 綠燈不算完成。

## 邊做邊練：Network 與程式解說

每一種畫面操作完成後就立刻練習，不等到最後一天。至少記錄新增操作；查詢、修改、刪除也要能指出各自的 request。

| 操作 | 前端入口 | Network 要指出的內容 |
| --- | --- | --- |
| 查詢 | component 載入時的 loadTodos() | request URL、method、response status 與清單 response |
| 新增 | HTML submit → component addTodo() → service addTodo() | URL、method、送出的 JSON、status、回應中的 Todo |
| 編輯標題 | component saveEdit() → service updateTodoTitle() | URL、method、更新欄位、status、更新後資料 |
| 切換完成 | component toggleCompletion() → service setTodoCompleted() | URL、method、完成狀態欄位、status、回應值 |
| 刪除 | component deleteTodo() → service deleteTodo() | URL、method、status、response body |

每次在瀏覽器 DevTools 的 Network 選取實際 request，並用自己的話回答：

- Request URL 是什麼？包含哪些 path 或 query？
- HTTP method 是什麼？為什麼該操作使用這個 method？
- Request body／headers 傳了什麼？
- Response status 和 response body 是什麼？
- 前端在哪個函式處理成功或失敗回應？
- 後端哪個 route／handler 收到請求？它呼叫哪個 MongoDB 操作？

可在此記錄新增操作的實測結果：

| 欄位 | 實測值 |
| --- | --- |
| URL | 待填 |
| Method | 待填 |
| Request body | 待填 |
| Status | 待填 |
| Response body | 待填 |

## 程式閱讀與口頭說明

對新增、查詢、修改、刪除逐一從畫面追到資料庫，再追回血統更新。每個操作都能在 codebase 找到實際 function；每個 if、錯誤分支與 signal 更新都要說明判斷原因。

預期流程如下，實際函式名稱以實作完成後的程式為準：

1. 使用者在 todo-list.component.html 按下按鈕或送出表單。
2. Angular event 綁定呼叫 todo-list.component.ts 對應方法，例如 addTodo()、saveEdit()、toggleCompletion() 或 deleteTodo()。
3. component 呼叫 TodoListService 的語意化方法，不直接修改資料陣列或呼叫資料庫。
4. service 使用 HttpClient 發出 request，處理 DTO 轉換及錯誤。
5. Elysia route 驗證 request，呼叫 Todo handler/service。
6. 後端透過 MongoDB service 讀寫指定 collection。
7. 後端回傳成功資料或標準錯誤；前端 service 轉成 UI model。
8. component/service 更新 signal；Angular template 讀取新值並重新呈現清單。

練習方式：先自己讀函式與呼叫點，再請 AI 解釋不懂的部分；關掉說明後，用自己的話重新講一次，並指出對應的檔案與 function。若仍找不到資料流或不理解某個 if/signal，就先記下問題並詢問，不把未理解的程式當成完成。

## Issue、分支、PR 與 review

- API 後端 CRUD、前端 API 串接、部署驗收各自有清楚的 Issue；支線工作依題目要求分開追蹤。
- 依核准的 repo 分支流程建立 feature branch，不直接改推 main 或 stage。
- PR 描述包含任務連結、目的、變更內容、驗證方式、變更檔案與預期結果。
- PR 必須有 reviewer 並完成實際 review 往返；merge 時關閉對應 Issue。
- 使用者指出 PR #1 目前沒有 reviewer；需確認 repo 與 PR URL 後補上 reviewer，並把 review 結果記入任務進度。
- 每次 commit 前先檢查 git status，只 stage 本任務檔案；不要使用 git add -A。

## 驗收條件

### 後端與前端整合

- [ ] API 查詢、新增、修改、刪除皆按已確認契約運作。
- [ ] 新增 Todo 的資料符合欄位規格；isCompleted 預設 false。
- [ ] 修改不改變 id 與 createdAt，會更新 updatedAt。
- [ ] 空白 title 與不存在 id 有明確錯誤回應。
- [ ] 前端呼叫 API 並依 API 回應更新畫面；同一操作不雙寫 Mock 與 API。
- [ ] 重新載入後資料由 API／MongoDB 讀回，而非仰賴前端記憶體陣列。

### 部署與 Network

- [ ] SE 確認測試環境 Cloud Run、service account、secrets、MongoDB runtime 連線與 workflow 已備妥。
- [ ] stage workflow 執行完成，Cloud Run revision 確認為本次版本。
- [ ] 部署後實際 CRUD request 成功，記錄 Network 的 URL、method、body、status 與 response。
- [ ] 未對正式環境部署。

### 學習與流程

- [ ] 每種 UI 操作都能找到並解釋從 event handler 到 MongoDB 再回到 signal/template 的流程。
- [ ] 能說明主要 if 判斷、驗證與錯誤分支的用途。
- [ ] 使用者能在 DevTools Network 指認新增 request 的 URL、method、內容、response 與 status。
- [ ] Issue、分支、PR、review、merge 與 Issue 結案依核准流程完成；PR #1 已加入 reviewer。

## 目前阻塞與需立即確認

| 項目 | 目前狀態 | 要詢問 |
| --- | --- | --- |
| API 路徑、DTO、auth、錯誤格式 | 未定 | SE／API reviewer |
| Cloud Run 測試 service 與 workflow | template 尚未驗通 | SE |
| MONGODB_URI、服務帳號與 repo secrets | 未取得；不可自行填值 | SE／運維窗口，確認實際負責人 |
| stage/main 的 PR 流程 | 週次課綱與一般分支規範文字不同 | SE，指定訓練 repo 規則 |
| Mock 是否保留為獨立驗收模式 | 本任務要求 API-only 操作；題目 PRD 要求 Mock 主線仍可獨立驗收 | 任務負責人／SE，先確認再移除現有 Mock 替代設定 |
| PR #1 reviewer | 使用者回報尚未設定 | 核對 PR URL 並加入指定 reviewer |

卡住 30 分鐘就回報目前進度、已試的方法與需要誰提供的資訊，不等到驗收才提出。

## 今日進度回報（2026-10-07）

- 已完成：讀取第三週與題目 PRD，盤點前後端現況，列出 API、部署及流程上的待確認項目。
- 尚未完成：Todo 後端 CRUD、Angular API 串接、stage 部署與 runtime 驗收。
- 目前卡點：API 契約、MongoDB URI、Cloud Run 測試 service、部署 service account/secrets 與 workflow 負責人待確認。
- 下一步：立即向 SE／運維確認上述前置，同時從 Todo 資料規格與後端 route/service 骨架開始；每完成一個操作就練 Network 與口頭流程說明。
- Reviewer：PR #1 需補 reviewer；待核對 PR URL 與指定 reviewer。

## Progress

### 2026-10-07

- 依使用者任務指示建立第三週執行記錄。
- 盤點時發現 API repo 仍是 Elysia 範本；前端 API service 仍為 stub。
- 待 SE／任務負責人確認 API 契約、部署前置、branch/PR 規則，以及題目 PRD 的 Mock 獨立驗收要求如何與本週 API-only 指示對齊。

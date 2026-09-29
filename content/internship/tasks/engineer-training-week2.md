---
title: 團隊 TODO LIST 機器人練習任務
status: planned
start_date: 2026-09-29
tags:
  - 實習
  - 任務
  - Angular
  - LIFF
  - Mock Service
  - CRUD
---
# 團隊 TODO LIST 機器人練習任務

## 任務目標

依據 Aiii 新進工程師訓練題目，使用 Angular + LIFF 製作團隊共用的待辦清單畫面，完成待辦事項的新增、編輯與刪除。主要功能先使用 mock service 與記憶體資料，讓資料存取可在後續替換成 API，而不讓畫面元件直接依賴資料來源。

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
| 資料來源 | mock service 與 in-memory 假資料 |

本次不要求撰寫後端 API、接資料庫、webhook 推播或 LINE Bot 對話邏輯，也不要求資料持久化。重新整理後回到初始假資料是預期行為。權限、多團隊隔離、搜尋、排序、分頁、標籤與期限不在主線範圍；若要擴充，另開 Issue。

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
| `isCompleted` | `boolean` | 是 | 新增時預設 `false` |
| `createdAt` | `string` | 是 | ISO 8601 建立時間；建立後不可改變 |
| `updatedAt` | `string` | 否 | ISO 8601 最後編輯時間；新增時與 `createdAt` 相同 |
| `createdBy` | `string` | 否 | 建立者顯示名稱；主線可留空或使用假值 |
| `updatedBy` | `string` | 否 | 最後編輯者顯示名稱；主線可留空或使用假值 |

### 初始 mock 資料

至少提供三筆穩定的初始資料，至少一筆已完成，以便畫面能展示兩種狀態。可沿用題目範例：

| `id` | `title` | `isCompleted` |
| --- | --- | --- |
| `todo-001` | 整理第二週的 Issue | `false` |
| `todo-002` | 把 mock service 抽成一層 | `false` |
| `todo-003` | 建好 LIFF app 並跑起來 | `true` |

每筆資料都要有固定的 `createdAt` 與 `updatedAt`；不要使用隨機資料或每次載入都變動的初始值。

### Mock service 行為

元件透過同一個 service 查詢與更新資料，不直接讀寫 mock 陣列。主線操作應符合下表：

| 操作 | 輸入 | Service 行為 | 可觀察結果 |
| --- | --- | --- | --- |
| 查詢 | 無 | 回傳目前所有待辦事項 | 清單顯示所有資料及其完成狀態 |
| 新增 | `title` | 產生唯一 `id`；設定 `createdAt`、`updatedAt`；`isCompleted` 設為 `false`；加入並回傳新資料 | 清單增加一筆，輸入框清空 |
| 編輯 | `id` 與更新欄位 | 更新 `title` 或 `isCompleted` 及 `updatedAt`；保留 `id`、`createdAt` | 目標資料更新，其他資料與總筆數不變 |
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

### 功能與資料

- [ ] 初次開啟時顯示 mock service 提供的待辦事項，完成與未完成狀態可辨識。
- [ ] 新增後清單立即增加一筆，內容正確且預設未完成。
- [ ] 編輯內容後顯示新內容，該筆 `id` 與 `createdAt` 不變。
- [ ] 切換完成狀態後顯示新狀態，清單總筆數不變。
- [ ] 刪除後目標資料消失，其他資料保留；空清單時顯示空狀態。
- [ ] 空白內容無法送出，並有明確提示。
- [ ] 編輯／刪除不存在的 `id` 時，不會呈現成功結果。
- [ ] 所有資料操作均透過 mock service，元件不直接維護資料陣列。

### 結構與範圍

- [ ] 更換 service 內部資料來源時，畫面元件不需跟著修改。
- [ ] 主-1、主-2、主-3 全部完成才算主線通過。
- [ ] 支線未完成不影響主線通過；若有支線實作，主線仍須可獨立操作與驗收。

### 開發流程

Issue、PR 實際 review 往返、merge 後關閉 Issue，以及任務連結要求，依[第二週：LIFF 前端與 Mock 資料](https://github.com/Aiii-Developers/aiii-wiki/blob/main/company/onboarding/engineer-training/week-2-liff-mock.md)的驗收點辦理。分支、PR、review 與 API 規範見需求來源的相關文件。

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

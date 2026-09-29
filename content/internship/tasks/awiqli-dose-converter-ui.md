---
title: Awiqli LIFF 劑量轉換器 UI Prototype
status: in-progress
start_date: 2026-09-23
tags:
  - 實習
  - 任務
  - Angular
  - LIFF
  - UI Prototype
---
# Awiqli LIFF 劑量轉換器 UI Prototype

## 任務目標

依據 `Awiqli_LIFF_劑量轉換器_Demo_v3.html`，在 Angular 20 UI prototype repo 中建立劑量轉換器畫面，讓使用者可輸入每日胰島素劑量並查看參考畫面中的每週換算結果。

本次先完成可在瀏覽器直接開啟與操作的前端 UI prototype。畫面只包含使用者指定截圖中從「請輸入目前每日胰島素注射劑量」開始的內容，不包含手機狀態列、手機外框或 LIFF header；不實作 LIFF 初始化、登入或正式 API 串接。

## 專案資訊

- Repository：`/Users/oscar/Documents/nnhcp-awiqli-liff`
- Feature branch：`feature/awiqli-dose-converter-demo-v3`
- 參考畫面：`/Users/oscar/Downloads/Awiqli_LIFF_劑量轉換器_Demo_v3.html`
- 建議功能路由：`/awiqli-dose-converter`
- 建議功能目錄：`src/app/features/awiqli-dose-converter/`

## 畫面與互動規格

### 每日劑量與每週換算

- 目前元件預設每日劑量為 `68 IU`，依使用者提供的畫面狀態設定；原始 Demo HTML 預設值為 `42 IU`，最終初始值仍待確認。
- 以數字輸入、加減按鈕與滑桿調整每日劑量；三者需同步。
- 參考畫面範圍為 `1–100 IU`，步進值為 `1 IU`，僅接受整數。
- 依參考畫面的示意公式計算每週劑量：每日劑量乘以 7，並顯示每週結果與原每日劑量。
- 空值、非整數或超出範圍時顯示錯誤訊息，結果不得以無效輸入更新。

### Loading dose 區塊

- 提供可展開／收合的 Loading dose 區塊。
- 區塊預計包含病患體重、目標劑量欄位、計算按鈕及結果呈現區。
- 目前 prototype 顯示欄位、disabled 計算按鈕與規則待確認說明；確認計算規則前，不執行計算或顯示結果。
- 參考 HTML 目前以「體重 × 目標劑量後四捨五入」展示互動；此行為僅為介面示意，不能視為已確認的醫療計算規則。
- Loading dose 的公式、單位、輸入範圍、步進值、四捨五入方式與提示文字，須由客戶／醫學團隊確認後才能定稿。確認前，畫面應清楚標記規則待確認。

### 視覺與版面

- 以參考 HTML 的深藍、淺藍與暖白視覺為方向。
- 使用者於 2026-09-29 補充確認：提供的截圖是完整劑量卡的目標畫面，不能只呈現標題與單位列。卡片需完整呈現標題／單位、減號按鈕、目前劑量數字、加號按鈕、1–100 IU 滑桿與範圍標籤、分隔線，以及「注射頻率／每日一次 → 每週一次」列。
- 以手機直向畫面為主要版型，並確保窄螢幕下欄位、結果卡片與展開區塊可正常使用。
- 保留畫面上的轉換說明及 Prototype／醫療判斷提醒。
- 不需重製 HTML 外層已隱藏的桌面簡報區；以最終顯示的手機直接開啟版面為準。

## Angular 實作方向

- 新增 standalone feature，放在 `src/app/features/awiqli-dose-converter/`，不要覆寫 `src/app/demo/` 範例。
- 新增英文 slug 路由 `/awiqli-dose-converter`，支援直接開啟功能頁。
- 依 repo 的 `AGENTS.md` 建立 feature model、service interface、API service、mock service 與 mock data；在 `angular.json` 加入 local file replacement。
- UI component 使用 typed data 與 service facade；欄位錯誤、展開狀態等頁面狀態使用 Angular signals。
- 計算在 prototype 中以本機互動完成，不呼叫正式 API、不新增 LIFF SDK、登入、token 或第三方後端整合。
- 同步更新 `docs/tech/api-contract.md`，記錄 service method、欄位、畫面狀態，以及 Loading dose 尚待確認的規則；不得自行補造未確認的 API endpoint 或醫療規則。

## 元件與檔案對照

- `awiqli-dose-converter.component.ts` 是劑量轉換器頁面的 Angular 元件，負責 signals、計算與互動方法。
- `awiqli-dose-converter.component.html` 定義元件的畫面結構；輸入區、結果卡、提醒與 Loading dose 是同一元件中的 HTML 區塊。
- `awiqli-dose-converter.component.scss` 設定這個元件的樣式。
- `awiqli-dose-converter.routes.ts` 將功能路由導向 `AwiqliDoseConverterComponent`；`src/app/app.routes.ts` 將 `/awiqli-dose-converter` 載入此功能路由。
- 目前這些畫面區塊尚未拆成多個 Angular 元件。

## 驗收條件

- `/awiqli-dose-converter` 可直接開啟，`npm run local` 使用 mock 模式。
- 初始每日劑量採用「待確認」項目的最終決議，並依參考示意公式同步顯示每週結果；目前候選值為截圖中的 `68 IU` 或原始 Demo HTML 的 `42 IU`。
- 數字輸入、加減按鈕與滑桿會同步更新；無效輸入會顯示明確錯誤。
- 提供截圖中的整張劑量卡，包含標題／單位、減號、劑量數字、加號、滑桿與範圍標籤、分隔線及注射頻率列；只顯示標題與單位列不算完成。
- Loading dose 區塊可展開／收合，欄位及待確認說明清楚可見。
- 手機寬度下版面可操作，沒有內容溢出或按鈕被遮擋。
- 完成後至少執行 `npm run local`；若調整 TypeScript、路由或 service replacement，另執行 `npx ng build --configuration local`。

## 待確認

- Loading dose 的正式計算公式、單位、欄位範圍、步進與結果取位方式。
- Loading dose 的正式醫療說明與免責提示文字。
- 每日劑量初始值採用 `68 IU`（目前截圖／元件）或 `42 IU`（原始 Demo HTML）。
- 此功能是否要取代網站根路由目前導向的 `/demo`；本任務先以新增獨立路由為範圍。

## Progress

### 2026-09-23

- 閱讀 Angular prototype repo 規範、現有 demo/service 結構與參考 HTML。
- 建立任務規格；UI feature 尚未開始實作。

### 2026-09-29

- 建立 `/awiqli-dose-converter` 路由與劑量轉換器頁面元件。
- 完成每日劑量輸入驗證、加減按鈕、滑桿、每週換算結果與 prototype 提醒；輸入清空時，滑桿會指向 `1`，結果保留最後一個有效劑量。
- Loading dose 區塊可展開／收合，含體重與目標劑量欄位；計算按鈕目前停用，等待醫學規則確認。
- 畫面依使用者提供的截圖調整，只保留劑量轉換內容，排除手機狀態列與外框；展開箭頭有旋轉動畫，區塊顏色隨展開狀態切換。
- 使用者再次明確指出，截圖中的整張劑量卡才是目標畫面；驗收需逐項確認卡片內容完整，不可只呈現最上方標題列。
- 初版 commit `c2097d2`（`feat(awiqli-dose-converter): add dose converter UI`）已推送至 `origin/feature/awiqli-dose-converter-demo-v3`。目前本機有一筆尚未 commit 的 `weeklyDose` 格式調整。
- `npx ngc -p tsconfig.app.json --noEmit` 通過；`npx ng build --configuration local --output-path /tmp/awiqli-dose-converter-build` 曾兩次以 exit code `134` 結束，沒有輸出編譯診斷，需再確認。
- Feature 尚未建立 models、API/mock service、service interface、mock data、local file replacement，也尚未補上 feature 的 API contract。

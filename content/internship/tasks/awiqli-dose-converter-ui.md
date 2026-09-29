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

本次先完成可在瀏覽器直接開啟與操作的前端 UI prototype。LIFF header 僅作為畫面示意，不實作 LIFF 初始化、登入或正式 API 串接。

## 專案資訊

- Repository：`/Users/oscar/Documents/nnhcp-awiqli-liff`
- Feature branch：`feature/awiqli-dose-converter-demo-v3`
- 參考畫面：`/Users/oscar/Downloads/Awiqli_LIFF_劑量轉換器_Demo_v3.html`
- 建議功能路由：`/awiqli-dose-converter`
- 建議功能目錄：`src/app/features/awiqli-dose-converter/`

## 畫面與互動規格

### 每日劑量與每週換算

- 預設每日劑量為 `42 IU`。
- 以數字輸入、加減按鈕與滑桿調整每日劑量；三者需同步。
- 參考畫面範圍為 `1–100 IU`，步進值為 `1 IU`，僅接受整數。
- 依參考畫面的示意公式計算每週劑量：每日劑量乘以 7，並顯示每週結果與原每日劑量。
- 空值、非整數或超出範圍時顯示錯誤訊息，結果不得以無效輸入更新。

### Loading dose 區塊

- 提供可展開／收合的 Loading dose 區塊。
- 區塊包含病患體重、目標劑量欄位、計算按鈕及結果呈現區。
- 參考 HTML 目前以「體重 × 目標劑量後四捨五入」展示互動；此行為僅為介面示意，不能視為已確認的醫療計算規則。
- Loading dose 的公式、單位、輸入範圍、步進值、四捨五入方式與提示文字，須由客戶／醫學團隊確認後才能定稿。確認前，畫面應清楚標記規則待確認。

### 視覺與版面

- 以參考 HTML 的深藍、淺藍與暖白視覺為方向。
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

## 驗收條件

- `/awiqli-dose-converter` 可直接開啟，`npm run local` 使用 mock 模式。
- 預設顯示 `42 IU` 與依參考示意公式計算的每週結果。
- 數字輸入、加減按鈕與滑桿會同步更新；無效輸入會顯示明確錯誤。
- Loading dose 區塊可展開／收合，欄位及待確認說明清楚可見。
- 手機寬度下版面可操作，沒有內容溢出或按鈕被遮擋。
- 完成後至少執行 `npm run local`；若調整 TypeScript、路由或 service replacement，另執行 `npx ng build --configuration local`。

## 待確認

- Loading dose 的正式計算公式、單位、欄位範圍、步進與結果取位方式。
- Loading dose 的正式醫療說明與免責提示文字。
- 此功能是否要取代網站根路由目前導向的 `/demo`；本任務先以新增獨立路由為範圍。

## Progress

### 2026-09-23

- 閱讀 Angular prototype repo 規範、現有 demo/service 結構與參考 HTML。
- 建立任務規格；UI feature 尚未開始實作。

---
title: Awiqli 專案交接文件
description: 劑量轉換器原型與 HCP 學習遊戲的使用情境、基本流程、前端回饋、問題解法與維護入口。
updated_date: 2026-10-28
author: Oscar
tags:
  - 實習
  - 專案交接
  - Awiqli
---

# Awiqli 專案交接文件

內容依目前本機程式、任務筆記與同事留下的整合紀錄整理，供接手定位及回歸檢查。

## 1. 交接範圍與目前狀態

| 功能 | 使用情境與範圍 | 開發位置 |
| --- | --- | --- |
| 劑量轉換器 | 討論畫面與輸入互動的 UI 原型；每週換算為 Demo 示意，Loading dose 尚未實作計算。 | `nnhcp-awiqli-liff`。 |
| HCP 學習遊戲 | HCP 從 LINE LIFF 學習課程、作答、續接進度，完成後取得個人化證書。 | `nnhcp-liff-main`。 |
| 證書相關畫面 | 本人負責證書畫面與 Canvas 產圖；後續上傳、下載及分享整合由其他同事接手。 | `src/app/product-course/certificate-page/` |

分工：Oscar 負責原始 UI、RWD、假資料流程與 Canvas 證書；API 串接及後續下載／分享整合由其他同事負責。

## 2. 劑量轉換器原型

### 使用情境與基本流程

用於確認完整劑量卡與輸入互動，不包含正式登入、API 或醫療計算規則。畫面包含每日劑量、加減按鈕、滑桿、每週結果及可展開的 Loading dose。

1. 以 `/awiqli-dose-converter` 開啟頁面，當前程式初始值為 `68 IU`。
2. 以數字欄位、加減按鈕或滑桿調整每日值；有效範圍為 `1–100 IU` 整數，步進為 1。
3. 有效輸入同步所有控制項，示意每週結果由 `weeklyDose` 以每日值乘以 7 計算。
4. 輸入無效時顯示欄位訊息，保留最後有效結果。清空欄位時滑桿顯示 1。
5. 展開 Loading dose 可輸入體重與目標劑量；負值歸零，計算按鈕停用並顯示規則待確認說明。

原始 Demo 的初始值為 42，當前 68 依當時截圖設定。正式初始值、換算公式、Loading dose 單位與計算規則須依核定需求確認，不能直接將此原型視為正式計算器。

### 前端回饋與狀態

| 觸發情境 | 使用者看到的內容 | 後續行為 |
| --- | --- | --- |
| 清空每日值 | 「請輸入數值」。 | 不更新結果；重新輸入有效值即可恢復。 |
| 輸入小數或超出範圍 | 「請輸入 1–100 IU 的整數」。 | 保留原輸入供修改及最後有效結果。 |
| 數值已達上下限 | 1 時減號停用；100 時加號停用。 | 滑桿與有效輸入維持範圍內。 |
| 展開 Loading dose | 顯示欄位、箭頭旋轉，並提示「Loading dose 計算規則尚待客戶 / 醫學團隊確認，目前僅作介面示意。」 | 計算按鈕維持停用。 |

維護入口：`src/app/features/awiqli-dose-converter/awiqli-dose-converter.component.ts` 與同名 HTML／SCSS。數值與驗證目前集中於元件；`setDose()` 同步狀態，`getDoseError()` 檢查輸入，`weeklyDose` 提供衍生結果。

## 3. HCP 學習遊戲

### 使用情境與基本流程

Awiqli 原規劃六堂課、共 18 題，現行畫面以六關學習情境設計。畫面依 API 的課程與題目清單呈現；正式進度由後端保存，清除瀏覽器 localStorage 不會重設作答。

1. **進入地圖：** 開啟 `/product-courses/:productKey`，以登入的 LINE user ID 與 `productKey` 呼叫 `progress/get`，取得 HCP、課程與進度。
2. **選擇課程：** 首頁顯示完成數、底部進度筆及關卡；點關卡後，以 query parameter `courseId` 進入共用課程頁。
3. **觀看與摘要：** 顯示 Vimeo 影片及本堂內容；摘要為空則按鈕反灰。不必看完影片即可進測驗。「重新播放」目前會暫停並回到 0 秒，讓使用者自行播放。
4. **開始作答：** 題目依 `order` 排序，選項逐項繪製。未選答案時不能送出；送出中停用送出按鈕，避免重複提交。
5. **依結果前進：** 呼叫 `progress/update` 的 `submitAnswer`，由後端判定。錯答留在原題重試；答對進下一題，直到後端回傳該堂完成。
6. **離開與續接：** 返回地圖保留已送出進度；重整或重新進入時，定位第一個尚未答對的題目，清除未送出的暫選項。已完成課程顯示最後一題、已保存正解及灰色鎖定狀態。
7. **取得證書：** 全部課程完成後，城堡與認證告示牌可進入證書頁。證書頁再次讀取進度，確認 `completed`、HCP 資料與 `certifiedAt`，未符合時返回地圖。


### 前端回饋與例外

| 情境 | 顯示／按鈕狀態 | 後續行為 |
| --- | --- | --- |
| 圖片、字型與選項排版準備中 | 顯示轉圈動畫；至少 700ms，準備完才顯示內容。 | 測驗另等待整堂選項量測及框圖預載。 |
| HCP 找不到或未驗證、API 回 `HCP_ACCESS_DENIED` | 顯示「您無此權限閱覽此頁面」與「確認」。 | 停用關卡／證書入口；確認後請求關閉 LIFF。重複 HCP 的無錯誤碼 409 可顯示後端文字。 |
| 其他課程／進度載入失敗 | alert「載入失敗，請稍後再試」。 | 記錄 console error，並請求關閉 LIFF。 |
| 課程 ID 無效、測驗沒有題目 | 不顯示錯誤課程內容。 | 導回地圖；測驗使用替換歷史紀錄的導覽。 |
| 影片網址不可解析 | 顯示「課程影片準備中」；重新播放停用。 | 摘要與測驗依課程資料操作。 |
| 未選答案／送出中 | 送出按鈕停用。 | 有選取且請求完成後可操作。 |
| 答錯 | 優先顯示 API 的 `incorrectHint`；沒有時顯示「可惜沒有答對...」「試試看其他選項吧！」。 | 按「再試一次」清除選取及提示，留在原題；可重試。 |
| 送出答案失敗 | alert「送出失敗，請稍後再試」；權限錯誤改走權限彈窗。 | 一般錯誤保留選取，送出狀態復原，可再試。 |
| 本堂完成 | 顯示「恭喜答對 N 題測驗！」及「返回課程地圖」。 | 回地圖後重新取得進度。N 依本堂題數。 |
| 再次進入完成課程 | 灰色鎖定選項及「已完成本堂測驗」。 | 不可重新送出；可返回地圖。 |

## 4. 證書畫面與操作回饋

本人負責證書畫面與 Canvas 產圖。以下整理目前整合版本的操作回饋，供接手排查；不代表全部由本人實作。

### 前端回饋與失敗處理

| 階段／情境 | 顯示內容 | 操作與復原 |
| --- | --- | --- |
| 開始分享 | 「正在準備分享證書…」。 | 下載與分享按鈕停用，直到本次工作結束。 |
| 第一次上傳 | 「正在上傳個人化證書…」。 | 目前不顯示百分比；快取命中時略過上傳。 |
| 準備開頁 | 「正在開啟分享頁面…」；LINE 內呼叫開頁後顯示「已在外部瀏覽器開啟分享頁面。」 | 上傳失敗時不開分享頁；開頁不等於分享成功。 |
| 上傳失敗 | 「證書上傳失敗，請稍後再試。」 | HTTP、網路或回應格式錯誤均可能觸發；按鈕恢復，可重試。 |
| 上傳超過 60 秒 | 「證書上傳逾時，請確認網路後再試。」 | 以 `AbortController` 中止；不能只憑文案認定是手機網路問題。 |
| 沒有 LINE user ID／證書資料未就緒 | 顯示重新從 LINE 開啟或稍後再試的訊息。 | 不送出缺少身分或未準備好的圖片。 |
| 分享頁環境或檔名無效 | 「證書連結無效，請回到證書頁重新分享。」 | 隱藏分享按鈕。 |
| 分享頁讀圖失敗 | 「檔案下載失敗，請檢查網路或連結。」；後續可能再顯示分享失敗提示。 | 回證書頁重試，檢查圖片網址與跨網域讀取。 |
| 使用者取消系統分享 | 不顯示錯誤。 | `AbortError` 視為取消；其他失敗提示「分享功能無法使用，請嘗試截圖或長按儲存檔案。」 |

## 5. 開發問題與處理方式

| 問題／回饋 | 原因與採用處理 | 交接時的狀態／檢查重點 |
| --- | --- | --- |
| 原型只呈現標題，沒有完整劑量卡 | 依完整截圖補齊數字、加減、滑桿、範圍、頻率列與結果卡；排除展示手機框。 | 原型已調整；核對初始值、1／100、空白與小數，正式公式另確認。 |
| 長題目溢出、選項只一行卻套兩行框 | 字數估算無法反映裝置寬度與實際字型；改由瀏覽器換行、量實際文字高度與 line-height 選框，題目由內容撐高。 | 字級、內距與隱藏量測區要一致；更換長文案後再查框內留白與溢出。 |
| 選項在轉圈結束或切題後由小跳大 | 字型及框圖尚未準備完成就先顯示單行框；改在隱藏區量整堂選項、預載框圖，再顯示內容。 | 保留 `prepareQuizLayout()` 與載入器整合；調寬時用 `ResizeObserver` 重算並更新 OnPush。 |
| 重新播放增加瀏覽紀錄，裝置返回要按多次 | 重設 iframe 網址會影響瀏覽紀錄；改用 Vimeo Player API 暫停並 seek 到 0，不重設 iframe src。 | 同一頁連按多次後，裝置返回應回地圖；按鈕文字仍叫「重新播放」，實際操作為回開頭並暫停。 |
| 證書缺姓名或專業別、日期超出框 | Canvas 座標曾重複縮放；修正繪圖座標與日期排版。後續另加填底、留白及分享縮圖。 | 檢查頁面預覽與實際輸出兩者；原尺寸 PNG 的舊結果不能當成現行上傳縮圖結果。 |
| 按下載／分享後按鈕卡住 | 非同步完成後狀態沒有反映到 OnPush；補上 finally、`finishAction()`、逾時與離頁中止。 | 成功、取消、失敗與重試都應恢復按鈕。 |
| Firebase 直接上傳卡住，LINE 下載不支援 | 早期前端 Storage 流程曾受登入／權限／連線問題阻擋，單憑 0% 無法判定根因。 | 已替換流程；不能據此宣稱原先「自動跳外部下載」要求已達成。 |

## 6. 接手定位與部署

### 程式入口與修改位置

| 內容 | 檔案／位置 |
| --- | --- |
| 學習遊戲路由 | `src/app/liff.module.ts`、`src/app/product-course/product-course.module.ts`；`productKey` 是路徑參數，`courseId` 是 query parameter。 |
| 地圖、進度筆、證書入口、仿單連結 | `src/app/product-course/product-course-home.component.*`。 |
| Vimeo、摘要、課程跳轉 | `src/app/product-course/course-page/course-page.component.*`、`vimeo-embed-url.ts`。 |
| 題目、答案提示、鎖定及選項量測 | `src/app/product-course/quiz/quiz-page.component.*`。 |
| 圖片／字型／版面載入準備 | `src/app/product-course/page-loader/product-course-page-loader.component.*`。 |
| 後端課程、HCP 與進度 | `product-course-api.service.ts`、`product-course.service.ts`、`product-course.models.ts`。 |
| 證書、上傳、圖片視窗、分享入口 | `src/app/product-course/certificate-page/certificate-page.component.*`；`getCertificateImage()`、`downloadCertificate()`、`shareCertificate()`。 |
| token 與環境 | `src/app/shared/api-fetch.ts`、`src/environments/environment*.ts`；分享網址用 `webShare.url`，環境用 `webShare.certificateEnv`。 |
| 系統分享與下載 fallback | `nn-web-share/public/index.html` 的 `initAwiqliCertificate()`、`shareFile()`。 |
| 圖片素材 | `src/assets/awiqli/learning-game/`；功能目錄已改名，素材目錄仍保留原名。 |

原型入口為 `http://localhost:4200/awiqli-dose-converter`。學習遊戲入口為 `http://localhost:4200/product-courses/{productKey}?site=nnhcp`，課程／測驗加 `/course` 或 `/quiz` 並帶 `courseId`，證書加 `/certificate`。請使用有效課程專案與測試 HCP；localhost 路由放行不代表登入與後端資料可用，也不能取代 LINE 實機測試。

部署維持在功能分支提交程式，再整合到 `stage/s2.1.0`，依 stage workflow 支援的 `s*` tag 發布；以目標提交與 GitHub Actions 結果確認版本。`stage` 不回合到功能分支。`nn-web-share` 是另一個 repo，有獨立部署流程；更動分享規則時要同步確認兩邊版本。

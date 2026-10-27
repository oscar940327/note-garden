---
title: Awiqli 專案交接文件
description: 劑量轉換器原型與 HCP 學習遊戲的使用情境、基本流程、前端回饋、問題解法與維護入口。
updated_date: 2026-10-27
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
| 劑量轉換器 | 討論畫面與輸入互動的 UI 原型；每週換算為 Demo 示意，Loading dose 尚未實作計算。 | `nnhcp-awiqli-liff`，Angular 20。 |
| HCP 學習遊戲 | HCP 從 LINE LIFF 學習課程、作答、續接進度，完成後取得個人化證書。 | `nnhcp-liff-main`，Angular 17；現行功能目錄為 `src/app/product-course/`。 |
| 證書分享頁 | 接收證書檔名、讀取已上傳圖片，提供系統分享或下載。 | `nn-web-share/public/index.html`，入口 `https://novonordisk.aiii.ai/`。 |

分工：Oscar 負責原始 UI、RWD、假資料流程、Canvas 證書與早期下載／分享嘗試；Carlos 串接課程、作答、HCP 與進度 API；Twiggy 後續整合平台上傳、長按下載視窗、外部分享頁，以及 `product-course` 路由與命名重構。

目前一般下載採用「上傳後顯示圖片，使用者長按儲存」，分享採用「開啟外部分享頁，再按按鈕呼叫系統分享」。原先希望「按下載後自動開 Safari／Chrome 並下載」的要求，不能據此列為已完成。

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

課程頁依需要送出 `startCourse`。若送答案遇到 `PROGRESS_NOT_FOUND`，先補送 `startCourse`，再重送一次同一份答案；其他錯誤不會當成尚未建立進度處理。

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

## 4. 證書下載與分享

### 資料、產圖與共用上傳

姓名與專業別取自 API 的 HCP，日期取自 `progress.certifiedAt`，以台北時區格式化。Canvas 合成證書本體與文字，加入 Forest Green 底色及留白；頁面上的天空、草地與城堡不會合成到證書檔案。

頁面準備時先產生本機 File；第一次按下載或分享才上傳。`getCertificateImage()` 共用縮圖與上傳流程：最長邊不超過 1024px、檔案不超過 1MB，同一元件生命週期內以使用者、姓名、專業別與日期組成快取 key，沿用 `{ url, fileName }`。離開再進入會重新產生頁面快取。

上傳由 `apiFetch()` 呼叫 `${environment.cloudrun.api}/upload-to-storage`；符合 API 網址設定且有記憶體 token 時，自動帶 Bearer token。FormData 含 `file`、`site`、`remotePath`、`fileName`、`makePrivate=false`，目前未傳 `lifeNumber`。證書頁已移除直接操作 Firebase Storage SDK 的流程。

固定目錄為 `projects/nnhcp/productCourse/awiqli/certificate`，檔名為台北時間 `{YYYYMMDDHHmmss}_{LINE userId}.{png|jpg}`。`nn-web-share` 依同一套目錄與命名規則取圖，修改時需同步兩個 repo。圖片目前設為公開讀取；正式 bucket、保存期限與存取設定需由負責人確認。

### 按下載的流程

1. 呼叫 `downloadCertificate()`，取得上傳圖片網址。
2. 設定 `downloadImageUrl`，顯示證書圖片視窗與「請長按圖片以下載」。
3. 使用者長按圖片儲存；桌機可右鍵另存。關閉視窗後可以再次操作。

這條流程沒有自動切換外部瀏覽器，也沒有直接呼叫 `downloadLocalFile()`。視窗顯示的是上傳後縮圖。`downloadTest=1` 才會顯示額外測試入口，讀取外部測試圖片後轉成 File，以 Blob URL／`<a download>` 嘗試下載；它不代表個人化證書或 LINE WebView 的正式下載已驗收。

### 按分享的流程

1. 主 repo 取得已上傳圖片的檔名，組出 `https://novonordisk.aiii.ai/`，帶 `campaign=awiqli-certificate`、`env`、`file`、`date`、`openExternalBrowser=1`。
2. LINE 內用 `liff.openWindow({ url, external: true })` 請求外部瀏覽器；外部瀏覽器則在目前分頁導向分享頁。
3. `nn-web-share` 驗證環境與檔名格式，組 GCS JSON API 圖片下載網址並顯示預覽。它讀取成品，不重新產生姓名或日期。
4. 使用者在分享頁再按「分享／下載」。`shareFile()` 取圖成 Blob／File，將分享檔名改為 `Awiqli-HCP-Certificate-{日期}.{副檔名}`。
5. `navigator.canShare({ files: [file] })` 通過後呼叫 `navigator.share()`，顯示系統分享選單；使用者可選系統提供的 LINE 等 App。不支援時以 Blob URL／`<a download>` 嘗試下載。

目前使用的是系統分享選單；LIFF 專用的 `shareTargetPicker()` 已從證書分享方法移除。主 repo 的「已在外部瀏覽器開啟分享頁面。」只表示執行開頁指令，沒有確認圖片已傳送給任何人。

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
| 地圖底端空白、標題被外框擋住、平板進度筆太小 | 調整地圖／HUD／外框層級、百分比點擊區及 safe area；標題與進度筆依可用寬度調整。 | 維護時檢查地圖最底、窄螢幕、平板與桌面，避免改一種裝置後遮住另一種。 |
| 長題目溢出、選項只一行卻套兩行框 | 字數估算無法反映裝置寬度與實際字型；改由瀏覽器換行、量實際文字高度與 line-height 選框，題目由內容撐高。 | 字級、內距與隱藏量測區要一致；更換長文案後再查框內留白與溢出。 |
| 選項在轉圈結束或切題後由小跳大 | 字型及框圖尚未準備完成就先顯示單行框；改在隱藏區量整堂選項、預載框圖，再顯示內容。 | 保留 `prepareQuizLayout()` 與載入器整合；調寬時用 `ResizeObserver` 重算並更新 OnPush。 |
| 舊 Safari 摘要不能開啟，或版面尺寸失效 | 原生 dialog 與 cqw 支援差異；摘要改 Angular Material Dialog，先提供基本尺寸再用 `@supports` 啟用 cqw。 | 檢查摘要開關／捲動、無摘要停用，以及 fallback 樣式。 |
| 重新播放增加瀏覽紀錄，裝置返回要按多次 | 重設 iframe 網址會影響瀏覽紀錄；改用 Vimeo Player API 暫停並 seek 到 0，不重設 iframe src。 | 同一頁連按多次後，裝置返回應回地圖；按鈕文字仍叫「重新播放」，實際操作為回開頭並暫停。 |
| 證書缺姓名或專業別、日期超出框 | Canvas 座標曾重複縮放；修正繪圖座標與日期排版。後續另加填底、留白及分享縮圖。 | 檢查頁面預覽與實際輸出兩者；原尺寸 PNG 的舊結果不能當成現行上傳縮圖結果。 |
| 按下載／分享後按鈕卡住 | 非同步完成後狀態沒有反映到 OnPush；補上 finally、`finishAction()`、逾時與離頁中止。 | 成功、取消、失敗與重試都應恢復按鈕；分享頁的系統分享狀態由另一頁負責。 |
| Firebase 直接上傳卡住，LINE 下載不支援 | 早期前端 Storage 流程曾受登入／權限／連線問題阻擋，單憑 0% 無法判定根因；同事改平台上傳 API，下載改長按，分享改外部頁。 | 已替換流程；不能據此宣稱原先「自動跳外部下載」要求已達成。先查 API 回應，再查圖片讀取及瀏覽器行為。 |
| 分享頁 fetch 圖片被跨網域擋住 | 同事檢查 stage 的一般物件網址缺少 CORS 回應，改用 GCS JSON API 下載網址讀圖。 | stage 有驗證紀錄；正式 bucket 名稱與正式站跨網域讀取仍待確認。 |
| 建置或整合失敗 | 曾遇到衝突標記進入程式、Vimeo 型別相依錯誤、Google Fonts 無法連線；原型也曾以 exit code 134 無診斷退出。 | 衝突與後續證書 change 有修正／建置紀錄；134 未留下確定根因。依目前錯誤排查，不把歷史失敗當成現存缺陷或已驗收。 |

## 6. 接手定位與驗收

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

更換題目、選項、摘要或影片時，先更新 API 課程資料；選項使用 `@for`，三個或四個選項都依清單繪製。題目／選項 ID 影響作答與續接，修改需與後端協調。首頁雖依課程資料更新完成數，關卡位置、地圖及七種進度筆仍是 Awiqli 六關素材；擴充其他藥品或超過六關時需另外調整。

### 本機開啟

```bash
# 劑量轉換器原型（兩個 repo 的指令不同）
cd /Users/oscar/Documents/nnhcp-awiqli-liff
npm run local

# HCP 學習遊戲
cd /Users/oscar/Documents/nnhcp-liff-main
npm start
```

原型入口為 `http://localhost:4200/awiqli-dose-converter`。學習遊戲入口為 `http://localhost:4200/product-courses/{productKey}?site=nnhcp`，課程／測驗加 `/course` 或 `/quiz` 並帶 `courseId`，證書加 `/certificate`。請使用有效課程專案與測試 HCP；localhost 路由放行不代表登入與後端資料可用，也不能取代 LINE 實機測試。

部署維持在功能分支提交程式，再整合到 `stage/s2.1.0`，依 stage workflow 支援的 `s*` tag 發布；以目標提交與 GitHub Actions 結果確認版本。`stage` 不回合到功能分支。`nn-web-share` 是另一個 repo，有獨立部署流程；更動分享規則時要同步確認兩邊版本。

### 已有證據與待交接項目

- 同事的 `share-certificate-via-web-share/tasks.md` 記錄 2026-10-23 iOS LINE → Safari、Android LINE → Chrome、外部瀏覽器、桌面分享／下載 fallback、取消及失敗重試通過，並有 AM 分享頁外觀確認。這是既有驗證紀錄，本次整理沒有重新部署或實機測試。
- `use-platform-upload-for-certificate-share/tasks.md` 的跨裝置長按儲存、上傳細節及正式保存設定仍有未勾選；分享 change 的正式 bucket／JSON API 跨網域讀取亦未勾選。
- 接手先確認：長按儲存是否為最終接受方案；原型初始值及正式計算規則；正式 bucket 與圖片保存設定。未確認項目不要直接標完成。
- 回歸至少涵蓋：窄手機／平板／桌面、長題目與三個選項、切題及重整續接、無權限、影片回開頭、全部完成、長姓名證書、下載後再分享、取消、失敗及重試。結果記錄裝置、瀏覽器、版本與實際檔案，不只記「按鈕有反應」。

詳細背景與來源：[劑量轉換器任務](awiqli-dose-converter-ui.md)、[學習遊戲任務與實作分工](Awiqli-HCP-Learning-Game-UI.md)、[nn-web-share 原始碼](https://github.com/Aiii-Developers/nn-web-share/blob/66d00e8b715e402f3849ae251352abaf35ca1059/public/index.html)。原有三份 UI OpenSpec 已封存；後續上傳／分享 change 仍依各自 tasks 追蹤。

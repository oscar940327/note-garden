---
title: Awiqli HCP Learning Game UI
status: in-progress
updated_date: 2026-10-21
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

依照 Figma 與 Awiqli PRD，在既有 `nnhcp-liff-main` 專案中完成學習遊戲的前端畫面與互動，包含六關地圖、課程頁、摘要 popup、逐題測驗、進度續接與證書頁。版面需支援直式手機、平板與寬螢幕，素材統一存放在 repo。

目前學習地圖、課程、測驗與證書頁已改由 LearningGameApiService 與 LearningGameCourseService 取得課程內容、HCP 身分及進度，作答也會送到後端。LINE 分享程式已接上 LIFF 好友／聊天室選擇與 Firebase Storage 圖片網址流程；測試站部署結果、Firebase 權限與 LINE WebView 實機分享／下載仍需確認。

## 目前進度摘要（2026-10-21）

- **首頁：** 六關依 API 課程順序與進度呈現；完成數、進度筆、完成版地圖與證書入口共用課程服務資料。
- **課程頁：** 依 API 課程資料顯示標題、摘要與 Vimeo 影片；第二堂沒有摘要時按鈕反灰。影片頁提供返回與回到影片開頭的控制。
- **測驗：** 題目、選項與正解由課程 API 提供；送出答案呼叫 progress/update，由後端判定正誤與保存進度。各堂依後端答案紀錄續接。
- **文字與載入：** 題目框依內容延伸；選項依實際排版行數選框。載入動畫期間先量完整堂課的選項並預載框圖，避免首次顯示或切題時放大。
- **證書：** 頁面重新讀取 progress/get；姓名、專業別與認證日期取自 HCP／後端進度。證書以 Canvas 產生 PNG，下載按鈕使用本機 File、Blob URL 與 a download，不需要 Firebase 上傳。
- **分享：** 程式會透過 Firebase Storage 上傳個人化證書，再使用 LIFF shareTargetPicker 選擇好友／聊天室。實際 Firebase 權限及 LINE 測試站行為尚待確認。
- **OpenSpec：** awiqli-home-rwd、awiqli-course-page、awiqli-quiz-flow 均已封存；封存只代表當時 change 範圍結束。
- **提交與部署：** 功能提交 7693df9 已合併至 stage/s2.1.0，合併提交為 0711551；本機可見 s2.1.261 tag。部署 Action 與測試站實測結果尚未核實。

## 專案資訊

- Repository：<https://github.com/Aiii-Developers/nnhcp-liff-main>
- 本機 Repository：`/Users/oscar/Documents/nnhcp-liff-main`
- Feature branch：`feat/awiqli-dose-converter`
- 功能目錄：`src/app/awiqli/learning-game/`
- 素材目錄：`src/assets/awiqli/learning-game/`
- 技術組合：Angular 17、TypeScript、HTML、SCSS、standalone component、Angular Material Dialog、Canvas、LINE LIFF。

| 頁面 | 路由 |
| --- | --- |
| 學習地圖 | `/awiqli/learning-game` |
| 課程影片／摘要頁 | `/awiqli/learning-game/course?courseId=course-1` |
| 測驗頁 | `/awiqli/learning-game/quiz?courseId=course-1` |
| 證書頁 | `/awiqli/learning-game/certificate` |

課程 ID 為 `course-1`～`course-6`，各堂共用課程頁與測驗頁；透過 query parameter 選取對應內容，不為每堂新增獨立元件或路由。實作位於主專案，早期 `nnhcp-awiqli-liff` prototype repo 不作為本文件目前的開發位置。

## 需求來源

- [Figma 首頁（4899:1335）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4899-1335&m=dev)、[整體遊戲畫面（4889:5918）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4889-5918&m=dev)。
- [Figma banner（4894:1271）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4894-1271&m=dev)。
- [Figma 課程頁（4905:1689）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4905-1689&m=dev)。
- [Figma 測驗內容（4990:3427）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4990-3427&m=dev)、[測驗狀態（5041:6237）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=5041-6237&m=dev)、[完成後配色（5041:6566）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=5041-6566&m=dev)。
- [Figma 證書頁（5041:6375）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=5041-6375&m=dev)、[證書構圖（5041:6373）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=5041-6373&m=dev)。
- [Awiqli PRD](https://github.com/Aiii-Developers/nnhcp-docs/blob/main/%5B專案%5D%20Awiqli藥品上線HCP功能更新/評估文件/Awiqli藥品上線HCP功能更新_PRD_TBD.md)：六堂課程、測驗、進度與證書需求；文件仍為 TBD 版，正式素材與後端契約需持續確認。
- 題目、選項、課程摘要與正解以 PRD／核定內容為依據；目前執行中的畫面從 progress/get 回傳的課程資料讀取。repo 中的本機題庫 JSON 是早期假資料，沒有被目前頁面引用。

### OpenSpec 紀錄

| Change | 本機封存位置 |
| --- | --- |
| `awiqli-home-rwd` | `openspec/changes/archive/2026-10-06-awiqli-home-rwd/` |
| `awiqli-course-page` | `openspec/changes/archive/2026-10-14-awiqli-course-page/` |
| `awiqli-quiz-flow` | `openspec/changes/archive/2026-10-19-awiqli-quiz-flow/` |

封存表示各 change 當時的範圍已結束，不等同正式後端、影片、LINE 分享或實機驗收全部完成。OpenSpec 目前由 `.gitignore` 忽略，交接時需另行確認文件保存方式。

## 我負責的工作

- 確認 repo、分支、既有 Angular 路由與 LIFF 環境，使用 loadComponent 載入 standalone 頁面；另串接課程、進度與作答 API。
- 讀取 Figma、匯出本機素材，實作首頁、課程、測驗與證書畫面及 RWD。
- 以 OpenSpec 整理中文 proposal、spec、design 與 tasks，依階段開發並封存完成的 change。
- 建立早期本機題庫、單一假帳號與進度服務；目前執行中的首頁、課程與測驗改由後端 API 提供資料。
- 修正素材白底、外框層級、百分比定位、題目溢出、選項尺寸跳動與載入時序問題。
- 以 Canvas 合成個人化證書，處理本機下載、LIFF 分享與非同步按鈕狀態。
- 實作 LIFF 好友／聊天室分享流程與 Firebase Storage 個人化證書圖片上傳；仍需在測試站確認 Firebase 權限及 LINE 實機結果。

## 已確認的畫面與互動規格

### 首頁地圖與進度

- 地圖保持原始比例並可垂直捲動，頂部 banner、外框與底部 HUD 分層顯示；捲到最下面不額外增加尾端空白。
- 六個關卡點擊區、地圖上的筆與入口均依地圖使用百分比定位。
- 完成數由各堂課程的 `status === 'completed'` 計算，顯示 `0/6`～`6/6`，同步切換七種進度筆素材與完成版地圖。
- 地圖上的筆依 `currentCourseId` 標示目前課程，與底部表示「完成堂數」的進度筆不同。
- 六堂完成後，認證告示牌與城堡入口皆可開啟證書頁；未完成時不提供證書入口操作。
- 首頁右上告示牌連到 PRD 指定的仿單網址，位置與網址設定在 `learning-game.component.ts`。
- Banner 使用透明底 Logo，外框在標題列上層；HUD 使用動態視窗高度與底部 safe area。另已調整平板／桌面標題、進度筆尺寸與進度條背景。

### 課程頁與摘要

- 六堂課依 `courseId` 顯示各自的標題與摘要，無效 ID 返回學習地圖。
- 第 2 堂未提供摘要，按鈕呈灰色且不可操作；其餘依內容開啟可捲動的摘要 popup。
- 摘要使用 Angular Material Dialog，避免舊版 Safari 缺少原生 `dialog.showModal()`。
- 課程與測驗頁寬螢幕內容置中，最大寬度為 720 CSS px。
- 影片框以 `width: 100%`、`height: 0`、`padding-top: 56.25%` 維持 16:9，支援較舊瀏覽器。
- 影片網址來自課程 API，頁面使用 Vimeo Player 載入播放；回到開頭會暫停並定位至 0 秒，不會自動播放。仍需確認正式影片網址與實機播放狀況。
- 不需看完影片即可進入本堂測驗；返回按鈕可回學習地圖。

### 題庫、測驗與進度續接

- 執行中的課程與測驗畫面從 progress/get 取得課程、題目、選項、正解及 HCP 進度；quiz-content.json 是早期本機假資料，現在不作為頁面資料來源。
- 題目依 API 的 questionId、order、options 逐項繪製，不固定題數或選項數量；實際內容由後端課程資料決定。
- 送出答案時呼叫 progress/update 的 submitAnswer，由後端判定正確與否並更新該堂進度。若尚未建立課程進度，前端會依 PROGRESS_NOT_FOUND 補送 startCourse 後重送答案。
- LearningGameCourseService 在頁面間共用目前課程、HCP 與進度快照；首頁重新進入會更新進度，課程頁及測驗頁依 productKey 載入資料。
- 測驗進度由後端保存，重整或重新進入時依 API 回傳的已答對題目定位；未送出的選取不會成為後端進度。
- 答錯可重試並留在原題；答對後前進。第三題答對後由後端完成該堂，首頁再讀取最新進度。
- 已完成課程再次進入時依後端 completed 狀態顯示鎖定畫面與最後一題的正確答案。
- 目前不以 localStorage 作為課程進度的正式資料來源。是否能續接取決於登入身分、productKey 與後端回傳進度。

### 題目、選項排版與載入動畫

- 字級與行高由 CSS 設定，瀏覽器依文字容器寬度、內距與字型實際換行；不靠字數估算，也不逐字縮小字級。
- 題目框設定最小高度，長題目由內容撐高；另依畫面回饋調整題目文字的垂直位置。
- 選項使用「文字實際高度 ÷ line-height」推算行數，再搭配一至三行的框圖；文字在不同裝置寬度下重新排版。
- 首頁、課程、測驗與證書頁共用載入器，等待圖片、CSS 背景及字型；載入動畫至少顯示 700ms，整合範圍限學習遊戲頁面。
- 測驗頁在隱藏量測區，以與正式選項相同的寬度、字級與內距先量完整堂三題的所有選項，並預載三種框圖。
- 正式內容保持隱藏至量測與框圖準備完成；切題直接使用已算好的框型，取消「未量測就先套單行框」的預設。
- 尺寸改變時由 `ResizeObserver` 重新量測，並立即更新 OnPush 畫面，避免等待其他事件才套用結果。

### 證書頁與下載

- 證書頁進入時依網址的 productKey 重新呼叫 progress/get；僅在後端狀態為 completed 且有 certifiedAt、課程與 HCP 資料時顯示證書，否則返回學習地圖。
- 姓名與專業別取自 progress/get 回傳的 HCP 資料；認證日期取自 progress.certifiedAt，使用 Asia/Taipei 時區格式化。
- 證書輸出為原始底圖尺寸 1360 × 1600 的 PNG，包含證書底圖、姓名、專業別、文案與認證日期；不合成天空、草地及城堡場景。
- 下載流程取得本機 Canvas 產生的 File，直接呼叫 downloadLocalFile()；函式建立 Blob URL，再建立臨時 a 標籤、設定 download 並觸發 click。下載本身不需 Firebase 上傳。
- downloadTest=1 測試模式會顯示一般連結與「測試直接呼叫 downloadLocalFile」按鈕；測試按鈕使用已準備好的個人化證書 File，直接呼叫同一個下載函式。
- 這只確認前端呼叫路徑已接好，不代表 LINE 內建瀏覽器一定會執行 a download。LIFF iOS／Android、Safari、Chrome 的實際下載行為仍需逐一驗證。
- 下載與分享共用證書圖片產生方法；操作期間停用按鈕，結束後恢復。離開頁面後會取消等待中的工作，避免更新已銷毀的頁面。

## LINE 分享與下載：目前狀態

### 分享流程

1. 分享按鈕先確認 LIFF 分享條件；需要時透過 LINE ID token 建立 Firebase 使用者登入。
2. 前端以 Canvas 產生包含 HCP 姓名、專業別、認證日期與證書文案的圖片，並上傳到 Firebase Storage 取得 HTTPS 網址。
3. 以 LIFF shareTargetPicker 傳送 image message，由 LINE 顯示好友／聊天室選擇器。外部瀏覽器情境會轉到 LIFF 分享流程。
4. 同一份證書資料的圖片網址會快取於頁面，避免重複上傳。

### 尚待驗證

- 確認測試站 Firebase project、Storage bucket、登入交換流程與 Storage rules 允許目前的使用者上傳及取得圖片網址。
- 在 LINE iOS／Android WebView 實際確認好友／聊天室選擇器、送出、取消、失敗後重試與重複分享。
- 在 LINE WebView 分別測試證書下載；下載採本機 Blob URL 與 a download，程式不會自行把頁面切換到 Safari／Chrome。
- 測試站部署由 .github/workflows/gke-deploy-stage.yml 的 s* tag 觸發。最新本機 tag 為 s2.1.261；須在 GitHub Actions 確認 build-stage 與 Firebase Hosting 部署成功。
- 固定圖片、個人化圖片與 LINE message 的格式需求仍應以正式 API／後端契約及 LINE 官方規格為準。

參考：[LINE 分享 API](https://developers.line.biz/en/reference/liff/#share-target-picker)、[圖片訊息規格](https://developers.line.biz/en/reference/messaging-api/nojs/#image-message)、[本機 LIFF 開發方式](https://developers.line.biz/en/tips/2026/10/15/configure-the-liff-development-environment/)

## 元件與素材對照

以下元件檔案均相對於 `src/app/awiqli/learning-game/`。

| 檔案／目錄 | 用途 |
| --- | --- |
| `../awiqli.module.ts` | 學習地圖、課程、測驗與證書路由。 |
| `learning-game.component.*` | 首頁素材、關卡百分比定位、進度、仿單與證書入口。 |
| `learning-game.mock-data.ts` | 早期假帳號與初始進度資料；目前 API 頁面不讀取此檔。 |
| `learning-game-progress.service.ts` | 早期 localStorage 假進度流程；目前頁面進度由 LearningGameCourseService／後端 API 提供。 |
| `course-page/course-content.ts` | 早期本機課程假資料；目前課程頁使用 API 內容。 |
| `course-page/course-page.component.*` | 課程版面、16:9 影片框、摘要、返回與測驗入口。 |
| `quiz/quiz-content.json` | 早期六堂本機假題庫；目前測驗頁讀取 API 課程內容。 |
| `quiz/quiz-page.component.*` | 逐題作答、提示、鎖定畫面、隱藏量測與選項適配。 |
| `page-loader/learning-game-page-loader.component.*` | 四種學習遊戲頁面的載入動畫與準備時序。 |
| `learning-game-api.service.ts` | progress/get、progress/update 的 HTTP API 呼叫。 |
| `learning-game-course.service.ts` | 共用 API 課程、HCP 與進度快照。 |
| `learning-game.models.ts` | 後端課程、題目、HCP、進度及作答型別。 |
| `certificate-page/certificate-page.component.*` | 證書畫面、Canvas PNG、Blob URL 下載、Firebase Storage 上傳及 LIFF 分享。 |
| `certificate-page/certificate.mock-data.ts` | 舊版證書假資料；目前證書頁使用 API 回傳的 HCP 資料。 |

圖片統一放在 `src/assets/awiqli/learning-game/` 及其 `course/`、`quiz/`、`certificate/` 子目錄；首頁包含未完成／完成地圖與 `progress-pen-0.png`～`progress-pen-6.png`。圖片以本機路徑引用，不依賴 Figma 暫存網址。

## 驗證紀錄與限制

- **選項版面：** 以隔離的本機 Chrome 檢查 `320`、`390`、`720`、`1024 CSS px`，涵蓋六堂共 18 題的首次顯示與切題，共 72 個題目呈現組合；未再量到先顯示單行框、之後放大的情況。
- **下載證書：** 實際按下下載，檢查 `1360 × 1600` PNG；姓名、專業別、三行文案及日期皆有繪製，文字邊界未超出圖片，並已開啟輸出圖片做視覺確認。
- **按鈕恢復：** 已先重現下載後兩個按鈕仍停用，再檢查連續兩次下載、分享轉下載、分享成功、取消、分享失敗、下載失敗及失敗後重試，共八種情境；四次下載均實際產生 PNG，檢查通過。
- **早期分享測試界線（2026-10-19）：** 當時分享成功／取消／失敗使用模擬系統分享 API，未向真實聊天室送出訊息；不代表目前 LIFF shareTargetPicker 已完成實機驗收。
- **建置：** 課程 change 的 `validation.md` 記錄 2026-10-14 建置通過；2026-10-19 執行 `npm run build-stage` 時 bundle 與 assets 已產生，但 index 階段因環境無法連到 `fonts.googleapis.com`（`ENOTFOUND`）而未完成。不能把最近一次完整建置列為成功。
- `git diff --check` 通過。Chrome 本機尺寸檢查不取代 iOS／Android LINE WebView、實機安全區與正式測試站的整合驗收。

## 完成條件與後續工作

- [x] 首頁地圖、banner、外框、HUD、六關入口與百分比定位。
- [x] 首頁讀取 API 課程順序與進度，呈現完成數、進度筆、完成版地圖及證書入口。
- [x] 六堂共用課程頁、課程摘要、第二堂無摘要的停用狀態及 Vimeo 影片頁。
- [x] 串接 progress/get、startCourse、submitAnswer，依後端進度完成課程續接與鎖定狀態。
- [x] 測驗排版、錯答重試、載入動畫與選項預先量測。
- [x] 證書頁使用後端 HCP／認證資料，產生含個人化文字的 PNG。
- [x] 證書下載改為本機 File → Blob URL → a download，測試模式可直接呼叫 downloadLocalFile。
- [x] 實作 LIFF shareTargetPicker 與 Firebase Storage 個人化證書上傳程式。
- [x] 封存首頁、課程頁與 quiz flow 的 OpenSpec change。
- [ ] 確認 s2.1.261 tag 已推至遠端，並檢查 GitHub Actions 的 build-stage 與測試站部署結果。
- [ ] 在 LINE iOS／Android WebView 驗證分享選擇器、Firebase 上傳、取消／失敗後重試及證書下載。
- [ ] 確認 HCP 身分切換、跨裝置進度續接與後端權限行為。
- [ ] 確認六堂正式影片 URL、Vimeo 播放及重播操作。
- [ ] 確認最新題目文案、法遵 code 與 GIF 延伸需求的正式範圍／素材。
- [ ] 排除環境字型下載問題後，完成最新版本完整建置與測試站驗收。
- [ ] 補上實機畫面、最新 PR／部署 Action 證據與驗收結果。

## 本機檢視方式

目前 repo 沒有 local script，啟動方式為：

    cd /Users/oscar/Documents/nnhcp-liff-main
    npm start

開啟 http://localhost:4200/awiqli/learning-game，並帶入有效的 productKey 與專案所需 LIFF 使用者情境。localhost 的 AuthGuard 放行只代表可載入前端路由；課程內容、題目、進度與作答仍需呼叫後端 API，不能再用清除 localStorage 的方式重設正式進度。

測試 API 進度需使用對應測試 HCP／LIFF 身分與 productKey。若要重新從 0/6 操作，需使用後端提供的測試資料重設方式或新的測試帳號；不要直接假設 localStorage key 會重設進度。

證書頁需後端回傳六堂完成、HCP 資料及 certifiedAt。下載測試可在網址加 downloadTest=1 顯示測試控制；「測試直接呼叫 downloadLocalFile」會下載本機產生的個人化證書，但瀏覽器實際是否接受下載仍需在目標裝置確認。

本機建置指令為 npm run build-stage 或 npm run build；最近一次環境問題與驗證界線見前節。

## 我的學習與反思

RWD 需要依元素的用途選擇排版方式：地圖素材保持比例，點擊區依百分比定位，標題與 HUD 使用彈性排列；題目與選項則交由瀏覽器依實際容器寬度換行，不能用字數直接推定行數。

載入完成也不只代表圖片下載完畢。字型、文字排版、選項框型與框圖都準備好，第一次顯示才會穩定；同時先量整堂課的選項，才能處理切到下一題仍突然變大的問題。

Canvas 輸出與頁面預覽是不同的繪製流程，必須確認縮放倍率、座標與字型；這次姓名消失就是因為座標重複縮放。OnPush 頁面的非同步操作結束後，也需要明確更新畫面，讓按鈕狀態恢復。

LINE 好友選擇由 LIFF shareTargetPicker 提供；個人化證書分享還需要 Firebase Storage 產生 LINE 可讀取的 HTTPS 圖片網址。下載路徑則使用本機 Blob URL 與 a download，並不依賴 Firebase。兩條流程需要分開驗證。

## Progress

### 2026-10-05

- 確認目前實作位於 `nnhcp-liff-main` 的 `feat/awiqli-dose-converter` 分支與 `src/app/awiqli/learning-game/`。
- 建立並使用中文 OpenSpec change `awiqli-home-rwd`；當時 Stage 1、2 共 5 項任務已勾選完成，Stage 3 的 2 項驗收仍待執行。
- 首頁初版已有本機 commit `0cd7799`，包含路由、頁面與本機素材。
- 依使用者回饋調整地圖底端不留空白、HUD 疊在前景，以及外框顯示於標題列上層。
- 依 Figma banner 節點取得 `450 × 150` 透明底 Logo，新增 `awiqli-logo.png` 並更新引用。
- 使用者當時回饋手機版表現不錯，平板版型調整暫緩；後續工作狀態見下列日期。

### 2026-10-06

- `awiqli-home-rwd` 的任務已全數勾選並封存至 `2026-10-06-awiqli-home-rwd/`。
- 後續首頁加入六關百分比點擊定位，持續調整手機、平板與桌面上的標題與進度筆。

### 2026-10-14

- 課程頁完成六關內容對應、摘要 popup、返回與第 2 堂無摘要的停用狀態，封存 `awiqli-course-page`。
- 建立進度服務及本機題庫，完成 quiz flow 的主要流程；首頁改讀共用保存進度。
- 代表提交：`f860b70`（persistent quiz progress service）、`dd6f527`（persisted progress on home）、`9d3a83d`（quiz flow）。

### 2026-10-19

- 確認 quiz flow tasks 全部完成，封存至 `2026-10-19-awiqli-quiz-flow/`。
- 首頁加入仿單連結、完成版城堡旗子，以及全部課程完成後的城堡證書入口。
- 完成證書頁與返回標頭、可捲動背景、按鈕圖示間距；下載內容確定為證書本體。
- 改以實際排版行數選擇選項框，加入頁面載入動畫，並以整堂隱藏預先量測修正切題時由單行框放大的問題。
- 各課程影片框統一調整為 16:9。
- 修正下載證書缺少姓名／專業別，以及下載或分享後按鈕維持停用的問題；完成實際 PNG 與八種按鈕狀態檢查。
- 最近提交：`e87b43b`（premeasure quiz options）、`cbc2b2a`（16:9 video frame）、`14da520`（certificate export and action buttons）。
- 釐清 LINE 好友選擇屬前端串接，確認 repo 已有共用分享封裝；下一步先用固定假資料證書與測試 LIFF 驗證，個人化圖片上傳 API 仍待確認。
- 更新任務筆記；狀態維持 `in-progress`，未把真實影片、後端、LINE 分享與部署列為完成。

### 2026-10-21

- 將學習遊戲接入 API 的目前狀態補入任務摘要：課程、題目、HCP 與進度由 progress/get 載入，startCourse／submitAnswer 由 progress/update 處理；執行中的頁面不再以 localStorage 假資料作為進度來源。
- 證書頁改為等待 API 載入 HCP 姓名、專業別與 certifiedAt，確認後才產生證書。
- 下載流程直接呼叫 downloadLocalFile()：使用本機 Canvas File 建立 Blob URL，建立帶 download 的臨時 a 標籤並觸發下載，不需要 Firebase Storage。
- 測試區保留一般連結測試，另一個測試按鈕直接呼叫 downloadLocalFile()。此項是程式路徑調整，尚未證明 LINE WebView 會成功下載。
- 解決 stage/s2.1.0 合併衝突時保留 API HCP／進度載入流程，同時合入功能分支下載 helper。功能提交為 7693df9，stage 合併提交為 0711551。
- 本機可見 tag 2.1.261 與 s2.1.261；部署 workflow 只匹配 s* tag。此工作區無法連到 GitHub 核實遠端 tag 與 Actions 結果，需到 GitHub 確認是否已推送 tag、build-stage 是否成功及測試站是否更新。
- 合併結果的 git diff --cached --check 通過；本次沒有執行完整 build，也沒有做 LINE iOS／Android 實機下載或分享驗收。

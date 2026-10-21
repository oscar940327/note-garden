---
title: Awiqli HCP Learning Game UI
status: in-progress
updated_date: 2026-10-19
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

目前已從首頁靜態切版推進至可使用單一假帳號操作的前端流程。題庫使用本機 JSON，進度保存在 `localStorage`，影片與正式後端尚未串接；LINE 專用分享列為下一步，不將現有系統分享視為已完成 LINE 好友／聊天室分享。

## 目前進度摘要（2026-10-19）

- **首頁：** 六關使用百分比定位，可導向對應課程；進度、筆與完成版地圖讀取共用進度服務。全部完成後，認證告示牌與城堡都可進入證書頁，另有仿單連結。
- **課程頁：** 依 `courseId` 顯示各堂課名與摘要；第二堂沒有摘要，按鈕反灰停用。影片框已改成 16:9，目前仍為靜態預覽。
- **測驗：** 六堂共 18 題，包含選取、送出、錯答重試、答對前進、每堂完成提示與已完成課程鎖定狀態；各堂可分別續接。
- **文字與載入：** 題目框依內容延伸；選項改以實際排版行數選框。在載入動畫期間先隱藏量完整堂課的選項，並預載框圖，避免顯示後或切題時由單行框突然放大。
- **證書：** 已完成頁面、返回地圖與 PNG 下載；輸出證書本體，包含姓名、專業別、完整文案及認證日期。姓名／專業別目前使用「王小明／醫師」假資料。
- **分享：** 目前使用系統分享，裝置不支援時改為下載。LINE 好友／聊天室選擇尚未接上；repo 已有 `LiffService.forcedLiffShare()` 可作為串接基礎。
- **OpenSpec：** `awiqli-home-rwd`、`awiqli-course-page`、`awiqli-quiz-flow` 均已封存，三份 tasks 皆已勾選完成。
- **提交狀態：** 本機最新 commit 為 `14da520`，目前工作目錄乾淨。本次未查核遠端 PR、合併與測試站／正式站部署狀態。

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
- 題目與摘要依 PRD 指定的 Google Sheet 內容整理；目前以 repo 本機內容提供前端使用。

### OpenSpec 紀錄

| Change | 本機封存位置 |
| --- | --- |
| `awiqli-home-rwd` | `openspec/changes/archive/2026-10-06-awiqli-home-rwd/` |
| `awiqli-course-page` | `openspec/changes/archive/2026-10-14-awiqli-course-page/` |
| `awiqli-quiz-flow` | `openspec/changes/archive/2026-10-19-awiqli-quiz-flow/` |

封存表示各 change 當時的範圍已結束，不等同正式後端、影片、LINE 分享或實機驗收全部完成。OpenSpec 目前由 `.gitignore` 忽略，交接時需另行確認文件保存方式。

## 我負責的工作

- 確認 repo、分支、既有 Angular 路由與 LIFF 環境，使用 `loadComponent` 載入 standalone 頁面。
- 讀取 Figma、匯出本機素材，實作首頁、課程、測驗與證書畫面及 RWD。
- 以 OpenSpec 整理中文 proposal、spec、design 與 tasks，依階段開發並封存完成的 change。
- 建立本機題庫、單一假帳號與進度服務，串接首頁、課程與測驗流程。
- 修正素材白底、外框層級、百分比定位、題目溢出、選項尺寸跳動與載入時序問題。
- 以 Canvas 合成證書，處理下載、系統分享及非同步按鈕狀態。
- 整理 LINE 分享的前端責任、圖片網址需求與測試方式，待下一步實作。

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
- 影片目前只有靜態預覽與控制項樣式，尚未串接 Vimeo、實際播放或重播。
- 不需看完影片即可進入本堂測驗；返回按鈕可回學習地圖。

### 題庫、測驗與進度續接

- `quiz/quiz-content.json` 保存六堂共 18 題，每堂三題，包含題目、選項 ID、選項文字與正解 ID。
- 畫面依 `question.options` 逐項繪製，沒有固定只顯示四個選項；正式題數與選項數量仍依內容規格管理。
- 答錯可無限重試，顯示通用錯答提示；按「再試一次」清除選取並留在原題，不使用未提供的個別提示。
- 假進度保留每題最近一次送出結果，同題答對後覆寫先前錯答；尚未送出的選取不保存。
- 答對前進下一題，第三題答對後記錄本堂完成、顯示完成 popup，返回地圖時立即更新進度。
- 已完成課程再次進入時顯示第三題及先前正確答案，內容反灰並停用操作。
- `LearningGameProgressService` 統一管理進度；localStorage key 為 `awiqli-learning-game-progress-v1`，初始為單一假帳號的 `0/6`。
- 各堂獨立保存答題位置，同裝置、同瀏覽器重新整理或關閉後再開可續接；瀏覽器操作不會改寫 repo 的假資料檔案。
- 目前清除 localStorage、換裝置或換網址不會自動恢復進度；正式帳號綁定、跨裝置與後端保存尚未串接。

### 題目、選項排版與載入動畫

- 字級與行高由 CSS 設定，瀏覽器依文字容器寬度、內距與字型實際換行；不靠字數估算，也不逐字縮小字級。
- 題目框設定最小高度，長題目由內容撐高；另依畫面回饋調整題目文字的垂直位置。
- 選項使用「文字實際高度 ÷ line-height」推算行數，再搭配一至三行的框圖；文字在不同裝置寬度下重新排版。
- 首頁、課程、測驗與證書頁共用載入器，等待圖片、CSS 背景及字型；載入動畫至少顯示 700ms，整合範圍限學習遊戲頁面。
- 測驗頁在隱藏量測區，以與正式選項相同的寬度、字級與內距先量完整堂三題的所有選項，並預載三種框圖。
- 正式內容保持隱藏至量測與框圖準備完成；切題直接使用已算好的框型，取消「未量測就先套單行框」的預設。
- 尺寸改變時由 `ResizeObserver` 重新量測，並立即更新 OnPush 畫面，避免等待其他事件才套用結果。

### 證書頁與下載

- 證書頁需六堂皆完成才可進入，頁首沿用測驗頁的返回樣式，背景可隨頁面捲動。
- 姓名與專業別取自 `certificate.mock-data.ts`，目前為「王小明／醫師」，尚未接正式 HCP 身分。
- 日期取自進度中的認證時間，必要時以最後一堂完成時間補上，顯示採 `Asia/Taipei` 時區。
- 已確認先下載「證書本體」，包含底圖、姓名、專業別、完整三行證書文案與日期，不合成天空、草地及城堡場景。
- 目前輸出為原始底圖尺寸 `1360 × 1600` 的 PNG；這是程式實作選擇，不代表 PRD 已指定下載尺寸或檔案格式。
- 已修正姓名／專業別座標重複乘縮放倍率，導致文字被畫到圖片外的問題；Canvas 使用的字型也先載入。
- 下載與分享共用圖片產生方法；處理期間暫停兩個按鈕，成功、取消或失敗後恢復，離開頁面後避免再更新已銷毀的畫面。

## LINE 分享：下一步實作順序

目前 `shareCertificate()` 使用 `navigator.share()` 開啟系統分享；不支援時下載 PNG。LINE 好友／群組／聊天室選擇尚未完成，以下為規劃，不列為已實作成果。

1. **準備測試證書：** 先將含假姓名的完整 PNG 放入 `src/assets/awiqli/learning-game/certificate/certificate-share-demo.png`。部署後取得 HTTPS 網址，用固定圖片測通流程；若同張圖片作預覽，檔案需符合預覽圖 1 MB 上限。
2. **接上前端分享：** 在證書頁注入 `LiffService`，參考 `src/app/shared/liff.service.ts` 的 `forcedLiffShare('nnhcp', messages)`，準備 `type: 'image'`、`originalContentUrl` 與 `previewImageUrl`。好友選擇畫面由 LINE 提供，前端負責呼叫與狀態處理。
3. **補齊結果處理：** 現有共用函式沒有回傳分享成功／取消結果，且自行攔截錯誤，需調整契約後才能正確顯示證書頁提示；同時確認 SDK 可用性與實際登入狀態。
4. **確認測試 LIFF：** 使用測試 LIFF ID，確認 Endpoint、LINE 登入與 `shareTargetPicker` 已啟用。`package.json` 的 `serve:liff` 與 `environment.ts` 設定的 LIFF ID 不同，須先核對用途與目標。
5. **測試站實測：** 分享邏輯寫好後部署到測試站，以手機 LINE 的測試 LIFF 連結進入；驗證選擇對象、確認送出、取消、失敗與重複操作。localhost 的進度不會自動帶到測試站網址。
6. **個人化圖片串接：** 取得上傳／產圖 API 契約後，把固定圖片網址改成個人化證書及預覽圖網址。LINE 圖片訊息不能直接使用本機 `File` 或 `blob:` URL；目前尚未確認後端是否已有此 API。

本機可先完成程式與模擬；真實選擇對象需在已初始化並登入的 LIFF 環境驗證。除測試站外，也可用 HTTPS 隧道搭配獨立測試 LIFF 存取本機程式。

參考：[LINE 分享 API](https://developers.line.biz/en/reference/liff/#share-target-picker)、[圖片訊息規格](https://developers.line.biz/en/reference/messaging-api/nojs/#image-message)、[本機 LIFF 開發方式](https://developers.line.biz/en/tips/2026/10/15/configure-the-liff-development-environment/)。

## 元件與素材對照

以下元件檔案均相對於 `src/app/awiqli/learning-game/`。

| 檔案／目錄 | 用途 |
| --- | --- |
| `../awiqli.module.ts` | 學習地圖、課程、測驗與證書路由。 |
| `learning-game.component.*` | 首頁素材、關卡百分比定位、進度、仿單與證書入口。 |
| `learning-game.mock-data.ts` | 假帳號、初始進度與進度型別。 |
| `learning-game-progress.service.ts` | 共用進度、答案保存、完成判定與 localStorage。 |
| `course-page/course-content.ts` | 六堂課標題、摘要與內容狀態。 |
| `course-page/course-page.component.*` | 課程版面、16:9 影片框、摘要、返回與測驗入口。 |
| `quiz/quiz-content.json` | 六堂共 18 題的本機題庫。 |
| `quiz/quiz-page.component.*` | 逐題作答、提示、鎖定畫面、隱藏量測與選項適配。 |
| `page-loader/learning-game-page-loader.component.*` | 四種學習遊戲頁面的載入動畫與準備時序。 |
| `certificate-page/certificate-page.component.*` | 證書畫面、Canvas 輸出與現有系統分享。 |
| `certificate-page/certificate.mock-data.ts` | 證書姓名、專業別假資料。 |

圖片統一放在 `src/assets/awiqli/learning-game/` 及其 `course/`、`quiz/`、`certificate/` 子目錄；首頁包含未完成／完成地圖與 `progress-pen-0.png`～`progress-pen-6.png`。圖片以本機路徑引用，不依賴 Figma 暫存網址。

## 驗證紀錄與限制

- **選項版面：** 以隔離的本機 Chrome 檢查 `320`、`390`、`720`、`1024 CSS px`，涵蓋六堂共 18 題的首次顯示與切題，共 72 個題目呈現組合；未再量到先顯示單行框、之後放大的情況。
- **下載證書：** 實際按下下載，檢查 `1360 × 1600` PNG；姓名、專業別、三行文案及日期皆有繪製，文字邊界未超出圖片，並已開啟輸出圖片做視覺確認。
- **按鈕恢復：** 已先重現下載後兩個按鈕仍停用，再檢查連續兩次下載、分享轉下載、分享成功、取消、分享失敗、下載失敗及失敗後重試，共八種情境；四次下載均實際產生 PNG，檢查通過。
- **分享測試界線：** 上述分享成功／取消／失敗使用模擬系統分享 API，未向真實聊天室送出訊息，也不代表 LINE `shareTargetPicker` 已驗收。
- **建置：** 課程 change 的 `validation.md` 記錄 2026-10-14 建置通過；2026-10-19 執行 `npm run build-stage` 時 bundle 與 assets 已產生，但 index 階段因環境無法連到 `fonts.googleapis.com`（`ENOTFOUND`）而未完成。不能把最近一次完整建置列為成功。
- `git diff --check` 通過。Chrome 本機尺寸檢查不取代 iOS／Android LINE WebView、實機安全區與正式測試站的整合驗收。

## 完成條件與後續工作

- [x] 首頁地圖、banner、外框、HUD、六關入口與百分比定位。
- [x] 依假進度呈現完成數、進度筆、完成版地圖與證書入口。
- [x] 六堂共用課程頁、各堂摘要與第二堂無摘要的停用狀態。
- [x] 影片框調整為 16:9。
- [x] 六堂共 18 題的測驗、錯答重試、續接與已完成鎖定。
- [x] 四種頁面的載入動畫，以及整堂選項預先量測，改善首次顯示與切題跳動。
- [x] 證書頁、證書本體 PNG 輸出、文字合成及按鈕非同步狀態恢復。
- [x] 封存首頁、課程頁與 quiz flow 的 OpenSpec change。
- [ ] 以固定假資料證書接上 LINE 分享，並在測試 LIFF 實測。
- [ ] 確認個人化證書產圖／上傳 API，取得可分享的 HTTPS 圖片網址。
- [ ] 串接真實 HCP 姓名、專業別與後端課程進度，確認跨裝置與帳號切換。
- [ ] 串接正式影片、Vimeo 播放器與重播操作。
- [ ] 確認最新內容、法遵 code 與 GIF 延伸需求的正式範圍／素材。
- [ ] 排除環境字型下載問題後完成最新版本的完整建置。
- [ ] 補上 iOS／Android LINE WebView 與 safe-area 實機驗收，以及最新 PR／部署證據。

## 本機檢視方式

目前 repo 沒有 `local` script，啟動方式為：

```bash
cd /Users/oscar/Documents/nnhcp-liff-main
npm start
```

開啟 `http://localhost:4200/awiqli/learning-game`。目前 `AuthGuard` 對 `http://localhost:` 直接放行，適合檢查假資料 UI，但不能據此認定真實 LIFF 初始化、登入或 LINE 分享已通過。

以各課程完成測驗、返回地圖，確認完成數與進度筆更新；重新整理後確認進度仍在。若要重新從 0/6 操作，可在瀏覽器開發者工具移除該網址的 `awiqli-learning-game-progress-v1`，再重新整理；這只清除本機假進度。

證書頁僅在六堂完成時開放。測試 PNG 是否包含姓名、專業別、日期及文案，並確認下載或關閉分享選單後，兩個按鈕可以再次操作。

本機建置指令為 `npm run build-stage` 或 `npm run build`；最近一次環境問題與驗證界線見前節。

## 我的學習與反思

RWD 需要依元素的用途選擇排版方式：地圖素材保持比例，點擊區依百分比定位，標題與 HUD 使用彈性排列；題目與選項則交由瀏覽器依實際容器寬度換行，不能用字數直接推定行數。

載入完成也不只代表圖片下載完畢。字型、文字排版、選項框型與框圖都準備好，第一次顯示才會穩定；同時先量整堂課的選項，才能處理切到下一題仍突然變大的問題。

Canvas 輸出與頁面預覽是不同的繪製流程，必須確認縮放倍率、座標與字型；這次姓名消失就是因為座標重複縮放。OnPush 頁面的非同步操作結束後，也需要明確更新畫面，讓按鈕狀態恢復。

系統分享、LINE 好友選擇與證書圖片上傳各有不同責任。前端呼叫 LIFF 提供選擇對象的介面，而個人化圖片需有可供 LINE 讀取的網址；先以固定假資料圖片驗證，再替換成 API 來源，可以分階段確認流程。

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

---
title: Awiqli HCP Learning Game UI
status: in-progress
updated_date: 2026-10-27
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

目前學習地圖、課程、測驗與證書頁透過 `ProductCourseApiService` 與 `ProductCourseService` 取得課程內容、HCP 身分及進度，作答送到後端保存。2026-10-22 起，同事將功能移到 `src/app/product-course/`，並改用平台上傳 API；下載改成顯示線上證書圖片供長按儲存，分享改為開啟 `nn-web-share` 再呼叫手機系統分享選單。這些後續整合與本人原先的 UI、假資料、Canvas 輸出及本機下載測試，需依 Git 紀錄區分。

## 目前進度摘要（2026-10-27）

- **首頁與課程：** 依 API 顯示課程、HCP 身分與進度；首頁完成數、進度筆、完成地圖與證書入口共用課程服務資料。影片與摘要依課程內容呈現。
- **測驗與載入：** 作答由後端判定並保存；題目與選項依實際排版調整，載入期間先量測選項，避免首次顯示或切題時框型跳動。
- **目前路由：** 改為 `/product-courses/:productKey`，功能目錄為 `src/app/product-course/`。`productKey` 是路徑參數，`courseId` 仍以 query parameter 選取課程。
- **個人化證書：** 前端以 Canvas 合成姓名、專業別、認證日期及文案，加入 Forest Green 底色與留白；上傳前產生最長邊不超過 1024px、檔案不超過 1MB 的版本。
- **正式下載按鈕：** 透過平台 API 上傳圖片，再顯示 HTTPS 圖片視窗，讓使用者長按／右鍵儲存。這個流程沒有直接呼叫本機 `downloadLocalFile()`，也不是按一下就自動切到 Safari／Chrome 下載。
- **正式分享按鈕：** 同一頁面共用已上傳的證書，開啟 `nn-web-share`。該頁讀取圖片後，透過 `navigator.share({ files: [file] })` 呼叫系統分享選單；不支援檔案分享時嘗試以 Blob URL 與 `<a download>` 下載。
- **本人下載測試：** `downloadTest=1` 的測試按鈕使用外部測試圖片 URL，先讀成 Blob／File，再呼叫 `downloadLocalFile()`；不是一般下載按鈕的流程，也不是下載個人化證書的測試入口。
- **Git 狀態：** 本機 `feat/awiqli-dose-converter` 已完成 rebase，最新提交為 `f513af5`，比 `origin/feat/awiqli-dose-converter` 多 1 筆。遠端追蹤參考為 `5bbb549`；本次未 push，也未重新部署或執行實機驗收。
- **驗證證據：** `share-certificate-via-web-share/tasks.md` 記錄 Twiggy 在 2026-10-23 完成測試站分享驗證及 AM 確認；正式 bucket 與正式站跨網域讀取仍未勾選。長按存圖的各裝置驗收，在前一份 change 中仍有未完成項目。

## 專案資訊

- Repository：<https://github.com/Aiii-Developers/nnhcp-liff-main>
- 本機 Repository：`/Users/oscar/Documents/nnhcp-liff-main`
- Feature branch：`feat/awiqli-dose-converter`
- 功能目錄：`src/app/product-course/`（2026-10-22 由原 `src/app/awiqli/learning-game/` 重構）
- 素材目錄：`src/assets/awiqli/learning-game/`
- 技術組合：Angular 17、TypeScript、HTML、SCSS、standalone component、Angular Material Dialog、Canvas、LINE LIFF、平台 Storage API、Web Share API。
- 分享頁 Repository：<https://github.com/Aiii-Developers/nn-web-share>；入口為 <https://novonordisk.aiii.ai/>。

| 頁面 | 目前路由 |
| --- | --- |
| 學習地圖 | `/product-courses/:productKey` |
| 課程影片／摘要頁 | `/product-courses/:productKey/course?courseId=course-1` |
| 測驗頁 | `/product-courses/:productKey/quiz?courseId=course-1` |
| 證書頁 | `/product-courses/:productKey/certificate` |

`productKey` 為課程專案 ID，各頁面從 `paramMap` 取得；`courseId` 依 API 課程資料選取，各堂共用課程頁與測驗頁。早期使用的 `/awiqli/learning-game` 已由重構取代，本文件 Progress 中仍保留當時路徑作為歷史紀錄。

## 需求來源

- [Figma 首頁（4899:1335）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4899-1335&m=dev)、[整體遊戲畫面（4889:5918）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4889-5918&m=dev)。
- [Figma banner（4894:1271）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4894-1271&m=dev)。
- [Figma 課程頁（4905:1689）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4905-1689&m=dev)。
- [Figma 測驗內容（4990:3427）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=4990-3427&m=dev)、[測驗狀態（5041:6237）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=5041-6237&m=dev)、[完成後配色（5041:6566）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=5041-6566&m=dev)。
- [Figma 證書頁（5041:6375）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=5041-6375&m=dev)、[證書構圖（5041:6373）](https://www.figma.com/design/5TQnJXXXOv0HXh9ZUlxyZB/諾和諾德_HCP?node-id=5041-6373&m=dev)。
- [Awiqli PRD](https://github.com/Aiii-Developers/nnhcp-docs/blob/main/%5B專案%5D%20Awiqli藥品上線HCP功能更新/評估文件/Awiqli藥品上線HCP功能更新_PRD_TBD.md)：六堂課程、測驗、進度與證書需求；文件仍為 TBD 版，正式素材與後端契約需持續確認。
- 題目、選項、課程摘要與正解以 PRD／核定內容為依據；目前畫面從 `progress/get` 回傳的課程資料讀取。早期本機題庫與假進度屬歷史實作，現行 `src/app/product-course/` 已無原本的假資料檔案。
- [nn-web-share 分享程式（本次查閱版本 `66d00e8`）](https://github.com/Aiii-Developers/nn-web-share/blob/66d00e8b715e402f3849ae251352abaf35ca1059/public/index.html)：Awiqli 證書圖片網址組合、檔名驗證、`shareFile()`、Web Share API 與下載 fallback。

### OpenSpec 紀錄

| Change | 本機封存位置 |
| --- | --- |
| `awiqli-home-rwd` | `openspec/changes/archive/2026-10-06-awiqli-home-rwd/` |
| `awiqli-course-page` | `openspec/changes/archive/2026-10-14-awiqli-course-page/` |
| `awiqli-quiz-flow` | `openspec/changes/archive/2026-10-19-awiqli-quiz-flow/` |

封存表示各 change 當時的範圍已結束，不等同後續後端、影片、分享與實機驗收全部完成。2026-10-27 本機可見上述三份封存，但 Git 狀態仍列為未追蹤；目前 `.gitignore` 沒有忽略 `openspec/`，repo 也已有其他追蹤中的 OpenSpec 文件，不能再把整個目錄視為已忽略。

後續由同事新增的相關 change 包含 `use-platform-upload-for-certificate-share`、`share-certificate-via-web-share` 與 `move-product-course-route`。分享 change 的程式與測試站項目多已勾選，但正式 bucket／正式站讀取仍有未勾選項目，不能將全部 OpenSpec 視為已完成。

## 我負責的工作

- 依 Figma 實作首頁、課程、測驗與證書畫面，處理手機、平板與桌面 RWD、素材匯出與百分比定位。
- 使用 OpenSpec 撰寫繁體中文 proposal、spec、design、tasks，依階段開發並封存原有三份 change。
- 建立早期本機題庫、假帳號與 localStorage 進度流程，完成畫面與互動原型。
- 修正素材白底、外框層級、題目溢出、選項框尺寸跳動、字型與載入時序問題。
- 以 Canvas 合成個人化證書，調整姓名、專業別、日期、文案與按鈕狀態；嘗試本機 Blob 下載、Firebase Storage 上傳與 LIFF 好友／聊天室分享。
- 建立一般連結與 `downloadLocalFile()` 的下載測試入口，追蹤 LINE WebView 與外部瀏覽器差異。
- 維護功能分支，於 2026-10-27 解決 rebase 衝突，保留目前下載圖片視窗與原有外部圖片測試程式。

### 後續整合與實作來源

以下依 Git author 與提交內容區分本人原始實作及同事後續整合，作為交接與成果回顧的依據。

| 日期／提交 | Git author | 內容 |
| --- | --- | --- |
| 2026-10-20 `77a54a4`、`f037b90` | `carlos811009` | 課程／測驗／進度 API，以及證書 HCP 資料與認證日期串接。 |
| 2026-10-22 `ef5f2bf` | `TwiggyKang` | 移除前端 Firebase Storage 上傳，改用平台 API；下載改為顯示線上圖片視窗供長按儲存。 |
| 2026-10-22 `3f477c8`、`a4c9b51` | `TwiggyKang` | 改為 `/product-courses/:productKey` 路由，並重構目錄、元件與服務命名。 |
| 2026-10-23 `67f2c63` | `TwiggyKang` | 證書分享改為開啟 `nn-web-share`，讓分享頁呼叫系統分享選單。 |
| 2026-10-23 `5bbb549` | `TwiggyKang` | 將 `feat/awiqli-certificate-web-share` 合併至 `feat/awiqli-dose-converter`。 |
| 2026-10-27 rebase 後 `f513af5`（原提交 `657dcff` 的 author date 為 10/21） | `oscaraiii` | 將外部測試圖片讀成 Blob／File，再呼叫本機下載 helper；保留同事加入的正式下載與分享流程。 |

## 已確認的畫面與互動規格

### 首頁地圖與進度

- 地圖保持原始比例並可垂直捲動，頂部 banner、外框與底部 HUD 分層顯示；捲到最下面不額外增加尾端空白。
- 六個關卡點擊區、地圖上的筆與入口均依地圖使用百分比定位。
- 完成數由各堂課程的 `status === 'completed'` 計算，顯示 `0/6`～`6/6`，同步切換七種進度筆素材與完成版地圖。
- 地圖上的筆依 `currentCourseId` 標示目前課程，與底部表示「完成堂數」的進度筆不同。
- 六堂完成後，認證告示牌與城堡入口皆可開啟證書頁；未完成時不提供證書入口操作。
- 首頁右上告示牌連到 PRD 指定的仿單網址，位置與網址設定在 `product-course-home.component.ts`。
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

- 執行中的課程與測驗畫面從 `progress/get` 取得課程、題目、選項、正解及 HCP 進度；現行功能目錄已移除早期 `quiz-content.json`。
- 題目依 API 的 questionId、order、options 逐項繪製，不固定題數或選項數量；實際內容由後端課程資料決定。
- 送出答案時呼叫 progress/update 的 submitAnswer，由後端判定正確與否並更新該堂進度。若尚未建立課程進度，前端會依 PROGRESS_NOT_FOUND 補送 startCourse 後重送答案。
- ProductCourseService 在頁面間共用目前課程、HCP 與進度快照；首頁重新進入會更新進度，課程頁及測驗頁依 productKey 載入資料。
- 測驗進度由後端保存，重整或重新進入時依 API 回傳的已答對題目定位；未送出的選取不會成為後端進度。
- 答錯可重試並留在原題；答對後前進。原定每堂三題，現行頁面依 API 題目清單長度處理最後一題，由後端完成該堂後，首頁再讀取最新進度。
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

- 證書頁依路徑中的 `productKey` 重新呼叫 `progress/get`；後端狀態為 `completed` 且具有 `certifiedAt`、課程與 HCP 資料時才顯示，否則返回地圖。
- 姓名與專業別取自 HCP，認證日期取自 `progress.certifiedAt`，使用 `Asia/Taipei` 時區。
- Canvas 合成證書底圖、姓名、專業別、文案與日期，不合成天空、草地與城堡場景。現行版本以 `#187863` 填底，並依 `80 / 870` 的比例加入四周留白；1360 × 1600 底圖合成後為 1610 × 1850 PNG。
- 正式下載與分享共用 `getCertificateImage()`：取得本機合成圖，產生最長邊 1024px、1MB 內的版本，呼叫平台上傳 API，快取 `{ url, fileName }`。因此正式下載視窗顯示的是上傳版本，不能把先前原尺寸 PNG 的測試直接當成目前下載輸出尺寸。
- 一般「下載證書」按鈕呼叫 `downloadCertificate()`，上傳成功後設定 `downloadImageUrl`，顯示 `<img>` 與「請長按圖片以下載」。這個按鈕本身不會觸發 `<a download>`、不會自動儲存圖片，也不會開外部瀏覽器。
- `downloadTest=1` 顯示的測試按鈕則呼叫 `downloadLocalFile(downloadTestImageUrl)`：先 fetch 外部 Google 測試圖片、轉成 Blob／File，再建立 Blob URL 與 `<a download>` 觸發下載。這份測試圖片不包含個人化證書資料。
- 本機 `downloadLocalFile()` 能下載，不代表 LINE WebView 也接受 `<a download>`；顯示線上圖片供長按儲存，也不等於解決原先要求的「一按下載，自動到外部瀏覽器並下載」流程。
- 下載與分享操作期間停用按鈕，結束後恢復；離開頁面時停止等待，上傳逾時則透過 `AbortController` 中止請求。

## 分享與下載的目前流程

### 主 repo：產圖與平台上傳

1. 前端 Canvas 先產生包含姓名、專業別、日期與證書文案的圖片，再縮圖。
2. 透過 `apiFetch()` 送 `multipart/form-data` 到 `${environment.cloudrun.api}/upload-to-storage`。`apiFetch()` 在目標為已設定的 API 網址且記憶體中有 token 時，會自動帶 `Authorization: Bearer ...`。
3. FormData 包含 `file`、`site`、`remotePath=projects/nnhcp/productCourse/awiqli/certificate`、`fileName={YYYYMMDDHHmmss}_{LINE userId}.{png|jpg}` 與 `makePrivate=false`；現行版本沒有帶 `lifeNumber`。
4. API 回傳 `{ url }`；前端另外保留同次送出的 `fileName`。相同登入者、姓名、專業別與認證日期，在同一頁面共用快取，避免下載與分享各上傳一次。

目前 stage 設定的上傳 URL 是 `https://api-v2-5uvz3vc6ga-de.a.run.app/upload-to-storage`，並非先前取得的 cURL 範例網址 `https://stage-in-api.aiii.ai/api-v2/upload-to-storage`。兩個入口是否由相同部署提供服務，需要由服務設定確認，不能只因端點名稱相同就視為已驗證。證書頁已移除前端 Firebase Storage SDK 與上傳專用的 `ensureFirebaseUser()`；這不代表整個專案完全不使用 Firebase 登入或儲存服務。

上傳欄位明確帶 `makePrivate=false`，目前設計使用可公開讀取的圖片網址；圖片含個人化文字，正式存取與保留設定需由負責人確認。

### 主 repo：開啟分享頁

- `shareCertificate()` 取得已上傳圖片的 `fileName`，組出 <https://novonordisk.aiii.ai/> 的分享頁網址，參數包含 `campaign=awiqli-certificate`、`env=stage|prod`、`file`、`date` 與 `openExternalBrowser=1`。
- 在 LINE App 內呼叫 `liff.openWindow({ url, external: true })`；外部瀏覽器則用 `window.location.assign(url)` 導向分享頁。開啟外部瀏覽器的程式在主 repo。
- 目前證書分享方法已不呼叫 `assertCanShare()`、`redirectToLiffSharePicker()` 或 `shareTargetPicker()`。原有 LIFF 封裝可能仍供其他功能使用，不代表證書頁沿用該流程。

### nn-web-share：讀圖與系統分享

程式來源：[nn-web-share/public/index.html（查閱版本 `66d00e8`）](https://github.com/Aiii-Developers/nn-web-share/blob/66d00e8b715e402f3849ae251352abaf35ca1059/public/index.html)。它是多活動共用的媒體分享／下載頁，Awiqli 使用其中的證書模式。

1. 依 `campaign=awiqli-certificate` 進入證書模式，驗證 `env` 與圖片檔名格式。
2. 依 stage／prod 的 bucket 設定、固定證書目錄與 `file`，組出 GCS JSON API 下載網址（`/download/storage/v1/b/.../o/已編碼物件路徑?alt=media`）。分享頁不重新產生姓名／日期，也不負責上傳。
3. 顯示圖片，並提供「分享／下載」按鈕；使用者需要在分享頁再按一次。
4. `shareFile()` 以 `fetch()` 取得圖片 Blob，建立 `File`，將收到的檔名改為 `Awiqli-HCP-Certificate-{日期}.{副檔名}`，避免沿用含 LINE user ID 的儲存檔名。
5. 若 `navigator.canShare({ files: [file] })` 回傳可分享，呼叫 `navigator.share({ files: [file] })` 開啟手機或作業系統的分享選單；使用者可從系統提供的 App 選擇 LINE 等目的地，並非 LIFF 專用好友／聊天室選擇器。
6. 不支援檔案分享時，用 Blob URL 與 `<a download>` 嘗試下載；使用者取消分享的 `AbortError` 不顯示錯誤，其他失敗顯示提示。

### 實機與部署證據

- `openspec/changes/share-certificate-via-web-share/tasks.md` 記錄：2026-10-23 由 Twiggy 完成 iOS LINE → Safari、Android LINE → Chrome、手機外部瀏覽器、桌面分享／下載 fallback、上傳失敗與取消分享的測試站檢查；AM 當日確認分享頁外觀。
- 該文件另記錄 nn-web-share preview `s1.5.2` 與正式版 `v1.4.8` 的部署。這些是同事留下的驗證紀錄，本次沒有重新執行部署或獨立完成手機驗收。
- `use-platform-upload-for-certificate-share/tasks.md` 的各平台長按存圖、上傳請求內容與正式 bucket lifecycle 等項目仍有未勾選；不能把分享頁驗證全數視為下載需求也已完成。
- `share-certificate-via-web-share/tasks.md` 的正式 bucket 名稱與正式站 JSON API 跨網域讀取仍未勾選，正式上線前需完成。

## 元件與素材對照

以下功能檔案均相對於 `src/app/product-course/`，除非另行標註。

| 檔案／目錄 | 用途 |
| --- | --- |
| `../liff.module.ts` | 掛載 `/product-courses/:productKey`。 |
| `product-course.module.ts` | 載入地圖、課程、測驗與證書頁的 standalone component。 |
| `product-course-home.component.*` | 首頁、關卡定位、進度、仿單連結與證書入口。 |
| `course-page/course-page.component.*` | 課程版面、16:9 影片框、摘要、返回與測驗入口。 |
| `course-page/vimeo-embed-url.ts` | Vimeo 嵌入網址處理。 |
| `quiz/quiz-page.component.*` | 逐題作答、提示、鎖定狀態、隱藏量測與選項適配。 |
| `page-loader/product-course-page-loader.component.*` | 學習遊戲頁面的載入動畫與準備時序。 |
| `product-course-api.service.ts` | `progress/get`、`progress/update` API 呼叫。 |
| `product-course.service.ts` | 共用 API 課程、HCP 與進度狀態。 |
| `product-course.models.ts` | 課程、題目、HCP、進度與作答型別。 |
| `certificate-page/certificate-page.component.*` | 證書畫面、Canvas 合成、平台 API 上傳、長按下載視窗、nn-web-share 入口與本機下載測試。 |
| `../shared/api-fetch.ts` | fetch 呼叫共用封裝，在符合設定的 API 網址帶入 token。 |
| `../../environments/environment*.ts` | API 網址與 `webShare.url`、`webShare.certificateEnv`。 |
| `nn-web-share` repo 的 `public/index.html` | 證書分享頁、GCS JSON API 讀圖、Web Share API 與下載 fallback。 |

早期假資料檔案與 `learning-game-*` 命名保留在 Git 歷史，不是現行目錄。素材仍放在 `src/assets/awiqli/learning-game/`，包含 `course/`、`quiz/`、`certificate/`；素材目錄沒有隨 TypeScript 功能目錄一併改名。

## 驗證紀錄與限制

以下早期紀錄保留當時結果；改用平台上傳與 nn-web-share 後，不能直接作為目前流程的驗收證據。2026-10-27 本次只核對文件、程式與 Git 紀錄，沒有重新跑 build 或實機測試。

- **選項版面：** 以隔離的本機 Chrome 檢查 `320`、`390`、`720`、`1024 CSS px`，涵蓋六堂共 18 題的首次顯示與切題，共 72 個題目呈現組合；未再量到先顯示單行框、之後放大的情況。
- **歷史下載證書檢查（舊版）：** 實際按下下載，檢查 `1360 × 1600` PNG；姓名、專業別、三行文案及日期皆有繪製，文字邊界未超出圖片，並已開啟輸出圖片做視覺確認。
- **按鈕恢復：** 已先重現下載後兩個按鈕仍停用，再檢查連續兩次下載、分享轉下載、分享成功、取消、分享失敗、下載失敗及失敗後重試，共八種情境；四次下載均實際產生 PNG，檢查通過。
- **早期分享測試界線（2026-10-19）：** 當時分享成功／取消／失敗使用模擬系統分享 API，未向真實聊天室送出訊息；不代表目前 nn-web-share 分享頁已由本人完成實機驗收。
- **建置：** 課程 change 的 `validation.md` 記錄 2026-10-14 建置通過；2026-10-19 執行 `npm run build-stage` 時 bundle 與 assets 已產生，但 index 階段因環境無法連到 `fonts.googleapis.com`（`ENOTFOUND`）而未完成。這筆歷史建置不能列為成功；後續兩份證書 change 的 tasks 已記錄型別檢查與建置通過，但本次 rebase 後沒有重新執行。
- `git diff --check` 通過。Chrome 本機尺寸檢查不取代 iOS／Android LINE WebView、實機安全區與正式測試站的整合驗收。

## 完成條件與後續工作

以下勾選代表目前程式／文件可確認的狀態，個人與同事分工見前節。

- [x] 首頁地圖、banner、外框、HUD、關卡入口與百分比定位。
- [x] 課程、摘要 popup、16:9 影片框、測驗互動、選項預先量測與載入動畫。
- [x] 原有首頁、課程頁與 quiz flow OpenSpec change 已在本機封存。
- [x] 同事串接課程／HCP／進度與作答 API，並重構為 `product-course` 目錄及新路由。
- [x] 個人化證書 Canvas 輸出與原先本機下載測試；目前測試入口能嘗試下載外部測試圖片。
- [x] 同事接上平台 Storage API、圖片視窗長按儲存流程與 nn-web-share 分享頁。
- [x] 分享 change 已記錄 2026-10-23 測試站分享測試與 AM 確認；證據來源為同事的 tasks 記錄。
- [x] 2026-10-27 解決 rebase 衝突，提交 `f513af5`；只納入證書 HTML／TS 兩個檔案。
- [ ] 決定原先「按下載後自動開外部瀏覽器並下載」是否仍為需求；目前長按儲存流程不等同完成該要求。
- [ ] 補齊 iOS／Android LINE 內長按存圖、Safari／Chrome 及桌機另存的下載驗收。
- [ ] 確認正式站 bucket 名稱、圖片公開讀取／保留設定，以及 GCS JSON API 跨網域讀取。
- [ ] 依需要將本機 `f513af5` 推至遠端；若要部署，先確認目標提交、可用 tag 與 Actions 結果，不能沿用舊版 `s2.1.261` 作為最新部署證據。
- [ ] 確認本人三份未追蹤 OpenSpec 封存與其他未追蹤文件的保存方式；不要為解衝突而直接將整個 `openspec/` 加入提交。
- [ ] 確認 HCP 身分切換、跨裝置進度與權限、六堂正式影片及最新文案／法遵 code／GIF 範圍。
- [ ] 補上目前版本的實機畫面、部署 Action 與驗收結果，再更新任務完成狀態。

## 本機檢視方式

目前 repo 沒有 local script，啟動方式為：

    cd /Users/oscar/Documents/nnhcp-liff-main
    npm start

開啟 `http://localhost:4200/product-courses/{productKey}?site=nnhcp`，將 `{productKey}` 換成有效的課程專案 ID，並使用專案所需 LIFF 使用者情境。localhost 的 AuthGuard 放行只代表可載入前端路由；課程內容、題目、進度與作答仍需呼叫後端 API，不能再用清除 localStorage 的方式重設正式進度。

測試 API 進度需使用對應測試 HCP／LIFF 身分與 productKey。若要重新從 0/6 操作，需使用後端提供的測試資料重設方式或新的測試帳號；不要直接假設 localStorage key 會重設進度。

證書頁為 `/product-courses/{productKey}/certificate?site=nnhcp`，需後端回傳完成狀態、HCP 資料與 `certifiedAt`。網址加 `&downloadTest=1` 可顯示測試控制；「測試直接呼叫 downloadLocalFile」讀取的是外部測試圖片，不是個人化證書。一般下載按鈕仍走平台上傳與圖片視窗；本機 Blob 下載成功不能取代 LINE 內實測。

本機建置指令為 npm run build-stage 或 npm run build；最近一次環境問題與驗證界線見前節。

## 我的學習與反思

RWD 需要依元素的用途選擇排版方式：地圖素材保持比例，點擊區依百分比定位，標題與 HUD 使用彈性排列；題目與選項則交由瀏覽器依實際容器寬度換行，不能用字數直接推定行數。

載入完成也不只代表圖片下載完畢。字型、文字排版、選項框型與框圖都準備好，第一次顯示才會穩定；同時先量整堂課的選項，才能處理切到下一題仍突然變大的問題。

Canvas 輸出與頁面預覽是不同的繪製流程，必須確認縮放倍率、座標與字型；這次姓名消失就是因為座標重複縮放。OnPush 頁面的非同步操作結束後，也需要明確更新畫面，讓按鈕狀態恢復。

目前理解三種不同結果：本機 Blob／`<a download>` 是請瀏覽器下載檔案；圖片視窗是讓使用者長按儲存；`nn-web-share` 使用 `navigator.share()` 叫出作業系統分享選單。LIFF `shareTargetPicker()` 則是另一套 LINE 好友／聊天室選擇器。它們的操作、瀏覽器支援與驗收條件不同，不能只因畫面都叫「下載／分享」就當成同一件事。

查 Git history 能確認目前程式由哪些提交引入，也能區分個人原始開發與同事後續整合；不能只因改動存在自己的分支，就將所有功能列為本人實作。

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

### 2026-10-20（同事 API 串接，2026-10-27 核對）

- `carlos811009` 以 `77a54a4` 串接課程、進度與作答 API，並以 `f037b90` 將證書資料接入 `progress/get`。
- 本人原本的假資料流程與畫面，在後續整合中改讀 API；本次將實作來源補入筆記。

### 2026-10-21

- 將學習遊戲接入 API 的目前狀態補入任務摘要：課程、題目、HCP 與進度由 progress/get 載入，startCourse／submitAnswer 由 progress/update 處理；執行中的頁面不再以 localStorage 假資料作為進度來源。
- 證書頁改為等待 API 載入 HCP 姓名、專業別與 certifiedAt，確認後才產生證書。
- 下載流程直接呼叫 downloadLocalFile()：使用本機 Canvas File 建立 Blob URL，建立帶 download 的臨時 a 標籤並觸發下載，不需要 Firebase Storage。
- 測試區保留一般連結測試，另一個測試按鈕直接呼叫 downloadLocalFile()。此項是程式路徑調整，尚未證明 LINE WebView 會成功下載。
- 解決 stage/s2.1.0 合併衝突時保留 API HCP／進度載入流程，同時合入功能分支下載 helper。功能提交為 7693df9，stage 合併提交為 0711551。
- 本機可見 tag 2.1.261 與 s2.1.261；部署 workflow 只匹配 s* tag。此工作區無法連到 GitHub 核實遠端 tag 與 Actions 結果，需到 GitHub 確認是否已推送 tag、build-stage 是否成功及測試站是否更新。
- 合併結果的 git diff --cached --check 通過；本次沒有執行完整 build，也沒有做 LINE iOS／Android 實機下載或分享驗收。

### 2026-10-22（同事後續整合，2026-10-27 核對）

- `TwiggyKang` 以 `ef5f2bf` 將下載／分享圖片改由平台 `/upload-to-storage` API 上傳，移除證書頁前端 Firebase Storage SDK，下載改成 HTTPS 圖片視窗供長按儲存。
- 證書新增 Forest Green 填底與留白；正式上傳共用最長邊 1024px、1MB 內的圖片。
- `3f477c8` 與 `a4c9b51` 將路由改為 `/product-courses/:productKey`，元件與服務移至 `src/app/product-course/`。

### 2026-10-23（同事後續整合，2026-10-27 核對）

- `TwiggyKang` 以 `67f2c63` 將分享改為開啟 `nn-web-share`；LINE 內由主 repo 請求外部瀏覽器開啟，分享頁再取圖並呼叫 Web Share API。
- `share-certificate-via-web-share/tasks.md` 記錄 Twiggy 完成測試站檢查與 AM 確認，另記錄 nn-web-share preview `s1.5.2`、正式 `v1.4.8` 部署；正式 bucket 與正式站跨網域讀取仍待確認。
- 遠端追蹤參考 `5bbb549` 記錄將 `feat/awiqli-certificate-web-share` 合併至 `feat/awiqli-dose-converter`；本次只核對 Git 紀錄，沒有重新部署。

### 2026-10-27

- 發現本機功能分支正在 rebase，重播原提交 `657dcff` 時，證書頁欄位與同事新增的下載視窗發生衝突。
- 保留 `downloadImageUrl`（正式下載視窗）與 `downloadTestImageUrl`（外部圖片測試）後繼續 rebase，產生 `f513af5`，回到 `feat/awiqli-dose-converter`。
- 提交只含證書 HTML／TS；分支比遠端追蹤參考多 1 筆。沒有 push、部署或修改 stage 分支，未追蹤 OpenSpec 文件保留原狀。
- 核對目前一般下載按鈕是「上傳 → 顯示圖片 → 長按儲存」，分享是「上傳 → 開啟 nn-web-share → 再按分享／下載 → 系統分享選單」。確認原先希望自動切外部瀏覽器下載的需求尚不能據此列為完成。
- 更新任務文件中的目錄、路由、服務命名、實作分工與驗證界線；本次沒有重新執行應用程式 build 或手機實測。

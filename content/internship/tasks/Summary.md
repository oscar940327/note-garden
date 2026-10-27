---
title: 到職至今工作與任務整理
description: Oscar 自 2026 年 8 月 10 日至 10 月 27 日的實習工作成果、任務交付與協作回顧。
date: 2026-10-27
author: Oscar
tags:
  - 實習
  - 工作成果
  - 任務回顧
---

# 到職至今工作與任務整理

**姓名：Oscar｜整理期間：2026/08/10–2026/10/27｜更新日期：2026/10/27**

## 一、工作摘要

到職後，我先完成帳號、開發工具與工作流程的熟悉，從 Firebase Hosting 與 LINE LIFF 整合開始實作，接著參與 AstraZeneca 的活動邀請 API、CRESTCODE 遊戲流程改版與卡牌收藏功能，以及 Awiqli 的劑量轉換器原型和 HCP 學習遊戲。同時完成 Todo 新人訓練，將前端 Mock CRUD 延伸至後端 API、Firestore、LINE 身分驗證與雲端部署。

本次整理涵蓋 **8 項主要任務：5 項客戶相關功能任務、3 項入職與訓練實作**，另包含日常回報、需求討論、Code Review、交接與技術文件整理。任務以目前成果交付與交接收斂的角度回顧，逐項說明本人負責範圍、具體產出及團隊分工。

主要工作集中在四個面向：

- **前端功能與介面實作**：Angular 畫面、RWD、表單、測驗互動、載入狀態與 Canvas 證書。
- **後端與資料整合**：Excel 批次 API、Firestore 資料模型、CRUD、驗證與前後端契約。
- **部署與成果驗證**：Firebase Hosting、Cloud Run、GitHub Actions、Stage 測試與實際輸出檔檢查。
- **需求與協作流程**：閱讀 PRD／BRD／Figma、OpenSpec 規格拆分、PR、Review 修正及任務交接。

## 二、主要任務總覽

| 期間        | 任務                             | 本人主要工作                                                 | 交付摘要                                               |
| ----------- | -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| 08/19–08/24 | Firebase Hosting＋LINE LIFF 整合 | Hosting 部署、LIFF 初始化、登入與個人資料顯示                | 完成可由手機 LINE 開啟的整合示範                       |
| 08/24–08/31 | AZ 活動 HCP 邀請 Excel API       | 批次邀請、資料驗證、Firestore 寫入與防重、測試及 Review 修正 | 核心功能經 PR #83 合併，留下 Stage 驗證紀錄            |
| 08/25–09/15 | CRESTCODE V2-1 遊戲改版          | 六角色流程、前後端整合、資料模型、影片與報表                 | 完成主要流程與 Stage 交付，提供整合文件及 PR           |
| 09/15–09/23 | CRESTCODE V2-2 抽卡與收藏        | 規則釐清、資料設計、前端初版、API 串接及問題整理             | 前端初版與整合問題交接給負責工程師                     |
| 09/23–09/29 | Awiqli 劑量轉換器 UI Prototype   | 劑量卡、輸入驗證、滑桿、換算展示與展開區塊                   | 完成可操作原型，交付功能分支及畫面成果                 |
| 09/29–10/14 | 第二週 Todo 前端訓練             | Mock CRUD、Service 分層、LIFF 登入、API 串接與 Hosting       | 完成前端訓練實作，提供 PR、部署入口與程式導覽          |
| 10/07–10/14 | 第三週 Todo API 與部署訓練       | REST API、Firestore、LINE token 驗證及 CI/CD                 | 完成後端實作與 Cloud Run 部署，留下 API 契約及部署紀錄 |
| 10/05–10/27 | Awiqli HCP 學習遊戲              | 六關地圖、課程、測驗、RWD、載入處理與 Canvas 證書            | 交付前端成果，配合同事完成後續整合與分支收斂           |

日期表示現有紀錄可辨識的參與區間；同一客戶專案的不同功能階段分列為不同任務。

## 三、各項任務成果

### 01｜Firebase Hosting＋LINE LIFF 整合

**期間：2026/08/19–08/24｜類型：入職實作**

**任務目標**：在公司既有 Firebase 專案建立自己的 Hosting 網站，透過 LINE LIFF 完成登入、授權與使用者資料顯示。

**本人工作**：設定 Angular 建置目錄、Hosting target、前端路由與 LIFF Endpoint；完成 LIFF 初始化、登入判斷及 Profile 讀取。部署時追查空白頁與 JavaScript MIME type 問題，修正範本的 base path。

**交付成果**：完成可開啟的 Angular 示範頁，顯示 LINE 暱稱、User ID、頭像及狀態訊息，並以手機 LINE 完成實際登入與資料顯示測試。此任務建立了後續 LIFF 專案的部署與測試基礎。

紀錄依據：[完整任務紀錄](firebase-hosting-liff.md)、[08/24 工作日誌](../work-log/2026-08-24.md)。

### 02｜AstraZeneca 活動 HCP 邀請 Excel API

**期間：2026/08/24–08/31｜類型：客戶後端功能**

**任務目標**：讓 CS Team 上傳 HCP 與邀請業務的 Excel 名單後，批次建立邀請資料，下載包含註冊邀請連結的結果 Excel。

**本人工作**：閱讀 Issue 與既有註冊流程，設計 multipart API、Excel 格式及逐列錯誤處理；實作資料驗證、Firestore 邀請建立、連結產生與檔案下載。以 transaction、鎖定文件及重複請求處理降低重複建立邀請的風險，並確認活動共用驗證碼與既有註冊流程的相容性。

**交付成果**：完成批次邀請 API，規格上限為 10,000 筆資料及 10 MB 檔案；錯誤列不阻斷其他有效資料。核心功能經 [PR #83](https://github.com/Aiii-Developers/astrazeneca-hcp-api/pull/83) 合併至 main。留下自動化測試、型別檢查、建置及 Stage Excel／Firestore／LIFF 核心流程驗證紀錄。

**協作與收尾**：配合 Julie 協助驗證、工程師 Review 與 PR 流程，將 LIFF ID 改為環境設定，並集中管理 TypeScript 型別與註解。任務筆記保留核心合併與後續 Stage 修正的不同版本，便於追溯。

紀錄依據：[完整任務紀錄](astrazeneca-hcp-invite-excel-api.md)、[08/26 工作日誌](../work-log/2026-08-26.md)、[08/31 工作日誌](../work-log/2026-08-31.md)。

### 03｜CRESTCODE V2-1 遊戲使用流程改版

**期間：2026/08/25–09/15｜類型：客戶前後端整合**

**任務目標**：將既有遊戲調整為六位家族角色的一題制案例流程，整合身分判定、作答解析、影片、教材、完成頁與 V2 報表。

**本人工作**：整理 BRD、PRD、Figma 與舊版程式的差異，跨前後端 Repository 開發。完成六角色畫面與 API 串接、每角色獨立進度與續玩、題目內容資料化，以及身分對應的結果頁。依團隊建議調整 Firestore 資料邊界，處理圖片預載、載入提示、跨角色狀態及手機影片播放問題。

**交付成果**：完成主要前後端流程與 11 個 V2 API 的建立或整合，並完成事件追蹤及每日 Excel 報表。當時後端專案測試紀錄為 230 項通過，前端 Stage build 成功；另以實際輸出檔核對 24 欄報表及完成狀態。提供前後端 Stage 版本、整合文件與 [API PR #90](https://github.com/Aiii-Developers/astrazeneca-hcp-api/pull/90)、[LIFF PR #52](https://github.com/Aiii-Developers/astrazeneca-liff-med/pull/52) 供團隊審查與交付追蹤。

**協作與收尾**：由 Tiffany 交接既有專案，與 Bryant、Ranger、Kyle 及 CS Team 討論需求、資料結構與驗收回饋，完成本人負責的開發和修正工作，將正式環境與客戶端的交付流程交由團隊統籌。

紀錄依據：[完整任務紀錄](AZ_crestcode_V2-1.md)、[09/14 工作日誌](../work-log/2026-09-14.md)、[09/15 工作日誌](../work-log/2026-09-15.md)。

### 04｜CRESTCODE V2-2 每日抽卡與卡牌收藏

**期間：2026/09/15–09/23｜類型：客戶功能延伸與交接**

**任務目標**：在既有挑戰流程中加入 11 張卡牌的每日抽卡、跨角色收藏、收藏總覽與翻面互動。

**本人工作**：交叉比對 PRD、Issue、會議文件與 Figma，釐清每日首抽新卡、同日重玩同卡、午夜跨日、恢復原局及集滿卡牌等規則。規劃遊玩紀錄與玩家收藏的資料生命週期、API 契約及前後端 OpenSpec 工作，並完成部分後端開發、前端初版、素材對應與 API 串接。

**交付成果**：產出可追溯的抽卡規格、資料設計及驗收案例；盤點 11 組卡牌正面、背面、黑卡及介面素材，共 35 個檔案。前端已有抽卡與收藏介面，當時 Stage build 成功，抽卡元件測試 41 項通過。

**協作與收尾**：因時程安排，後端後續由 Bryant 接手。前端串接後，將 Review 發現的局別識別、API 欄位與收藏視窗非同步問題一併交接，完成本人階段成果及問題脈絡的移交。

紀錄依據：[完整任務紀錄](AZ_crestcode_V2-2.md)、[09/22 工作日誌](../work-log/2026-09-22.md)、[09/23 工作日誌](../work-log/2026-09-23.md)。

### 05｜Awiqli LIFF 劑量轉換器 UI Prototype

**期間：2026/09/23–09/29｜類型：客戶前端原型**

**任務目標**：依參考 HTML 與截圖，在 Angular 專案實作可操作的劑量轉換器介面，供需求確認與展示使用。

**本人工作**：建立獨立路由與元件，實作數字輸入、加減按鈕、滑桿同步、輸入驗證、每週換算展示及 Loading dose 展開／收合區塊。依畫面回饋調整完整劑量卡、頻率列、範圍標籤與手機版排版。

**交付成果**：完成可在瀏覽器操作的 UI Prototype，初版程式已提交並推送功能分支；09/29 日誌記錄了展示驗收與小幅修正。Loading dose 以欄位及規則提示呈現，交付範圍為介面原型，醫療公式的決策由需求與醫學團隊負責。

紀錄依據：[完整任務紀錄](awiqli-dose-converter-ui.md)、[09/29 工作日誌](../work-log/2026-09-29.md)。

### 06｜第二週新人訓練：Todo 前端與 LIFF

**期間：2026/09/29–10/14｜類型：前端訓練實作**

**任務目標**：以 Angular 建立團隊待辦清單，透過 Service 分層完成 Mock CRUD，再延伸至 LIFF 登入與真實 API 串接。

**本人工作**：完成清單、新增、編輯、完成狀態切換、刪除、空狀態及錯誤處理。將資料操作集中於 Service，讓 Mock 可替換為 API；加入 LIFF 初始化、登入狀態、LINE ID token、401 重新登入與欄位轉換。依驗收回饋簡化互動與元件，並撰寫程式碼導覽。

**交付成果**：Mock 主線留有 30 項測試通過及 local build 紀錄；之後完成 Firebase Hosting 部署與手機開啟測試，再將 Todo Service 改接後端。交付 [前端 PR #1](https://github.com/Aiii-Developers/Oscar-liff-demo/pull/1)、API 契約與程式閱讀文件，並保留 [Todo 展示入口](https://oscar-todo-list.web.app/todo-list)。

紀錄依據：[完整任務紀錄](engineer-training-week2.md)、[10/07 工作日誌](../work-log/2026-10-07.md)、[10/13 工作日誌](../work-log/2026-10-13.md)。

### 07｜第三週新人訓練：Todo API 與雲端部署

**期間：2026/10/07–10/14｜類型：後端與部署訓練實作**

**任務目標**：將 Todo 前端串接真正的 REST API 與 Firestore，建立可部署到個人 GCP 環境的完整練習。

**本人工作**：以 Bun／Elysia 實作 Todo 的 GET、POST、PATCH、DELETE，處理輸入驗證、ID、時間與操作者欄位，並加入 LINE ID token 驗證。整合 Angular 前端，撰寫 API 契約與 OpenAPI，調整 Docker／GitHub Actions，處理 Artifact Registry 與 Cloud Run 部署權限問題。

**交付成果**：完成 API 與 Firestore 資料存取實作，透過 `s0.1.2` 版本成功部署至個人 Cloud Run。紀錄包含 GitHub Actions 部署成功、服務健康檢查，以及匿名 Todo 請求回傳 401。留下本機新增／修改資料與欄位保留驗證、[後端 PR #2](https://github.com/Aiii-Developers/Oscar-api-demo/pull/2) 及部署說明，完成從畫面、API 到資料庫的訓練實作。

紀錄依據：[完整任務紀錄](engineer-training-week3.md)、[10/12 工作日誌](../work-log/2026-10-12.md)、[10/13 工作日誌](../work-log/2026-10-13.md)。

### 08｜Awiqli HCP Learning Game 前端

**期間：2026/10/05–10/27｜類型：客戶前端與整合協作**

**任務目標**：依 Figma 與 PRD 製作六堂課的學習地圖、影片課程、摘要、逐題測驗、進度呈現與個人化證書。

**本人工作**：完成手機、平板與桌面的 RWD、地圖百分比定位、六關入口、課程摘要及測驗互動。建立早期假資料與進度原型，以 OpenSpec 管理首頁、課程與測驗三個階段；處理題目溢出、選項框跳動、字型／圖片載入、16:9 影片框與完成狀態。以 Canvas 合成姓名、專業別及日期，修正證書文字與下載／分享後按鈕狀態，並維護下載測試及分支整合。

**交付成果**：交付學習遊戲主要前端畫面、互動與證書輸出。本人三份 OpenSpec change 已在本機封存；選項版面留有 4 種寬度、18 題共 72 個呈現組合的瀏覽器檢查紀錄，證書留有實際 PNG 與 8 種按鈕狀態情境的檢查紀錄。

**協作與收尾**：Carlos 完成後續課程、作答、HCP 與進度 API 串接；Twiggy 完成平台圖片上傳、長按儲存、`nn-web-share` 分享頁及路由重構。本人配合後續整合，保留正式流程及本機下載測試，並於 10/27 處理 rebase 衝突。報告依此區分個人原始開發與團隊整合成果。

紀錄依據：[完整任務紀錄與分工表](Awiqli-HCP-Learning-Game-UI.md)、[10/14 工作日誌](../work-log/2026-10-14.md)、[10/19 工作日誌](../work-log/2026-10-19.md)。

## 四、其他工作與工程實務

### 入職準備與日常協作

- 完成公司帳號、GitHub、Firebase／GCP 權限與開發工具設定，閱讀新人教育訓練影片並熟悉專案範本。
- 在 workspace 建立個人介紹並走分支及 PR 流程，依團隊要求回報每日工作與進度。
- 參與 Project Team 例會、需求與交接會議，閱讀 BRD、PRD、Issue、Figma 及既有程式，向 PM 與工程師確認需求差異。
- 配合 Reviewer、PM 與主要負責工程師調整功能，將驗收回饋轉為可追蹤的修改與交接內容。

### 開發方式與文件整理

- **規格拆分**：使用 OpenSpec 整理 proposal、design、specs 與 tasks，將大型需求拆成可分階段實作及驗證的工作。
- **版本與交付管理**：實際操作功能分支、PR、Review、Stage tag、合併與 rebase，調整開發前確認分支及交付前檢查差異的方式。
- **測試與除錯**：結合瀏覽器 Network、API 回應、Firestore 資料、建置結果、輸出 Excel／PNG 與手機操作，判斷問題發生在畫面、契約、資料或部署哪一層。
- **AI 協作**：使用 AI coding assistant 輔助閱讀程式、拆解任務、實作與 Review，依實際需求、團隊回饋及測試結果修正產出。
- **知識留存**：持續維護工作日誌、任務案例，以及 Git Graph、SDD、OpenSpec 工作流程與 Prompt 筆記，保留成果、問題處理和分工脈絡。

## 五、交付與交接摘要

- **AZ 活動邀請 API**：以核心功能合併、Stage 測試、Review 修正與任務文件完成成果留存。
- **CRESTCODE 系列**：V2-1 交付主要前後端流程、報表與 Stage 整合成果；V2-2 移交前端初版、規格及整合問題，由負責工程師承接後續收斂。
- **Awiqli 系列**：交付劑量轉換器原型，以及學習遊戲的 UI、互動與 Canvas 證書；與 Carlos、Twiggy 的 API、平台上傳與分享整合分工已有紀錄。
- **入職與新人訓練**：完成 LIFF 示範與 Todo 前後端、資料庫及部署實作，保留程式碼、PR、展示入口、API 契約與導覽文件。

## 六、紀錄依據與補述方式

本報告依 `content/internship/` 的任務、工作日誌、技術概念及人物紀錄整理，並依本人於 2026/10/27 補充的現況，以任務成果與交付／交接收斂為整理口徑。舊筆記中的當時待辦與狀態勾選用於還原歷程，並未直接沿用為目前任務狀態。

各項成果以本人實際負責範圍敘述；測試數量與部署版本引用相應歷史紀錄。缺少精確日期、驗收細節或量測數字的部分採範圍描述，未補造紀錄。Stage、原型展示、訓練部署與正式站成果依各任務的實際交付形式表述。

參考入口：[實習筆記索引](../index.md)、[SDD 筆記](../concepts/SDD.md)、[Git 與 Git Graph](../concepts/Git%20Graph.md)、[Codex＋OpenSpec 工作流程](../concepts/workflow.md)。

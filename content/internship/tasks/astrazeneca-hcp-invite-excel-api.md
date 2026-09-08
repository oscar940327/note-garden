---
title: AstraZeneca 活動 HCP 邀請連結 Excel API
status: completed
start_date: 2026-08-24
end_date: 2026-08-31
assigned_by: Jeff
tags:
  - 實習
  - 任務
  - API
  - Excel
  - Firebase
  - Firestore
  - AstraZeneca
  - HCP
  - Bun
  - TypeScript
  - API Design
---
# AstraZeneca 活動 HCP 邀請連結 Excel API

## 專案成果摘要

實習期間，我負責從 GitHub Issue 釐清需求，並在既有的 `astrazeneca-hcp-api` 中完成一支批次邀請 API。使用者上傳包含 HCP 與邀請業務 Key 的 Excel 後，系統會驗證資料、建立 Firestore 邀請文件，最後回傳包含 HCP 註冊邀請連結的 Excel。

這項任務不只是 Excel 讀寫，也包含 API 權限、資料驗證、逐列錯誤隔離、Firestore transaction、重複請求處理、LIFF 環境設定，以及既有註冊流程的相容性確認。

主要成果：

- 完成 `POST /az-hcp/med-sales/generate-activity-invite-excel`。
- 支援最多 10,000 筆、10 MB 的 `.xlsx` 批次處理。
- 單列資料錯誤不會中斷整批作業。
- 以 transaction 與 deterministic lock 避免同一 HCP／業務組合被並行建立重複邀請。
- 同一場活動的成功資料可共用五位數驗證碼與過期時間。
- 完成單元測試、整合測試、型別檢查、建置與 Stage 手動驗收。
- 核心功能已由 Pull Request #83 合併至 `main`。
- 依 code review 將 LIFF ID 改為環境變數，並將活動邀請型別集中管理與補上中文 JSDoc。

## 我負責的工作

- 閱讀 Issue、既有前端 LIFF 流程與 Firestore schema，釐清誰產生邀請、誰使用連結及資料應寫入何處。
- 設計 multipart API、輸入／輸出 Excel 格式及錯誤處理規則。
- 實作 Excel 解析、資料驗證、Firestore 邀請建立及結果檔下載。
- 處理批次查詢、並行寫入、冪等性與同一批資料共用參數。
- 確認新功能不改變既有 HCP 註冊與 LINE 綁定規則。
- 撰寫自動化測試並在 Stage 以真實 Excel、Firebase 與 LIFF 流程驗收。
- 回應 reviewer 意見，改善環境設定與 TypeScript 型別結構。

## 任務目標

在 `astrazeneca-hcp-api` 新增批次產生活動 HCP 邀請連結的 API。

CS Team 上傳活動 HCP 名單 Excel 後，API 會逐列驗證 HCP 與邀請業務、建立 Firestore 邀請資料，最後回傳可下載的結果 Excel。API 只產生邀請連結，不產生 QR Code 圖片；CS Team 可再自行將連結轉成 QR Code。

## 專案資訊

- GitHub Issue：<https://github.com/Aiii-Developers/astrazeneca-docs/issues/20>
- Repository：<https://github.com/Aiii-Developers/astrazeneca-hcp-api>
- 本機 Repository：`/Users/oscar/Documents/astrazeneca-hcp-api`
- API Route：`POST /az-hcp/med-sales/generate-activity-invite-excel`
- Stage URL：<https://astrazeneca-hcp-api-934059698633.asia-east1.run.app>
- Stage 分支：`stage/s1.3.0`
- 功能驗收 Stage Tag：`s1.3.110`
- Review 修正驗收 Stage Tag：`s1.3.112`
- Feature 分支：`feature/activity-hcp-invite-excel-api`
- Review 修正分支：`fix/activity-invite-review-fixes`
- Pull Request：<https://github.com/Aiii-Developers/astrazeneca-hcp-api/pull/83>

## 已確認的規格

### Request

使用 `multipart/form-data`：

```txt
site
verifyCode
expiredAt（選填）
file（.xlsx）
```

- `site` 目前使用 `astrazeneca`。
- `verifyCode` 由操作人員輸入，必須是 5 位數字；同一批活動的成功列共用同一組驗證碼。
- 有提供 `expiredAt` 時，必須是包含時區的 ISO 8601 時間，例如 `2026-08-27T18:00:00+08:00`。
- 未提供 `expiredAt` 時，預設為 API 建立時間後 24 小時。
- `expiredAt` 格式錯誤或早於目前時間時，整個 request 拒絕處理。
- Excel 限制為真正的 `.xlsx` 檔案、最多 10 MB；單次最多 10,000 筆資料。

### 輸入 Excel

必要欄位只有：

```txt
hcpKey | 邀請業務Key
```

空白列會忽略；資料列錯誤不會阻擋其他正確資料。

### 輸出 Excel

最終輸出欄位固定為：

```txt
hcpKey | 邀請業務Key | 邀請連結
```

- 成功列填入邀請連結。
- 失敗列保留兩個 Key，邀請連結留白。
- 驗證碼、建立時間及過期時間儲存在 Firestore，不另外放入輸出 Excel。

### 活動規則

- 每筆 HCP 會產生不同的 `inviteCodeKey` 與邀請連結。
- 同一批成功資料共用 `createdAt`、`expiredAt` 及 `verifyCode`。
- `createdAt` 是 API 開始處理該批資料時的時間。
- API 不會自動建立假業務；邀請業務 Key 由輸入 Excel 提供。若活動要共用同一位活動業務，操作時在 Excel 的每列填相同的有效業務 Key。

## Firestore 資料

每筆成功邀請寫入：

```txt
sites/{site}/inviteHcpQrcode/{inviteCodeKey}
```

主要欄位：

```ts
{
  _key,
  createdAt,
  expiredAt,
  compositeKey: `${hcpKey}-${medSalesKey}`,
  hcpKey,
  medSalesKey,
  hcpRegisterUrl,
  verifyCode,
}
```

`inviteCodeKey` 是邀請文件的 `_key`，也會放在邀請連結的 query parameter：

```txt
https://liff.line.me/{medLiffId}/hcp/hcp-register?inviteCodeKey={inviteCodeKey}
```

邀請流程透過唯一的 `inviteCodeKey` 取得指定邀請資料，不依賴 `verifyCode` 查詢唯一文件，因此活動共用驗證碼不會改變既有 HCP 掃碼註冊流程。針對仍會使用 `get-inviter-by-verify-code` 的既有前端，則允許同一驗證碼對應多筆相同 `medSalesKey` 的邀請；若對應不同業務，仍維持衝突檢查。

## LIFF 環境

依團隊提供的實際測試／正式站設定，目前程式使用：

- Test：`1655725407-v3wzmXX1`
- Production：`1654083084-W8xRwoo8`

Stage 測試必須使用 Test LIFF ID；正式站不可用本次測試連結。

## HCP 掃描後流程

1. HCP 開啟 Excel 中的邀請連結（或由連結轉成的 QR Code）。
2. LINE 開啟 HCP 註冊 LIFF。
3. LIFF 從網址取得 `inviteCodeKey`，讀取 Firestore 邀請文件。
4. 系統檢查邀請存在且尚未過期，取得 `hcpKey`、`medSalesKey`、`verifyCode`。
5. HCP 加入測試站官方 LINE 帳號並填寫或確認資料。
6. HCP 輸入本場活動共用的 5 位數驗證碼。
7. 驗證成功後呼叫既有 `register-hcp` 流程。
8. 系統綁定 HCP 與 LINE User ID，寫入邀請業務及邀請完成時間。
9. 背景驗證完成後更新 HCP 狀態。

## 技術設計與重要決策

### 1. 逐列錯誤隔離

批次 Excel 可能同時包含正確與錯誤資料。如果遇到一列錯誤就終止整個 request，操作人員需要反覆修檔並重新上傳。因此 API 只在 request 本身無效時拒絕整批；HCP Key、業務 Key 或單筆寫入錯誤則轉成該列失敗結果，其他正確列仍可建立邀請。

### 2. 批次效能與資源限制

- Firestore 文件查詢依每批 500 個唯一 Key 分段執行。
- 邀請建立最多同時處理 50 筆，避免一次啟動過多寫入。
- 上傳檔限制為 10 MB、10,000 筆與 100 欄，避免異常 used range 或大型檔案占用過多記憶體。
- 查詢前先移除空白、非法及重複 Key，減少不必要的 Firestore read。

### 3. 避免重複邀請

邀請以 `${hcpKey}-${medSalesKey}` 作為 `compositeKey`。為處理兩個 request 同時建立相同邀請的情況，系統使用 deterministic lock 文件搭配 Firestore transaction：

- 相同參數且已有有效邀請時，沿用既有邀請。
- 相同 HCP／業務但驗證碼或期限不同時，回傳該列衝突。
- 舊邀請已過期時，可以建立新邀請。
- 同一份 Excel 出現重複組合時，只建立一次並共用結果。

這讓 API 具備冪等性，避免重試或並行操作造成重複資料。

### 4. 共用驗證碼與既有功能相容

新需求讓同一場活動的多筆邀請共用驗證碼，但既有 `get-inviter-by-verify-code` 原先假設驗證碼只對應一筆資料。我先追蹤 HCP 註冊頁的實際流程，確認它主要透過 URL 的 `inviteCodeKey` 讀取指定邀請，不會因共用驗證碼選錯 HCP。

另一個既有前端仍會用驗證碼反查邀請業務，因此相容規則設計為：多筆邀請若都對應同一個 `medSalesKey`，可正常回傳該業務；若對應不同業務，仍視為資料衝突。這樣保留原有安全檢查，也支援活動共用驗證碼。

### 5. 環境設定與安全性

- API 使用 `X-Api-Key` 或 Firebase 管理員權限保護，不開放一般 LIFF 使用者直接呼叫。
- 正式環境未設定 API Key 時，不會降級使用公開預設值。
- LIFF ID 不寫死在程式碼，改由 `ACTIVITY_INVITE_MED_LIFF_ID` 環境變數提供。
- `.env`、API Key、Firebase credential、真實 HCP 個資與測試 Excel 都不提交到 Repository。

## 實際修改檔案

- `src/routes/activity-invite-excel-route.ts`：multipart API route、API Key 驗證、Excel response headers。
- `src/functions/med-sales/generate-activity-invite-excel.ts`：Excel 解析、request 驗證、逐列處理、結果 Excel 產生。
- `src/functions/med-sales/activity-invite-url.ts`：依環境產生 Test／Production LIFF 邀請連結。
- `src/services/invite-hcp-qrcode.ts`：HCP／業務查詢、邀請文件建立及批次處理。
- `src/types/activity-invite.ts`：集中定義活動邀請相關 TypeScript 型別及中文 JSDoc。
- `test/med-sales/generate-activity-invite-excel.test.ts`：request、Excel 解析、時間規則及完整流程測試。
- `test/med-sales/invite-hcp-qrcode-service.test.ts`：Firestore 查詢與邀請建立測試。
- `test/med-sales/med-sales-route.test.ts`：route、API 驗證及下載 response 測試。
- `test/med-sales/activity-invite-url.test.ts`：LIFF ID 與 URL 測試。

## Phase 進度

| Phase | 內容 | 狀態 |
| --- | --- | --- |
| 0 | 確認 Issue、Request、Excel、Firestore、LIFF 規格 | 完成 |
| 1 | Request 驗證與 Excel 基礎解析 | 完成 |
| 2 | 逐列驗證 HCP／業務資料及錯誤隔離 | 完成 |
| 3 | 建立 Firestore 邀請文件 | 完成 |
| 4 | 產生邀請連結及環境 LIFF 對應 | 完成 |
| 5 | 結果 Excel 產生與下載 response | 完成 |
| 6 | Stage Firebase 實際寫入驗收 | 完成 |
| 7 | 與既有功能整合及 API 權限 | 完成 |
| 8 | 完整自動化測試、型別檢查、建置 | 完成 |
| 9 | Stage 手動完整流程測試 | 核心流程完成；過期連結等補充案例列入後續驗證 |
| 10 | 交付前清理、差異檢查與 PR | 完成；PR #83 已合併至 `main` |

## 自動化驗證結果

2026-08-26 在 Stage 合併版本執行：

```txt
NOTIFY_API=http://127.0.0.1:9 METADATA_SERVER_DETECTION=none bun test
131 pass / 0 fail / 318 expect()
```

另外已確認：

- TypeScript `tsc --noEmit` 通過。
- `bun build src/index.ts --target=bun` 成功。
- 測試使用 fake store、無效本機通知位址及 `PRODUCTION=false`，不會寫入正式 Firebase 或發送真實通知。
- Stage health check 回傳 HTTP 200／`OK`。

## 手動測試紀錄

### 已完成

- 使用真實格式 `.xlsx` 呼叫 Stage API。
- 成功下載 3 筆結果 Excel。
- 輸出欄位確認為 `hcpKey`、`邀請業務Key`、`邀請連結`。
- 3 筆連結皆包含 `inviteCodeKey`，並使用 Test LIFF ID。
- Firebase `inviteHcpQrcode` 文件已確認包含邀請 Key、HCP Key、業務 Key、邀請連結、驗證碼、`createdAt`、`expiredAt`。
- 使用邀請連結完成過一次 HCP 註冊，確認 HCP 的 LINE 綁定及邀請寫入流程有更新。
- 驗證不存在的 HCP Key 時，該列不會產生邀請連結，且不影響其他有效資料。
- 確認 HCP 已被其他 LINE 使用者綁定時，系統仍由既有註冊流程拒絕；本次 API 沒有繞過或改寫既有綁定規則。
- Review 修正部署到 `s1.3.112` 後，再次確認 API 可下載 Excel、Firestore 邀請文件與 LIFF 邀請連結。
- 本機測試輸入檔使用 `activity-hcp-input.xlsx`；此檔案只供測試，不得提交到 Repository。

### 補充驗證項目

核心成功流程已完成。若未來再次修改邀請或註冊邏輯，應補做以下負向與管理端驗證：

1. 先輸入錯誤驗證碼，確認畫面拒絕且 HCP 資料不被寫入。
2. 再輸入正確驗證碼，確認可以完成註冊。
3. 確認 Firebase HCP 文件的 `LINEUserId`、`inviterKey`／邀請業務及邀請完成時間。
4. 使用已過期邀請連結，確認不能繼續註冊。
5. 確認業務端可以用邀請業務 Key 篩選出同場活動的 HCP。

已註冊過的 HCP 不建議直接刪除重測；優先使用新的測試 HCP。若必須重置，需由團隊確認 HCP、LINE 綁定、邀請及相關關聯資料的清理範圍。

## Stage 部署紀錄

- `s1.3.110`：功能與輸出 Excel 規格驗收版本。
- `s1.3.112`：合併 code review 修正後的驗收版本，merge commit 為 `4008a16`。
- 兩個 Tag 均已推送至遠端，GitHub Actions Stage 部署成功。
- 本次只部署共用測試環境，未部署正式站。

## Pull Request 與 Code Review

- 核心功能 PR：[#83](https://github.com/Aiii-Developers/astrazeneca-hcp-api/pull/83)
- 合併日期：2026-08-27
- Main merge commit：`81566db`
- Review follow-up commits：`3399f72`、`084a565`、`d9f704d`
- 截至 2026-09-08 的本機遠端 refs，follow-up commits 已在 `stage/s1.3.0` 驗收，但尚未出現在 `origin/main`；後續需確認是否另開 PR 合併。

Reviewer 提出的兩項主要改善：

1. **LIFF ID 環境化**：原本由程式中的測試／正式常數決定，改為讀取 `.env` 的 `ACTIVITY_INVITE_MED_LIFF_ID`，降低部署到錯誤 LIFF 環境的風險。
2. **型別集中管理**：將活動邀請相關 type 從 service 抽到 `src/types/activity-invite.ts`，使用 `import type` 引入，並替所有型別補上中文 JSDoc。

這兩項調整主要改善設定管理、模組職責與可維護性，沒有改變 API request、Excel 格式、Firestore schema 或 HCP 註冊規則。修正後重新執行相關測試、完整回歸、TypeScript type check 與 Bun build，並部署 Stage 再驗收。

## Progress

### 2026-08-24

- 收到 Issue #20，確認功能應開發於 `astrazeneca-hcp-api`。
- 閱讀 Firestore、業務邀請與 HCP 註冊流程，釐清邀請連結是由 CS Team 產出並提供給 HCP 使用。
- 確認 API 只產生可轉換成 QR Code 的連結，不直接輸出 QR Code 圖片。
- 將需求拆成 10 個 Phase，為每個階段定義驗收方式。

### 2026-08-25

- 完成 request 驗證、Excel 解析、逐列驗證、Firestore 邀請建立與 URL 產生。
- 完成結果 Excel 與 API route。
- 處理重複請求、transaction、並行上限及共用驗證碼相容性。
- 同步 `main`，檢查差異並移除可能影響既有功能的不必要修改。

### 2026-08-26

- 依需求方提供的 Excel 範例，將輸出格式收斂為 `hcpKey`、`邀請業務Key`、`邀請連結`。
- 完成完整回歸測試、TypeScript type check、Bun build 與格式檢查。
- 部署 Stage，使用真實 Excel 確認輸出檔與 Firestore 寫入。

### 2026-08-27

- Pull Request #83 合併至 `main`。

### 2026-08-31

- 依 reviewer 意見，將 LIFF ID 改為環境變數。
- 將活動邀請型別抽到 `src/types/activity-invite.ts`，並補上中文 JSDoc。
- 合併到 `stage/s1.3.0`，建立並部署 `s1.3.112`。
- 再次以真實 Excel、Firestore 與 HCP 註冊 LIFF 驗證核心流程。

### 2026-09-08

- 將任務紀錄整理為可長期維護的專案案例，補上成果、設計決策、測試證據、code review 與反思。
- 以本機最新遠端 refs 核對 PR、commit 與 Stage Tag，標記 review follow-up 尚待確認是否合併 `main`。
- 再次檢查筆記未包含 API Key、Firebase credential 或 HCP 個資。

## 遇到的問題與解法

### 套件安裝失敗

初次執行 `bun install --frozen-lockfile` 時，公司私有套件從公開 npm registry 取得會回傳 404。確認公司套件來源與授權後完成安裝，並保留 frozen lockfile，避免安裝出不同版本。

### 測試缺少環境變數

完整測試一開始因 `NOTIFY_API` 未設定而在載入模組時失敗。測試時改用不可連線的本機位址，並明確關閉 production 與 Google metadata 探測，讓測試不會發送通知或連到真實 Firebase。

### Stage Gateway 回傳 404

新 route 尚未由共用 `stage-api.aiii.ai` gateway 對外映射，因此使用 Cloud Run 的 Stage service URL 驗收 API。這讓我區分「應用程式 route 是否存在」和「外層 gateway 是否已設定」是兩個不同層級的問題。

### HCP 已被其他 LINE 帳號綁定

測試註冊時曾遇到「此 HCP 已被其他 LINE 使用者綁定」。檢查 Firestore 後確認這是測試 HCP 的既有資料狀態，而不是邀請 API 改壞註冊介面。後續改用尚未綁定的測試 HCP，且不任意刪除正式結構中的關聯資料。

## 學習與反思

- **需求釐清**：Issue 的一句「上傳 HCP 清單產出邀請連結」背後包含角色、資料來源、權限、期限、錯誤策略與既有註冊流程。我學會先畫出資料流，再決定 API 介面。
- **不要只看單元測試**：測試全綠只能證明程式內的假資料符合預期；真正完成仍需要部署 Stage、上傳 Excel、查看 Firestore，再用 LINE LIFF 走過使用者流程。
- **控制修改範圍**：與 `main` 比對時，我移除不必要的既有程式修改，將新功能隔離在新的 route、function、service 與 tests，降低 regression 風險。
- **考慮並行與重試**：批次 API 不只是迴圈寫入。使用者重送、網路重試或同時操作都可能建立重複資料，因此 transaction、lock 與冪等性是必要設計。
- **環境設定屬於程式設計的一部分**：將 LIFF ID 寫死雖然能運作，卻容易在部署時使用錯誤環境。Code review 讓我理解設定值應由部署環境提供。
- **用證據回應問題**：遇到 404、空白邀請連結或 LINE 綁定錯誤時，分別檢查 HTTP response、輸出 Excel、Firestore 文件和 HCP 狀態，而不是直接假設是同一個 bug。

## 研究所申請素材摘要

可在履歷或備審資料中整理為：

> 於軟體工程實習期間，為既有 TypeScript／Bun 後端設計並實作批次 HCP 活動邀請 API，整合 Excel、Firestore 與 LINE LIFF。系統支援最多 10,000 筆資料、逐列錯誤隔離及並行請求去重，並透過單元測試、整合測試、型別檢查與 Stage 端到端驗收確保不影響既有註冊流程。功能經 code review 後合併至主分支。

這個案例可以用來說明：

- 從模糊需求轉換成可驗收 API 規格的能力。
- 後端、資料庫、試算表與第三方登入流程的整合經驗。
- 對資料一致性、冪等性、安全性及 regression testing 的理解。
- 使用 Git branch、分階段 commit、Pull Request、code review、Stage tag 與 CI/CD 的團隊協作經驗。

## 相關連結

- GitHub Issue：<https://github.com/Aiii-Developers/astrazeneca-docs/issues/20>
- 開發 Repository：<https://github.com/Aiii-Developers/astrazeneca-hcp-api>
- 單筆邀請流程參考：<https://github.com/Aiii-Developers/astrazeneca-liff-med/blob/main/src/app/shared/components/invite-hcp-qrcode/invite-hcp-qrcode.component.ts>
- HCP 掃碼註冊流程參考：<https://github.com/Aiii-Developers/astrazeneca-liff-med/blob/main/src/app/hcp/hcp-register/hcp-register.component.ts>

## 後續同步規則

這份筆記是本專案的長期紀錄，不是一次性任務說明。未來凡是 `astrazeneca-hcp-api` 的活動邀請 API、Excel 格式、Firestore schema、LIFF URL、驗證碼或部署流程有改動，都要同步更新本檔案：

- 在 `Progress` 或 `變更紀錄` 補上日期。
- 記錄變更原因、修改檔案及影響範圍。
- 更新自動化測試及手動驗收結果。
- 記錄新的 Stage Tag；不得把正式站部署誤記成測試站。
- 不在筆記中記錄 API Key、Firebase credential、HCP 姓名、電話、Email 或其他敏感資料。
- `TASK.md` 只作為 Repository 本機開發追蹤文件，不應 commit；本檔案則由 note-garden 持續維護。

## 下一步

核心功能已完成並合併。接下來先確認三筆 review follow-up commits 是否需另開 PR 合併至 `main`。後續若修改活動邀請或 HCP 註冊流程，需重新執行錯誤驗證碼、過期連結、LINE 綁定與活動 HCP 篩選等 regression test，並將新的 PR、Stage Tag、測試結果及設計變更同步記錄在本文件。

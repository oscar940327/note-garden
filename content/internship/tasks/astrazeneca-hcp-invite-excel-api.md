---
title: AstraZeneca 活動 HCP 邀請連結 Excel API
status: in-progress
start_date: 2026-08-24
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
---
# AstraZeneca 活動 HCP 邀請連結 Excel API

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
- 已部署 Stage Tag：`s1.3.110`
- Feature 分支：`feature/activity-hcp-invite-excel-api`

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

邀請流程透過唯一的 `inviteCodeKey` 取得指定邀請資料，不依賴 `verifyCode` 查詢唯一文件，因此活動共用驗證碼不會改變既有 HCP 掃碼註冊流程。既有 `get-inviter-by-verify-code` 的行為則維持原本的唯一性檢查。

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

## 實際修改檔案

- `src/routes/activity-invite-excel-route.ts`：multipart API route、API Key 驗證、Excel response headers。
- `src/functions/med-sales/generate-activity-invite-excel.ts`：Excel 解析、request 驗證、逐列處理、結果 Excel 產生。
- `src/functions/med-sales/activity-invite-url.ts`：依環境產生 Test／Production LIFF 邀請連結。
- `src/services/invite-hcp-qrcode.ts`：HCP／業務查詢、邀請文件建立及批次處理。
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
| 6 | Stage Firebase 實際寫入驗收 | 完成一部分；已確認邀請文件寫入 |
| 7 | 與既有功能整合及 API 權限 | 完成 |
| 8 | 完整自動化測試、型別檢查、建置 | 完成 |
| 9 | Stage 手動完整流程測試 | 部分完成；成功註冊已驗證，負向測試尚未完成 |
| 10 | 交付前清理、差異檢查與 PR | 尚未開始 |

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
- 目前測試站產出的重測輸入檔為本機 Downloads 中的 `activity-hcp-invite.xlsx`；此檔案只供測試，不得提交到 Repository。

### 尚未完成

使用新的、尚未註冊過的測試 HCP 再執行一次：

1. 先輸入錯誤驗證碼，確認畫面拒絕且 HCP 資料不被寫入。
2. 再輸入正確驗證碼，確認可以完成註冊。
3. 確認 Firebase HCP 文件的 `LINEUserId`、`inviterKey`／邀請業務及邀請完成時間。
4. 使用已過期邀請連結，確認不能繼續註冊。
5. 確認業務端可以用邀請業務 Key 篩選出活動 HCP。

已註冊過的 HCP 不建議直接刪除重測；優先使用新的測試 HCP。若必須重置，需由團隊確認 HCP、LINE 綁定、邀請及相關關聯資料的清理範圍。

## Stage 部署紀錄

- Stage 分支合併 commit：`7a02dfa`
- Stage Tag：`s1.3.110`
- Tag 已推送至遠端。
- GitHub Actions Stage 部署成功。
- 本次只部署共用測試環境，未部署正式站。

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

完成 Phase 9 的錯誤驗證碼、過期連結及活動篩選驗收後，進入 Phase 10：檢查 diff、移除測試檔與敏感資料、確認 `TASK.md` 未被 staged，並準備 Pull Request。

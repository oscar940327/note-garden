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

在 `astrazeneca-hcp-api` 新增一支批次產生 HCP 邀請連結的 API。

CS Team 上傳包含 HCP 與邀請業務資料的 Excel 後，API 逐列驗證資料、建立 Firestore 邀請文件，並回傳包含邀請連結、驗證碼及處理狀態的 Excel。

API 只負責產生邀請連結，不需要產生 QR Code 圖片。CS Team 取得邀請連結後，會自行將連結轉換成 QR Code，再提供給受邀 HCP 使用。

## 完成條件

- [ ] 新增 Excel 上傳 API
- [ ] Request 支援 `site`、Excel file 與 `expiredAt`
- [ ] 輸入 Excel 支援 `hcpKey` 與邀請業務 Key
- [ ] 目前只支援 `hcpKey`，不支援 `accountId`
- [ ] 逐列檢查 HCP 與邀請業務是否存在
- [ ] 一次上傳視為同一場活動，所有成功列共用同一組 5 碼 `verifyCode`
- [ ] 每位 HCP 產生不同的 `inviteCodeKey` 與邀請連結
- [ ] `createdAt` 使用 API 執行當下時間
- [ ] `expiredAt` 使用日曆選擇並傳入的時間
- [ ] 成功列建立 `inviteHcpQrcode` Firestore 文件
- [ ] 回傳 Excel 包含邀請連結
- [ ] 回傳 Excel 包含驗證碼、狀態與錯誤原因
- [ ] 部分列錯誤時不影響其他正確列
- [ ] HCP 掃描產生的邀請連結後，既有 `hcp-register` 流程可正常讀取邀請資料
- [ ] 完成單元測試與必要的整合測試
- [ ] 確認共用 `verifyCode` 與既有唯一性查詢的相容方式

## 相關概念

- [[API]]
- [[Excel]]
- [[Firebase]]
- [[Firestore]]
- [[LINE LIFF]]
- [[HCP]]
- [[QR Code]]

## 相關連結

- GitHub Issue：<https://github.com/Aiii-Developers/astrazeneca-docs/issues/20>
- 開發 Repository：<https://github.com/Aiii-Developers/astrazeneca-hcp-api>
- 既有單筆邀請流程：<https://github.com/Aiii-Developers/astrazeneca-liff-med/blob/main/src/app/shared/components/invite-hcp-qrcode/invite-hcp-qrcode.component.ts>
- HCP 掃碼後的註冊流程：<https://github.com/Aiii-Developers/astrazeneca-liff-med/blob/main/src/app/hcp/hcp-register/hcp-register.component.ts>

## 相關人物

- Issue 建立者：`minamina215`
- 需求與技術說明：`Julie881107`、`JeffAiii`
- 實際任務指派者：待確認

## Progress

### 2026-08-24

- 收到活動 HCP 邀請 QR Code API 任務
- 確認開發 Repository 為 `Aiii-Developers/astrazeneca-hcp-api`
- 將 Repository clone 至 `/Users/oscar/Documents/astrazeneca-hcp-api`
- 重新閱讀 Issue #20 與最新留言
- 確認本次只開發 API，不包含一頁式上傳介面
- 確認 API 為 Excel 上傳、Excel 下載流程
- 確認 API 不需要產生 QR Code 圖片
- 確認目前輸入只需要支援 `hcpKey`，不需要支援 `accountId`
- 確認 `createdAt` 使用 API 執行當下時間
- 收到新指示：同一場活動的所有邀請共用同一組驗證碼
- 收到新指示：`expiredAt` 由日曆選擇日期與時間
- 發現既有 `get-inviter-by-verify-code` 假設 `verifyCode` 唯一，與活動共用驗證碼的新指示有衝突，尚待確認處理方式
- 尚未修改程式碼

## 已知需求

### 輸入 Request

API 使用 `multipart/form-data`，至少接收：

```txt
site
file
expiredAt
```

目前 `verifyCode` 要由前端提供，還是由 API 產生一次後套用整批，尚待確認。

### 輸入 Excel

```txt
hcpKey | 邀請業務Key
```

目前只支援 `hcpKey`，不需要支援 `accountId`。

### 輸出 Excel

```txt
hcpKey | 邀請業務Key | 邀請連結 | 驗證碼 | 狀態 | 錯誤原因
```

輸出範例：

| hcpKey | 邀請業務Key | 邀請連結 | 驗證碼 | 狀態 | 錯誤原因 |
| --- | --- | --- | --- | --- | --- |
| HCP_001 | SALES_001 | `https://liff.line.me/...` | 48271 | 成功 |  |
| HCP_404 | SALES_002 |  | 48271 | 失敗 | 找不到 HCP |

同一批資料若部分列錯誤，不應影響其他正確列建立邀請。錯誤列必須保留在輸出 Excel，並標示錯誤原因。

## 資料規格

### 邀請連結

邀請連結格式：

```txt
https://liff.line.me/{medLiffId}/hcp/hcp-register?inviteCodeKey={inviteCodeKey}
```

Issue 目前記載的 LIFF ID：

```txt
正式站：1655725407-v3wzmXX1
測試站：1654083084-W8xRwoo8
```

實作前需要再次確認 Stage 與 Production 的 LIFF ID 對應，避免環境混用。建議從既有環境設定或 Site Environment 取得，不要將判斷散落在業務邏輯中。

### Firestore 路徑

每一筆成功邀請寫入：

```txt
sites/{site}/inviteHcpQrcode/{inviteCodeKey}
```

文件關鍵欄位：

```txt
_key
createdAt
expiredAt
compositeKey
hcpKey
medSalesKey
hcpRegisterUrl
verifyCode
```

`compositeKey` 維持既有格式：

```txt
{hcpKey}-{medSalesKey}
```

依 Issue 最新說明，目前不需要在 `compositeKey` 加入活動資訊。

### createdAt

`createdAt` 不從 Excel 或前端接收，由 API 在開始處理該批資料時建立：

```ts
const createdAt = new Date();
```

同一批成功建立的邀請共用相同的 `createdAt`，表示這批邀請的建立時間。

### expiredAt

`expiredAt` 由操作介面的日曆選擇日期與時間，再傳給 API。

建議傳送包含時區的 ISO 8601 格式：

```txt
2026-08-30T18:00:00+08:00
```

API 需要檢查：

- 格式可以正確解析
- 時間晚於 `createdAt`
- Firestore 以 Date / Timestamp 儲存

Issue 原本記載未提供 `expiredAt` 時預設為建立後 24 小時。收到日曆選擇的新指示後，`expiredAt` 是否仍為選填、是否仍保留 24 小時預設值，尚待確認。

### verifyCode

`verifyCode` 為 5 位數字驗證碼。

最新指示為一次上傳代表同一場活動，因此整批成功邀請共用同一組 `verifyCode`：

```ts
const sharedVerifyCode = generate5DigitCode();

for (const row of rows) {
  // 每列使用 sharedVerifyCode
}
```

每位 HCP 的 `inviteCodeKey` 及邀請連結仍然必須不同，只有 5 碼驗證碼共用。

尚待確認：

- 驗證碼由 API 自動產生，還是由操作人員輸入
- 驗證碼是否可以跨活動重複
- 是否需要額外的 `activityId` 或 `batchId` 識別活動

## HCP 掃 QR Code 後的流程

1. HCP 掃描由邀請連結轉換出的 QR Code。
2. LINE 開啟 AZ 的 LIFF HCP 註冊頁。
3. 註冊頁從網址取得 `inviteCodeKey`。
4. 系統讀取 `sites/{site}/inviteHcpQrcode/{inviteCodeKey}`。
5. 系統檢查邀請文件是否存在及是否已過期。
6. 系統取得 `hcpKey`、`medSalesKey` 與 `verifyCode`。
7. 如果 HCP 尚未加入 AZ LINE 官方帳號，先導向加入好友。
8. 系統載入指定 HCP 的既有資料。
9. HCP 同意隱私政策並確認或補齊資料。
10. HCP 輸入活動共用的 5 碼驗證碼。
11. 驗證成功後呼叫既有 `register-hcp` 流程。
12. 系統綁定 HCP 與 LINE User ID。
13. 系統記錄邀請業務 `medSalesKey` 與邀請完成時間。
14. HCP 最終更新為「已驗證」。

目前這段流程完成的是 HCP 驗證、LINE 綁定與邀請業務記錄，不等同活動報到。

## 預計修改檔案

### `src/routes/med-sales-route.ts`

新增 Excel 上傳 API route，例如：

```txt
POST /az-hcp/med-sales/generate-activity-invite-excel
```

Route 負責：

- 驗證 multipart request schema
- 接收 `site`、`file`、`expiredAt`
- 視最終規格決定是否接收 `verifyCode`
- 設定 Excel response 的 Content-Type 與下載檔名

### `src/functions/med-sales/generate-activity-invite-excel.ts`

新增主要處理流程：

- 解析 Excel
- 驗證標題與每列欄位
- 在迴圈外建立共用 `createdAt`、`expiredAt` 與 `verifyCode`
- 逐列檢查 HCP 與邀請業務
- 為成功列產生不同的 `inviteCodeKey`
- 組合 LIFF 邀請連結
- 呼叫 Firestore Service 寫入邀請文件
- 保留每列成功或錯誤結果
- 建立並回傳結果 Excel Buffer

### `src/services/invite-hcp-qrcode.ts`

建議新增獨立 Service，集中處理：

- 查詢 HCP 是否存在
- 查詢邀請業務是否存在
- 建立 `inviteHcpQrcode` 文件
- Firestore batch / chunk 寫入
- 將 Firestore 實作與 Excel 解析邏輯分離

### `test/med-sales/generate-activity-invite-excel.test.ts`

新增測試：

- 正常 Excel 可產生邀請連結
- 所有成功列共用相同 `verifyCode`
- 每位 HCP 的 `inviteCodeKey` 不同
- 同一批資料的 `createdAt` 相同
- `expiredAt` 正確儲存
- `expiredAt` 格式錯誤
- `expiredAt` 已過期
- HCP 不存在
- 邀請業務不存在
- 部分列失敗不影響其他列
- 輸出 Excel 包含邀請連結、驗證碼、狀態與錯誤原因

### `docs/generate-activity-invite-excel.route.md`

新增 API 文件：

- Request 欄位
- Excel 欄位格式
- Firestore 寫入內容
- Response headers
- 輸出 Excel 格式
- 錯誤行為
- Stage / Production LIFF URL 規則

## 預計實作步驟

### 步驟 1：確認尚未定案的規格

開始修改前確認：

- `expiredAt` 是否必填
- 未提供時是否仍預設 24 小時
- 共用 `verifyCode` 是由 API 自動產生或由操作人員輸入
- 是否需要 `activityId` / `batchId`
- Stage 與 Production 的 `medLiffId`
- 共用驗證碼與既有 `get-inviter-by-verify-code` 的相容方式

### 步驟 2：定義 API Route 與資料型別

在 `med-sales-route.ts` 新增 multipart route，限制 Excel MIME type，並定義 `site`、`expiredAt` 與可能的 `verifyCode`。

### 步驟 3：解析及驗證 Excel

使用專案現有的 `xlsx` 套件讀取第一個工作表，確認欄位及逐列資料。

輸入欄位：

```txt
hcpKey | 邀請業務Key
```

空白列忽略；資料錯誤列保留並回傳錯誤原因。

### 步驟 4：建立批次共用資料

在逐列處理前建立：

```txt
createdAt
expiredAt
sharedVerifyCode
```

確保同一批所有成功列使用相同活動驗證碼。

### 步驟 5：逐列建立邀請

對每列：

1. 檢查 HCP。
2. 檢查邀請業務。
3. 建立唯一 `inviteCodeKey`。
4. 建立邀請連結。
5. 寫入 Firestore。
6. 記錄成功或錯誤結果。

### 步驟 6：產生結果 Excel

使用 `XLSX.utils.aoa_to_sheet()` 與 `XLSX.write()` 建立 Excel Buffer，並由 Route 以附件形式回傳。

### 步驟 7：測試

先執行新功能的單元測試，再執行完整測試：

```bash
bun test
```

最後在 Stage 使用測試 HCP 與測試業務資料驗證：

- Firestore 文件正確
- Excel 輸出正確
- QR Code 可開啟正確 LIFF URL
- HCP 可輸入共用驗證碼並完成既有註冊流程

## 遇到的問題

### 問題 1：共用 verifyCode 與既有 API 衝突

既有 `src/services/med-sales.ts` 的 `resolveMedSalesInviterByVerifyCode()` 會使用 `verifyCode` 查詢 `inviteHcpQrcode`，並假設同一個 `site` 下只能查到一筆。若查到多筆，會拋出：

```txt
Duplicate verifyCode
```

新指示要求同一場活動所有 HCP 共用驗證碼，因此會刻意建立多筆相同 `verifyCode`。

目前 HCP 註冊頁是先透過唯一的 `inviteCodeKey` 取得特定邀請文件，再比對該文件的 `verifyCode`，所以掃碼註冊流程本身可以支援共用驗證碼。

但需要確認既有 `get-inviter-by-verify-code` 是否仍會處理這批活動邀請。若會，就不能只用 `verifyCode` 查找唯一邀請，可能需要增加 `inviteCodeKey`、`hcpKey` 或活動識別條件。

### 問題 2：活動來源欄位尚未定義

原始需求希望知道 HCP 是透過哪場活動加入，但最新 API 規格沒有 `activityId`，且明確表示 `compositeKey` 不需要加入活動資訊。

共用 5 碼驗證碼可以人工辨認某一批活動，但驗證碼只有 100,000 種組合，未必適合作為長期唯一的活動 ID。若需要可靠追蹤，建議新增獨立的 `activityId` 或 `batchId`，但必須先取得需求確認。

### 問題 3：expiredAt 選填規則待確認

Issue 最新留言原本規定 `expiredAt` 選填，未提供時預設建立後 24 小時；後續口頭指示為透過日曆選擇日期與時間。

目前尚未確認日曆選擇是否代表 `expiredAt` 改為必填，以及未提供時是否仍保留 24 小時預設值。

## 目前結果

已完成需求理解、既有流程查核與初步實作規劃，尚未修改 `astrazeneca-hcp-api` 程式碼。

目前最重要的待確認事項為：

- 活動共用驗證碼的產生方式
- `expiredAt` 是否必填
- 是否需要活動識別欄位
- 既有 `get-inviter-by-verify-code` 如何相容多筆相同驗證碼
- Stage / Production LIFF ID 對應

---
title: Firebase Hosting + LINE LIFF 整合
status: completed
start_date: 2026-08-19
end_date: 2026-08-24
assigned_by: Ranger
tags:
  - 實習
  - 任務
  - Firebase
  - LINE
---
# Firebase Hosting + LINE LIFF 整合

## 任務目標

在公司既有的 Firebase Project 中建立並設定自己的 Firebase Hosting，
將前端網頁部署至 Hosting。

接著建立及設定 LIFF App，將 Firebase Hosting 網址設為 LIFF Endpoint URL，
並在網頁中完成 LIFF 初始化與使用者授權流程。

最後透過手機 LINE 開啟 LIFF 網址，取得並顯示使用者的基本公開資訊。

## 完成條件

- [x] 在既有 Firebase Project 設定 Hosting
- [x] 建立簡單前端測試頁面
- [x] 部署至 Firebase Hosting
- [x] 建立 / 設定 LIFF App
- [x] 設定 LIFF Endpoint URL
- [x] 完成 `liff.init()`
- [x] 完成 LINE 登入 / 授權
- [x] 使用 `liff.getProfile()`
- [x] 顯示 Display Name
- [x] 顯示 User ID
- [x] 顯示頭像
- [x] 顯示狀態訊息
- [x] 使用手機 LINE 實際測試成功

## 相關概念

- [[Firebase Hosting]]
- [[LINE LIFF]]
- [[Firebase]]
- [[LINE Login]]

## 相關人物

- [[Ranger]]

## Progress

### 2026-08-19

- 收到任務
- 開始了解 Firebase Hosting 與 LIFF
- 尚未開始正式實作

### 2026-08-20

- 確認使用 Firebase Project `aiii-developer`
- 建立 Hosting Site `oscar-liff-angular-stage`
- 將 Angular 建置輸出目錄設為 `dist/template-liff-angular/browser`
- 修正 Angular base href，使網頁可從 Hosting 根路徑開啟
- 建立前端測試頁面並成功部署至 Firebase Hosting
- 發現 Stage LINE Login Channel 的 LIFF App 數量已達上限，向 Ranger 確認處理方式

### 2026-08-24

- 經 Ranger 確認，可重新使用既有 LIFF App
- 將 LIFF Endpoint URL 改為 Firebase Hosting 網址
- 將 LIFF scopes 設為 `profile` 與 `openid`
- 在 Angular environment 設定正確的 Channel ID 與 LIFF ID
- 完成 `liff.init()`、LINE 登入與 `liff.getProfile()`
- 完成 Display Name、User ID、頭像與狀態訊息顯示
- 重新建置並部署至 Firebase Hosting
- 使用手機 LINE 開啟 LIFF URL，登入、授權與使用者資料顯示均測試成功

## 實作步驟

### 步驟 1：確認 Firebase Project

先從專案的 `.firebaserc` 與 Firebase Console 確認公司既有的 Firebase Project。

本次使用：

- Firebase Project ID：`aiii-developer`

### 步驟 2：建立 Firebase Hosting Site

在 Firebase Console 的 Hosting 頁面新增自己的 Hosting Site。

建立結果：

- Hosting Site ID：`oscar-liff-angular-stage`
- Hosting URL：<https://oscar-liff-angular-stage.web.app>

### 步驟 3：將本機專案綁定到 Hosting Site

登入 Firebase CLI：

```bash
firebase login --reauth
```

確認 Hosting Site 存在：

```bash
firebase hosting:sites:list --project aiii-developer
```

建立本機 Hosting target 與 Firebase Hosting Site 的對應：

```bash
firebase target:apply hosting oscar-liff-angular-stage oscar-liff-angular-stage --project aiii-developer
```

這項設定會寫入 `.firebaserc`。

### 步驟 4：設定 Firebase Hosting 部署目錄

修改 `firebase.json`：

```json
{
  "hosting": [
    {
      "target": "oscar-liff-angular-stage",
      "public": "dist/template-liff-angular/browser",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```

Angular 20 的靜態網站建置結果位於 `dist/template-liff-angular/browser`。`rewrites` 則確保 Angular 前端路由在重新整理後仍能回到 `index.html`。

### 步驟 5：修正 Angular Base Path

原本範本使用 `/template/` 子路徑，但本次 Hosting 網站直接從根路徑 `/` 提供。

修改 `angular.json`：

```json
"baseHref": "/",
```

修改 `src/index.html`：

```html
<base href="/" />
```

### 步驟 6：建立並部署 Hosting 測試頁面

先停用範本原有的 `AuthGuard`，避免在 LIFF 設定完成前使用到舊的 LIFF ID 與驗證流程。接著建立簡單的 Angular 測試頁，確認 Hosting 能正確載入網頁。

建置 Angular：

```bash
npm run build
```

部署至 Firebase Hosting：

```bash
firebase deploy --only hosting --project aiii-developer
```

使用瀏覽器開啟 <https://oscar-liff-angular-stage.web.app>，確認測試頁面部署成功。

### 步驟 7：設定 LIFF App

進入 LINE Developers Console，使用以下 LINE Login Channel：

- Provider：`Powered by Aiii`
- LINE Login Channel：`[Stage] Aiii內部開發測試`
- Channel ID：`1657228803`

由於 Channel 的 LIFF App 數量已達上限，因此先向 Ranger 確認。取得授權後，重新使用既有 LIFF App。

LIFF 設定：

- LIFF app name：`共用平台-Oscar測試頁面`
- Size：`Full`
- Endpoint URL：<https://oscar-liff-angular-stage.web.app>
- Scopes：`profile`、`openid`
- Add friend option：`Off`
- Scan QR：`Off`
- Module mode：`Off`

設定結果：

- LIFF ID：`1657228803-dxGq92Ky`
- LIFF URL：<https://liff.line.me/1657228803-dxGq92Ky>

### 步驟 8：設定 Angular Environment

在 `src/environments/environment.ts` 與 `src/environments/environment.prod.ts` 設定 Channel ID 與 LIFF ID：

```typescript
site: 'oscar-liff-angular-stage',
line: {
  clientId: '1657228803',
  liffId: '1657228803-dxGq92Ky',
},
```

兩個 environment 都需要修改，因為 `npm run build` 預設使用 production environment。

### 步驟 9：完成 LIFF 初始化與登入流程

在 Angular 頁面載入時執行：

```typescript
await liff.init({
  liffId: environment.line.liffId,
});
```

接著使用 `liff.isLoggedIn()` 檢查登入狀態。如果使用者尚未登入，執行：

```typescript
liff.login({
  redirectUri: window.location.href,
});
```

### 步驟 10：取得並顯示使用者資料

使用者完成 LINE 授權後，呼叫：

```typescript
const profile = await liff.getProfile();
```

取得的公開資訊包括：

- `profile.displayName`
- `profile.userId`
- `profile.pictureUrl`
- `profile.statusMessage`

再透過 Angular Template 將這些資料顯示在頁面上。

### 步驟 11：重新部署並使用手機測試

完成 LIFF 程式後，重新建置並部署：

```bash
npm run build
firebase deploy --only hosting --project aiii-developer
```

最後將 LIFF URL <https://liff.line.me/1657228803-dxGq92Ky> 傳到手機 LINE 聊天室，從手機 LINE 點擊開啟。完成授權後，確認頁面可正確顯示 Display Name、User ID、頭像與狀態訊息。

## 遇到的問題

### 問題 1

首次部署後 Firebase Hosting 顯示空白頁面，瀏覽器顯示 JavaScript module 的 MIME type 為 `text/html`。

### 解決方式

檢查建置產物後發現 `<base href="/template/">` 仍指向範本原本的子路徑，導致 JavaScript 檔案請求被 Firebase rewrite 成 `index.html`。將 `angular.json` 與 `src/index.html` 的 base href 改為 `/`，重新 build 與 deploy 後恢復正常。

### 問題 2

`[Stage] Aiii內部開發測試` LINE Login Channel 的 LIFF App 數量已滿，無法新增 LIFF App。

### 解決方式

先停止操作並向 Ranger 確認，取得修改既有 LIFF App 的授權後，重新設定該 App 的名稱、Endpoint URL 與 scopes，保留原 LIFF ID 使用。

### 問題 3

執行 `firebase deploy --only hosting:oscar-liff-angular-stage` 時，Firebase CLI 回報 target 未在 `firebase.json` 中偵測到。

### 解決方式

確認 `.firebaserc` 與 `firebase.json` 的 target 綁定正確，且 `firebase.json` 只有自己的 Hosting 設定後，改用 `firebase deploy --only hosting --project aiii-developer` 成功部署。

## 最終結果

已完成 Firebase Hosting + LINE LIFF 整合。

- Firebase Project：`aiii-developer`
- Firebase Hosting Site：`oscar-liff-angular-stage`
- Firebase Hosting：<https://oscar-liff-angular-stage.web.app>
- LINE Login Channel ID：`1657228803`
- LIFF ID：`1657228803-dxGq92Ky`
- LIFF URL：<https://liff.line.me/1657228803-dxGq92Ky>

使用者從手機 LINE 開啟 LIFF URL 後，可完成 LINE 授權，並在頁面顯示 Display Name、User ID、頭像與狀態訊息。已完成手機 LINE 實際測試。

# VideoNote Knowledge Garden

This repository is the public Obsidian Vault and Quartz site for VideoNote.

- Open `content/` as the Vault in Obsidian.
- Run `npm.cmd install` once on Windows.
- Preview with `npx.cmd quartz build --serve`.
- VideoNote writes only validated Markdown paths under `content/`.
- GitHub Pages deploys automatically when the `v5` branch is pushed.

## 分類管理

- `content/` 下的第一層資料夾就是 VideoNote 前端的可選分類。
- LLM 只提供建議；使用者可以在儲存或發布前改選現有分類，或輸入新分類名稱。
- 新分類第一次儲存時，VideoNote 會建立資料夾與 `index.md`，讓 Quartz 產生分類入口頁。
- 已儲存的筆記改選分類後再次儲存，VideoNote 會先安全寫入新位置，再移除舊檔。
- 也可以在 Obsidian 中手動拖曳 Markdown 到其他資料夾；下次重新整理前端後，資料夾清單會同步反映。
- `Inbox` 是分類信心不足時的安全暫存位置，不代表最終分類。

Never store API keys, `.env` files, or private notes in `content/`.

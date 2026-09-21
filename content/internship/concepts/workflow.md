# Codex + OpenSpec 使用指南

這份文件記錄如何使用 Codex 搭配 OpenSpec，從釐清需求、規劃 Change，到實作、測試與歸檔。

核心原則是：**先把需求與驗收方式說清楚，再開始寫程式碼。**

主要流程：

```text
需求
 ↓
Codex 釐清需求
 ↓
拆成 Change
 ↓
OpenSpec Proposal
 ↓
確認 Spec / Design / Tasks
 ↓
實作
 ↓
Review / Test
 ↓
Archive
```

---

## 1. 環境設定

### GitHub CLI

GitHub CLI（`gh`）可以讓 Codex 查看 Repository、Issue、Pull Request、GitHub Actions，以及操作其他 GitHub 資源。

macOS：

```bash
brew install gh
```

Windows：

```powershell
winget install --id GitHub.cli --source winget
```

登入並確認狀態：

```bash
gh auth login
gh auth status
```

### 啟動 Codex

```bash
cd your-project
git status
codex
```

開始前先執行 `git status`，確認工作區中沒有來源不明的修改。啟動後可以先請 Codex 熟悉專案：

```text
先閱讀這個專案，說明目前的架構，並找出 authentication 相關程式碼的位置。
先不要修改任何檔案。
```

### 安裝與初始化 OpenSpec

OpenSpec 用來管理 Requirement、Spec、Design、Implementation Tasks 與 Change history。需要 Node.js 20.19 以上。

```bash
node --version
npm install -g @fission-ai/openspec@latest
openspec --version
```

在專案中初始化：

```bash
openspec init
```

初始化時選擇 `Codex`，也可以直接指定：

```bash
openspec init --tools codex --profile core
```

完成後會產生：

```text
openspec/
├── specs/        # 已完成並生效的正式規格
├── changes/      # 討論或開發中的變更
└── config.yaml
```

---

## 2. OpenSpec 的核心概念

不要把整份大型 PRD（Product Requirements Document）當成一個 Change。每個 Change 都應該範圍清楚，而且能獨立理解、實作、測試與 Review。

例如「會員系統」可以拆成：

```text
add-email-registration
add-email-login
add-password-reset
add-google-login
```

建立 Change 後，常見結構如下：

```text
openspec/changes/add-email-notification/
├── proposal.md
├── design.md
├── tasks.md
└── specs/
```

| Artifact | 要回答的問題 |
| --- | --- |
| `proposal.md` | 為什麼要改、要改什麼、影響哪些範圍？ |
| `specs/` | 系統應該具備什麼行為與 Scenario？ |
| `design.md` | 技術上要怎麼實作？ |
| `tasks.md` | 實作時要完成哪些工作？ |

---

## 3. 根據目前狀態選擇流程

| 目前狀態 | 起點 | 目的 |
| --- | --- | --- |
| 已有 PRD | 請 Codex 閱讀 PRD 與 Codebase | 找出模糊處、缺漏和影響範圍，再拆 Changes |
| 沒有 PRD，但已有 Codebase | `$openspec-explore` | 從現有程式、Schema、API、測試與設定釐清需求 |
| 只有 Idea，沒有 Codebase | `$grill-me` → Product Brief → `$openspec-explore` | 先確認產品需求與 MVP，再探索架構與拆 Changes |

### 情況 A：已有 PRD

不要直接要求 Codex 實作。先讓它閱讀 PRD 與現有系統：

```text
請先閱讀這份 PRD 和目前的 codebase，不要修改程式碼。

請確認：
1. PRD 是否有模糊或矛盾之處
2. 是否缺少 edge case
3. 是否有需要先決定的技術問題
4. 現有系統哪些部分會受到影響
5. 有哪些問題需要我回答

在需求確認完成前不要開始 implementation。
```

問題釐清後，再請 Codex 拆成 Changes：

```text
根據已確認的需求，把 PRD 拆成適合 OpenSpec 的 Changes。

每個 Change 必須可以獨立實作與測試，Scope 清楚且不過大。
請列出 Change 名稱、負責範圍與相依性，不要開始寫程式碼。
```

### 情況 B：沒有 PRD，但已有 Codebase

使用：

```text
$openspec-explore
```

讓 Codex 根據現有 Code、Database Schema、API、Tests、Config 與 Architecture 理解系統，再確認新功能的 Goal、Scope、Requirement、Acceptance Criteria 與影響範圍。

```text
Idea
 ↓
$openspec-explore
 ↓
閱讀現有 Codebase、提出問題
 ↓
確認需求與驗收方式
 ↓
拆 Changes
```

### 情況 C：只有 Idea 的 Greenfield 專案

如果目前沒有 PRD、Code、Database、API 或 Tech Stack，不要直接 `$openspec-propose` 或要求 Codex 建立整套系統。

推薦流程：

```text
Idea
 ↓
$grill-me
 ↓
Product Brief
 ↓
$openspec-explore
 ↓
確認 MVP Architecture
 ↓
拆 Changes
```

> `$grill-me` 是額外的 Agent [Skill](https://github.com/mattpocock/skills)，不是 OpenSpec 本身的一部分。

#### Grill、Explore 與 Propose 的分工

| 工具 | 用途 |
| --- | --- |
| `$grill-me` | 透過提問找出模糊需求、隱藏假設與重要限制 |
| `$openspec-explore` | 探索需求、技術方案、架構與 Change 的切分方式 |
| `$openspec-propose` | 把已決定的內容正式整理成 Spec、Design 與 Tasks |

Grill 的重點包括：

- Problem、Target Users 與 Success Criteria
- MVP Scope 與 Out of Scope
- Core User Flow
- Authentication、Permission 與 Security
- Data Source、Integration 與 Platform
- Error / Edge Cases
- Technical Constraints

不需要決定每個 UI pixel；只要能清楚回答「做什麼、為誰做、第一版做與不做什麼、如何算完成，以及有哪些不能猜的限制」，就可以停止。

#### 整理 Product Brief

Grill 完成後，先把決策整理成 Product Brief，內容至少包含：

```text
Problem
Target Users
Goal
MVP Scope
Out of Scope
Core User Flows
Functional Requirements
Permissions
Data Requirements
Edge Cases
Technical Constraints
Acceptance Criteria
Open Questions
```

Product Brief 會成為後續規劃的 Source of Truth。如果還有會影響 Scope 或 Architecture 的重大問題，應先處理，不要開始 implementation。

#### 探索 MVP 架構

接著使用 `$openspec-explore`，根據 Product Brief 探索：

- Tech Stack 與 Project Structure
- Data Model
- Authentication / Authorization
- External Services
- Testing Strategy
- Deployment Strategy
- 專案共用決策
- MVP 應拆成哪些 Changes

只決定會影響 MVP 的基礎，例如 Frontend、Backend、Database、Authentication、Deployment 與 Testing。尚未需要的 Microservices、Event Bus、Multi-region 或複雜快取，可以等需求出現後再決定。

---

## 4. `$grill-me` 之後會產生什麼？

`$grill-me` 的工作是透過提問，把模糊的 Idea 整理成明確需求。它會確認：

- Problem、Target Users 與 Goal
- MVP Scope 與 Out of Scope
- User Flow
- Permission、Data、Security 與限制
- Acceptance Criteria
- 尚未決定的 Open Questions

`$grill-me` 不會自動建立 OpenSpec Change。討論完成後，請 Codex 把結果整理成：

```text
docs/product-brief.md
```

可以使用：

```text
請把剛才 grill-me 確認的內容整理成 docs/product-brief.md。

包含：
- Problem               -> 要解決什麼問題？為什麼需要做？   
- Target Users          -> 誰會使用？不同使用者有什麼需求？
- Goal                  -> 這個產品希望達成什麼結果？
- MVP Scope             -> 第一版一定要完成的功能。
- Out of Scope          -> 第一版明確不做的功能。
- Core User Flows       -> 使用者如何完成主要操作。
- Requirements          -> 系統必須提供哪些行為。
- Constraints           -> 時間、技術、安全性或公司環境限制。
- Acceptance Criteria   -> 符合哪些條件才算完成。
- Open Questions        -> 目前仍未決定的問題。

先不要實作。
```

這份 Product Brief 是後續 OpenSpec 的輸入。如果仍有會影響 Scope 或 Architecture 的 Open Questions，先處理完再進入 OpenSpec。

---

## 5. Product Brief 產生後怎麼使用 OpenSpec？

先使用 `$openspec-explore`：

```text
$openspec-explore

請閱讀 docs/product-brief.md 和目前的 codebase。

請：
1. 找出尚未決定的需求或技術問題
2. 提出適合 MVP 的技術方案
3. 把 MVP 拆成可以獨立實作與驗證的 Changes
4. 列出每個 Change 的 Goal、Scope、Dependencies 與驗收方式

先不要實作。
```

Explore 完成後應該得到：

- 已確認的技術決策
- 風險與未決問題
- 按開發順序排列的 Change 清單

例如：

```text
1. bootstrap-project-foundation
2. add-user-authentication
3. add-document-ingestion
4. add-document-search
5. add-ai-question-answering
```

接下來一次只處理一個 Change。

---

## 6. OpenSpec Skills 的使用順序

```text
$openspec-explore
        ↓
$openspec-propose
        ↓
Review 規劃文件
        ↓
$openspec-update-change（需要修改時）
        ↓
$openspec-apply-change
        ↓
$openspec-verify-change
        ↓
$openspec-archive-change
        ↓
下一個 Change
```

| Skill | 功能 | 產出 |
| --- | --- | --- |
| `$openspec-explore` | 研究需求、Codebase 與技術方案，並拆分 Changes | 技術決策與 Change 清單 |
| `$openspec-propose <change-name>` | 建立一個 Change 的完整規劃 | `proposal.md`、`specs/`、`design.md`、`tasks.md` |
| `$openspec-update-change` | 修改既有規劃，但不實作程式碼 | 更新後且彼此一致的規劃文件 |
| `$openspec-apply-change <change-name>` | 按照 `tasks.md` 實作 | 程式碼、測試與完成的 Tasks |
| `$openspec-verify-change <change-name>` | 比對 Spec、Design、Tasks 與實作 | 缺漏、錯誤與是否可歸檔的報告 |
| `$openspec-archive-change <change-name>` | 驗收完成後歸檔 | Change 歷史與正式 Specs |

### 每個 Change 的實際操作

建立規劃：

```text
$openspec-propose add-document-search
```

確認以下文件沒有問題：

```text
openspec/changes/add-document-search/
├── proposal.md
├── specs/
├── design.md
└── tasks.md
```

需要修改時：

```text
$openspec-update-change
```

確認規劃後開始實作：

```text
$openspec-apply-change add-document-search
```

實作與測試完成後驗證：

```text
$openspec-verify-change add-document-search
```

驗證有問題就先修正；通過後才歸檔：

```text
$openspec-archive-change add-document-search
```

然後對下一個 Change 重複：

```text
propose → review/update → apply → verify → archive
```

---

## 7. 其他 OpenSpec Skills

這些不是每次都需要：

| Skill | 使用時機 |
| --- | --- |
| `$openspec-onboard` | 第一次使用 OpenSpec，想跟著引導完成完整流程 |
| `$openspec-new-change` | 想逐步建立 Change，而不是一次產生全部規劃文件 |
| `$openspec-continue-change` | 使用 `new-change` 後，繼續建立下一份 Artifact |
| `$openspec-ff-change` | Change 已存在，想快速補齊後續規劃文件 |
| `$openspec-sync-specs` | 想同步 Change Specs，但暫時不 Archive |
| `$openspec-bulk-archive-change` | 多個完成的 Changes 要一起歸檔 |

一般情況使用 `$openspec-propose` 即可；`new-change → continue-change` 是想逐份確認 Artifact 時才使用。

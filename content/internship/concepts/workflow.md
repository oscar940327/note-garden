# Codex + OpenSpec 使用指南

這份文件介紹如何使用 Codex 搭配 OpenSpec 進行開發。

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

# 1. 安裝 GitHub CLI

建議先安裝 GitHub CLI (`gh`)，讓 Codex 可以直接操作 GitHub，例如：

- 查看 Repository
- 查看 Issue
- 建立 Pull Request
- 查看 PR
- 查看 GitHub Actions
- 操作其他 GitHub 資源

## macOS

```bash
brew install gh
```

## Windows

```powershell
winget install --id GitHub.cli --source winget
```

安裝完成後登入 GitHub：

```bash
gh auth login
```

確認登入狀態：

```bash
gh auth status
```

---

# 2. 啟動 Codex

進入專案：

```bash
cd your-project
```

啟動 Codex：

```bash
codex
```

Codex 啟動後，就可以直接要求它：

```text
先閱讀這個專案，告訴我目前的架構。
```

或：

```text
幫我找出 authentication 相關的程式碼在哪裡。
```

在開始修改程式碼前，建議先確認 Git 狀態：

```bash
git status
```

避免一開始就有不知道來源的未提交修改。

---

# 3. 安裝 OpenSpec

OpenSpec 用來管理：

- Requirement
- Spec
- Design
- Implementation Tasks
- Change history

也就是讓我們在「開始寫 Code 之前」，先確定到底要做什麼。

## 確認 Node.js

OpenSpec 需要 Node.js 20.19 以上。

```bash
node --version
```

## 安裝 OpenSpec

```bash
npm install -g @fission-ai/openspec@latest
```

確認是否安裝成功：

```bash
openspec --version
```

---

# 4. 在專案初始化 OpenSpec

進入專案後：

```bash
openspec init
```

初始化時選擇：

```text
Codex
```

也可以直接指定：

```bash
openspec init --tools codex --profile core
```

完成後專案會出現：

```text
openspec/
├── specs/
├── changes/
└── config.yaml
```

其中：

```text
openspec/specs/
```

代表目前系統已經存在的正式 Spec。

而：

```text
openspec/changes/
```

代表正在討論、開發中的 Change。

---

# 5. OpenSpec 的基本概念

不要把一整個大型 PRD 當成一個 Change。

比較好的方式是：

```text
PRD
 ↓
拆成數個可以獨立開發、測試、Review 的 Change
```

例如一個 PRD 是：

```text
會員系統
```

可能拆成：

```text
Change 1
add-email-registration

Change 2
add-email-login

Change 3
add-password-reset

Change 4
add-google-login
```

每一個 Change 都應該是一個範圍清楚、可以驗證完成與否的功能。

---

# 6. 有 PRD 時的流程

如果已經有 PRD，不建議直接叫 Codex 開始寫 Code。

先讓 Codex閱讀 PRD。

例如：

```text
請先閱讀這份 PRD 和目前的 codebase。

先不要修改任何程式碼。

請確認：

1. PRD 有沒有模糊或矛盾的地方
2. 有沒有缺少 edge case
3. 有沒有技術上需要先決定的事情
4. 現有系統有哪些地方會受到影響
5. 有哪些問題需要我回答

在需求確認完成之前不要開始 implementation。
```

接著和 Codex 討論。

直到所有重要問題都確認後，再跟它說：

```text
根據目前確認完成的需求，

請把這份 PRD 拆成適合 OpenSpec 的 Changes。

每個 Change 必須：

1. 可以獨立實作
2. 可以獨立測試
3. Scope 清楚
4. 不要過大
5. 不要開始寫程式碼

列出建議的 Change 名稱，以及每個 Change 負責的範圍。
```

例如 Codex 最後可能整理成：

```text
1. add-user-registration
2. add-email-verification
3. add-login
4. add-password-reset
5. add-google-oauth
```

接著再逐一建立 OpenSpec Change。

---

# 7. 沒有 PRD 時怎麼做

「沒有 PRD」其實要分成兩種情況。

## 情況 A：已經有 Codebase，只是沒有 PRD

例如：

```text
project/
├── src/
├── package.json
└── ...
```

這時候可以直接使用 OpenSpec Explore。

因為 Codex 可以從：

- 現有 Code
- Database Schema
- Existing API
- Tests
- Config
- Existing Architecture

去理解目前系統，再跟你討論新功能。

流程：

```text
Idea
 ↓
$openspec-explore
 ↓
閱讀現有 Codebase
 ↓
確認需求
 ↓
拆 Change
 ↓
$openspec-propose
```

---

## 情況 B：什麼都沒有，只有 Idea

例如現在只有一句：

```text
我想做一個可以讓公司內部員工
使用 AI 搜尋公司文件的系統。
```

但現在：

```text
沒有 PRD
沒有 Code
沒有 DB
沒有 API
沒有 Architecture
甚至還沒有決定 Tech Stack
```

這種情況不建議馬上：

```text
$openspec-propose
```

也不建議直接叫 Codex：

```text
幫我建立這個系統。
```

因為目前有太多尚未決定的事情。

這時候建議先使用：

```text
$grill-me
```

> `grill-me` 是額外的 Agent Skill，不是 OpenSpec 本身的一部分。

它的工作不是產生 Code。

它的工作是：

```text
把你腦中的 Idea 問清楚。
```

---

# 8. Greenfield 專案：先使用 grill-me

當專案完全是空的時，推薦流程：

```text
Idea
 ↓
$grill-me
 ↓
釐清產品需求
 ↓
釐清重要技術決策
 ↓
形成 Product Brief / PRD
 ↓
$openspec-explore
 ↓
拆成 Changes
 ↓
$openspec-propose
 ↓
Implementation
```

`grill-me` 和 `$openspec-explore` 的角色不太一樣。

| 工具 | 主要目的 |
|---|---|
| `grill-me` | 不斷問你問題，把模糊的想法與假設逼出來 |
| `$openspec-explore` | 探索需求、技術方案與 Change 的可能方向 |
| `$openspec-propose` | 把已經決定要做的事情正式寫成 Spec / Design / Tasks |

簡單來說：

```text
grill-me
=
我們到底要做什麼？
```

```text
openspec-explore
=
既然要做這個，我們應該怎麼切、怎麼設計？
```

```text
openspec-propose
=
好，決定了，把它正式寫成 Change。
```

---

## 第一步：Grill Product Idea

例如你只有：

```text
我想做一個 AI 文件搜尋系統。
```

執行：

```text
$grill-me
```

然後告訴 Codex：

```text
我目前只有一個產品想法：

我想做一個讓公司員工可以使用 AI
搜尋與詢問公司內部文件的系統。

目前沒有 PRD、沒有 Codebase，也沒有 Architecture。

請先不要產生程式碼。

請透過 grill-me 把這個產品的需求問清楚。

我們需要釐清：

- 這個產品解決什麼問題
- 誰會使用
- MVP 要包含什麼
- 哪些東西不做
- 主要 User Flow
- Permission
- Authentication
- Data Source
- Search 行為
- AI 回答行為
- Error / Edge Cases
- Security
- Technical Constraints

如果還有其他重要問題也要提出來。

一次處理一個決策，直到我們對產品有共同理解。
```

這時 Codex 應該開始問你問題。

例如：

```text
第一個問題：

這個系統主要是：

A. 公司所有員工都可以搜尋所有文件
B. 每個員工只能搜尋自己有權限看的文件
C. MVP 先不處理權限

我的建議是 B，因為文件權限會直接影響後面的資料模型與搜尋架構。

你希望是哪一個？
```

你回答：

```text
B
```

然後繼續下一個問題。

---

## Grill-me 要問到什麼程度？

不需要把每一個 UI pixel 都決定完。

目標是把會影響產品與架構的重要決策釐清。

例如：

```text
Problem
Users
MVP Scope
Out of Scope
Core User Flow
Authentication
Permission
Data
Integration
Platform
Security
Major Constraints
Success Criteria
```

直到已經可以清楚回答：

```text
我們在做什麼？
為誰做？
第一版要做什麼？
第一版不做什麼？
什麼叫做完成？
有哪些不能亂猜的限制？
```

就可以停止 Grill。

---

# 9. Grill 完之後，再使用 OpenSpec

Grill 完之後，先不要直接寫 Code。

先讓 Codex 把剛剛的決策整理成一份 Product Brief。

例如：

```text
根據剛才 grill-me 確認完成的所有決策，

請整理成一份 Product Brief。

包含：

# Problem

# Target Users

# Goal

# MVP Scope

# Out of Scope

# Core User Flows

# Functional Requirements

# Permissions

# Data Requirements

# Edge Cases

# Technical Constraints

# Acceptance Criteria

# Open Questions

不要開始 implementation。

如果還有會影響 Scope 或 Architecture 的重大問題，
先提出來。
```

最後可能會得到：

```text
docs/
└── product-brief.md
```

這份文件就是接下來的 Source of Truth。

---

## 接著使用 OpenSpec Explore

現在才進入：

```text
$openspec-explore
```

這時候要特別告訴 Codex：

```text
這是一個 Greenfield Project。

目前還沒有任何 application code。

請閱讀我們剛才確認完成的 Product Brief。

先不要 Implementation。

請 Explore：

1. 這個產品適合的整體 Architecture
2. Tech Stack 選擇
3. Data Model
4. Authentication / Authorization
5. External Services
6. Project Structure
7. Testing Strategy
8. Deployment Strategy
9. 哪些決策是整個 Project 共用的
10. MVP 應該拆成哪些 OpenSpec Changes

如果還有沒有決定、但會影響後續 Change 的問題，
請先提出來。
```

因為現在沒有 Codebase，所以 `$openspec-explore` 不需要：

```text
閱讀目前 implementation
```

它應該改成根據：

```text
Product Brief
+
已確認的 Decisions
+
Technical Constraints
```

來探索架構。

---

## 不需要先設計完整系統

即使是 Greenfield Project，也不要一次設計完未來兩年的 Architecture。

只需要先決定會影響 MVP 的基礎。

例如：

```text
Frontend
Backend
Database
Authentication
Deployment
Testing
Project Structure
```

其他還沒有需要的東西可以延後決定。

例如：

```text
Microservices
Event Bus
Complex Caching
Multi-region
Advanced Observability
```

如果 MVP 還不需要，就不要因為「以後可能需要」而提前建立。

---

## 接著拆成 OpenSpec Changes

當 Product 與基礎 Architecture 都已經足夠清楚後，要求 Codex：

```text
根據 Product Brief 與目前確認的 Architecture，

請把 MVP 拆成適合 OpenSpec 的 Changes。

原則：

1. 每個 Change 可以獨立理解
2. 每個 Change 可以獨立驗證
3. Scope 不要太大
4. 優先建立可以 end-to-end 驗證的功能
5. 不要一次建立整個產品
6. 不要開始 Implementation

請列出：

- Change Name
- Goal
- Scope
- Dependencies
- 完成這個 Change 後可以驗證什麼
```

例如可能得到：

```text
1. bootstrap-project-foundation

2. add-user-authentication

3. add-document-ingestion

4. add-document-permissions

5. add-document-search

6. add-ai-question-answering

7. add-search-ui
```

---

## 第一個 Change 不代表「把所有 Architecture 做完」

例如：

```text
bootstrap-project-foundation
```

應該只建立後續功能真正需要的基礎。

例如：

```text
Application framework
Project structure
Database connection
Testing setup
Lint / Format
Environment configuration
```

而不是一次建立：

```text
所有未來 Service
所有 Database Table
所有 API
所有 Infrastructure
```

Architecture 也應該隨著 Change 演進。

---

## Greenfield 完整流程

所以如果現在真的：

```text
什麼都沒有
只有 Idea
```

推薦流程是：

```text
Idea
 ↓
$grill-me
 ↓
把產品需求問清楚
 ↓
Product Brief
 ↓
$openspec-explore
 ↓
確認 MVP Architecture
 ↓
拆 Changes
 ↓
$openspec-propose
 ↓
Review Spec / Design / Tasks
 ↓
$openspec-apply-change
 ↓
Review + Test
 ↓
$openspec-archive-change
 ↓
下一個 Change
```

OpenSpec 可以從完全空的 Greenfield Project 開始。

一開始：

```text
openspec/specs/
```

是空的沒有問題。

之後隨著：

```text
Change 1
 ↓
Archive

Change 2
 ↓
Archive

Change 3
 ↓
Archive
```

Project 的 Specs 才逐漸建立起來。

---

# 10. 建立 OpenSpec Change

假設決定第一個 Change 是：

```text
add-email-notification
```

在 Codex 中執行：

```text
$openspec-propose add-email-notification
```

OpenSpec 會建立：

```text
openspec/
└── changes/
    └── add-email-notification/
        ├── proposal.md
        ├── design.md
        ├── tasks.md
        └── specs/
```

其中：

## proposal.md

回答：

```text
為什麼要做這個 Change？
要改什麼？
影響什麼？
```

## specs/

定義：

```text
系統應該有什麼行為？
```

通常包含 Requirement 與 Scenario。

## design.md

定義：

```text
技術上打算怎麼做？
```

## tasks.md

定義：

```text
Implementation 要做哪些事情？
```

---

# 11. Proposal 建好後不要直接 Implement

Proposal 建立完成後，先 Review：

```text
proposal.md
specs/
design.md
tasks.md
```

確認：

```text
需求有沒有漏掉？
       ↓
Scenario 完不完整？
       ↓
Design 是否符合現有架構？
       ↓
Tasks 是否合理？
```

如果有問題，直接告訴 Codex：

```text
這個 Change 有幾個地方需要修改：

1. XXX 不需要做
2. XXX 必須支援 YYY
3. XXX 的 error handling 需要補上
4. Design 不要新增新的 service，使用目前 existing service

請更新這個 OpenSpec Change。

先不要 implementation。
```

也可以使用：

```text
$openspec-update-change
```

更新 planning artifacts。

---

# 12. 開始實作

Spec 確認沒有問題後，再執行：

```text
$openspec-apply-change add-email-notification
```

Codex 會按照：

```text
tasks.md
```

逐項實作。

不是一次自由發揮整個功能。

---

# 13. Implementation 完成後

先檢查：

```bash
git status
```

以及：

```bash
git diff
```

接著讓 Codex Review：

```text
/review
```

或直接要求：

```text
請根據這個 OpenSpec Change review 目前 implementation。

確認：

1. 所有 requirements 都有實作
2. 所有 scenarios 都有處理
3. 沒有超出 Change scope
4. 沒有明顯 regression
5. Tests 是否足夠

先不要修改程式碼，先列出問題。
```

確認問題後再修正。

---

# 14. Archive Change

功能完成並確認後：

```text
$openspec-archive-change add-email-notification
```

完成後，這次 Change 的 Spec 就會成為系統正式 Spec 的一部分。

然後進行下一個 Change。

例如：

```text
add-email-notification
        ↓
archive
        ↓
add-push-notification
        ↓
archive
        ↓
add-notification-preferences
```

---

# 15. 完整工作流程

## 有 PRD

```text
PRD
 ↓
Codex 閱讀 PRD
 ↓
找問題
 ↓
與使用者確認需求
 ↓
拆成 Changes
 ↓
$openspec-propose
 ↓
Review Proposal / Spec / Design / Tasks
 ↓
$openspec-apply-change
 ↓
Test
 ↓
/review
 ↓
$openspec-archive-change
 ↓
下一個 Change
```

---

## 沒有 PRD

```text
Idea
 ↓
$openspec-explore
 ↓
Codex 閱讀 Codebase
 ↓
Codex 問問題
 ↓
使用者回答
 ↓
需求逐漸清楚
 ↓
整理 Goal / Scope / Requirement / Acceptance Criteria
 ↓
拆成 Changes
 ↓
$openspec-propose
 ↓
Review Spec
 ↓
$openspec-apply-change
 ↓
Test
 ↓
/review
 ↓
$openspec-archive-change
```

---

# 16. 最重要的原則

## 不要一有想法就叫 Codex 寫 Code

錯誤：

```text
我要做 notification system，幫我做。
```

比較好的方式：

```text
Idea
↓
Discussion
↓
Spec
↓
Implementation
```

---

## 不確定需求時先 Explore

```text
$openspec-explore
```

---

## 需求清楚後才 Propose

```text
$openspec-propose
```

---

## Proposal 一定要 Review

尤其要看：

```text
proposal.md
specs/
design.md
tasks.md
```

---

## 確認後才 Apply

```text
$openspec-apply-change
```

---

## 完成後 Archive

```text
$openspec-archive-change
```

---

# TL;DR

沒有 PRD：

```text
codex
        ↓
$openspec-explore
        ↓
把需求問清楚
        ↓
拆 Changes
        ↓
$openspec-propose
        ↓
Review Spec
        ↓
$openspec-apply-change
        ↓
Review + Test
        ↓
$openspec-archive-change
```

有 PRD：

```text
PRD
 ↓
Codex Plan / Discussion
 ↓
確認所有問題
 ↓
拆 Changes
 ↓
$openspec-propose
 ↓
Review
 ↓
$openspec-apply-change
 ↓
Review + Test
 ↓
$openspec-archive-change
```
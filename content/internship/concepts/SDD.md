---
title: SDD：OpenSpec 與 Spec Kit
description: 實習中整理 Spec-Driven Development、OpenSpec 與 GitHub Spec Kit 的使用方式。
date: 2026-09-02
tags:
  - 實習
  - 技術概念
  - SDD
  - OpenSpec
  - Spec Kit
status: reviewing
---

# SDD：OpenSpec 與 Spec Kit

## SDD 是什麼

SDD 是 **Spec-Driven Development（規格驅動開發）**。核心概念是先把「要解決的問題、使用者需求、預期行為與驗收條件」寫成規格，再根據規格進行設計、拆分任務、實作與驗證。

一般流程可以理解成：

```text
需求 → Spec → 設計／Plan → Tasks → 實作 → 測試與驗收
```

這裡的 `spec` 不是單純的說明文件，而是團隊和 AI coding agent 對「系統應該做到什麼」的共同依據。它應該描述可觀察、可驗證的行為；技術細節則放在 design 或 plan 裡。

## 什麼時候適合使用 SDD

適合使用的情況：

- 功能需求不清楚，容易在實作過程中反覆修改。
- 功能較大，會跨越前端、後端、資料庫或多個模組。
- 需要讓 PM、工程師和 AI agent 對完成條件有一致理解。
- 需要留下決策紀錄，方便之後維護或交接。
- 使用 AI coding agent，想避免 agent 直接開始寫程式或遺漏需求。

如果只是修改文字、改一個顏色或修正非常明確的小錯誤，完整跑完 SDD 流程可能成本太高，可以直接處理，或只寫一份簡短的 spec。

## OpenSpec

### OpenSpec 是什麼

OpenSpec 是一個輕量、可設定的 spec-driven framework，讓規格、變更提案和實作任務可以跟著程式碼一起管理。它特別適合已經存在的專案：每次要新增功能或修改行為時，先建立一個 change，再由 AI agent 根據核准的規格實作。

### 安裝與初始化

以下是官方文件中的基本方式：

```bash
npm install -g @fission-ai/openspec@latest
cd <project>
openspec init
```

`openspec init` 會在專案中建立 `openspec/` 設定與 AI 工具需要的 skills／commands。不同 coding agent 顯示的指令名稱可能不同，應以初始化時輸出的格式為準。

### OpenSpec 的工作流程

1. **Explore**：先和 agent 釐清問題、調查現有程式碼與可能方案，不直接修改程式。
2. **Propose**：建立一個 change proposal，整理這次變更的目的與範圍。
3. **Review**：在程式碼修改前檢查需求、spec 和任務是否正確。
4. **Apply**：agent 依照 `tasks.md` 逐項實作，完成一項就勾選一項。
5. **Archive**：完成後把變更歸檔，並將已實作的規格同步到主要 `specs/`。

常見的 OpenSpec skill 名稱如下；實際前綴會依使用的工具而變化：

```text
/openspec-explore <問題或想法>
/openspec-propose <要新增或修改的功能>
/openspec-apply-change <change-id>
/openspec-archive-change <change-id>
```

### OpenSpec 會產生什麼

一個 change 通常放在：

```text
openspec/changes/<change-id>/
├── proposal.md   # 為什麼要改，以及要改什麼
├── specs/        # 可測試的行為需求
├── design.md     # 技術設計與重要決策
└── tasks.md      # 實作清單
```

`openspec/specs/` 是目前系統行為的主要規格；`openspec/changes/archive/` 則保留已完成變更的歷史。這樣可以分開「目前系統應該怎麼運作」和「它是如何演變的」。

也可以使用以下 CLI 指令檢查資料：

```bash
openspec list
openspec status
openspec validate
```

## GitHub Spec Kit

### Spec Kit 是什麼

GitHub Spec Kit 是一個可擴充的、以意圖為中心的 SDD 工具組。它把需求到實作拆成固定階段，並透過 templates、checklists 和 consistency analysis 幫助團隊在寫程式前先確認規格與計畫。

### 安裝與初始化

Spec Kit 的 CLI 名稱是 `specify`，官方基本流程如下：

```bash
uv tool install specify-cli
specify init <project> --integration codex --integration-options="--skills"
cd <project>
```

也可以在目前資料夾初始化：

```bash
specify init --here --integration codex --integration-options="--skills"
```

### Spec Kit 的工作流程

完整流程通常是：

1. **Constitution**：建立專案的原則與開發規範。
2. **Specify**：描述要做什麼以及為什麼做，先不要急著決定技術堆疊。
3. **Clarify／Checklist**：補足模糊需求，檢查規格是否完整。
4. **Plan**：決定技術堆疊、架構與實作方式。
5. **Tasks**：把 plan 拆成有順序、可執行的工作項目。
6. **Analyze**：檢查 `spec.md`、`plan.md` 和 `tasks.md` 是否互相矛盾或遺漏。
7. **Implement**：依照 tasks 實作。
8. **Converge**：把實際程式碼和規格、計畫、任務比對，補上尚未完成的工作。

常見指令如下：

```text
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks
/speckit.implement
/speckit.converge
```

在 Codex CLI 的 skills 模式中，這些指令可能會顯示成 `$speckit-constitution`、`$speckit-specify` 等格式，依 `specify init` 的輸出為準。

### Spec Kit 會產生什麼

每個 feature 通常會有自己的規格與實作資料，例如：

```text
.specify/
├── memory/constitution.md  # 專案共同原則
└── specs/<feature>/
    ├── spec.md              # 使用者需求與驗收條件
    ├── plan.md              # 技術實作計畫
    └── tasks.md             # 實作任務
```

## OpenSpec 和 Spec Kit 的差異

| 比較項目 | OpenSpec | Spec Kit |
| --- | --- | --- |
| 主要方向 | 以一次變更（change）為中心 | 以 feature 與完整開發流程為中心 |
| 適合情境 | 已存在專案的增量修改、功能演進 | 新專案或較大型功能的完整規劃 |
| 主要流程 | Explore → Propose → Review → Apply → Archive | Constitution → Specify → Plan → Tasks → Implement → Converge |
| 規格位置 | `openspec/specs/` | `.specify/` 與 `specs/` |
| 特點 | 流程輕量、變更完成後會歸檔 | 階段較完整，有 constitution、checklist 和分析工具 |

兩者都不是單純的自動產生程式碼工具，而是把需求變成 agent 可以依循、人工可以審查的文件。實際工作時通常選一套作為團隊主要流程，不需要同一個功能同時完整跑兩套。

## 實習工作中的使用建議

以目前的工作情境來看：

- 要在既有專案加入一個 API、頁面功能或修改既有行為時，可以用 **OpenSpec** 先整理 change、影響範圍和驗收條件。
- 要建立一個較完整的新功能，或需要先統一團隊的程式品質、測試與架構原則時，可以用 **Spec Kit**。
- 不論選哪一個，先讓 PM／負責人確認 spec，再讓 agent 開始 plan 和 implement，能減少「做完才發現理解錯誤」的情況。
- 實作完成後要回頭檢查程式是否真的符合 spec；規格有變更時，也要同步更新文件，而不是只修改程式碼。

## 一個實際的記錄方式

例如要新增「產生 HCP 邀請 Excel」功能，可以先記錄：

```text
需求：使用者上傳 Excel 後，系統產生邀請結果檔案。
成功條件：檔案格式正確、必要欄位都有驗證、錯誤時回傳清楚訊息。
不包含：這次不修改登入流程，也不更換既有部署平台。
```

接著再由 OpenSpec 或 Spec Kit 產生 plan 和 tasks。這樣 agent 會知道功能邊界，也比較容易在測試和 code review 時確認是否完成。

## 參考資料

- [OpenSpec 官方首頁](https://openspec.dev/)
- [OpenSpec Quickstart](https://openspec.dev/docs/quickstart)
- [OpenSpec CLI Reference](https://openspec.dev/docs/cli)
- [GitHub Spec Kit README](https://github.com/github/spec-kit/blob/main/README.md)
- [Spec Kit Quickstart](https://github.com/github/spec-kit/blob/main/docs/quickstart.md)

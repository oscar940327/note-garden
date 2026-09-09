---
title: Git 與 Git Graph：從功能分支到測試站、main
description: 實習中整理 Git 分支、Pull Request、測試環境與 Git Graph 的實際操作流程。
date: 2026-09-07
tags:
  - 實習
  - Git
  - Git Graph
  - 版本控制
  - CI/CD
status: reviewing
---

# Git 與 Git Graph

## 背景

在 [[AZ_crestcode_V2]] 完成初步功能後，我需要把修改交給同事 review，並依照團隊流程送到測試站，確認沒有問題後再合併到 <code>main</code>。這讓我開始理解：Git 不只是「把檔案 push 上去」，而是用分支和提交紀錄管理變更，讓每個人都能知道程式碼目前在哪個階段。

這份筆記整理我在 [[work-log/2026-09-07|2026-09-07 上班日誌]] 中接觸到的 Git Graph，以及一套比較安全的交付順序。實際使用時，<code>test</code>、<code>staging</code> 或部署分支的名稱仍要以公司的 repository 規範為準。

## 先理解 Git 裡的幾個位置

| 名稱 | 意義 | 例子 |
| --- | --- | --- |
| Working tree | 我目前正在修改的檔案 | 還沒有 commit 的程式碼 |
| Staging area | 準備放進下一個 commit 的檔案 | <code>git add</code> 後的內容 |
| Local repository | 電腦上的 Git 歷史 | <code>git commit</code> 後的紀錄 |
| Remote repository | GitHub／GitLab 上的共享版本 | 通常叫 <code>origin</code> |
| Feature branch | 某一個功能或 bug fix 的分支 | <code>feature/az-crestcode</code> |
| Test／staging branch | 用來部署測試環境的分支 | <code>test</code> 或 <code>staging</code> |
| <code>main</code> | 通常代表穩定、可發布的主線 | 生產環境可能由它部署 |

<code>main</code> 和測試站不是完全相同的概念。<code>main</code> 是 Git 分支；測試站是部署環境。公司可能設定「合併到 <code>test</code> 後自動部署測試站」，也可能由 CI/CD 或人工執行部署，所以要先確認 repository 的設定。

## 建議的分支與交付流程

最常見的流程是：

~~~text
main／test
    ↓
建立 feature branch
    ↓
修改、測試、commit
    ↓
push feature branch
    ↓
Pull Request → test／staging
    ↓
測試站驗證、review 通過
    ↓
Pull Request → main
~~~

這樣做的好處是功能修改不會直接污染穩定分支，也能讓 reviewer 在合併前檢查程式碼和測試結果。除非團隊明確允許，否則不應直接在 <code>main</code> 上開發或直接 push <code>main</code>。

## 實際操作順序

### 1. 先確認目前狀態

每次開始工作前，先確認目前在哪個分支以及是否有未保存的修改：

~~~bash
git status
git branch --show-current
git remote -v
~~~

如果 <code>git status</code> 顯示有前一個任務的修改，不要急著切換分支或使用 <code>git reset --hard</code>。先判斷要把它 commit、暫存（stash），還是詢問同事如何處理。

### 2. 更新基礎分支

假設這次功能是從 <code>main</code> 開始：

~~~bash
git switch main
git pull --ff-only origin main
~~~

<code>--ff-only</code> 可以避免 Git 在不知情的情況下自動建立合併提交。如果這裡失敗，代表本地和遠端歷史已經分歧，應先查看狀況，不要直接強制覆蓋。

如果公司的功能是從測試分支開始，則把 <code>main</code> 替換成實際分支名稱：

~~~bash
git switch test
git pull --ff-only origin test
~~~

### 3. 建立自己的功能分支

~~~bash
git switch -c feature/az-crestcode
~~~

分支名稱應能說明工作內容，例如：

~~~text
feature/az-crestcode
fix/mobile-video-touch
docs/git-workflow
~~~

分支建立後，後續的修改和 commit 都會留在這個分支，不會直接改到 <code>main</code>。

### 4. 修改並在本地驗證

修改程式後先看差異：

~~~bash
git status
git diff
~~~

再執行專案指定的檢查，例如：

~~~bash
npm run build
npm test
~~~

實際要執行哪些指令，要以專案的 <code>README</code>、<code>package.json</code> 或團隊文件為準。測試結果、使用的環境和尚未解決的問題，都應該記在 Pull Request 說明裡。

### 5. 只把這次工作的檔案加入 commit

~~~bash
git add <file-1> <file-2>
git diff --cached
git commit -m "feat: add AZ crest code flow"
~~~

<code>git diff --cached</code> 很重要，可以在 commit 前再次確認沒有把 <code>.env</code>、個人設定檔、暫存檔或其他人的修改一起提交。每個 commit 盡量只做一件事，之後 review、查錯和回復都會比較容易。

### 6. Push 到遠端功能分支

第一次 push 使用 <code>-u</code> 建立本地與遠端分支的追蹤關係：

~~~bash
git push -u origin feature/az-crestcode
~~~

後續在同一個分支補修改時，只需要：

~~~bash
git add <files>
git commit -m "fix: handle mobile video state"
git push
~~~

### 7. 建立 Pull Request 到測試分支

在 GitHub／GitLab 建立 Pull Request 時，通常是：

~~~text
來源：feature/az-crestcode
目標：test 或 staging
~~~

Pull Request 至少要說明：

- 這次解決什麼問題，以及修改範圍。
- 如何測試，執行了哪些指令。
- 測試站網址或測試方式。
- 已知限制、風險和需要 reviewer 特別注意的地方。

在測試站驗證期間，如果 reviewer 要求修改，不需要重新開分支；直接在原本的 feature branch commit 並 push，Pull Request 會自動更新。

### 8. 測試通過後合併到 <code>main</code>

如果公司的規則是「先進測試分支，再進 <code>main</code>」，測試通過後通常建立第二個 Pull Request：

~~~text
來源：test 或 staging
目標：main
~~~

如果公司允許在本地合併，概念上則是先切到目標分支、更新它，再合併來源分支：

~~~bash
git switch main
git pull --ff-only origin main
git merge --no-ff feature/az-crestcode
git push origin main
~~~

但許多團隊會保護 <code>main</code>，不允許直接 push；這時應使用 Pull Request，讓 CI、review 和權限規則完成合併。不要因為 push 被拒絕就使用 <code>--force</code> 繞過保護。

## 遠端有新修改時怎麼同步

在 Pull Request 還沒合併前，<code>main</code> 或 <code>test</code> 可能已經有其他人的新 commit。可以先抓取遠端資訊，再把目標分支合併到自己的分支：

~~~bash
git fetch origin
git switch feature/az-crestcode
git merge origin/test
~~~

如果公司規定使用 rebase，就依團隊規範改用 rebase；不要在不知道規則時自行改寫已經被別人使用的公開分支歷史。

遇到 conflict 時的安全順序：

~~~bash
git status
# 手動檢查並修改衝突檔案，移除 <<<<<<<、=======、>>>>>>> 標記
git add <已解決的檔案>
git commit
git push
~~~

解衝突時不能只看哪一邊的內容比較多，而要依照需求、測試結果和兩個分支的目的判斷。如果發現合併方向錯了，可以先停止並使用：

~~~bash
git merge --abort
~~~

## Git Graph 要怎麼看

我使用的 Git Graph 是 VS Code 的圖形化 Git 工具。可以在 VS Code 按 <code>Ctrl + Shift + P</code>，執行：

~~~text
Git Graph: View Git Graph
~~~

如果 workspace 裡有多個 repository，要先在 Git Graph 的 repository 下拉選單選正確的專案。官方 Git Graph 擴充功能可以顯示 local／remote branches、tags、未提交修改，也可以點選 commit 查看檔案差異；右鍵分支或 commit 還能執行 checkout、merge、pull、push 等操作。

### 圖上的元素

| 圖形或文字 | 意義 |
| --- | --- |
| 圓點 | 一個 commit；點擊後可查看訊息、作者和修改檔案 |
| 線 | commit 之間的父子關係 |
| 分岔 | 從某個 commit 建立了另一條分支 |
| 匯合 | 兩條歷史合併；merge commit 通常有兩個 parent |
| <code>HEAD</code> | 我目前 checkout 的位置，也就是目前工作分支 |
| <code>main</code>、<code>feature/...</code> | 本地 branch 指標 |
| <code>origin/main</code> | 最近一次 fetch 到本地的遠端分支指標 |
| 未提交修改 | Working tree 還沒有進入 commit 的變更 |

通常上方是較新的 commit、下方是較舊的 commit，但仍要搭配日期確認。線的顏色主要用來區分不同的歷史路徑，不代表測試通過或程式碼品質。

### 用 Git Graph 判斷目前狀態

1. 先按 Fetch，更新 <code>origin/*</code> 的遠端追蹤資訊；沒有 fetch 時，圖上可能不是遠端最新狀態。
2. 確認 <code>HEAD</code> 在自己的 feature branch，不是在 <code>main</code> 上直接修改。
3. 看 feature branch 是否從正確的 <code>main</code> 或 <code>test</code> 分岔出來。
4. 看自己的 commit 是否位於 feature branch 上，且 remote branch label 是否已經跟上。
5. 點擊每個重要 commit，檢查檔案差異和 commit message。
6. 建立 Pull Request 前，確認沒有把不相關的 commit、機密檔案或產生檔推上去。

也可以在終端機用文字版 graph 交叉確認：

~~~bash
git log --oneline --decorate --graph --all
~~~

Git Graph 適合幫助我理解歷史，但它不會取代 <code>git status</code>、測試指令、CI 結果或 code review。圖上看起來「接在一起」只代表 commit 歷史有關係，不代表功能已經驗證完成。

## 常見錯誤與避免方式

| 錯誤 | 改善方式 |
| --- | --- |
| 直接在 <code>main</code> 開發 | 從最新基礎分支建立 feature branch |
| 還沒更新就開始改 | 開始前先 <code>git pull --ff-only</code> |
| <code>git add .</code> 把不該提交的檔案一起加入 | 用 <code>git status</code> 和 <code>git diff --cached</code> 檢查 |
| 把測試站當成一定存在的 <code>test</code> 分支 | 先確認公司的實際分支與 CI/CD 設定 |
| 看到 push 成功就以為測試站更新 | 確認 CI/CD job、部署紀錄和測試站網址 |
| 用 <code>git push --force</code> 解決問題 | 先了解分支歷史；必要時只依規範使用 <code>--force-with-lease</code> |
| 只看 Git Graph 不看 commit 內容 | 點開 commit diff，並搭配測試與 review |

## 這次實習的學習與反思

1. 我學到分支不是多複製一份專案，而是讓不同工作線可以在同一份 Git 歷史中分開前進。
2. 我理解「送到測試站」和「合併到 <code>main</code>」是不同階段，兩者之間需要 review、CI 和實際測試結果作為判斷依據。
3. Git Graph 讓我用視覺方式看到分支從哪裡分開、哪些 commit 已經合併，以及本地和遠端的差異。
4. 之後交付功能時，我會先確認目標分支與部署規則，再依序完成 branch、commit、push、Pull Request 和測試驗證，而不是只關心最後的 push 是否成功。

## 快速查詢指令

~~~bash
git status                         # 查看工作區狀態
git branch -a                      # 查看本地與遠端分支
git branch --show-current          # 查看目前分支
git fetch origin                   # 更新遠端追蹤資訊
git log --oneline --decorate --graph --all
git diff                           # 查看尚未加入 staging 的修改
git diff --cached                  # 查看已加入 staging 的修改
~~~

## 參考資料

- [Git 官方 Pro Git：Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [Git 官方 Pro Git：Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging.html)
- [Visual Studio Code：Branches and Worktrees](https://code.visualstudio.com/docs/sourcecontrol/branches-worktrees)
- [Git Graph 官方 repository（VS Code 擴充功能）](https://github.com/mhutchie/vscode-git-graph)

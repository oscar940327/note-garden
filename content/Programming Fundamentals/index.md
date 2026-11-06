---
title: Programming Fundamentals
description: 八週 Python、JavaScript 與 TypeScript 基礎學習計畫，練習閱讀程式、定位錯誤與和 AI 協作修改。
tags:
  - programming-fundamentals
---

# Programming Fundamentals

## 學習目標

這份計畫以 Python、JavaScript 與 TypeScript 的基礎為主，目標是：

- 看懂 AI 生成的程式碼，能用自己的話解釋邏輯。
- 追蹤函式呼叫與資料流，定位 Bug 可能發生的位置。
- 向 AI 描述預期行為與實際結果，要求最小修改，並透過執行或測試驗證。

不以學完整個語言為目標，也不以教材是否全部看完判斷進度。若某週需要更多時間，可以延後，尤其第 4、6、7 週的內容較難。

## 學習進度

- [ ] Week 01：能追蹤變數的值與條件分支。
- [ ] Week 02：能追蹤資料如何被讀取、篩選與修改。
- [ ] Week 03：能說明函式的輸入、回傳值與呼叫關係。
- [ ] Week 04：能使用中斷點、查看變數並讀懂基本錯誤訊息。
- [ ] Week 05：能理解檔案讀寫與非同步等待。
- [ ] Week 06：能看懂簡單測試、HTTP 請求與 TypeScript 物件型別。
- [ ] Week 07：能追蹤真實專案中的一段完整執行流程。
- [ ] Week 08：能各完成一次 Python 與 TypeScript 的除錯及驗證。

## 每週安排

每週安排 3 天 Python、2 天 JavaScript／TypeScript，每天約 60–90 分鐘。

| 星期 | 學習內容 |
| --- | --- |
| 週一 | Python：學習新章節 |
| 週二 | Python：習題與程式追蹤 |
| 週三 | JavaScript／TypeScript：學習新章節 |
| 週四 | Python：Debugging 練習 |
| 週五 | JavaScript／TypeScript：練習與 Debugging |
| 週末 | 補進度、複習，或閱讀 Diary 的一個函式 |

一次約 75 分鐘可以分成：25 分鐘教材、20 分鐘練習、20 分鐘執行與除錯、10 分鐘請 AI 協助檢討。

## Week 01｜11/9–11/15：變數、型別與條件判斷

單元紀錄：[[Programming Fundamentals/Week 01/index|Week 01 單元筆記與驗收]]

### Python

- [Variables](https://www.w3schools.com/python/python_variables.asp)
- [Data Types](https://www.w3schools.com/python/python_datatypes.asp)
- [If / Else](https://www.w3schools.com/python/python_conditions.asp)

### JavaScript

- [Variables](https://www.w3schools.com/js/js_variables.asp)
- [Data Types](https://www.w3schools.com/js/js_datatypes.asp)
- [If / Else](https://www.w3schools.com/js/js_if_else.asp)

**本週驗收：**看到簡單程式碼，能解釋每個變數的值，以及程式會走哪個條件分支。

## Week 02｜11/16–11/22：資料結構與迴圈

單元紀錄：[[Programming Fundamentals/Week 02/index|Week 02 單元筆記與驗收]]

### Python

- [Lists](https://www.w3schools.com/python/python_lists.asp)
- [Dictionaries](https://www.w3schools.com/python/python_dictionaries.asp)
- [For Loops](https://www.w3schools.com/python/python_for_loops.asp)

### JavaScript

- [Arrays](https://www.w3schools.com/js/js_arrays.asp)
- [Objects](https://www.w3schools.com/js/js_objects.asp)
- [For Loops](https://www.w3schools.com/js/js_loop_for.asp)

**本週驗收：**能追蹤清單中的資料怎麼被讀取、篩選與修改，理解常見的資料結構。

## Week 03｜11/23–11/29：Function、Return 與 Import

### Python

- [Functions](https://www.w3schools.com/python/python_functions.asp)
- [Modules](https://www.w3schools.com/python/python_modules.asp)

### JavaScript

- [Functions](https://www.w3schools.com/js/js_functions.asp)
- [Arrow Functions](https://www.w3schools.com/js/js_arrow_function.asp)
- [Modules](https://www.w3schools.com/js/js_modules.asp)

**本週驗收：**能說出一個函式接收什麼、回傳什麼，以及是由哪個函式呼叫它。可以開始閱讀 Diary 的 `commandResponse()`。

## Week 04｜11/30–12/6：錯誤處理、JSON 與 Debugging 入門

### Python

- [Try / Except](https://www.w3schools.com/python/python_try_except.asp)
- [JSON](https://www.w3schools.com/python/python_json.asp)

### JavaScript／TypeScript

- [Error Handling](https://www.w3schools.com/js/js_errors.asp)
- [Debugging](https://www.w3schools.com/js/js_debugging.asp)
- [TypeScript Simple Types](https://www.w3schools.com/typescript/typescript_simple_types.php)

### Debugging 工具

- [VS Code 官方 Debugging 教學](https://code.visualstudio.com/docs/debugtest/debugging)

**本週驗收：**學會設定 Breakpoint（中斷點）、查看變數、使用 Step Over，以及讀懂基本錯誤訊息。

## Week 05｜12/7–12/13：Python 檔案操作與 JavaScript 非同步

### Python

- [File Handling](https://www.w3schools.com/python/python_file_handling.asp)
- [File Write](https://www.w3schools.com/python/python_file_write.asp)
- [Classes 基礎](https://www.w3schools.com/python/python_classes.asp)

### JavaScript

- [Promises](https://www.w3schools.com/js/js_async_promises.asp)
- [Async / Await](https://www.w3schools.com/js/js_async_await.asp)

**本週驗收：**理解檔案資料如何載入、非同步函式如何等待結果，以及錯誤可能從哪裡傳出。

## Week 06｜12/14–12/20：Python 測試、JavaScript API 與 TypeScript 型別

### Python

- [pytest 入門](https://docs.pytest.org/en/stable/getting-started.html)
- [JSON 複習](https://www.w3schools.com/python/python_json.asp)

### JavaScript／TypeScript

- [Fetch](https://www.w3schools.com/js/js_async_fetch.asp)
- [Object Types](https://www.w3schools.com/typescript/typescript_object_types.php)
- [Type / Interface](https://www.w3schools.com/typescript/typescript_aliases_and_interfaces.php)

**本週驗收：**能看懂簡單測試案例，理解 HTTP Request / Response 和 TypeScript 物件型別。

## Week 07｜12/21–12/27：閱讀真實專案與追蹤資料流

### Python：FastAPI 專案

- [main.py](https://github.com/oscar940327/fastapi-portfolio-api/blob/main/main.py)
- [projects.py](https://github.com/oscar940327/fastapi-portfolio-api/blob/main/routers/projects.py)

### TypeScript：Diary 驗證流程

- [Union Types](https://www.w3schools.com/typescript/typescript_union_types.php)
- [Type Guards](https://www.w3schools.com/typescript/typescript_type_guards.php)
- [Diary discord.ts](https://github.com/oscar940327/diary/blob/change/bootstrap-discord-bot/src/discord.ts)

**本週驗收：**Python 能追蹤一個 API 的執行流程；Diary 能解釋 `/ping` 如何通過驗證、權限檢查並回覆。

## Week 08｜12/28–2027/1/3：實戰 Debugging 與 AI 協作修改

### Python

- [FastAPI 原始專案](https://github.com/oscar940327/fastapi-portfolio-api)
- [Python Code Challenges](https://www.w3schools.com/python/python_challenges.asp)

### JavaScript／TypeScript

- [TypeScript Async](https://www.w3schools.com/typescript/typescript_async.php)
- [TypeScript Exercises](https://www.w3schools.com/typescript/typescript_exercises.php)
- [Diary 分支](https://github.com/oscar940327/diary/tree/change/bootstrap-discord-bot)

**本週驗收：**各挑一個 Python 和 TypeScript 的 Bug，能觀察錯誤、提出可能原因、要求 AI 最小修改，並透過測試驗證。

## 固定練習題庫

學完當週章節後，到對應頁面尋找相同主題的習題。

- [Python Exercises](https://www.w3schools.com/python/python_exercises.asp)：第 1–8 週，選當週學過的主題。
- [JavaScript Exercises](https://www.w3schools.com/js/js_exercises.asp)：第 1–6 週，練習語法與資料處理。
- [TypeScript Exercises](https://www.w3schools.com/typescript/typescript_exercises.php)：第 4–8 週，練習型別與函式。

一般 Exercises 以選擇題與填空題為主。Debugging 練習要把程式放進 VS Code 實際執行、觀察結果；Python Code Challenges 則可以作為親自寫程式的練習。

## 每週紀錄方式

每週使用獨立資料夾，裡面依學習單元建立筆記。已先建立 Week 01、Week 02，之後學到其他週次時再沿用這個結構：

```text
Programming Fundamentals/
├── index.md
├── Week 01/
│   ├── index.md
│   ├── Python - Variables.md
│   ├── Python - Data Types.md
│   ├── Python - If Else.md
│   ├── JavaScript - Variables.md
│   ├── JavaScript - Data Types.md
│   └── JavaScript - If Else.md
└── Week 02/
    ├── index.md
    ├── Python - Lists.md
    ├── Python - Dictionaries.md
    ├── Python - For Loops.md
    ├── JavaScript - Arrays.md
    ├── JavaScript - Objects.md
    └── JavaScript - For Loops.md
```

這份 `index.md` 保存完整學習計畫與教材清單；各週的 `index.md` 只整理單元進度、驗收與回顧。每個單元範本附上對應教材連結，記錄自己的理解、實際程式、預期與實際結果、除錯過程及 AI 協作心得。

學完一個單元，再勾選該週的單元清單；完成本週驗收後，再勾選上方的八週學習進度。

值得重複查閱的概念，例如 `return`、`async/await`，等有實際心得後再獨立建立概念筆記，從每週紀錄連過去。

這八週的 Diary 可以先不新增功能，每週拿一個現有函式當閱讀教材即可。每週以「能解釋程式邏輯、實際執行、觀察錯誤」作為完成標準。

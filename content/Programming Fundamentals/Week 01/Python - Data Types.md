---
title: Python｜資料型別
description: Week 01 的 Python Data Types 學習紀錄範本。
---

# Python｜資料型別

[[Programming Fundamentals/Week 01/index|返回 Week 01]] · [[Programming Fundamentals/index|八週學習計畫]]

- 學習日期：2026/11/11
- 教材：[W3Schools Data Types](https://www.w3schools.com/python/python_datatypes.asp)

## 本單元目標

能辨認基本資料型別，並說明不同型別的值會如何影響運算。

## 我的理解

| 程式碼 | 資料型別 |
| --- | --- |
| `x = "Hello World"` | `str` |
| `x = 20` | `int` |
| `x = 20.5` | `float` |
| `x = 1j` | `complex` |
| `x = ["apple", "banana", "cherry"]` | `list` |
| `x = ("apple", "banana", "cherry")` | `tuple` |
| `x = range(6)` | `range` |
| `x = {"name": "John", "age": 36}` | `dict` |
| `x = {"apple", "banana", "cherry"}` | `set` |
| `x = frozenset({"apple", "banana", "cherry"})` | `frozenset` |
| `x = True` | `bool` |
| `x = b"Hello"` | `bytes` |
| `x = bytearray(5)` | `bytearray` |
| `x = memoryview(bytes(5))` | `memoryview` |
| `x = None` | `NoneType` |

## 程式練習

#### 題目
```python
# Create variables


# Print the data type of each variable

```

#### 答案
```python
# Create variables
x = 5
y = 3.14
z = "Hello"

# Print the data type of each variable
print(type(x))
print(type(y)) 
print(type(z))
```

## 還不理解的問題

- 待記錄。

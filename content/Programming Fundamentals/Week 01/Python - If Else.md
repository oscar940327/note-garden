---
title: Python｜條件判斷
description: Week 01 的 Python If Else 學習紀錄範本。
---

# Python｜條件判斷

[[Programming Fundamentals/Week 01/index|返回 Week 01]] · [[Programming Fundamentals/index|八週學習計畫]]

- 學習日期：2026/11/11
- 教材：[W3Schools If Else](https://www.w3schools.com/python/python_conditions.asp)

## 我的理解

1. one-line `if` statement
```python
a = 5
b = 2
if a > b: print("a is greater than b")
```

2. one-line `if/else` that prints a value
```python
a = 2
b = 330
print("A") if a > b else print("B")
```

3. one-line `if/else` to choose a value and assign it to a variable
```python
a = 10
b = 20
bigger = a if a > b else b
print("Bigger is", bigger)
```

4. one line, three outcomes
```python
a = 330
b = 330
print("A") if a > b else print("=") if a == b else print("B")
```

5. and, or, not
```python
if a > b and c > a:
if a > b or a > c:
if not a > b:

if (age < 18 or age > 65) and not is_student or has_discount_code:
```

6. pass 使用時機

   `pass` 不做任何事，只用來佔位，程式會繼續往下執行。

   - 先搭好架構，邏輯之後再寫。
   - 條件分支需要內容，但不需要執行動作。
   - 函式或類別暫時留空，之後再實作。

   ```python
   age = 20
   if age >= 18:
       pass  # 不需要做任何事

   def send_email():
       pass  # 之後再寫寄信邏輯

   class Player:
       pass  # 之後再補類別內容
   ```

   注意：只有註解不能當作區塊內容，還是需要 `pass`。

## 程式練習

#### 題目

1. Create a variable age with the value 20
2. Write an if statement that prints "Child" if age is less than 13
3. Add an elif that prints "Teenager" if age is less than 18
4. Add an else that prints "Adult"
```python
# Create age variable

# Write if/elif/else

```

#### 答案

```python
# Create age variable
age = 20
# Write if/elif/else
if age < 13:
	print("Child")
elif age < 18:
	print("Teenager")
else:
	print("Adult")
```

## 還不理解的問題

- 待記錄。

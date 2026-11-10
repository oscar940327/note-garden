---
title: Python｜變數
description: Week 01 的 Python Variables 學習紀錄範本。
---

# Python｜變數

[[Programming Fundamentals/Week 01/index|返回 Week 01]] · [[Programming Fundamentals/index|八週學習計畫]]

- 學習日期：2026/11/11
- 教材：[W3Schools Variables](https://www.w3schools.com/python/python_variables.asp)

## 我的理解

1. python 的變數型別可以變換
```python
x = 4       # x is of type int
x = "Sally" # x is now of type str
```

2. 變數名稱第一個字不能是數字、不能有空格、不能有 -
```python 
2myvar = "John"
my-var = "John"
my var = "John"
```

3. unpacking
```python
fruits = ["apple", "banana", "cherry"]
x, y, z = fruits
print(x) # apple
print(y) # banana
print(z) # cherry
```

4. global 變數
```python
def myfunc():
  global x
  x = "fantastic"

myfunc()

print("Python is " + x) # python is fantastic
```

## 程式練習

先寫預期結果，再貼上自己實際執行的程式碼。

#### 題目
```python
# Create variable x with value 5

# Create variable y with value "John"

# Print the type of x

```

#### 答案
```python
# Create variable x with value 5
x = 5
# Create variable y with value "John"
y = 'John'
# Print the type of x
print(type(x))
```

## 還不理解的問題

- 無

---
title: 704. Binary Search
tags:
  - leetcode
  - array
difficulty: Easy
status: reviewing
---

# 704. 二分查找 Binary Search

## 📌 題目資訊

🔗 [LeetCode 題目連結](https://leetcode.com/problems/binary-search/description/)

## 📘 先嘗試自己寫

```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        for(int i = 0; i < nums.size(); i++){
            if(nums[i] == target){
                return i;
            }
        }
        return -1;
    }
};
```

這沒有通過，因為是用暴力解 O(n)，但我忘記怎麼寫 Binary Search 了

---
## 📹 看影片後
---      
### 🧠 核心思路

二分搜尋的核心是：

> 每次比較中間元素，將搜尋範圍縮小一半。

使用二分搜尋前，必須先確定搜尋區間的定義。

常見的兩種寫法：

1. 左閉右閉：`[left, right]`
    
2. 左閉右開：`[left, right)`
    

兩種寫法都正確，但初始化、迴圈條件和邊界更新必須保持一致。

### ⚠️ 常見易錯點

- `while` 條件應該使用 `left < right` 還是 `left <= right`？
    
- 當 `nums[middle] > target` 時，`right` 應該更新為 `middle` 還是 `middle - 1`？
    
- `right` 應該初始化為 `nums.size()` 還是 `nums.size() - 1`？
    

這些問題都取決於區間的定義。

---

## ✅ 二分搜尋的兩種區間

|分類|區間表示|包含範圍|
|---|---|---|
|左閉右閉|`[left, right]`|包含 `left` 和 `right`|
|左閉右開|`[left, right)`|包含 `left`，不包含 `right`|

---

## 📐 左閉右閉區間

搜尋區間定義為：

```text
[left, right]
```

`left` 和 `right` 指向的位置都可能是答案。

### Pseudocode

```cpp
int left = 0;
int right = nums.size() - 1;

while (left <= right) {
    int middle = left + (right - left) / 2;

    if (nums[middle] > target) {
        right = middle - 1;
    } else if (nums[middle] < target) {
        left = middle + 1;
    } else {
        return middle;
    }
}

return -1;
```

### Explanation

#### 1. 為什麼是 `left <= right`？

   當：

```text
left == right
```

且是以下這種情況：

```text
[1, 1]
```

如果是 `left < right`，那就不合法了。

所以迴圈條件必須是：

```cpp
while (left <= right)
```

#### 2. 為什麼是 `right = middle - 1`？

當：

```cpp
nums[middle] > target
```

代表：

```text
middle 一定不是答案
```

因為我們測過了 `nums[middle]`不是目標值，而且右半部也不可能包含答案，因此新的搜尋區間是：

```text
[left, middle - 1]
```

所以要寫：

```cpp
right = middle - 1;
```

#### 3. 為什麼是 `left = middle + 1`？

跟上面是一樣的道理，當：

```cpp
nums[middle] < target
```

代表：

```text
middle 一定不是答案
```

新的搜尋區間是：

```text
[middle + 1, right]
```

所以要寫：
```cpp
left = middle + 1;
```
---

## 🚀 解法一：左閉右閉

```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1;

        while(left <= right){
            int middle = (left+right) / 2;

            if(nums[middle] > target){ // left
                right = middle - 1;
            }else if(nums[middle] < target){ // right
                left = middle + 1;
            }else{ // found
                return middle;
            }
        }
        return -1;
    }
};
```

---

## 📐 左閉右開區間

搜尋區間定義為：

```text
[left, right)
```

`left` 指向的位置可能是答案，但 `right` 指向的位置不包含在搜尋範圍內。

### 基本寫法

```cpp
int left = 0;
int right = nums.size();

while (left < right) {
    int middle = left + (right - left) / 2;

    if (nums[middle] > target) {
        right = middle;
    } else if (nums[middle] < target) {
        left = middle + 1;
    } else {
        return middle;
    }
}

return -1;
```

### 🎯 重點說明

#### 1. 為什麼是 `right = nums.size()`？

因為搜尋區間是：

```text
[left, right)
```

`right` 通常指向陣列最後一個元素的下一個位置，所以本身不包含在搜尋範圍內。

#### 2. 為什麼是 `left < right`？

當：

```text
left == right
```

且是以下這種情況：

```text
[1, 1)
```

因為 `right` 在這個例子中指向的不是 `1` ，而是 `1` 的下一個位置，所以如果是 `left=right` 就不合法。

#### 3. 為什麼是 `right = middle`？

當：

```cpp
nums[middle] > target // left
```

`middle` 已經確定不是答案，在左閉右開中，右邊是要設定成不再範圍內的元素，所以 `right = middle`。

#### 4. 為什麼是 `left = middle + 1`？

當：

```cpp
nums[middle] < target // right
```

這邊的邏輯跟左閉右閉是一樣的， `middle` 一定不是答案，因為左閉右開已經會檢查到 `middle` ，所以是 `left = middle + 1`。

---

## 🚀 解法二：左閉右開

```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size();

        while(left < right){
            int middle = (left+right) / 2;

            if(nums[middle] < target){ // right
                left = middle + 1;
            }else if(nums[middle] > target){ // left
                right = middle;
            }else{
                return middle;
            }
        }
        return -1;
    }
};
```

---

## 📊 兩種寫法比較

|特性|左閉右閉 `[left, right]`|左閉右開 `[left, right)`|
|---|---|---|
|`right` 初始化|`nums.size() - 1`|`nums.size()`|
|`while` 條件|`left <= right`|`left < right`|
|更新 `right`|`middle - 1`|`middle`|
|更新 `left`|`middle + 1`|`middle + 1`|
|`left == right` 時|還有一個元素|搜尋區間為空|

---
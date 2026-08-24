---
title: 202. Happy Number
tags:
  - leetcode
  - Hash_Table
difficulty: Easy
status: reviewing
---
🔗 [**題目連結**](https://leetcode.com/problems/happy-number/)

### 📘 先嘗試自己寫

- 不會寫，也沒影片，只有講解。

---

### 📹 看影片後(沒影片)

---

### 🧠 核心思路

我覺得這題沒有甚麼特殊的解法，唯一用到 `sets` 的地方也只是把 `sum` 存到 `unordered_set` 確認有沒有重複而已，有重複代表不是快樂數。
把每輪算出來的數字丟到 `set` 裡面，如果 `set` 裡面已經有該數字的話，返回 `false`，直到 `n = 1`。

> [!example]- **解法實作**
> ```cpp
> class Solution {
> public:
>     int getSum(int n){
>         int sum = 0;
>         while(n){
>             sum += (n%10) * (n%10); // n^2
>             n /= 10;
>         }
>         return sum;
>     }
>     bool isHappy(int n) {
>         unordered_set<int> set;
>         while(1){
>             int sum = getSum(n);
>             if(sum == 1){
>                 return true;
>             }
> 
>             if(set.find(sum) != set.end()){ // 有出現過重複的 sum，註 1
>                 return false;
>             }else{
>                 set.insert(sum);
>             }
>             n = sum; // 更新每一輪的數字
>         }
>     }
> };
> ```

> [!note]- **註解**
> **註解 1**：如果在 `set` 裡面有找到 `sum` 的話，`set.find()` 會等於 `set.end()`。
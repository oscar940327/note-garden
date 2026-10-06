---
title: 383. Ransom Note
tags:
  - leetcode
  - Hash_Table
difficulty: Easy
status: reviewing
---
🔗 [**題目連結**](https://leetcode.com/problems/ransom-note/)

### 📘 先嘗試自己寫

這題比較簡單，雜湊表基本概念而已。
1. 把 `ransomNote` 的每個字母轉成數字放到 `hash[26]` 裡面。
2. 用 `hash[26]` 裡面字母去減去 `magazine` 的每個字母。
3. 檢查 `hash[26]` 只要有負數就 `false`。

> [!example]- **我的寫法**
> ```cpp
> class Solution {
> public:
>     bool canConstruct(string ransomNote, string magazine) {
>         int hash[26] = {0};
>         for(int i = 0; i < magazine.size(); i++){
>             hash[magazine[i] - 'a']++;
>         }
> 
>         for(int i = 0; i < ransomNote.size(); i++){
>             hash[ransomNote[i] - 'a']--;
>         }
> 
>         for(int i = 0; i < 26; i++){
>             if(hash[i] < 0){
>                 return false;
>             }
>         }
>         return true;
>     }
> };
> ```

---

### 📹 看影片後

---

### 🧠 核心思路

1. 題目只包含小寫字母，因此可以用陣列實作雜湊表。
2. 使用長度為 26 的陣列，記錄 `magazine` 中每個字母出現的次數。
3. 再用 `ransomNote` 檢查陣列中的字母數量是否足夠。
> 在這個情境下，`map` 的空間消耗會比陣列大，因為它需要維護紅黑樹或雜湊表結構，也需要進行雜湊運算。資料量大時，兩者的差異會更明顯。

> [!example]- **解法實作**
> 寫法差不多，但我沒有在一開始就檢查大小，會有效能的差異。
> ```cpp
> class Solution {
> public:
>     bool canConstruct(string ransomNote, string magazine) {
>         int hash[26] = {0};
>         if(ransomNote.length() > magazine.length()){
>             return false;
>         }
>         for(int i = 0 ; i < magazine.length() ; i++){
>             hash[magazine[i] - 'a']++;
>         }
>         for(int i = 0 ; i < ransomNote.length() ; i++){
>             hash[ransomNote[i] - 'a']--;
>         }
>         for(int i = 0 ; i < 26 ; i++){
>             if(hash[i] < 0){
>                 return false;
>             }
>         }
>         return true;
>     }
> };
> ```

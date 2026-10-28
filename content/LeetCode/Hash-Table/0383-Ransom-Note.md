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

1. 使用長度為 26 的 `hash` 陣列，累計 `magazine` 中每個字母的數量。
2. 遍歷 `ransomNote`，將對應字母的數量減 1。
3. 若 `hash` 中有負數，代表所需字母數量不足，回傳 `false`；否則回傳 `true`。

> [!example]- **我的寫法**
>
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
   > 此題的字元範圍固定，長度為 26 的陣列即可完成計數。`std::map` 通常使用平衡搜尋樹；`std::unordered_map` 使用雜湊表，才需要雜湊運算。兩者通常都有額外的資料結構開銷，這裡使用陣列較直接。

> [!example]- **解法實作**
> 寫法差不多，但我沒有在一開始就檢查大小，會有效能的差異。
>
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

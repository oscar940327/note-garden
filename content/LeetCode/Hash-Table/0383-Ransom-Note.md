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

1. 因為題目說只有小寫字母，所以就可以用數組在哈希表中的應用
2. 用一個長度為 26 的數組來記錄 `magazine` 里字母出現的次數
3. 然後再用 `ransomNote` 去驗證這個數組是否包含了 `ransomNote` 所需要的所有字母
> 在這個情境下，使用 `map` 的空間消耗會比數組來得大，因為 `map` 需要維護紅黑樹或哈希表的結構，同時也需要進行哈希函數的運算，這會比較耗時。當資料量龐大時，兩者之間的差異就會很明顯。

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
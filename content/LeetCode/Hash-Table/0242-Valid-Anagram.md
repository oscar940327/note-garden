---
title: 242. Valid Anagram
tags:
  - leetcode
  - Hash_Table
difficulty: Easy
status: reviewing
---
🔗 [**題目連結**](https://leetcode.com/problems/valid-anagram/)

### 📘 先嘗試自己寫

- 我還不太會雜湊表，只知道最基本的概念，所以先看講解。
- 暴力解也不是寫不出來，只是這樣就學不到雜湊表的用法。

---

### 📹 看影片後

---

### 🧠 核心思路

- 字元 `a` 到 `z` 的 ASCII 碼是連續的 26 個數值，因此 `a` 對應的索引是 0，`z` 對應的索引是 25，`hash` 陣列只需要 26 個位置。
- 遍歷字串 `s` 時，將 `s[i] - 'a'` 對應位置的值加 1 即可。無須記住字元 `a` 的 ASCII 碼，只要算出相對位置，就能統計 `s` 中各字元出現的次數。
- 同理，遍歷字串 `t` 時，將 `t[i] - 'a'` 對應位置的值減 1。
- 最後檢查 `hash` 陣列；若有元素不為 0，表示 `s` 和 `t` 中某個字元的出現次數不同，回傳 `false`。
- 若 `hash` 陣列的所有元素皆為 0，表示 `s` 和 `t` 是字母異位詞，回傳 `true`。
![[0242.gif]]

```cpp
int hash[26];
for(i = 0 ; i < s.size ; i++){
    hash[s[i] - 'a']++;
}
for(i = 0 ; i < t.size ; i++){
    hash[t[i] - 'a']--;
}
for(i = 0 ; i < 26 ; i++){
    if(hash[i] != 0){
        return false;
    }
}
return true;
```

> [!example]- **解法實作**
> ```cpp
> class Solution {
> public:
>     bool isAnagram(string s, string t) {
>         int hash[26];
>         for(int i = 0 ; i < 26 ; i++){
>             hash[i] = 0;
>         }
>         for(int i = 0 ; i < s.size() ; i++){
>             hash[s[i] - 'a']++;
>         }
>         for(int i = 0 ; i < t.size() ; i++){
>             hash[t[i] - 'a']--;
>         }
>         for(int i = 0 ; i < 26 ; i++){
>             if(hash[i] != 0){
>                 return false;
>             }
>         }
>         return true;
>     }
> };
> ```

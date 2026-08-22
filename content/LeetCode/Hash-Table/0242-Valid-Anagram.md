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

- 根本就不太會哈希表，只有知道最初步的知識而已，先看講解。
- 要暴力解也不是解不出來，只是這樣這題就沒學到哈希表了。

---

### 📹 看影片後

---

### 🧠 核心思路

- 因為字符 `a` 到字符 `z` 的 ASCII 是 26 個連續的數值，所以字符 `a` 對應的下標是 0 ，字符 `z` 對應的下標是 25，同時也說明 `hash` 數組大小只需要 26。
- 在遍歷字符串 `s` 的時候，只需要將 `s[i] - 'a'` 所在的元素做 `+1` 操作即可，並不需要記住字符 `a` 的 ASCII ，指要求出一個相對數值就可以了。這樣九將字符串 `s` 中字符出現的次數，統計出來了。
- 同上述的道理，只需要在遍歷字符串 `t` 的時候，將 `t[i] - 'a'` 所在的元素做 `-1 `操作即可。
- 最後檢查 `hash` 數組如果有的元素不為 0 ，說明字符串 `s` 或 `t` 一定是誰多了哪個字符或誰少了哪個字符， `return false`。
- 如果 `hash` 數組所有元素都為 0 ，說明字符串 `s` 和 `t` 是字母異位詞， `return true`。
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
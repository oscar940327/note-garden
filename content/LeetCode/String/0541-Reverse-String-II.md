---
title: 541. Reserve String II
tags:
  - leetcode
  - linked_list
difficulty: Easy
status: reviewing
---
🔗 [**題目連結**](https://leetcode.com/problems/reverse-string-ii/)

### 📘 先嘗試自己寫

寫不出來，用最直觀的解法想不出來

---

### 📹 看影片後

---

### 🧠 核心思路
 
- 這解法我是真的想不出來
1. 只要 `i += (2 * k)`，`i` 每次移動 `2 * k` 
2. 然後判斷是否需要有反轉的區間

```cpp
for(i = 0 ; i < s.size ; i+=2*k){
    if(i+k <= s.size){
        reverse(s, i, i+k);
        continue;
    }
    reverse(s, i, s.size);
}
```


:::spoiler **解法實作**

```cpp
class Solution {
public:
    string reverseStr(string s, int k) {
        for(int i = 0 ; i < s.size() ; i += 2*k){
            if(i+k <= s.size()){
                reverse(s.begin() + i, s.begin() + (i+k));
                continue;
            }
            reverse(s.begin() + i, s.end());
        }
        return s;
    }
};
```
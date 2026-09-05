---
title: 151. Reverse Words in a String
tags:
  - leetcode
  - linked_list
difficulty: Medium
status: reviewing
---
🔗 [**題目連結**](http://leetcode.com/problems/reverse-words-in-a-string/)

### 📘 先嘗試自己寫

寫不出來。

---

### 📹 看影片後

---

### 🧠 核心思路

這題主要分成三個步驟，主要是操作複雜
1. 移除多於空格："the sky is blue" 
2. 字符串反轉："eulb si yks eht"
3. 單詞反轉："blue is sky the"

```cpp
只有移除空格的pseudocode，雖然也只有這個沒學過
slow = 0;
for(fast = 0 ; fast < s.size() ; fast++){
    if(s[fast] != ' '){
        if(slow != 0){ s[slow++] = ' ';}
        while(fast < s.size() && s[fast] != ' '){
            s[slow++] = s[fast++];
        }
    }
}
resize(slow);
```

:::spoiler **解法實作**

```cpp
class Solution {
public:
    void reverse(string& s, int start, int end){
        for(int i = start, j = end ; i < j ; i++, j--){
            swap(s[i], s[j]);
        }
    }
    
    void RemoveExtraSpace(string& s){
        int slow = 0;
        for(int i = 0 ; i < s.size() ; i++){
            if(s[i] != ' '){ // 遇到不是空格
                if(slow != 0){s[slow++] = ' ';} // 遇到不是第一個單詞的第一個字母
                while(i < s.size() && s[i] != ' '){ // 處理一個單詞
                    s[slow++] = s[i++];
                }
            }
        }
        s.resize(slow);
    }

    string reverseWords(string s) {
        RemoveExtraSpace(s);
        reverse(s, 0, s.size()-1);
        int start = 0;
        for(int i = 0 ; i <= s.size() ; i++){ // 因為檢測的條件是空格或是結尾，所以這邊要用 <= 
            if(i == s.size() || s[i] == ' '){
                reverse(s, start, i-1);
                start = i + 1;
            }
        }
        return s;
    }
};
```
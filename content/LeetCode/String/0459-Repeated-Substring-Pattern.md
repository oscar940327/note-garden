---
title: 459. Repeated Substring Pattern
tags:
  - leetcode
  - string
difficulty: Easy
status: reviewing
---
🔗 [**題目連結**](https://leetcode.com/problems/repeated-substring-pattern/)

### 📘 先嘗試自己寫

不會寫

---

### 📹 看影片後

---

### 🧠 核心思路

1. **移動匹配，時間複雜度O($N^2$)** ，我覺得這個根本想不到
	1. 先把字串 `s` 變成兩倍 `ss`
    2. 去頭去尾，如果不這麼做，下一步可能就會在一開始找到原本的字串 `s`
    3. 看能不能在 `ss` 中把 `s` 找出來
       ![[0459.png]]

2. **KMP 解法，時間複雜度O(N)**
這個真的太複雜了，沒辦法簡單在這邊描述完，看講解以及影片或[其他講解](https://writings.sh/post/algorithm-repeated-string-pattern#kmp-%E6%96%B9%E6%B3%95)，不懂問 AI。
- **主要是判斷字串長度能不能整除最長相等前後綴不包含的子串長度。**
- **一個重要的數學性質是：如果一個字串的長度 L 可以被它的最小週期長度 P 整除，那麼這個字串就必然是由它的最小週期重複構成的。**
**Q：** 為甚麼最長相等前後綴不包含的子串長度一定是字串的最小週期長度呢 ?
**A：** 如果 `s` 是由一个子串重複多次組成的，且因為最長相等前後綴的定義，所以該字串必定會留下一個最長相等前後綴不包含的子串，該子串也必定是 `s` 的最小週期長度

> [!example]- **解法實作 1**
> ```cpp
> class Solution {
> public:
>     bool repeatedSubstringPattern(string s) {
>         string ss = s + s;
>         ss.erase(0, 1);
>         ss.erase(ss.size()-1, 1);
>         if(ss.find(s) != string::npos){
>             return true;
>         }else{
>             return false;
>         }
>     }
> };
> ```

> [!example]- **解法實作 2**
> ```cpp
> class Solution {
> public:
>     void getNext(int* next, string& s){
>         int j = 0;
>         next[0] = 0;
>         for(int i = 1 ; i < s.size() ; i++){
>             while(j > 0 && s[i] != s[j]){
>                 j = next[j-1];
>             }
>             if(s[i] == s[j]){
>                 j++;
>             }
>             next[i] = j;
>         }   
>     }
> 
>     bool repeatedSubstringPattern(string s) {
>         int next[s.size()];
>         getNext(&next[0], s);
>         int len = s.size();
>         if(next[len-1] != 0 && len % (len - next[len-1]) == 0){
>             return true;
>         }
>         return false;
>     }
> };
> ```
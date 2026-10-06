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

1. **移動比對，時間複雜度 O($N^2$)**，我覺得這個根本想不到
	1. 先把字串 `s` 變成兩倍 `ss`
    2. 去頭去尾，如果不這麼做，下一步可能就會在一開始找到原本的字串 `s`
    3. 看能不能在 `ss` 中把 `s` 找出來
       ![[0459.png]]

2. **KMP 解法，時間複雜度O(N)**
這個真的太複雜了，沒辦法簡單在這邊描述完，看講解以及影片或[其他講解](https://writings.sh/post/algorithm-repeated-string-pattern#kmp-%E6%96%B9%E6%B3%95)，不懂問 AI。
- **主要是判斷字串長度能不能被「最長相等前後綴之外的子字串長度」整除。**
- **一個重要的數學性質是：如果一個字串的長度 L 可以被它的最小週期長度 P 整除，那麼這個字串就必然是由它的最小週期重複構成的。**
- **判斷方式：** 設字串長度為 `L`，最長相等前後綴的長度為 `b`，候選週期長度為 `p = L - b`。若 `b > 0` 且 `L` 能被 `p` 整除，字串就能由長度為 `p` 的子字串重複組成。
**Q：** 為什麼 `L - b` 會是候選週期長度？
**A：** 最長相等前後綴代表字串開頭與結尾有長度為 `b` 的重疊部分，因此 `L - b` 是可行的最短候選週期；再確認 `L` 能被它整除，才能判定整個字串是由該週期完整重複構成。

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

---
title: 1002. Find Common Characters
tags:
  - leetcode
  - Hash_Table
difficulty: Easy
status: reviewing
---
🔗 [**題目連結**](https://leetcode.com/problems/find-common-characters/)

### 📘 先嘗試自己寫

- 這題我是自己跟 Chatgpt (GPT-5.6 Sol, 高) 寫出來的，我看到題目本身就有想法，做出來也應該算是最佳解。
- 依次處理每個字串，把每個字串所有出現過字母的次數都記錄下來，放在 `temp` 裡面然後再跟 `hash` 比對，比哪個最少出現。
> [!example]- 舉例
> ```
> words = ["bella", "label", "roller"]
> ```
> 先看 `"bella"`：
> ```
> b:1
> e:1
> l:2
> a:1
> ```
> 把這個當成目前的共同次數。
> 
> 接著看 `"label"`，另外算一個 `temp`：
> ```
> l:2
> a:1
> b:1
> e:1
> ```
> 然後每個字母都做：
> ```
> hash[i] = min(hash[i], temp[i]);
> ```
> 
> 例如 `l`：
> ```
> hash['l'] = 2
> temp['l'] = 2
> 
> min(2, 2) = 2
> ```
> 
> 再處理 `"roller"`：
> ```
> roller 的 l = 2
> ```
> 
> 所以：
> ```
> min(2, 2) = 2
> ```
> 最後 `l` 的共同次數就是 2。
- `temp` 的設計要在 `for` 迴圈裡面再用兩個 `for` 迴圈來做。
```cpp
for(int i = 0; i < words.size(); i++){
		int temp[26] = {0};
		for(int j = 0; j < words[i].size(); j++){
			temp[words[i][j] - 'a']++;
		}

		for(int j = 0; j < 26; j++){
			hash[j] = min(hash[j], temp[j]);
		}
	}
```
- 最後再把在 `hash` 裡面的字母都印出來就好。
---

### 📹 看影片後

沒有影片，但也不用看

---

### 🧠 核心思路

思路寫在上面

> [!example]- **解法實作**
> ```cpp
> class Solution {
> public:
>     vector<string> commonChars(vector<string>& words) {
>         vector<string> result;
> 
>         int hash[26];
>         fill(hash, hash+26, INT32_MAX);
>         for(int i = 0; i < words.size(); i++){
>             int temp[26] = {0};
>             for(int j = 0; j < words[i].size(); j++){
>                 temp[words[i][j] - 'a']++;
>             }
> 
>             for(int j = 0; j < 26; j++){
>                 hash[j] = min(hash[j], temp[j]);
>             }
>         }
> 
>         for(int i = 0; i < 26; i++){
>             while(hash[i] > 0){
>                 result.push_back(string(1, i + 'a'));
>                 hash[i]--;
>             }
>         }
> 
>         return result;   
>     }
> };
> ```

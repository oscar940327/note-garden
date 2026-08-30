---
title: 344. Reverse String
tags:
  - leetcode
  - linked_list
difficulty: Easy
status: reviewing
---
🔗 [**題目連結**](https://leetcode.com/problems/reverse-string/)

### 📘 先嘗試自己寫

喵到講解中的圖就寫出來了
> [!example]- 自己寫的
> ```cpp
> class Solution {
> public:
> 	void reverseString(vector<char>& s) {
> 		int right = s.size() - 1;
> 		for(int left = 0 ; left < s.size() / 2 ; left++){
> 			char temp = s[left];
> 			s[left] = s[right];
> 			s[right] = temp;
> 			right--;
> 		}
> 	}
> };
> ```

---

### 📹 看影片後

---

### 🧠 核心思路

- 沒看影片，我覺得這題不需要看
![[0344.gif]]

[!example]- **解法實作**
他的更簡化，我的只是把 `swap` 的內容寫出來 (其實我是不知道有 `swap` 這個函示可以用)
```cpp
class Solution {
public:
    void reverseString(vector<char>& s) {
        for (int i = 0, j = s.size() - 1; i < s.size()/2; i++, j--) {
            swap(s[i],s[j]);
        }
    }
};
```

[!example]- **解法實作 (2026/08/31)**
他的更簡化，我的只是把 `swap` 的內容寫出來 (其實我是不知道有 `swap` 這個函示可以用)
```cpp
class Solution {
public:
    void reverseString(vector<char>& s) {
        for(int i = 0, j = s.size()-1; i < s.size()/2; i++, j--){
            int temp = s[i];
            s[i] = s[j];
            s[j] = temp;
        }
    }
};
```
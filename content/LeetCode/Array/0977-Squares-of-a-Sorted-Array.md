---
title: 977. Squares of a Sorted Array
tags:
  - leetcode
  - array
difficulty: Easy
status: reviewing
---

🔗 [**題目連結**](https://leetcode.com/problems/squares-of-a-sorted-array/)

### 📘 先嘗試自己寫

- 我只想到暴力解，但那就不是寫這題的意義。

---

### 📹 看影片後

---

### 🧠 雙指針思路

因為原題目是遞增順序排列，就代表最大數一定在最左或最右，只要左右檢查看哪邊比較大放到新的陣列裡面就可以了。

![[0977.gif]]


```cpp

vector<int> result(nums.size());
k = nums.size()-1;
for(i = 0 , j = nums.size()-1 ; i <= j){ // 註解 1、註解 2
    if(nums[i]*nums[i] > num[j]*nums[j]){
        result[k] = nums[i]*nums[i];
        i++;
        k--;
    }else{
        result[k] = nums[j]*nums[j];
        j--;
        k--;
    }
}
```
> [!note]- 註解
> - **註解 1**：這邊條件設為 `i <= j`，是因為當 `i == j` 時，代表還剩下一個元素尚未處理。若使用 `i < j`，可能會略過這個元素。
> - **註解 2**：`for` 迴圈最後不能直接寫 `i++`、`j--`，因為兩個指標是否移動取決於比較結果，不能在每次迴圈結束時都一起移動。

### 💡 解法實作

```cpp
class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        int last = nums.size()-1;
        int first = 0;

        vector<int> result(nums.size());
        int k = nums.size()-1;

        while(first <= last){
            if((nums[first]*nums[first]) > (nums[last]*nums[last])){
                result[k] = nums[first]*nums[first];
                first++;
                k--;
            }else{
                result[k] = nums[last]*nums[last];
                last--;
                k--;     
            }
        }
        return result;
    }
};
```


🔗 [**題目連結**](https://leetcode.com/problems/minimum-size-subarray-sum/)

### 📘 先嘗試自己寫

我寫不出來

---

### 📹 看影片後

---

### 🧠 雙指針思路

所謂滑動窗口，就是不斷的調節子序列的起始位置和終止位置，從而得出我們想要的結果。

這題就是以 `i` 為起點，`j` 為終點，先讓 `j` 往後走直到大於等於 `target` ，隨後移動 `i` 直到小於 `target` ，結果存到 `result` 用 `min()` 比較。

![209.长度最小的子数组 (2)](0209.gif)


```cpp
i = 0;
result = Max;
for(j = 0 ; j < nums.size ; j++){
    sum += nums[j];
    while(sum >= target){    // 註解 1
        subL = j-i+1;
        result = min(result, subL);
        sum = sum - nums[i];
        i++;
    }
}
return result;
```
:::spoiler 註解
- 註解 1：這邊用 `while` 不用 `if` 是因為不可能只遍歷一遍，`while` 迴圈是用來縮減最後的 `result` ，不可能每次都只縮減一遍。
:::

### 💡 解法實作

```cpp
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int i = 0; // start;
        int sum = 0;
        int result = INT32_MAX;
        int subLength = 0;

        int j; // end
        for(j = 0; j < nums.size(); j++){
            sum += nums[j];

            while(target <= sum){
                subLength = j-i+1;
                result = min(subLength, result);
                sum -= nums[i];
                i++;
            }
        }
        return result == INT32_MAX ? 0 : result;
    }
};
```

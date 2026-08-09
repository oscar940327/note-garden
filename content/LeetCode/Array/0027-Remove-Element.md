
🔗 [**題目連結**](https://leetcode.com/problems/remove-element/description/)

### 📘 先嘗試自己寫

```cpp
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int count = 0;

        for(int i = 0; i < nums.size(); i++){
            if(nums[i] != val){
                nums[count] = nums[i];
                count++;
            }
        }
        return count;
    }
};
```

---

### 📹 看影片後

---
- .erase()的時間複雜度是O(n)
- 題目本意是讓我們實現erase函數刪除元素的過程

### 🧠 雙指針思路

![[0027.gif]]

```cpp
slow=0;
for(fast = 0 ; fast < nums.size ; fast++){
    if(nums[fast] != val){ // 當快指針不等於目標值時
        nums[slow] = nums[fast]; // 將快指針的值給慢指針
        slow++; // 因為慢指針是新的數組，所以會慢慢加
    }
}
```

### 💡 解法實作

```cpp
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int slow = 0;
        for(int fast = 0 ; fast < nums.size() ; fast++){
            if(nums[fast] != val){
                nums[slow] = nums[fast];
                slow++;
            }
        }
        return slow;
    }
};
```
---
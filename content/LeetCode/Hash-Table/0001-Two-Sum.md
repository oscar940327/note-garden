---
title: 1. Two Sum
tags:
  - leetcode
  - Hash_Table
difficulty: Easy
status: reviewing
---
🔗 [**題目連結**](https://leetcode.com/problems/two-sum/)

### 📘 先嘗試自己寫

- 這題最直觀的會是暴力解，我寫得出來但那沒意義。
- 我喵了一下講解，是用 `maps` 我不會所以先看影片。

---

### 📹 看影片後

---

### 🧠 核心思路

1. 建立一個 `unordered_map` ，`key` 放值，`value`放 `index`。
2. 遍歷 `nums` 算出每一個數跟 `target` 的差，然後看原本 `map` 裡面有沒有，有就 `return` ，沒有就放進 `map` 裡面。
```cpp
unordered_map<int, int> map;
for(i = 0 ; i < nums.size() ; i++){
    s = target - nums[i];
    iter = map.find(s); // 我沒用這個
    if(iter != map.end){
        return {iter->value, i};
    }
    map.insert(nums[i], i);
}
```

> [!note]- **unordered_map 基本用法**
> 
> `unordered_map` 會用 **key-value** 的方式儲存資料。
> ```cpp
> unordered_map<int, int> map;
> ```
> 代表：
> - `key` 是 `int`
> - `value` 也是` int`
> 
> 例如：
> ```cpp
> map[5] = 10;
> ```
> 可以理解成：
> ```cpp
> key = 5
> value = 10
> ```
> 常用操作：
> ```cpp
> map[x]           // 取得 key = x 對應的 value
> map[x]++         // value + 1，常用來計數
> ```
> 如果 `x` 不存在，`mp[x]` 會自動建立，`int` 預設為 `0`。
> 
> ```cpp
> map.find(x) != map.end()
> ```
> 代表 key x 存在。
> 
> 如果使用 find() 找到某一筆：
> ```cpp
> map.find(x)->first  // 取得 key
> map.find(x)->second // 取得 value
> ```
> 
> 例如：
> 
> ```cpp
> 2 -> 0
> 7 -> 1
> ```
> 那麼：
> ```cpp
> map.find(7)->first   // 7
> map.find(7)->second  // 1
> ```
> 可以記成：
> ```cpp
> first = key
> second = value
> ```
> 
> #### `unordered_map` 很適合用來做「數字 → index」、「數字 → 出現次數」這類對應關係。

> [!example]- **解法實作**
> ```cpp
> class Solution {
> public:
>     vector<int> twoSum(vector<int>& nums, int target) {
>         unordered_map<int, int> map;
>         for(int i = 0; i < nums.size(); i++){
>             int n = target-nums[i];
> 
>             if(map.find(n) != map.end()){
>                 return {map.find(n)->second, i};
>             }
>             map.insert(pair<int, int>(nums[i], i));
>         }
>         return {};
>     }
> };
> ```
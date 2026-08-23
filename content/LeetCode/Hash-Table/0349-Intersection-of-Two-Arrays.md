---
title: 349. Intersection of Two Arrays
tags:
  - leetcode
  - Hash_Table
difficulty: Easy
status: reviewing
---
🔗 [**題目連結**](https://leetcode.com/problems/intersection-of-two-arrays/)

### 📘 先嘗試自己寫

- 這次要用到 `sets` ，可是我也不會操作 `sets` ，只能先聽講解。

---

### 📹 看影片後

---

### 🧠 核心思路

![[0349.png]]

- 把 `nums1` 裡的值都先放到 `unordered_set` 裡面。
- `nums2` 一一去比對裡面的值，再放到另一個 `unordered_set` 裡面。

1. `sets` 解法
    ```cpp
    unordered_set result;
    unordered num_set(nums1);
    for(i = 0 ; i < nums2 ; i++){
        if(num_set(nums2[i]) != num_set.end()){
            result.insert(nums2[i]);
        }
    }
    return vector(result);
    ```

2. 數組解法
    ```cpp
    int hash[1001] = {0};
    unordered_set result;
    for(i = 0 ; i < nums1.size ; i++){
        hash[nums1[i]] = 1;
    }
    for(i = 0 ; i < nums2.size ; i++){
        if(hash[nums[i]] == 1){
            result.insert(nums2[i]);
        }
    }
    return vector(result);
    ```


> [!example]- **解法實作**
> 1. `sets` 解法
> ```cpp
> class Solution {
> public:
>     vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
>         unordered_set<int> result;
>         unordered_set<int> num_set(nums1.begin(), nums1.end());
>         for(int i : nums2){
>             if(num_set.find(i) != num_set.end()){
>                 result.insert(i);
>             }
>         }
>         return vector<int>(result.begin(), result.end());
>     }
> };
> ```
> 
> 2. 數組解法
> ```cpp
> class Solution {
> public:
>     vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
>         int hash[1001] = {0};
>         unordered_set<int> result;
> 
>         for(int i = 0; i < nums1.size(); i++){
>             hash[nums1[i]] = 1;
>         }
> 
>         for(int i = 0; i < nums2.size(); i++){
>             if(hash[nums2[i]] == 1){
>                 result.insert(nums2[i]);
>             }
>         }
> 
>         return vector<int>(result.begin(), result.end());
>     }
> };
> ```
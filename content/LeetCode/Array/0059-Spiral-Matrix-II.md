---
title: 59. Spiral Matrix II
tags:
  - leetcode
  - array
difficulty: Medium
status: reviewing
---

🔗 [**題目連結**](https://leetcode.com/problems/spiral-matrix-ii/)

### 📘 先嘗試自己寫

我寫不出來

---

### 📹 看影片後

---

### 🧠 核心思路

* 填充上列從左到右
* 填充右行從上到下
* 填充下列從右到左
* 填充左行從下到上

從內到外一圈一圈畫下去
用左閉右開原則，每一行都不會遍歷到最後一個元素
![[0059.png|500]]


```cpp
startX = 0, startY = 0;
offset = 1;
count = 1;
while(n/2){
    for(j = startY ; j < n-offset ; j++){
        nums[startX][j] = count++;
    }
    for(i = startX ; i < n-offset ; i++){
        nums[i][j] = count++;
    }
    for( ; j > startY ; j--){
        nums[i][j] = count++;
    }
    for( ; i > startX ; i--){
        nums[i][j] = count++;
    }
    offset++;
    startX++;
    startY++;
}
if(n % 2 != 0){
    nums[mid][mid] = count;
}
```

> [!note]- 註解
> **註解 1**：這邊用 `while` 不用 `if` 是因為不可能只遍歷一遍，`while` 迴圈是用來縮減最後的 `result` ，不可能每次都只縮減一遍。

### 💡 解法實作

```cpp
class Solution {
public:
    vector<vector<int>> generateMatrix(int n) {
        vector<vector<int>> vec(n, vector<int>(n, 0));
        int i, j;
        int startX=0, startY=0;
        int side = n/2;
        int offset = 1;
        int count = 1;

        while(side--){
            // 上邊向右
            for(j = startY; j < n-offset; j++){
                vec[startX][j] = count++;
            }

            // 右邊向下
            for(i = startX; i < n-offset; i++){
                vec[i][j] = count++;
            }

            // 下邊向左
            for(; j > startY; j--){
                vec[i][j] = count++;
            }

            // 左邊向上
            for(; i > startX; i--){
                vec[i][j] = count++;
            }

            offset++;
            startX++;
            startY++;
        }
        
        int mid = n/2;

        if(n % 2 != 0){
            vec[mid][mid] = count;
        }
        
        return vec;
    }
};
```

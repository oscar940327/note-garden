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

- 填充上列從左到右
- 填充右行從上到下
- 填充下列從右到左
- 填充左行從下到上

從外到內一圈一圈填入數字。
每條邊採用左閉右開的原則：保留該邊的最後一個角落，交給下一條邊處理，避免重複填入。
![[0059.png|500]]

```cpp
startX = 0, startY = 0;
offset = 1;
count = 1;
int loops = n / 2;
while(loops--){
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
int mid = n / 2;
if(n % 2 != 0){
    nums[mid][mid] = count;
}
```

> [!note]- 註解
> **註解 1**：每輪 `while` 填完一圈，並遞減剩餘圈數；`startX`、`startY` 與 `offset` 讓下一圈往內縮。若 `n` 是奇數，最後另外填入中心元素。

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

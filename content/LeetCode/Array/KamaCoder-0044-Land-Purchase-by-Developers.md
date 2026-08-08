
🔗 [**題目連結**](https://kamacoder.com/problempage.php?pid=1044)

### 📘 先嘗試自己寫
我寫不出來

---

### 📹 看影片後(此題沒有影片)
[講解](https://programmercarl.com/kamacoder/0044.%E5%BC%80%E5%8F%91%E5%95%86%E8%B4%AD%E4%B9%B0%E5%9C%9F%E5%9C%B0.html#%E6%80%9D%E8%B7%AF)

---

### 🧠 核心思路

先把橫向、縱向每一行的總和分別先算出來，再每一種可能去比對

### 💡 解法實作

```cpp
#include<iostream>
#include<vector>
#include<climits>

using namespace std;

int main(){
    int n, m, sum = 0;
    cin >> n >> m;
    vector<vector<int>> vec(n, vector<int>(m, 0));

    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            cin >> vec[i][j];
            sum += vec[i][j];
        }
    }

    // 水平
    vector<int> horizontal(n);
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            horizontal[i] += vec[i][j];
        }
    }

    // 垂直
    vector<int> vertical(m);
    for(int j = 0; j < m; j++){
        for(int i = 0; i < n; i++){
            vertical[j] += vec[i][j];
        }
    }

    int result = INT32_MAX;
    int hor_cut = 0;
    for(int i = 0; i < n; i++){
        hor_cut += horizontal[i];
        result = min(abs((sum-hor_cut) - hor_cut), result);
    }

    int ver_cut = 0;
    for(int j = 0; j < m; j++){
        ver_cut += vertical[j];
        result = min(abs((sum-ver_cut) - ver_cut), result);
    }

    cout << result << "\n";

    return 0;
}
```

> [!example]- 簡化
> ```cpp
> #include <iostream>
> #include <vector>
> #include <climits>
>
> using namespace std;
>
> int main(){
>     int n, m;
>     cin >> n >> m;
>     int sum = 0;
>     vector<vector<int>> vec(n, vector<int>(m, 0));
>
>     int i, j;
>     for(i = 0 ; i < n ; i++){
>         for(j = 0 ; j < m ; j++){
>             cin >> vec[i][j];
>             sum += vec[i][j];
>         }
>     }
>
>     int result = INT_MAX;
>     // 水平
>     int count = 0;
>     for(i = 0 ; i < n ; i++){
>         for(j = 0 ; j < m ; j++){
>             count += vec[i][j];
>
>             // 遍歷到尾端的時候統計
>             if(j == m-1){
>                 result = min(result, abs((sum-count) - count));
>             }
>         }
>     }
>
>     count = 0;
>     // 垂直
>     for(j = 0 ; j < m ; j++){
>         for(i = 0 ; i < n ; i++){
>             count += vec[i][j];
>
>             // 遍歷到尾端的時候統計
>             if(i == n-1){
>                 result = min(result, abs((sum-count) - count));
>             }
>         }
>     }
>
>     cout << result << endl;
>
>     return 0;
> }
> ```
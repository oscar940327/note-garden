
🔗 [**題目連結**](https://kamacoder.com/problempage.php?pid=1070)

### 📘 先嘗試自己寫

```cpp
#include<iostream>

using namespace std;

int main(){
    int n = 0;
    cin >> n;

    int i = 0;
    int nums[n];

    while(n > i){
        cin >> nums[i];
        i++;
    }
 
    int start, end;
    int sum;
    while (~scanf("%d %d", &start, &end)){
        for(int i = start; i <= end; i++){
            sum += nums[i];
            // cout << sum << "\n";
        }
        cout << sum << "\n";
        sum = 0;
    }
    return 0;
}
```

- 超時，也不知道對不對

---

### 📹 看影片後 (此題沒有影片)

[講解](https://programmercarl.com/kamacoder/0058.%E5%8C%BA%E9%97%B4%E5%92%8C.html#%E6%80%9D%E8%B7%AF)

---

### 🧠 核心思路

如果要取區間和只要先把陣列內容都先加上去，要取的時候就會方便很多。
例：要取 1 ~ 3 之間，只要把下標為 3 的元素減去下標為 1 的元素即是所求。

![[KamaCoder-0058-1.png|500]]
![[KamaCoder-0058-2.png|500]]


### 💡 解法實作

用 `scanf`、`printf` 會比 `cin`、`cout` 快很多
```cpp
#include<iostream>
#include<vector>

using namespace std;

int main(){
    int n = 0;
    cin >> n;

    int i = 0;
    int temp = 0;
    vector<int> vec(n);
    vector<int> p(n);

    while(n > i){
        cin >> vec[i];
        temp += vec[i];
        p[i] = temp;
        i++;
    }

    int start, end;
    int result;
    while (~scanf("%d %d", &start, &end)){
        if(start == 0){
            result = p[end];
        }else{
            result = p[end] - p[start-1];
        }
        cout << result << "\n";
    }

    return 0;
}
```

---
title: KamaCoder 55. Right Rotate String
tags:
  - kamacoder
  - string
status: reviewing
---
🔗 [**題目連結**](https://kamacoder.com/problempage.php?pid=1065)

### 📘 先嘗試自己寫

在沒看講解的情況寫出來，我的方法是：
1. 先擴充數組
2. 再全部右移
3. 再把目標數組移到前面
4. 再縮減數組為原來大小

```cpp
#include <iostream>
#include <string>

using namespace std;

int main() {
  int k;
  string s;
  cin >> k;
  cin >> s;
  int end = s.size() - 1;
  int n = s.size();
  s.resize(s.size() + k);
  while (n--) {
    swap(s[end], s[end + k]);
    end--;
  }
  int end1 = s.size() - k;
  for(int i = 0 ; i < k ; i++){
    swap(s[i], s[end1]);
    end1++;
  }
  s.resize(s.size()-k);
  cout << s;
}
```

> [!example]- **2026/09/08 自己寫**
> ```cpp
> #include<iostream>
> #include<string>
> 
> using namespace std;
> 
> int main(){
>     int n;
>     string s;
>     cin >> n >> s;
> 
>     int i;
>     for(i = 0; i < s.size()-n; i++){
>         // cout << s[i] << endl;
>     }
> 
>     for(int j = i; j < s.size(); j++){
>         cout << s[j];
>     }
> 
>     for(i = 0; i < s.size()-n; i++){
>         cout << s[i];
>     }
>     return 0;
> }
> ```

---

### 📹 看影片後(這題沒有影片，只有[講解](https://programmercarl.com/kamacoder/0055.%E5%8F%B3%E6%97%8B%E5%AD%97%E7%AC%A6%E4%B8%B2.html#%E6%80%9D%E8%B7%AF))

---

### 🧠 核心思路

這題講解有兩個解法
1.先分成兩段，先整體翻轉，再翻轉第一段以及第二段
2.先翻轉第一段以及第二段，再整體翻轉

`本題沒有影片，所以沒有pseudocode`

> [!example]- **解法實作 1**
> ```cpp
> #include <iostream>
> #include<algorithm>
> 
> using namespace std;
> 
> int main() {
>   int k;
>   string s;
>   cin >> k;
>   cin >> s;
>   reverse(s.begin(), s.end());
>   reverse(s.begin(), s.begin()+k);
>   reverse(s.begin()+k, s.end());
>   cout << s << endl;
> }
> ```

> [!example]- **解法實作 2**
> ```cpp
> #include <algorithm>
> #include <iostream>
> 
> using namespace std;
> 
> int main() {
>   int k;
>   string s;
>   cin >> k;
>   cin >> s;
>   reverse(s.begin(), s.end() - k);
>   reverse(s.end() - k, s.end());
>   reverse(s.begin(), s.end());
>   cout << s << endl;
> }
> ```
---
title: KamaCoder 54. Replace Number
tags:
  - kamacoder
  - string
status: reviewing
---
🔗 [**題目連結**](https://kamacoder.com/problempage.php?pid=1064)

### 📘 先嘗試自己寫

在沒看講解的情況有寫出來，校能跟他的解答差不多...，很玄

> [!example]- 自己寫的
> ```cpp
> #include<iostream>
> 
> using namespace std;
> 
> int main(){
>     string s;
>     cin >> s;
>     for(int i = 0 ; i < s.size() ; i++){
>         if(s[i]-'0' >= 0 && s[i]-'0' <= 9){
>             cout << "number";
>         }else{
>             cout << s[i];
>         }
>     }
> }
> ```

---

### 📹 看影片後(此題沒有影片，只有[講解](https://programmercarl.com/kamacoder/0054.%E6%9B%BF%E6%8D%A2%E6%95%B0%E5%AD%97.html#%E6%80%9D%E8%B7%AF))

---

### 🧠 核心思路

- 這解法我是真的想不出來

1. 遇到數字的時候把陣列擴充
![[KamaCoder-0054-1.png]]
2. 其他操作跟圖片一樣，細節我直接寫在程式碼裡面。
![[KamaCoder-0054-2.png]]

> [!example]- **解法實作**
> 
> ```cpp
> #include<iostream>
> 
> using namespace std;
> 
> int main(){
>     string s;
>     while(cin >> s){
>         int oldIndex = s.size() - 1;
>         int count = 0;
>         for(int i = 0 ; i < s.size() ; i++){
>             if(s[i] >= '0' && s[i] <= '9'){
>                 count++;
>             }
>         }
> 
>         // 計算新數組的大小
>         s.resize(s.size() + count*5);
>         int newIndex = s.size() - 1;
>         while(oldIndex >= 0){
>             if(s[oldIndex] >= '0' && s[oldIndex] <= '9'){
>                 s[newIndex--] = 'r';
>                 s[newIndex--] = 'e';
>                 s[newIndex--] = 'b';
>                 s[newIndex--] = 'm';
>                 s[newIndex--] = 'u';
>                 s[newIndex--] = 'n';
>             }else{
>                 s[newIndex--] = s[oldIndex];
>             }
>             oldIndex--;
>         }
>         cout << s << endl;
>     }
> }
> ```
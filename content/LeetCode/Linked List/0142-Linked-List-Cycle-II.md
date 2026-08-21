---
title: 142. Linked List Cycle II
tags:
  - leetcode
  - linked_list
difficulty: Medium
status: reviewing
---

🔗 [**題目連結**](https://leetcode.com/problems/linked-list-cycle-ii/)


### 📘 先嘗試自己寫

根本沒想法。

---

### 📹 看影片後

---

### 🧠 核心思路

- `fast` 指针一定先進入環中，如果快指針和慢指針相遇的话，一定是在環中相遇。
- 因為快指針是走兩步，慢指針是走一步，其實想對於慢指針來說，快指針是一個節點一個節點的靠近慢指針的，所以快指針一定可以跟慢指針重合。
![[0142-1.gif]]
- 此時已經知道有環了，現在要找環的入口。
- 假設從頭節點到環型入口節點的節點數為 `x` 。環形入口節點到快指針與慢指針相遇節點的節點數為 `y` 。從相遇節點再到環型入口節點的節點數為 `z`。如圖所示：
![[0142-2.png]]
- 相遇時：慢指針有過的節點數為： `x + y` ，快指針走過的節點數： `x + y + n(y + z)` ， `n` 為快指針在環內走了 `n` 圈才遇到慢指針。
- 環裡的狀況是快指針去追慢指針，如果 `n` 不大於等於 1 ，就不可能是快指針追慢指針。至少要走一圈才有可能跟慢指針相遇。
- 因為快指針是一步走兩個節點，慢指針是一步走一個節點，所以
    `快指針走過的節點數 = 慢指針走過的節點數 * 2`
    `x + y + n (y + z) = (x + y) * 2`
- 因為是求入口，所以要知道 x 跟式子有甚麼關係，整理完後：
    `x = n (y + z) - y`
- 再整理一下：
    `x = (n - 1) (y + z) + z`
- 以 n=1 為例，這式子說明快指針在環裡只轉了一圈就遇到慢指針：
    `x = z`
- 這也就意味著，從頭節點出發一個指針，從相遇節點也出發一個指針，這兩個指針每次只走一個節點，那麼當這兩個指針相遇的時候就是**環形入口的節點**。
- 就算  `n != 1` 也沒關係，只要知道快慢指針第一次相遇後，只要在宣告兩個指針，一個 (`index1`) 指向 `head`，一個 (`index2`) 指向 `fast` 或 `slow` ，`index1`、`index2` 下次相遇的時候就是環形入口。
![[0142-3.gif]]

```cpp
fast = head;
slow = head;
while(fast != NULL && fast->next != NULL){ // 註解 1
    fast = fast->next->next;
    slow = slow->next;
    if(fast == slow){
        index1 = fast; // 用 slow 也是一樣的意思
        index2 = head;
        while(index1 != index2){
            index1 = index1->next;
            index2 = index2->next;
        }
        return index1; // 用 index2 也是一樣的意思
    }
}
return NULL;
```

> [!note]- 註解
> - 註解 1：因為 `fast` 指針是兩步兩步跳，所以除了當前的那格，也要確認下一格是不是 `NULL`

> [!example]- **解法實作**
> 
> ```cpp
> /**
>  * Definition for singly-linked list.
>  * struct ListNode {
>  *     int val;
>  *     ListNode *next;
>  *     ListNode(int x) : val(x), next(NULL) {}
>  * };
>  */
> class Solution {
> public:
>     ListNode *detectCycle(ListNode *head) {
>         ListNode* fast = head;
>         ListNode* slow = head;
>         while(fast != nullptr && fast->next != nullptr){
>             fast = fast->next->next;
>             slow = slow->next;
>             if(fast == slow){
>                 ListNode* index1 = fast;
>                 ListNode* index2 = head;
>                 while(index1 != index2){
>                     index1 = index1->next;
>                     index2 = index2->next;
>                 }
>                 return index1;
>             }
>         }
>         return nullptr;
>     }
> };
> ```

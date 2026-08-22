---
title: 24. Swap Nodes in Pairs
tags:
  - leetcode
  - linked_list
difficulty: Medium
status: reviewing
---

🔗 [**題目連結**](https://leetcode.com/problems/swap-nodes-in-pairs/)

### 📘 先嘗試自己寫

大概有一點想法，有寫出來一點，但不知道為甚麼有邏輯錯誤的地方。

>[!example]- 自己寫的
> ```cpp
> /**
>  * Definition for singly-linked list.
>  * struct ListNode {
>  *     int val;
>  *     ListNode *next;
>  *     ListNode() : val(0), next(nullptr) {}
>  *     ListNode(int x) : val(x), next(nullptr) {}
>  *     ListNode(int x, ListNode *next) : val(x), next(next) {}
>  * };
>  */
> class Solution {
> public:
>     ListNode* swapPairs(ListNode* head) {
>         ListNode* dummyhead = head;
>         ListNode* cur = head->next;
>         ListNode* pre = head;
>         ListNode* temp;
>         while(cur != nullptr){
>             temp = cur->next;
>             cur->next = pre;
>             pre->next = temp;
>             cur = temp->next;
>         }
>         return dummyhead->next;
>     }
> };
> ```

---

### 📹 看影片後

---

### 🧠 核心思路

* dummyhead 等於 cur。
* cur 先指向第 2 節點，第 2 節點再指向第 1 節點，第 1 節點再指向第 3 節點。
* 先用 temp 把第 1 節點保存下來，temp1 再保存第 3 節點。

![[0024.png]]

```cpp
dummyhead = new node();
dummyhead->next = head;
cur = dummyhead;
while(cur->next != NULL && cur->next->next != NULL){
    temp = cur->next;
    temp1 = cur->next->next->next;
    cur->next = cur->next->next;
    cur->next->next = temp;
    temp->next = temp1;
    cur = cur->next->next;
}
return dummyhead->next;
```

> [!example]- **解法實作**
> ```cpp
> /**
>  * Definition for singly-linked list.
>  * struct ListNode {
>  *     int val;
>  *     ListNode *next;
>  *     ListNode() : val(0), next(nullptr) {}
>  *     ListNode(int x) : val(x), next(nullptr) {}
>  *     ListNode(int x, ListNode *next) : val(x), next(next) {}
>  * };
>  */
> class Solution {
> public:
>     ListNode* swapPairs(ListNode* head) {
>         if(head == nullptr){
>             return head;
>         }
>         ListNode* dummyhead = new ListNode(0);
>         dummyhead->next = head;
>         ListNode* cur = dummyhead;
>         
>         while(cur->next != nullptr && cur->next->next != nullptr){
>             ListNode* first = cur->next;
>             ListNode* second = cur->next->next;
>             ListNode* temp = second->next;
> 
>             cur->next = second;
>             second->next = first;
>             first->next = temp;
> 
>             cur = first;
>         }
> 
>         return dummyhead->next;
>     }
> };
> ```

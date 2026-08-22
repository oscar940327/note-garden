---
title: 19. Remove Nth Node From End of List
tags:
  - leetcode
  - linked_list
difficulty: Medium
status: reviewing
---
🔗 [**題目連結**](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

### 📘 先嘗試自己寫
- 自己有寫出來，應該是因為前幾題有類似的。
- 只有因為編譯錯誤問 gemini，但也只是因為太早刪除 temp1。
> 我的方法可能因為鏈表太長而出現錯誤。

> [!example]- 自己寫的
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
>     ListNode* removeNthFromEnd(ListNode* head, int n) {
>         ListNode* temp = head;
>         int count = 0; // 節點總數
>         while(temp != nullptr){
>             temp = temp->next;
>             count++;
>         }
>         int index = count - n; // 要刪除的那個節點
>         delete temp;
> 
>         ListNode* dummyhead = new ListNode(0);
>         dummyhead->next = head;
>         ListNode* cur = dummyhead;
>         while(index--){
>             cur = cur->next;
>         }
>         ListNode* temp1 = cur->next;
>         cur->next = cur->next->next;
>         delete temp1;
>         temp1 = nullptr;
>         return dummyhead->next;
>     }
> };
> ```
> 
---

### 📹 看影片後

---

### 🧠 核心思路

- 設定快、慢指針
![[0019-1.png]]
- 快指針先移動 n+1 步，之後快、慢指針同時移動，直到快指針指到 null。
- 如果要讓慢指針指到目標的前一個節點(方便刪除)，快指針要先移動 n+1 步。
![[0019-2.png]]
![[0019-3.png]]

```cpp
dummyhead = new node();
fast = dummyhead;
slow = dummyhead;
n++;
while(n-- && fast != NULL){
    fast = fast->next;
}
while(fast != NULL){
    fast = fast->next;
    slow = slow->next;
}
slow->next = slow->next->next;
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
>     ListNode* removeNthFromEnd(ListNode* head, int n) {
>         ListNode* dummyhead = new ListNode(0);
>         dummyhead->next = head;
>         ListNode* fast = dummyhead;
>         ListNode* slow = dummyhead;
> 
>         n++;
>         while(n--){
>             fast = fast->next;
>         }
> 
>         while(fast != nullptr){
>             fast = fast->next;
>             slow = slow->next;
>         }
> 
>         ListNode* temp = slow->next;
>         slow->next = slow->next->next;
>         delete temp;
>         temp = nullptr;
> 
>         return dummyhead->next;
>     }
> };
> ```

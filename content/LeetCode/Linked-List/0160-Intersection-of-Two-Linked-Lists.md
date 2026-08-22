---
title: 160. Intersecion of Two Linked Lists
tags:
  - leetcode
  - linked_list
difficulty: Easy
status: reviewing
---

🔗 [**題目連結**](https://leetcode.com/problems/intersection-of-two-linked-lists/)

### 📘 先嘗試自己寫

思考了一下，但是沒有想法，看了[講解](https://programmercarl.com/%E9%9D%A2%E8%AF%95%E9%A2%9802.07.%E9%93%BE%E8%A1%A8%E7%9B%B8%E4%BA%A4.html#%E6%80%9D%E8%B7%AF)的思路自己寫出來。

:::spoiler 自己寫的(看了講解)
```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
        ListNode* tempA = headA;
        ListNode* tempB = headB;
        int countA = 0, countB = 0;
        while (tempA != nullptr) {
            tempA = tempA->next;
            countA++;
        }
        while (tempB != nullptr) {
            tempB = tempB->next;
            countB++;
        }
        int n = abs(countA - countB);

        ListNode* curA = headA;
        ListNode* curB = headB;
        if (countA > countB) {
            while (n--) {
                curA = curA->next;
            }
        } else {
            while (n--) {
                curB = curB->next;
            }
        }

        while (curA != nullptr && curB != nullptr) {
            if (curA == curB) {
                return curA;
            }
            curA = curA->next;
            curB = curB->next;
        }
        return nullptr;
    }
};
```

---

### 📹 看影片後(此題只有講解)

---

### 🧠 核心思路

將兩個鏈表的末端對齊之後，依序比對 `curA== curB` 只要 `curA`、`curB` 相同就 `return curA`，如果最後都不同就 `return nullptr`。

![[0160-1.png|500]]
![[0160-2.png|500]]

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
>     ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
>         ListNode* curA = headA;
>         ListNode* curB = headB;
>         int countA = 0, countB = 0;
>         
>         while(curA != nullptr){
>             curA = curA->next;
>             countA++;
>         }
> 
>         while(curB != nullptr){
>             curB = curB->next;
>             countB++;
>         }
> 
>         curA = headA;
>         curB = headB;
>         int n = abs(countA - countB);
>         if(countA > countB){
>             while(n--){
>                 curA = curA->next;
>             }
>         }else{
>             while(n--){
>                 curB = curB->next;
>             }
>         }
> 
>         while(curA != nullptr){
>             if(curA == curB){
>                 return curA;
>             }
>             curA = curA->next;
>             curB = curB->next;
>         }
>         return nullptr;
>     }
> };
> ```
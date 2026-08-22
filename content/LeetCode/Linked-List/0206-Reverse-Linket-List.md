---
title: 206. Reverse Linked List
tags:
  - leetcode
  - linked_list
difficulty: Easy
status: reviewing
---

🔗 [**題目連結**](https://leetcode.com/problems/reverse-linked-list/)

### 📘 先嘗試自己寫

大概有一點想法，但還是沒寫出來。

---

### 📹 看影片後

---

### 🧠 核心思路

![[0206.gif]]

1. 雙指針寫法
    看了一下[講解](https://programmercarl.com/0206.%E7%BF%BB%E8%BD%AC%E9%93%BE%E8%A1%A8.html#%E6%80%9D%E8%B7%AF)後知道有用 pre 跟 temp 有試著再寫一下，但最後還是看解答才知道`return pre`。

    
    ```cpp
    cur = head;
    pre = NULL;
    while(cur != NULL){
        temp = cur->next;
        cur->next = pre;
        pre = cur;
        cur = temp;
    }
    return pre;
    ```
    
2. 遞迴寫法
    這我沒想到。
    ```cpp
    reverse(cur, pre){
    if(cur == NULL) return pre;
        temp = cur->next;
        cur->next = pre;
        reverse(temp, cur);
    }
    reverselist(head){
        return reverse(head, NULL);
    }
    ```

> [!example]- **解法實作** 
> 1. 雙指針寫法
>     ```cpp
> 	/**
> 	 * Definition for singly-linked list.
> 	 * struct ListNode {
> 	 *     int val;
> 	 *     ListNode *next;
> 	 *     ListNode() : val(0), next(nullptr) {}
> 	 *     ListNode(int x) : val(x), next(nullptr) {}
> 	 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
> 	 * };
> 	 */
> 	class Solution {
> 	public:
> 	    ListNode* reverseList(ListNode* head) {
> 	        ListNode* cur = head;
> 	        ListNode* pre = nullptr;
> 	        
> 	        while(cur != nullptr){
> 	            ListNode* temp = cur->next;
> 	            cur->next = pre;
> 	            pre = cur;
> 	            cur = temp;
> 	        }
> 	
> 	        return pre;
> 	    }
> 	};
>     ```
> 
> 2. 遞迴寫法
>     ```cpp
>     /**
>      * Definition for singly-linked list.
>      * struct ListNode {
>      *     int val;
>      *     ListNode *next;
>      *     ListNode() : val(0), next(nullptr) {}
>      *     ListNode(int x) : val(x), next(nullptr) {}
>      *     ListNode(int x, ListNode *next) : val(x), next(next) {}
>      * };
>      */
>     class Solution {
>     public:
>         ListNode* reverse(ListNode* cur, ListNode* pre){
>             if(cur == nullptr){
>                 return pre;
>             }
>             ListNode* temp;
>             temp = cur->next;
>             cur->next = pre;
>             return reverse(temp, cur);
>         }
> 
>         ListNode* reverseList(ListNode* head) {
>             return reverse(head, nullptr);
>         }
> 
>     };
>     ```

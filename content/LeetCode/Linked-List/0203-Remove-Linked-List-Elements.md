---
title: 203. Remove Linked List Elements
tags:
  - leetcode
  - linked_list
difficulty: Easy
status: reviewing
---

🔗 [**題目連結**](https://leetcode.com/problems/remove-linked-list-elements/)

### 📘 先嘗試自己寫

根本就不太會鏈表，先看講解。

---

### 📹 看影片後

---

### 🧠 核心思路



1. 使用原來的鏈表來刪除節點
	![[0203-1.png]]
	只要將頭節點向後移動一位就可以，這樣就從鏈表中移除了一個頭節點。
    ![[0203-2.png]]
    記得將原頭節點從內存中刪除
	![[0203-3.png]]


    ```cpp
    while(head != NULL && head->val == target){
        head = head->next;
    }
    cur = head;
    while(cur != NULL && cur->next != NULL){
        if(cur->next->value == target){
            cur->next = cur->next->next; // 註解 1
        }else{
            cur = cur->next;
        }
    }
    return head;
    ```

> [!note]- 註解
> - **註解 1**：將節點直接指向下一個節點就等於是刪除要刪除的節點了
> ![[0203-4.png]]

2. 設定一個虛擬的頭節點，這樣原鏈表的所有節點就都可以按照統一的方式進行移除了。
	![[0203-5.png]]

    ```cpp
    dummyhead = new ListNode(0);
    dummyhead->next = head;

    cur = dummyhead;
    while(cur != NULL && cur->next != NULL){
        if(cur->next->val == target){
            cur->next = cur->next->next;
        }else{
            cur = cur->next;
        }
    }
    return dummyhead->next;
    ```
 

> [!example]- **解法實作**
> 
> 1. 使用原來的鏈表來刪除節點
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
>         ListNode* removeElements(ListNode* head, int val) {
>             while(head != NULL && head->val == val){
>                 ListNode* temp = head;
>                 head = head->next;
>                 delete temp;
>             }
> 
>             ListNode* cur = head;
>             while(cur != NULL && cur->next != NULL){
>                 if(cur->next->val == val){
>                     ListNode* temp = cur->next;
>                     cur->next = cur->next->next;
>                     delete temp;
>                 }else{
>                     cur = cur->next;
>                 }
>             }
>             return head;
>         }
>     };
>     ```
> 
> 2. 設定一個虛擬頭節點來刪除節點
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
>         ListNode* removeElements(ListNode* head, int val) {
>             ListNode* dummyhead = new ListNode(0);
>             dummyhead->next = head;
>             ListNode* cur = dummyhead;
> 
>             while(cur->next != NULL){
>                 if(cur->next->val == val){
>                     ListNode* temp = cur->next;
>                     cur->next = cur->next->next;
>                     delete temp;
>                 }else{
>                     cur = cur->next;
>                 }
>             }
>             head = dummyhead->next;
>             delete dummyhead;
>             return head;
>         }
>     };
>     ```
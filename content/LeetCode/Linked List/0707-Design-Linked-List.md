
🔗 [**題目連結**](https://leetcode.com/problems/design-linked-list/)

### 📘 先嘗試自己寫

連題目都看不太懂

---

### 📹 看影片後

---

### 🧠 核心思路

- 添加鏈表節點
    ![[0707-1.png]]
- 刪除鏈表節點
    ![[0707-2.png]]

主要只有這兩個觀念，其他都是細節。

1. 獲取第 n 個節點的數值
```cpp
(n < 0, n > size-1) return;
cur = dummyhead->next; // 只有這裡是cur = dummyhead->next
while(n){
    cur = cur->next;
    n--;
}
return cur->val;
```
2. 頭部插入節點
```cpp
newnode = new node(...);
newnode->next = dummyhead->next; // 應該先把newnode->next指向dummyhead->next
dummyhead->next = newnode; // 再把dummyhead->next指向newnode
size++;
```
3. 尾部插入節點
```cpp
newnode = new node(...);
cur = dummyhead
while(cur->next != NULL){
cur = cur->next;
}
cur->next = newnode;
size++;
```
4. 第 n 個節點前插入
```cpp
if(n < 0) n=0;
if(n > size) return; 
newnode = new node(...);
cur = dummyhead;
while(n){
    cur = cur->next;
    n--;
}
newnode->next = cur->next;
cur->next = newnode;
size++;

```
5. 刪除第 n 個節點
```cpp
if(n >= size || n < 0) return;
cur = dummyhead;
while(n){
    cur = cur->next;
    n--;
}
cur->next = cur->next->next;
size--;
```

> [!example]- 解法實作 (leetcode) 
> ```cpp
> class MyLinkedList {
> public:
>     struct ListNode{
>         int val;
>         ListNode* next;
>         ListNode(int x) : val(x), next(nullptr){}
>     };
> 
>     MyLinkedList() {
>         dummyhead = new ListNode(0);
>         size = 0;
>     }
>     
>     int get(int index) {
>         if(index > (size-1) || index < 0){
>             return -1;
>         }
> 
>         ListNode* cur = dummyhead->next;
>         while(index--){
>             cur = cur->next;
>         }
>         return cur->val;
>     }
>     
>     void addAtHead(int val) {
>         ListNode* newnode = new ListNode(val);
>         newnode->next = dummyhead->next;
>         dummyhead->next = newnode;
>         size++;
>     }
>     
>     void addAtTail(int val) {
>         ListNode* newnode = new ListNode(val);
>         ListNode* cur = dummyhead;
>         while(cur->next != nullptr){
>             cur = cur->next;
>         }        
>         newnode->next = cur->next;
>         cur->next = newnode;
>         size++;
>     }
>     
>     void addAtIndex(int index, int val) {
>         if(index > (size-1)){
>             return;
>         }
> 
>         if(index < 0){
>             return;
>         }
> 
>         ListNode* newnode = new ListNode(val);
>         ListNode* cur = dummyhead;
>         while(index--){
>             cur = cur->next;
>         }
>         newnode->next = cur->next;
>         cur->next = newnode;
>         size++;
>     }
>     
>     void deleteAtIndex(int index) {
>         if(index > (size-1) || index < 0){
>             return;
>         }
> 
>         ListNode* cur = dummyhead;
>         while(index--){
>             cur = cur->next;
>         }
> 
>         ListNode* temp = cur->next;
>         cur->next = cur->next->next;
>         delete temp;
>         temp = nullptr;
>         size--;
>     }
> private:
>     int size;
>     ListNode* dummyhead;
> };
> 
> /**
>  * Your MyLinkedList object will be instantiated and called as such:
>  * MyLinkedList* obj = new MyLinkedList();
>  * int param_1 = obj->get(index);
>  * obj->addAtHead(val);
>  * obj->addAtTail(val);
>  * obj->addAtIndex(index,val);
>  * obj->deleteAtIndex(index);
>  */
> ```

> [!example]-  **解法實作 (完整)**
> ```cpp
> class MyLinkedList {
> public:
>     struct LinkedNode{
>         int val;
>         LinkedNode* next;
>         LinkedNode(int x) : val(x), next(nullptr){}
>     };
> 
>     MyLinkedList() {
>         dummyhead = new LinkedNode(0);
>         size = 0;
>     }
>     
>     int get(int index) {
>         if(index > (size-1) || index < 0){
>             return -1;
>         }
> 
>         LinkedNode* cur = dummyhead->next;
>         while(index--){
>             cur = cur->next;
>         }
>         return cur->val;
>     }
>     
>     void addAtHead(int val) {
>         LinkedNode* newnode = new LinkedNode(val);
>         newnode->next = dummyhead->next;
>         dummyhead->next = newnode;
>         size++;
>     }
>     
>     void addAtTail(int val) {
>         LinkedNode* newnode = new LinkedNode(val);
>         LinkedNode* cur = dummyhead;
>         while(cur->next != nullptr){
>             cur = cur->next;
>         }        
>         newnode->next = cur->next;
>         cur->next = newnode;
>         size++;
>     }
>     
>     void addAtIndex(int index, int val) {
>         if(index > size){
>             return;
>         }
>         if(index < 0){
>             index = 0;
>         }
>         LinkedNode* newnode = new LinkedNode(val);
>         LinkedNode* cur = dummyhead;
>         while(index--){
>             cur = cur->next;
>         }
>         newnode->next = cur->next;
>         cur->next = newnode;
>         size++;
>     }
>     
>     void deleteAtIndex(int index) {
>         if(index >= size || index < 0){
>             return;
>         }
>         LinkedNode* cur = dummyhead;
>         while(index--){
>             cur = cur->next;
>         }
>         LinkedNode* temp = cur->next;
>         cur->next = cur->next->next;
>         delete temp;
>         temp = nullptr;
>         size--;
>     }
> 
>     void printLinkedList(){
>         LinkedNode* cur = dummyhead;
>         while(cur->next != nullptr){
>             cout << cur->next->val << " ";
>             cur = cur->next;
>         }
>         cout << endl;
>     }
> 
>     private:
>         int size;
>         LinkedNode* dummyhead;
> };
> 
> /**
>  * Your MyLinkedList object will be instantiated and called as such:
>  * MyLinkedList* obj = new MyLinkedList();
>  * int param_1 = obj->get(index);
>  * obj->addAtHead(val);
>  * obj->addAtTail(val);
>  * obj->addAtIndex(index,val);
>  * obj->deleteAtIndex(index);
>  */
> ```


> [!example]- 執行全部 phase 
>  ```
>  $goal 完成 OpenSpec change `conversational-cv-reminders` 的所有剩餘 Task Groups。
>  
>   Agent：
>   - 主 Agent：Sol medium，整合與判定進度
>   - Developer：Luna xhigh，實作、測試、修復
>   - Reviewer：Luna xhigh，獨立審查且不修改程式
> 
>   每個 Task Group：
>   1. 讀取 status、apply instructions 與 contextFiles。
>   2. 執行 `$openspec-apply-change`，只完成當前 Group。
>   3. 測試通過後 commit。
>   4. Reviewer 審查；若有 P0／P1，由 Developer 修復、測試、commit，再重新審查。
>   5. P0／P1 清空後才勾選 tasks、執行 strict validation、commit，接著進入下一 Group。
> 
>   持續執行，不因 context 壓縮或工作量停止；壓縮後直接延續，不重做已完成項目。不需我逐階段確認，不 push、不
>   提前 archive。
> 
>   只有以下情況可以停下詢問：
>   - 缺少外部權限、API key 或實機
>   - 需要不可逆的非測試操作
>   - 規格衝突或必須擴大 OpenSpec 範圍
>   - Task 7.3 需要 iPhone／iPad 人工驗收
> 
>   全部 tasks、測試與 `$openspec-verify-change` 通過後，將 goal 標記完成並回報 commits、測試、Reviewer 結果
>   與未完成事項。
>   ```

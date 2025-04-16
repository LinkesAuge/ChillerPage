# API Design (tRPC Routers)

This document outlines the proposed structure and procedures for the tRPC API layer.

## Root Router Structure

```typescript
// src/lib/api/root.ts

import { createTRPCRouter } from "./trpc";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { clanRouter } from "./routers/clan";
import { dataRouter } from "./routers/data";
import { rulesRouter } from "./routers/rules";
import { contentRouter } from "./routers/content";
import { eventRouter } from "./routers/event";
import { messageRouter } from "./routers/message";
import { notificationRouter } from "./routers/notification";
import { adminRouter } from "./routers/admin";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  clan: clanRouter,
  data: dataRouter,
  rules: rulesRouter,
  content: contentRouter,
  event: eventRouter,
  message: messageRouter,
  notification: notificationRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
```

## Router Definitions (High-Level Procedures)

### `authRouter` (`src/lib/api/routers/auth.ts`)
*(Minimal, as NextAuth.js handles most core flows)*

*   **`getSession`**: Get current user session data.

### `userRouter` (`src/lib/api/routers/user.ts`)

*   **`getProfile`**: Fetch current user's profile data.
*   **`updateProfile`**: Update editable fields (name, lang, country, gameAliases).
*   **`getGameAliases`**: Fetch current user's game aliases.
*   **`addGameAlias`**: Add a game alias (with format/duplicate validation).
*   **`removeGameAlias`**: Remove a game alias.
*   **`checkAliasMatch`**: Check if entered aliases match DB player names (visual feedback).
*   **`getKnownPlayers`**: Fetch list of distinct player names from ChestData for selection.

### `clanRouter` (`src/lib/api/routers/clan.ts`)

*   **`listUserClans`**: Get clans the current user is a member of.
*   **`getClanDetails`**: Get details for a specific clan (requires membership/permission).
*   **`getClanMembers`**: List members of a specific clan (name, rank, aliases). (Used for Member Directory)

### `dataRouter` (`src/lib/api/routers/data.ts`)

*   **`parseAndPreviewData`**: (Input: CSV/Text, Filename?) -> Output: Parsed data structure for client-side preview, including applied rules/scores if enabled. Handles Pattern 1 & 2 parsing, date extraction, level extraction. Requires `data:import` permission.
*   **`commitPreviewData`**: (Input: Processed preview data, ClanID, CollectedDate) -> Output: Success/Failure status. Saves data to ChestDataEntry. Requires `data:import` permission.
*   **`listChestData`**: (Input: Filters, Sorting, Pagination, ClanID) -> Output: Paginated list of ChestDataEntry for viewing. Requires `data:view` permission.
*   **`updateChestDataEntry`**: (Input: EntryID, Changes) -> Output: Updated entry. Requires `data:edit` permission. Records AuditLog.
*   **`deleteChestDataEntry`**: (Input: EntryID) -> Output: Success/Failure. Requires `data:delete` permission. Records AuditLog.
*   **`batchUpdateChestData`**: (Input: EntryIDs, Changes) -> Output: Status. Requires `data:batch_edit` permission. Records AuditLog.
*   **`batchDeleteChestData`**: (Input: EntryIDs) -> Output: Status. Requires `data:batch_delete` permission. Records AuditLog.
*   **`rescoreChestData`**: (Input: EntryIDs) -> Output: Status. Re-applies scoring rules. Requires `rules:manage` or similar permission. Records AuditLog.
*   **`getChestDataStats`**: (Input: Filters - UserAliases?, ClanID?, DateRange?) -> Output: Aggregated stats for charts (dashboard/dedicated page). Requires `data:view` permission.

### `rulesRouter` (`src/lib/api/routers/rules.ts`)
*(Admin Rule Management UI - All require `rules:manage` permission)*

*   **`listValidationRules`**: (Input: ClanID) -> Output: List of ValidationRules.
*   **`addValidationRule`**: (Input: ClanID, Column, Value) -> Output: New ValidationRule.
*   **`updateValidationRule`**: (Input: RuleID, Changes) -> Output: Updated ValidationRule.
*   **`deleteValidationRule`**: (Input: RuleID) -> Output: Success/Failure.
*   **`listCorrectionRules`**: (Input: ClanID) -> Output: List of CorrectionRules.
*   **`addCorrectionRule`**: (Input: ClanID, From, To, Column?) -> Output: New CorrectionRule.
*   **`updateCorrectionRule`**: (Input: RuleID, Changes) -> Output: Updated CorrectionRule.
*   **`deleteCorrectionRule`**: (Input: RuleID) -> Output: Success/Failure.
*   **`listScoringRules`**: (Input: ClanID) -> Output: List of ScoringRules (ordered).
*   **`addScoringRule`**: (Input: ClanID, Criteria, Score, Order) -> Output: New ScoringRule.
*   **`updateScoringRule`**: (Input: RuleID, Changes) -> Output: Updated ScoringRule.
*   **`deleteScoringRule`**: (Input: RuleID) -> Output: Success/Failure.
*   **`updateRuleOrder`**: (Input: RuleID, Direction/NewOrder) -> Output: Status. (For ScoringRules)

### `contentRouter` (`src/lib/api/routers/content.ts`)
*(Articles, Announcements, Comments)*

*   **`createArticle`**: (Input: Title, Content, ClanID?, IsAnnouncement?) -> Output: New Article (status=DRAFT/PENDING). Requires `article:create`.
*   **`updateArticle`**: (Input: ArticleID, Changes) -> Output: Updated Article. Requires `article:edit:own` or `article:edit:any`.
*   **`deleteArticle`**: (Input: ArticleID) -> Output: Success/Failure. Requires `article:delete:own` or `article:delete:any`.
*   **`publishArticle`**: (Input: ArticleID) -> Output: Article (status=PUBLISHED). Requires `article:approve` or admin permission.
*   **`pinAnnouncement`**: (Input: ArticleID, ExpiresAt?) -> Output: Announcement details. Requires admin/mod permission.
*   **`listArticles`**: (Input: Filters - ClanID?, Status?, Pagination) -> Output: Paginated list of Articles. Permission based on status/clan.
*   **`getArticle`**: (Input: ArticleID) -> Output: Article details + Comments. Permission based on status/clan.
*   **`submitArticleForApproval`**: (Input: ArticleID) -> Output: Article (status=PENDING). Requires `article:submit`.
*   **`addComment`**: (Input: ArticleID, Content, ParentID?) -> Output: New Comment. Requires `comment:create`.
*   **`updateComment`**: (Input: CommentID, Content) -> Output: Updated Comment. Requires `comment:edit:own` or `comment:edit:any`.
*   **`deleteComment`**: (Input: CommentID) -> Output: Success/Failure. Requires `comment:delete:own` or `comment:delete:any`.
*   **`upvoteContent`**: (Input: ContentID, ContentType) -> Output: New upvote count. Requires logged-in user.
*   **`addReaction`**: (Input: ContentID, ContentType, Emoji) -> Output: Reactions state. Requires logged-in user. (Post-MVP?)

### `eventRouter` (`src/lib/api/routers/event.ts`)

*   **`createEvent`**: (Input: Details, ClanID) -> Output: New Event. Requires `event:create`.
*   **`updateEvent`**: (Input: EventID, Changes) -> Output: Updated Event. Requires `event:edit`.
*   **`deleteEvent`**: (Input: EventID) -> Output: Success/Failure. Requires `event:delete`.
*   **`listEvents`**: (Input: Filters - ClanID?, DateRange?) -> Output: List of Events. Requires membership.

### `messageRouter` (`src/lib/api/routers/message.ts`)

*   **`sendMessage`**: (Input: ReceiverID, Content) -> Output: New PrivateMessage. Requires `message:send:private`.
*   **`sendBroadcast`**: (Input: ClanID, Content) -> Output: Status. Requires `message:send:broadcast`.
*   **`listMessages`**: (Input: Filters - ConversationPartnerID?, Pagination) -> Output: Paginated list of PrivateMessages. Requires logged-in user.
*   **`markMessageRead`**: (Input: MessageID) -> Output: Status.

### `notificationRouter` (`src/lib/api/routers/notification.ts`)

*   **`listNotifications`**: (Input: Filters - UnreadOnly?, Pagination) -> Output: Paginated list of Notifications. Requires logged-in user.
*   **`markNotificationRead`**: (Input: NotificationID / 'all') -> Output: Status.
*   **`getUnreadCount`**: -> Output: Number of unread notifications.

### `adminRouter` (`src/lib/api/routers/admin.ts`)
*(Consolidates actions typically done in an Admin Panel - Permissions vary per procedure)*

*   **`listUsers`**: (Input: Filters - Clan?, Role?, Rank?, Status?) -> Output: Paginated list of Users. Requires admin permission (`admin_panel:view` or similar).
*   **`assignUserRole`**: (Input: UserID, RoleID) -> Output: Status. Requires `user:manage:role`.
*   **`assignUserRank`**: (Input: UserID, ClanID, RankID) -> Output: Status. Requires `user:manage:rank`.
*   **`assignUserClan`**: (Input: UserID, ClanID) -> Output: Status. Requires `user:manage:clan_assignment`.
*   **`removeUserClan`**: (Input: UserID, ClanID) -> Output: Status. Requires `user:manage:clan_assignment`.
*   **`activateUser`**: (Input: UserID) -> Output: Status. (Implicitly done via assigning Role/Rank/Clan).
*   **`deactivateUser`**: (Input: UserID) -> Output: Status. Requires admin permission.
*   **`createClan`**: (Input: Name, Description?) -> Output: New Clan. Requires Owner.
*   **`updateClan`**: (Input: ClanID, Changes) -> Output: Updated Clan. Requires admin permission.
*   **`getRuleToggleSettings`**: -> Output: Current settings for auto-applying rules.
*   **`setRuleToggleSettings`**: (Input: Settings) -> Output: Updated settings. Requires admin permission.
*   **`listAuditLogs`**: (Input: Filters, Pagination) -> Output: Paginated list of AuditLogs. Requires admin permission.
*   **`manageQuickLinks`**: (Input: Links list) -> Output: Status. Requires admin permission.
*   **`manageCrossClanPermissions`**: (Input: UserID, Permissions, TargetClanIDs) -> Output: Status. Requires Owner/Admin.
*   **`listChestDefinitions`**: (Input: ClanID) -> Output: List of ChestDefinitions. Requires `rules:manage`.
*   **`addChestDefinition`**: (Input: ClanID, Name, IconUrl?) -> Output: New ChestDefinition. Requires `rules:manage`.
*   **`updateChestDefinition`**: (Input: DefinitionID, Changes) -> Output: Updated ChestDefinition. Requires `rules:manage`.
*   **`deleteChestDefinition`**: (Input: DefinitionID) -> Output: Status. Requires `rules:manage`. 
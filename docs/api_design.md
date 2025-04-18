# API Design (tRPC Routers)

<!-- Table of Contents -->
- [Root Router Structure](#root-router-structure)
- [Router Definitions (High-Level Procedures)](#router-definitions-high-level-procedures)
- [RBAC & Permissions](#rbac--permissions)
- [Error Handling](#error-handling)
- [Pagination & Filtering Guidelines](#pagination--filtering-guidelines)
- [Sample Procedure Definition: dataRouter](#sample-procedure-definition-datarouter)

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

## RBAC & Permissions

| Procedure                         | Required Permission   |
|-----------------------------------|-----------------------|
| `data.listChestData`              | `data:view`           |
| `data.updateChestDataEntry`       | `data:edit`           |
| `data.commitPreviewData`          | `data:import`         |
| `clan.getClanDetails`             | `clan:view`           |
| `clan.listUserClans`              | `clan:member:view`    |
| `user.updateProfile`              | `user:edit`           |

## Error Handling

All procedures use tRPC's built-in `TRPCError` to surface errors consistently:

* **BAD_REQUEST**: Input validation failed (e.g. Zod parsing). Clients receive:
  ```json
  {
    "error": {
      "message": "Invalid input: ...",
      "code": "BAD_REQUEST",
      "data": { "zodError": {/* detailed issues */} }
    }
  }
  ```
* **INTERNAL_SERVER_ERROR**: Unexpected failures such as database or network errors.
* **UNAUTHORIZED** (`401`): Missing or invalid session (no user).
* **FORBIDDEN** (`403`): User lacks required permission.

## Pagination & Filtering Guidelines

We standardize pagination for list endpoints:

* Use **cursor-based pagination** with `cursor` (last item ID) and `limit` parameters.
* Alternatively, for static or simple lists, use **offset pagination** (`skip`, `take`).
* Support optional `filter` and `sort` parameters in input type.
* Clients should handle `nextCursor` returned in response to fetch subsequent pages.

## Sample Procedure Definition: dataRouter

Below is a fleshed-out example for the `data.parseAndPreviewData` procedure. Use this template for other procedures:

### `parseAndPreviewData`

**Route:** `data.parseAndPreviewData`  
**Permission:** `data:import`

```ts
// src/lib/api/routers/data.ts

// Input Type
type ParseAndPreviewDataInput = {
  rawCsv: string;
  filename?: string;
  clanId: string;
};

// Output Type
type ParseAndPreviewDataOutput = {
  entries: Array<{ date: string; player: string; score: number }>;
};
```

**Example Request (tRPC JSON payload):**
```json
{
  "json": "{\"rawCsv\": \"date,player,score\\n2023-09-01,Player1,100\", \
               \"filename\": \"chests.csv\", \
               \"clanId\": \"clan_abc123\"}"
}
```

**Example Response:**
```json
{
  "result": {
    "data": {
      "entries": [
        { "date": "2023-09-01", "player": "Player1", "score": 100 }
      ]
    }
  }
}
```

## Sample Procedure Definition: authRouter

### `getSession`

**Route:** `auth.getSession`  
**Permission:** none (public)

```ts
// Input Type
type GetSessionInput = void;

// Output Type
type GetSessionOutput = {
  user?: { id: string; name: string; email: string };
  expires: string;
};
```

**Example Request:**
```json
{"json": "{}"}
```

**Example Response:**
```json
{
  "result": {
    "data": {
      "user": { "id": "user_123", "name": "Alice", "email": "alice@example.com" },
      "expires": "2023-10-01T12:00:00.000Z"
    }
  }
}
```

## Sample Procedure Definition: userRouter

### `updateProfile`

**Route:** `user.updateProfile`  
**Permission:** `user:edit`

```ts
// Input Type
type UpdateProfileInput = {
  name?: string;
  lang?: string;
  country?: string;
};

// Output Type
type UpdateProfileOutput = {
  success: boolean;
  updatedAt: string;
};
```

**Example Request:**
```json
{
  "json": "{\"name\": \"Bob\", \"country\": \"DE\"}"
}
```

**Example Response:**
```json
{
  "result": {
    "data": { "success": true, "updatedAt": "2023-09-20T08:30:00.000Z" }
  }
}
```

## Sample Procedure Definition: clanRouter

### `getClanDetails`

**Route:** `clan.getClanDetails`  
**Permission:** `clan:view`

```ts
// Input Type
type GetClanDetailsInput = { clanId: string };

// Output Type
type GetClanDetailsOutput = {
  id: string;
  name: string;
  createdAt: string;
  memberCount: number;
};
```

**Example Request:**
```json
{"json": "{\"clanId\": \"clan_abc123\"}"}
```

**Example Response:**
```json
{
  "result": {
    "data": { "id": "clan_abc123", "name": "Guardians", "createdAt": "2023-01-01T00:00:00.000Z", "memberCount": 24 }
  }
}
```

## Sample Procedure Definition: rulesRouter

### `listValidationRules`

**Route:** `rules.listValidationRules`  
**Permission:** `rules:manage`

```ts
// Input Type
type ListValidationRulesInput = { clanId: string };

// Output Type
type ListValidationRulesOutput = Array<{
  id: string;
  column: string;
  value: string;
}>;
```

**Example Request:**
```json
{"json": "{\"clanId\": \"clan_abc123\"}"}
```

**Example Response:**
```json
{
  "result": {
    "data": [ { "id": "rule_1", "column": "score", "value": ">=0" } ]
  }
}
```

## Sample Procedure Definition: contentRouter

### `createArticle`

**Route:** `content.createArticle`  
**Permission:** `article:create`

```ts
// Input Type
type CreateArticleInput = {
  title: string;
  content: string;
  clanId?: string;
  isAnnouncement?: boolean;
};

// Output Type
type CreateArticleOutput = {
  id: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED';
};
```

**Example Request:**
```json
{"json": "{\"title\": \"New Event\", \"content\": \"Details...\", \"clanId\": \"clan_abc123\"}"}
```

**Example Response:**
```json
{
  "result": {
    "data": { "id": "article_456", "status": "PENDING" }
  }
}
```

## Sample Procedure Definition: eventRouter

### `createEvent`

**Route:** `event.createEvent`  
**Permission:** `event:create`

```ts
// Input Type
type CreateEventInput = {
  name: string;
  date: string;
  clanId: string;
};

// Output Type
type CreateEventOutput = {
  id: string;
  createdAt: string;
};
```

**Example Request:**
```json
{"json": "{\"name\": \"Raid Night\", \"date\": \"2023-10-05\", \"clanId\": \"clan_abc123\"}"}
```

**Example Response:**
```json
{
  "result": {
    "data": { "id": "event_789", "createdAt": "2023-09-15T14:00:00.000Z" }
  }
}
```

## Sample Procedure Definition: messageRouter

### `sendMessage`

**Route:** `message.sendMessage`  
**Permission:** `message:send:private`

```ts
// Input Type
type SendMessageInput = {
  receiverId: string;
  content: string;
};

// Output Type
type SendMessageOutput = {
  messageId: string;
  sentAt: string;
};
```

**Example Request:**
```json
{"json": "{\"receiverId\": \"user_234\", \"content\": \"Hello!\"}"}
```

**Example Response:**
```json
{
  "result": {
    "data": { "messageId": "msg_1011", "sentAt": "2023-09-20T09:15:00.000Z" }
  }
}
```

## Sample Procedure Definition: notificationRouter

### `listNotifications`

**Route:** `notification.listNotifications`  
**Permission:** `notification:view`

```ts
// Input Type
type ListNotificationsInput = {
  unreadOnly?: boolean;
  cursor?: string;
  limit?: number;
};

// Output Type
type ListNotificationsOutput = {
  items: Array<{ id: string; message: string; read: boolean }>;
  nextCursor?: string;
};
```

**Example Request:**
```json
{"json": "{\"unreadOnly\": true, \"limit\": 10}"}
```

**Example Response:**
```json
{
  "result": {
    "data": { "items": [ { "id": "notif_1", "message": "You have a new clan invite", "read": false } ], "nextCursor": "notif_1" }
  }
}
```

## Sample Procedure Definition: adminRouter

### `listUsers`

**Route:** `admin.listUsers`  
**Permission:** `admin_panel:view`

```ts
// Input Type
type ListUsersInput = {
  clanId?: string;
  role?: string;
  skip?: number;
  take?: number;
};

// Output Type
type ListUsersOutput = {
  users: Array<{ id: string; name: string; role: string }>;
  nextCursor?: number;
};
```

**Example Request:**
```json
{"json": "{\"role\": \"admin\", \"take\": 20}"}
```

**Example Response:**
```json
{
  "result": {
    "data": { "users": [ { "id": "user_1", "name": "Admin", "role": "admin" } ], "nextCursor": 21 }
  }
}
``` 
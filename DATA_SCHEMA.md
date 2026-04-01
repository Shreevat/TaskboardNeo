## 1. Global Types

### `Id` (Identifier)

A unique identifier for any entity.

- **Type**: `string | number` (Typically generated as `id-xxxx` on the frontend, but should be handled as a string for backend consistency).

---

## 2. Core Entities

### `Column`

Represents a status column on the board (e.g., "To do", "In Progress").
| Key | Type | Description |
| :--- | :--- | :--- |
| `id` | `Id` | Unique identifier for the column. |
| `title` | `string` | Human-readable name of the column. |
| `position` | `number` | The horizontal order of the column (0-indexed). |

### `Task`

The primary item on the taskboard.
| Key | Type | Description |
| :--- | :--- | :--- |
| `id` | `Id` | Unique identifier for the task. |
| `columnId` | `Id` | References the `Column` where this task resides. |
| `content` | `string` | The text content/title of the task. |
| `position` | `number` | The vertical order of the task within its column (0-indexed). |
| `createdAt` | `string` | ISO 8601 timestamp (e.g., `2026-03-19T10:45:00Z`). |
| `subtasks` | `Subtask[]` | Nested list of incomplete/complete items. |
| `parentTaskId` | `Id | null` | (Optional) The ID of the task this was split from. |
| `promotedTaskIds` | `Id[]` | List of IDs for tasks that were split OFF from this task (used for fast lookup). |
| `color` | `string` | Hex color code (e.g., `#F0FDFA`) for the task card background. |
| | | _Note: Promoted tasks inherit the original parent's color and currently cannot be changed._ |

### `Subtask`

A smaller item nested within a parent `Task`.
| Key | Type | Description |
| :--- | :--- | :--- |
| `id` | `Id` | Unique identifier for the subtask. |
| `content` | `string` | The text content of the subtask. |
| `completed` | `boolean` | Whether the subtask is checked off. |
| `createdAt` | `string` | ISO 8601 timestamp. |

---

## 3. Global Constants

### `TASK_COLORS`

The predefined color palette used for task categorization.

- **Values**: Soft, light colors (Teal, Lime, Sky, Yellow) that ensure dark text visibility.
- **Default (Current)**:
  `["#F0FDFA", "#CCFBF1", "#99F6E4", "#F7FEE7", "#ECFCCB", "#D9F99D", "#E0F2FE", "#FEF9C3"]`

---

## 4. Frontend Application State (Zustand)

The frontend currently stores these entities in a single flat structure for performance:

```json
{
  "columns": [Column],
  "tasks": [Task]
}
```

_Note: Subtasks are stored directly inside each `Task` object._

---

## 5. Backend Implementation Recommendations

If migrating to a database, consider the following layout:

- **Table: Columns** (`id`, `title`, `position`)
- **Table: Tasks** (`id`, `column_id`, `content`, `position`, `color`, `parent_task_id`, `created_at`)
- **Table: Subtasks** (`id`, `task_id`, `content`, `completed`, `created_at`)

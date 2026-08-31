# Supplied OpenAPI contract reference

OpenAPI version: `3.1.0`  
API title: `Okatana External API`  
API document version: `1.0.0`  
Declared server path: `/api/v1`

This page is generated from `resources/openapi.yaml`. It does not add request fields that are absent from that file.

## GET `/organizations/{organization}`

**Read organization**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `organization` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Organization |
| `401` | Invalid credential |
| `403` | Wrong organization or scope |

## GET `/organizations/{organization}/projects`

**List projects**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `organization` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Project list |

## POST `/organizations/{organization}/projects`

**Create project**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `organization` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `name` | yes | `string` | maxLength=180 |
| `key` | yes | `string` | maxLength=12 |
| `description` | no | `string / null` | maxLength=5000 |

### Responses

| Status | Description |
| --- | --- |
| `201` | Project created |
| `422` | Validation failure |

## GET `/projects/{project}`

**Read project**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Project |

## PATCH `/projects/{project}`

**Update project**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `name` | no | `string` | maxLength=180 |
| `description` | no | `string / null` | maxLength=5000 |
| `archived` | no | `boolean` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Updated project |
| `422` | Validation failure |

## DELETE `/projects/{project}`

**Soft-delete project**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `204` | Deleted |

## GET `/projects/{project}/members`

**List project members**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Member list |

## GET `/projects/{project}/labels`

**List project labels**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Label list |

## GET `/projects/{project}/boards`

**List project boards**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Board list |

## POST `/projects/{project}/boards`

**Create project board**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `name` | yes | `string` | maxLength=120 |
| `color` | no | `string / null` | maxLength=32 |
| `wip_limit` | no | `integer / null` | minimum=1 |
| `is_done` | no | `boolean` |  |

### Responses

| Status | Description |
| --- | --- |
| `201` | Board created |
| `422` | Validation failure |

## PUT `/projects/{project}/boards/reorder`

**Reorder project boards**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `board_ids` | yes | `array` | items=string |

### Responses

| Status | Description |
| --- | --- |
| `200` | Reordered board list |
| `422` | Invalid board list |

## PATCH `/boards/{board}`

**Update board**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `board` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `name` | no | `string` | maxLength=120 |
| `color` | no | `string / null` | maxLength=32 |
| `wip_limit` | no | `integer / null` | minimum=1 |
| `is_done` | no | `boolean` |  |
| `is_hidden` | no | `boolean` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Updated board |

## DELETE `/boards/{board}`

**Soft-delete board**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `board` | path | yes | `string` |  |

### JSON request body

Request body required: **no**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `move_to_board_id` | no | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `204` | Deleted |
| `422` | Invalid target or WIP limit exceeded |

## GET `/projects/{project}/tickets`

**List project tickets**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |
| `board_id` | query | no | `string` |  |
| `q` | query | no | `string` |  |
| `per_page` | query | no | `integer` | minimum=1; maximum=200; default=50 |

### Responses

| Status | Description |
| --- | --- |
| `200` | Paginated ticket list |

## POST `/projects/{project}/tickets`

**Create ticket**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `board_id` | no | `string` |  |
| `board_slug` | no | `string` |  |
| `title` | yes | `string` | maxLength=500 |
| `description_html` | no | `string / null` | maxLength=200000 |
| `priority` | no | `string` | enum=lowest, low, normal, high, highest, critical |
| `due_at` | no | `string / null` | format=date-time |
| `assignee_ids` | no | `array` | items=string |
| `label_ids` | no | `array` | items=string |

### Responses

| Status | Description |
| --- | --- |
| `201` | Ticket created |
| `422` | Validation |

## PUT `/projects/{project}/tickets/reorder`

**Reorder tickets inside a board**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `board_id` | yes | `string` |  |
| `ticket_ids` | yes | `array` | items=string |

### Responses

| Status | Description |
| --- | --- |
| `204` | Reordered |
| `422` | Invalid ticket list |

## GET `/projects/{project}/analytics`

**Read project analytics**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Project analytics |

## GET `/tickets/{ticket}`

**Read ticket**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `ticket` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Ticket detail |

## PATCH `/tickets/{ticket}`

**Update ticket**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `ticket` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `title` | no | `string` | maxLength=500 |
| `description_html` | no | `string / null` | maxLength=200000 |
| `priority` | no | `string` | enum=lowest, low, normal, high, highest, critical |
| `due_at` | no | `string / null` | format=date-time |
| `assignee_ids` | no | `array` | items=string |
| `label_ids` | no | `array` | items=string |
| `archived` | no | `boolean` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Updated ticket |

## DELETE `/tickets/{ticket}`

**Soft-delete ticket**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `ticket` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `204` | Deleted |

## POST `/tickets/{ticket}/move`

**Move a ticket to another board**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `ticket` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `board_id` | yes | `string` |  |
| `position` | no | `integer` | minimum=0 |

### Responses

| Status | Description |
| --- | --- |
| `200` | Moved ticket |
| `422` | Invalid board or WIP limit reached |

## POST `/tickets/{ticket}/comments`

**Create ticket comment**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `ticket` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `body_html` | yes | `string` | maxLength=200000 |

### Responses

| Status | Description |
| --- | --- |
| `201` | Comment created |

## GET `/organizations/{organization}/documents`

**List organization documents**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `organization` | path | yes | `string` |  |
| `project_id` | query | no | `string` |  |
| `status` | query | no | `string` | enum=draft, published |
| `q` | query | no | `string` |  |
| `tags` | query | no | `string` | Comma-separated tag names. Multiple names use match-all filtering. |
| `per_page` | query | no | `integer` | minimum=1; maximum=200; default=50 |

### Responses

| Status | Description |
| --- | --- |
| `200` | Paginated document list |

## POST `/organizations/{organization}/documents`

**Create document**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `organization` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `project_id` | no | `string / null` |  |
| `title` | yes | `string` | maxLength=500 |
| `caption` | no | `string / null` | maxLength=2000 |
| `content_html` | no | `string / null` | maxLength=1000000 |
| `status` | no | `string` | default=draft; enum=draft, published |
| `editor_ids` | no | `array` | maxItems=100; items=string |
| `tag_names` | no | `array` | maxItems=20; items=string; item.maxLength=50 |

### Responses

| Status | Description |
| --- | --- |
| `201` | Document created |
| `422` | Validation failure |

## GET `/documents/{document}`

**Read document**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `document` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Document detail |

## PATCH `/documents/{document}`

**Update document**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `document` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `project_id` | no | `string / null` |  |
| `title` | no | `string` | maxLength=500 |
| `caption` | no | `string / null` | maxLength=2000 |
| `content_html` | no | `string / null` | maxLength=1000000 |
| `status` | no | `string` | enum=draft, published |
| `archived` | no | `boolean` |  |
| `editor_ids` | no | `array` | maxItems=100; items=string |
| `tag_names` | no | `array` | maxItems=20; items=string; item.maxLength=50 |

### Responses

| Status | Description |
| --- | --- |
| `200` | Document updated |
| `422` | Validation failure |

## DELETE `/documents/{document}`

**Soft-delete document**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `document` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `204` | Document soft-deleted |

## POST `/documents/{document}/comments`

**Create document comment**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `document` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `body_html` | yes | `string` | maxLength=200000 |

### Responses

| Status | Description |
| --- | --- |
| `201` | Comment created |
| `422` | Validation failure |

## POST `/organizations/{organization}/notifications`

**Send organization notifications**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `organization` | path | yes | `string` |  |

### JSON request body

Request body required: **yes**

| Field | Required | Type | Constraints |
| --- | --- | --- | --- |
| `user_ids` | yes | `array` | minItems=1; maxItems=100; items=string |
| `title` | yes | `string` | maxLength=180 |
| `body` | yes | `string` | maxLength=2000 |
| `url` | no | `string / null` | Internal /app path only |

### Responses

| Status | Description |
| --- | --- |
| `201` | Notifications queued/sent |
| `422` | Invalid recipient or URL |

## GET `/projects/{project}/tags`

**List used project tags**

### Parameters

| Name | In | Required | Type | Constraints / description |
| --- | --- | --- | --- | --- |
| `project` | path | yes | `string` |  |

### Responses

| Status | Description |
| --- | --- |
| `200` | Used project tags with ticket counts |


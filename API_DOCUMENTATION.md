# ResuMake API Documentation

## Base URL
All endpoints are relative to the application base URL.

---

## Authentication APIs

### Send OTP
**POST** `/api/auth/send-otp`

Sends a one-time password to the user's email for authentication.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully"
}
```

---

### Verify OTP
**POST** `/api/auth/verify-otp`

Verifies the OTP and creates a session. For new users, also creates an account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "name": "John Doe",      // Required for new users
  "phone": "+1234567890"   // Optional
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "user"
  },
  "isNewUser": true
}
```

---

### Get Current User
**GET** `/api/auth/me`

Returns the currently authenticated user.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "user"
  }
}
```

---

### Logout
**POST** `/api/auth/logout`

Ends the current user session.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Resume APIs

### Get All Resumes
**GET** `/api/resumes`

Returns all resumes for the authenticated user.

**Response:**
```json
{
  "resumes": [
    {
      "id": "uuid",
      "title": "My Resume",
      "templateId": "modern-blue",
      "data": "{ ... }",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Single Resume
**GET** `/api/resumes/:id`

Returns a specific resume by ID.

**Response:**
```json
{
  "resume": {
    "id": "uuid",
    "title": "My Resume",
    "templateId": "modern-blue",
    "data": "{ ... }",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Create Resume
**POST** `/api/resumes`

Creates a new resume.

**Request Body:**
```json
{
  "title": "My Resume",
  "templateId": "modern-blue",
  "data": "{ ... }"
}
```

**Response:**
```json
{
  "resume": {
    "id": "uuid",
    "title": "My Resume",
    "templateId": "modern-blue",
    "data": "{ ... }",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Resume
**PUT** `/api/resumes/:id`

Updates an existing resume.

**Request Body:**
```json
{
  "title": "Updated Resume",
  "templateId": "classic-green",
  "data": "{ ... }"
}
```

**Response:**
```json
{
  "resume": {
    "id": "uuid",
    "title": "Updated Resume",
    "templateId": "classic-green",
    "data": "{ ... }",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### Delete Resume
**DELETE** `/api/resumes/:id`

Deletes a resume.

**Response:**
```json
{
  "message": "Resume deleted successfully"
}
```

---

## Subscription APIs

### Get Available Plans
**GET** `/api/plans`

Returns all active subscription plans.

**Response:**
```json
{
  "plans": [
    {
      "id": "uuid",
      "name": "Basic",
      "price": 0,
      "downloadLimit": 1,
      "validityDays": 0,
      "hasWatermark": true,
      "watermarkText": "Mymegaminds",
      "allowWordExport": false,
      "isDefault": true
    },
    {
      "id": "uuid",
      "name": "Premium",
      "price": 100,
      "downloadLimit": 10,
      "validityDays": 30,
      "hasWatermark": false,
      "watermarkText": null,
      "allowWordExport": true,
      "isDefault": false
    }
  ]
}
```

---

### Get Current Subscription
**GET** `/api/subscription`

Returns the current user's subscription status.

**Response (with active subscription):**
```json
{
  "hasSubscription": true,
  "subscription": {
    "id": "uuid",
    "planName": "Premium",
    "planPrice": 100,
    "downloadsRemaining": 8,
    "downloadsUsed": 2,
    "downloadLimit": 10,
    "hasWatermark": false,
    "allowWordExport": true,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T00:00:00.000Z"
  }
}
```

**Response (without subscription):**
```json
{
  "hasSubscription": false,
  "defaultPlan": {
    "id": "uuid",
    "name": "Basic",
    "downloadLimit": 1,
    "hasWatermark": true,
    "allowWordExport": false
  }
}
```

---

### Check Download Permission
**GET** `/api/subscription/can-download`

Checks if the user can download a resume.

**Query Parameters:**
- `format`: "pdf" or "docx"

**Response:**
```json
{
  "canDownload": true,
  "hasWatermark": false,
  "watermarkText": null,
  "downloadsRemaining": 8,
  "subscriptionId": "uuid"
}
```

---

### Record Download
**POST** `/api/subscription/download`

Records a download and decrements the remaining count.

**Request Body:**
```json
{
  "format": "pdf"
}
```

**Response:**
```json
{
  "success": true,
  "downloadsRemaining": 7,
  "hasWatermark": false
}
```

---

## Admin APIs

### Get All Users (Admin)
**GET** `/api/admin/users`

Returns all users (admin only).

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Update User Role (Super Admin)
**PUT** `/api/admin/users/:id/role`

Updates a user's role (super admin only).

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response:**
```json
{
  "message": "User role updated",
  "user": { ... }
}
```

---

### Delete User (Super Admin)
**DELETE** `/api/admin/users/:id`

Deletes a user (super admin only).

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

### Get All Plans (Admin)
**GET** `/api/admin/plans`

Returns all subscription plans including inactive ones (admin only).

**Response:**
```json
{
  "plans": [ ... ]
}
```

---

### Create Plan (Super Admin)
**POST** `/api/admin/plans`

Creates a new subscription plan (super admin only).

**Request Body:**
```json
{
  "name": "Pro",
  "price": 200,
  "downloadLimit": 50,
  "validityDays": 90,
  "hasWatermark": false,
  "watermarkText": null,
  "allowWordExport": true,
  "isDefault": false,
  "isActive": true
}
```

**Response:**
```json
{
  "plan": { ... }
}
```

---

### Update Plan (Super Admin)
**PUT** `/api/admin/plans/:id`

Updates a subscription plan (super admin only).

**Request Body:**
```json
{
  "name": "Pro Updated",
  "price": 250,
  ...
}
```

**Response:**
```json
{
  "plan": { ... }
}
```

---

### Delete Plan (Super Admin)
**DELETE** `/api/admin/plans/:id`

Deletes a subscription plan (super admin only).

**Response:**
```json
{
  "message": "Plan deleted successfully"
}
```

---

### Get All Subscriptions (Admin)
**GET** `/api/admin/subscriptions`

Returns all user subscriptions (admin only).

**Response:**
```json
{
  "subscriptions": [
    {
      "id": "uuid",
      "userName": "John Doe",
      "userEmail": "user@example.com",
      "planName": "Premium",
      "downloadsRemaining": 8,
      "downloadsUsed": 2,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T00:00:00.000Z",
      "isActive": true
    }
  ]
}
```

---

### Activate Subscription (Super Admin)
**POST** `/api/admin/subscriptions/activate`

Manually activates a subscription for a user (super admin only).

**Request Body:**
```json
{
  "userId": "uuid",
  "planId": "uuid"
}
```

**Response:**
```json
{
  "subscription": { ... }
}
```

---

### Deactivate Subscription (Super Admin)
**POST** `/api/admin/subscriptions/:id/deactivate`

Deactivates a user's subscription (super admin only).

**Response:**
```json
{
  "message": "Subscription deactivated"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "error": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied" | "Admin access required" | "Super admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

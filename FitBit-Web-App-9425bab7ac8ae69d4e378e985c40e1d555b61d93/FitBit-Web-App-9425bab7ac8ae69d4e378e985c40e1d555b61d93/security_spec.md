# Security Specification - FitBit Gym Membership Management

## Data Invariants
1. A **Membership** record must always link to a valid User ID.
2. Only **Admins** can manually change a membership status to 'active' or 'expired'.
3. **Members** can only create appointments for themselves.
4. **Payments** must always match the authenticated user.
5. **Users** cannot change their own `role` or `createdAt` fields once initialized.
6. **Trainers** can only be managed by admins.

## The "Dirty Dozen" Payloads

### 1. Privilege Escalation (User Role)
Attempt to register as an admin directly.
```json
{
  "userId": "attacker-uid",
  "fullName": "Bad Actor",
  "email": "attacker@example.com",
  "role": "admin",
  "createdAt": "server_timestamp"
}
```
**Expected:** PERMISSION_DENIED (User cannot set own role to admin on create).

### 2. Identity Spoofing (Membership)
Attempt to create a membership for another user.
```json
{
  "userId": "victim-uid",
  "planType": "annual",
  "status": "active",
  "updatedAt": "server_timestamp"
}
```
**Expected:** PERMISSION_DENIED (userId must match request.auth.uid).

### 3. Ghost Field Injection (User Update)
Attempt to add a hidden field to a user profile.
```json
{
  "userId": "my-uid",
  "fullName": "Updated Name",
  "email": "my@email.com",
  "role": "member",
  "createdAt": "old_timestamp",
  "isVerified": true
}
```
**Expected:** PERMISSION_DENIED (affectedKeys().hasOnly() or strict schema check prevents 'isVerified').

### 4. Illegal State Transition (Membership Status)
Attempt to activate own membership without payment.
```json
{
  "status": "active"
}
```
**Expected:** PERMISSION_DENIED (Members cannot set status to 'active').

### 5. ID Poisoning (Trainer)
Attempt to create a trainer with an excessively long or malicious ID.
```path
/trainers/very-long-id-poison-poison-poison...
```
**Expected:** PERMISSION_DENIED (isValidId() size check).

### 6. Relational Sync Break (Appointment)
Book a session for a non-existent trainer.
```json
{
  "memberId": "my-uid",
  "trainerId": "fake-trainer-id",
  "date": "2026-06-01",
  "time": "10:00",
  "status": "scheduled"
}
```
**Expected:** PERMISSION_DENIED (exists() check on trainerId).

### 7. Denial of Wallet (Long Bio)
Inject a 10MB string into the trainer bio.
**Expected:** PERMISSION_DENIED (string.size() <= 2000).

### 8. Orphaned Payment
Create a payment record with a fake timestamp.
```json
{
  "userId": "my-uid",
  "amount": 99.99,
  "planType": "annual",
  "paymentDate": "2020-01-01",
  "status": "success"
}
```
**Expected:** PERMISSION_DENIED (paymentDate must be request.time).

### 9. Query Scraping (Users List)
Attempt to list all users as a regular member.
**Expected:** PERMISSION_DENIED (list only allowed for Admin).

### 10. Admin Spoofing (Email)
Log in with an email matching the admin but `email_verified` is false.
**Expected:** PERMISSION_DENIED (Check request.auth.token.email_verified == true).

### 11. Immortal Field Modification
Attempt to change `createdAt` on an existing user profile.
**Expected:** PERMISSION_DENIED (incoming().createdAt == existing().createdAt).

### 12. PII Leakage (Get Member Profile)
Attempt to 'get' another member's profile directly.
**Expected:** PERMISSION_DENIED (Only allow get for owner or admin).

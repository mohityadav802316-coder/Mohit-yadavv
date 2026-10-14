# Security Specification: Cyberpunk Portfolio & Message Vault

## 1. Data Invariants
1. **Public Creation Invariant**: Any visitor can submit a contact message (`/messages/{id}`), but the incoming payload MUST strictly satisfy string length bounds (`name`: 2-100 chars, `message`: 2-2000 chars, `email`: <=150 chars if present), must initialize `read: false`, and must set `createdAt: request.time`.
2. **Visitor Read Isolation (Zero PII Leak)**: Regular visitors, unauthenticated users, or non-admin authenticated users are STRICTLY FORBIDDEN from reading (`get` or `list`), updating, or deleting documents in `/messages`.
3. **Admin Privilege Verification**: Administrative operations (`list` messages, `read` messages, update message status to read/archived, `delete` message, access `/admins/{id}`) require verified authentication and bootstrap matching (`yadavshiv16478@gmail.com`, `mohityadav802316@gmail.com`, or existence in `/admins/{uid}`).
4. **Anti-Ghost Field Guard**: Incoming payloads must only contain schema-declared keys (`name`, `email`, `message`, `createdAt`, `read`, `archived`, `source`). Any injection of undeclared fields is immediately rejected.
5. **ID Poisoning Protection**: All path variables must pass `isValidId()` (size <= 128 and alphanumeric/hyphen/underscore).

## 2. The "Dirty Dozen" Threat Payloads
1. **Ghost Field Injection**: Message create with extra property `isAdmin: true` -> Denied.
2. **Name Spoof Overflow**: Message create with `name` exceeding 100 characters -> Denied.
3. **Empty Message Attack**: Message create with empty string `""` for message -> Denied.
4. **Oversized Message DOS**: Message create with message payload > 2000 characters -> Denied.
5. **Premature Read Flag**: Message create with `read: true` to falsify status -> Denied.
6. **Forged Timestamp**: Message create with client timestamp instead of `request.time` -> Denied.
7. **Public Message Scraping**: Unauthenticated or non-admin query `db.collection('messages').get()` -> Denied.
8. **Malicious Single Message Sniffing**: Non-admin user attempts `getDoc(doc(db, 'messages', 'xyz'))` -> Denied.
9. **Visitor Update Tampering**: Non-admin attempts to update a message -> Denied.
10. **Unauthorized Deletion**: Non-admin attempts `deleteDoc(doc(db, 'messages', 'xyz'))` -> Denied.
11. **Admin Escalation Injection**: Non-admin attempts to write a document into `/admins/{their_uid}` -> Denied.
12. **Malformed Document ID Attack**: Document ID injection with invalid characters `../../etc/passwd` -> Denied.

## 3. Test Runner Design
All tests assert `PERMISSION_DENIED` on invalid payloads or unauthorized accesses, ensuring robust Zero-Trust enforcement.

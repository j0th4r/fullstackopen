### 0.6: New note in Single page app diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server

    User->>Browser: Types text in form field
    User->>Browser: Clicks Save button
    
    Note over Browser: JavaScript prevents default form submission<br/>and handles the event

    Browser->>Server: POST /exampleapp/new_note_spa (JSON data)
    activate Server
    Note over Server: Process JSON data<br/>Save new note to data store
    Server-->>Browser: HTTP 201 Created (JSON response)
    deactivate Server

    Note over Browser: JavaScript receives success response<br/>Updates local data array<br/>Re-renders notes list without page reload

    Note over Browser: Form field is cleared<br/>New note appears in the list immediately
```
### 0.4: New note diagram


```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server

    User->>Browser: Types text in form field
    User->>Browser: Clicks Save button
    
    Browser->>Server: POST /exampleapp/new_note (form data)
    activate Server
    Note over Server: Process form data<br/>Save new note to data store
    Server-->>Browser: HTTP 302 Redirect to /notes
    deactivate Server

    Note over Browser: Automatically follows redirect

    Browser->>Server: GET /exampleapp/notes
    activate Server
    Server-->>Browser: HTML document
    deactivate Server

    Browser->>Server: GET /exampleapp/main.css
    activate Server
    Server-->>Browser: CSS file
    deactivate Server

    Browser->>Server: GET /exampleapp/main.js
    activate Server
    Server-->>Browser: JavaScript file
    deactivate Server

    Note over Browser: Execute JavaScript code<br/>that fetches JSON data

    Browser->>Server: GET /exampleapp/data.json
    activate Server
    Server-->>Browser: JSON array with all notes<br/>(including the new one)
    deactivate Server

    Note over Browser: Execute callback function<br/>Render updated notes list
```

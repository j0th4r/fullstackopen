# Full Stack Open — Part 6 (online)

Summary
- Part 6 moves application state and logic out of individual React components into dedicated state management layers. The focus is on predictable, testable and maintainable state handling for larger apps using Flux-style architectures and tools that simplify server-state management.

Part updated 12th October 2025
- Node updated to 22.18.0
- Jest replaced with Vitest
- Axios replaced with the Fetch API

Objectives
- Introduce state-management patterns suitable for medium → large React applications.
- Learn Flux concepts and the Redux approach for single-source-of-truth state.
- Explore lightweight alternatives (React context + useReducer) and server-state libraries (React Query).
- Apply best practices for testing, performance, and communicating with backend services.

Typical topics covered
- Flux architecture and Redux fundamentals (actions, reducers, store)
- Splitting state: many reducers and reducer composition
- Communicating with the server in a Redux application (side effects, middleware, async flows)
- React Query for server state and cache management
- Using useReducer together with React context as a lightweight local/global state solution
- Testing strategies (unit tests, integration tests), migration to Vitest
- Tooling and deployment considerations for production apps

Course sections
a. Flux architecture and Redux — concepts and hands-on examples  
b. Many reducers — structuring and composing reducers for larger apps  
c. Communicating with the server in a Redux application — async flows, middleware, and side effects  
d. React Query, useReducer and Context — when to use each approach and how they interact

References
- Follow the official Full Stack Open syllabus and exercises for exact chapter assignments and example projects.
- Recommended reading: Redux docs, React Query docs, and React context/useReducer guides for practical patterns and recipes.

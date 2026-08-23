# AlanWilliams Platform

Shared platform services and user experience for the AlanWilliams Apps ecosystem.

## Purpose

`alanwilliams-platform` provides the cross-application foundation used by Agenda, Budget, Chores, and future AlanWilliams Apps.

The platform is responsible for shared concerns such as:

- canonical AlanWilliams `Person` identity
- Clerk account-to-Person linking
- global account/profile information
- identity reconciliation and person merging
- the `alanwilliams.app` landing page and authenticated app launcher
- cross-app contracts and platform conventions

Clerk remains the authentication provider. The platform does not store passwords or implement its own credential system.

## Ecosystem

```text
alanwilliams.app         -> Platform / app launcher
agenda.alanwilliams.app  -> Agenda
budget.alanwilliams.app  -> Budget
chores.alanwilliams.app  -> Chores
```

Each app remains independently deployable and owns its domain data, permissions, memberships, and app-specific settings.

```text
Clerk
  |
  v
Platform Person
  |
  +-- Agenda data / memberships
  +-- Budget data / memberships
  +-- Chores data / memberships
```

A person has one canonical platform identity even when participating in multiple apps.

## Planned Repository Structure

```text
alanwilliams-platform/
├── backend/      # Java / Spring Boot platform API
├── frontend/     # React / TypeScript / Vite launcher/account UI
├── ALANWILLIAMS_PLATFORM_OVERVIEW.md
├── ALANWILLIAMS_PLATFORM_ARCHITECTURE.md
└── README.md
```

## Technology Direction

### Backend

- Java 21
- Spring Boot 4.1
- PostgreSQL 17
- Flyway
- Docker
- Clerk JWT authentication through the shared AlanWilliams Spring Security library

### Frontend

- React
- TypeScript
- Vite
- responsive web first
- shared AlanWilliams UI conventions

## Databases

The platform will own separate test and production databases:

```text
platform_test
platform_prod
```

App-specific domain data remains in app-specific databases such as `agenda_prod` and `budget_prod`.

## Authentication and Identity

Authentication and identity are intentionally separate:

```text
Clerk user
    |
    | authenticated identity
    v
Platform Person
    |
    | canonical AlanWilliams identity
    v
App-specific memberships and permissions
```

Clerk owns sign-in, sessions, recovery, and authentication security. The Platform owns the canonical Person record. Individual applications own authorization within their domains.

There is no globally searchable AlanWilliams user directory. Cross-app identity matching and invitation reconciliation must preserve account-enumeration privacy.

## Deployment Direction

The Platform backend is a separately deployable Docker image/container. This preserves a clean service boundary without requiring every shared concern to become a microservice.

```text
alanwilliams-platform-backend
alanwilliams-platform-frontend
```

The backend should not become an authentication gateway for every application request. Agenda, Budget, and other APIs validate Clerk JWTs locally using shared security code.

## Related Repositories

```text
alanwilliams-platform         Shared identity/account and launcher
alanwilliams-agenda           Meeting workflow application
alanwilliams-budget           Budget application
alanwilliams-chores           Chores application
alanwilliams-spring-security  Reusable Clerk/Spring Security integration
```

## Documentation

See:

- `ALANWILLIAMS_PLATFORM_OVERVIEW.md` for current status, roadmap, and major decisions.
- `ALANWILLIAMS_PLATFORM_ARCHITECTURE.md` for cross-repo contracts, identity ownership, service boundaries, infrastructure conventions, and architecture decisions.

Platform documentation defines cross-repository contracts. Detailed application-domain architecture belongs in the relevant application repository.

## Current Priority

The immediate platform work follows standardization of the existing Agenda repository and deployment naming. The next implementation phase is the shared Clerk/Spring Security foundation followed by the Platform Person/account service.

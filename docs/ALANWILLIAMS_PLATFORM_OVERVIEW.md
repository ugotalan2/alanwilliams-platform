# AlanWilliams Platform - Project Overview

## Purpose

`alanwilliams-platform` is the shared platform for the AlanWilliams Apps ecosystem.

It owns the cross-application account experience and canonical platform identity used by connected apps such as Agenda, Budget, Chores, Goals, and Fitness.

The platform is not intended to contain the detailed domain logic of each application. Each app remains independently deployable and owns its own domain data, settings, permissions, and workflows.

## Domain

Primary platform domain:

```text
alanwilliams.app
```

Application domains:

```text
agenda.alanwilliams.app  -> Agenda
budget.alanwilliams.app  -> Budget
chores.alanwilliams.app  -> Chores
goals.alanwilliams.app   -> Goals (planned)
fitness.alanwilliams.app -> Fitness (possible/planned)
```

Shared API convention:

```text
Production: api.alanwilliams.app/<service>/...
Test:       api-test.alanwilliams.app/<service>/...
```

Examples:

```text
/api routing concept
/agenda/...
/platform/...
/budget/...
```

## Platform Vision

AlanWilliams Apps should feel like one connected product family even though individual apps are independently deployable and may use separate databases.

The target experience is:

```text
one Clerk login
-> one canonical AlanWilliams Person
-> multiple connected apps
-> app-specific memberships, permissions, settings, and data
```

The platform landing page will initially provide sign-in/account functionality and route users to available apps. As more apps launch, it becomes the authenticated app launcher.

## Canonical Person Direction

`Person` is a platform-owned identity shared across all AlanWilliams Apps.

A person represents the same human everywhere:

```text
Clerk user
   |
   v
Platform Person
   |-- Agenda relationships
   |-- Budget relationships
   |-- Chores relationships
   `-- future app relationships
```

Core rules:

- Clerk owns authentication and login credentials.
- The Platform owns the canonical AlanWilliams `Person` identity.
- A person can exist before they create a Clerk account.
- Clerk user ID becomes the durable authentication link after verified account linking.
- Email may help discover or claim an existing person, but email alone is not the durable identity key.
- Person merge/reconciliation is a platform concern because duplicate identity can affect multiple apps.
- There is no globally searchable public AlanWilliams user directory.

## Shared vs App-Specific Ownership

Platform-owned concerns:

- canonical Person
- Clerk user-to-Person linkage
- global account/profile information
- identity reconciliation and merge state
- app launcher/account experience
- cross-app identity contracts
- shared platform-level preferences when they are genuinely global

App-owned concerns:

- memberships
- domain roles and permissions
- domain-specific preferences
- app workflows
- app data
- app-specific authorization

For example, Agenda owns organization/meeting permissions and Budget will own budget/workspace permissions.

## Repository Convention

Connected repositories use the `alanwilliams-` prefix.

Current/planned naming:

```text
alanwilliams-platform
alanwilliams-agenda
alanwilliams-budget
alanwilliams-chores
alanwilliams-spring-security
```

Repo names represent a deployable product or a clearly reusable platform component.

## Documentation Convention

The ChatGPT Project may contain documents from multiple repositories. Markdown filenames are therefore unique across the ecosystem rather than relying on repeated names such as `ARCHITECTURE.md`.

Platform documents:

```text
ALANWILLIAMS_PLATFORM_OVERVIEW.md
ALANWILLIAMS_PLATFORM_ARCHITECTURE.md
```

Repo-specific documents use the same pattern, for example:

```text
ALANWILLIAMS_AGENDA_OVERVIEW.md
ALANWILLIAMS_AGENDA_ARCHITECTURE.md
ALANWILLIAMS_SPRING_SECURITY_OVERVIEW.md
ALANWILLIAMS_SPRING_SECURITY_ARCHITECTURE.md
```

Documentation ownership rule:

> Platform docs define cross-repo contracts. Repo docs define the internals of that repo.

Detailed app-domain documentation should not be duplicated into the Platform architecture.

## Current Infrastructure

The current deployed application infrastructure is self-hosted.

Physical host:

- Windows/Plex PC at `10.0.0.100`
- Intel i5-12600K, 32 GB RAM, RX 6700 XT 12 GB, ~12 TB storage
- Physical backup location: `D:\ServerBackups`

Ubuntu VM:

- Ubuntu 26.04 LTS
- VirtualBox
- reserved LAN IP `10.0.0.27`
- Docker Engine
- America/Chicago timezone

Shared infrastructure includes:

- PostgreSQL 17 in Docker
- Cloudflare DNS and Tunnel
- Docker networks
- GitHub Actions deployment
- physical-disk backups plus Google Drive off-site copies

The current infrastructure was proven through Ubuntu VM reboot and full physical Windows-host reboot recovery.

## Authentication Direction

Clerk is the shared identity and SSO provider.

AlanWilliams Apps will not store passwords, password hashes, recovery credentials, or implement its own authorization server.

Each Java backend validates Clerk JWTs locally. Reusable Spring Security integration belongs in `alanwilliams-spring-security`.

The Platform backend then resolves authenticated Clerk identity to canonical Platform Person when needed.

## Database Direction

Introduce dedicated platform databases:

```text
platform_prod
platform_test
```

App databases remain separate:

```text
agenda_prod
agenda_test
budget_prod
budget_test
chores_prod
chores_test
```

Cross-database person references are platform Person IDs by application contract rather than PostgreSQL foreign keys across separate databases.

## Shared UI / Branding

One responsive design language should connect the apps while allowing app-specific accent identity.

```text
Blue A   -> Agenda
Green B  -> Budget
Amber C  -> Chores
Orange G -> Goals
Red F    -> Fitness
Purple   -> Platform / Account / Auth
```

General header direction:

```text
[A] Agenda v                         [Profile] v
```

The app identity opens the app switcher. Profile/account remains separate.

Appearance direction:

```text
System (default)
Light
Dark
```

Shared UI should use semantic design tokens rather than hard-coded surface/text colors.

## Current Status

Agenda is currently the production application and is running successfully in test and production on the self-hosted server.

Platform identity has now been defined architecturally but has not yet been implemented as its own repo/backend/database.

## Near-Term Sequence

1. Standardize existing Agenda repository, package, Docker, network, deployment, and server naming to the new `alanwilliams-*` convention.
2. Create `alanwilliams-platform`.
3. Create `alanwilliams-spring-security`.
4. Implement Clerk shared authentication/JWT validation.
5. Implement Platform canonical Person/account linkage.
6. Integrate Agenda with Platform identity.
7. Continue Agenda domain/schema migration.
8. Bring Budget into the same platform/auth/identity model.

## Explicitly Deferred

- Full microservice decomposition merely for scale speculation
- Dedicated auth database/service separate from Clerk and Platform identity
- Global public user directory
- Native iOS/Android apps
- Automated SMS delivery
- Full Handbook mirroring/catalog synchronization


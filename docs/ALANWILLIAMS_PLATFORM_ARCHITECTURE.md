# AlanWilliams Platform - Architecture

## Scope

This document is the source of truth for cross-repository architecture and integration contracts across AlanWilliams Apps.

Detailed Agenda domain architecture belongs in `ALANWILLIAMS_AGENDA_ARCHITECTURE.md`. Reusable Spring/Clerk implementation details belong in `ALANWILLIAMS_SPRING_SECURITY_ARCHITECTURE.md`.

## Architecture Principles

- Keep apps independently deployable while sharing platform conventions, identity, authentication, UI patterns, and API routing.
- Use Clerk for authentication/SSO; do not build or store password credentials.
- Maintain one canonical Platform Person across all connected apps.
- Keep app-specific authorization and domain data within each app.
- Prefer separately deployable components without prematurely decomposing the system into many microservices.
- Validate Clerk JWTs locally in each Java backend rather than routing every request through a central auth service.
- Preserve historical identity and relationships rather than rewriting people when roles/memberships change.
- Prevent account enumeration and cross-app privacy leaks.
- Use stable cross-repo contracts and avoid duplicating detailed domain documentation between repositories.
- - Keep shared infrastructure independently operable when it has a lifecycle distinct from an application.

## Technology Baseline

AlanWilliams Apps should start new work on the newest stable, supported
baseline that favors long support life over short-lived non-LTS
releases. Exact patch versions remain locked in each repository's
`package-lock.json`, Maven wrapper, and `pom.xml`; this document defines
the shared major/minor compatibility baseline.

### Frontend

-   React `19.2.x`
-   React Router `7.x`
-   TypeScript `6.0.x`
-   Vite `8.2.x`
-   Bootstrap `5.3.x`
-   Font Awesome `7.3.x`
-   React Font Awesome `3.x`
-   Vitest `4.x`
-   Node.js `24.x LTS`
-   npm `11.x`

Node policy:

-   Prefer the newest active LTS Node line for deployed builds and the
    shared baseline.
-   Do not standardize production/deployment builds on a Node `Current`
    release solely because it is newer.
-   Re-evaluate Node `26.x` after it enters LTS rather than requiring an
    interim migration now.

### Java Backend

-   Java `25 LTS`
-   Spring Boot `4.1.x`
-   Maven `3.9.x`

Java policy:

-   New services target the newest LTS Java version supported by the
    selected stable Spring Boot line.
-   Java `25` is the current Platform baseline.
-   Keep JDK patch/security releases current within the Java 25 LTS
    line.
-   Do not move the shared baseline to a non-LTS Java release solely
    because it is newer.

### Data / Infrastructure

-   PostgreSQL `17`
-   Docker Engine
-   Docker Compose
-   Cloudflare DNS + Tunnel

### Versioning Policy

-   New repositories start from this Platform baseline unless an
    explicit compatibility reason is documented.
-   Existing repositories converge to the baseline during planned
    maintenance.
-   Major/minor framework changes are deliberate Platform decisions and
    are recorded here.
-   Patch and security updates within the approved baseline are routine
    maintenance and do not require an architecture decision.
-   A repo-specific architecture document records any intentional
    deviation from the Platform baseline.

## Naming Conventions

AlanWilliams Apps uses consistent naming across repositories,
packages, deployments, containers, networks, databases, and server
directories.

| Resource                   | Convention                | Agenda Example                 |
|----------------------------|---------------------------|--------------------------------|
| GitHub repository          | `alanwilliams-<app>`      | `alanwilliams-agenda`          |
| Java package               | `com.alanwilliams.<app>`  | `com.alanwilliams.agenda`      |
| Maven artifact             | `<app>`                   | `agenda`                       |
| API route prefix           | `/<app>`                  | `/agenda`                      |
| Production database        | `<app>_prod`              | `agenda_prod`                  |
| Test database              | `<app>_test`              | `agenda_test`                  |
| Server directory           | `/opt/alanwilliams/<app>` | `/opt/alanwilliams/agenda`     |
| Production Compose project | `alanwilliams-<app>-prod` | `alanwilliams-agenda-prod`     |
| Test Compose project       | `alanwilliams-<app>-test` | `alanwilliams-agenda-test`     |
| Web network                | `<compose-project>-web`   | `alanwilliams-agenda-prod-web` |
| Shared backend network     | `alanwilliams-backend`    | `alanwilliams-backend`         |

## Repository Boundaries

### `alanwilliams-platform`

Owns:

- canonical Person
- Clerk user-to-Person linkage
- global profile/account data
- global appearance preference
- notification/contact email
- identity reconciliation and merge
- platform/account API
- `alanwilliams.app` launcher/account frontend
- cross-app identity/application metadata as needed

### `alanwilliams-agenda`

Owns:

- Agenda organizations and memberships
- Agenda contextual display names
- meeting types and meetings
- questions, assignments, reminders, training/documents
- Agenda-specific permissions and settings
- Agenda frontend/backend deployment
- Agenda database and Flyway migrations

### `alanwilliams-budget`

Will own:

- budget/workspace data
- household memberships and contextual display names where applicable
- Budget authorization/settings
- Budget database/migrations/deployment

### `alanwilliams-database`

Owns the shared PostgreSQL runtime and database operations used by AlanWilliams Apps.

Owns:

- PostgreSQL 17 container lifecycle
- persistent PostgreSQL storage
- shared `alanwilliams-backend` Docker network
- database creation/listing tooling
- logical backup/restore tooling
- PostgreSQL runtime/version maintenance

Does not own:

- application schemas
- Flyway migrations
- app-specific JPA entities
- application authorization/data rules

Application repositories continue to own their own database, Flyway migrations, JPA/domain persistence mapping, and application-specific data retention behavior.

The shared PostgreSQL service is intentionally independent from Platform, Agenda, and other app deployments so an application can be started, stopped, or redeployed without owning the database runtime lifecycle.

### `alanwilliams-spring-security`

Reusable Java library. It is not a deployed auth microservice.

Owns generic reusable Spring Security + Clerk integration such as:

- JWT validation configuration
- issuer/JWKS conventions
- authenticated Clerk principal extraction
- common 401/403 behavior where appropriate
- security test helpers

It does not own Person, Agenda authorization, Budget authorization, or any domain membership.

## Canonical Identity Model

The platform identity model is:

```text
Clerk User
    |
    | verified authentication link
    v
Platform Person
    |
    +--> Agenda app references Person ID
    +--> Budget app references Person ID
    +--> Chores app references Person ID
    `--> future apps reference Person ID
```

### Identity Responsibilities

Clerk owns:

- authentication
- verified sign-in identity/session
- password/passkey/MFA/social sign-in
- account recovery
- active sessions

Platform owns:

- canonical Person
- Clerk user linkage
- canonical/default name
- notification/contact email
- global appearance preference
- duplicate reconciliation/merge

Apps own:

- memberships
- roles/permissions
- contextual display names
- domain-specific preferences
- domain authorization/data

### Person Before Account

A Platform Person may exist before signup:

```text
person.id = 123
person.name = "Jane Smith"
person.clerk_user_id = null
```

After a verified Clerk identity is claimed/linked:

```text
person.id = 123
person.clerk_user_id = "user_..."
```

Rule:

> Email discovers identity; Clerk user ID establishes authenticated identity.

Changing email must not create a new Person or rewrite historical relationships.

## Platform Person Suggested Shape

The final schema should be designed during implementation, but current conceptual fields are:

```text
person
- id
- name
- notification_email (nullable)
- appearance_mode (SYSTEM | LIGHT | DARK)
- clerk_user_id (nullable, unique when present)
- status (ACTIVE | INACTIVE | MERGED)
- merged_into_person_id (nullable)
- created_at
- updated_at
```

`SYSTEM` is the default appearance mode.

The Platform notification email is independent from Clerk sign-in identity. It may initially be populated from Clerk but is independently editable afterward.

### Contextual Display Names

The Platform `person.name` is the default.

Apps may define a nullable contextual display name on the relevant membership/relationship:

```text
Agenda organization membership.display_name
Finance household membership.display_name
Chores household membership.display_name
```

Resolution:

```text
context display_name
-> if null/blank, Platform person.name
```

Do not put multi-context display-name overrides on Platform Person.

## Privacy / Discovery

There is no globally searchable public AlanWilliams Apps directory.

Entering an email must not reveal whether that address already has an AlanWilliams account.

The Platform backend may privately resolve an email to an existing Person for legitimate invitation/claim workflows, but applications should return neutral UI outcomes such as:

```text
Invitation sent
```
rather than account-existence signals.

## Person Merge / Reconciliation

Merge is a platform identity operation because the Person can be referenced by multiple applications.

A merge must:

- preserve the canonical target Person
- retain the target Clerk user ID
- mark the source as merged rather than hard-delete it
- provide enough mapping/audit information for app relationships to be repointed safely
- avoid silently merging based only on name

Exact distributed merge coordination will be designed before implementation because app databases are separate.

## Authentication Request Flow

Each Java backend validates Clerk JWTs locally:

```text
Browser / React app
-> Clerk session/token
-> Authorization: Bearer <token>
-> target Java API
-> local Spring Security JWT validation
-> Clerk user ID principal
-> app/platform logic
```

The Platform backend is not an inline auth gateway.

Do not require:

```text
Agenda request -> Platform auth request -> Clerk -> Agenda
```

for every API call.

When an app needs canonical Person resolution, it uses the Platform identity contract rather than re-implementing independent Person creation.

## Environment Isolation

Use separate Clerk test and production configurations.

Production:

```text
alanwilliams.app
agenda.alanwilliams.app
budget.alanwilliams.app
api.alanwilliams.app
```

Test examples:

```text
test.alanwilliams.app
agenda-test.alanwilliams.app
api-test.alanwilliams.app
```

Only intended sibling domains should participate in shared authentication.

## API Convention

Use one API hostname per environment with service path prefixes:

```text
Production: https://api.alanwilliams.app/<service>/...
Test:       https://api-test.alanwilliams.app/<service>/...
```

Examples:

```text
/platform/...
/agenda/...
/budget/...
```

A dedicated router/reverse-proxy service can be introduced when multiple backends make it worthwhile. Do not introduce one solely to satisfy a microservice pattern.

## Naming Conventions

Repositories:

```text
alanwilliams-<component>
```

Examples:

```text
alanwilliams-platform
alanwilliams-agenda
alanwilliams-database
alanwilliams-budget
alanwilliams-spring-security
```

## Deployment Model

Apps and platform components are separately deployable Docker images/containers even when hosted on the same Ubuntu VM.

The PostgreSQL runtime is deployed separately through `alanwilliams-database` and is not owned by an individual application Compose stack.

Target direction:

```text
postgres
cloudflared
alanwilliams-platform-prod-backend
alanwilliams-platform-prod-frontend
alanwilliams-platform-test-backend
alanwilliams-platform-test-frontend
alanwilliams-agenda-prod-backend
alanwilliams-agenda-prod-frontend
alanwilliams-agenda-test-backend
alanwilliams-agenda-test-frontend
...future apps
```

Exact container names will be standardized during the next infrastructure/naming pass.

The separately deployable boundary is intentional so services can later be moved, replicated, or decomposed further without first untangling one monolithic deployment.

## Shared Database Architecture

One shared PostgreSQL 17 runtime serves separate application databases.

```text
alanwilliams-postgres
|
+-- agenda_prod
+-- agenda_test
+-- platform_prod
+-- platform_test
`-- future app databases
```

The runtime is owned by `alanwilliams-database`.

Each app owns its own database schema and Flyway migrations.

Cross-database foreign keys are not assumed.

App records that reference Platform Person IDs do so by stable application contract.

### Database Roles

Administration:

```text
postgres_admin
```

Use only for:

- database administration
- database/user creation
- backup/restore
- controlled maintenance

App runtimes use dedicated least-privilege per-environment roles:

```text
agenda_prod     -> agenda_prod_app
agenda_test     -> agenda_test_app
platform_prod   -> platform_prod_app
platform_test   -> platform_test_app
```

Application backends must not use `postgres_admin`.

Each app role owns/connects to its corresponding database and should not have access to the sibling environment database.

### Local Database Runtime

`alanwilliams-database` may be started independently:

```text
docker compose up -d
```

Apps then run independently against the shared DB runtime.

Host-side tests/tools:

```text
localhost:5432
```

Docker app backends:

```text
postgres:5432
```

Running Platform does not require Agenda containers to be running and vice versa.

### Production Database Runtime

Current production shared container:

```text
alanwilliams-postgres
```

Persistent production data remains bind-mounted on the server while the operational Compose ownership now belongs to `/opt/alanwilliams/database`.

The shared `alanwilliams-backend` network is external to app deployment stacks.

### Backup / Restore

Production backups are logical PostgreSQL backups using:

```text
pg_dump -Fc
```

Backup/restore tooling is owned operationally by `alanwilliams-database`.

Backups target explicit databases and do not rely on copying container filesystem contents.

The existing proven Agenda restore discipline remains the baseline as backup coverage expands to Platform.

## Deployment Model

Apps and Platform are independently deployable Docker frontend/backend pairs.

Current deployed topology:

```text
alanwilliams-postgres

alanwilliams-agenda-test-frontend-1
alanwilliams-agenda-test-backend-1
alanwilliams-agenda-prod-frontend-1
alanwilliams-agenda-prod-backend-1

alanwilliams-platform-test-frontend-1
alanwilliams-platform-test-backend-1
alanwilliams-platform-prod-frontend-1
alanwilliams-platform-prod-backend-1

cloudflared
```

Backend containers attach to:

```text
environment-specific web network
+
alanwilliams-backend
```

Frontend containers attach only to their environment-specific web network.

Cloudflared attaches to the app/platform web networks and does not need direct access to the shared backend database network.

Current web networks:

```text
alanwilliams-agenda-test-web
alanwilliams-agenda-prod-web
alanwilliams-platform-test-web
alanwilliams-platform-prod-web
```

## Shared Infrastructure

```text
Windows physical host
-> VirtualBox Ubuntu VM
-> Docker
   -> alanwilliams-database / PostgreSQL
   -> Agenda test/prod
   -> Platform test/prod
   -> cloudflared
-> Cloudflare Tunnel
-> public hostnames
```

Physical host:

- Windows/Plex PC: `10.0.0.100`

Ubuntu VM:

- Ubuntu 26.04 LTS
- `10.0.0.27`
- Docker Engine

Cloudflare Tunnel exposes services without inbound router ports.

### Local Development

The database runtime is started independently from application stacks:

```text
alanwilliams-database
-> docker compose up -d
```

Then Platform, Agenda, or another app can be run independently against it. Running Platform locally does not require Agenda containers to be running, and running Agenda locally does not require Platform application containers solely to obtain PostgreSQL.

### Database Creation

Adding a new application does not require another PostgreSQL container. Create the application's database in the shared PostgreSQL instance, then allow that application repository to own all schema evolution through its Flyway migrations.

### Backup / Restore Direction

Production backups are logical PostgreSQL backups using `pg_dump -Fc`. Backup and restore operations belong operationally to `alanwilliams-database`, even though each application owns the contents and retention requirements of its own database.

Backups target explicit application databases and do not rely on copying PostgreSQL container filesystem contents.

The existing proven Agenda backup/restore discipline should be preserved as backup coverage expands to Platform and future production databases.

## Shared Infrastructure

Current infrastructure:

```text
Windows physical host
-> VirtualBox Ubuntu VM
-> Docker
-> PostgreSQL + app containers + cloudflared
-> Cloudflare Tunnel
-> public hostnames
```

Physical host:

- Windows/Plex PC: `10.0.0.100`

Ubuntu VM:

- Ubuntu 26.04 LTS
- `10.0.0.27`
- Docker Engine

Cloudflare:

- DNS managed by Cloudflare
- Cloudflare Tunnel exposes services without inbound router ports
- registrar remains name.com

## Shared Frontend / App Launcher Direction

`alanwilliams.app` becomes the platform frontend.

Initial responsibilities:

- Clerk sign-in/account experience
- authenticated landing page
- app launcher
- account/profile access

Future app launcher experience:

```text
AlanWilliams Apps
- Agenda
- Budget
- Chores
- Goals
- Fitness
```

Access display may eventually be driven by app availability/authorization metadata, but that contract is not yet finalized.

## Shared UI Convention

AlanWilliams Apps use one shared responsive visual system with app-specific identity applied selectively.

### Frontend Toolkit

Shared frontend standard:

- React + TypeScript + Vite
- Bootstrap for responsive layout, utilities, forms, and component mechanics
- Font Awesome for the shared icon vocabulary
- AlanWilliams semantic design tokens layered over Bootstrap
- mobile-first implementation and testing

### App Identity Colors

Current app identity direction:

```text
Platform     Navy
Agenda       BYU Royal Blue
Budget       Green
Chores       Gold
Fitness      Dark Red
```

Each app defines one primary identity color:

```text
--app-primary
```

The app primary color is intentionally limited to a small portion of the interface so pages remain visually calm and consistent.

Use the app primary color for:

- app logo/icon
- primary actions
- top-header navigation hover/active text
- desktop side-navigation background
- mobile bottom-navigation background

Do not use the app primary color for generic links, tags, dropdowns, or secondary actions.

### Shared Header

The top header uses the shared light/dark system surface rather than an app-colored background.

Header behavior:

```text
background         -> shared light/dark surface
normal text        -> shared text color
hover nav text     -> app primary color
active nav text    -> app primary color + bold
primary/sign-in    -> app primary button treatment
```

Navigation item width should reserve space for its bold state so hover/active changes do not shift adjacent items.

When signed out, the left brand area behaves as a normal home link.

When signed in, the same app identity area may become the app switcher.

### Desktop Side Navigation

Desktop app navigation uses the app primary color as the side-navigation surface.

```text
background         -> app primary
inactive icon/text -> soft white
hover              -> white foreground + subtle white wash
active             -> white surface + app-primary icon/text
```

The side navigation remains fixed/sticky while the page content area scrolls.

### Mobile Bottom Navigation

Mobile app navigation uses the same app-primary treatment as desktop side navigation.

```text
background         -> app primary
inactive icon/text -> soft white
hover              -> white foreground + subtle white wash
active             -> white surface + app-primary icon/text
```

The mobile bottom navigation remains pinned to the bottom of the app shell while page content scrolls.

General mobile navigation guideline:

```text
Home + up to 3 primary destinations + More
```

### App Logo Treatment

App logos use their native app identity color without a background container.

Light mode:

```text
native app-color logo
transparent background
```

Dark mode:

```text
same native app-color logo
transparent background
```

Separate light/dark app-logo variants are not required.

Platform is the exception because the navy `W` does not have sufficient contrast on the selected dark-mode surface:

```text
Platform light mode -> navy W asset
Platform dark mode  -> white W asset
```

Use explicit light/dark Platform logo assets rather than CSS color inversion.

### Appearance

Global appearance choices:

```text
System (default)
Light
Dark
```

The shared dark theme uses a navy/blue-toned surface family rather than charcoal/black because it provides better contrast and visual compatibility with the BYU Royal Agenda identity.

Exact surface values remain design tokens and may evolve without changing the overall contract.

### Primary Actions

Primary actions use the current app's identity color.

Light mode:

```text
normal -> app-primary fill + white text
hover  -> white fill + app-primary border/text
```

Dark mode:

```text
normal -> app-primary fill + white text
hover  -> white fill + app-primary text
```

### Secondary Actions

Secondary actions use shared AlanWilliams light/dark tokens rather than the app identity color.

They remain visually distinct from primary actions and should always have a visible border at rest.

Neutral actions such as Cancel, Close, and Back may remain neutral/gray when appropriate.

### Links

Generic links use a shared accessible blue treatment rather than the current app identity color.

This prevents ordinary links from becoming visually aggressive in apps whose primary identity is red, gold, or green.

Links use separate light/dark shared tokens:

```text
--aw-link
--aw-link-hover
```

### Tags / Pills

User-defined or ordinary organizational tags use one shared neutral light/dark pill treatment.

Do not allow users to assign arbitrary tag colors.

Conceptual shared tag tokens:

```text
--aw-tag-text
--aw-tag-bg
--aw-tag-border
```

Tags communicate categorization by text, not by custom color.

### Semantic Badges

Controlled semantic states may use dedicated system-defined colors independent of app identity.

Examples:

```text
URGENT
HIGH
MEDIUM
LOW

SUCCESS
WARNING
ERROR
PENDING
COMPLETED
```

Semantic color palettes must be designed for both light and dark mode and should not be derived from the app primary color.

### Dropdowns

Dropdown surfaces, text, borders, and selection behavior use shared light/dark tokens.

Dropdowns do not inherit app-specific background colors.

### Shared Semantic Tokens

Shared UI should prefer semantic variables such as:

```text
--aw-surface
--aw-surface-raised
--aw-text
--aw-text-muted
--aw-border

--aw-secondary-action
--aw-secondary-action-hover

--aw-link
--aw-link-hover

--aw-tag-text
--aw-tag-bg
--aw-tag-border
```

App identity is injected separately through:

```text
--app-primary
```

This separation keeps shared components consistent while allowing app identity to remain obvious through logos, navigation surfaces, and primary actions.

## Naming Conventions

Repository:

```text
alanwilliams-<component>
```

Examples:

```text
alanwilliams-platform
alanwilliams-agenda
alanwilliams-budget
alanwilliams-database
alanwilliams-spring-security
```

Java package direction:

```text
com.alanwilliams.platform
com.alanwilliams.agenda
com.alanwilliams.budget
com.alanwilliams.security
```

Database names stay app-focused:

```text
platform_prod
agenda_prod
budget_prod
```

API service prefixes stay app-focused:

```text
/platform
/agenda
/budget
```

Docker/server naming follows the platform-wide conventions above. Agenda
test and production deployments have been migrated to the standardized
`alanwilliams-agenda-*` Compose/container/network naming.

## Documentation Ownership

Cross-repo contracts are documented here.

Repo-specific architecture documents consume those contracts and should not duplicate them in full.

If a repo-specific document conflicts with this document on a cross-repo concern, update the documents together; the Platform architecture is the intended source of truth for that boundary.

## Current Locked Decisions
- `alanwilliams-database` owns the shared PostgreSQL runtime, persistent volume, shared backend Docker network, and database-level backup/restore tooling.
- Individual app repositories do not own separate PostgreSQL containers.
- Each app still owns its own separate database and Flyway migrations.
- App backend containers connect to shared PostgreSQL over the external `alanwilliams-backend` network using `postgres:5432`.
- Local app stacks can run independently against the shared database runtime; running one app does not require running all other app containers.

- Clerk owns authentication.
- Platform owns canonical Person.
- One Person is shared across all connected apps.
- App databases remain separate and own domain authorization/data.
- Each Java backend validates Clerk JWTs locally.
- Shared Clerk/Spring plumbing belongs in a reusable library, not a central auth microservice.
- Platform backend is separately deployable as its own Docker image/container.
- Shared top headers use light/dark system surfaces; app identity appears in hover/active text and primary actions.
- Desktop side navigation and mobile bottom navigation use the current app primary color with white foreground and white active-item surfaces.
- App logos use native app colors on transparent backgrounds in both light and dark mode.
- Platform uses a navy W in light mode and a white W in dark mode.
- Shared secondary actions, generic links, tags, dropdowns, and page surfaces are not app-themed.
- Generic links use shared accessible blue tokens; tags use shared neutral pills without user-configurable colors.
- Semantic badges/priorities use controlled system colors independent of app identity.
- Repositories use the `alanwilliams-` prefix.
- Documentation is split by repo with unique filenames.
- One ChatGPT Project can hold the ecosystem docs so cross-repo context remains available.


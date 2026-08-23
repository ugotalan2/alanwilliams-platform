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
- identity reconciliation and merge
- platform/account API
- `alanwilliams.app` launcher/account frontend
- cross-app identity/application metadata as needed

### `alanwilliams-agenda`

Owns:

- Agenda domain
- organizations and Agenda memberships
- meeting types and meetings
- questions, assignments, reminders, training/documents
- Agenda-specific permissions and settings
- Agenda frontend/backend deployment

### `alanwilliams-budget`

Will own:

- budget/workspace data
- Budget membership and authorization
- Budget-specific settings
- Budget frontend/backend deployment

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
- account recovery
- MFA/passkeys/social sign-in if enabled

Platform owns:

- canonical Person record
- linkage from Clerk user ID to Person
- platform profile/contact data
- duplicate reconciliation/merge

Apps own:

- app memberships
- app permissions
- app roles
- app preferences
- domain authorization

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
- contact_email (nullable)
- clerk_user_id (nullable, unique when present)
- status (ACTIVE, INACTIVE, MERGED)
- merged_into_person_id (nullable)
- created_at
- updated_at
```

Exact naming may be refined during schema implementation.

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

## Deployment Model

Apps and platform components are separately deployable Docker images/containers even when hosted on the same Ubuntu VM.

Target direction:

```text
postgres
cloudflared
alanwilliams-platform-prod-backend
alanwilliams-platform-prod-frontend
alanwilliams-agenda-prod-backend
alanwilliams-agenda-prod-frontend
alanwilliams-agenda-test-backend
alanwilliams-agenda-test-frontend
...future apps
```

Exact container names will be standardized during the next infrastructure/naming pass.

The separately deployable boundary is intentional so services can later be moved, replicated, or decomposed further without first untangling one monolithic deployment.

## Database Ownership

Platform:

```text
platform_prod
platform_test
```

Agenda:

```text
agenda_prod
agenda_test
```

Future Budget:

```text
budget_prod
budget_test
```

Each application owns its database. PostgreSQL cross-database foreign keys are not assumed.

App records that reference Platform Person IDs do so by stable contract.

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

## Shared Frontend / Platform Site Direction

`alanwilliams.app` is the public front door and shared account surface
for the ecosystem, but users are not required to visit it before using
an individual app.

Public, signed-out Platform pages should include:

-   home/about AlanWilliams Apps
-   available app information
-   about/contact
-   sign in/sign up entry points

Authenticated Platform responsibilities include:

-   Clerk sign-in/account experience
-   canonical profile/account management
-   Appearance
-   My Apps / app launcher
-   default post-login destination
-   first-use and new-app discovery prompts

Direct application entry remains a first-class flow. For example, a user
invited to an Agenda organization may navigate directly to
`agenda.alanwilliams.app`, sign in there, and use Agenda without first
visiting the Platform launcher.

## Shared Account / Profile Contract

The same profile control is available from every AlanWilliams
app/subdomain.

Shared account destinations include:

``` text
My Profile
Appearance
My Apps
Sign Out
```

Platform owns these global account experiences. App-specific
configuration continues to use the label `Settings`.

Profile/account navigation must preserve the user's current application
location. Shared account links carry a validated `returnTo` destination
so a user can leave an app page, update profile/appearance/app
preferences, and return to the same page.

Return precedence:

``` text
1. valid explicit returnTo
2. user's default app preference
3. alanwilliams.app authenticated app launcher
```

`returnTo` must be restricted to approved AlanWilliams
production/test/local origins. Arbitrary external redirect targets are
not allowed.

Authentication flows must preserve deep links in the same way:

``` text
direct app URL
-> authentication required
-> Clerk sign-in/sign-up
-> return to original app URL
```

## App Catalog / Launcher Preferences

Platform maintains application metadata and user launcher preferences.

Conceptual application catalog:

``` text
platform_app
- key
- name
- description
- status
- launched_at
- icon
- accent
- sort_order
```

Conceptual user-app preference:

``` text
person_app
- person_id
- app_key
- show_in_launcher
- prompted_at
- first_used_at
- updated_at
```

`show_in_launcher` is a presentation preference only. It does not grant
or revoke application authorization.

Rule:

> App access is owned by the app; app visibility in My Apps is owned by
> the Platform user preference.

A person may navigate directly to any app and authenticate there
regardless of whether that app is shown in their launcher. Domain
membership/authorization remains app-owned.

First-use onboarding may ask which apps the user wants shown in My Apps
and optionally choose a default destination.

When a new app launches, an existing user who has not yet been presented
with it may receive a lightweight one-time discovery prompt such as
`Add to My Apps` / `Not now`. Declining does not block direct access.

## Global Preferences

Global account preferences belong to Platform rather than individual
apps.

Conceptual preference record:

``` text
person_preference
- person_id
- appearance_mode
- default_app_key (nullable)
- updated_at
```

Appearance values:

``` text
SYSTEM (default)
LIGHT
DARK
```

The default-app preference controls the normal destination after
authentication when there is no explicit `returnTo`. The UI should offer
the launcher as the default/fallback choice rather than assuming every
user primarily uses Agenda.

Changing global Appearance should affect all participating AlanWilliams
apps.

## Shared UI Convention

Frontend toolkit standard:

-   React + TypeScript + Vite
-   Bootstrap for responsive layout, utilities, forms, and component
    mechanics
-   Font Awesome for the shared icon vocabulary
-   AlanWilliams semantic design tokens layered over Bootstrap for
    product identity and theming

The UI is mobile-first from the beginning. Screens should be designed
and tested at phone widths first, then expanded for tablet/desktop.

App identities:

```text
Agenda       Blue A
Budget       Green B
Chores       Amber/Yellow C
Goals        Orange G
Fitness      Red F
Platform     Purple
```

Shared layout, spacing, typography, controls, cards, profile behavior,
and responsive patterns remain consistent. App identity is primarily
differentiated by accent color, app icon/letter, and app-specific
navigation/content.

Use semantic tokens rather than hard-coded Bootstrap colors, for
example:

``` text
--aw-surface
--aw-surface-raised
--aw-text
--aw-text-muted
--aw-border
--aw-accent
--aw-accent-hover
--aw-focus-ring
```

Desktop:

-   top header
-   collapsible left sidebar where appropriate
-   persistent access to app switcher and profile menu

Mobile:

-   compact top header with profile access
-   bottom navigation where appropriate
-   touch-friendly controls and responsive Bootstrap layout

General app navigation guideline:

```text
Home + up to 3 primary destinations + More
```

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

-   Clerk owns authentication.
-   Platform owns canonical Person.
-   One Person is shared across all connected apps.
-   App databases remain separate and own domain authorization/data.
-   Each Java backend validates Clerk JWTs locally.
-   Shared Clerk/Spring plumbing belongs in a reusable library, not a
    central auth microservice.
-   Platform backend is separately deployable as its own Docker
    image/container.
-   Platform account/profile/Appearance/My Apps are globally available
    from every participating app.
-   Shared account/auth flows preserve a validated `returnTo`
    destination so users return to the page they came from.
-   Direct app entry does not require prior Platform launcher
    enrollment.
-   `person_app.show_in_launcher` is a presentation preference, not
    authorization.
-   App authorization remains app-owned even when launcher visibility is
    Platform-owned.
-   Global Appearance and default-app preferences are Platform-owned;
    app-specific configuration is labeled `Settings`.
-   Frontends use React/TypeScript/Vite with Bootstrap and Font Awesome
    under shared AlanWilliams semantic design tokens.
-   Shared UI is mobile-first.
-   Repositories use the `alanwilliams-` prefix.
-   Documentation is split by repo with unique filenames.
-   One ChatGPT Project can hold the ecosystem docs so cross-repo
    context remains available.

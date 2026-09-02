# AlanWilliams Platform - Architecture

## Scope

This document is the source of truth for cross-repository architecture
and integration contracts across AlanWilliams Apps.

Detailed Agenda domain architecture belongs in
`ALANWILLIAMS_AGENDA_ARCHITECTURE.md`. Reusable Spring/Clerk
implementation details belong in
`ALANWILLIAMS_SPRING_SECURITY_ARCHITECTURE.md`.

## Architecture Principles

-   Keep apps independently deployable while sharing platform
    conventions, identity, authentication, UI patterns, and API routing.
-   Use Clerk for authentication/SSO; do not build or store password
    credentials.
-   Maintain one canonical Platform Person across all connected apps.
-   Keep app-specific authorization and domain data within each app.
-   Prefer separately deployable components without prematurely
    decomposing the system into many microservices.
-   Validate Clerk JWTs locally in each Java backend rather than routing
    every request through a central auth service.
-   Preserve historical identity and relationships rather than rewriting
    people when roles/memberships change.
-   Prevent account enumeration and cross-app privacy leaks.
-   Use stable cross-repo contracts and avoid duplicating detailed
    domain documentation between repositories.
-   Keep shared infrastructure independently operable when it has a
    lifecycle distinct from an application.

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

-   canonical Person
-   Clerk user-to-Person linkage
-   global profile/account data
-   global appearance preference
-   notification/contact email
-   identity reconciliation and merge
-   Platform onboarding and Person creation/claim enforcement
-   platform/account API
-   app catalog identity/routing/status metadata 
-   per-Person launcher preferences
-   `alanwilliams.app` launcher/account frontend
-   cross-app identity contracts

### `alanwilliams-agenda`

Owns:

-   Agenda organizations and memberships
-   Agenda contextual display names
-   meeting types and meetings
-   questions, assignments, reminders, training/documents
-   Agenda-specific permissions and settings
-   Agenda frontend/backend deployment
-   Agenda database and Flyway migrations

### `alanwilliams-budget`

Will own:

-   budget/workspace data
-   household memberships and contextual display names where applicable
-   Budget authorization/settings
-   Budget database/migrations/deployment


## Application repositories

Agenda, Budget, Chores, Fitness, and future apps own their domain data,
memberships, roles, contextual display names, permissions, notification
settings, workflows, databases, migrations, and deployment.

Application invitations are app-owned. Platform participates only where
canonical Person creation or Person-to-Clerk claiming/linking is
required.

### `alanwilliams-database`

Owns the shared PostgreSQL runtime and database operations used by
AlanWilliams Apps.

Owns:

-   PostgreSQL 17 container lifecycle
-   persistent PostgreSQL storage
-   shared `alanwilliams-backend` Docker network
-   database creation/listing tooling
-   logical backup/restore tooling
-   PostgreSQL runtime/version maintenance

Does not own:

-   application schemas
-   Flyway migrations
-   app-specific JPA entities
-   application authorization/data rules

Application repositories continue to own their own database, Flyway
migrations, JPA/domain persistence mapping, and application-specific
data retention behavior.

The shared PostgreSQL service is intentionally independent from
Platform, Agenda, and other app deployments so an application can be
started, stopped, or redeployed without owning the database runtime
lifecycle.

### `alanwilliams-spring-security`

Reusable Java library, not a deployed auth service. It owns generic
Clerk JWT validation/principal extraction and reusable Spring Security
integration. Consumer applications own route authorization and CORS.

Reusable Java library. It is not a deployed auth microservice.

Owns generic reusable Spring Security + Clerk integration such as:

-   JWT validation configuration
-   issuer/JWKS conventions
-   authenticated Clerk principal extraction
-   common 401/403 behavior where appropriate
-   security test helpers

It does not own Person, Agenda authorization, Budget authorization, or
any domain membership.

## Canonical Identity Model

The platform identity model is:

``` text
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

-   authentication
-   verified sign-in identity/session
-   password/passkey/MFA/social sign-in
-   account recovery
-   active sessions

Platform owns:

-   canonical Person
-   Clerk user linkage
-   canonical/default name
-   notification/contact email
-   preferred IANA timezone
-   global appearance preference
-   duplicate reconciliation/merge

Apps own:

-   memberships
-   roles/permissions
-   contextual display names
-   domain-specific preferences
-   domain authorization/data

### Person Before Account

A Platform Person may exist before signup:

``` text
person.id = 123
person.name = "Jane Smith"
person.clerk_user_id = null
```

After a verified Clerk identity is claimed/linked:

``` text
person.id = 123
person.clerk_user_id = "user_..."
```

Rule:

> Email discovers identity; Clerk user ID establishes authenticated
> identity.

Changing email must not create a new Person or rewrite historical
relationships.


### Person Claim / Account Linking

A Platform Person may be provisioned by an application administrator before the
person has a Clerk account. Account linking is explicit and must never happen
silently from email equality alone.

Rules:

-   Email may privately help discover an existing unclaimed Person or invitation.
-   A valid app invitation/claim token plus an authenticated Clerk session may be
    used to explicitly claim an unlinked Person.
-   Invitation acceptance always requires an explicit confirmation step. An
    already-active Clerk session must never automatically claim a Person or accept
    a membership.
-   Confirmation UI should clearly identify the currently signed-in account and
    provide a `Not me` / switch-account path for shared-device safety.
-   One Clerk user may link to only one Platform Person, and one Platform Person
    may link to at most one Clerk user. Claiming must be atomic.
-   A Person that is already linked may only accept an invitation while signed in
    as that same Clerk identity.
-   Changing the email of an unlinked Person invalidates outstanding account-claim
    invitations issued to the prior address.
-   Once linked, ordinary app administrators may no longer edit the canonical
    Platform name or notification email; those belong to the account owner.
-   Removing an app membership never deletes the Platform Person or its Clerk
    linkage.

For a newly provisioned Person, `name` remains required. If Clerk does not provide
a suitable name during self-service signup, onboarding must collect one before a
new canonical Person is created. OAuth-provided names may be used only as a
prefill and remain editable by the new account owner.

`time_zone` stores a nullable IANA timezone ID such as `America/Chicago`. `NULL`
means the client may follow the current device/browser timezone. Travel must not
silently rewrite a stored preferred timezone. Domain events that have their own
timezone semantics, such as a scheduled meeting, own that timezone independently
of the Person preference.

## Platform Person Shape

The Platform Person persistence model is now implemented with the following
canonical fields:

``` text
person
- id
- name (required)
- notification_email (nullable)
- time_zone (nullable IANA timezone ID)
- appearance_mode (SYSTEM | LIGHT | DARK)
- clerk_user_id (nullable, unique when present)
- status (ACTIVE | INACTIVE | MERGED)
- merged_into_person_id (nullable)
- created_at
- updated_at
```

`SYSTEM` is the default appearance mode.

Platform persists this model with JPA/Flyway. `Person` uses explicit domain
mutation methods rather than broad entity setters; Lombok `@Getter` is the
preferred entity convenience, while class-level `@Setter`, `@Data`, and
general-purpose entity builders are avoided. Application/JPA lifecycle hooks
own `created_at` / `updated_at` updates, while database defaults remain a
fallback.

The Platform notification email is independent from Clerk sign-in
identity. It may initially be populated from Clerk but is independently
editable afterward. Whether an individual app sends email is an app-specific
notification preference; storing a Platform notification email does not itself
opt a user into every app's email notifications.

### Contextual Display Names

The Platform `person.name` is the canonical cross-app name. Applications own
contextual display names on their membership/relationship records:

``` text
Agenda organization membership.display_name
Budget household membership.display_name
Chores household membership.display_name
```

For contexts that use a managed display name, the application should snapshot the
admin-supplied name into the membership when the membership is created. If a new
Platform Person is also provisioned at that time, the same value may seed
`person.name`; after creation the two values are independent. Later Platform name
changes do not automatically rewrite app display names.

Applications may allow members to request display-name changes while retaining
admin approval over the effective organization/household-visible value.

Do not put multi-context display-name overrides on Platform Person.

## Person Creation and Onboarding

``` text
A successful Clerk authentication does not itself create a Platform
Person.

GET /platform/me is the canonical check after authentication:

linked Clerk user -> 200 Platform profile

authenticated Clerk user with no linked Person -> 404 with code
PERSON_NOT_LINKED

Normal first-use flow with no invitation:
```

### Clerk authentication

``` text
-> GET /platform/me
-> PERSON_NOT_LINKED
-> explicit Platform onboarding
-> show current Clerk identity
-> collect/edit Platform profile fields
-> POST /platform/onboarding/create
-> create Person + link Clerk user ID
-> continue to My Apps for first-run configuration
```

### POST /platform/onboarding/create:
```text
-  requires authentication
-  obtains Clerk user ID from ClerkPrincipal
-  accepts name, notification email, timezone, and appearance mode
-  never searches for or links another Person by email
-  creates and links the new Person atomically
-  returns 201 with the profile DTO
-  repeated creation for an already-linked Clerk user returns
    409 PERSON_ALREADY_LINKED
-  database uniqueness on clerk_user_id remains the final race-condition authority
-  the frontend passes the current pre-login appearance preference when 
   creating the Person; backend defaults to SYSTEM only when omitted
```

The onboarding UI must provide a clear
Not you? Sign out / switch account path.

## Person Claim / Invitation Linking

A Platform Person may exist before signup. Claiming is explicit and
atomic.

### Rules:

```text
-  email is not an identity key and must never silently link a Person
-  one Clerk user -> one Person
-  one Person -> at most one Clerk user
-  an active Clerk session never automatically accepts an invitation or
   claims a Person
-  confirmation identifies the currently signed-in account and provides
   Not me / switch-account
-  once linked, the account owner controls canonical Platform name and
   notification email
-  removing an app membership never deletes the Platform Person or
   Clerk linkage
```

Invitation lifecycle belongs to the application that issued it.

### Example Agenda flow:

```text
https://agenda.alanwilliams.app/invite/<opaque-token>
-> Agenda validates invitation/membership/expiration
-> authentication as needed
-> Platform claim/create path if no linked Person
-> explicit confirmation
-> Agenda accepts membership
```

There is no generic Platform invitation table.

An invitation route must bypass generic self-service Person creation
until the invitation's claim/create decision is resolved.

## Platform Account / Profile API

The authenticated Platform account API is rooted at `/platform/me`.

Current behavior:

``` text
GET /platform/me
-> resolve ClerkPrincipal.clerkUserId
-> load linked Platform Person
-> return Platform-owned profile DTO

PATCH /platform/me
-> update supplied Platform-owned profile fields
-> return updated profile DTO
```

The API returns DTOs rather than exposing the JPA entity directly. Current
self-service profile fields are canonical name, notification email, preferred
IANA timezone, and global appearance mode.

The account/controller layer lives under `com.alanwilliams.platform.account`;
canonical Person domain/persistence remains under
`com.alanwilliams.platform.person`. Generic Clerk JWT validation and
`ClerkPrincipal` extraction remain in `alanwilliams-spring-security`.

Clerk continues to own credential/security management. The Platform profile
UI delegates sign-in methods, password/security settings, and active-session
management to Clerk's user-profile/account UI rather than implementing
credential management itself.

## Privacy / Discovery

There is no globally searchable public AlanWilliams Apps directory.

Entering an email must not reveal whether that address already has an
AlanWilliams account.

The Platform backend may privately resolve an email to an existing
Person for legitimate invitation/claim workflows, but applications
should return neutral UI outcomes such as:

``` text
Invitation sent
```

rather than account-existence signals.

## Person Merge / Reconciliation

Merge is a platform identity operation because the Person can be
referenced by multiple applications.

A merge must:

-   preserve the canonical target Person
-   retain the target Clerk user ID
-   mark the source as merged rather than hard-delete it
-   provide enough mapping/audit information for app relationships to be
    repointed safely
-   avoid silently merging based only on name

Exact distributed merge coordination will be designed before
implementation because app databases are separate.

## Authentication Request Flow

Each Java backend validates Clerk JWTs locally:

``` text
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

``` text
Agenda request -> Platform auth request -> Clerk -> Agenda
```

for every API call.

When an app needs canonical Person resolution, it uses the Platform
identity contract rather than re-implementing independent Person
creation.

## Environment Isolation

Use separate Clerk test and production configurations.

Production:

``` text
alanwilliams.app
agenda.alanwilliams.app
budget.alanwilliams.app
api.alanwilliams.app
```

Test examples:

``` text
test.alanwilliams.app
agenda-test.alanwilliams.app
api-test.alanwilliams.app
```

Only intended sibling domains should participate in shared
authentication.

## API Convention

Use one API hostname per environment with service path prefixes:

``` text
Production: https://api.alanwilliams.app/<service>/...
Test:       https://api-test.alanwilliams.app/<service>/...
```

Examples:

``` text
/platform/...
/agenda/...
/budget/...
```

Each backend owns its service prefix as its Spring servlet context path.
Current examples:

``` text
Platform -> server.servlet.context-path=/platform
Agenda   -> server.servlet.context-path=/agenda
```

Cloudflare Tunnel uses the service path only to select the correct backend
and preserves the original request path. It does not prepend a second copy
of the service prefix. Current routing direction is therefore:

``` text
api-test.alanwilliams.app/platform/* -> Platform test backend
api-test.alanwilliams.app/agenda/*   -> Agenda test backend

api.alanwilliams.app/platform/*      -> Platform production backend
api.alanwilliams.app/agenda/*        -> Agenda production backend
```

A dedicated router/reverse-proxy service can be introduced when multiple
backends make it worthwhile. Do not introduce one solely to satisfy a
microservice pattern.

## Shared Database Architecture

One shared PostgreSQL 17 runtime serves separate application databases.

``` text
alanwilliams-postgres
|
+-- agenda_prod
+-- agenda_test
+-- platform_prod
+-- platform_test
`-- future app databases
```

The runtime is owned by `alanwilliams-database`.

Each app owns its own database schema and Flyway migrations. Platform currently
uses Spring Boot 4.x Flyway integration via `spring-boot-flyway` plus
`flyway-database-postgresql`; migrations use the conventional
`classpath:db/migration` location.

Cross-database foreign keys are not assumed.

App records that reference Platform Person IDs do so by stable
application contract.

### Database Roles

Administration:

``` text
postgres_admin
```

Use only for:

-   database administration
-   database/user creation
-   backup/restore
-   controlled maintenance

App runtimes use dedicated least-privilege per-environment roles:

``` text
agenda_prod     -> agenda_prod_app
agenda_test     -> agenda_test_app
platform_prod   -> platform_prod_app
platform_test   -> platform_test_app
platform_dev    -> platform_dev_app (local Platform development)
```

Application backends must not use `postgres_admin`.

Each app role owns/connects to its corresponding database and should not
have access to the sibling environment database.

### Local Database Runtime

`alanwilliams-database` may be started independently:

``` text
docker compose up -d
```

Apps then run independently against the shared DB runtime.

Host-side tests/tools:

``` text
localhost:5432
```

Docker app backends:

``` text
postgres:5432
```

Current local Platform database contract:

``` text
platform_dev -> platform_dev_app
jdbc:postgresql://postgres:5432/platform_dev
```

The local Platform Compose stack loads backend runtime variables from
`backend/.env.local`. The standard local build/start command is:

``` text
docker compose --env-file ./backend/.env.local up -d --build
```

The environment file supplies runtime configuration such as datasource and Clerk
settings. Maven/GitHub Packages credentials remain build-only credentials and are
provided separately through BuildKit secrets rather than being stored as runtime
environment values or baked into the image.

Running Platform does not require Agenda containers to be running and
vice versa.

### Production Database Runtime

Current production shared container:

``` text
alanwilliams-postgres
```

Persistent production data remains bind-mounted on the server while the
operational Compose ownership now belongs to
`/opt/alanwilliams/database`.

The shared `alanwilliams-backend` network is external to app deployment
stacks.

### Backup / Restore

Backup policy is defined per production database.

Weekly-only policy:

``` text
agenda_prod
fitness_prod
chores_prod
-> weekly
-> retain 4 weekly backups
```

Daily + weekly policy:

``` text
platform_prod
budget_prod
-> daily, retain 7 daily backups
-> weekly, retain 4 weekly backups
```

Only databases that actually exist in production are enabled in the
current backup scripts. Future app databases are added to the
appropriate policy when they go live.

Storage:

``` text
primary backup -> Windows physical HDD via SMB at /mnt/server-backups
off-site copy  -> Google Drive via rclone
test databases -> no routine backups
```

Production backups are logical PostgreSQL custom-format backups using:

``` text
pg_dump -Fc
```

`alanwilliams-database` owns the version-controlled backup scripts and
backup/restore operations. Cron on the Ubuntu server invokes the daily
and weekly policy scripts. Backups target explicit databases and do not
rely on copying PostgreSQL container filesystem contents.

Agenda's restore procedure has already been proven and remains the
baseline restore discipline for the shared database service.

## Shared Java Library Distribution

Reusable AlanWilliams Java libraries are distributed as versioned Maven
artifacts through GitHub Packages rather than copied JARs or source builds
inside consumer repositories.

Current shared library:

``` text
com.alanwilliams:alanwilliams-spring-security
-> GitHub Packages
-> consumed by alanwilliams-platform and future Java backends
```

Package/authentication rules:

-   `alanwilliams-spring-security` publishes with its repository
    `GITHUB_TOKEN` using `packages: write`.
-   Consumer repositories authenticate to GitHub Packages with a
    classic PAT limited to `read:packages` when cross-repository package
    access is required.
-   Public repository/package visibility does not remove Maven registry
    authentication requirements.
-   Package credentials are build credentials only and must not be baked
    into application images. Docker builds pass them with BuildKit
    secrets.
-   Consumer applications remain responsible for their own
    `SecurityFilterChain` and route authorization. The shared library
    provides reusable Clerk JWT validation and principal extraction, not
    app-specific authorization policy.

## Shared Frontend Library Distribution

Reusable AlanWilliams frontend design and component code is owned by the
separate `alanwilliams-ui` repository and distributed as a versioned npm
package through GitHub Packages.

Canonical package:

```text
@alanwilliams/ui
```

The package is the frontend counterpart to `alanwilliams-spring-security`:
a reusable build-time library rather than a deployed service.

`alanwilliams-ui` owns shared frontend presentation primitives including:

- semantic design tokens and common CSS
- light/dark appearance rendering mechanics
- app visual themes and shared app/brand assets
- reusable application shell/header components
- reusable account-menu presentation
- reusable desktop and mobile navigation presentation
- shared responsive and accessibility behavior

Platform remains the owner of canonical Person/profile data, appearance
preference persistence, My Apps preferences, onboarding, identity contracts,
and environment-aware cross-app routing rules. Individual applications remain
the owners of their route definitions, navigation choices, domain pages,
memberships, authorization, and workflows.

Applications consume an explicit `@alanwilliams/ui` version at build time and
bundle the shared code/assets into their own deployment. They must not depend on
runtime delivery of shared CSS or JavaScript from `alanwilliams.app`.

Initial migration order is Platform first, then Agenda. Platform is the reference
implementation used to verify the extraction without visual regression; Agenda
is the second consumer used to prove the public API is genuinely reusable.

Detailed package internals belong in `ALANWILLIAMS_UI_ARCHITECTURE.md`.

## Clerk Deployment Configuration

Clerk frontend and backend configuration use different delivery paths.

Frontend Vite configuration is build-time:

``` text
/opt/alanwilliams/platform/<environment>/.env
-> docker-compose.deploy.yml build.args
-> frontend/Dockerfile.prod ARG/ENV
-> npm run build
-> browser bundle
```

The current frontend variable is:

``` text
VITE_CLERK_PUBLISHABLE_KEY
```

Clerk publishable keys are intentionally browser-visible. Secret Clerk
keys must never be exposed through `VITE_*` variables.

Backend Clerk JWT configuration is runtime configuration:

``` text
CLERK_ISSUER
CLERK_AUTHORIZED_PARTIES
```

Local and test currently use the Clerk Development instance. Production
uses a separate Clerk Production instance when activated. Environment
values must be replaced with the real production issuer/publishable key
before production authentication is enabled.

The Platform test deployment has verified Clerk frontend initialization
and interactive sign-in/sign-out at `test.alanwilliams.app`.

Local end-to-end backend JWT validation is now proven. A signed-in React
client obtains a real Clerk session token and calls the Platform backend
with `Authorization: Bearer <token>`. Spring Security validates the Clerk
JWT locally, the shared security library extracts the Clerk user ID from
`sub`, and the Platform controller receives it as `ClerkPrincipal`.

The protected Platform proof endpoint is now consistently exposed under
the Platform servlet context path:

``` text
Local:
GET http://localhost:8081/platform/me

Deployed test:
GET https://api-test.alanwilliams.app/platform/me

-> authenticated Clerk JWT
-> 200
-> {"clerkUserId":"user_..."}
```

Platform owns `server.servlet.context-path=/platform`, matching Agenda's
service-prefix pattern. Frontend API configuration therefore includes the
`/platform` base path in local and deployed environments.

CORS policy is owned by the Platform application rather than the shared
security library. Local development currently allows the intended frontend
origins, including `http://localhost:5174`, and permits authenticated
browser requests with the `Authorization` header. OPTIONS preflight
requests are permitted so browser requests can reach authenticated routes.

Deployed test backend JWT acceptance is now proven end to end. A signed-in
user at `test.alanwilliams.app` obtains a real Clerk token and successfully
calls `https://api-test.alanwilliams.app/platform/me`. The browser preflight
succeeds, Cloudflare routes `/platform/*` to the Platform test backend, Spring
validates the JWT, and `ClerkPrincipal` returns the Clerk `sub` as the
authenticated Clerk user ID.

## Deployment Model

CI/CD conventions:

``` text
Application repositories
feature branch -> PR to dev -> CI
merge to dev   -> deploy test
dev             -> PR to main -> CI
merge to main  -> deploy production

alanwilliams-database
feature branch -> PR to dev -> CI
dev             -> PR to main -> CI
merge to main  -> deploy shared PostgreSQL configuration
```

Self-hosted GitHub Actions runners on the Ubuntu server:

``` text
Agenda   -> app-server
Platform -> alanwilliams-platform-server
Database -> alanwilliams-database-server
```

Each runner is installed as a systemd service, is enabled at boot, and
runs independently for its repository.

Apps and Platform are independently deployable Docker frontend/backend
pairs.

Current deployed topology:

``` text
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

``` text
environment-specific web network
+
alanwilliams-backend
```

Frontend containers attach only to their environment-specific web
network.

Cloudflared attaches to the app/platform web networks and does not need
direct access to the shared backend database network.

Current web networks:

``` text
alanwilliams-agenda-test-web
alanwilliams-agenda-prod-web
alanwilliams-platform-test-web
alanwilliams-platform-prod-web
```

## Shared Infrastructure

``` text
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

-   Windows/Plex PC: `10.0.0.100`

Ubuntu VM:

-   Ubuntu 26.04 LTS
-   `10.0.0.27`
-   Docker Engine

Cloudflare Tunnel exposes services without inbound router ports.

### Local Development

The database runtime is started independently from application stacks:

``` text
alanwilliams-database
-> docker compose up -d
```

Then Platform, Agenda, or another app can be run independently against
it. Running Platform locally does not require Agenda containers to be
running, and running Agenda locally does not require Platform
application containers solely to obtain PostgreSQL.

### Database Creation

Adding a new application does not require another PostgreSQL container.
Create the application's database in the shared PostgreSQL instance,
then allow that application repository to own all schema evolution
through its Flyway migrations.

### Backup / Restore Direction

Production backups are logical PostgreSQL backups using `pg_dump -Fc`.
Backup and restore operations belong operationally to
`alanwilliams-database`, even though each application owns the contents
and retention requirements of its own database.

Backups target explicit application databases and do not rely on copying
PostgreSQL container filesystem contents.

The existing proven Agenda backup/restore discipline should be preserved
as backup coverage expands to Platform and future production databases.

## Shared Frontend / App Launcher Direction

`alanwilliams.app` becomes the platform frontend.

Initial responsibilities:

-   Clerk sign-in/account experience
-   authenticated landing page
-   app launcher
-   account/profile access

Future app launcher experience:

``` text
AlanWilliams Apps
- Agenda
- Budget
- Chores
- Goals
- Fitness
```

Access display may eventually be driven by app
availability/authorization metadata, but that contract is not yet
finalized.

## Shared UI Convention

AlanWilliams Apps use one shared responsive visual system with
app-specific identity applied selectively.

### Frontend Toolkit

Shared frontend standard:

-   React + TypeScript + Vite
-   Bootstrap for responsive layout, utilities, forms, and component
    mechanics
-   Font Awesome for the shared icon vocabulary
-   AlanWilliams semantic design tokens layered over Bootstrap
-   mobile-first implementation and testing

### App Identity Colors

Current app identity direction:

``` text
Platform     Navy
Agenda       BYU Royal Blue
Budget       Green
Chores       Gold
Fitness      Dark Red
```

Each app defines one primary identity color:

``` text
--app-primary
```

The app primary color is intentionally limited to a small portion of the
interface so pages remain visually calm and consistent.

Use the app primary color for:

-   app logo/icon
-   primary actions
-   top-header navigation hover/active text
-   desktop side-navigation background
-   mobile bottom-navigation background

Do not use the app primary color for generic links, tags, dropdowns, or
secondary actions.

### Shared Header

The top header uses the shared light/dark system surface rather than an
app-colored background.

Header behavior:

``` text
background         -> shared light/dark surface
normal text        -> shared text color
hover nav text     -> app primary color
active nav text    -> app primary color + bold
primary/sign-in    -> app primary button treatment
```

Navigation item width should reserve space for its bold state so
hover/active changes do not shift adjacent items.

When signed out, the left brand area behaves as a normal home link.

When signed in, the same app identity area may become the app switcher.

### Desktop Side Navigation

Desktop app navigation uses the app primary color as the side-navigation
surface.

``` text
background         -> app primary
inactive icon/text -> soft white
hover              -> white foreground + subtle white wash
active             -> white surface + app-primary icon/text
```

The side navigation remains fixed/sticky while the page content area
scrolls.

### Mobile Bottom Navigation

Mobile app navigation uses the same app-primary treatment as desktop
side navigation.

``` text
background         -> app primary
inactive icon/text -> soft white
hover              -> white foreground + subtle white wash
active             -> white surface + app-primary icon/text
```

The mobile bottom navigation remains pinned to the bottom of the app
shell while page content scrolls.

General mobile navigation guideline:

``` text
Home + up to 3 primary destinations + More
```

### App Logo Treatment

App logos use their native app identity color without a background
container.

Light mode:

``` text
native app-color logo
transparent background
```

Dark mode:

``` text
same native app-color logo
transparent background
```

Separate light/dark app-logo variants are not required.

Platform is the exception because the navy `W` does not have sufficient
contrast on the selected dark-mode surface:

``` text
Platform light mode -> navy W asset
Platform dark mode  -> white W asset
```

Use explicit light/dark Platform logo assets rather than CSS color
inversion.

### Appearance

Global appearance choices:

``` text
System (default)
Light
Dark
```

Appearance ownership is split deliberately:

``` text
Anonymous visitor
-> ThemeProvider + localStorage own the local preference

Authenticated user
-> Platform Person.appearance_mode is the cross-device source of truth
-> ThemeProvider/localStorage provide immediate local application/cache
```

The frontend loads `/platform/me` through a shared `ProfileProvider`. After an
authenticated Person is loaded, the saved `appearanceMode` is applied to the
shared `ThemeProvider`. Signed-in appearance changes update both local theme
state and `PATCH /platform/me`; signed-out appearance changes remain local
only.

The shared dark theme uses a navy/blue-toned surface family rather than
charcoal/black because it provides better contrast and visual
compatibility with the BYU Royal Agenda identity.

Exact surface values remain design tokens and may evolve without
changing the overall contract.

### Primary Actions

Primary actions use the current app's identity color.

Light mode:

``` text
normal -> app-primary fill + white text
hover  -> white fill + app-primary border/text
```

Dark mode:

``` text
normal -> app-primary fill + white text
hover  -> white fill + app-primary text
```

### Secondary Actions

Secondary actions use shared AlanWilliams light/dark tokens rather than
the app identity color.

They remain visually distinct from primary actions and should always
have a visible border at rest.

Neutral actions such as Cancel, Close, and Back may remain neutral/gray
when appropriate.

### Links

Generic links use a shared accessible blue treatment rather than the
current app identity color.

This prevents ordinary links from becoming visually aggressive in apps
whose primary identity is red, gold, or green.

Links use separate light/dark shared tokens:

``` text
--aw-link
--aw-link-hover
```

### Tags / Pills

User-defined or ordinary organizational tags use one shared neutral
light/dark pill treatment.

Do not allow users to assign arbitrary tag colors.

Conceptual shared tag tokens:

``` text
--aw-tag-text
--aw-tag-bg
--aw-tag-border
```

Tags communicate categorization by text, not by custom color.

### Semantic Badges

Controlled semantic states may use dedicated system-defined colors
independent of app identity.

Examples:

``` text
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

Semantic color palettes must be designed for both light and dark mode
and should not be derived from the app primary color.

### Dropdowns

Dropdown surfaces, text, borders, and selection behavior use shared
light/dark tokens.

Dropdowns do not inherit app-specific background colors.

### Shared Semantic Tokens

Shared UI should prefer semantic variables such as:

``` text
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

``` text
--app-primary
```

This separation keeps shared components consistent while allowing app
identity to remain obvious through logos, navigation surfaces, and
primary actions.

## Documentation Ownership

Cross-repo contracts are documented here.

Repo-specific architecture documents consume those contracts and should
not duplicate them in full.

If a repo-specific document conflicts with this document on a cross-repo
concern, update the documents together; the Platform architecture is the
intended source of truth for that boundary.

## Current Locked Decisions

-   Application repositories use PR-gated CI: feature branches merge to
    `dev`, `dev` deploys test, and `main` deploys production.

-   `alanwilliams-database` deploys the shared PostgreSQL configuration
    only from `main`; merges to `dev` validate but do not redeploy the
    shared runtime.

-   Repository-scoped self-hosted GitHub Actions runners run as
    reboot-enabled systemd services on the Ubuntu server.

-   Production backup policy is per database: Agenda/Fitness/Chores are
    weekly-only with four retained weekly backups; Platform/Budget use
    seven retained daily backups plus four retained weekly backups.

-   Production logical backups are stored first on the Windows physical
    backup disk over SMB and copied off-site to Google Drive with
    rclone.

-   Test databases do not receive routine scheduled backups.

-   `alanwilliams-database` owns the shared PostgreSQL runtime,
    persistent volume, shared backend Docker network, and database-level
    backup/restore tooling.

-   Individual app repositories do not own separate PostgreSQL
    containers.

-   Each app still owns its own separate database and Flyway migrations.

-   Local Platform development uses `platform_dev -> platform_dev_app` on the
    shared local PostgreSQL runtime. The Platform backend connects from Docker at
    `jdbc:postgresql://postgres:5432/platform_dev`.

-   Platform local Compose builds/starts use
    `docker compose --env-file ./backend/.env.local up -d --build` so backend
    runtime datasource and Clerk variables are loaded explicitly. GitHub Packages
    Maven credentials remain separate BuildKit build secrets.

-   Spring Boot 4 Platform Flyway integration uses `spring-boot-flyway` with
    `flyway-database-postgresql`; Platform migrations live under
    `backend/src/main/resources/db/migration`.

-   App backend containers connect to shared PostgreSQL over the
    external `alanwilliams-backend` network using `postgres:5432`.

-   Local app stacks can run independently against the shared database
    runtime; running one app does not require running all other app
    containers.

-   Clerk owns authentication, credential/security management, recovery, and active sessions. Platform delegates account-security UI to Clerk rather than implementing passwords/MFA/passkeys/session management.

-   Platform owns canonical Person.

-   One Person is shared across all connected apps.

-   Platform Person `name` is required; missing names are collected during
    onboarding rather than represented as null/fake email-derived names.

-   Platform Person may store a nullable preferred IANA timezone; app/domain
    events own their own timezone semantics independently.

-   Platform notification email is contact/delivery data, not an app-wide opt-in. Each app owns its own email-notification preferences.

-   `/platform/me` is the authenticated Platform profile contract and returns DTOs rather than JPA entities.

-   Frontend account/profile state is shared through `ProfileProvider`; Platform Person appearance is authoritative after sign-in while `localStorage` preserves immediate/anonymous theme preference.

-   Platform Java persistence standardizes Lombok for boilerplate reduction, favoring `@Getter` on JPA entities and explicit domain mutation methods over broad setters/`@Data`.

-   Email may discover an unclaimed Person but never silently establishes
    identity. Person claim/linking requires explicit confirmation and authenticated
    Clerk identity.

-   Active Clerk sessions never auto-accept invitations or auto-link Persons;
    invitation confirmation must expose a `Not me` / switch-account path.

-   Once a Person is linked to Clerk, ordinary app admins cannot edit the
    canonical Platform name or notification email.

-   App memberships own contextual display names. Admin-supplied membership names
    are snapshots and do not automatically track later Platform name changes.

-   App databases remain separate and own domain authorization/data.

-   Each Java backend validates Clerk JWTs locally.

-   Shared Clerk/Spring plumbing belongs in a reusable library, not a
    central auth microservice.

-   Reusable AlanWilliams Java libraries are published as Maven artifacts
    through GitHub Packages rather than copied into consumer repositories.

-   Cross-repository Maven package consumption uses authenticated GitHub
    Packages access; consumer build credentials are passed to Docker with
    BuildKit secrets and are not included in runtime images.

-   Consumer applications own their `SecurityFilterChain`, route-level
    authorization, and CORS policy; the shared security library owns generic
    Clerk JWT validation and principal extraction.

-   Local and deployed-test Platform authentication have proven the complete
    browser-to-backend Clerk JWT path: frontend token acquisition, CORS
    preflight, Cloudflare path routing, Spring JWT validation, and Clerk user
    ID principal extraction.

-   Platform owns the Spring servlet context path `/platform`; Agenda owns
    `/agenda`. Cloudflare uses these prefixes to route the shared API hostname
    to the correct backend while preserving the original request path.

-   Vite Clerk publishable keys are injected at frontend build time through
    Compose build arguments; backend Clerk issuer/authorized-party values
    are runtime environment configuration.

-   Local/test Clerk authentication uses the Development Clerk instance;
    production uses a separate Production Clerk instance.

-   Platform backend is separately deployable as its own Docker
    image/container.

-   Shared top headers use light/dark system surfaces; app identity
    appears in hover/active text and primary actions.

-   Desktop side navigation and mobile bottom navigation use the current
    app primary color with white foreground and white active-item
    surfaces.

-   App logos use native app colors on transparent backgrounds in both
    light and dark mode.

-   Platform uses a navy W in light mode and a white W in dark mode.

-   Shared secondary actions, generic links, tags, dropdowns, and page
    surfaces are not app-themed.

-   Generic links use shared accessible blue tokens; tags use shared
    neutral pills without user-configurable colors.

-   Semantic badges/priorities use controlled system colors independent
    of app identity.

-   Repositories use the `alanwilliams-` prefix.

-   Documentation is split by repo with unique filenames.

-   One ChatGPT Project can hold the ecosystem docs so cross-repo
    context remains available.

App Catalog

Platform owns a small static application catalog for app identity and
reachability metadata.

Current conceptual catalog fields:

appKey
name
subdomain
status

Current app keys:

platform
agenda
budget
chores
fitness

Java/database enum values may remain uppercase internally, but the
external API contract uses lowercase app keys.

Current statuses:

AVAILABLE
COMING_SOON

Current catalog direction:

platform -> AVAILABLE
agenda   -> AVAILABLE
budget   -> COMING_SOON
chores   -> COMING_SOON
fitness  -> COMING_SOON

Public Catalog API

GET /platform/apps

This endpoint is public/read-only and does not require Clerk
authentication.

The servlet context is /platform, so Spring Security matches the route
as GET /apps.

The public catalog is used by the Platform homepage for discovery. It is
distinct from Person-specific /platform/account/apps.

Catalog Ownership Split

Backend catalog owns:

app identity/key

display name

subdomain identity

availability/status

Frontend owns:

icon assets

marketing descriptions

theme/color

visual presentation

Environment-specific absolute URLs are not stored in the backend
catalog.

Environment-Aware Cross-App URLs

Cross-app navigation resolves the catalog subdomain in the browser
according to the current environment.

Local frontend ports:

Platform -> 5174
Agenda   -> 5173

Local backend ports:

Platform -> 8081
Agenda   -> 8080

URL resolution contract:

local/private LAN:
preserve current hostname
platform -> :5174
agenda   -> :5173

test:
platform -> https://test.alanwilliams.app
agenda   -> https://agenda-test.alanwilliams.app
other app -> https://<subdomain>-test.alanwilliams.app

production:
platform -> https://alanwilliams.app
app      -> https://<subdomain>.alanwilliams.app

Unknown environments must fail closed. The resolver must never use
production as a fallback.

This preserves local/test/prod data isolation during cross-app
navigation.

Person App Preferences / My Apps

Flyway V2 adds person_app_preference.

Conceptual fields:

id
person_id
app_key
enabled
sort_order
is_default
created_at
updated_at

Constraints:

unique (person_id, app_key)

at most one is_default = true row per Person

nonnegative sort order

Authenticated API:

GET   /platform/account/apps
PATCH /platform/account/apps/{appKey}/enabled
PATCH /platform/account/apps/{appKey}/default
PATCH /platform/account/apps/order

Mutation endpoints return the full updated effective state so the
frontend can honor server-side effects.

Preference Semantics

My Apps is a launcher/navigation preference. It is not authorization.

app memberships/roles remain app-owned

Platform is the implicit default initially

only one default/star exists at a time

Platform does not need to be enabled to remain default

starring a non-Platform app automatically enables it

disabling the current non-Platform default falls back to Platform

disabling a non-default app does not change the default

Platform may be disabled in the switcher while remaining default

invitation acceptance automatically enables the invited app

invitation acceptance never silently changes the default

My Apps displays only catalog apps whose status is AVAILABLE.
COMING_SOON apps remain in the catalog but are hidden from the
personal launcher until launch.

My Apps UX

Current behavior:

checkbox = include/show app in cross-app switcher

app name

star = default destination after normal Platform sign-in

drag handle at far right

rows use each app's primary theme color

immediate save; no Save button

checkbox and star persist immediately

drag reorders optimistically and persists once on drop

failure restores server-confirmed state

save status uses Saving…, brief ✓ Saved, or
Couldn't save changes

save status is announced with aria-live="polite"

dnd-kit provides desktop and touch drag/drop

--aw-shadow-md is a shared design token for stronger drag
elevation

Where to Next

The My Apps page provides navigation after preference changes:

Back appears only when a meaningful validated origin exists

Continue goes to the current default app

new-account onboarding has no synthetic Back action and should
emphasize Continue

mobile actions stack; desktop places Back left and Continue right

Cross-domain return origins require an allowlisted contract before they
are accepted. Arbitrary absolute returnTo URLs must never be allowed.

Authentication Navigation Precedence

Default app preference is a post-login destination, not a generic
authenticated redirect.

Never redirect simply because isSignedIn became true.

After authentication:

explicit validated returnTo, invitation, or requested route wins

normal Platform sign-in with no explicit destination goes to the
Person's default app

already-authenticated direct navigation stays exactly where the user
navigated

Special cases:

brand-new Person with no invitation -> My Apps first-run
configuration

invitation flow -> invitation destination wins; do not detour to My
Apps

already signed-in user visiting alanwilliams.app -> stay on
Platform

direct /account/apps -> stay on My Apps

Public Platform Homepage

The Platform root page is the public app discovery/front-door surface.

Current design:

prominent AlanWilliams Apps identity

one Sign In / Sign Up entry point when signed out

Available Apps section

Coming Soon section

cards are centered when a row contains fewer than three apps

available app cards navigate directly to that app using the
environment-aware URL resolver

coming-soon cards are informational/non-navigable

Platform itself is omitted from app cards because the visitor is
already on Platform

app card descriptions/icons remain frontend presentation metadata

the old public Explore Apps navigation/page is retired from
routing/navigation

The old Apps page file is intentionally retained as a reference-only
visual/theme experiment for future app shell work, especially when
bringing Agenda into the shared Platform visual system.

Deferred / Future Architecture

App-Owned Invitation Integration

Not yet implemented:

Agenda invitation token flow

Platform claim endpoint/contract used by Agenda

atomic claim of a pre-provisioned Person from an app invitation

Agenda membership acceptance after successful claim/link

cross-domain return-to/origin contract between app profile menus and
Platform

Cross-App Switcher

My Apps preference persistence is implemented, but the actual shared
cross-app navigation/switcher still needs to consume those preferences
in Platform and app shells.

The switcher must use the same environment-aware URL resolver and must
not treat launcher preferences as authorization.

New-App Launch Promotion

Future idea; do not implement yet.

When a new app launches, normal sign-in may show at most one prospective
app-discovery promo:

existing users may become eligible for a newly launched app promo

new users should not receive a backlog of historical promos

at most one promo is shown per normal login

dismiss/action marks it seen

Try/Add may enable the app in My Apps

it does not change the default unless the user explicitly chooses
that

invitation/explicit return destination takes precedence over promos

a newly created Person should baseline current promo versions so old
promos are not replayed

A future implementation may add catalog promoVersion metadata plus
per-Person/app promo state.

Person Merge

Distributed Person merge/reconciliation remains deferred until the
cross-app coordination contract is designed.

Documentation Ownership

Cross-repository architecture decisions belong here. Repo-specific
documents should consume these contracts without duplicating domain
internals.
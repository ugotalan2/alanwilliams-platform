# AlanWilliams Platform - Project Overview

## Purpose

`alanwilliams-platform` is the shared platform for the AlanWilliams Apps
ecosystem.

It owns the cross-application account experience and canonical platform
identity used by connected apps such as Agenda, Budget, Chores, Goals,
and Fitness.

The platform is not intended to contain the detailed domain logic of
each application. Each app remains independently deployable and owns its
own domain data, settings, permissions, and workflows.

## Domain

Primary platform domain:

``` text
alanwilliams.app
```

Application domains:

``` text
agenda.alanwilliams.app  -> Agenda
budget.alanwilliams.app  -> Budget
chores.alanwilliams.app  -> Chores
goals.alanwilliams.app   -> Goals (planned)
fitness.alanwilliams.app -> Fitness (possible/planned)
```

Shared API convention:

``` text
Production: api.alanwilliams.app/<service>/...
Test:       api-test.alanwilliams.app/<service>/...
```

Examples:

``` text
/api routing concept
/agenda/...
/platform/...
/budget/...
```

## Platform Vision

AlanWilliams Apps should feel like one connected product family even
though individual apps are independently deployable and may use separate
databases.

The target experience is:

``` text
one Clerk login
-> one canonical AlanWilliams Person
-> one global profile / appearance preference
-> multiple connected apps
-> app/context-specific memberships, display names, permissions, settings, and data
```

The platform landing page will initially provide sign-in/account
functionality and route users to available apps. As more apps launch, it
becomes the authenticated app launcher.

## Canonical Person Direction

`Person` is a platform-owned identity shared across all AlanWilliams
Apps.

A person represents the same human everywhere:

``` text
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

-   Clerk owns authentication and login credentials.
-   The Platform owns the canonical AlanWilliams `Person` identity.
-   A person can exist before they create a Clerk account.
-   Clerk user ID becomes the durable authentication link after verified
    account linking.
-   Email may help discover or claim an existing person, but email alone
    is not the durable identity key.
-   Person merge/reconciliation is a platform concern because duplicate
    identity can affect multiple apps.
-   There is no globally searchable public AlanWilliams user directory.

Current Platform profile direction:

``` text
Person
- required canonical name
- notification/contact email
- preferred IANA timezone (nullable; device/browser timezone when unset)
- global appearance mode: SYSTEM | LIGHT | DARK
- Clerk user linkage
- status / merge metadata
```

The notification email is Platform-owned and is where AlanWilliams Apps
notifications are sent. Changing it does not change Clerk sign-in
identity.


### Account Claim Direction

Applications may provision a Person before that person has a Clerk account. A
secure invitation/claim flow links that existing Person to a Clerk user later.
Email matching may privately help locate an invitation, but matching email alone
never performs the permanent identity link.

Invitation acceptance is explicit even when a Clerk session is already active.
The confirmation screen identifies the signed-in account and offers a `Not me` /
switch-account path to protect shared computers. Once linked, the account owner
controls canonical Platform name and notification email; app admins retain control
only over app memberships, roles/permissions, and contextual display names.

### Context-Specific Display Names

The Platform name is the canonical cross-app name. Apps may own a separate
contextual display name where a social/group context exists:

``` text
Platform Person.name = Alan Williams

Agenda / SCV Ward membership
-> display_name = Bishop

Agenda / Family Council membership
-> display_name = Dad

Budget / household membership
-> display_name = Alan

Chores / household membership
-> display_name = Dad
```

For managed memberships, the app snapshots the admin-supplied display name when
the membership is created. If a new Platform Person is provisioned at the same
time, that same value may seed `Person.name`, but the Platform name and app display
name are independent afterward. A later Platform name change does not silently
change the app display name.

Apps may allow member-requested display-name changes subject to app-admin approval.
Display-name overrides belong to the app membership/context that needs them, not
to the Platform Person.

## Shared vs App-Specific Ownership

Platform-owned concerns:

-   canonical Person
-   Clerk user-to-Person linkage
-   global account/profile information
-   identity reconciliation and merge state
-   app launcher/account experience
-   cross-app identity contracts
-   shared platform-level preferences when they are genuinely global

App-owned concerns:

-   memberships
-   domain roles and permissions
-   domain-specific preferences
-   app workflows
-   app data
-   app-specific authorization

For example, Agenda owns organization/meeting permissions and Budget
will own budget/workspace permissions.

## Repository Convention

Connected repositories use the `alanwilliams-` prefix.

Current/planned naming:

``` text
alanwilliams-platform
alanwilliams-agenda
alanwilliams-database
alanwilliams-budget
alanwilliams-chores
alanwilliams-spring-security
```

`alanwilliams-database` owns the shared PostgreSQL runtime and
database-level operations. Individual app repositories still own their
own databases and schema migrations.

Repo names represent a deployable product or a clearly reusable platform
component.

## Documentation Convention

The ChatGPT Project may contain documents from multiple repositories.
Markdown filenames are therefore unique across the ecosystem rather than
relying on repeated names such as `ARCHITECTURE.md`.

Platform documents:

``` text
ALANWILLIAMS_PLATFORM_OVERVIEW.md
ALANWILLIAMS_PLATFORM_ARCHITECTURE.md
```

Repo-specific documents use the same pattern, for example:

``` text
ALANWILLIAMS_AGENDA_OVERVIEW.md
ALANWILLIAMS_AGENDA_ARCHITECTURE.md
ALANWILLIAMS_SPRING_SECURITY_OVERVIEW.md
ALANWILLIAMS_SPRING_SECURITY_ARCHITECTURE.md
```

Documentation ownership rule:

> Platform docs define cross-repo contracts. Repo docs define the
> internals of that repo.

Detailed app-domain documentation should not be duplicated into the
Platform architecture.

## Current Infrastructure

The current deployed application infrastructure is self-hosted.

Physical host:

-   Windows/Plex PC at `10.0.0.100`
-   Intel i5-12600K, 32 GB RAM, RX 6700 XT 12 GB, \~12 TB storage
-   Physical backup location: `D:\ServerBackups`

Ubuntu VM:

-   Ubuntu 26.04 LTS
-   VirtualBox
-   reserved LAN IP `10.0.0.27`
-   Docker Engine
-   America/Chicago timezone

Shared infrastructure includes:

-   PostgreSQL 17 in Docker
-   Cloudflare DNS and Tunnel
-   shared `alanwilliams-backend` Docker network
-   per-app test/prod web networks
-   GitHub Actions deployment
-   physical-disk backups plus Google Drive off-site copies

The current infrastructure was proven through Ubuntu VM reboot and full
physical Windows-host reboot recovery.

## Authentication Direction

Clerk is the shared identity and SSO provider.

AlanWilliams Apps will not store passwords, password hashes, recovery
credentials, or implement its own authorization server.

Each Java backend validates Clerk JWTs locally. Reusable Spring Security
integration belongs in `alanwilliams-spring-security`.

The Platform backend then resolves authenticated Clerk identity to
canonical Platform Person when needed.

## Shared Database Runtime

The shared PostgreSQL runtime is now owned by:

``` text
alanwilliams-database
```

Production container:

``` text
alanwilliams-postgres
```

Shared internal hostname:

``` text
postgres:5432
```

Shared network:

``` text
alanwilliams-backend
```

Current deployed databases:

``` text
agenda_prod
agenda_test
platform_prod
platform_test
```

Current local Platform development database:

``` text
platform_dev -> platform_dev_app
```

Apps use dedicated per-environment database roles:

``` text
agenda_prod     -> agenda_prod_app
agenda_test     -> agenda_test_app
platform_prod   -> platform_prod_app
platform_test   -> platform_test_app
```

`postgres_admin` is reserved for database administration, database
creation, and backup/restore operations. Application backends must not
run as `postgres_admin`.

Each app owns its own Flyway migrations and schema. Platform local development
now has Flyway proven against `platform_dev`; Spring Boot 4 uses
`spring-boot-flyway` plus `flyway-database-postgresql`, with migrations under
`backend/src/main/resources/db/migration`. PostgreSQL cross-database foreign keys
are not assumed.

Cross-database person references are platform Person IDs by application
contract rather than PostgreSQL foreign keys across separate databases.

Production backup policy:

``` text
Weekly only (retain 4 weekly):
- agenda_prod
- fitness_prod
- chores_prod

Daily + weekly:
- platform_prod -> retain 7 daily + 4 weekly
- budget_prod   -> retain 7 daily + 4 weekly
```

Only live production databases are enabled in the scripts. Backups are
PostgreSQL custom-format logical dumps (`pg_dump -Fc`), stored on the
Windows physical backup disk over SMB and copied to Google Drive with
rclone. Test databases are not routinely backed up.

## Shared UI / Branding

One mobile-first responsive design language connects the apps while
allowing app-specific accent identity.

Shared frontend toolkit:

-   React + TypeScript + Vite
-   Bootstrap
-   Font Awesome
-   AlanWilliams semantic design tokens

App identity colors:

``` text
Platform  -> Navy
Agenda    -> BYU Royal Blue
Budget    -> Green
Chores    -> Gold
Fitness   -> Dark Red
```

Global appearance:

``` text
System (default)
Light
Dark
```

Shared shell rules:

-   top header uses shared light/dark surface
-   header navigation hover/active uses the current app identity color
-   primary actions use the app identity color
-   secondary actions, generic links, tags, dropdowns, and page surfaces
    use shared light/dark tokens
-   desktop side nav and mobile bottom nav use app-primary backgrounds
-   inactive side/bottom nav foreground is soft white
-   active side/bottom nav item is white with app-primary icon/text
-   app icons use transparent backgrounds
-   Platform uses a navy W in light mode and a white W in dark mode

Signed-out Platform header:

``` text
Apps / About / Contact
Appearance icon
Sign In
```

Signed-in Platform header:

``` text
Apps / About / Contact
Profile icon
```

Appearance moves into the Profile dropdown when signed in. The
Appearance submenu shows the current System/Light/Dark icon/value and
closes only its nested submenu when a selection is made.

Profile page direction:

-   canonical name
-   notification email
-   account security
-   name/email use lightweight edit icons
-   security uses an explicit Manage Security action
-   Clerk remains responsible for sign-in methods, passwords/passkeys,
    MFA, and sessions

Mobile-first behavior has been tested on an actual phone as well as
browser responsive mode.

Shared account/auth navigation preserves a validated `returnTo` URL so
users return to the app page they came from after signing in or changing
profile/preferences.

Direct app entry is always supported. Showing an app in `My Apps` is
only a launcher preference and does not control authorization.

The Platform public site is an informational front door with
Home/About/Apps/Contact and sign-in entry points; the root page is not
merely a login screen.

First-use onboarding may offer apps to add to `My Apps` and a default
post-login destination. Newly launched apps may be presented later with
a one-time opt-in discovery prompt.

Shared UI should use semantic design tokens rather than hard-coded
Bootstrap colors.

## Technology Baseline

Shared implementation baseline:

``` text
Java             25 LTS
Spring Boot      4.1.x
Maven            3.9.x
Node.js          24.x LTS
npm              11.x
React            19.2.x
React Router     7.x
TypeScript       6.0.x
Vite             8.2.x
Bootstrap        5.3.x
Font Awesome     7.3.x
Vitest           4.x
PostgreSQL       17
```

New work uses the newest stable supported baseline with preference for
LTS runtimes. Exact patch versions are repository/package-lock concerns;
Platform architecture owns major/minor baseline decisions.

## Current Status

Agenda is currently the production application and is running
successfully in test and production on the self-hosted server. Its
repository, runner, Compose projects, containers, and web networks have
been migrated to the standardized `alanwilliams-agenda-*` naming.

The Platform repo now has:

``` text
/frontend
/backend
```

Platform is now deployed in both test and production:

``` text
alanwilliams-platform-test-frontend-1
alanwilliams-platform-test-backend-1

alanwilliams-platform-prod-frontend-1
alanwilliams-platform-prod-backend-1
```

Both backend containers attach to:

``` text
their environment web network
+
alanwilliams-backend
```

Local Platform development uses the shared local PostgreSQL runtime with:

``` text
platform_dev -> platform_dev_app
```

The normal local Platform build/start command is:

``` text
docker compose --env-file ./backend/.env.local up -d --build
```

`backend/.env.local` supplies backend runtime datasource/Clerk variables. Maven
GitHub Packages credentials used to fetch `alanwilliams-spring-security` remain
BuildKit build secrets and are not runtime environment values.

Cloudflared is attached to the Platform and Agenda test/prod web
networks.

## Shared Java Library Delivery

Reusable Java libraries are versioned Maven artifacts published through
GitHub Packages. Platform consumes
`com.alanwilliams:alanwilliams-spring-security` from that registry.
Consumer builds authenticate with package-read credentials, while the
security repository publishes with package-write permission. Docker build
credentials are delivered through BuildKit secrets and are not retained in
the runtime image.

## Shared Authentication Status

Clerk remains the shared identity and SSO provider.

AlanWilliams Apps will not store passwords, password hashes, recovery
credentials, or implement its own authorization server.

The Platform frontend now uses Clerk authentication state and supports
real sign-in/sign-out. The test deployment at `test.alanwilliams.app` has
verified Clerk initialization and interactive sign-in/sign-out using the
Clerk Development instance.

Reusable Spring Security integration is implemented in
`alanwilliams-spring-security` and consumed by Platform as a Maven
artifact from GitHub Packages. Each Java backend validates Clerk JWTs
locally, while each consumer application owns its own
`SecurityFilterChain` and route authorization.

Deployment configuration is split intentionally:

``` text
Frontend build-time:
VITE_CLERK_PUBLISHABLE_KEY

Backend runtime:
CLERK_ISSUER
CLERK_AUTHORIZED_PARTIES
```

Frontend build-time values flow from the server environment file through
Compose build arguments into `Dockerfile.prod` before `npm run build`.
GitHub Packages credentials are supplied to backend Docker builds with a
BuildKit secret rather than being copied into the image.

Protected Platform authentication is now proven end to end in both local and
deployed test environments:

``` text
Clerk signed-in React client
-> getToken()
-> Authorization: Bearer <token>
-> /platform/me
-> Cloudflare path routing in deployed environments
-> Platform Spring Security
-> Clerk JWT validated locally
-> ClerkPrincipal extracted from sub
-> 200 {"clerkUserId":"user_..."}
```

Verified endpoints:

``` text
Local:         http://localhost:8081/platform/me
Deployed test: https://api-test.alanwilliams.app/platform/me
```

Platform now owns `server.servlet.context-path=/platform`, matching Agenda's
`/agenda` service-prefix pattern. Cloudflare routes `/platform/*` to the
Platform backend and `/agenda/*` to the Agenda backend while preserving the
request path.

The Platform application owns CORS configuration for its frontend/backend
boundary. Local and deployed-test browser preflight/authenticated requests
are working. The shared `alanwilliams-spring-security` library remains
responsible for generic Clerk JWT validation and principal extraction, not
app-specific CORS or route policy.

The Platform Person persistence foundation is now implemented locally:

-   `V1__create_person.sql` is the first Platform Flyway migration
-   local `platform_dev` uses least-privilege role `platform_dev_app`
-   Flyway successfully created the `person` table in local PostgreSQL
-   the Person schema includes required name, nullable notification email/timezone,
    appearance mode, nullable unique Clerk user ID, status/merge metadata, and
    timestamps

The next authentication/identity work is:

-   implement Java `AppearanceMode` and `PersonStatus` enums
-   implement the Platform `Person` JPA entity and repository/service layer
-   resolve/link authenticated Clerk users to Platform Person with explicit claim rules
-   persist Platform profile and appearance settings
-   then integrate Agenda with the same identity/invitation contract

Verified:

-   Agenda test and production deployments
-   Platform test and production frontend/backend deployments
-   PR-gated Platform CI with automatic test deployment from `dev` and
    production deployment from `main`
-   shared PostgreSQL 17 runtime owned by `alanwilliams-database`
-   `alanwilliams-database` CI and automatic deployment from `main`
-   repository-scoped Agenda, Platform, and Database self-hosted runners
    running as reboot-enabled systemd services
-   dedicated Agenda and Platform test/prod databases and
    least-privilege app roles
-   shared `alanwilliams-backend` Docker network
-   Cloudflare connectivity for Agenda and Platform web networks
-   Platform responsive shell/profile UI
-   local Platform Docker development and backend database connectivity
-   local `platform_dev -> platform_dev_app` least-privilege runtime connection
-   Platform Flyway V1 execution and local `person` table creation
-   Spring Boot 4 Flyway integration using `spring-boot-flyway` and
    `flyway-database-postgresql`
-   local Platform Compose runtime configuration loaded with
    `docker compose --env-file ./backend/.env.local up -d --build`
-   Clerk frontend integration with real sign-in/sign-out
-   Clerk test deployment sign-in/sign-out at `test.alanwilliams.app`
-   local protected Platform API call with a real Clerk JWT
-   deployed-test protected Platform API call through
    `https://api-test.alanwilliams.app/platform/me` with a real Clerk JWT
-   local and deployed-test authenticated Clerk user ID principal extraction
    via `ClerkPrincipal`
-   local and deployed-test CORS preflight/authenticated browser request path
-   Cloudflare path routing for shared API hostnames using `/platform/*` and
    `/agenda/*` service prefixes
-   Platform Spring servlet context path `/platform`
-   reusable `alanwilliams-spring-security` library consumed by Platform
-   GitHub Packages publication/consumption for shared Maven libraries
-   BuildKit secret delivery of Maven package credentials during Docker builds
-   frontend build-time Clerk publishable-key injection for deployed Vite builds
-   PostgreSQL admin credential rotation and app-role isolation
-   production backup scripts with per-database daily/weekly policy
-   physical-disk backup storage over SMB plus Google Drive off-site
    copies
-   manual Platform daily backup and Agenda/Platform weekly backup
    execution verified
-   Agenda restore procedure previously proven

Not yet implemented / proven:

-   authenticated Clerk user-to-Platform Person resolution/linkage
-   Java Platform Person entity/repository/service mapping and profile API behavior
-   persisted global appearance preference and notification email
-   Agenda-to-Platform identity integration
-   production Clerk instance activation and production auth verification

## Near-Term Sequence

1.  Implement Platform Person Java enums/entity/repository/service and authenticated
    Clerk-to-Person resolution/linkage.
2.  Evolve `/platform/me` from the Clerk-ID proof endpoint into the real
    Person/profile endpoint and persist appearance/email/timezone preferences.
3.  Integrate Agenda with Platform identity and shared authentication.
4.  Continue Agenda domain/schema migration.
5.  Bring Budget/Finance into the same Platform/auth/identity/database
    model.
6.  Add future production databases to the appropriate backup policy
    when each app goes live.

## Explicitly Deferred

-   Full microservice decomposition merely for scale speculation
-   Dedicated auth database/service separate from Clerk and Platform
    identity
-   Global public user directory
-   Native iOS/Android apps
-   Automated SMS delivery
-   Full Handbook mirroring/catalog synchronization

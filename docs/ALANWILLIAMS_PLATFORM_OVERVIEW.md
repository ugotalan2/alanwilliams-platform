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

The notification email is Platform-owned contact/delivery data. Changing it
does not change Clerk sign-in identity. Whether Agenda or another app actually
sends email is controlled by that app's own notification settings rather than
by the existence of a Platform notification email.


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

Profile page implementation:

-   canonical name with inline edit/save
-   notification email with inline edit/save
-   preferred IANA timezone with inline selection/save
-   global System/Light/Dark appearance preference
-   shared `ProfileProvider` loads and updates `/platform/me` once for account UI
-   signed-in appearance changes persist to Platform Person and local theme state
-   signed-out appearance remains a local `localStorage` preference
-   Account Security uses an explicit Manage Security action that opens Clerk's
    account/security UI
-   Clerk remains responsible for sign-in methods, password/security settings,
    MFA/passkeys when enabled, recovery, and active sessions

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

## Shared UI

Reusable frontend presentation is owned by `alanwilliams-ui` and
published as:

``` text
@ugotalan2/ui
```

Current proven shared package version: `0.5.1`.

Platform is the first proven consumer. Shared UI now supplies
tokens/themes/icons, theme mechanics, account/appearance presentation,
sticky header, footer, `AppShell`, sticky desktop side navigation, and
fixed mobile bottom navigation.

Platform supplies `aw-theme-platform`, causing shared app-navigation
surfaces to resolve through Platform's `--app-primary` navy.

Platform still owns: - public/signed-in layout decisions - Clerk
state/handlers - `ProfileProvider` - `/platform/me` - My Apps - route
definitions - Platform-only pages - persisted appearance

The UI package does not own those behaviors.

## Shared Navigation Behavior

Consuming apps provide an ordered `AppNavItem[]`. Desktop renders all
supplied items in a sticky independently scrollable side nav. Mobile
renders up to five slots; more than five becomes first four plus
generated `More`. Mobile safe-area space is filled by the same
app-primary color and shell content reserves matching clearance.

Footer legal/support content remains separate from app navigation.

Platform is the first consumer/reference implementation. Agenda is the second
consumer used to prove the shared API before future apps adopt it.

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

Protected Platform authentication is proven end to end in both local and
deployed test environments. Locally, `/platform/me` has now evolved into the
real Person/profile API:

``` text
Clerk signed-in React client
-> getToken()
-> Authorization: Bearer <token>
-> /platform/me
-> Platform Spring Security
-> Clerk JWT validated locally
-> ClerkPrincipal extracted from sub
-> linked Platform Person resolved by clerk_user_id
-> profile DTO returned / updated
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

The Platform Person/profile foundation is now implemented locally:

-   `V1__create_person.sql` is the first Platform Flyway migration
-   local `platform_dev` uses least-privilege role `platform_dev_app`
-   Flyway successfully created the `person` table in local PostgreSQL
-   Java `AppearanceMode` / `PersonStatus`, `Person` JPA entity, repository, and
    service layer are implemented
-   Person audit timestamps are maintained through JPA lifecycle callbacks
-   Lombok is standardized for Java boilerplate reduction; JPA entities favor
    `@Getter` plus explicit domain mutation methods
-   authenticated `/platform/me` GET/PATCH resolves the linked Person and returns
    profile DTOs
-   canonical name, notification email, timezone, and appearance mode updates are
    persisted
-   frontend profile editing for name/email/timezone is working
-   shared `ProfileProvider` owns loaded Person/profile state for account UI
-   signed-in appearance changes persist to `Person.appearance_mode`; signed-out
    appearance remains local via `localStorage`
-   Manage Security delegates to Clerk's account/security UI

The next authentication/identity work is Person claim/link onboarding:

-   define the first-use flow after Clerk authentication
-   when a valid invitation/claim token is present, explicitly confirm and link the
    authenticated Clerk user to the pre-provisioned Person
-   do not silently link by matching email alone
-   when no invitation/claim exists, collect any required Platform profile data and
    create a new canonical Person linked to the authenticated Clerk user
-   then integrate Agenda invitations/memberships with the same Platform identity contract

### Verified:

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
-   Platform Person enums/entity/repository/service implementation
-   real authenticated `/platform/me` Person/profile GET/PATCH behavior locally
-   inline Platform profile editing for name, notification email, and timezone
-   shared frontend `ProfileProvider` for signed-in Person state
-   persisted signed-in global appearance preference with anonymous/local fallback
-   Clerk-managed account security launched from Platform profile
-   Java 25 Lombok annotation processing configured explicitly in Maven
-   Spring Boot 4 Flyway integration using `spring-boot-flyway` and
    `flyway-database-postgresql`
-   local Platform Compose runtime configuration loaded with
    `docker compose --env-file ./backend/.env.local up -d --build`
-   Clerk frontend integration with real sign-in/sign-out
-   Clerk test deployment sign-in/sign-out at `test.alanwilliams.app`
-   Clerk prod deployment sign-in/sign-out at `alanwilliams.app`
-   local, test and prod protected Platform API call with a real Clerk JWT
-   deployed-test protected Platform API call through
    `https://api-test.alanwilliams.app/platform/me` with a real Clerk JWT
-   local and deployed-test authenticated Clerk user ID principal extraction
    via `ClerkPrincipal`
-   local and deployed-test/prod CORS preflight/authenticated browser request path
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
-   Clerk sign-in/sign-up/sign-out 
-   local, test, and production Clerk JWT validation
-   production Clerk domain/configuration
-   Platform /platform servlet context
-   Cloudflare test and production API routing
-   Person Flyway V1
-   Person JPA/repository/service/profile DTOs
-   /platform/me GET/PATCH
-   ProfileProvider and inline profile editing
-   persisted signed-in appearance
-   explicit no-Person onboarding state
-   POST /platform/onboarding/create
-   full new-account onboarding locally/test/production
-   Flyway V2 person_app_preference
-   static app catalog
-   lowercase external app-key contract
-   public GET /platform/apps
-   My Apps preference API
-   enable/default/order semantics
-   immediate-save My Apps UI
-   touch/desktop drag reorder
-   environment-aware app URL builder
-   My Apps Continue navigation to local Agenda
-   catalog-driven homepage Available/Coming Soon layout
-   public Explore Apps page/navigation retirement direction
-   shared npm UI package consumption - `@ugotalan2/ui@0.5.1`
    shell/navigation behavior verified on Platform

### Not yet implemented / proven:

-   first-use Person creation and invitation-based claim/link workflow
-   explicit atomic claim rules for linking a previously unclaimed Person to Clerk
-   Agenda-to-Platform identity integration
-   production Clerk instance activation and production auth verification
-   actual signed-in cross-app app switcher using My Apps preferences
-   final normal Platform sign-in redirect to starred/default app
-   allowlisted cross-domain returnTo contract for profile/preferences
    opened from Agenda or another app
-   Agenda adoption of the shared Platform visual shell/theme patterns

## Near-Term Sequence

1. Next cross-app work: 1. adopt the shared UI shell in Agenda 2. complete
Agenda-to-Platform Person invitation/claim integration 3. complete
signed-in cross-app switcher/default routing and safe return-origin
contract
2. Finish the signed-in app switcher and normal post-login default-app
   routing.
3. Define the safe cross-domain return/origin contract used when
   account/profile/My Apps is opened from Agenda.
4. Begin Agenda invitation integration with Platform Person
   claim/linking.
5. Bring Agenda's shell/theme/navigation into the shared Platform
   visual conventions while using the retained Apps reference page.
6. Continue Agenda domain/schema migration after shared
   identity/navigation integration is stable.

## Explicitly Deferred

-   Full microservice decomposition merely for scale speculation
-   Dedicated auth database/service separate from Clerk and Platform
    identity
-   Global public user directory
-   Native iOS/Android apps
-   Automated SMS delivery
-   Full Handbook mirroring/catalog synchronization
-   new-app promo implementation
-   arbitrary external returnTo URLs
-   production fallback from unknown/local/test app URL resolution
-   generic Platform invitation table

## Agenda Invitation Integration

- Agenda app-owned invitation URL/token flow
- Platform claim endpoint/contract for pre-provisioned Persons
- atomic Person claim from Agenda invitation
- invitation confirmation/switch-account UI
- Agenda membership acceptance after claim
- invited-app auto-enable integration
- optional Make Agenda my default app after sign-in choice

## Future Idea: New-App Launch Promo

Discussed but intentionally not implemented.

### Desired future behavior:

- at most one app-discovery promo per normal login
- prospective only; new users do not receive old promo backlog
- existing users may be eligible when a new app launches
- dismiss/action marks promo seen
- Try/Add may enable the app in My Apps
- promo does not silently change the default
- invitation or explicit return destination always wins
- a future implementation may use catalog promoVersion plus
  per-Person/app seen state
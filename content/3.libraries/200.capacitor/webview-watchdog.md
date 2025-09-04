---
title: WebView WatchDog for Capacitor.js
description: Handles situation when there is no WebView installed on user device or app crashes before loading
type: library
platform: Capacitor.js & TypeScript & Java & Android
active: true
github: https://github.com/kduma-autoid/capacitor-webview-watchdog
---

# @kduma-autoid/capacitor-webview-watchdog

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-autoid/capacitor-webview-watchdog" blank}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-autoid/capacitor-webview-watchdog/releases/latest/" blank}

:u-button[NPM]{icon="tabler:brand-npm" href="https://www.npmjs.com/package/@kduma-autoid/capacitor-webview-watchdog" blank}
::

## Install

```bash
npm install @kduma-autoid/capacitor-webview-watchdog
npx cap sync
```

## API

<docgen-index>

* [`ping()`](#ping)
* [`start()`](#start)
* [`stop()`](#stop)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### ping()

```typescript
ping() => Promise<void>
```

Ping the watchdog.

**Since:** 0.0.1

--------------------


### start()

```typescript
start() => Promise<void>
```

Start the watchdog.

**Since:** 0.0.1

--------------------


### stop()

```typescript
stop() => Promise<void>
```

Stops the watchdog.

**Since:** 0.0.1

--------------------

</docgen-api>
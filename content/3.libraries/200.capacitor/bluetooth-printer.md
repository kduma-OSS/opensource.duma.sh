---
title: SPP Bluetooth Printer for Capacitor.js
description: Allows printing on SPP BT printers
type: library
platform: Capacitor.js & TypeScript & Java & Android
active: true
github: https://github.com/kduma-autoid/capacitor-bluetooth-printer
---

# @kduma-autoid/capacitor-bluetooth-printer

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-autoid/capacitor-bluetooth-printer" blank}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-autoid/capacitor-bluetooth-printer/releases/latest/" blank}

:u-button[NPM]{icon="tabler:brand-npm" href="https://www.npmjs.com/package/@kduma-autoid/capacitor-bluetooth-printer" blank}
::

## Install

```bash
npm install @kduma-autoid/capacitor-bluetooth-printer
npx cap sync
```

## API

<docgen-index>

* [`list()`](#list)
* [`connect(...)`](#connect)
* [`print(...)`](#print)
* [`disconnect()`](#disconnect)
* [`connectAndPrint(...)`](#connectandprint)
* [Type Aliases](#type-aliases)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### list()

```typescript
list() => Promise<{ devices: BluetoothDevice[]; }>
```

**Returns:** <code>Promise&lt;{ devices: BluetoothDevice[]; }&gt;</code>

--------------------


### connect(...)

```typescript
connect(options: { address: string; }) => Promise<void>
```

| Param         | Type                              |
| ------------- | --------------------------------- |
| **`options`** | <code>{ address: string; }</code> |

--------------------


### print(...)

```typescript
print(options: { data: string; }) => Promise<void>
```

| Param         | Type                           |
| ------------- | ------------------------------ |
| **`options`** | <code>{ data: string; }</code> |

--------------------


### disconnect()

```typescript
disconnect() => Promise<void>
```

--------------------


### connectAndPrint(...)

```typescript
connectAndPrint(options: { address: string; data: string; }) => Promise<void>
```

| Param         | Type                                            |
| ------------- | ----------------------------------------------- |
| **`options`** | <code>{ address: string; data: string; }</code> |

--------------------


### Type Aliases


#### BluetoothDevice

<code>{ name: string, address: string, type: <a href="#bluetoothdevicetype">BluetoothDeviceType</a> }</code>


### Enums


#### BluetoothDeviceType

| Members       | Value                  |
| ------------- | ---------------------- |
| **`Unknown`** | <code>"unknown"</code> |
| **`Classic`** | <code>"classic"</code> |
| **`Le`**      | <code>"le"</code>      |
| **`Dual`**    | <code>"dual"</code>    |

</docgen-api>
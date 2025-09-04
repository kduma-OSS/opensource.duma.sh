---
title: Dymo M10 USB Scale driver for Capacitor.js
description: Capacitor adapter for cheap USB scales like Dymo M10
type: library
platform: Capacitor.js & TypeScript & Java & Android
active: true
github: https://github.com/kduma-autoid/capacitor-usb-scale
---

# @kduma-autoid/capacitor-usb-scale

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-autoid/capacitor-usb-scale" blank}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-autoid/capacitor-usb-scale/releases/latest/" blank}

:u-button[NPM]{icon="tabler:brand-npm" href="https://www.npmjs.com/package/@kduma-autoid/capacitor-usb-scale" blank}
::

## Install

```bash
npm install @kduma-autoid/capacitor-usb-scale
npx cap sync
```

## API

::note
Latest API documentation can be found in readme file on [GitHub](https://github.com/kduma-autoid/capacitor-usb-scale/blob/main/README.md)
::

<docgen-index>

* [`enumerateDevices()`](#enumeratedevices)
* [`requestPermission(...)`](#requestpermission)
* [`open(...)`](#open)
* [`stop()`](#stop)
* [`setIncomingWeightDataCallback(...)`](#setincomingweightdatacallback)
* [`clearIncomingWeightDataCallback()`](#clearincomingweightdatacallback)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### enumerateDevices()

```typescript
enumerateDevices() => Promise<{ devices: USBDevice[]; }>
```

Get a list of all connected compatible USB scale devices

**Returns:** <code>Promise&lt;{ devices: USBDevice[]; }&gt;</code>

--------------------


### requestPermission(...)

```typescript
requestPermission(device?: string | undefined) => Promise<{ status: boolean; }>
```

Request permission to access the USB scale device

| Param        | Type                | Description                                                                            |
| ------------ | ------------------- | -------------------------------------------------------------------------------------- |
| **`device`** | <code>string</code> | The device to request permission for. If not specified, the first device will be used. |

**Returns:** <code>Promise&lt;{ status: boolean; }&gt;</code>

--------------------


### open(...)

```typescript
open(device?: string | undefined) => Promise<void>
```

Open the USB scale device for data reading

| Param        | Type                | Description                                                          |
| ------------ | ------------------- | -------------------------------------------------------------------- |
| **`device`** | <code>string</code> | The device to open. If not specified, the first device will be used. |

--------------------


### stop()

```typescript
stop() => Promise<void>
```

Close the USB scale device

--------------------


### setIncomingWeightDataCallback(...)

```typescript
setIncomingWeightDataCallback(callback: (data: ScaleRead) => void) => Promise<CallbackID>
```

Sets a callback to be called when the scale sends data.
If callback is not set, there will bi raised an `usb_scale_read` event.

| Param          | Type                                                               | Description                                          |
| -------------- | ------------------------------------------------------------------ | ---------------------------------------------------- |
| **`callback`** | <code>(data: <a href="#scaleread">ScaleRead</a>) =&gt; void</code> | The callback to be called when the scale sends data. |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### clearIncomingWeightDataCallback()

```typescript
clearIncomingWeightDataCallback() => Promise<void>
```

Clears the callback set by `setIncomingWeightDataCallback`.

--------------------


### Type Aliases


#### USBDevice

<code>{ id: string, vid: number, pid: number, serial?: string, product: { manufacturer: string, name: string } }</code>


#### ScaleRead

<code>{ data: number[], weight: number, status: <a href="#scalestatus">ScaleStatus</a> }</code>


#### ScaleStatus

<code>"Fault" | "Zero" | "InMotion" | "Stable" | "UnderZero" | "OverWeight" | "NeedCalibration" | "NeedZeroing" | "Unknown"</code>


#### CallbackID

<code>string</code>

</docgen-api>

### Events

#### usb_scale_read

```typescript
addEventListener(type: "usb_scale_read", listener: (ev: ScaleRead) => any, useCapture?: boolean): void;
```

Emitted when the scale sends data, and there is no callback set by `setIncomingWeightDataCallback`.

#### usb_scale_connected

```typescript
addEventListener(type: "usb_scale_connected", listener: (ev: { device: USBDevice }) => any, useCapture?: boolean): void;
```

Emitted when a compatible USB scale device is connected.

#### usb_scale_disconnected

```typescript
addEventListener(type: "usb_scale_disconnected", listener: (ev: { device: USBDevice }) => any, useCapture?: boolean): void;
```

Emitted when a compatible USB scale device is disconnected.
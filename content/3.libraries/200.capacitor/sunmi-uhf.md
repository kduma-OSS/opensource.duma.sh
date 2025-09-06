---
title: Sunmi UHF RFID SDK for Capacitor.js
description: Binding for Sunmi's UHF module SDK
type: library
platform: Capacitor.js & TypeScript & Java & Android
active: true
github: https://github.com/kduma-autoid/capacitor-sunmi-uhf
---

# @kduma-autoid/capacitor-sunmi-uhf

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-autoid/capacitor-sunmi-uhf" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-autoid/capacitor-sunmi-uhf/releases/latest/" target="_blank"}

:u-button[NPM]{icon="tabler:brand-npm" href="https://www.npmjs.com/package/@kduma-autoid/capacitor-sunmi-uhf" target="_blank"}
::

## Install

```bash
npm install @kduma-autoid/capacitor-sunmi-uhf
npx cap sync
```

Add following entry to your `android/settings.gradle` file:
```grovy
include ':sunmi-scanner-sdk'
project(':sunmi-scanner-sdk').projectDir = new File('../node_modules/@kduma-autoid/capacitor-sunmi-uhf/android/libs/sunmi-scanner-sdk')
```

## API
::note
Latest API documentation can be found in readme file on [GitHub](https://github.com/kduma-autoid/capacitor-sunmi-uhf/blob/main/README.md)
::

<docgen-index>

* [`getScanModel()`](#getscanmodel)
* [`startScanning(...)`](#startscanning)
* [`setTagReadCallback(...)`](#settagreadcallback)
* [`clearTagReadCallback()`](#cleartagreadcallback)
* [`setInventoryScanCompletedCallback(...)`](#setinventoryscancompletedcallback)
* [`clearInventoryScanCompletedCallback()`](#clearinventoryscancompletedcallback)
* [`stopScanning()`](#stopscanning)
* [`readTag(...)`](#readtag)
* [`writeTag(...)`](#writetag)
* [`lockTag(...)`](#locktag)
* [`killTag(...)`](#killtag)
* [`setAccessEpcMatch(...)`](#setaccessepcmatch)
* [`cancelAccessEpcMatch()`](#cancelaccessepcmatch)
* [`getAccessEpcMatch()`](#getaccessepcmatch)
* [`setImpinjFastTid(...)`](#setimpinjfasttid)
* [`getImpinjFastTid()`](#getimpinjfasttid)
* [`getBatteryChargeState()`](#getbatterychargestate)
* [`getBatteryRemainingPercent()`](#getbatteryremainingpercent)
* [`getBatteryChargeNumTimes()`](#getbatterychargenumtimes)
* [`getBatteryVoltage()`](#getbatteryvoltage)
* [`getFirmwareVersion()`](#getfirmwareversion)
* [`getReaderSN()`](#getreadersn)
* [`addListener('onReaderConnected', ...)`](#addlisteneronreaderconnected)
* [`addListener('onReaderBoot', ...)`](#addlisteneronreaderboot)
* [`addListener('onReaderBootOrConnected', ...)`](#addlisteneronreaderbootorconnected)
* [`addListener('onReaderDisconnected', ...)`](#addlisteneronreaderdisconnected)
* [`addListener('onReaderLostConnection', ...)`](#addlisteneronreaderlostconnection)
* [`addListener('onReaderDisconnectedOrLostConnection', ...)`](#addlisteneronreaderdisconnectedorlostconnection)
* [`addListener('onBatteryRemainingPercent', ...)`](#addlisteneronbatteryremainingpercent)
* [`addListener('onBatteryLowElectricity', ...)`](#addlisteneronbatterylowelectricity)
* [`addListener('onBatteryRemainingPercentOrLowElectricity', ...)`](#addlisteneronbatteryremainingpercentorlowelectricity)
* [`addListener('onBatteryChargeState', ...)`](#addlisteneronbatterychargestate)
* [`addListener('onBatteryChargeNumTimes', ...)`](#addlisteneronbatterychargenumtimes)
* [`addListener('onBatteryVoltage', ...)`](#addlisteneronbatteryvoltage)
* [`addListener('onFirmwareVersion', ...)`](#addlisteneronfirmwareversion)
* [`addListener('onReaderSN', ...)`](#addlisteneronreadersn)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### getScanModel()

```typescript
getScanModel() => Promise<{ model: "UHF_S7100" | "UHF_R2000" | "INNER" | "NONE" | "UNKNOWN"; available: boolean; }>
```

Get RFID type

**Returns:**

- `model` - RFID type: `UHF_S7100` - UHF S7100, `UHF_R2000` - UHF R2000, `INNER` - Inner RFID, `NONE` - No RFID module, `UNKNOWN` - Unknown RFID module.
- `available` - Whether the RFID module is available.

**Returns:** <code>Promise&lt;{ model: 'UHF_S7100' | 'UHF_R2000' | 'INNER' | 'NONE' | 'UNKNOWN'; available: boolean; }&gt;</code>

--------------------


### startScanning(...)

```typescript
startScanning(options?: { repeat_times?: number | undefined; } | undefined) => Promise<void>
```

Starts scanning inventory operation

**Parameters:**

- `options.repeat_times` - The number of times the inventory to be repeated. If it is `0xFF`, the time used in this inventory round is the shortest time. If there is only one tag in the RF area, the time used in this inventory round is 30-50mS. This parameter value is normally used when quickly polling with several antennas in a four-channel device.

**Please note:** When the parameter `options.repeat_times` is set as `255`(`0xFF`), the algorithm specially designed for reading a small amount of tags will be enabled. It is more efficient and sensitive to read a small amount of tags. However, this parameter is not suitable to be used to simultaneously read a large amount of tags.

| Param         | Type                                    |
| ------------- | --------------------------------------- |
| **`options`** | <code>{ repeat_times?: number; }</code> |

--------------------


### setTagReadCallback(...)

```typescript
setTagReadCallback(callback: (data: { epc: string; pc: string; frequency: string; rrsi: string; antenna: number; last_updated: number; read_count: number; }) => void) => Promise<CallbackID>
```

Sets TagReadCallback

| Param          | Type                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`callback`** | <code>(data: { epc: string; pc: string; frequency: string; rrsi: string; antenna: number; last_updated: number; read_count: number; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### clearTagReadCallback()

```typescript
clearTagReadCallback() => Promise<void>
```

Removes TagReadCallback

--------------------


### setInventoryScanCompletedCallback(...)

```typescript
setInventoryScanCompletedCallback(callback: (data: { rate: number; tags_read: number; details: { start_time: number; end_time: number; }; }) => void) => Promise<CallbackID>
```

Sets InventoryScanCompletedCallback

| Param          | Type                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **`callback`** | <code>(data: { rate: number; tags_read: number; details: { start_time: number; end_time: number; }; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;string&gt;</code>

--------------------


### clearInventoryScanCompletedCallback()

```typescript
clearInventoryScanCompletedCallback() => Promise<void>
```

Removes InventoryScanCompletedCallback

--------------------


### stopScanning()

```typescript
stopScanning() => Promise<void>
```

Stops scanning

--------------------


### readTag(...)

```typescript
readTag(options: { bank: "RESERVED" | "EPC" | "TID" | "USER"; address: number; length: number; password?: string; }) => Promise<{ crc: string; pc: string; epc: string; data: string; details: { data_length: number; antenna: number; tag_read_count: number; start_time: number; end_time: number; }; }>
```

Tag operation – read tags

**Parameters:**

- `options.bank` - Tag memory bank: `RESERVED` - Reserved Memory, `EPC` - EPC Memory, `TID` - TID Memory, `USER` - User Memory.
- `options.address` - The first word address of the data read. For the value range, please refer to tag specs.
- `options.length` - The data length, word length or WORD (16 bits) length of the data read; For the value range, please refer to tag specs.
- `options.password` - Tag access password. 4 bytes. If the tag does not have a password, this parameter is not required.

**Please note:** `setAccessEpcMatch` should be done first. Tags with the same EPC but different data read will be deemed as different tags.

| Param         | Type                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| **`options`** | <code>{ bank: 'RESERVED' \| 'EPC' \| 'TID' \| 'USER'; address: number; length: number; password?: string; }</code> |

**Returns:** <code>Promise&lt;{ crc: string; pc: string; epc: string; data: string; details: { data_length: number; antenna: number; tag_read_count: number; start_time: number; end_time: number; }; }&gt;</code>

--------------------


### writeTag(...)

```typescript
writeTag(options: { bank: "RESERVED" | "EPC" | "TID" | "USER"; address: number; data: string; password?: string; }) => Promise<{ crc: string; pc: string; epc: string; details: { antenna: number; tag_read_count: number; start_time: number; end_time: number; }; }>
```

Tag operation – write tags

**Parameters:**

- `options.bank` - Tag memory bank: `RESERVED` - Reserved Memory, `EPC` - EPC Memory, `TID` - TID Memory, `USER` - User Memory.
- `options.address` - The first word address of the data written. For the value range, please refer to tag specs; it usually starts from 02 if it was written into EPC memory bank, and PC + CRC are stored in the first four bytes of this area.
- `options.data` - The data written in Hex String Format.
- `options.password` - Tag access password. 4 bytes. If the tag does not have a password, this parameter is not required.

**Please note:** `setAccessEpcMatch` should be done first. Tags with the same EPC but different data read will be deemed as different tags.

| Param         | Type                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| **`options`** | <code>{ bank: 'RESERVED' \| 'EPC' \| 'TID' \| 'USER'; address: number; data: string; password?: string; }</code> |

**Returns:** <code>Promise&lt;{ crc: string; pc: string; epc: string; details: { antenna: number; tag_read_count: number; start_time: number; end_time: number; }; }&gt;</code>

--------------------


### lockTag(...)

```typescript
lockTag(options: { bank: "USER" | "TID" | "EPC" | "ACCESS_PASSWORD" | "KILL_PASSWORD"; type: "OPEN" | "LOCK" | "PERM_OPEM" | "PERM_LOCK"; password: string; }) => Promise<{ crc: string; pc: string; epc: string; details: { antenna: number; tag_read_count: number; start_time: number; end_time: number; }; }>
```

Tag operation – lock tags

**Parameters:**

- `options.bank` - Tag memory bank: `USER` - User Memory, `TID` - TID Memory, `EPC` - EPC Memory, `ACCESS_PASSWORD` - Access Password, `KILL_PASSWORD` - Kill Password.
- `options.type` - The types of lock operation: `OPEN` - open, `LOCK` - lock, `PERM_OPEM` - permanently open, `PERM_LOCK` - permanently locked.
- `options.password` - Tag access password. 4 bytes.

**Please note:** `setAccessEpcMatch` should be done first. Tags with the same EPC but different data read will be deemed as different tags.

| Param         | Type                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`options`** | <code>{ bank: 'EPC' \| 'TID' \| 'USER' \| 'ACCESS_PASSWORD' \| 'KILL_PASSWORD'; type: 'OPEN' \| 'LOCK' \| 'PERM_OPEM' \| 'PERM_LOCK'; password: string; }</code> |

**Returns:** <code>Promise&lt;{ crc: string; pc: string; epc: string; details: { antenna: number; tag_read_count: number; start_time: number; end_time: number; }; }&gt;</code>

--------------------


### killTag(...)

```typescript
killTag(options: { password: string; }) => Promise<{ crc: string; pc: string; epc: string; details: { antenna: number; tag_read_count: number; start_time: number; end_time: number; }; }>
```

Tag operation – kill tags

**Parameters:**

- `options.password` - Tag access password. 4 bytes.

**Please note:** `setAccessEpcMatch` should be done first. Tags with the same EPC but different data read will be deemed as different tags.

| Param         | Type                               |
| ------------- | ---------------------------------- |
| **`options`** | <code>{ password: string; }</code> |

**Returns:** <code>Promise&lt;{ crc: string; pc: string; epc: string; details: { antenna: number; tag_read_count: number; start_time: number; end_time: number; }; }&gt;</code>

--------------------


### setAccessEpcMatch(...)

```typescript
setAccessEpcMatch(options: { epc: string; }) => Promise<{ details: { start_time: number; end_time: number; }; }>
```

Tag operation – set the matched EPC to be accessed (EPC match is valid until the next refresh)

**Parameters:**

- `options.epc` - EPC number in Hex String Format.

**Please note:** Tags with the same EPC but different data read will be deemed as different tags.

| Param         | Type                          |
| ------------- | ----------------------------- |
| **`options`** | <code>{ epc: string; }</code> |

**Returns:** <code>Promise&lt;{ details: { start_time: number; end_time: number; }; }&gt;</code>

--------------------


### cancelAccessEpcMatch()

```typescript
cancelAccessEpcMatch() => Promise<{ details: { start_time: number; end_time: number; }; }>
```

Tag operation – clear the matched EPC to be accessed

**Returns:** <code>Promise&lt;{ details: { start_time: number; end_time: number; }; }&gt;</code>

--------------------


### getAccessEpcMatch()

```typescript
getAccessEpcMatch() => Promise<{ epc_match: string; details: { start_time: number; end_time: number; }; }>
```

Tag operation – get EPC match

**Returns:** <code>Promise&lt;{ epc_match: string; details: { start_time: number; end_time: number; }; }&gt;</code>

--------------------


### setImpinjFastTid(...)

```typescript
setImpinjFastTid(options: { enable: boolean; save?: boolean; }) => Promise<{ details: { start_time: number; end_time: number; }; }>
```

Tag operation – set FastTID (only valid to some models of Impinj Monza tags)

**Parameters:**

- `options.enable` - FastTID on or off status.
- `options.save` - Save the configuration into the internal Flash, which will prevent it from being lost due to an outage. Default is `false`.

**Please note:** This function is only effective to some models of Impinj Monza tags.

**Please note:** This function recognizes EPC and TID at the same time, thus drastically enhancing the efficiency of reading TID.

**Please note:** After turning on this function, tags of specific model will package TID into EPC during inventory. Therefore, the PC of a tag will be changed, and the original PC + EPC will become: the modified PC + EPC + (CRC of EPC) + TID.

**Please note:** If there is something goes wrong when recognizing a TID, the original PC + EPC will be uploaded. ★Please turn off this function if you do not need it to avoid unnecessary time used.

| Param         | Type                                              |
| ------------- | ------------------------------------------------- |
| **`options`** | <code>{ enable: boolean; save?: boolean; }</code> |

**Returns:** <code>Promise&lt;{ details: { start_time: number; end_time: number; }; }&gt;</code>

--------------------


### getImpinjFastTid()

```typescript
getImpinjFastTid() => Promise<{ status: number; details: { start_time: number; end_time: number; }; }>
```

Tag operation – inquire FastTID

**Returns:** <code>Promise&lt;{ status: number; details: { start_time: number; end_time: number; }; }&gt;</code>

--------------------


### getBatteryChargeState()

```typescript
getBatteryChargeState() => Promise<void>
```

Refreshes the battery charging state. The resulting battery state will be returned in `onBatteryChargeState` events.

--------------------


### getBatteryRemainingPercent()

```typescript
getBatteryRemainingPercent() => Promise<void>
```

Refreshes the battery remaining percent. The resulting battery remaining percent will be returned in `onBatteryRemainingPercent` events.

--------------------


### getBatteryChargeNumTimes()

```typescript
getBatteryChargeNumTimes() => Promise<void>
```

Refreshes the battery cycles. The resulting battery cycles will be returned in `onBatteryChargeNumTimes` events.

--------------------


### getBatteryVoltage()

```typescript
getBatteryVoltage() => Promise<void>
```

Refreshes the battery voltage. The resulting battery voltage will be returned in `onBatteryVoltage` events.

--------------------


### getFirmwareVersion()

```typescript
getFirmwareVersion() => Promise<void>
```

Refreshes the UHF firmware version. The resulting UHF firmware version will be returned in `onFirmwareVersion` events.

--------------------


### getReaderSN()

```typescript
getReaderSN() => Promise<void>
```

Refreshes the reader serial number version. The resulting reader serial number version will be returned in `onReaderSN` events.

--------------------


### addListener('onReaderConnected', ...)

```typescript
addListener(eventName: 'onReaderConnected', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listens for reader connected events.

| Param              | Type                             |
| ------------------ | -------------------------------- |
| **`eventName`**    | <code>'onReaderConnected'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>       |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onReaderBoot', ...)

```typescript
addListener(eventName: 'onReaderBoot', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listens for reader booted events.

| Param              | Type                        |
| ------------------ | --------------------------- |
| **`eventName`**    | <code>'onReaderBoot'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>  |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onReaderBootOrConnected', ...)

```typescript
addListener(eventName: 'onReaderBootOrConnected', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listens for reader connected or booted events.

| Param              | Type                                   |
| ------------------ | -------------------------------------- |
| **`eventName`**    | <code>'onReaderBootOrConnected'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>             |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onReaderDisconnected', ...)

```typescript
addListener(eventName: 'onReaderDisconnected', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listens for reader disconnected  events.

| Param              | Type                                |
| ------------------ | ----------------------------------- |
| **`eventName`**    | <code>'onReaderDisconnected'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>          |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onReaderLostConnection', ...)

```typescript
addListener(eventName: 'onReaderLostConnection', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listens for reader lost connection events.

| Param              | Type                                  |
| ------------------ | ------------------------------------- |
| **`eventName`**    | <code>'onReaderLostConnection'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>            |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onReaderDisconnectedOrLostConnection', ...)

```typescript
addListener(eventName: 'onReaderDisconnectedOrLostConnection', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listens for reader disconnected or lost connection events.

| Param              | Type                                                |
| ------------------ | --------------------------------------------------- |
| **`eventName`**    | <code>'onReaderDisconnectedOrLostConnection'</code> |
| **`listenerFunc`** | <code>() =&gt; void</code>                          |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onBatteryRemainingPercent', ...)

```typescript
addListener(eventName: 'onBatteryRemainingPercent', listenerFunc: (event: { charge_level: number; }) => void) => Promise<PluginListenerHandle>
```

Listens for battery remaining percent events.

| Param              | Type                                                       |
| ------------------ | ---------------------------------------------------------- |
| **`eventName`**    | <code>'onBatteryRemainingPercent'</code>                   |
| **`listenerFunc`** | <code>(event: { charge_level: number; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onBatteryLowElectricity', ...)

```typescript
addListener(eventName: 'onBatteryLowElectricity', listenerFunc: (event: { charge_level: number; }) => void) => Promise<PluginListenerHandle>
```

Listens for battery low electricity events.

| Param              | Type                                                       |
| ------------------ | ---------------------------------------------------------- |
| **`eventName`**    | <code>'onBatteryLowElectricity'</code>                     |
| **`listenerFunc`** | <code>(event: { charge_level: number; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onBatteryRemainingPercentOrLowElectricity', ...)

```typescript
addListener(eventName: 'onBatteryRemainingPercentOrLowElectricity', listenerFunc: (event: { charge_level: number; }) => void) => Promise<PluginListenerHandle>
```

Listens for battery remaining percent or low electricity events.

| Param              | Type                                                       |
| ------------------ | ---------------------------------------------------------- |
| **`eventName`**    | <code>'onBatteryRemainingPercentOrLowElectricity'</code>   |
| **`listenerFunc`** | <code>(event: { charge_level: number; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onBatteryChargeState', ...)

```typescript
addListener(eventName: 'onBatteryChargeState', listenerFunc: (event: { state: "Unknown" | "NotCharging" | "PreCharging" | "QuickCharging" | "Charged"; }) => void) => Promise<PluginListenerHandle>
```

Listens for battery charge state events.

| Param              | Type                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **`eventName`**    | <code>'onBatteryChargeState'</code>                                                                                      |
| **`listenerFunc`** | <code>(event: { state: 'Unknown' \| 'NotCharging' \| 'PreCharging' \| 'QuickCharging' \| 'Charged'; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onBatteryChargeNumTimes', ...)

```typescript
addListener(eventName: 'onBatteryChargeNumTimes', listenerFunc: (event: { battery_cycles: number; }) => void) => Promise<PluginListenerHandle>
```

Listens for battery charge num times events.

| Param              | Type                                                         |
| ------------------ | ------------------------------------------------------------ |
| **`eventName`**    | <code>'onBatteryChargeNumTimes'</code>                       |
| **`listenerFunc`** | <code>(event: { battery_cycles: number; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onBatteryVoltage', ...)

```typescript
addListener(eventName: 'onBatteryVoltage', listenerFunc: (event: { voltage: number; }) => void) => Promise<PluginListenerHandle>
```

Listens for battery voltage events.

| Param              | Type                                                  |
| ------------------ | ----------------------------------------------------- |
| **`eventName`**    | <code>'onBatteryVoltage'</code>                       |
| **`listenerFunc`** | <code>(event: { voltage: number; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onFirmwareVersion', ...)

```typescript
addListener(eventName: 'onFirmwareVersion', listenerFunc: (event: { version: string; major: number; minor: number; }) => void) => Promise<PluginListenerHandle>
```

Listens for UHF firmware version events.

| Param              | Type                                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'onFirmwareVersion'</code>                                                    |
| **`listenerFunc`** | <code>(event: { version: string; major: number; minor: number; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('onReaderSN', ...)

```typescript
addListener(eventName: 'onReaderSN', listenerFunc: (event: { sn: string; region: "America" | "Europe" | "China" | "Unknown"; band_low: number; band_high: number; }) => void) => Promise<PluginListenerHandle>
```

Listens for reader serial number events.

| Param              | Type                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'onReaderSN'</code>                                                                                                                    |
| **`listenerFunc`** | <code>(event: { sn: string; region: 'Unknown' \| 'America' \| 'Europe' \| 'China'; band_low: number; band_high: number; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Removes all listeners

--------------------


### Interfaces


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


### Type Aliases


#### CallbackID

<code>string</code>

</docgen-api>

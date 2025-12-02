---
title: EPC Tag Data Standard
description: A library for encoding and decoding EPC data in PHP
type: library
platform: PHP
active: true
github: https://github.com/kduma-autoid/php-epc-tds
featured: 12
featured_description: A library for encoding and decoding EPC data in PHP
featured_icon: bx:rfid
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-autoid/php-epc-tds" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-autoid/php-epc-tds/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/epc-tds" target="_blank"}
::

## Overview

The EPC (Electronic Product Code) Tag Data Standard defines the structure and encoding of data stored on RFID tags. This library provides encoding and decoding capabilities for all major EPC schemes defined in the GS1 EPC Tag Data Standard.

### Key Features

- Encode EPC data to hexadecimal strings for writing to RFID tags
- Decode hexadecimal EPC data read from RFID tags
- Convert between Tag URI, ID URI, and barcode formats
- Support for all major EPC schemes (SGTIN, SSCC, SGLN, GRAI, GID, GIAI, GSRN, GDTI, CPI, SGCN)
- Automatic check digit calculation for GS1 identifiers

---

## Installation

### Requirements

- PHP 8.1 or higher
- GMP extension for arbitrary precision arithmetic

### Install via Composer

```bash
composer require kduma/epc-tds
```

### Install GMP Extension

```bash
# Ubuntu/Debian
sudo apt-get install php-gmp

# CentOS/RHEL
sudo yum install php-gmp

# macOS with Homebrew
brew install php@8.1
# GMP is typically included
```

---

## Core Concepts

### Architecture

The library uses an interface-based architecture for flexibility and type safety:

**Base Interfaces:**
- `EpcInterface`: Root interface defining common EPC operations
- `AbstractEpc`: Base implementation providing bit manipulation
- `AbstractStandardEpc`: Base for standard GS1 EPCs with filter and barcode support

**Capability Interfaces:**
- `HasFilterInterface`: For EPCs with filter values (most types)
- `HasPartitionInterface`: For EPCs using partition encoding
- `HasCompanyPrefixInterface`: For EPCs with GS1 company prefix
- `HasSerialInterface`: For EPCs with serial numbers
- `HasBarcodeInterface`: For EPCs convertible to barcodes

**Type-Specific Interfaces:**
Each EPC type has its own interface (e.g., `SgtinInterface`, `GidInterface`) that composes the relevant capability interfaces. Abstract base classes (e.g., `AbstractSgtin`, `AbstractGrai`) provide shared implementation for variant sizes (96-bit, 198-bit, etc.).

### EPC Structure

Each EPC contains:
- **Header**: Identifies the EPC scheme (8 bits)
- **Filter**: Classification value for the tagged item (3 bits, not present in GID)
- **Partition**: Indicates how bits are divided between company prefix and item reference
- **Company Prefix**: GS1 assigned company identifier
- **Item/Serial Reference**: Company-assigned identifier

### URI Formats

The library supports two URI formats:

1. **Tag URI**: Complete representation including filter value
   ```
   urn:epc:tag:sgtin-96:3.0614141.812345.6789
   ```

2. **ID URI**: Pure identification without filter
   ```
   urn:epc:id:sgtin:0614141.812345.6789
   ```

### Partition Tables

Partitions determine how bits are allocated between company prefix and item reference. Lower partition values allocate more bits to the company prefix (supporting larger company prefixes with smaller item reference ranges).

---

## TDS Class

The `TDS` class is the main entry point for working with EPCs.

### Namespace

```php
use KDuma\EpcTds\TDS;
```

### Static Methods

#### `valueOf(string $hexEpc): AbstractEpc`

Decodes a hexadecimal EPC string and returns the appropriate EPC object. The returned object implements `EpcInterface` and its type-specific interface.

```php
$epc = TDS::valueOf("3034257BF7194E4000001A85");
echo get_class($epc); // KDuma\EpcTds\Epc\Sgtin\Sgtin96

// Use interfaces for type checking
if ($epc instanceof SgtinInterface) {
    echo $epc->getGtin();
}
```

#### `fromTagURI(string $uri): AbstractEpc`

Creates an EPC object from a Tag URI string. The returned object implements `EpcInterface` and its type-specific interface.

```php
$epc = TDS::fromTagURI("urn:epc:tag:sgtin-96:3.0614141.812345.6789");
echo $epc->toHexString(); // 3074257BF7194E4000001A85
```

---

## Interfaces

### EpcInterface

Root interface for all EPC types. Defines core methods available on all implementations.

```php
use KDuma\EpcTds\Epc\EpcInterface;

function processEpc(EpcInterface $epc): void {
    echo $epc->getType()->name;     // Type enum
    echo $epc->toTagURI();           // Tag URI
    echo $epc->toIdURI();            // ID URI
    echo $epc->getTotalBits();       // Bit length (96, 198, etc.)
    echo $epc->getHeader();          // Header value
    $clone = $epc->clone();          // Create copy
}
```

### Capability Interfaces

These interfaces define optional capabilities that some EPC types support:

#### HasFilterInterface

For EPCs with filter values (all types except GID-96).

```php
use KDuma\EpcTds\Epc\HasFilterInterface;

if ($epc instanceof HasFilterInterface) {
    $filter = $epc->getFilter();     // Get filter (0-7)
    $epc->setFilter(3);              // Set filter
}
```

#### HasPartitionInterface

For EPCs using partition-based encoding (most GS1 types).

```php
use KDuma\EpcTds\Epc\HasPartitionInterface;

if ($epc instanceof HasPartitionInterface) {
    $partition = $epc->getPartition();  // Get partition (0-6)
    $epc->setPartition(5);              // Set partition
}
```

#### HasCompanyPrefixInterface

For EPCs with GS1 company prefix.

```php
use KDuma\EpcTds\Epc\HasCompanyPrefixInterface;

if ($epc instanceof HasCompanyPrefixInterface) {
    $prefix = $epc->getCompanyPrefix();
    $epc->setCompanyPrefix(614141);
}
```

#### HasSerialInterface

For EPCs with serial numbers. Serial type varies: 96-bit variants use `int`, extended variants use `string`.

```php
use KDuma\EpcTds\Epc\HasSerialInterface;

if ($epc instanceof HasSerialInterface) {
    $serial = $epc->getSerial();        // int or string
    $epc->setSerial(12345);             // For 96-bit
    $epc->setSerial("ABC123");          // For extended
}
```

#### HasBarcodeInterface

For EPCs convertible to barcode format (all types except GID-96).

```php
use KDuma\EpcTds\Epc\HasBarcodeInterface;

if ($epc instanceof HasBarcodeInterface) {
    $barcode = $epc->toBarcode();       // GTIN, SSCC, etc.
}
```

### Type-Specific Interfaces

Each EPC type has its own interface composing relevant capabilities:

| Interface | Extends | Purpose |
|-----------|---------|---------|
| `SgtinInterface` | EpcInterface + HasCompanyPrefix + HasPartition + HasSerial + HasFilter + HasBarcode | Serialized Global Trade Item Number |
| `SsccInterface` | EpcInterface + HasCompanyPrefix + HasPartition + HasFilter + HasBarcode | Serial Shipping Container Code |
| `SglnInterface` | EpcInterface + HasCompanyPrefix + HasPartition + HasFilter + HasBarcode | Global Location Number |
| `GraiInterface` | EpcInterface + HasCompanyPrefix + HasPartition + HasSerial + HasFilter + HasBarcode | Global Returnable Asset Identifier |
| `GidInterface` | EpcInterface only | General Identifier (no filter/barcode) |
| `GiaiInterface` | EpcInterface + HasCompanyPrefix + HasPartition + HasFilter | Global Individual Asset Identifier |
| `GsrnInterface` | EpcInterface + HasCompanyPrefix + HasPartition + HasFilter + HasBarcode | Global Service Relation Number |
| `GdtiInterface` | EpcInterface + HasCompanyPrefix + HasPartition + HasSerial + HasFilter + HasBarcode | Global Document Type Identifier |
| `CpiInterface` | EpcInterface + HasCompanyPrefix + HasPartition + HasSerial + HasFilter + HasBarcode | Component/Part Identifier |
| `SgcnInterface` | EpcInterface + HasCompanyPrefix + HasPartition + HasSerial + HasFilter + HasBarcode | Serialized Global Coupon Number |

### Practical Examples

**Type checking and polymorphism:**

```php
use KDuma\EpcTds\TDS;
use KDuma\EpcTds\Epc\EpcInterface;
use KDuma\EpcTds\Epc\HasBarcodeInterface;
use KDuma\EpcTds\Epc\HasSerialInterface;
use KDuma\EpcTds\Epc\Sgtin\SgtinInterface;

// Decode unknown EPC type
$epc = TDS::valueOf("3034257BF7194E4000001A85");

// Work with base interface
function logEpc(EpcInterface $epc): void {
    echo "Type: " . $epc->getType()->name . "\n";
    echo "Tag URI: " . $epc->toTagURI() . "\n";
}

// Check for barcode support
if ($epc instanceof HasBarcodeInterface) {
    echo "Barcode: " . $epc->toBarcode() . "\n";
}

// Check for serial support
if ($epc instanceof HasSerialInterface) {
    echo "Serial: " . $epc->getSerial() . "\n";
}

// Type-specific operations
if ($epc instanceof SgtinInterface) {
    echo "GTIN: " . $epc->getGtin() . "\n";
    echo "Item Ref: " . $epc->getItemReference() . "\n";
}
```

**Working with collections:**

```php
use KDuma\EpcTds\Epc\HasCompanyPrefixInterface;

// Filter EPCs by company
function filterByCompany(array $epcs, int $companyPrefix): array {
    return array_filter($epcs, function(EpcInterface $epc) use ($companyPrefix) {
        return $epc instanceof HasCompanyPrefixInterface
            && $epc->getCompanyPrefix() === $companyPrefix;
    });
}

// Update all filters in a batch
function setAllFilters(array $epcs, int $filter): void {
    foreach ($epcs as $epc) {
        if ($epc instanceof HasFilterInterface) {
            $epc->setFilter($filter);
        }
    }
}
```

---

## EPC Types

### Common Methods

All EPC types implement `EpcInterface` and extend `AbstractEpc`, providing these base methods:

**From EpcInterface (all types):**

| Method | Description |
|--------|-------------|
| `toTagURI()` | Returns the Tag URI representation |
| `toIdURI()` | Returns the ID URI representation |
| `clone()` | Creates a copy of the EPC object |
| `getType()` | Returns the Type enum value |
| `getTotalBits()` | Returns total bit length (96, 198, etc.) |
| `getHeader()` | Returns the header value |

**From AbstractEpc (all types):**

| Method | Description |
|--------|-------------|
| `toHexString()` | Returns the EPC as a hexadecimal string |

**From HasFilterInterface (all except GID-96):**

| Method | Description |
|--------|-------------|
| `getFilter()` | Gets the filter value (0-7) |
| `setFilter(int $value)` | Sets the filter value |

**From HasBarcodeInterface (all except GID-96):**

| Method | Description |
|--------|-------------|
| `toBarcode()` | Returns the GS1 barcode representation |

**From HasPartitionInterface (most GS1 types):**

| Method | Description |
|--------|-------------|
| `getPartition()` | Gets the partition value (0-6) |
| `setPartition(int $value)` | Sets the partition value |

---

### SGTIN-96

Serialized Global Trade Item Number (96-bit). Used for identifying trade items with a serial number.

**Class**: `KDuma\EpcTds\Epc\Sgtin\Sgtin96`
**Implements**: `SgtinInterface`
**Extends**: `AbstractSgtin`

**Typical Use**: Individual retail items, cases, pallets

**Structure**: Header (8) + Filter (3) + Partition (3) + Company Prefix (20-40) + Item Reference (24-4) + Serial (38)

```php
use KDuma\EpcTds\Epc\Sgtin\Sgtin96;

// Create new SGTIN-96
$sgtin = new Sgtin96();
$sgtin->setFilter(3)
      ->setPartition(5)
      ->setCompanyPrefix(614141)
      ->setItemReference(812345)
      ->setSerial(6789);

echo $sgtin->toHexString();  // 3074257BF7194E4000001A85
echo $sgtin->toTagURI();     // urn:epc:tag:sgtin-96:3.0614141.812345.6789
echo $sgtin->toBarcode();    // 00614141123452

// From hex
$sgtin = new Sgtin96("3074257BF7194E4000001A85");
echo $sgtin->getGtin();      // 00614141123452

// From barcode (GTIN-14)
$sgtin = new Sgtin96();
$sgtin->setPartition(5)
      ->setGtin("00614141123452")
      ->setSerial(6789);
```

**Methods specific to SGTIN-96:**

| Method | Description |
|--------|-------------|
| `getCompanyPrefix()` | Gets the GS1 company prefix |
| `setCompanyPrefix(int $value)` | Sets the GS1 company prefix |
| `getItemReference()` | Gets the item reference number |
| `setItemReference(int $value)` | Sets the item reference number |
| `getSerial()` | Gets the serial number |
| `setSerial(int $value)` | Sets the serial number |
| `getGtin()` | Gets the GTIN-14 with check digit |
| `setGtin(string $gtin)` | Sets values from a GTIN-14 |
| `getMaxSerial()` | Returns maximum serial value for partition |

---

### SGTIN-198

Serialized Global Trade Item Number (198-bit). Extended version supporting alphanumeric serial numbers.

**Class**: `KDuma\EpcTds\Epc\Sgtin\Sgtin198`
**Implements**: `SgtinInterface`
**Extends**: `AbstractSgtin`

**Typical Use**: Items requiring alphanumeric serial numbers

```php
use KDuma\EpcTds\Epc\Sgtin\Sgtin198;

$sgtin = new Sgtin198();
$sgtin->setFilter(3)
      ->setPartition(5)
      ->setCompanyPrefix(614141)
      ->setItemReference(812345)
      ->setSerial("ABC123");

echo $sgtin->toHexString();
echo $sgtin->getSerial();  // ABC123 (alphanumeric)
```

**Additional Methods:**

| Method | Description |
|--------|-------------|
| `getSerial()` | Gets alphanumeric serial (string) |
| `setSerial(string $value)` | Sets alphanumeric serial |

---

### SSCC-96

Serial Shipping Container Code (96-bit). Used for logistics handling units.

**Typical Use**: Pallet loads, shipping containers, logistics units

```php
use KDuma\EpcTds\Epc\Sscc\Sscc96;

$sscc = new Sscc96();
$sscc->setFilter(3)
     ->setPartition(5)
     ->setCompanyPrefix(614141)
     ->setSerialReference(1234567890);

echo $sscc->toTagURI();   // urn:epc:tag:sscc-96:3.0614141.1234567890
echo $sscc->toBarcode();  // 106141411234567890 (18-digit SSCC)

// From SSCC barcode
$sscc = new Sscc96();
$sscc->setPartition(5)
     ->setSscc("106141411234567897");
```

**Methods:**

| Method | Description |
|--------|-------------|
| `getCompanyPrefix()` | Gets the GS1 company prefix |
| `setCompanyPrefix(int $value)` | Sets the GS1 company prefix |
| `getSerialReference()` | Gets the serial reference |
| `setSerialReference(int $value)` | Sets the serial reference |
| `getSscc()` | Gets the 18-digit SSCC with check digit |
| `setSscc(string $sscc)` | Sets values from an SSCC |
| `getMaxSerialReference()` | Returns maximum serial reference for partition |

---

### SGLN-96

Global Location Number with Extension (96-bit). Used for identifying physical locations.

**Typical Use**: Warehouses, store locations, specific zones

```php
use KDuma\EpcTds\Epc\Sgln\Sgln96;

$sgln = new Sgln96();
$sgln->setFilter(3)
     ->setPartition(5)
     ->setCompanyPrefix(614141)
     ->setLocationReference(12345)
     ->setExtension(5678);

echo $sgln->toTagURI();   // urn:epc:tag:sgln-96:3.0614141.12345.5678
echo $sgln->toBarcode();  // 0614141123452 (GLN-13)
```

**Methods:**

| Method | Description |
|--------|-------------|
| `getCompanyPrefix()` | Gets the GS1 company prefix |
| `setCompanyPrefix(int $value)` | Sets the GS1 company prefix |
| `getLocationReference()` | Gets the location reference |
| `setLocationReference(int $value)` | Sets the location reference |
| `getExtension()` | Gets the extension component |
| `setExtension(int $value)` | Sets the extension component |
| `getGln()` | Gets the GLN-13 with check digit |
| `setGln(string $gln)` | Sets values from a GLN |

---

### SGLN-195

Global Location Number with Extension (195-bit). Extended version supporting alphanumeric extensions.

```php
use KDuma\EpcTds\Epc\Sgln\Sgln195;

$sgln = new Sgln195();
$sgln->setFilter(3)
     ->setPartition(5)
     ->setCompanyPrefix(614141)
     ->setLocationReference(12345)
     ->setExtension("ABC123");

echo $sgln->getExtension();  // ABC123 (alphanumeric)
```

---

### GRAI-96

Global Returnable Asset Identifier (96-bit). Used for returnable transport items.

**Typical Use**: Pallets, crates, kegs, gas cylinders

```php
use KDuma\EpcTds\Epc\Grai\Grai96;

$grai = new Grai96();
$grai->setFilter(3)
     ->setPartition(5)
     ->setCompanyPrefix(614141)
     ->setAssetType(12345)
     ->setSerial(6789);

echo $grai->toTagURI();   // urn:epc:tag:grai-96:3.0614141.12345.6789
echo $grai->toBarcode();  // 0614141123452 (GRAI without serial)
```

**Methods:**

| Method | Description |
|--------|-------------|
| `getCompanyPrefix()` | Gets the GS1 company prefix |
| `setCompanyPrefix(int $value)` | Sets the GS1 company prefix |
| `getAssetType()` | Gets the asset type |
| `setAssetType(int $value)` | Sets the asset type |
| `getSerial()` | Gets the serial number |
| `setSerial(int $value)` | Sets the serial number |
| `getGrai()` | Gets the GRAI with check digit |
| `setGrai(string $grai)` | Sets values from a GRAI |

---

### GRAI-170

Global Returnable Asset Identifier (170-bit). Extended version supporting alphanumeric serials.

```php
use KDuma\EpcTds\Epc\Grai\Grai170;

$grai = new Grai170();
$grai->setFilter(3)
     ->setPartition(5)
     ->setCompanyPrefix(614141)
     ->setAssetType(12345)
     ->setSerial("ABC123");

echo $grai->getSerial();  // ABC123 (alphanumeric)
```

---

### GID-96

General Identifier (96-bit). A simple EPC scheme for general use.

**Class**: `KDuma\EpcTds\Epc\Gid\Gid96`
**Implements**: `GidInterface`
**Note**: Does not support filter or barcode (extends `AbstractEpc` directly, not `AbstractStandardEpc`)

**Typical Use**: Items not requiring GS1 identifiers

```php
use KDuma\EpcTds\Epc\Gid\Gid96;

$gid = new Gid96();
$gid->setManager(12345678)
    ->setClass(123456)
    ->setSerial(789012);

echo $gid->toTagURI();    // urn:epc:tag:gid-96:12345678.123456.789012
echo $gid->toHexString();
```

**Methods:**

| Method | Description |
|--------|-------------|
| `getManager()` | Gets the general manager number |
| `setManager(int $value)` | Sets the general manager number |
| `getClass()` | Gets the object class |
| `setClass(int $value)` | Sets the object class |
| `getSerial()` | Gets the serial number |
| `setSerial(int $value)` | Sets the serial number |

---

### GIAI-96

Global Individual Asset Identifier (96-bit). Used for individual assets.

**Typical Use**: Fixed assets, equipment, tools

```php
use KDuma\EpcTds\Epc\Giai\Giai96;

$giai = new Giai96();
$giai->setFilter(3)
     ->setPartition(5)
     ->setCompanyPrefix(614141)
     ->setAssetReference(123456789);

echo $giai->toTagURI();   // urn:epc:tag:giai-96:3.0614141.123456789
```

**Methods:**

| Method | Description |
|--------|-------------|
| `getCompanyPrefix()` | Gets the GS1 company prefix |
| `setCompanyPrefix(int $value)` | Sets the GS1 company prefix |
| `getAssetReference()` | Gets the individual asset reference |
| `setAssetReference(int $value)` | Sets the individual asset reference |

---

### GIAI-202

Global Individual Asset Identifier (202-bit). Extended version supporting alphanumeric asset references.

```php
use KDuma\EpcTds\Epc\Giai\Giai202;

$giai = new Giai202();
$giai->setFilter(3)
     ->setPartition(5)
     ->setCompanyPrefix(614141)
     ->setAssetReference("ASSET-ABC-123");

echo $giai->getAssetReference();  // ASSET-ABC-123 (alphanumeric)
```

---

### GSRN-96

Global Service Relation Number (96-bit). Used for service relationships.

**Typical Use**: Loyalty programs, service subscriptions

```php
use KDuma\EpcTds\Epc\Gsrn\Gsrn96;

$gsrn = new Gsrn96();
$gsrn->setFilter(3)
     ->setPartition(5)
     ->setCompanyPrefix(614141)
     ->setServiceReference(1234567890);

echo $gsrn->toTagURI();   // urn:epc:tag:gsrn-96:3.0614141.1234567890
echo $gsrn->toBarcode();  // 061414112345678905 (GSRN-18)
```

**Methods:**

| Method | Description |
|--------|-------------|
| `getCompanyPrefix()` | Gets the GS1 company prefix |
| `setCompanyPrefix(int $value)` | Sets the GS1 company prefix |
| `getServiceReference()` | Gets the service reference |
| `setServiceReference(int $value)` | Sets the service reference |
| `getGsrn()` | Gets the GSRN-18 with check digit |
| `setGsrn(string $gsrn)` | Sets values from a GSRN |

---

### GDTI-96

Global Document Type Identifier (96-bit). Used for documents.

**Typical Use**: Coupons, documents, tickets

```php
use KDuma\EpcTds\Epc\Gdti\Gdti96;

$gdti = new Gdti96();
$gdti->setFilter(3)
     ->setPartition(5)
     ->setCompanyPrefix(614141)
     ->setDocumentType(12345)
     ->setSerial(6789012345);

echo $gdti->toTagURI();   // urn:epc:tag:gdti-96:3.0614141.12345.6789012345
```

**Methods:**

| Method | Description |
|--------|-------------|
| `getCompanyPrefix()` | Gets the GS1 company prefix |
| `setCompanyPrefix(int $value)` | Sets the GS1 company prefix |
| `getDocumentType()` | Gets the document type |
| `setDocumentType(int $value)` | Sets the document type |
| `getSerial()` | Gets the serial number |
| `setSerial(int $value)` | Sets the serial number |
| `getGdti()` | Gets the GDTI with check digit |
| `setGdti(string $gdti)` | Sets values from a GDTI |

---

### GDTI-174

Global Document Type Identifier (174-bit). Extended version supporting alphanumeric serials.

```php
use KDuma\EpcTds\Epc\Gdti\Gdti174;

$gdti = new Gdti174();
$gdti->setFilter(3)
     ->setPartition(5)
     ->setCompanyPrefix(614141)
     ->setDocumentType(12345)
     ->setSerial("DOC-ABC-123");

echo $gdti->getSerial();  // DOC-ABC-123 (alphanumeric)
```

---

### CPI-96

Component/Part Identifier (96-bit). Used for component parts.

**Typical Use**: Automotive parts, electronic components

```php
use KDuma\EpcTds\Epc\Cpi\Cpi96;

$cpi = new Cpi96();
$cpi->setFilter(3)
    ->setPartition(5)
    ->setCompanyPrefix(614141)
    ->setComponentPartReference(123456)
    ->setSerial(789012);

echo $cpi->toTagURI();   // urn:epc:tag:cpi-96:3.0614141.123456.789012
```

**Methods:**

| Method | Description |
|--------|-------------|
| `getCompanyPrefix()` | Gets the GS1 company prefix |
| `setCompanyPrefix(int $value)` | Sets the GS1 company prefix |
| `getComponentPartReference()` | Gets the component/part reference |
| `setComponentPartReference(int $value)` | Sets the component/part reference |
| `getSerial()` | Gets the serial number |
| `setSerial(int $value)` | Sets the serial number |
| `getCpi()` | Gets the CPI with check digit |
| `setCpi(string $cpi)` | Sets values from a CPI |

---

### SGCN-96

Serialized Global Coupon Number (96-bit). Used for coupons.

**Typical Use**: Digital coupons, promotional offers

```php
use KDuma\EpcTds\Epc\Sgcn\Sgcn96;

$sgcn = new Sgcn96();
$sgcn->setFilter(3)
     ->setPartition(5)
     ->setCompanyPrefix(614141)
     ->setCouponReference(12345)
     ->setSerial(6789012345);

echo $sgcn->toTagURI();   // urn:epc:tag:sgcn-96:3.0614141.12345.6789012345
```

**Methods:**

| Method | Description |
|--------|-------------|
| `getCompanyPrefix()` | Gets the GS1 company prefix |
| `setCompanyPrefix(int $value)` | Sets the GS1 company prefix |
| `getCouponReference()` | Gets the coupon reference |
| `setCouponReference(int $value)` | Sets the coupon reference |
| `getSerial()` | Gets the serial number |
| `setSerial(int $value)` | Sets the serial number |
| `getGcn()` | Gets the GCN with check digit |
| `setGcn(string $gcn)` | Sets values from a GCN |

---

## Advanced Usage

### Abstract Base Classes

The library provides abstract base classes that contain shared logic for EPC variants:

| Abstract Class | Purpose | Used By |
|----------------|---------|---------|
| `AbstractEpc` | Base for all EPCs, provides bit manipulation | All EPC types |
| `AbstractStandardEpc` | Adds filter and barcode support | All GS1 types (not GID) |
| `AbstractSgtin` | Shared SGTIN logic | Sgtin96, Sgtin198 |
| `AbstractSgln` | Shared SGLN logic | Sgln96, Sgln195 |
| `AbstractGrai` | Shared GRAI logic | Grai96, Grai170 |
| `AbstractGiai` | Shared GIAI logic | Giai96, Giai202 |
| `AbstractGdti` | Shared GDTI logic | Gdti96, Gdti174 |

These abstract classes provide shared implementations of methods like `getCompanyPrefix()`, `setGtin()`, partition handling, and barcode generation. The concrete classes (96-bit vs extended variants) primarily differ in their serial number handling and total bit length.

**Example: Understanding the hierarchy**

```php
// SGTIN-96 hierarchy:
// Sgtin96 -> AbstractSgtin -> AbstractStandardEpc -> AbstractEpc -> BitArray
//         implements SgtinInterface

// GID-96 hierarchy (different - no filter/barcode):
// Gid96 -> AbstractEpc -> BitArray
//       implements GidInterface
```

### Type Inference with Interfaces

Use interfaces for flexible, type-safe code:

```php
use KDuma\EpcTds\Epc\EpcInterface;
use KDuma\EpcTds\Epc\Sgtin\SgtinInterface;

// Accept any SGTIN variant (96 or 198-bit)
function processSgtin(SgtinInterface $sgtin): void {
    echo $sgtin->getGtin();
    echo $sgtin->getSerial();  // int or string depending on variant
}

// Accept any EPC type
function processAnyEpc(EpcInterface $epc): void {
    echo $epc->toTagURI();
}
```

---

## Utility Classes

### BitArray

Low-level bit manipulation class used internally. Not typically used directly.

```php
use KDuma\EpcTds\Utils\BitArray;

$bits = new BitArray(96);
$bits->set(0x31, 0, 8);  // Set header
echo $bits->get(0, 8);   // Read header
```

### Utils

Utility functions for GS1 operations.

```php
use KDuma\EpcTds\Utils\Utils;

// Compute GS1 check digit
$checkDigit = Utils::computeCheckDigit("061414112345");
echo $checkDigit;  // 2

// Get maximum value for bit count
$max = Utils::getMaxValue(38);  // For 38-bit serial
```

---

## Error Handling

The library throws `InvalidArgumentException` for invalid inputs:

```php
use KDuma\EpcTds\TDS;
use KDuma\EpcTds\Epc\Sgtin\Sgtin96;

try {
    // Invalid hex string
    $epc = TDS::valueOf("INVALID");
} catch (InvalidArgumentException $e) {
    echo $e->getMessage();  // "INVALID is not a known EPC tag scheme"
}

try {
    // Value out of range
    $sgtin = new Sgtin96();
    $sgtin->setFilter(10);  // Filter must be 0-7
} catch (InvalidArgumentException $e) {
    echo $e->getMessage();  // "Value '10' out of range (min: 0, max: 7)"
}

try {
    // Invalid partition
    $sgtin = new Sgtin96();
    $sgtin->setPartition(10);  // Partition must be 0-6
} catch (InvalidArgumentException $e) {
    echo $e->getMessage();
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Value out of range | Number exceeds maximum for bit allocation | Check partition setting and value limits |
| Unknown EPC tag scheme | Invalid hex or unsupported EPC type | Verify hex string format |
| Invalid Tag URI | Malformed URI string | Check URI format matches specification |

---

## Partition Reference

### SGTIN/SGLN/GRAI Partitions

| Partition | Company Prefix Bits | Company Prefix Digits | Item Ref Bits | Item Ref Digits |
|-----------|--------------------|-----------------------|---------------|-----------------|
| 0 | 40 | 12 | 4 | 1 |
| 1 | 37 | 11 | 7 | 2 |
| 2 | 34 | 10 | 10 | 3 |
| 3 | 30 | 9 | 14 | 4 |
| 4 | 27 | 8 | 17 | 5 |
| 5 | 24 | 7 | 20 | 6 |
| 6 | 20 | 6 | 24 | 7 |

### SSCC Partitions

| Partition | Company Prefix Bits | Company Prefix Digits | Serial Ref Bits | Serial Ref Digits |
|-----------|--------------------|-----------------------|-----------------|-------------------|
| 0 | 40 | 12 | 18 | 5 |
| 1 | 37 | 11 | 21 | 6 |
| 2 | 34 | 10 | 24 | 7 |
| 3 | 30 | 9 | 28 | 8 |
| 4 | 27 | 8 | 31 | 9 |
| 5 | 24 | 7 | 34 | 10 |
| 6 | 20 | 6 | 38 | 11 |

---

## Filter Values

| Value | Description |
|-------|-------------|
| 0 | All Others |
| 1 | Point of Sale (POS) Trade Item |
| 2 | Full Case for Transport |
| 3 | Reserved |
| 4 | Inner Pack Trade Item Grouping |
| 5 | Reserved |
| 6 | Unit Load |
| 7 | Unit Inside Trade Item or Component |

---

## References

- [GS1 EPC Tag Data Standard](https://www.gs1.org/standards/epc-rfid/tds)
- [Original epc-tds TypeScript Library](https://github.com/sergiss/epc-tds)
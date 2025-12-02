---
navigation:
    title: Binary Tools
title: Binary Tools (PHP)
description: A PHP library for binary data manipulation and encoding/decoding operations. This library provides safe, efficient tools for working with binary data, including UTF-8 validation and secure string comparisons.
type: library
platform: PHP
active: true
github: https://github.com/kduma-OSS/PHP-binary-tools
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/PHP-binary-tools" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/PHP-binary-tools/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/binary-tools" target="_blank"}
::

## Installation

```bash
composer require kduma/binary-tools
```

## Requirements

- PHP 8.4+
- `ext-mbstring` - For UTF-8 validation
- `ext-hash` - For secure string comparisons

## Features

- **Safe binary data manipulation** with bounds checking
- **UTF-8 string validation** for text data
- **Multiple encoding formats** (hex, base64, base32)
- **Secure string comparison** using `hash_equals()`
- **Binary-safe substring search** with `BinaryString::contains()`
- **Flexible integer support** with configurable byte order and signedness
- **Position tracking** for streaming operations
- **Terminator support** for null-terminated and delimited data parsing
- **Fixed-size field padding** with configurable pad byte support

## Core Classes

### BinaryString

Immutable wrapper for binary data with conversion and comparison methods.

### BinaryWriter

Stream-like writer for building binary data structures.

### BinaryReader

Stream-like reader for parsing binary data with position tracking.

### IntType

Enum defining integer types with configurable byte order, signedness, and platform validation.

### Terminator

Enum defining common binary terminators for delimited data parsing.


## Usage Examples

### BinaryString

```php
use KDuma\BinaryTools\BinaryString;

// Create from different sources
$binary = BinaryString::fromString("\x48\x65\x6c\x6c\x6f");
$fromString = BinaryString::fromString("Hello");
$fromHex = BinaryString::fromHex("48656c6c6f");
$fromBase64 = BinaryString::fromBase64("SGVsbG8=");
$fromBase32 = BinaryString::fromBase32("JBSWY3DP");

// All represent "Hello"
echo $binary->toString(); // "Hello"

// Convert to different formats
echo $binary->toHex();    // "48656c6c6f"
echo $binary->toBase64(); // "SGVsbG8="
echo $binary->toBase32(); // "JBSWY3DP"
echo $binary->size();     // 5

// Secure comparison
$other = BinaryString::fromString("Hello");
if ($binary->equals($other)) {
    echo "Strings are equal";
}

// Binary-safe substring search
if ($binary->contains(BinaryString::fromString("He"))) {
    echo "Binary data contains 'He'";
}
```

### BinaryWriter

```php
use KDuma\BinaryTools\BinaryWriter;
use KDuma\BinaryTools\BinaryString;
use KDuma\BinaryTools\IntType;

$writer = new BinaryWriter();

// Write different data types
$writer->writeByte(0x42)                          // Single byte
       ->writeInt(IntType::UINT16, 1234)          // 16-bit unsigned integer
       ->writeInt(IntType::INT32_LE, -500)        // 32-bit signed little-endian
       ->writeBytes(BinaryString::fromHex("abcd")) // Raw bytes
       ->writeString(BinaryString::fromString("Hello")); // UTF-8 string

// Write strings with length prefixes
$text = BinaryString::fromString("Hello World");
$writer->writeStringWith($text, length: IntType::UINT8);   // 8-bit length + string
$writer->writeStringWith($text, length: IntType::UINT16);  // 16-bit length + string
$writer->writeBytesWith(BinaryString::fromHex("abcd"), length: IntType::UINT16_LE); // Little-endian length + bytes

// Write strings with terminators
$writer->writeStringWith($text, terminator: Terminator::NUL);  // Null-terminated string
$writer->writeBytesWith($data, terminator: BinaryString::fromString("\r\n")); // Custom terminator

// Write fixed-size fields with padding
$writer->writeBytesWith(BinaryString::fromString('OK'), padding: BinaryString::fromString("\x20"), padding_size: 4);
$writer->writeStringWith(BinaryString::fromString('ID'), padding_size: 4); // Defaults to NUL padding

// Get the result
$result = $writer->getBuffer();
echo $result->toHex(); // Complete binary data as hex
```

### BinaryReader

```php
use KDuma\BinaryTools\BinaryReader;
use KDuma\BinaryTools\BinaryString;
use KDuma\BinaryTools\IntType;

$data = BinaryString::fromHex("4204d2abcd48656c6c6f0548656c6c6f20576f726c64000b48656c6c6f20576f726c64");
$reader = new BinaryReader($data);

// Read different data types
$byte = $reader->readByte();                    // 0x42
$uint16 = $reader->readInt(IntType::UINT16);    // 1234
$int32le = $reader->readInt(IntType::INT32_LE); // Little-endian 32-bit signed
$bytes = $reader->readBytes(2);                 // BinaryString with raw bytes
$stringData = $reader->readString(5);           // BinaryString with UTF-8 validation
$string = $stringData->toString();              // "Hello" - actual string value

// Read strings with length prefixes
$stringWithLength = $reader->readStringWith(length: IntType::UINT8);   // 8-bit length
$stringWithLength16 = $reader->readStringWith(length: IntType::UINT16); // 16-bit length
$bytesWithLength = $reader->readBytesWith(length: IntType::UINT16_LE);  // Little-endian length + bytes

// Read strings with terminators
$nullTermString = $reader->readStringWith(terminator: Terminator::NUL);  // Terminator required
$lineData = $reader->readBytesWith(optional_terminator: BinaryString::fromString("\r\n")); // Terminator optional

// Read padded fields (total size includes padding)
$status = $reader->readBytesWith(padding: BinaryString::fromString("\x20"), padding_size: 4);
$identifier = $reader->readStringWith(padding_size: 4); // Defaults to NUL padding

// Position management
echo $reader->position;        // Current position
echo $reader->remaining_bytes; // Bytes left
echo $reader->has_more_data;   // Boolean

// Peek without advancing
$nextByte = $reader->peekByte();
$next3Bytes = $reader->peekBytes(3);

// Seek to specific position
$reader->seek(0);  // Go to start
$reader->skip(5);  // Skip 5 bytes
```

> **📝 Reading Strings vs Binary Data**
>
> - Use `readString(length)` for UTF-8 text data that needs validation
> - Use `readBytes(length)` for raw binary data (magic bytes, checksums, etc.)
> - Use `readStringWith(length: IntType)` for strings with typed length prefixes
> - Use `readBytesWith(length: IntType)` for binary data with typed length prefixes
> - Use `readStringWith(terminator: Terminator|BinaryString)` when the terminator **must** be present
> - Use `readStringWith(optional_terminator: Terminator|BinaryString)` to read until terminator or end of data
> - Use `readBytesWith(terminator: Terminator|BinaryString)` when the terminator **must** be present
> - Use `readBytesWith(optional_terminator: Terminator|BinaryString)` to read until terminator or end of data
> - Use `readBytesWith(padding_size: int, padding: Terminator|BinaryString)` for fixed-size padded fields (pad byte must be single byte and absent from data)
> - Terminator arguments must be non-empty in both modes
> - Call `toString()` on BinaryString objects to get actual string values

## Terminator Support

The library supports both length-prefixed and terminator-delimited data parsing:

```php
use KDuma\BinaryTools\BinaryWriter;
use KDuma\BinaryTools\BinaryReader;
use KDuma\BinaryTools\BinaryString;
use KDuma\BinaryTools\Terminator;

// Create some data with different delimiters
$writer = new BinaryWriter();

// Null-terminated string (C-style)
$writer->writeStringWith(BinaryString::fromString("Hello World"), terminator: Terminator::NUL);

// Line-based data with CRLF terminator
$writer->writeBytesWith(BinaryString::fromString("Line 1"), terminator: BinaryString::fromString("\r\n"));
$writer->writeBytesWith(BinaryString::fromString("Line 2"), terminator: BinaryString::fromString("\r\n"));

// Group separator terminated data
$writer->writeStringWith(BinaryString::fromString("Record 1"), terminator: Terminator::GS);

// Read the data back
$reader = new BinaryReader($writer->getBuffer());

$nullTermString = $reader->readStringWith(terminator: Terminator::NUL);
echo $nullTermString->toString(); // "Hello World"

$line1 = $reader->readBytesWith(terminator: BinaryString::fromString("\r\n"));
$line2 = $reader->readBytesWith(terminator: BinaryString::fromString("\r\n"));
echo $line1->toString() . " and " . $line2->toString(); // "Line 1 and Line 2"

$record = $reader->readStringWith(terminator: Terminator::GS);
echo $record->toString(); // "Record 1"
```

### Available Terminators

| Terminator | Value | Description |
|------------|-------|-------------|
| `Terminator::NUL` | `\x00` | Null character (C-style strings) |
| `Terminator::SOH` | `\x01` | Start of Heading |
| `Terminator::STX` | `\x02` | Start of Text |
| `Terminator::ETX` | `\x03` | End of Text |
| `Terminator::EOT` | `\x04` | End of Transmission |
| `Terminator::ENQ` | `\x05` | Enquiry |
| `Terminator::ACK` | `\x06` | Acknowledge |
| `Terminator::BEL` | `\x07` | Bell |
| `Terminator::BS` | `\x08` | Backspace |
| `Terminator::HT` | `\x09` | Horizontal Tab |
| `Terminator::LF` | `\x0A` | Line Feed |
| `Terminator::VT` | `\x0B` | Vertical Tab |
| `Terminator::FF` | `\x0C` | Form Feed |
| `Terminator::CR` | `\x0D` | Carriage Return |
| `Terminator::SO` | `\x0E` | Shift Out |
| `Terminator::SI` | `\x0F` | Shift In |
| `Terminator::DLE` | `\x10` | Data Link Escape |
| `Terminator::DC1` | `\x11` | Device Control 1 (XON) |
| `Terminator::DC2` | `\x12` | Device Control 2 |
| `Terminator::DC3` | `\x13` | Device Control 3 (XOFF) |
| `Terminator::DC4` | `\x14` | Device Control 4 |
| `Terminator::NAK` | `\x15` | Negative Acknowledge |
| `Terminator::SYN` | `\x16` | Synchronous Idle |
| `Terminator::ETB` | `\x17` | End of Transmission Block |
| `Terminator::CAN` | `\x18` | Cancel |
| `Terminator::EM` | `\x19` | End of Medium |
| `Terminator::SUB` | `\x1A` | Substitute |
| `Terminator::ESC` | `\x1B` | Escape |
| `Terminator::FS` | `\x1C` | File Separator |
| `Terminator::GS` | `\x1D` | Group Separator |
| `Terminator::RS` | `\x1E` | Record Separator |
| `Terminator::US` | `\x1F` | Unit Separator |
| `Terminator::SP` | `\x20` | Space |
| `Terminator::CRLF` | `\x0D\x0A` | Carriage Return + Line Feed |
| Custom `BinaryString` | Any bytes | Custom terminator sequence |

## Common Use Cases

### Protocol Implementation

```php
// Writing a simple protocol message
$writer = new BinaryWriter();
$message = BinaryString::fromString("Hello, Protocol!");

$writer->writeByte(0x01)                           // Message type
       ->writeInt(IntType::UINT16, time() & 0xFFFF) // Timestamp (16-bit)
       ->writeStringWith($message, length: IntType::UINT8); // Payload

$packet = $writer->getBuffer();

// Reading the protocol message
$reader = new BinaryReader($packet);
$messageType = $reader->readByte();
$timestamp = $reader->readInt(IntType::UINT16);
$payload = $reader->readStringWith(length: IntType::UINT8);

echo "Type: {$messageType}, Time: {$timestamp}, Message: {$payload->toString()}";
```

### File Header Parsing

```php
// Parse a file with magic bytes and metadata
$fileData = BinaryString::fromHex("4d5a90000300000004000000ffff0000");
$reader = new BinaryReader($fileData);

$magic = $reader->readBytes(2)->toString();  // "MZ"
if ($magic === "MZ") {
    $bytesOnLastPage = $reader->readInt(IntType::UINT16);
    $pagesInFile = $reader->readInt(IntType::UINT16);
    // ... continue parsing
}
```

### Data Serialization

```php
// Serialize complex data
$writer = new BinaryWriter();

$users = [
    ['id' => 1, 'name' => 'Alice'],
    ['id' => 2, 'name' => 'Bob'],
];

$writer->writeByte(count($users)); // User count

foreach ($users as $user) {
    $writer->writeInt(IntType::UINT16, $user['id']);
    $writer->writeStringWith(BinaryString::fromString($user['name']), length: IntType::UINT8);
}

$serialized = $writer->getBuffer();

// Deserialize
$reader = new BinaryReader($serialized);
$userCount = $reader->readByte();

for ($i = 0; $i < $userCount; $i++) {
    $userId = $reader->readInt(IntType::UINT16);
    $userName = $reader->readStringWith(length: IntType::UINT8)->toString();
    echo "User {$userId}: {$userName}\n";
}
```

## API Reference

### BinaryString

| Method | Description |
|--------|-------------|
| `toString(): string` | Get raw binary data |
| `toHex(): string` | Convert to hexadecimal string |
| `toBase64(): string` | Convert to base64 string |
| `toBase32(string $alphabet = Base32::DEFAULT_ALPHABET): string` | Convert to base32 string |
| `size(): int` | Get byte length |
| `equals(BinaryString $other): bool` | Secure comparison |
| `fromString(string $value): static` | Create from string |
| `fromHex(string $hex): static` | Create from hex string |
| `fromBase64(string $base64): static` | Create from base64 |
| `fromBase32(string $base32, string $alphabet = Base32::DEFAULT_ALPHABET): static` | Create from base32 string |

### BinaryWriter

| Method | Description |
|--------|-------------|
| `getBuffer(): BinaryString` | Get written data |
| `getLength(): int` | Get buffer length |
| `reset(): void` | Clear buffer |
| `writeByte(int $byte): self` | Write single byte (0-255) |
| `writeBytes(BinaryString $bytes): self` | Write binary data |
| `writeInt(IntType $type, int $value): self` | Write integer with specified type |
| `writeString(BinaryString $string): self` | Write UTF-8 string |
| `writeBytesWith(BinaryString $bytes, ?IntType $length = null, Terminator\|BinaryString\|null $terminator = null, Terminator\|BinaryString\|null $padding = null, ?int $padding_size = null): self` | Write bytes with length prefix, terminator, or fixed padding |
| `writeStringWith(BinaryString $string, ?IntType $length = null, Terminator\|BinaryString\|null $terminator = null, Terminator\|BinaryString\|null $padding = null, ?int $padding_size = null): self` | Write string with length prefix, terminator, or fixed padding |

### BinaryReader

| Property/Method | Description |
|-----------------|-------------|
| `$position` | Current read position |
| `$length` | Total data length |
| `$remaining_bytes` | Bytes remaining |
| `$has_more_data` | Whether more data available |
| `$data` | Get original data as BinaryString |
| `$remaining_data` | Get remaining data |
| `readByte(): int` | Read single byte |
| `readBytes(int $count): BinaryString` | Read N bytes |
| `readInt(IntType $type): int` | Read integer with specified type |
| `readString(int $length): BinaryString` | Read UTF-8 string of specific length |
| `readBytesWith(?IntType $length = null, Terminator\|BinaryString\|null $terminator = null, Terminator\|BinaryString\|null $optional_terminator = null, Terminator\|BinaryString\|null $padding = null, ?int $padding_size = null): BinaryString` | Read bytes with length prefix, terminator, or fixed padding |
| `readStringWith(?IntType $length = null, Terminator\|BinaryString\|null $terminator = null, Terminator\|BinaryString\|null $optional_terminator = null, Terminator\|BinaryString\|null $padding = null, ?int $padding_size = null): BinaryString` | Read string with length prefix, terminator, or fixed padding |
| `peekByte(): int` | Peek next byte without advancing |
| `peekBytes(int $count): BinaryString` | Peek N bytes without advancing |
| `seek(int $position): void` | Seek to position |
| `skip(int $count): void` | Skip N bytes |

### IntType

The `IntType` enum defines various integer types with different byte sizes, signedness, and byte order.

| Type | Bytes | Signed | Little Endian | Min Value | Max Value | Platform Support |
|------|-------|--------|---------------|-----------|-----------|------------------|
| `UINT8` | 1 | No | N/A | 0 | 255 | Always |
| `INT8` | 1 | Yes | N/A | -128 | 127 | Always |
| `UINT16` | 2 | No | No | 0 | 65535 | Always |
| `INT16` | 2 | Yes | No | -32768 | 32767 | Always |
| `UINT16_LE` | 2 | No | Yes | 0 | 65535 | Always |
| `INT16_LE` | 2 | Yes | Yes | -32768 | 32767 | Always |
| `UINT32` | 4 | No | No | 0 | 4294967295 | Always |
| `INT32` | 4 | Yes | No | -2147483648 | 2147483647 | Always |
| `UINT32_LE` | 4 | No | Yes | 0 | 4294967295 | Always |
| `INT32_LE` | 4 | Yes | Yes | -2147483648 | 2147483647 | Always |
| `UINT64` | 8 | No | No | 0 | PHP_INT_MAX* | 64-bit only |
| `INT64` | 8 | Yes | No | PHP_INT_MIN* | PHP_INT_MAX* | 64-bit only |
| `UINT64_LE` | 8 | No | Yes | 0 | PHP_INT_MAX* | 64-bit only |
| `INT64_LE` | 8 | Yes | Yes | PHP_INT_MIN* | PHP_INT_MAX* | 64-bit only |

*64-bit types are limited by PHP's integer size on the platform.

#### IntType Methods

| Method | Description |
|--------|-------------|
| `bytes(): int` | Get byte size of the type |
| `isSigned(): bool` | Whether the type is signed |
| `isLittleEndian(): bool` | Whether the type uses little-endian byte order |
| `isSupported(): bool` | Whether the type is supported on current platform |
| `minValue(): int` | Get minimum valid value for the type |
| `maxValue(): int` | Get maximum valid value for the type |
| `isValid(int $value): bool` | Check if value is within valid range |

### Terminator

| Method | Description |
|--------|-------------|
| `toBytes(): BinaryString` | Get terminator as binary bytes |

**Available Cases:**
- `Terminator::NUL` - Null character (`\x00`)
- `Terminator::SOH` - Start of Heading (`\x01`)
- `Terminator::STX` - Start of Text (`\x02`)
- `Terminator::ETX` - End of Text (`\x03`)
- `Terminator::EOT` - End of Transmission (`\x04`)
- `Terminator::ENQ` - Enquiry (`\x05`)
- `Terminator::ACK` - Acknowledge (`\x06`)
- `Terminator::BEL` - Bell (`\x07`)
- `Terminator::BS` - Backspace (`\x08`)
- `Terminator::HT` - Horizontal Tab (`\x09`)
- `Terminator::LF` - Line Feed (`\x0A`)
- `Terminator::VT` - Vertical Tab (`\x0B`)
- `Terminator::FF` - Form Feed (`\x0C`)
- `Terminator::CR` - Carriage Return (`\x0D`)
- `Terminator::SO` - Shift Out (`\x0E`)
- `Terminator::SI` - Shift In (`\x0F`)
- `Terminator::DLE` - Data Link Escape (`\x10`)
- `Terminator::DC1` - Device Control 1 (XON) (`\x11`)
- `Terminator::DC2` - Device Control 2 (`\x12`)
- `Terminator::DC3` - Device Control 3 (XOFF) (`\x13`)
- `Terminator::DC4` - Device Control 4 (`\x14`)
- `Terminator::NAK` - Negative Acknowledge (`\x15`)
- `Terminator::SYN` - Synchronous Idle (`\x16`)
- `Terminator::ETB` - End of Transmission Block (`\x17`)
- `Terminator::CAN` - Cancel (`\x18`)
- `Terminator::EM` - End of Medium (`\x19`)
- `Terminator::SUB` - Substitute (`\x1A`)
- `Terminator::ESC` - Escape (`\x1B`)
- `Terminator::FS` - File Separator (`\x1C`)
- `Terminator::GS` - Group Separator (`\x1D`)
- `Terminator::RS` - Record Separator (`\x1E`)
- `Terminator::US` - Unit Separator (`\x1F`)
- `Terminator::SP` - Space (`\x20`)
- `Terminator::CRLF` - Carriage Return + Line Feed (`\x0D\x0A`)

## Deprecated Methods

The following methods are deprecated but remain available for backward compatibility:

- `BinaryWriter::writeUint16BE(int $value)` - Use `writeInt(IntType::UINT16, $value)` instead
- `BinaryWriter::writeBytesWithLength(BinaryString $bytes, bool $use16BitLength = false)` - Use `writeBytesWith($bytes, length: IntType $length)` instead
- `BinaryWriter::writeStringWithLength(BinaryString $string, bool $use16BitLength = false)` - Use `writeStringWith($string, length: IntType $length)` instead
- `BinaryReader::readUint16BE()` - Use `readInt(IntType::UINT16)` instead
- `BinaryReader::readBytesWithLength(bool $use16BitLength = false)` - Use `readBytesWith(length: IntType::UINT8)` instead
- `BinaryReader::readStringWithLength(bool $use16BitLength = false)` - Use `readStringWith(length: IntType::UINT8)` instead

## Error Handling

The library throws appropriate exceptions for error conditions:

- `InvalidArgumentException` - Invalid parameters (e.g., byte values > 255, invalid Base32 alphabet, invalid Base32 characters)
- `RuntimeException` - Runtime errors (e.g., reading past end of data, invalid UTF-8)

```php
try {
    $reader = new BinaryReader(BinaryString::fromHex("41"));
    $reader->readBytes(5); // Trying to read more than available
} catch (RuntimeException $e) {
    echo "Error: " . $e->getMessage();
}
```

## Binary Tools for PHP - API Reference

This documentation is auto-generated from the source code.

### Table of Contents

* [`\KDuma\BinaryTools\BinaryString`](#BinaryString)
    * [`BinaryString::$value`](#BinaryStringvalue)
    * [`BinaryString::toString()`](#BinaryStringtoString)
    * [`BinaryString::toHex()`](#BinaryStringtoHex)
    * [`BinaryString::toBase64()`](#BinaryStringtoBase64)
    * [`BinaryString::toBase32(...)`](#BinaryStringtoBase32)
    * [`BinaryString::size()`](#BinaryStringsize)
    * [`BinaryString::fromString(...)`](#BinaryStringfromString)
    * [`BinaryString::fromHex(...)`](#BinaryStringfromHex)
    * [`BinaryString::fromBase64(...)`](#BinaryStringfromBase64)
    * [`BinaryString::fromBase32(...)`](#BinaryStringfromBase32)
    * [`BinaryString::equals(...)`](#BinaryStringequals)
    * [`BinaryString::contains(...)`](#BinaryStringcontains)
* [`\KDuma\BinaryTools\BinaryWriter`](#BinaryWriter)
    * [`BinaryWriter::getBuffer()`](#BinaryWritergetBuffer)
    * [`BinaryWriter::getLength()`](#BinaryWritergetLength)
    * [`BinaryWriter::reset()`](#BinaryWriterreset)
    * [`BinaryWriter::writeByte(...)`](#BinaryWriterwriteByte)
    * [`BinaryWriter::writeBytes(...)`](#BinaryWriterwriteBytes)
    * [`BinaryWriter::writeBytesWith(...)`](#BinaryWriterwriteBytesWith)
    * [`BinaryWriter::writeInt(...)`](#BinaryWriterwriteInt)
    * [`BinaryWriter::writeString(...)`](#BinaryWriterwriteString)
    * [`BinaryWriter::writeStringWith(...)`](#BinaryWriterwriteStringWith)
    * [`BinaryWriter::writeUint16BE(...)`](#BinaryWriterwriteUint16BE)
    * [`BinaryWriter::writeBytesWithLength(...)`](#BinaryWriterwriteBytesWithLength)
    * [`BinaryWriter::writeStringWithLength(...)`](#BinaryWriterwriteStringWithLength)
* [`\KDuma\BinaryTools\BinaryReader`](#BinaryReader)
    * [`BinaryReader::$length`](#BinaryReaderlength)
    * [`BinaryReader::$data`](#BinaryReaderdata)
    * [`BinaryReader::$position`](#BinaryReaderposition)
    * [`BinaryReader::$remaining_bytes`](#BinaryReaderremaining_bytes)
    * [`BinaryReader::$has_more_data`](#BinaryReaderhas_more_data)
    * [`BinaryReader::$remaining_data`](#BinaryReaderremaining_data)
    * [`BinaryReader::readByte()`](#BinaryReaderreadByte)
    * [`BinaryReader::readBytes(...)`](#BinaryReaderreadBytes)
    * [`BinaryReader::readBytesWith(...)`](#BinaryReaderreadBytesWith)
    * [`BinaryReader::readInt(...)`](#BinaryReaderreadInt)
    * [`BinaryReader::readString(...)`](#BinaryReaderreadString)
    * [`BinaryReader::readStringWith(...)`](#BinaryReaderreadStringWith)
    * [`BinaryReader::peekByte()`](#BinaryReaderpeekByte)
    * [`BinaryReader::peekBytes(...)`](#BinaryReaderpeekBytes)
    * [`BinaryReader::skip(...)`](#BinaryReaderskip)
    * [`BinaryReader::seek(...)`](#BinaryReaderseek)
    * [`BinaryReader::readUint16BE()`](#BinaryReaderreadUint16BE)
    * [`BinaryReader::readBytesWithLength(...)`](#BinaryReaderreadBytesWithLength)
    * [`BinaryReader::readStringWithLength(...)`](#BinaryReaderreadStringWithLength)
* [Enums](#enums)
    * [`\KDuma\BinaryTools\IntType`](#IntType)
    * [`\KDuma\BinaryTools\Terminator`](#Terminator)

### BinaryString

**Namespace:** `KDuma\BinaryTools`

**Type:** Final Class

#### Properties

#### `$value`

```php
string $value
```

--------------------

#### Methods

##### toString()

```php
\KDuma\BinaryTools\BinaryString::toString(): string
```

Returns the raw binary value as a PHP string.

**Returns:** <code>string</code>

--------------------

##### toHex()

```php
\KDuma\BinaryTools\BinaryString::toHex(): string
```

Serialises the binary value into an ASCII hexadecimal string.

**Returns:** <code>string</code>

--------------------

##### toBase64()

```php
\KDuma\BinaryTools\BinaryString::toBase64(): string
```

Serialises the binary value using Base64 encoding.

**Returns:** <code>string</code>

--------------------

##### toBase32(...)

```php
\KDuma\BinaryTools\BinaryString::toBase32(
    string $alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
): string
```

Returns a Base32-encoded string representation of the binary value.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`alphabet`** | <code>string</code> (optional) | Alphabet to use when encoding. |

**Returns:** <code>string</code>

--------------------

##### size()

```php
\KDuma\BinaryTools\BinaryString::size(): int
```

Returns the number of bytes contained in the value.

**Returns:** <code>int</code>

--------------------

##### fromString(...)

```php
\KDuma\BinaryTools\BinaryString::fromString(
    string $value
): static
```

Creates a BinaryString from an existing PHP string without validation.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`value`** | <code>string</code> | Raw binary data. |

**Returns:** <code>static</code>

--------------------

##### fromHex(...)

```php
\KDuma\BinaryTools\BinaryString::fromHex(
    string $hex
): static
```

Creates a BinaryString from a hexadecimal dump.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`hex`** | <code>string</code> | Hexadecimal representation of the data. |

**Returns:** <code>static</code>

--------------------

##### fromBase64(...)

```php
\KDuma\BinaryTools\BinaryString::fromBase64(
    string $base64
): static
```

Creates a BinaryString from a Base64-encoded payload.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`base64`** | <code>string</code> | Base64 representation of the data. |

**Returns:** <code>static</code>

--------------------

##### fromBase32(...)

```php
\KDuma\BinaryTools\BinaryString::fromBase32(
    string $base32,
    string $alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
): static
```

Decodes a Base32-encoded string to a BinaryString instance using the specified alphabet.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`base32`** | <code>string</code> | Base32 payload to decode. |
| **`alphabet`** | <code>string</code> (optional) | Alphabet that was used during encoding. |

**Returns:** <code>static</code>

--------------------

##### equals(...)

```php
\KDuma\BinaryTools\BinaryString::equals(
    \KDuma\BinaryTools\BinaryString $other
): bool
```

Performs a timing-safe comparison with another BinaryString.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`other`** | <code>\KDuma\BinaryTools\BinaryString</code> | Value to compare against. |

**Returns:** <code>bool</code>

--------------------

##### contains(...)

```php
\KDuma\BinaryTools\BinaryString::contains(
    \KDuma\BinaryTools\BinaryString $needle
): bool
```

Determines whether the provided binary fragment appears in the value.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`needle`** | <code>\KDuma\BinaryTools\BinaryString</code> | Fragment to look for. |

**Returns:** <code>bool</code>

--------------------

---

### BinaryWriter

**Namespace:** `KDuma\BinaryTools`

**Type:** Final Class

#### Methods

##### getBuffer()

```php
\KDuma\BinaryTools\BinaryWriter::getBuffer(): \KDuma\BinaryTools\BinaryString
```

Returns the buffered bytes as a BinaryString without resetting the writer.

**Returns:** <code>\KDuma\BinaryTools\BinaryString</code>

--------------------

##### getLength()

```php
\KDuma\BinaryTools\BinaryWriter::getLength(): int
```

Returns the number of bytes written so far.

**Returns:** <code>int</code>

--------------------

##### reset()

```php
\KDuma\BinaryTools\BinaryWriter::reset(): void
```

Clears the buffer so subsequent writes start from an empty state.

**Returns:** <code>void</code>

--------------------

##### writeByte(...)

```php
\KDuma\BinaryTools\BinaryWriter::writeByte(
    int $byte
): self
```

Appends a single byte value (0-255) to the buffer.

**Throws:**  \InvalidArgumentException When the value is outside the valid byte range.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`byte`** | <code>int</code> | Byte value to write. |

**Returns:** <code>self</code>

--------------------

##### writeBytes(...)

```php
\KDuma\BinaryTools\BinaryWriter::writeBytes(
    \KDuma\BinaryTools\BinaryString $bytes
): self
```

Appends raw bytes to the buffer.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`bytes`** | <code>\KDuma\BinaryTools\BinaryString</code> | Data to append. |

**Returns:** <code>self</code>

--------------------

##### writeBytesWith(...)

```php
\KDuma\BinaryTools\BinaryWriter::writeBytesWith(
    \KDuma\BinaryTools\BinaryString $bytes,
    ?\KDuma\BinaryTools\IntType $length = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $terminator = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $optional_terminator = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $padding = null,
    ?int $padding_size = null
): self
```

Writes variable-length data using one of the available strategies: typed length, terminator or fixed padding.

**Throws:**  \InvalidArgumentException When configuration is invalid or the data violates the chosen mode.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`bytes`** | <code>\KDuma\BinaryTools\BinaryString</code> | Data to write. |
| **`length`** | <code>\?KDuma\BinaryTools\IntType</code> (optional) | Integer type describing the length field when using length mode. |
| **`terminator`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Mandatory terminator sequence. |
| **`optional_terminator`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Optional terminator sequence (currently emits a notice and behaves like $terminator). |
| **`padding`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Single-byte padding value for fixed-width fields. |
| **`padding_size`** | <code>?int</code> (optional) | Total field width when padding is enabled. |

**Returns:** <code>self</code>

--------------------

##### writeInt(...)

```php
\KDuma\BinaryTools\BinaryWriter::writeInt(
    \KDuma\BinaryTools\IntType $type,
    int $value
): self
```

Serialises an integer according to the provided {@see IntType} definition.

**Throws:**  \RuntimeException When the type is unsupported on this platform.

**Throws:**  \InvalidArgumentException When the value lies outside the type's range.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`type`** | <code>\KDuma\BinaryTools\IntType</code> | Integer description covering width, signedness, and byte order. |
| **`value`** | <code>int</code> | Value to serialise. |

**Returns:** <code>self</code>

--------------------

##### writeString(...)

```php
\KDuma\BinaryTools\BinaryWriter::writeString(
    \KDuma\BinaryTools\BinaryString $string
): self
```

Writes a UTF-8 validated string without terminator or padding.

**Throws:**  \InvalidArgumentException When the data is not valid UTF-8.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`string`** | <code>\KDuma\BinaryTools\BinaryString</code> | UTF-8 string data to emit. |

**Returns:** <code>self</code>

--------------------

##### writeStringWith(...)

```php
\KDuma\BinaryTools\BinaryWriter::writeStringWith(
    \KDuma\BinaryTools\BinaryString $string,
    ?\KDuma\BinaryTools\IntType $length = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $terminator = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $optional_terminator = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $padding = null,
    ?int $padding_size = null
): self
```

Writes a UTF-8 string using one of the variable-length strategies.

**Throws:**  \InvalidArgumentException When configuration is invalid or the string is not UTF-8.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`string`** | <code>\KDuma\BinaryTools\BinaryString</code> | UTF-8 string data to emit. |
| **`length`** | <code>\?KDuma\BinaryTools\IntType</code> (optional) | Integer type describing the length field when using length mode. |
| **`terminator`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Mandatory terminator sequence. |
| **`optional_terminator`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Optional terminator sequence (currently emits a notice and behaves like $terminator). |
| **`padding`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Single-byte padding value for fixed-width fields. |
| **`padding_size`** | <code>?int</code> (optional) | Total field width when padding is enabled. |

**Returns:** <code>self</code>

--------------------

##### writeUint16BE(...)

```php
\KDuma\BinaryTools\BinaryWriter::writeUint16BE(
    int $value
): self
```

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`value`** | <code>int</code> | Unsigned 16-bit value. |

**Returns:** <code>self</code>

--------------------

##### writeBytesWithLength(...)

```php
\KDuma\BinaryTools\BinaryWriter::writeBytesWithLength(
    \KDuma\BinaryTools\BinaryString $bytes,
    bool $use16BitLength = false
): self
```

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`bytes`** | <code>\KDuma\BinaryTools\BinaryString</code> | Payload to write. |
| **`use16BitLength`** | <code>bool</code> (optional) | When true, emits a 16-bit length; otherwise an 8-bit length. |

**Returns:** <code>self</code>

--------------------

##### writeStringWithLength(...)

```php
\KDuma\BinaryTools\BinaryWriter::writeStringWithLength(
    \KDuma\BinaryTools\BinaryString $string,
    bool $use16BitLength = false
): self
```

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`string`** | <code>\KDuma\BinaryTools\BinaryString</code> | UTF-8 string to write. |
| **`use16BitLength`** | <code>bool</code> (optional) | When true, emits a 16-bit length; otherwise an 8-bit length. |

**Returns:** <code>self</code>

--------------------

---

### BinaryReader

**Namespace:** `KDuma\BinaryTools`

**Type:** Final Class

#### Properties

#### `$length`

```php
int $length
```

--------------------

#### `$data`

```php
KDuma\BinaryTools\BinaryString $data
```

--------------------

#### `$position`

```php
int $position
```

--------------------

#### `$remaining_bytes`

```php
int $remaining_bytes
```

--------------------

#### `$has_more_data`

```php
bool $has_more_data
```

--------------------

#### `$remaining_data`

```php
KDuma\BinaryTools\BinaryString $remaining_data
```

--------------------

#### Methods

##### readByte()

```php
\KDuma\BinaryTools\BinaryReader::readByte(): int
```

Reads the next byte from the stream.

**Throws:**  RuntimeException When no more data is available.

**Returns:** <code>int</code>

--------------------

##### readBytes(...)

```php
\KDuma\BinaryTools\BinaryReader::readBytes(
    int $count
): \KDuma\BinaryTools\BinaryString
```

Reads exactly $count bytes from the current position.

**Throws:**  RuntimeException When fewer than $count bytes remain.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`count`** | <code>int</code> | Number of bytes to read. |

**Returns:** <code>\KDuma\BinaryTools\BinaryString</code>

--------------------

##### readBytesWith(...)

```php
\KDuma\BinaryTools\BinaryReader::readBytesWith(
    ?\KDuma\BinaryTools\IntType $length = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $terminator = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $optional_terminator = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $padding = null,
    ?int $padding_size = null
): \KDuma\BinaryTools\BinaryString
```

Reads variable-length data using exactly one of the supplied strategies (length, terminator, optional terminator, or padding).

**Throws:**  \InvalidArgumentException When mutually exclusive modes are combined or configuration is invalid.

**Throws:**  RuntimeException When the data violates the expectations of the chosen mode.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`length`** | <code>\?KDuma\BinaryTools\IntType</code> (optional) | Integer type that stores the byte length when using length mode. |
| **`terminator`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Required terminator sequence when using terminator mode. |
| **`optional_terminator`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Terminator sequence that may be absent (fully consumes buffer when missing). |
| **`padding`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Single-byte padding value used for fixed-width fields. |
| **`padding_size`** | <code>?int</code> (optional) | Total field width in bytes when padding is enabled. |

**Returns:** <code>\KDuma\BinaryTools\BinaryString</code>

--------------------

##### readInt(...)

```php
\KDuma\BinaryTools\BinaryReader::readInt(
    \KDuma\BinaryTools\IntType $type
): int
```

Reads an integer using the provided {@see IntType} definition.

**Throws:**  RuntimeException When the type is unsupported or the value cannot be represented.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`type`** | <code>\KDuma\BinaryTools\IntType</code> | Integer description covering width, signedness, and byte order. |

**Returns:** <code>int</code>

--------------------

##### readString(...)

```php
\KDuma\BinaryTools\BinaryReader::readString(
    int $length
): \KDuma\BinaryTools\BinaryString
```

Reads a fixed-length UTF-8 string.

**Throws:**  RuntimeException When insufficient data remains or decoding fails.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`length`** | <code>int</code> | Number of bytes to consume. |

**Returns:** <code>\KDuma\BinaryTools\BinaryString</code>

--------------------

##### readStringWith(...)

```php
\KDuma\BinaryTools\BinaryReader::readStringWith(
    ?\KDuma\BinaryTools\IntType $length = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $terminator = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $optional_terminator = null,
    \KDuma\BinaryTools\Terminator|\KDuma\BinaryTools\BinaryString|null $padding = null,
    ?int $padding_size = null
): \KDuma\BinaryTools\BinaryString
```

Reads a UTF-8 string using one of the variable-length strategies (length, terminator, optional terminator, or padding).

**Throws:**  \InvalidArgumentException When configuration is invalid.

**Throws:**  RuntimeException When decoding fails or the data violates mode rules.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`length`** | <code>\?KDuma\BinaryTools\IntType</code> (optional) | Integer type specifying the length field when using length mode. |
| **`terminator`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Required terminator. |
| **`optional_terminator`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Optional terminator. |
| **`padding`** | <code>\KDuma\BinaryTools\Terminator\|KDuma\BinaryTools\BinaryString\|null</code> (optional) | Single-byte padding value for fixed-width fields. |
| **`padding_size`** | <code>?int</code> (optional) | Total field width when padding is enabled. |

**Returns:** <code>\KDuma\BinaryTools\BinaryString</code>

--------------------

##### peekByte()

```php
\KDuma\BinaryTools\BinaryReader::peekByte(): int
```

Returns the next byte without advancing the read pointer.

**Throws:**  RuntimeException When no more data remains.

**Returns:** <code>int</code> - int Unsigned byte value.

--------------------

##### peekBytes(...)

```php
\KDuma\BinaryTools\BinaryReader::peekBytes(
    int $count
): \KDuma\BinaryTools\BinaryString
```

Returns the next $count bytes without advancing the read pointer.

**Throws:**  RuntimeException When fewer than $count bytes remain.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`count`** | <code>int</code> | Number of bytes to inspect. |

**Returns:** <code>\KDuma\BinaryTools\BinaryString</code>

--------------------

##### skip(...)

```php
\KDuma\BinaryTools\BinaryReader::skip(
    int $count
): void
```

Advances the read pointer by $count bytes.

**Throws:**  RuntimeException When insufficient data remains.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`count`** | <code>int</code> | Number of bytes to skip. |

**Returns:** <code>void</code>

--------------------

##### seek(...)

```php
\KDuma\BinaryTools\BinaryReader::seek(
    int $position
): void
```

Moves the read pointer to an absolute offset inside the buffer.

**Throws:**  RuntimeException When the target lies outside the buffer.

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`position`** | <code>int</code> | Zero-based offset to seek to. |

**Returns:** <code>void</code>

--------------------

##### readUint16BE()

```php
\KDuma\BinaryTools\BinaryReader::readUint16BE(): int
```

**Returns:** <code>int</code>

--------------------

##### readBytesWithLength(...)

```php
\KDuma\BinaryTools\BinaryReader::readBytesWithLength(
    bool $use16BitLength = false
): \KDuma\BinaryTools\BinaryString
```

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`use16BitLength`** | <code>bool</code> (optional) | When true, reads a 16-bit length; otherwise an 8-bit length. |

**Returns:** <code>\KDuma\BinaryTools\BinaryString</code>

--------------------

##### readStringWithLength(...)

```php
\KDuma\BinaryTools\BinaryReader::readStringWithLength(
    bool $use16BitLength = false
): \KDuma\BinaryTools\BinaryString
```

| Param | Type | Description |
| ----- | ---- | ----------- |
| **`use16BitLength`** | <code>bool</code> (optional) | When true, reads a 16-bit length; otherwise an 8-bit length. |

**Returns:** <code>\KDuma\BinaryTools\BinaryString</code>

--------------------

---

### Enums

#### IntType

**Namespace:** `\KDuma\BinaryTools\IntType`

| Members | Value | Description |
| ------- | ----- | ----------- |
| **`UINT8`** | <code>'UINT8'</code> | Unsigned 8-bit integer (0-255) - Single byte |
| **`INT8`** | <code>'INT8'</code> | Signed 8-bit integer (-128 to 127) - Single byte |
| **`UINT16`** | <code>'UINT16'</code> | Unsigned 16-bit integer (0-65535) - Big-endian byte order |
| **`INT16`** | <code>'INT16'</code> | Signed 16-bit integer (-32768 to 32767) - Big-endian byte order |
| **`UINT32`** | <code>'UINT32'</code> | Unsigned 32-bit integer (0-4294967295) - Big-endian byte order |
| **`INT32`** | <code>'INT32'</code> | Signed 32-bit integer (-2147483648 to 2147483647) - Big-endian byte order |
| **`UINT16_LE`** | <code>'UINT16_LE'</code> | Unsigned 16-bit integer (0-65535) - Little-endian byte order |
| **`INT16_LE`** | <code>'INT16_LE'</code> | Signed 16-bit integer (-32768 to 32767) - Little-endian byte order |
| **`UINT32_LE`** | <code>'UINT32_LE'</code> | Unsigned 32-bit integer (0-4294967295) - Little-endian byte order |
| **`INT32_LE`** | <code>'INT32_LE'</code> | Signed 32-bit integer (-2147483648 to 2147483647) - Little-endian byte order |
| **`UINT64`** | <code>'UINT64'</code> | Unsigned 64-bit integer - Big-endian byte order (platform dependent range) |
| **`INT64`** | <code>'INT64'</code> | Signed 64-bit integer - Big-endian byte order (platform dependent range) |
| **`UINT64_LE`** | <code>'UINT64_LE'</code> | Unsigned 64-bit integer - Little-endian byte order (platform dependent range) |
| **`INT64_LE`** | <code>'INT64_LE'</code> | Signed 64-bit integer - Little-endian byte order (platform dependent range) |

--------------------

#### Terminator

**Namespace:** `\KDuma\BinaryTools\Terminator`

| Members | Value | Description |
| ------- | ----- | ----------- |
| **`NUL`** | <code>'NUL'</code> | Null character (0x00) - Commonly used for C-style string termination |
| **`SOH`** | <code>'SOH'</code> | Start of Heading (0x01) - Indicates the start of a header block |
| **`STX`** | <code>'STX'</code> | Start of Text (0x02) - Marks the beginning of text data |
| **`ETX`** | <code>'ETX'</code> | End of Text (0x03) - Marks the end of text data |
| **`EOT`** | <code>'EOT'</code> | End of Transmission (0x04) - Indicates end of data transmission |
| **`ENQ`** | <code>'ENQ'</code> | Enquiry (0x05) - Request for response or status |
| **`ACK`** | <code>'ACK'</code> | Acknowledge (0x06) - Positive acknowledgment signal |
| **`BEL`** | <code>'BEL'</code> | Bell (0x07) - Audio alert or notification signal |
| **`BS`** | <code>'BS'</code> | Backspace (0x08) - Move cursor back one position |
| **`HT`** | <code>'HT'</code> | Horizontal Tab (0x09) - Move to next tab stop |
| **`LF`** | <code>'LF'</code> | Line Feed (0x0A) - Move to next line (Unix line ending) |
| **`VT`** | <code>'VT'</code> | Vertical Tab (0x0B) - Move to next vertical tab position |
| **`FF`** | <code>'FF'</code> | Form Feed (0x0C) - Start new page or clear screen |
| **`CR`** | <code>'CR'</code> | Carriage Return (0x0D) - Return to start of line (classic Mac line ending) |
| **`SO`** | <code>'SO'</code> | Shift Out (0x0E) - Switch to alternate character set |
| **`SI`** | <code>'SI'</code> | Shift In (0x0F) - Switch back to standard character set |
| **`DLE`** | <code>'DLE'</code> | Data Link Escape (0x10) - Escape sequence for data link protocols |
| **`DC1`** | <code>'DC1'</code> | Device Control 1 (0x11) - Also known as XON for flow control |
| **`DC2`** | <code>'DC2'</code> | Device Control 2 (0x12) - General device control |
| **`DC3`** | <code>'DC3'</code> | Device Control 3 (0x13) - Also known as XOFF for flow control |
| **`DC4`** | <code>'DC4'</code> | Device Control 4 (0x14) - General device control |
| **`NAK`** | <code>'NAK'</code> | Negative Acknowledge (0x15) - Error or rejection signal |
| **`SYN`** | <code>'SYN'</code> | Synchronous Idle (0x16) - Synchronization in data streams |
| **`ETB`** | <code>'ETB'</code> | End of Transmission Block (0x17) - End of data block marker |
| **`CAN`** | <code>'CAN'</code> | Cancel (0x18) - Cancel current operation |
| **`EM`** | <code>'EM'</code> | End of Medium (0x19) - End of storage medium |
| **`SUB`** | <code>'SUB'</code> | Substitute (0x1A) - Replacement for invalid character |
| **`ESC`** | <code>'ESC'</code> | Escape (0x1B) - Start of escape sequence |
| **`FS`** | <code>'FS'</code> | File Separator (0x1C) - Delimiter between files |
| **`GS`** | <code>'GS'</code> | Group Separator (0x1D) - Delimiter between groups of data |
| **`RS`** | <code>'RS'</code> | Record Separator (0x1E) - Delimiter between records |
| **`US`** | <code>'US'</code> | Unit Separator (0x1F) - Delimiter between units of data |
| **`SP`** | <code>'SP'</code> | Space (0x20) - Standard whitespace character |
| **`CRLF`** | <code>'CRLF'</code> | Carriage Return + Line Feed (0x0D 0x0A) - Windows line ending |

--------------------


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
| `writeBytesWith(BinaryString $bytes, ?IntType $length = null, Terminator\|BinaryString\|null $terminator = null): self` | Write bytes with length prefix or terminator |
| `writeStringWith(BinaryString $string, ?IntType $length = null, Terminator\|BinaryString\|null $terminator = null): self` | Write string with length prefix or terminator |

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
| `readBytesWith(?IntType $length = null, Terminator\|BinaryString\|null $terminator = null, Terminator\|BinaryString\|null $optional_terminator = null): BinaryString` | Read bytes with length prefix, required terminator, or optional terminator |
| `readStringWith(?IntType $length = null, Terminator\|BinaryString\|null $terminator = null, Terminator\|BinaryString\|null $optional_terminator = null): BinaryString` | Read string with length prefix, required terminator, or optional terminator |
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

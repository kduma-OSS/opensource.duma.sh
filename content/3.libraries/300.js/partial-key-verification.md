---
title: Partial Key Verification Library for TS/JS
description: Serial number generation scheme for offline key validation
type: library
platform: JavaScript & TypeScript
github: https://github.com/kduma-OSS/JS-Partial-Key-Verification
featured: 10
featured_description: Serial number generation scheme for offline key validation
featured_icon: fluent:key-24-regular
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/JS-Partial-Key-Verification" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/JS-Partial-Key-Verification/releases/latest/" target="_blank"}

:u-button[NPM]{icon="tabler:brand-npm" href="https://www.npmjs.com/package/pkv.js" target="_blank"}
::

This is a port of my other C# library [Partial Key Verification Library for Compact Framework](/libraries/net/partial-key-verification) into a JavaScript/TypeScript package.

This library implements Partial Key Verification (PKV). PKV is a cryptographic technique that allows verification of a subset of a key without revealing the entire key, enhancing security and privacy in various applications.

## Partial Key Verification

Partial Key Verification (PKV) is a software licensing key technique that breaks
a product key into multiple subkeys. With each version of your software, you
check a different subset of the subkeys.  The beauty of this approach is that a
cracker cannot generate a complete keygen.  They might be able to generate one
for a given version, but it won't work on a different release (assuming you check
a different subkey).  Another nice feature of PVK is that the key contains an
embedded serial number.  This allows you to easily check the key against a list
of stolen/posted/refunded keys. For more information about the PKV technique,
see [this blog post by Brandon Staggs](http://www.brandonstaggs.com/2007/07/26/implementing-a-partial-serial-number-verification-system-in-delphi/).

This version of PKV differs slightly from the one discussed by Brandon Staggs.  
Instead of using 8-bit subkeys, I used 32-bit subkeys (just check one key instead
of four). My version also Base-32 (5-bit) encodes the keys to shrink the key size
by 20%, and allows you to specify a different hash algorithm for each subkey.


## Installation

You can install the package via NPM:

```bash
npm install pkv.js
```

## Usage

### Quick Start

To quick start using the library, you can use the [`KeyGenerator.Desktop` tool from the C# version](/libraries/net/partial-key-verification#quick-start).  
This tool generates a key and a definition file. You can then use the definition file to generate validation code via [`CodeGenerator`](/libraries/js/partial-key-verification#key-definitions). The validation code
can be used to validate the key.  For more information, see the [C# version](/libraries/net/partial-key-verification#quick-start).

### `PartialKeyGenerator` API

To generate a key, create a `PartialKeyGenerator` specifying the checksum
and hash functions to use, along with the base values for each subkey. Then
call the `generate` function, passing it a serial number or a string (such as
the customer's e-mail address) to generate a key. You can optionally tell the
generator to add a separator between a certain number of characters in the
key by setting the `spacing` property.

```ts
import { PartialKeyGenerator, Adler16, Jenkins96 } from "pkv.js";

const generator = PartialKeyGenerator.fromSingleHash(
  new Adler16(),
  new Jenkins96(0),
  [1, 2, 3, 4]
);

generator.setSpacing(6);

const key = generator.generateFromString("bob@smith.com");
console.log(key);
// -> "QDKZUO-JLLWPY-XWOULC-ONCQIN-5R5X35-ZS3KEQ"
````

This will generate the key: `QDKZUO-JLLWPY-XWOULC-ONCQIN-5R5X35-ZS3KEQ`.
Adler16 is the checksum function, and Jenkins96 is the hash function.
You can have as many subkeys as you like, but each subkey adds seven more characters to the key.

---

#### Static constructors

* `PartialKeyGenerator.fromKeyDefinition(def: KeyDefinition): PartialKeyGenerator`

    * `def: KeyDefinition` — Serial generation definition

* `PartialKeyGenerator.fromSingleHash(checksum: Checksum16Interface, hash: HashInterface, baseKeys: number[]): PartialKeyGenerator`

    * `checksum: Checksum16Interface` — The checksum algorithm to use.
    * `hash: HashInterface` — The hash algorithm to use.
    * `baseKeys: number[]` — The integer base keys used to generate the subkeys (one base key for each subkey).

* `PartialKeyGenerator.fromMultipleHashes(checksum: Checksum16Interface, hashFunctions: HashInterface[], baseKeys: number[]): PartialKeyGenerator`

    * `checksum: Checksum16Interface` — The checksum algorithm to use.
    * `hashFunctions: HashInterface[]` — A list of hash functions to use. If the number of hash functions is less than the number of `baseKeys`, then the functions cycle back to the first function. It is recommended to use several different hash functions.
    * `baseKeys: number[]` — The integers used to generate the subkeys.

---

#### Methods

* `setSpacing(spacing: number): void`

    * Sets the spacing of the key separator.
    * `spacing: number` — The number of characters after which to insert a separator.

* `generate(seed: number): string`

    * Generate a key based on the given seed.
    * `seed: number` — The seed value to generate the key from.
    * Returns: licensing key as a string.

* `generateFromString(seed: string): string`

    * Generate a key based on the given string seed. The string is hashed to create an integer seed.
    * `seed: string` — The string seed to generate the key from.
    * Returns: licensing key as a string.

* `generateMany(numberOfKeys: number, randomizer?: () => number): Record<number, string>`

    * Generates a set of random keys.
    * `numberOfKeys: number` — The number of keys to generate.
    * `randomizer?: () => number` — Optional random number generator (useful for reproducibility).
    * Returns: an object mapping `seed => key`.

---

### Key Definitions

For ease of use, there is a prepared format for storing and retrieving key definitions in a file.
When saved with `.pkvk` file extension, definitions are interchangeable with the [C# KeyGenerator.Desktop tool](/libraries/net/partial-key-verification#quick-start).
There is also a generator for creating definitions and validation code for automated pipelines.

::code-group

```ts [generate definition]
import { DefinitionGenerator } from "pkv.js";

const numberOfKeys = 10;
const definition = DefinitionGenerator.makeDefinition(numberOfKeys);
```

```ts [serialize to XML]
import { XmlKeyDefinitionSerializer } from "pkv.js";

const xml = XmlKeyDefinitionSerializer.serialize(definition);
```

```ts [deserialize from XML]
import { XmlKeyDefinitionSerializer } from "pkv.js";

const def = XmlKeyDefinitionSerializer.deserialize(xmlString);
```

```ts [generate validation code]
import { CodeGenerator, DefinitionGenerator } from "pkv.js";

const definition = DefinitionGenerator.makeDefinition(5);
const enabledKeys = [1, 2, 5];
const serials = [111111, 22222, 33333, 44444];
const validateUsername = true;

const generator = new CodeGenerator(definition);
generator.setValidateUsername(validateUsername);
generator.setBlacklistedSerials(serials);
generator.setVerifiedKeys(enabledKeys);

const code = generator.toString();
console.log(code); // TypeScript validation method snippet
```

::

---

### `PartialKeyValidator` API

To validate a key, use the `PartialKeyValidator` class. Provide the checksum and hash functions to use, along with which subkey to check and the base value for that subkey.

For example, to check the first subkey of the key generated above:

```ts
import { PartialKeyValidator, Adler16, OneAtATime } from "pkv.js";

const isValid = PartialKeyValidator.validateKey(
  new Adler16(),
  new OneAtATime(),
  key,
  0,
  1
);
```

---

#### Static methods

* `PartialKeyValidator.validateKey(checksum: Checksum16Interface, hash: HashInterface, key: string, subkeyIndex: number, subkeyBase: number): boolean`

    * Validates the given key. Verifies the checksum and the subkey at the specified index.
    * `checksum: Checksum16Interface` — The checksum algorithm used.
    * `hash: HashInterface` — The hash algorithm used.
    * `key: string` — The key to validate.
    * `subkeyIndex: number` — The index (zero-based) of the subkey to check.
    * `subkeyBase: number` — The unsigned base integer used to create the subkey.
    * Returns: `true` if the key is valid; otherwise `false`.

* `PartialKeyValidator.validateKeyWithSeedString(checksum: Checksum16Interface, hash: HashInterface, key: string, subkeyIndex: number, subkeyBase: number, seedString: string): boolean`

    * Validates the given key. Verifies that the given string seed matches the seed embedded in the key, verifies the checksum, and validates the subkey. Useful if the seed was derived from user information (e.g., name or email).
    * `checksum: Checksum16Interface` — The checksum algorithm.
    * `hash: HashInterface` — The hash algorithm.
    * `key: string` — The key to validate.
    * `subkeyIndex: number` — The index of the subkey to check.
    * `subkeyBase: number` — The unsigned base integer used to create the subkey.
    * `seedString: string` — The string used to generate the seed.
    * Returns: `true` if valid; otherwise `false`.

* `PartialKeyValidator.getSerialNumberFromKey(key: string): number`

    * Extracts the serial number from a key.
    * `key: string` — The key to extract from.
    * Returns: serial number embedded in the key.

* `PartialKeyValidator.getSerialNumberFromSeed(seed: string): number`

    * Converts a string seed into a serial number.
    * `seed: string` — The string seed.
    * Returns: serial number derived from the seed.

---

#### Sample validation code

```ts
import { PartialKeyValidator, Adler16, OneAtATime, Fnv1a } from "pkv.js";

private static validateKey(key: string): boolean {
  const seed = PartialKeyValidator.getSerialNumberFromKey(key);
  const blacklist = [1518008798, 42];
  if (blacklist.includes(seed)) return false;

  // Validation for key with index 1
  if (!PartialKeyValidator.validateKey(new Adler16(), new OneAtATime(), key, 1, 766109221))
    return false;

  // Validation for key with index 4
  if (!PartialKeyValidator.validateKey(new Adler16(), new Fnv1a(), key, 4, 4072442218))
    return false;

  return true;
}
```

---

### Available Checksum Algorithms (`Checksum16Interface`)

* `Adler16`
* `Crc16`
* `CrcCcitt`

### Available Hashing Algorithms (`HashInterface`)

* `Crc32`
* `Fnv1a`
* `GeneralizedCrc`
* `Jenkins06`
* `Jenkins96`
* `OneAtATime`
* `SuperFast`


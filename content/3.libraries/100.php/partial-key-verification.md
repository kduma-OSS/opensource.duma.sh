---
title: Partial Key Verification Library for PHP
description: Serial number generation scheme for offline key validation
type: library
platform: PHP
github: https://github.com/kduma-OSS/PHP-Partial-Key-Verification
featured: 6
featured_description: Serial number generation scheme for offline key validation
featured_icon: fluent:key-24-regular
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/PHP-Partial-Key-Verification" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/PHP-Partial-Key-Verification/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/pkv" target="_blank"}
::

This is a port of my other C# library [Partial Key Verification Library for Compact Framework](/libraries/net/partial-key-verification) into a PHP package.

This library is compatible with my [.NET CF](/libraries/net/partial-key-verification) and [JavaScript/TypeScript](/libraries/js/partial-key-verification) ports.

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

You can install the package via composer:

```bash
composer require kduma/pkv
```

## Usage

### Quick Start

To quick start using the library, you can use the [`KeyGenerator.Desktop` tool from the C# version](/libraries/net/partial-key-verification#quick-start).  
This tool generates a key and a definition file. You can then use the definition file to generate validation code via [`CodeGenerator`](/libraries/php/partial-key-verification#key-definitions). The validation code
can be used to validate the key.  For more information, see the [C# version](/libraries/net/partial-key-verification#quick-start).


### `\KDuma\PKV\Generator\PartialKeyGenerator` API

To generate a key, create a PartialKeyGenerator class specifying the checksum
and hash functions to use, along with the base values for each subkey. Then
call the Generate function, passing it a serial number or a string (such as
the customer's e-mail address) to generate a key. You can optionally tell the
generator to add a separator between a certain number of characters in the
key by setting the Spacing property.

```php
$generator = \KDuma\PKV\Generator\PartialKeyGenerator::fromSingleHash(
    new \KDuma\PKV\Checksum\Adler16(),
    new \KDuma\PKV\Hash\Jenkins96(0),
    [1, 2, 3, 4]
);

$generator->setSpacing(6);

$key = $generator->generateFromString('bob@smith.com');
```

This will generate the key: `QDKZUO-JLLWPY-XWOULC-ONCQIN-5R5X35-ZS3KEQ`. Adler16 is
the checksum function, and Jenkins96 is the hash function. You can have as many
subkeys as you like, but each subkey adds seven more characters to the key.

Static constructors:
* `\KDuma\PKV\Generator\PartialKeyGenerator::fromKeyDefinition(\KDuma\PKV\Generator\KeyDefinition $def): self`{lang="php"}
    * `\KDuma\PKV\Generator\KeyDefinition $def`{lang="php"} - Serial generation definition
* `\KDuma\PKV\Generator\PartialKeyGenerator::fromSingleHash(\KDuma\PKV\Checksum\Checksum16Interface $checksum, \KDuma\PKV\Hash\HashInterface $hash, array $baseKeys): self`{lang="php"}
    * `\KDuma\PKV\Checksum\Checksum16Interface $checksum`{lang="php"} - The checksum algorithm to use.
    * `\KDuma\PKV\Hash\HashInterface $hash`{lang="php"} - The hash algorithm to use.
    * `array $baseKeys`{lang="php"} - The integer bases keys used to generate the sub keys (one base key for each sub key).
* `\KDuma\PKV\Generator\PartialKeyGenerator::fromMultipleHashes(\KDuma\PKV\Checksum\Checksum16Interface $checksum, array $hashFunctions, array $baseKeys): self`{lang="php"}
    * `\KDuma\PKV\Checksum\Checksum16Interface $checksum`{lang="php"} - The checksum algorithm to use.
    * `array $hashFunctions`{lang="php"} - A list of hash functions to use. If the number of hash functions is less than the number `baseKeys, then the functions cycles back to the first function.  It is recommended to use several different hash functions.
    * `array $baseKeys`{lang="php"} - The integers used to generate the sub key.

Methods:
* `setSpacing(int $spacing): void`{lang="php"}
    * Sets the spacing of the key separator.
    * `int $spacing`{lang="php"} - The number of characters to insert a separator after.
* `generate(int $seed): string`{lang="php"}
    * Generate a key based on the given seed.
    * `int $seed`{lang="php"} - The seed value to generate the key from.
    * Returns a licensing key.
* `generateFromString(string $seed): string`{lang="php"}
    * Generate a key based on the given string seed. Generate will hash the given string to create an int seed.
    * `string $seed`{lang="php"} - The seed value to generate the key from.
    * Returns a licensing key.
* `generateMany(int $numberOfKeys, ?\Random\Randomizer $randomizer = null): array`{lang="php"}
    * Generates a set of random keys.
    * `int $numberOfKeys`{lang="php"} - The number of keys to generate.
    * `?\Random\Randomizer $randomizer`{lang="php"} - The random number generator to use.
    * Returns an array of randomly generate keys.

#### Key Definitions

For ease of use, there is a prepared format for storing and retrieving key definition in a file.
When saved with `.pkvk` file extension, definitions are interchangeable with [`KeyGenerator.Desktop` tool from the C# version](/libraries/net/partial-key-verification#quick-start).
There is also a generation tool for generating definitions and verification code for automated pipelines.

::code-group
```php [generate definition]
$numberOfKeys = 10;

$definition = \KDuma\PKV\Generator\DefinitionGenerator::makeDefinition($numberOfKeys);
```

```php [save to file]
$file = 'secret.pkvk';

\KDuma\PKV\Generator\XmlKeyDefinitionSerializer.SaveToFile($file, $definition);
```

```php [read from file]
$file = 'secret.pkvk';

$definition = \KDuma\PKV\Generator\XmlKeyDefinitionSerializer::loadFromFile($file);
```

```php [generate validation code]
$file = 'secret.pkvk';
$definition = \KDuma\PKV\Generator\DefinitionGenerator::makeDefinition(5);
$enabledKeys = [1, 2, 5];
$serials = [111111, 22222, 33333, 44444];
$validateUsername = true;

$geerator = new CodeGenerator($definition);
$geerator->setValidateUsername($validateUsername);
$geerator->setBlacklistedSerials($serials);
$geerator->setVerifiedKeys($enabledKeys);

$code = (string) $generator;
```
::

### `\KDuma\PKV\PartialKeyValidator` API

To validate the key, use the PartialKeyValidator static class. Again telling it
the checksum and hash functions to use, along with which subkey to check and the
base value for that subkey. For example, to check the first subkey of the key
generated above:

```php
$isValid = \KDuma\PKV\PartialKeyValidator::validateKey(new \KDuma\PKV\Checksum\Adler16(), new \KDuma\PKV\Hash\OneAtATime(), $key, 0, 1)
```

Static methods:
* `PartialKeyValidator::validateKey(\KDuma\PKV\Checksum\Checksum16Interface $checksum, \KDuma\PKV\Hash\HashInterface $hash, string $key, int $subkeyIndex, int $subkeyBase): bool`{lang="php"}
    * Validates the given key. Verifies the checksum and each sub key.
    * `\KDuma\PKV\Checksum\Checksum16Interface $checksum`{lang="php"} - The hash algorithm used to compute the sub key.
    * `\KDuma\PKV\Hash\HashInterface $hash`{lang="php"} - The checksum algorithm used to compute the key's checksum.
    * `string $key`{lang="php"} - The key to validate.
    * `int $subkeyIndex`{lang="php"} - The index (zero based) of the sub key to check.
    * `int $subkeyBase`{lang="php"} - The unsigned base integer used create the sub key.
    * Returns `true` if the `$key` is valid; `false` otherwise.
* `\KDuma\PKV\PartialKeyValidator::validateKeyWithSeedString(\KDuma\PKV\Checksum\Checksum16Interface $checksum, \KDuma\PKV\Hash\HashInterface $hash, string $key, int $subkeyIndex, int $subkeyBase, string $seedString): bool`{lang="php"}
    * Validates the given key. Verifies the given string seed matches the seed embedded in the key, verifies the checksum and each sub key. This version is useful if the seed used to generate a key was derived from some user information such as the user's name, e-mail, etc.
    * `\KDuma\PKV\Checksum\Checksum16Interface $checksum`{lang="php"} - The hash algorithm used to compute the sub key.
    * `\KDuma\PKV\Hash\HashInterface $hash`{lang="php"} - The checksum algorithm used to compute the key's checksum.
    * `string $key`{lang="php"} - The key to validate.
    * `int $subkeyIndex`{lang="php"} - The index (zero based) of the sub key to check.
    * `int $subkeyBase`{lang="php"} - The unsigned base integer used create the sub key.
    * `string $seedString`{lang="php"} - The string used to generate the seed for the key.
    * Returns `true` if the `$key` is valid; `false` otherwise.
* `\KDuma\PKV\PartialKeyValidator::getSerialNumberFromKey(string $key): int`{lang="php"}
    * Extracts the serial number from a key.
    * `string $key`{lang="php"} - The key to extract the serial number from.
    * Returns the serial number embedded in the key.
* `\KDuma\PKV\PartialKeyValidator::getSerialNumberFromSeed(string $seed): int`{lang="php"}
    * Converts a string seed into a serial number (uint seed).
    * `string $seed`{lang="php"} - The string seed to convert.
    * Returns the string seed converted to a serial number.

#### Sample validation code
```php
private static function validateKey(string $key): bool {
	$seed = \KDuma\PKV\PartialKeyValidator::getSerialNumberFromKey($key);
	$blacklist = [1518008798, 42];
	if (in_array($seed, $blacklist, true))
		return false;

	// Validation for key with index 1
	if (!\KDuma\PKV\PartialKeyValidator::validateKey(new \KDuma\PKV\Checksum\Adler16(), new \KDuma\PKV\Hash\OneAtATime(), $key, 1, 766109221))
		return false;

	// Validation for key with index 4
	if (!\KDuma\PKV\PartialKeyValidator::validateKey(new \KDuma\PKV\Checksum\Adler16(), new \KDuma\PKV\Hash\Fnv1a(), $key, 4, 4072442218))
		return false;

	return true;
}
```

### Available Checksum Algorithms (`\KDuma\PKV\Checksum\Checksum16Interface`)

* `\KDuma\PKV\Checksum\Adler16`
* `\KDuma\PKV\Checksum\Crc16`
* `\KDuma\PKV\Checksum\CrcCcitt`

### Available Hashing Algorithms (`\KDuma\PKV\Hash\HashInterface`)

* `\KDuma\PKV\Hash\Crc32`
* `\KDuma\PKV\Hash\Fnv1a`
* `\KDuma\PKV\Hash\GeneralizedCrc`
* `\KDuma\PKV\Hash\Jenkins06`
* `\KDuma\PKV\Hash\Jenkins96`
* `\KDuma\PKV\Hash\OneAtATime`
* `\KDuma\PKV\Hash\SuperFast`
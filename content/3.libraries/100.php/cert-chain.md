---
navigation:
    title: Certificate Chain
title: Certificate Chain of Trust
description: A PHP library for binary data manipulation and encoding/decoding operations. This library provides safe, efficient tools for working with binary data, including UTF-8 validation and secure string comparisons.
type: library
platform: PHP
active: true
github: https://github.com/kduma-OSS/PHP-cert-chain
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/PHP-cert-chain" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/PHP-cert-chain/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/cert-chain" target="_blank"}
::


## ✨ Key Features

- 🔐 **Ed25519 Cryptography**: Fast, secure elliptic curve signatures via libsodium
- 📜 **Flexible Certificate System**: Generic end-entity flags for maximum reusability
- 🏗️ **Hierarchical Trust**: Root CAs, intermediate CAs, and end-entity certificates
- 🔍 **Strict Validation**: Comprehensive security checks and flag inheritance validation
- 💾 **Binary Format**: Efficient serialization for storage and transmission
- 🛡️ **Security-First**: Unique KeyId validation, proper certificate chain verification
- 🚀 **Modern PHP**: Built for PHP 8.4+ with readonly classes and strict typing

## 📦 Installation

Install with [Composer](https://getcomposer.org/):

```bash
composer require kduma/cert-chain
```

**Requirements:**
- PHP 8.4+
- Extensions: `ext-sodium`, `ext-hash`, `ext-mbstring`

## 🚀 Quick Start

### Create a Root Certificate Authority

```php
<?php
use KDuma\CertificateChainOfTrust\Certificate;
use KDuma\CertificateChainOfTrust\Crypto\Ed25519;
use KDuma\CertificateChainOfTrust\DTO\{
    CertificateFlag,
    CertificateFlagsCollection,
    DescriptorType,
    Signature,
    UserDescriptor
};

// Generate a key pair for the root CA
$rootKeyPair = Ed25519::makeKeyPair();

// Create and self-sign the root certificate
$rootCA = new Certificate(
    key: $rootKeyPair->toPublicKey(),
    description: 'My Root Certificate Authority',
    userDescriptors: [
        new UserDescriptor(DescriptorType::DOMAIN, 'ca.example.com'),
        new UserDescriptor(DescriptorType::EMAIL, 'admin@example.com'),
    ],
    flags: CertificateFlagsCollection::fromList([
        CertificateFlag::ROOT_CA,           // Self-signed root
        CertificateFlag::INTERMEDIATE_CA,   // Can sign other CAs
        CertificateFlag::CA,               // Can sign end-entity certs
        CertificateFlag::END_ENTITY_FLAG_1, // Generic capability 1
        CertificateFlag::END_ENTITY_FLAG_2, // Generic capability 2
    ]),
    signatures: []
);

// Self-sign the certificate
$rootCA = $rootCA->with(
    signatures: [Signature::make($rootCA->toBinaryForSigning(), $rootKeyPair)]
);
```

### Create and Sign an End-Entity Certificate

```php
// Generate key pair for end-entity certificate
$leafKeyPair = Ed25519::makeKeyPair();

$leafCert = new Certificate(
    key: $leafKeyPair->toPublicKey(),
    description: 'Document Signing Certificate',
    userDescriptors: [
        new UserDescriptor(DescriptorType::USERNAME, 'john.doe'),
        new UserDescriptor(DescriptorType::EMAIL, 'john.doe@example.com'),
    ],
    flags: CertificateFlagsCollection::fromList([
        CertificateFlag::END_ENTITY_FLAG_1, // Must be subset of signer's flags
    ]),
    signatures: []
);

// Sign with the root CA
$leafCert = $leafCert->with(
    signatures: [Signature::make($leafCert->toBinaryForSigning(), $rootKeyPair)]
);
```

### Validate Certificate Chains

```php
use KDuma\CertificateChainOfTrust\{Chain, TrustStore, Validator};

// Create certificate chain (leaf to root)
$chain = new Chain([$leafCert, $rootCA]);

// Create trust store with trusted root CAs
$trustStore = new TrustStore([$rootCA]);

// Validate the chain
$result = Validator::validateChain($chain, $trustStore);

if ($result->isValid) {
    echo "✅ Certificate chain is valid!\n";
    echo "Validated " . count($result->validatedChain) . " certificates\n";
} else {
    echo "❌ Validation failed:\n";
    foreach ($result->getErrorMessages() as $error) {
        echo "- $error\n";
    }
}
```

### Sign and Verify Messages

```php
use KDuma\BinaryTools\BinaryString;

// Sign a message
$message = BinaryString::fromString('Important document content');
$signature = Signature::make($message, $leafKeyPair);

// Verify the signature
$isValid = $signature->validate($message, $leafCert->key);
echo $isValid ? "✅ Signature valid" : "❌ Signature invalid";
```

## 🏗️ Certificate Flag System

The library uses a flexible flag system for maximum reusability:

### CA-Level Flags
- `ROOT_CA` (0x0001): Self-signed root certificate authority
- `INTERMEDIATE_CA` (0x0002): Can sign CA-level certificates
- `CA` (0x0004): Can sign end-entity certificates

### Generic End-Entity Flags
- `END_ENTITY_FLAG_1` through `END_ENTITY_FLAG_8` (0x0100-0x8000)
- Use these for any purpose: document signing, code signing, email encryption, etc.
- **Flag Inheritance**: Certificate flags must be a subset of the signer's flags

## 🔐 Security Model

- **Unique KeyIds**: All certificates in a chain must have unique identifiers
- **Flag Inheritance**: End-entity flags are inherited down the chain (strict subset rule)
- **Proper Authority**: CA flags determine what types of certificates can be signed
- **Cryptographic Verification**: Ed25519 signatures with full chain validation
- **Trust Anchors**: Only certificates in the TrustStore are trusted

## 🔧 Advanced Features

### Binary Serialization
```php
// Serialize for storage/transmission
$binaryData = $certificate->toBinary();
$chainData = $chain->toBinary();
$trustStoreData = $trustStore->toBinary();

// Load from binary
$loadedCert = Certificate::fromBinary($binaryData);
$loadedChain = Chain::fromBinary($chainData);
```

### Complex Hierarchies
```php
// Multi-level certificate hierarchies
$rootCA = createRootCA();
$policyCA = createPolicyCA($rootCA);
$issuingCA = createIssuingCA($policyCA);
$endEntity = createEndEntity($issuingCA);

$chain = new Chain([$endEntity, $issuingCA, $policyCA, $rootCA]);
```

### Batch Operations
```php
// Efficient validation of multiple certificates
foreach ($certificates as $cert) {
    $result = Validator::validateChain(
        new Chain([$cert, $intermediateCA, $rootCA]),
        $trustStore
    );
    // Process result...
}
```

# PHP Certificate Chain of Trust - Complete Documentation

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)
- [Security Model](#security-model)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Binary Format](#binary-format)

## Introduction

PHP Certificate Chain of Trust is a modern library for creating, managing, and validating certificate chains using Ed25519 cryptography. Built on top of libsodium, it provides a secure and efficient way to implement certificate authorities, digital signatures, and trust relationships.

### Key Features

- **Ed25519 Cryptography**: Fast, secure elliptic curve signatures
- **Flexible Certificate Flags**: 8 generic end-entity flags plus CA-level flags
- **Hierarchical Trust**: Support for root CAs, intermediate CAs, and end-entity certificates
- **Binary Serialization**: Efficient storage and transmission format
- **Strict Validation**: Comprehensive security checks and flag inheritance validation
- **Modern PHP**: Built for PHP 8.4+ with strict typing and readonly classes

### Architecture Overview

The library follows a layered architecture:

```
┌─────────────────┐
│   Applications  │  ← Your code using the library
├─────────────────┤
│   Validation    │  ← Certificate chain validation logic
├─────────────────┤
│   Certificate   │  ← Certificate, Chain, TrustStore classes
├─────────────────┤
│   Cryptography  │  ← Ed25519 key generation and signing
├─────────────────┤
│   Binary Format │  ← Serialization and parsing
└─────────────────┘
```

## Installation

### Requirements

- **PHP**: 8.4 or higher
- **Extensions**: `ext-hash`, `ext-mbstring`, `ext-sodium`
- **Dependencies**: `kduma/binary-tools`, `paragonie/sodium_compat`

### Install with Composer

```bash
composer require kduma/cert-chain
```

### Development Dependencies

For development and testing:

```bash
composer require --dev kduma/cert-chain
composer run test          # Run tests
composer run test-coverage # Generate coverage report
composer run lint          # Check code style
composer run fix           # Fix code style
```

## Quick Start

### Creating Your First Certificate Authority

```php
<?php
use KDuma\CertificateChainOfTrust\Certificate;
use KDuma\CertificateChainOfTrust\Crypto\Ed25519;
use KDuma\CertificateChainOfTrust\DTO\{
    CertificateFlag,
    CertificateFlagsCollection,
    DescriptorType,
    Signature,
    UserDescriptor
};

// Generate a key pair for the root CA
$rootKeyPair = Ed25519::makeKeyPair();

// Create the root certificate
$rootCert = new Certificate(
    key: $rootKeyPair->toPublicKey(),
    description: 'My Root Certificate Authority',
    userDescriptors: [
        new UserDescriptor(DescriptorType::DOMAIN, 'ca.example.com'),
        new UserDescriptor(DescriptorType::EMAIL, 'admin@example.com'),
    ],
    flags: CertificateFlagsCollection::fromList([
        CertificateFlag::ROOT_CA,
        CertificateFlag::INTERMEDIATE_CA,
        CertificateFlag::CA,
        CertificateFlag::END_ENTITY_FLAG_1, // Generic capability 1
    ]),
    signatures: []
);

// Self-sign the root certificate
$rootCert = $rootCert->with(
    signatures: [Signature::make($rootCert->toBinaryForSigning(), $rootKeyPair)]
);
```

### Creating a Signed Certificate

```php
// Generate a key pair for an end-entity certificate
$leafKeyPair = Ed25519::makeKeyPair();

$leafCert = new Certificate(
    key: $leafKeyPair->toPublicKey(),
    description: 'Document Signing Certificate',
    userDescriptors: [
        new UserDescriptor(DescriptorType::USERNAME, 'john.doe'),
        new UserDescriptor(DescriptorType::EMAIL, 'john.doe@example.com'),
    ],
    flags: CertificateFlagsCollection::fromList([
        CertificateFlag::END_ENTITY_FLAG_1, // Must be subset of signer's flags
    ]),
    signatures: []
);

// Sign with the root CA
$leafCert = $leafCert->with(
    signatures: [Signature::make($leafCert->toBinaryForSigning(), $rootKeyPair)]
);
```

### Validating Certificate Chains

```php
use KDuma\CertificateChainOfTrust\{Chain, TrustStore, Validator};

// Create a certificate chain (leaf to root)
$chain = new Chain([$leafCert, $rootCert]);

// Create a trust store with trusted root CAs
$trustStore = new TrustStore([$rootCert]);

// Validate the chain
$result = Validator::validateChain($chain, $trustStore);

if ($result->isValid) {
    echo "Certificate chain is valid!\n";
    echo "Validated chain has " . count($result->validatedChain) . " certificates\n";
} else {
    echo "Validation failed:\n";
    foreach ($result->getErrorMessages() as $error) {
        echo "- $error\n";
    }
}
```

## Core Concepts

### Certificates

Certificates are immutable objects that contain:
- **Public Key**: Ed25519 public key (32 bytes)
- **Key ID**: First 16 bytes of SHA-256 hash of the public key
- **Description**: Human-readable UTF-8 description
- **User Descriptors**: Optional identity information (username, email, domain)
- **Flags**: Permissions and capabilities
- **Signatures**: One or more cryptographic signatures

### Certificate Flags

The library uses a hierarchical flag system:

#### CA-Level Flags
- `ROOT_CA` (0x0001): Self-signed root certificate authority
- `INTERMEDIATE_CA` (0x0002): Can sign CA-level certificates
- `CA` (0x0004): Can sign end-entity certificates

#### End-Entity Flags
- `END_ENTITY_FLAG_1` (0x0100): Generic capability 1
- `END_ENTITY_FLAG_2` (0x0200): Generic capability 2
- `END_ENTITY_FLAG_3` (0x0400): Generic capability 3
- `END_ENTITY_FLAG_4` (0x0800): Generic capability 4
- `END_ENTITY_FLAG_5` (0x1000): Generic capability 5
- `END_ENTITY_FLAG_6` (0x2000): Generic capability 6
- `END_ENTITY_FLAG_7` (0x4000): Generic capability 7
- `END_ENTITY_FLAG_8` (0x8000): Generic capability 8

### Flag Inheritance Rules

1. **Signing Authority**:
   - To sign non-CA certificates: signer must have `CA` flag
   - To sign CA-level certificates: signer must have `INTERMEDIATE_CA` flag

2. **End-Entity Inheritance**:
   - Certificate's end-entity flags must be a subset of signer's end-entity flags
   - Example: If signer has `FLAG_1 | FLAG_2`, certificate can have `FLAG_1`, `FLAG_2`, or both, but not `FLAG_3`

### Certificate Chains

A chain represents a path from an end-entity certificate to a trusted root:

```
[End Entity] → [Intermediate CA] → [Root CA]
```

Key requirements:
- Each certificate must have unique KeyId
- Each certificate must be properly signed by the next certificate in the chain
- Flag inheritance must be respected throughout the chain
- Chain must terminate with a self-signed ROOT_CA certificate

### Trust Stores

Trust stores contain trusted root CA certificates:
- Only self-signed ROOT_CA certificates allowed
- All certificates must have unique KeyIds
- Used as trust anchors during validation

## API Reference

### Core Classes

#### Certificate

```php
readonly class Certificate
{
    public function __construct(
        public PublicKey $key,
        public string $description,
        public array $userDescriptors,     // UserDescriptor[]
        public CertificateFlagsCollection $flags,
        public array $signatures           // Signature[]
    );
}
```

**Key Methods:**

```php
// Create a new certificate with updated signatures
public function with(array $signatures): Certificate

// Check if certificate is a root CA
public function isRootCA(): bool

// Check if certificate is self-signed
public function isSelfSigned(): bool

// Get signature by signer's KeyId
public function getSignatureByKeyId(KeyId $keyId): ?Signature

// Get self-signature (if exists)
public function getSelfSignature(): ?Signature

// Serialize for signing (TBS - To Be Signed data)
public function toBinaryForSigning(): BinaryString

// Full binary serialization
public function toBinary(): BinaryString
public static function fromBinary(BinaryString $data): Certificate
```

**Example Usage:**

```php
// Check certificate properties
if ($certificate->isRootCA()) {
    echo "This is a root CA certificate\n";
}

if ($certificate->flags->hasCA()) {
    echo "Certificate can sign other certificates\n";
}

// Binary serialization
$binaryData = $certificate->toBinary();
$restored = Certificate::fromBinary($binaryData);
```

#### Chain

```php
readonly class Chain extends CertificatesContainer
{
    public function __construct(array $certificates = []);
}
```

**Key Methods:**

```php
// Get the first certificate (typically the end-entity)
public function getFirstCertificate(): ?Certificate

// Build all possible paths from a certificate to root CAs
public function buildPaths(?Certificate $leaf = null): array

// Inherited from CertificatesContainer
public function getById(KeyId $keyId): ?Certificate
public function toBinary(): BinaryString
public static function fromBinary(BinaryString $data): Chain
```

**Example Usage:**

```php
// Create a chain
$chain = new Chain([$endEntity, $intermediate, $rootCA]);

// Find all valid paths to root CAs
$paths = $chain->buildPaths($endEntity);
echo "Found " . count($paths) . " possible certification paths\n";
```

#### TrustStore

```php
readonly class TrustStore extends CertificatesContainer
{
    public function __construct(array $certificates = []);
}
```

**Key Methods:**

```php
// Inherited from CertificatesContainer
public function getById(KeyId $keyId): ?Certificate
public function toBinary(): BinaryString
public static function fromBinary(BinaryString $data): TrustStore
```

**Validation:**
- Only ROOT_CA certificates allowed
- All certificates must have unique KeyIds
- All certificates must be self-signed

**Example Usage:**

```php
try {
    $trustStore = new TrustStore([$rootCA1, $rootCA2]);
    echo "Trust store created with " . count($trustStore->certificates) . " root CAs\n";
} catch (InvalidArgumentException $e) {
    echo "Invalid certificate for trust store: " . $e->getMessage() . "\n";
}
```

#### Validator

```php
class Validator
{
    public static function validateChain(Chain $chain, TrustStore $store): ValidationResult;
}
```

**Validation Process:**
1. Structure and signature presence validation
2. KeyId computation and verification
3. Unique KeyId validation within chain
4. Path building from leaf to trusted root
5. Certificate authority validation
6. End-entity flag inheritance validation
7. Cryptographic signature verification

**Example Usage:**

```php
$result = Validator::validateChain($chain, $trustStore);

if (!$result->isValid) {
    echo "Validation failed with " . count($result->errors) . " errors:\n";
    foreach ($result->getErrorMessages() as $error) {
        echo "- $error\n";
    }
}

if (!empty($result->warnings)) {
    echo "Warnings:\n";
    foreach ($result->getWarningMessages() as $warning) {
        echo "- $warning\n";
    }
}
```

### Cryptography Classes

#### Ed25519

```php
class Ed25519
{
    public static function makeKeyPair(): PrivateKeyPair;
}
```

**Example Usage:**

```php
$keyPair = Ed25519::makeKeyPair();
echo "Generated key pair with KeyId: " . $keyPair->keyId->toString() . "\n";
```

#### PrivateKeyPair

```php
readonly class PrivateKeyPair
{
    public function __construct(
        public KeyId $keyId,
        public BinaryString $publicKey,
        public BinaryString $secretKey
    );
}
```

**Key Methods:**

```php
public function toPublicKey(): PublicKey
public function toBinary(): BinaryString
public static function fromBinary(BinaryString $data): PrivateKeyPair
```

#### PublicKey

```php
readonly class PublicKey
{
    public function __construct(
        public KeyId $id,
        public BinaryString $publicKey
    );
}
```

#### KeyId

```php
readonly class KeyId
{
    public static function fromPublicKey(BinaryString $publicKey): KeyId;
    public function toString(): string;
    public function equals(KeyId $other): bool;
}
```

### DTO Classes

#### CertificateFlag

```php
enum CertificateFlag: int
{
    case ROOT_CA = 0x0001;
    case INTERMEDIATE_CA = 0x0002;
    case CA = 0x0004;
    case END_ENTITY_FLAG_1 = 0x0100;
    // ... through END_ENTITY_FLAG_8 = 0x8000;
}
```

**Methods:**

```php
public function toString(): string;
public static function fromByte(int $byte): self;
```

#### CertificateFlagsCollection

```php
class CertificateFlagsCollection
{
    public static function fromList(array $flags): self;
    public static function fromInt(int $value): self;
    public static function EndEntityFlags(): self;
    public static function CAFlags(): self;
}
```

**Key Methods:**

```php
public function has(CertificateFlag $flag): bool;
public function hasRootCA(): bool;
public function hasIntermediateCA(): bool;
public function hasCA(): bool;
public function hasEndEntityFlag1(): bool; // through hasEndEntityFlag8()
public function isCA(): bool;
public function getEndEntityFlags(): CertificateFlagsCollection;
public function getCAFlags(): CertificateFlagsCollection;
public function isSubsetOf(CertificateFlagsCollection $other): bool;
public function toString(): string;
```

**Example Usage:**

```php
$flags = CertificateFlagsCollection::fromList([
    CertificateFlag::CA,
    CertificateFlag::END_ENTITY_FLAG_1,
    CertificateFlag::END_ENTITY_FLAG_2
]);

if ($flags->hasCA()) {
    echo "Certificate can sign other certificates\n";
}

$endEntityFlags = $flags->getEndEntityFlags();
echo "End-entity flags: " . $endEntityFlags->toString() . "\n";
```

#### UserDescriptor

```php
readonly class UserDescriptor
{
    public function __construct(
        public DescriptorType $type,
        public string $value
    );
}
```

#### DescriptorType

```php
enum DescriptorType: int
{
    case USERNAME = 0x01;
    case EMAIL = 0x02;
    case DOMAIN = 0x03;
}
```

#### Signature

```php
readonly class Signature
{
    public static function make(BinaryString $data, PrivateKeyPair $keyPair): self;
    public function validate(BinaryString $data, PublicKey $publicKey): bool;
}
```

#### ValidationResult

```php
readonly class ValidationResult
{
    public function __construct(
        public array $errors = [],           // ValidationError[]
        public array $warnings = [],         // ValidationWarning[]
        public array $validatedChain = [],   // Certificate[]
        public bool $isValid = true
    );

    public function getErrorMessages(): array;
    public function getWarningMessages(): array;
}
```

## Advanced Usage

### Complex Certificate Hierarchies

```php
// Create a multi-level hierarchy
$rootCA = createRootCA();
$policyCA = createPolicyCA($rootCA);  // Specialized intermediate CA
$issuingCA = createIssuingCA($policyCA);  // Final issuing authority
$endEntity = createEndEntity($issuingCA);

$chain = new Chain([$endEntity, $issuingCA, $policyCA, $rootCA]);
$trustStore = new TrustStore([$rootCA]);

$result = Validator::validateChain($chain, $trustStore);
```

### Working with Multiple End-Entity Flags

```php
// Certificate with multiple capabilities
$multiCapabilityCert = new Certificate(
    key: $keyPair->toPublicKey(),
    description: 'Multi-purpose Certificate',
    userDescriptors: [new UserDescriptor(DescriptorType::EMAIL, 'service@example.com')],
    flags: CertificateFlagsCollection::fromList([
        CertificateFlag::END_ENTITY_FLAG_1,  // e.g., Document signing
        CertificateFlag::END_ENTITY_FLAG_2,  // e.g., Code signing
        CertificateFlag::END_ENTITY_FLAG_3,  // e.g., Email encryption
    ]),
    signatures: []
);

// Specialized certificate with subset of capabilities
$specializedCert = new Certificate(
    key: $specializedKeyPair->toPublicKey(),
    description: 'Document-only Certificate',
    userDescriptors: [new UserDescriptor(DescriptorType::USERNAME, 'document-signer')],
    flags: CertificateFlagsCollection::fromList([
        CertificateFlag::END_ENTITY_FLAG_1,  // Only document signing
    ]),
    signatures: []
);
```

### Binary Serialization and Storage

```php
// Serialize certificates for storage
$certificateData = $certificate->toBinary();
file_put_contents('certificate.bin', $certificateData->value);

// Serialize entire chains
$chainData = $chain->toBinary();
file_put_contents('chain.bin', $chainData->value);

// Serialize trust stores
$trustStoreData = $trustStore->toBinary();
file_put_contents('truststore.bin', $trustStoreData->value);

// Load from storage
$loadedCert = Certificate::fromBinary(
    BinaryString::fromString(file_get_contents('certificate.bin'))
);

$loadedChain = Chain::fromBinary(
    BinaryString::fromString(file_get_contents('chain.bin'))
);

$loadedTrustStore = TrustStore::fromBinary(
    BinaryString::fromString(file_get_contents('truststore.bin'))
);
```

### Custom Validation Logic

```php
function validateCertificateForPurpose(Certificate $cert, string $purpose): bool {
    // Check if certificate has appropriate flags for the purpose
    $flags = $cert->flags;

    return match ($purpose) {
        'document-signing' => $flags->hasEndEntityFlag1(),
        'code-signing' => $flags->hasEndEntityFlag2(),
        'email-encryption' => $flags->hasEndEntityFlag3(),
        'server-auth' => $flags->hasEndEntityFlag4(),
        default => false
    };
}

// Use in your application
if (validateCertificateForPurpose($certificate, 'document-signing')) {
    // Proceed with document signing
    $signature = Signature::make($documentData, $privateKey);
}
```

### Message Signing and Verification

```php
use KDuma\BinaryTools\BinaryString;

// Sign a message
$message = BinaryString::fromString('Important document content');
$signature = Signature::make($message, $signerKeyPair);

// Create a signed message structure
$signedMessage = [
    'message' => base64_encode($message->value),
    'signature' => base64_encode($signature->toBinary()->value),
    'signer_keyid' => $signerCertificate->key->id->toString(),
    'certificate_chain' => base64_encode($certificateChain->toBinary()->value),
];

// Verification process
function verifySignedMessage(array $signedMessage, TrustStore $trustStore): bool {
    // Reconstruct components
    $message = BinaryString::fromString(base64_decode($signedMessage['message']));
    $signature = Signature::fromBinary(BinaryString::fromString(base64_decode($signedMessage['signature'])));
    $chain = Chain::fromBinary(BinaryString::fromString(base64_decode($signedMessage['certificate_chain'])));

    // Validate certificate chain
    $chainResult = Validator::validateChain($chain, $trustStore);
    if (!$chainResult->isValid) {
        return false;
    }

    // Find signer certificate
    $signerKeyId = KeyId::fromString($signedMessage['signer_keyid']);
    $signerCert = $chain->getById($signerKeyId);
    if (!$signerCert) {
        return false;
    }

    // Verify signature
    return $signature->validate($message, $signerCert->key);
}
```

## Security Model

### Trust Validation

The library implements a strict trust model:

1. **Root of Trust**: Only certificates in the TrustStore are trusted
2. **Chain of Trust**: Each certificate must be signed by the next certificate in the chain
3. **Unique Identity**: All certificates in a chain must have unique KeyIds
4. **Proper Authority**: Signers must have appropriate flags to sign certificates
5. **Flag Inheritance**: End-entity flags must be a subset of the signer's flags

### Flag Inheritance Validation

```
Root CA (FLAGS: 1,2,3,4)
    ↓ signs
Intermediate CA (FLAGS: 1,2,3) ← Valid: subset of root's flags
    ↓ signs
End Entity (FLAGS: 1,2) ← Valid: subset of intermediate's flags

End Entity (FLAGS: 1,5) ← INVALID: flag 5 not in intermediate's flags
```

### Unique KeyId Requirement

Every certificate in a chain must have a unique KeyId to prevent:
- Certificate confusion attacks
- Bypassing of validation rules
- Circular signing relationships

### Cryptographic Security

- **Ed25519**: Provides 128-bit security level
- **KeyId**: SHA-256 hash prevents collision attacks
- **Signatures**: Each signature is bound to specific certificate data
- **Self-Signing**: Root CAs must be self-signed to be valid

## Error Handling

### Validation Errors

The library provides detailed error messages for validation failures:

```php
$result = Validator::validateChain($chain, $trustStore);

foreach ($result->errors as $error) {
    echo "Error: " . $error->getMessage() . "\n";
    echo "Context: " . $error->getContext() . "\n";
    if ($error->getCertificate()) {
        echo "Certificate: " . $error->getCertificate()->description . "\n";
    }
}
```

### Common Error Types

1. **Structure Errors**:
   - Invalid binary format
   - Missing required fields
   - Invalid lengths

2. **Cryptographic Errors**:
   - Invalid signatures
   - KeyId mismatch with public key
   - Signature verification failure

3. **Authority Errors**:
   - Insufficient signing authority
   - Missing CA flags
   - Invalid flag combinations

4. **Inheritance Errors**:
   - End-entity flags not subset of signer
   - Duplicate KeyIds in chain
   - Invalid certificate hierarchy

5. **Trust Errors**:
   - Root CA not in trust store
   - Chain doesn't terminate in root CA
   - Self-signing validation failure

### Exception Handling

```php
try {
    $certificate = new Certificate($key, $desc, $descriptors, $flags, $signatures);
} catch (InvalidArgumentException $e) {
    echo "Certificate creation failed: " . $e->getMessage() . "\n";
}

try {
    $trustStore = new TrustStore([$invalidCert]);
} catch (InvalidArgumentException $e) {
    echo "Trust store validation failed: " . $e->getMessage() . "\n";
}

try {
    $chain = Chain::fromBinary($corruptedData);
} catch (Exception $e) {
    echo "Binary parsing failed: " . $e->getMessage() . "\n";
}
```

## Best Practices

### Security Best Practices

1. **Key Management**:
   ```php
   // Generate fresh keys for each certificate
   $keyPair = Ed25519::makeKeyPair();

   // Clear sensitive data when done
   sodium_memzero($keyPair->secretKey->value);
   ```

2. **Certificate Validation**:
   ```php
   // Always validate chains before trusting certificates
   $result = Validator::validateChain($chain, $trustStore);
   if (!$result->isValid) {
       throw new SecurityException('Untrusted certificate chain');
   }
   ```

3. **Flag Assignment**:
   ```php
   // Use principle of least privilege
   $flags = CertificateFlagsCollection::fromList([
       CertificateFlag::END_ENTITY_FLAG_1  // Only what's needed
   ]);
   ```

4. **Trust Store Management**:
   ```php
   // Keep trust stores minimal and up-to-date
   $trustStore = new TrustStore($onlyTrustedRootCAs);

   // Regularly audit trust store contents
   foreach ($trustStore->certificates as $cert) {
       if (isCertificateExpiredOrRevoked($cert)) {
           // Remove from trust store
       }
   }
   ```

### Performance Best Practices

1. **Efficient Validation**:
   ```php
   // Cache validation results for identical chains
   $cacheKey = hash('sha256', $chain->toBinary()->value);
   if (!isset($validationCache[$cacheKey])) {
       $validationCache[$cacheKey] = Validator::validateChain($chain, $trustStore);
   }
   ```

2. **Binary Serialization**:
   ```php
   // Use binary format for storage and transmission
   $binaryData = $certificate->toBinary();
   // Much more efficient than JSON or XML
   ```

3. **Batch Operations**:
   ```php
   // Process multiple certificates efficiently
   foreach ($certificates as $cert) {
       $results[] = Validator::validateChain(new Chain([$cert, ...$commonChain]), $trustStore);
   }
   ```

### Development Best Practices

1. **Error Handling**:
   ```php
   function createSecureCertificate(...): Certificate {
       try {
           return new Certificate(...);
       } catch (InvalidArgumentException $e) {
           logger->error('Certificate creation failed', ['error' => $e->getMessage()]);
           throw new CertificateCreationException('Failed to create certificate', 0, $e);
       }
   }
   ```

2. **Testing**:
   ```php
   // Test all certificate scenarios
   public function testInvalidFlagInheritance() {
       $this->expectException(ValidationException::class);
       // Test code that should fail validation
   }
   ```

3. **Documentation**:
   ```php
   /**
    * Creates a certificate for document signing
    *
    * @param PrivateKeyPair $keyPair Signing key pair
    * @param string $description Human-readable certificate description
    * @return Certificate Signed certificate with document signing capability
    */
   function createDocumentSigningCert(PrivateKeyPair $keyPair, string $description): Certificate {
       // Implementation
   }
   ```

## Binary Format

### Certificate Binary Structure

The library uses a custom binary format optimized for Ed25519:

```
Offset | Size | Field | Description
-------|------|-------|------------
0      | 3    | Magic | 0x084453 ("CERT" in base64)
3      | 1    | AlgVer| 0x01 for Ed25519
4      | 16   | KeyId | SHA-256(PubKey)[0..15]
20     | 32   | PubKey| Raw Ed25519 public key
52     | 1    | DescLen| Description length (0-255)
53     | N    | Desc  | UTF-8 description
53+N   | 1    | UserDescCount| Number of user descriptors
54+N   | ...  | UserDescs| User descriptor entries
...    | 2    | Flags | Certificate flags (big-endian)
...    | 1    | SigCount| Number of signatures
...    | ...  | Sigs  | Signature entries
```

### Chain Binary Structure

Chains are stored as concatenated certificates:

```
[Certificate 1][Certificate 2][Certificate 3]...
```

### Trust Store Binary Structure

```
Offset | Size | Field | Description
-------|------|-------|------------
0      | 6    | Magic | 0x4EBBAEB5E74A (TrustStore identifier)
6      | ...  | Certs | Concatenated certificates
```

### Working with Binary Data

```php
// Low-level binary operations
$cert = Certificate::fromBinary($binaryData);
$serialized = $cert->toBinary();

// Base64 encoding for text storage
$base64 = base64_encode($serialized->value);
$restored = Certificate::fromBinary(
    BinaryString::fromString(base64_decode($base64))
);

// Hexadecimal encoding
$hex = bin2hex($serialized->value);
$restored = Certificate::fromBinary(
    BinaryString::fromString(hex2bin($hex))
);
```

---

*This documentation covers PHP Certificate Chain of Trust library. For the latest updates, see the project repository.*

---------------------------------

# Simple Certificate Specification (Complete)

## Common rules
- **Container:** Standard Base64 (no line breaks).
- **Endianness:** All multi-byte integers are **big-endian**.
- **Strings:** UTF-8, no NUL terminator.
- **Counts:** Single byte counts.
- **TBS (to-be-signed) region:** From **Magic** through **Flags** (inclusive).

---

# Binary layout

## Shared header
| # | Field | Size | Notes |
|---|---|---:|---|
| 1 | **Magic** | 3 | Fixed `08 44 53` (`"CERT"` when Base64). |
| 2 | **AlgVer** | 1 | `0x01 = Ed25519 v1`. Others reserved. |

The following structure applies to `AlgVer = 0x01` (Ed25519 v1 — fixed sizes, no length fields).

| # | Field | Size | Notes |
|---|---|---:|---|
| 3 | **KeyId** | 16 | Must be `SHA-256(PubKey)[0..15]`. |
| 4 | **PubKey** | 32 | Raw Ed25519 public key. |
| 5 | **DescLen** | 1 | 0–255. Description is **required** (policy may enforce ≥1). |
| 6 | **Desc** | DescLen | UTF-8. |
| 7 | **UserDescCount** | 1 | N descriptors (0–255). |
| 8 | **For i in 1..N: Type** | 1 | See enum below. |
| 9 | **For i: ValLen** | 2 | UTF-8 value length (UINT16BE). |
| 10 | **For i: Value** | ValLen | UTF-8. |
| 11 | **Flags** | 2 | Permission bitmask (see table). **TBS ends here.** |
| 12 | **SigCount** | 1 | Number of signatures. May be `0`; such certificates must be rejected during validation. |
| 13 | **For j in 1..M: SignKeyId** | 16 | Signer’s KeyId (same 16-byte rule). **No length field.** |
| 14 | **For j: Signature** | 64 | Raw Ed25519 signature. **No length field.** |

## Descriptor Type (1 byte)
- `0x01` — Username
- `0x02` — Email
- `0x03` — Domain
> Descriptors are **optional**. Multiple entries (even of same type) allowed.

## Flags (2 bytes, bitmask)
- `0x0001` — **Root CA**
- `0x0002` — **Intermediate CA**
- `0x0004` — **CA**
- `0x0100` — **End Entity Flag 1**
- `0x0200` — **End Entity Flag 2**
- `0x0400` — **End Entity Flag 3**
- `0x0800` — **End Entity Flag 4**
- `0x1000` — **End Entity Flag 5**
- `0x2000` — **End Entity Flag 6**
- `0x4000` — **End Entity Flag 7**
- `0x8000` — **End Entity Flag 8**
- Other bits **reserved** (must be `0` on encode; ignore on decode).
- Implementations **must not** modify the `Flags` field when re‑emitting a certificate. Any reserved bits present in input data
  **must be preserved** exactly to avoid altering signed bytes.

---

## Flag semantics and policy

### Roles and combinations
- **Root CA (`0x0001`)**
  - **Must be self‑signed.**
  - May also carry `INTERMEDIATE_CA (0x0002)` and/or `CA (0x0004)`.
  - The ability to sign depends on the presence of `INTERMEDIATE_CA` and/or `CA` flags (see signing rules below), not on `ROOT_CA` alone.

- **Intermediate CA (`0x0002`)**
  - This flag **alone** grants authority to sign CA-level certificates.
  - When combined with `CA`, allows signing of both CA-level and non-CA certificates.

- **CA (`0x0004`)**
  - Required to sign non-CA certificates.
  - Without `INTERMEDIATE_CA`, may sign only non‑CA certificates (no `ROOT_CA`, `INTERMEDIATE_CA`, or `CA` flags on the subject).

- **Combined `INTERMEDIATE_CA | CA`**
  - Authorized to sign both CA‑level certificates (because of `INTERMEDIATE_CA`) and non‑CA certificates (because of `CA`).

- **No CA flags**
  - Cannot sign any certificates.

### End‑entity flags (non‑CA) inheritance
- End‑entity flags are the non‑CA bits (e.g., flags 0x0100 through 0x8000).
- A subject’s end‑entity flags must be a subset of its issuer’s end‑entity flags:
  - `Subject.EndEntityFlags ⊆ Issuer.EndEntityFlags`.

### Signing rules matrix
- To sign **non-CA** certificates, the issuer must have `CA`.
- To sign **CA-level** certificates (with `ROOT_CA`, `INTERMEDIATE_CA`, or `CA` flags), the issuer must have `INTERMEDIATE_CA`.

Quick reference:

| Issuer flags                | Sign non‑CA subject | Sign CA‑level subject |
|----------------------------:|:-------------------:|:---------------------:|
| None                        | ✗                   | ✗                     |
| CA                          | ✓                   | ✗                     |
| INTERMEDIATE_CA             | ✗                   | ✓                     |
| INTERMEDIATE_CA | CA        | ✓                   | ✓                     |

Notes:
- Presence of `ROOT_CA` does not by itself grant signing capability; it only asserts root identity and must be self‑signed. Combining `ROOT_CA` with the rows above does not change the ✓/✗ outcomes.
- A root certificate with only `CA` cannot sign CA‑level certificates; it must also include `INTERMEDIATE_CA` to do so.
- End‑entity flags must obey subset inheritance: `Subject.EndEntity ⊆ Issuer.EndEntity`.

### End‑Entity Inheritance Matrix
Only illustrates the subset rule for end‑entity flags. CA‑level signing capability (issuer must have `CA` for non‑CA subjects, `INTERMEDIATE_CA` for CA‑level subjects) still applies separately.

Legend: Flag1 = `0x0100`, Flag2 = `0x0200`, etc.

| Issuer end‑entity flags | Subject: None | Subject: Flag1 | Subject: Flag2 | Subject: Flag1+Flag2 |
|------------------------:|:-------------:|:--------------:|:--------------:|:--------------------:|
| None                    | ✓             | ✗              | ✗              | ✗                    |
| Flag1                   | ✓             | ✓              | ✗              | ✗                    |
| Flag2                   | ✓             | ✗              | ✓              | ✗                    |
| Flag1+Flag2             | ✓             | ✓              | ✓              | ✓                    |

Reminder: This matrix validates only the end‑entity subset requirement. The issuer must still have the appropriate CA‑level flag to sign the subject at all (see the Signing rules matrix above).

Notes
- A certificate with `ROOT_CA` must be self‑signed, but it may also carry `INTERMEDIATE_CA` or `CA` (or both).
- The presence of CA‑level flags does not prevent a certificate from also carrying end‑entity flags; those end‑entity bits govern what end‑entity flags it may delegate to subjects, not necessarily whether it acts as an end‑entity itself.
- **Certificate uniqueness**: Each certificate in a chain must have a unique `KeyId`. Self‑signed `ROOT_CA` certificates can only appear as the final (root) certificate in a chain, never in the middle.
- **End‑entity inheritance**: The subset rule (`Child.EndEntity ⊆ Issuer.EndEntity`) applies to all certificate pairs in a chain without exception, including self‑signed certificates.

---

## Chain validation algorithm

1. Verify structure and lengths.
2. Ensure each certificate has at least one signature.
3. Compute `KeyId` as `SHA-256(PubKey)[0..15]` and verify it matches the embedded value.
4. Verify that all certificates in the chain have unique `KeyId` values. No two certificates in the same chain may share the same `KeyId`.
5. Build a path from leaf to a trusted root by matching `SignKeyId` to parent `KeyId`.
6. For each child/parent pair (issuer = parent):
    - For non-CA children: Issuer must have `CA`.
    - For CA-level children (has any of `ROOT_CA`, `INTERMEDIATE_CA`, `CA`): issuer must have `INTERMEDIATE_CA`.
    - End‑entity inheritance: For each end‑entity bit (0x0100 through 0x8000), if child has it, issuer must also have it (`Child.EndEntity ⊆ Issuer.EndEntity`). This validation applies to **all** certificate pairs without exception.
7. A certificate with `ROOT_CA` must be self‑signed and present in the trust store.

---

## Ed25519 details (AlgVer = 0x01)
- **Public key:** 32 raw bytes (RFC 8032).
- **Signature:** 64 raw bytes (RFC 8032).
- **KeyId:** first 16 bytes of SHA-256 over the 32-byte public key.
- **Signature input:** exactly the TBS bytes (no pre-hash).

---

## Chain packaging (concatenation format)

To allow distributing an entire trust path as **one Base64 string**, a certificate may be followed **immediately** by another full certificate structure (starting again at **Magic**). You can therefore concatenate the whole trust tree (leaf → … → root) into one binary blob and **Base64‑encode the entire concatenation as a single string** (no separators).

### Encoding rules
- Each element is a complete **Certificate** as specified for the chosen `AlgVer`.
- Concatenate certificates **in order from leaf to root**. The final element SHOULD be a **Root CA** (`0x0001`) and MUST be self‑signed.
- After concatenation, **Base64‑encode the entire byte sequence** (standard Base64, no line breaks).
- This container is purely a packaging convenience; cryptographic validity is still per‑certificate.

### Parsing rules
- Decode Base64 once to obtain the binary blob.
- Starting at offset 0, parse a **Certificate**. Its **length** is determinable from its internal fields (notably `DescLen`, `UserDescCount` block, and `SigCount`).
- After finishing one certificate, **if there are remaining bytes**, the next byte MUST be `Magic` (`08 44 53`), and parsing continues for the next certificate.
- Continue until the end of the byte array. Reject if trailing bytes remain that do not begin with `Magic` or if any certificate is malformed.

### Validation
- Build chains using the **SignKeyId → KeyId** linkage between adjacent certificates. When a concatenated parent is present, it **must** match the `SignKeyId` of the child and validate per signature and policy rules.
- If a required issuer is **not** present in the concatenation, the validator MAY resolve it from a local trust store; however, when present, the concatenated parent MUST be used and must validate.
- All existing **policy rules** apply (self‑signed roots for `0x0001`, `CA` requirement to issue, subset‑of‑flags, end‑entity authorization, etc.).

### ABNF update
```
CertificateChain = 1*Certificate        ; one or more Certificates back-to-back
; Each Certificate is defined as previously for AlgVer = 0x01
; The entire CertificateChain is Base64-encoded when transported as text.
```

---

## TrustStore binary format

A TrustStore is a container for trusted root CA certificates used during chain validation. It has its own binary serialization format for storage and transport.

### Binary layout

| # | Field | Size | Notes |
|---|---|---:|---|
| 1 | **Magic** | 6 | Fixed `4e bb ac b5 e7 4a` (TrustStore identifier). |
| 2 | **Certificates** | Variable | Zero or more complete Certificate structures concatenated back-to-back. |

### Parsing rules

- Decode the magic bytes to identify this as a TrustStore.
- Parse certificates sequentially using the standard Certificate parsing rules until end of data.
- Each certificate's length is determined from its internal structure (no explicit count or length fields).

### Validation rules

- **Only root CA certificates**: All certificates in a TrustStore must have the `ROOT_CA` flag and be self-signed.
- **Unique KeyIds**: All certificates must have unique KeyIds within the TrustStore.
- **Self-signing validation**: Each certificate's self-signature must be cryptographically valid.

### Encoding rules

- The entire TrustStore binary structure is **Base64-encoded** for text transport.
- Each Certificate follows the standard certificate binary format defined above.
- Certificates are stored in the order they were added to the TrustStore.

### Usage

TrustStores are used by the validator to determine which root certificates are trusted during chain validation. A certificate chain is only considered valid if it terminates in a root CA certificate present in the provided TrustStore.

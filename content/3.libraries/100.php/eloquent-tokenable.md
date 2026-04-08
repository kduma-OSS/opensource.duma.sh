---
title: Eloquent Tokenable
description: Allows using tokens (HashIDs) instead of id in Laravel Eloquent models.
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-eloquent-tokenable
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-eloquent-tokenable" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-eloquent-tokenable/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/eloquent-tokenable" target="_blank"}
::

## Requirements

- PHP `^8.3`
- Laravel `^13.0`

## Installation

```bash
composer require kduma/eloquent-tokenable
```

## Setup

Add the `Tokenable` trait to your model:

```php
use KDuma\Eloquent\Tokenable;

class Order extends Model
{
    use Tokenable;
}
```

## Configuration

### New style — PHP Attribute (recommended)

```php
use KDuma\Eloquent\Tokenable;
use KDuma\Eloquent\Attributes\HasToken;

#[HasToken(length: 12, alphabet: 'abcdef1234567890')]
class Order extends Model
{
    use Tokenable;
}
```

`HasToken` parameters: `length` (default: `10`), `alphabet` (default: alphanumeric), `salt` (default: table name).

### Old style — model properties (deprecated)

```php
class Order extends Model
{
    use Tokenable;

    protected ?string $salt = 'SALT';       // ⚠️ deprecated
    protected int $length = 10;             // ⚠️ deprecated
    protected string $alphabet = 'abc...';  // ⚠️ deprecated
}
```

## Usage

- `$model->token` — returns the HashID token
- `Model::whereToken($token)` — query scope to find by token

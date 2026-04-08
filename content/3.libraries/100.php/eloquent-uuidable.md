---
title: Eloquent UUID-able
description: Eases using and generating guid's in Laravel Eloquent models.
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-eloquent-uuidable
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-eloquent-uuidable" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-eloquent-uuidable/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/eloquent-uuidable" target="_blank"}
::

## Requirements

- PHP `^8.3`
- Laravel `^13.0`

## Installation

```bash
composer require kduma/eloquent-uuidable
```

## Setup

Add the `Uuidable` trait to your model and create a `uuid` column in your migration:

```php
use KDuma\Eloquent\Uuidable;

class User extends Model
{
    use Uuidable;
}
```

```php
$table->uuid('uuid')->unique();
```

## Configuration

### New style — PHP Attribute (recommended)

```php
use KDuma\Eloquent\Uuidable;
use KDuma\Eloquent\Attributes\HasUuid;

#[HasUuid(field: 'public_uuid', checkDuplicates: true)]
class User extends Model
{
    use Uuidable;
}
```

`HasUuid` parameters: `field` (default: `'uuid'`), `checkDuplicates` (default: `false`).

### Old style — model properties (deprecated)

```php
class User extends Model
{
    use Uuidable;

    protected string $uuid_field = 'public_uuid';         // ⚠️ deprecated
    protected bool $check_for_uuid_duplicates = true;      // ⚠️ deprecated
}
```

## Usage

- UUID is auto-generated on `create` and `update` if field is `null`
- `$model->regenerateUuid()` — manually regenerate (save afterwards)
- `Model::whereUuid($uuid)` — query scope
- `Model::byUuid($uuid)` — retrieve model by UUID
- `$model->getUuidField()` — returns configured column name

> **Note:** This package adds UUID as an *additional column* alongside the numeric `id`, unlike Laravel's built-in `HasUuids` which replaces the primary key.

## Upgrade from `kduma/eloquent-guidable` (1.x / 2.x)

Use `#[HasUuid(field: 'guid')]` to keep the old column name.
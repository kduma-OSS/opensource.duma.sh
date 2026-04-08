---
title: Eloquent ULID-able
description: Eases using and generating ulid's in Laravel Eloquent models.
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-eloquent-ulidable
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-eloquent-ulidable" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-eloquent-ulidable/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/eloquent-ulidable" target="_blank"}
::

## Requirements

- PHP `^8.3`
- Laravel `^13.0`

## Installation

```bash
composer require kduma/eloquent-ulidable
```

## Setup

Add the `Ulidable` trait to your model and create a `ulid` column in your migration:

```php
use KDuma\Eloquent\Ulidable;

class Post extends Model
{
    use Ulidable;
}
```

```php
$table->ulid()->unique();
```

## Configuration

### New style — PHP Attribute (recommended)

```php
use KDuma\Eloquent\Ulidable;
use KDuma\Eloquent\Attributes\HasUlid;

#[HasUlid(field: 'public_id', checkDuplicates: true)]
class Post extends Model
{
    use Ulidable;
}
```

`HasUlid` parameters: `field` (default: `'ulid'`), `checkDuplicates` (default: `false`).

### Old style — model properties (deprecated)

```php
class Post extends Model
{
    use Ulidable;

    protected string $ulid_field = 'public_id';         // ⚠️ deprecated
    protected bool $check_for_ulid_duplicates = true;    // ⚠️ deprecated
}
```

## Usage

- ULID is auto-generated on `create` and `update` if field is `null`
- `$model->regenerateUlid()` — manually regenerate (save afterwards)
- `Model::whereUlid($ulid)` — query scope
- `Model::byUlid($ulid)` — retrieve model by ULID
- `$model->getUlidField()` — returns configured column name

> **Note:** This package adds ULID as an *additional column* alongside the numeric `id`, unlike Laravel's built-in `HasUlids` which replaces the primary key.

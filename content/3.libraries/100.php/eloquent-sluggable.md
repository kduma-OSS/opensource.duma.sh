---
title: Eloquent Sluggable
description: Eases using and generating slugs Laravel Eloquent models.
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-eloquent-sluggable
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-eloquent-sluggable" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-eloquent-sluggable/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/eloquent-sluggable" target="_blank"}
::

## Requirements

- PHP `^8.3`
- Laravel `^13.0`

## Installation

```bash
composer require kduma/eloquent-sluggable
```

## Setup

Add the `Sluggable` trait to your model and create a `slug` column in your migration:

```php
use KDuma\Eloquent\Sluggable;

class Post extends Model
{
    use Sluggable;
}
```

```php
$table->string('slug')->unique();
```

## Configuration

### New style — PHP Attribute (recommended)

```php
use KDuma\Eloquent\Sluggable;
use KDuma\Eloquent\Attributes\HasSlug;

#[HasSlug(from: 'name', field: 'slug')]
class Product extends Model
{
    use Sluggable;
}
```

### Old style — model properties (deprecated)

```php
class Post extends Model
{
    use Sluggable;

    protected string $sluggable_from = 'name';  // ⚠️ deprecated
    protected string $slug_field = 'slug';       // ⚠️ deprecated
}
```

### Default behaviour

Without any configuration, reads from `title` and stores in `slug`.

## Usage

- Slug is auto-generated on `create` and regenerated on `update` if empty
- `$model->generateSlug()` — manually regenerate (save afterwards)
- `Model::whereSlug($slug)` — query scope
- `$model->getSlugField()` — returns configured slug field name

Override `SluggableString()` for a custom slug source:

```php
protected function SluggableString(): string
{
    return $this->year . ' ' . $this->title;
}
```
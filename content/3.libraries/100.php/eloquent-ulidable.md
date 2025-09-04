  ---
title: Eloquent ULID-able
description: Eases using and generating ulid's in Laravel Eloquent models.
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-eloquent-ulidable
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-eloquent-ulidable" blank}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-eloquent-ulidable/releases/latest/" blank}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/eloquent-ulidable" blank}
::

## Setup
Install it using composer

```bash
composer require kduma/eloquent-ulidable
```

## Prepare models
Inside your model (not on top of file) add following lines:

```php
use \KDuma\Eloquent\Ulidable;
```

In database create `ulid` string field. If you use migrations, you can use following snippet:

```php
$table->ulid()->unique();
```

## Usage
By default it generates slug on first save.

- `$model->regenerateUlid()`{lang="php"} - Generate new uuid. (Remember to save it by yourself)
- `Model::whereUlid($ulid)->first()`{lang="php"} - Find by ulid. (`whereUlid` is query scope)

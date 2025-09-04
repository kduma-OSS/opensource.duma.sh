---
title: Eloquent UUID-able
description: Eases using and generating guid's in Laravel Eloquent models.
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-eloquent-uuidable
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-eloquent-uuidable" blank}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-eloquent-uuidable/releases/latest/" blank}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/eloquent-uuidable" blank}
::

# Setup
Install it using composer

    composer require kduma/eloquent-uuidable

# Prepare models
Inside your model (not on top of file) add following lines:

    use \KDuma\Eloquent\Uuidable;

In database create `uuid` string field. If you use migrations, you can use following snippet:

    $table->uuid('uuid')->unique();

# Usage
By default it generates slug on first save.

- `$model->regenerateUuid()` - Generate new uuid. (Remember to save it by yourself)
- `Model::whereUuid($uuid)->first()` - Find by guid. (`whereUuid` is query scope)

# Upgrade from 1.x/2.x version of `kduma/eloquent-guidable`

Add following line to yours models to switch from using `uuid` column name to `guid` as it was used in previous versions:

	protected $uuid_field = 'guid';
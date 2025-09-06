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

## Setup
Install it using composer

    composer require kduma/eloquent-ulidable

## Prepare models
Inside your model (not on top of file) add following lines:

    use \KDuma\Eloquent\Ulidable;

In database create `ulid` string field. If you use migrations, you can use following snippet:

    $table->ulid()->unique();

## Usage
By default, it generates slug on first save.

- `$model->regenerateUlid()` - Generate new ulid. (Remember to save it by yourself)
- `Model::whereUlid($ulid)->first()` - Find by ulid. (`whereUlid` is query scope)

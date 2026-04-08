---
title: Eloquent Encryptable
description: Eases using and generating slugs Laravel Eloquent models.
type: library
platform: Laravel
active: false
github: https://github.com/kduma-OSS/LV-eloquent-encryptable
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-eloquent-encryptable" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-eloquent-encryptable/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/eloquent-encryptable" target="_blank"}
::

::warning
**Package EOL:** This package is no longer maintained. Since Laravel 8, the framework includes built-in [encrypted casts](https://laravel.com/docs/eloquent-mutators#encrypted-casting) which provide the same functionality natively. Please migrate to native encrypted casts:
```php
protected $casts = [
    'secret_field' => 'encrypted',
    'secret_array' => 'encrypted:array',
];
```
::

## Setup
Add the package to the require section of your composer.json and run `composer update`

    "kduma/eloquent-encryptable": "^1.1"

## Prepare models
In your model add following lines:

    use \KDuma\Eloquent\Encryptable;
    protected $encrypted=['list', 'of', 'fields', 'you', 'wan\'t', 'to', 'encrypt'];

## Usage

It will be automatically encrypting and decrypting fields defined in `$encrypted` property of your model.

Those fields must be `string` or `text` for longer values.

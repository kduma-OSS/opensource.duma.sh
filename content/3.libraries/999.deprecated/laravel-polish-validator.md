---
title: Polish Validator Rules for Laravel
description: Polish Validation rules for Laravel Validator
type: library
platform: Laravel
active: false
github: https://github.com/kduma-OSS/LV-polish-validator-rules
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-polish-validator-rules" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-polish-validator-rules/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/polish-validator" target="_blank"}
::

::warning
**Package EOL:** This package is no longer maintained. It was built for Laravel 5.x using the legacy `Validator::extend()` API, which has been superseded by the [`ValidationRule`](https://laravel.com/docs/validation#custom-validation-rules) interface. The package is incompatible with Laravel 11+ and requires PHP 5.4+, while modern Laravel requires PHP 8.3+. The PESEL and identity card validation logic can be easily extracted into standalone rule classes implementing `ValidationRule`.
::

## Setup

You can install the package via composer:

    composer require kduma/polish-validator

If you are using Laravel 5.5, the service provider will automatically be discovered.

On earlier versions, you need to do that manually. You must add the Service Provider to the providers array in `config/app.php`:

    KDuma\Validator\PolishValidatorRulesServiceProvider::class,


## Usage
You have 2 new Validator rules:

- `pesel` or `\KDuma\Validator\PeselNumberRule()` - Checks if number is valid PESEL number
- `identity_card` or `\KDuma\Validator\PolishIdentityCardNumberRule()` - Checks if number is polish identity document number

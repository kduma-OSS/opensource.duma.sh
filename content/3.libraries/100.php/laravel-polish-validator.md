---
title: Polish Validator Rules for Laravel
description: Polish Validation rules for Laravel Validator
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-polish-validator-rules
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-polish-validator-rules" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-polish-validator-rules/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/polish-validator" target="_blank"}
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
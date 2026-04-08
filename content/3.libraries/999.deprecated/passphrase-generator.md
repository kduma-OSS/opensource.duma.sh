---
title: Diceware Generator
description: Diceware pass phrase generator
type: library
platform: PHP & Laravel
active: false
github: https://github.com/kduma-OSS/LV-passphrase-generator
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-passphrase-generator" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-passphrase-generator/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/passphrase-generator" target="_blank"}
::

::warning
**Package EOL:** This package is no longer maintained. The underlying dependency `genphrase/genphrase` is no longer actively developed, and the package has not been updated to support modern Laravel versions. For passphrase generation, consider using dedicated libraries such as [hackzilla/password-generator](https://github.com/hackzilla/password-generator) or implementing a simple diceware generator directly in your application using PHP 8.3+ and `random_int()`.
::

## Install

Via Composer

``` bash
$ composer require kduma/passphrase-generator
```

## Usage

``` php
Passphrase::get();
// returns: Molecule-Unclamped-think-alphabet

Passphrase::setSeparators("!@#")
    ->setEntropy(30)
    ->useEnglishWordList()
    ->dontUseModifiers()
    ->get();
// returns: Chrome#Quite@Tribe
```

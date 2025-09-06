---
title: Diceware Generator
description: Diceware pass phrase generator
type: library
platform: PHP & Laravel
active: true
github: https://github.com/kduma-OSS/LV-passphrase-generator
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-passphrase-generator" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-passphrase-generator/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/passphrase-generator" target="_blank"}
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
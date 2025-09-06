---
navigation:
    title: File Hasher.PHP
title: File Hasher (PHP)
description: MD5 and SHA1 file hash calculator and checker library
type: library
platform: PHP
active: true
github: https://github.com/kduma-OSS/PHP-file-hasher
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/PHP-file-hasher" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/PHP-file-hasher/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/file-hasher" target="_blank"}
::

## Install

Via Composer

``` bash
$ composer require kduma/file-hasher
```

## Usage

``` php
use KDuma\FileHasher\Checker;
use KDuma\FileHasher\Hasher;

var_dump(Hasher::file('test.php'));
var_dump(Checker::file('test.php.ph'));
```
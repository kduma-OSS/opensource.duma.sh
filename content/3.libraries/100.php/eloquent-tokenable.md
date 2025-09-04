---
title: Eloquent Tokenable
description: Allows using tokens (HashIDs) instead of id in Laravel Eloquent models.
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-eloquent-tokenable
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-eloquent-tokenable" blank}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-eloquent-tokenable/releases/latest/" blank}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/eloquent-tokenable" blank}
::

## Setup
Add the package to the require section of your composer.json and run `composer update`

```json
"kduma/eloquent-tokenable": "^1.1"
```

## Prepare models
In your model add following lines:

```php
use \KDuma\Eloquent\Tokenable;
protected $appends = array('token');
```

Optionally you can add also:

- `protected $salt = 'SALT';`{lang="php"}  
  A salt for making hashes. Default is table name. This salt is added to your `APP_KEY`.

- `protected $length = 10;`{lang="php"}  
  A salt length. Default is 10.

- `protected $alphabet = 'qwertyuiopasdfghjklzxcvbnm1234567890';`{lang="php"}  
  A hash alphabet. Default is `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`

## Usage
- `$model->token`{lang="php"} - Generate tokens
- `Model::whereToken($id)->first()`{lang="php"} - Find by token. (`whereToken` is query scope)

---
title: CoinHive API and Captcha
description: PHP and Laravel 5 CoinHive API and Captcha
type: library
platform: PHP & Laravel
active: false
github: https://github.com/kduma-OSS/LV-CoinHive-api
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-CoinHive-api" blank}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-CoinHive-api/releases/latest/" blank}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/coinhive-api" blank}
::

**Package EOL:**
This package is archived because of [discontinuation of CoinHive](https://web.archive.org/web/20190228020155/https://coinhive.com/blog/en/discontinuation-of-coinhive).


## Install

Via Composer

```bash
composer require kduma/coinhive-api
```

## Usage

```php
$api = new \KDuma\CoinHive\CoinHiveApi(YOUR_SITE_KEY, YOUR_SECRET_KEY);

$api->getPayoutStats();
$api->getSiteStats();
$api->withdrawFromUser($name, $amount);
$api->getUserBalance($name);
$api->getTopUsers($count = 128);
$api->getUsersList($page = null, $count = 4096);
$api->createLink($url, $hashes = 256);
$api->resetUser($name);
$api->resetAllUsers();
$api->verifyToken($token, $hashes = 256);
```

## Laravel Usage

### Setup

In Laravel 5.5, service provider is automatically discovered. If you don't use package discovery,
add the Service Provider to the providers array in `config/app.php`:

```php
KDuma\CoinHive\Laravel\CoinHiveServiceProvider::class,
```

Add following entries to your `.env` file:

	COINHIVE_SITE_KEY=<your site key>
	COINHIVE_SECRET_KEY=<your secret key>
	COINHIVE_DEFAULT_HASHES_COUNT=512

Add following entries to your `config\services.php` file:

```php
    'coinhive' => [
        'default_hashes' => env('COINHIVE_DEFAULT_HASHES_COUNT', 512),
        'site_key' => env('COINHIVE_SITE_KEY'),
        'secret_key' => env('COINHIVE_SECRET_KEY'),
        'use_authedmine_url' => true,
    ],
```

### Usage
You can resolve `CoinHiveApi::class` class:
``` php
use KDuma\CoinHive\CoinHiveApi;

$api = app(CoinHiveApi::class);

$top_users = $api->getTopUsers();
```
or You can use injection container
``` php
use KDuma\CoinHive\CoinHiveApi;

Route::get('/api', function (CoinHiveApi $api) {
    $top_users = $api->getTopUsers();
});
```

### Using [CoinHive Proof of Work Captcha](https://coinhive.com/documentation/captcha) with Laravel

In your form, place Captcha field using `CoinHiveCaptchaDisplayer` class:

```blade
{!! resolve(\KDuma\CoinHive\CoinHiveCaptchaDisplayer::class)->display() !!}
```

You can also specify more options like `required_hashes`, `autostart`, `whitelabel` or `disable-elements`
like the following example:

```blade
{!! resolve(\KDuma\CoinHive\CoinHiveCaptchaDisplayer::class)->display(256, [
    'data-autostart' => false,
    'data-whitelabel' => false,
    'data-disable-elements' => "#submit",
]) !!}
```

To check if the Captcha is valid you can use `ValidateCoinHiveCaptchaToken` validator:

```php
Route::post('/post', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'coinhive-captcha-token' => new \KDuma\CoinHive\Laravel\ValidateCoinHiveCaptchaToken()
    ]);
});
``` 

If you need custom `required_hashes` number, you can pass it in the constructor.
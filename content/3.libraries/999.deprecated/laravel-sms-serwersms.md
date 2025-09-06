---
title: Laravel SMS Notification Channel - SerwerSMS.pl Driver
description: An SerwerSMS.pl driver for kduma/sms package
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-SMS-Driver-SerwerSMS
active: false
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-SMS-Driver-SerwerSMS" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-SMS-Driver-SerwerSMS/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/sms-driver-serwersms" target="_blank"}
::

## Install

Via Composer

```bash
$ composer require kduma/sms-driver-serwersms
```

In Laravel 5.6, service provider is automatically discovered. If you don't use package discovery,
add the Service Provider to the providers array in `config/app.php`:

    KDuma\SMS\Drivers\SerwerSMS\SerwerSMSServiceProvider::class,

Create new channel or reconfigure existing in `sms.php` config file:

```php
'serwersms' => [
    'driver'   => 'serwersms',
    'login'    => env('SMS_SERWERSMS_LOGIN'),
    'password' => env('SMS_SERWERSMS_PASSWORD'),
    'sender'   => 'INFORMACJA',
    'eco'      => true,
    'flash'    => false,
],
```

## Available Options

| Option   | Default | Description                                 |
|----------|---------|---------------------------------------------|
| login    | `null`  | Login to serwersms.pl panel                 |
| password | `null`  | Password to serwersms.pl panel              |
| sender   | `null`  | Sender name                                 |
| eco      | `true`  | Send eco message                            |
| flash    | `false` | Send flash message                          |
| test     | `false` | If test is turned on, messages aren't sent. |
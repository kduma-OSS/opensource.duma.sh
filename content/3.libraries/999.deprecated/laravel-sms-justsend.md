---
title: Laravel SMS Notification Channel - JustSend.pl Driver
description: An JustSend.pl driver for kduma/sms package
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-SMS-Driver-JustSend
active: false
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-SMS-Driver-JustSend" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-SMS-Driver-JustSend/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/sms-driver-justsend" target="_blank"}
::

## Install

Via Composer

```bash
$ composer require kduma/sms-driver-justsend
```

In Laravel 5.6, service provider is automatically discovered. If you don't use package discovery,
add the Service Provider to the providers array in `config/app.php`:

    KDuma\SMS\Drivers\JustSend\JustSendServiceProvider::class,

Create new channel or reconfigure existing in `sms.php` config file:

```php
'justsend' => [
    'driver' => 'justsend',
    'key'    => env('SMS_JUSTSEND_KEY'),
    'sender' => 'INFORMACJA',
    'eco'    => true,
],
```

## Available Options

| Option   | Default | Description                                 |
|----------|---------|---------------------------------------------|
| key      | `null`  | Api Key for justsend.pl                     |
| sender   | `null`  | Sender name                                 |
| eco      | `true`  | Send eco message                            |
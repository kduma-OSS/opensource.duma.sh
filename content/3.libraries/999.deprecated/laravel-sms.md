---
title: Laravel SMS Notification Channel
description: An SMS sender for Laravel with Notification Channel
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-SMS
active: false
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-SMS" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-SMS/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/sms" target="_blank"}
::

## Install

Via Composer

```bash
$ composer require kduma/sms
```

In Laravel 5.6, service provider is automatically discovered. If you don't use package discovery,
add the Service Provider to the providers array in `config/app.php`:

    KDuma\SMS\SMSServiceProvider::class,

And following facade to facades array:

    'SMS' => KDuma\SMS\Facades\SMS::class,

Publish `sms.php` config file using following command:

    php artisan vendor:publish --provider="KDuma\SMS\SMSServiceProvider"

Now You can install and configure SMS channels and drivers. Configuration options are available in drivers readme's.

## Available Drivers

- SerwerSMS.pl - [kduma/sms-driver-serwersms](https://github.com/kduma-OSS/L5-SMS-Driver-SerwerSMS)
- JustSend.pl - [kduma/sms-driver-justsend](https://github.com/kduma-OSS/L5-SMS-Driver-JustSend)

## Usage
``` php
SMS::send('phone number', 'Message.');
SMS::balance();
SMS::driver('serwersms')->send('phone number', 'Message.');
```

## Laravel 5.3 Notifications Channel Usage

Follow Laravel's documentation to add the channel your Notification class, for example:

```php
use Illuminate\Notifications\Notification;
use KDuma\SMS\NotificationChannel\SMSChannel;
use KDuma\SMS\NotificationChannel\SMSMessage;

class NotificationSMSChannelTestNotification extends Notification
{
    public function via($notifiable)
    {
        return [SMSChannel::class];
    }
    
    public function toSMS($notifiable)
    {
        return SMSMessage::create('This is a test SMS sent via Simple SMS using Laravel Notifications!');
    }
}
```  

Also you need to add a `routeNotificationForSMS` method to your Notifiable model to return the phone number, for example:

```php
public function routeNotificationForSMS()
{
    return $this->phone_number;
}
```    

### `SMSMessage` Available methods

* `content()` - SMS content
* `channel()` - Set the configured SMS channel
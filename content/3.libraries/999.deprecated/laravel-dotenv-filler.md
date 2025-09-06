---
title: Laravel .env filler
description: Laravel command to create/fill missing fields in .env file based on rules in .env.example file.
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-dotenv-filler
active: false
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-dotenv-filler" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-dotenv-filler/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/dotenv-filler" target="_blank"}
::

## Setup
Add the package to the require section of your composer.json and run `composer update`

    "kduma/dotenv-filler": "^1.1"

Then add the Service Provider to the providers array in `config/app.php`:

    KDuma\DotEnvFiller\DotEnvFillerServiceProvider::class,

# Usage

Command syntax is as following:

    config:env [-o|--overwrite] [-d|--defaults]

- `--overwrite (-o)` - Don't skip keys that exists in `.env`. (will ask if you want to overwrite or not)
- `--defaults (-d)` - Ask for defaults. (if you don't use this option command will assume that you want defaults options)



# Rules in `.env.example`

- `APP_KEY=VALUE` - it will be written as is.
- `DB_HOST=(TEXT)` - it will prompt for input (plaintext).
- `DB_PASSWORD=(PASSWORD)` - it will prompt for input (secret).
- `APP_ENV=(local|production)` - it will allow to select `local` or `production`.
- `APP_DEBUG=(true|false){APP_ENV=local:true|APP_ENV=production:false}` - it will allow to select `true` or `false` but before, it will sugests an default based on rules.


# Sample `.env.example`

    APP_ENV=(local|production)
    APP_DEBUG=(true|false){APP_ENV=local:true|APP_ENV=production:false}
    APP_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    
    DB_HOST=(TEXT){APP_ENV=local:localhost}
    DB_DATABASE=(TEXT){APP_ENV=local:homestead}
    DB_USERNAME=(TEXT){APP_ENV=local:homestead}
    DB_PASSWORD=(PASSWORD){APP_ENV=local:secret}
    
    CACHE_DRIVER=(file|database|array){APP_ENV=local:file|APP_ENV=production:file}
    SESSION_DRIVER=(file|database|cookie|array){APP_ENV=local:database|APP_ENV=production:database}
    QUEUE_DRIVER=(sync|database|beanstalkd){APP_ENV=local:database|APP_ENV=production:database}
    
    
    SMTP_HOST=(TEXT){APP_ENV=local:mailtrap.io}
    SMTP_PORT=(TEXT){SMTP_HOST=mailtrap.io:2525}
    SMTP_USERNAME=(TEXT)
    SMTP_PASSWORD=(PASSWORD)
    
    NOCAPTCHA_SECRET=(TEXT)
    NOCAPTCHA_SITEKEY=(TEXT)
    
	WEBCRON_SECRET=(TEXT|null)
	WEBCRON_TIMELIMIT=(TEXT|30|60|null){APP_ENV=local:30|APP_ENV=production:60}
	WEBCRON_RUNLIMIT=(TEXT|30|60|null){APP_ENV=local:null|APP_ENV=production:null}

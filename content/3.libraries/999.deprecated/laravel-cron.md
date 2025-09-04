---
title: Laravel Web Cron
description: Laravel 5.1 queue runner for webcron (with runtime limit)
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-cron
active: false
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-cron" blank}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-cron/releases/latest/" blank}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/cron" blank}
::


## Setup
Add the package to the require section of your composer.json and run `composer update`

    "kduma/cron": "^1.1"

Then add the Service Provider to the providers array in `config/app.php` but not before `Illuminate\Queue\QueueServiceProvider`:

    KDuma\Cron\CronServiceProvider::class,
    KDuma\Cron\WebCronServiceProvider::class,


# Usage

Command syntax is like `queue:work --daemon` with 2 new options:

    artisan queue:cron [-t|--timelimit[="..."]] [-r|--runlimit[="..."]] [--queue[="..."]] [--delay[="..."]] [--force] [--sleep[="..."]] [--tries[="..."]] [connection]

- `--timelimit (-t)` - Maximum time this command can work in seconds. (default: 60)
- `--runlimit (-r)` - Maximum queue jobs to run in. (default: no limit)


# Best practices

- Split your jobs into small tasks that takes small amount of time
- When you choice time limit, subtract time of longest job


# Web Cron

In your `.env` file add:

    WEBCRON_SECRET=YOUR_SECRET

Replace `YOUR_SECRET` with your secret. Now you can run queue by visiting `http://<domain>/cron/YOUR_SECRET` url.

You can also configure time limit and/or run limit using following entries in `.env`:

    WEBCRON_TIMELIMIT=30
    WEBCRON_RUNLIMIT=25
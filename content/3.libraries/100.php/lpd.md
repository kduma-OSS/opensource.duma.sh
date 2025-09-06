---
title: LPD Client and Server
description: A LPD Client and Server written in PHP
type: library
platform: PHP & Laravel
active: true
github: https://github.com/kduma-OSS/PHP-LPD
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/PHP-LPD" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/PHP-LPD/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/lpd" target="_blank"}
::

## Install

Via Composer

```bash
$ composer require kduma/lpd
```

## Usage

### Server
``` php
(new KDuma\LPD\Server\Server())
	->setAddress($address)
	->setPort($port)
	->setMaxConnections($max_connections)
	->setHandler(function ($incoming_data, $ctrl) {
		echo $incoming_data; // Do something with it!
	})
	->run();
```

### Client

#### Text print job

For printing clear text use `TextJob` class:
``` php
$job = new KDuma\LPD\Client\Jobs\TextJob("This is content!");
$job->appdendContent("\n");
$job->appdendContent("And this is second line.");
```

#### File print job

For printing files, text or binary, use `FileJob` class:
``` php
$job = new KDuma\LPD\Client\Jobs\FileJob("my_raw_file.txt");
```

#### Print Service

``` php
$configuration = new KDuma\LPD\Client\Configuration($address, $queue_name, $port, $timeout);

$print_service = new KDuma\LPD\Client\PrintService($configuration);

$print_service->sendJob($job);
```
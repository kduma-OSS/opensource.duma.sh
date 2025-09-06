---
navigation:
    title: WebPrint.PHP
title: WebPrint Client for PHP
description: API client for WebPrint Server
type: library
platform: PHP
active: true
github: https://github.com/kduma-OSS/WebPrint-Client
system: WebPrint
system_url: /systems/webprint
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/WebPrint-Client" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/WebPrint-Client/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/webprint-client" target="_blank"}
::

## Installation

You can install the package via composer:

```bash
composer require kduma/webprint-client
```

### Laravel Integration Setup

To enable integration with Laravel Framework, add following Service Provider to your providers array in `app.php` config file:

```php
\KDuma\WebPrintClient\Laravel\WebPrintClientServiceProvider::class,
```

And add following environment keys:

```env
WEB_PRINT_ENDPOINT=<YOUR ENDPOINT>/api/web-print
WEB_PRINT_ACCESS_TOKEN=<YOUR TOKEN>
```

## Usage

Available Methods:

### Create Api Client Instance

```php
$api = new \KDuma\WebPrintClient\WebPrintApi(
    new \KDuma\WebPrintClient\HttpClient\GuzzleHttp7Client(
        endpoint: 'https://print.server.local/api/web-print',
        key: 'API_KEY'
    )
);
```

### Get List of all available printers

```php
$printers = $api->GetPrinters();
```

### Get List of all printers capable processing ZPL language

```php
$printers = $api->GetPrinters(type_filter: 'zpl');
```

### Get Printer Details

```php
$printer = $api->GetPrinter(
    ulid: '00000000000000000000000000'
);
```

### Get List of recently submitted Promises

```php
$promises = $api->GetPromises(
    page: 1,
    total_pages: &$total_pages // passed by reference
);
```

### Get Promise Details

```php
$promise = $api->GetPromise(
    ulid: '00000000000000000000000000'
);
```

### Create Promise

```php
$promise = $api->CreatePromise(
    name: 'Print Job',
    type: 'zpl',
    meta: ['format' => '4x6"']
);
```

### Create and Immediately print Promise

```php
$promise = $api->CreatePromiseAndPrint(
    name: 'Print Job',
    type: 'zpl',
    printer_ulid: '00000000000000000000000000',
    file_name: 'label.zpl',
    content: '^XA...'
);
```

### Get Promise Details

```php
$promise = $api->GetPromise(
    ulid: '00000000000000000000000000'
);
```

### Update Promise

```php
$api->UpdatePromise(
    ulid: '00000000000000000000000000',
    name: 'Updated',
    printer_ulid: '00000000000000000000000000',
    meta: ['dupa' => 123],
    ppd_options: [],
    status: 'ready'
);
```

### Delete Promise

```php
$api->DeletePromise(
    ulid: '00000000000000000000000000'
);
```

### Get Promise Content

```php
$content = $api->GetPromiseContent(
    ulid: '00000000000000000000000000'
);
```

### Upload Promise Content

```php
$api->SetPromiseContent(
    ulid: '00000000000000000000000000',
    content: fopen('myfile.txt', 'r'),
    file_name: 'myfile.txt'
);
```

### Send Promise to Print Queue

```php
$api->PrintPromise(
    ulid: '00000000000000000000000000'
);
```

### Create Print Dialog

```php
$dialog = $api->CreateDialog(
    ulid: '00000000000000000000000000',
    auto_print: true,
    redirect_url: 'http://example.com/',
    restricted_ip: '127.0.0.1'
);
```

### Get Print Dialog

```php
$dialog = $api->GetDialog(
    ulid: '00000000000000000000000000'
);
```

## Example

Use create print Promise and redirect user to print Dialog;

```php
public function PrintDocument()
{
    $api = new \KDuma\WebPrintClient\WebPrintApi(
        new \KDuma\WebPrintClient\HttpClient\GuzzleHttp7Client(
            endpoint: 'https://print.server.local/api/web-print',
            key: 'API_KEY'
        )
    );

    // Create Promise
    $promise = $api->CreatePromise(
        name: 'Test Document',
        type: 'ppd',
        meta: [
            'pages' => '2',
            'date' => '2021-09-12'
        ]
    );

    // Create Print Dialog
    $dialog = $api->CreateDialog(
        ulid: $promise,
        auto_print: true,
        redirect_url: 'http://example.com/return-url',
    );

    // Generate PDF
    $pdf = PDF::loadView('documents.test');

    // Upload Promise Content
    $api->SetPromiseContent(
        ulid: $promise,
        content: $pdf->output(),
        file_name: 'test.pdf'
    );

    return redirect($dialog->getLink());
}
```

## Laravel Integration

To get access to API client, typehint `WebPrintApiInterface` in your controllers or actions.


### Get List of recently submitted Promises in form of LazyCollection

There is a helper method, allowing to do lazy processing on promises list.

```php
$promises = $api->GetPromisesLazy();
```

### Print Aliases

If you publish config file, you can set aliases and use them instead of ULID's in `GetPrinter`, `UpdatePromise`, `CreatePromise` and `CreatePromiseAndPrint` methods.

#### Example

Content upload after response termination (Laravel)

```php
public function PrintDocument(WebPrintApiInterface $api)
{
    // Create Promise
    $promise = $api->CreatePromise(
        name: 'Test Document',
        type: 'ppd',
        meta: [
            'pages' => '2',
            'date' => '2021-09-12'
        ]
    );

    // Create Print Dialog
    $dialog = $api->CreateDialog(
        ulid: $promise,
        auto_print: true,
        redirect_url: 'http://example.com/return-url',
    );

    App::terminating(function () use ($promise, $api) {
        // Generate PDF
        $pdf = PDF::loadView('documents.test');

        // Upload Promise Content
        $api->SetPromiseContent(
            ulid: $promise,
            content: $pdf->output(),
            file_name: 'test.pdf'
        );
    });

    return redirect($dialog->getLink());
}
```

Headless printing, with using alias instead of ulid.

```php
public function PrintLabel(WebPrintApiInterface $api)
{
    $promise = $api->CreatePromiseAndPrint(
        name: 'Print Job',
        type: 'zpl',
        printer_ulid: 'printer_alias',
        file_name: 'label.zpl',
        content: '^XA...'
    );
}
```

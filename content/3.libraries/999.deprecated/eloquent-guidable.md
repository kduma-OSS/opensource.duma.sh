---
title: Eloquent GUID-able
description: Eases using and generating guid's in Laravel Eloquent models.
type: library
platform: Laravel
active: false
github: https://github.com/kduma-OSS/LV-eloquent-guidable
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-eloquent-guidable" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-eloquent-guidable/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/eloquent-guidable" target="_blank"}
::

::note
**New Version:** For new apps, please use the newer version available here: [kduma/eloquent-uuidable](/libraries/php/eloquent-uuidable)
::

# Setup
Add the package to the require section of your composer.json and run `composer update`

```json
"kduma/eloquent-guidable": "^1.1"
```

# Prepare models
Inside your model (not on top of file) add following lines:

```php
use \KDuma\Eloquent\Guidable;
```

In database create `guid` string field. If you use migrations, you can use following snippet:

```php
$table->string('guid')->unique();
```

# Usage
By default it generates slug on first save.

- `$model->newGuid()`{lang="php"} - Generate new guid. (Remember to save it by yourself)
- `Model::whereGuid($slug)->first()`{lang="php"} - Find by guid. (`whereGuid` is query scope)
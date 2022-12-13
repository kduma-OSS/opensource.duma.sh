---
title: Eloquent GUID-able
type: library
platform: Laravel
active: false
github: https://github.com/kduma-OSS/LV-eloquent-guidable
---


::alert{type="info"}
**New Version:** For new apps, please use the newer version available here: [kduma/eloquent-uuidable](/libraries/eloquent-uuidable)
::


# L5-eloquent-guidable

Eases using and generating guid's in Laravel Eloquent models.

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
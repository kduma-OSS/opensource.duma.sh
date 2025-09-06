---
title: Eloquent Sluggable
description: Eases using and generating slugs Laravel Eloquent models.
type: library
platform: Laravel
github: https://github.com/kduma-OSS/LV-eloquent-sluggable
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/LV-eloquent-sluggable" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/LV-eloquent-sluggable/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/eloquent-sluggable" target="_blank"}
::

## Setup
Add the package to the require section of your composer.json and run `composer update`

    "kduma/eloquent-sluggable": "^1.1"

## Prepare models
Inside your model (not on top of file) add following lines:

    use \KDuma\Eloquent\Slugabble;

Optionally you can add also `SluggableString` function which will return string from which slug will be made (default it uses `title` field):

    protected function SluggableString(){
        return $this->year.' '.$this->title;
    }  

In database create `slug` string field. If you use migrations, you can use following snippet:

    $table->string('slug')->unique();

## Usage
By default it generates slug on first save.

- `$model->newSlug()` - Generate new slug. (Remember to save it by yourself)
- `Model::whereSlug($slug)->first()` - Find by slug. (`whereSlug` is query scope)
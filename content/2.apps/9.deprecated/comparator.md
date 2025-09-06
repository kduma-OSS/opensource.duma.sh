---
title: Batch Comparator
description: Batch compare multiple files
type: app
platform: PHP
active: false
github: https://github.com/kduma-OSS/CLI-comparator
# featured: 3
# featured_description: Batch compare multiple files
# featured_icon: grommet-icons:compare
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/CLI-comparator" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/CLI-comparator/releases/latest/" target="_blank"}

:u-button[Packagist]{icon="simple-icons:packagist" href="https://packagist.org/packages/kduma/comparator" target="_blank"}
::

## Setup
Run bellow command to globally install Comparator:

```bash
composer global require kduma/comparator
```

and add `~/.composer/vendor/bin/` directory to your PATH in your ``~/.bash_profile` (or ``~/.bashrc`):

	export PATH=~/.composer/vendor/bin:$PATH

# Updating
Execute following command:

```bash
composer global update
```

# Usage

    Usage: bin/compare [-c compare_to, --compare compare_to] [-f format, --format format] [-h, --help] [-o output, --output output] [path] [file]

    Required Arguments:
    	path
    		The path with files to compare.

    Optional Arguments:
    	-h, --help
    		Prints a usage statement
    	-c compare_to, --compare compare_to
    		Compare to
    	-f format, --format format
    		Output format (text or cli)
    	-o output, --output output
    		Output file for text format
    	file
    		If defined, compares specified file in subfolder.

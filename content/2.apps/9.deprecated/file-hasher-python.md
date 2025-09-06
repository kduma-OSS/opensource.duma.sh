---
navigation:
  title: File Hasher.PY
title: File Hasher (PY)
description: MD5 and SHA1 file hash calculator and checker
type: app
platform: Python
active: false
github: https://github.com/kduma-OSS/PY-file-hasher
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/PY-file-hasher" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/PY-file-hasher/releases/latest/" target="_blank"}
::

## hasher
```
usage: hash [-h] [-t {both,md5,sha1}] file [file ...]

File Hasher.

positional arguments:
  file                  files to be hashed

optional arguments:
  -h, --help            show this help message and exit
  -t {both,md5,sha1}, --type {both,md5,sha1}
                        type of hash (default: both)
```

## checker
```
usage: check [-h] [-g] file [file ...]

File Hash Checker.

positional arguments:
  file        files to be checked

optional arguments:
  -h, --help  show this help message and exit
  -g, --gui   sum the integers (default: find the max)
```

### Interface

![cli.png](/apps/deprecated/file-hasher-python/cli.png)
![gui.png](/apps/deprecated/file-hasher-python/gui.png)

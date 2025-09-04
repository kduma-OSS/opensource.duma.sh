---
navigation:
    title: File Hasher.NET
title: File Hasher (C#)
description: MD5 and SHA1 file hash calculator and checker
type: app
platform: C# & .NET
active: true
github: https://github.com/kduma-OSS/CS-file-hasher
featured: 2
featured_description: MD5 and SHA1 file hash calculator and checker
featured_icon: icon-park-solid:file-hash
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/CS-file-hasher" blank}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/CS-file-hasher/releases/latest/" blank}
::

### `hasher` tool

Main tool containing two others.

```./hasher check [--help] [--version] file [file ...]```

```./hasher hash [--help] [--version] [-t|--type {both,md5,sha1}] file [file ...]```

```
check      Verify hashes for given file

hash       Generate hashes for given file

help       Display more information on a specific command.

version    Display version information.
```

### `hash` tool

Extracted only hashing portion from `hashing` tool.

```./hash [--help] [--version] [-t|--type {both,md5,sha1}] file [file ...]```

```
-t, --type        (Default: Both) Type of calculated hash (both,md5,sha1)

--help            Display this help screen.

--version         Display version information.

files (pos. 0)    Required. Files to generate hashes for
```

### `check` tool

Extracted only checking portion from `hashing` tool.

```./check [--help] [--version] file [file ...]```

```
--help            Display this help screen.

--version         Display version information.

files (pos. 0)    Required. Hash files to check
```
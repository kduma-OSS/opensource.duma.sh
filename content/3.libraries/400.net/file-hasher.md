---
navigation:
    title: File Hasher.NET
title: File Hasher (C#)
description: MD5 and SHA1 file hash calculator and checker library
type: library
platform: C# & .NET
active: true
github: https://github.com/kduma-OSS/CS-file-hasher
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/CS-file-hasher" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/CS-file-hasher/releases/latest/" target="_blank"}
::

## `FileHasher.Library.Hasher`

Class for calculating hashes of files, strings and streams.

### Static Methods:
* `Hash File(string path)` - Returns the hash of the file at the given path.
* `Hash String(string data)` - Returns the hash of the given string.
* `Hash Stream(Stream stream)` - Returns the hash of the given stream.

## `FileHasher.Library.Checker`

Class for checking hashes of files, strings and streams.

### Static Methods:
* `bool File(string path, Hash hash)` - Returns true if the hash of the file at the given path matches the given hash. 
* `bool String(string data, Hash hash)` - Returns true if the hash of the given string matches the given hash.
* `bool Stream(Stream stream, Hash hash)` - Returns true if the hash of the given stream matches the given hash.

## `FileHasher.Library.Hash`

A DTO for storing hashes.

### Constructor:
* `Hash(string md5, string sha1)` - Creates a new hash object from the given MD5 and SHA1 hashes.

### Methods:
* `byte[] Pack()` - Serializes the hash DTO into a MessagePack formatted byte array.

### Static Methods:
* `Hash Unpack(Stream stream)` - Deserializes a MessagePack formatted stream into a hash DTO.
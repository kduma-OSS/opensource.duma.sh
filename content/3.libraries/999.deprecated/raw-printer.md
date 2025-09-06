---
title: Raw Printer tools for C#
description: C# Raw Printing helper for dot matrix and thermal printers.
type: library
platform: C# & .NET Framework
active: false
github: https://github.com/kduma-OSS/CS-Raw-Printer
---

::u-button-group
:u-button[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/CS-Raw-Printer" target="_blank"}

:u-button[Releases]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/CS-Raw-Printer/releases/latest/" target="_blank"}

:u-button[RawPrinter.dll]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/CS-Raw-Printer/releases/latest/download/RawPrinter.dll" target="_blank"}
::

## Setup

Download `RawPrinter.dll` library from [GitHub Releases](https://github.com/kduma-OSS/CS-Raw-Printer/releases/latest) and add it to a project as a dependency.

::note
Due to usage of .NET Framework and Windows specific API's, this project is considered deprecated
::

## Usage
``` csharp
var printer = new RawPrinter.Printer("Printer Name");
if (!printer.Open("Job Name")) return;
printer.SendData("This text is sent to a line printer\r\n");
printer.SendData("===================================\r\n");
printer.Close();
```
---
title: PSS - PDF Scan Splitter
---

# PSS - PDF Scan Splitter

A tool to sort batch scanned PDF documents based on document number contained in barcode placed on document.

:button-link[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/CLI-pdf-scan-splitter" blank}

:button-link[Download pss.phar]{icon="material-symbols:cloud-download" href="https://github.com/kduma-OSS/CLI-pdf-scan-splitter/releases/latest/download/pss.phar" blank}


## Setup

You can install `pss` tool in three ways:

- Global composer installation - tool will be available globally as `pss` command
- You can download phar executable file from [GitHub Releases](https://github.com/kduma-OSS/CLI-pdf-scan-splitter/releases/latest){:target="_blank"} page
- Download source code form [GitHub](https://github.com/kduma-OSS/CLI-pdf-scan-splitter){:target="_blank"} to run

::code-group
```bash [Composer Global]
composer global require kduma/pdf-scan-splitter-tool
```
```bash [phar executable]
wget https://github.com/kduma-OSS/CLI-pdf-scan-splitter/releases/latest/download/pss.phar
chmod +x pss.phar
mv pss.phar /usr/local/bin/pss
```
```bash [Sources]
git clone https://github.com/kduma-OSS/CLI-pdf-scan-splitter.git pss
cd pss
composer install
```
::

## Requirements

This tool is based on `poppler-utils` and `zbar-tools` packages.
Those packages are run in a docker container, so you don't need to install them on your system, **but you need to have docker installed**.

## Usage

This tool reads every PDF file provided as an argument, splits every page into separate PDF and looks for a Code-128 barcode on each page.

If a barcode is found, the page is saved into a file named after the barcode into the output directory.
If no barcode is found, the page is saved into a file named `UNKNOWN.pdf`.
If there are multiple barcodes on a page, the page is saved into a file named after first barcode.
If there is multiple pages with the same barcode, the pages are saved into a file with a number suffix for duplicates.

::alert{type="warning"}
**WARNING: Files already existing in the output directory will be overwritten!**
::


::alert{type="info"}
You can provide also **JPG** and **PNG** files which will be automatically converted to **PDF** before processing.
::

::code-group
```bash [command syntax]
./pss process <output_dir> <pdf> [<pdf>...] <--dpi=200>
```
```bash [example]
./pss process ~/Downloads/output ~/Downloads/*.pdf
```
::


### Multipage Documents

In original idea, this tool sorted only single-page documents/forms.
As the need for processing multi-page documents arose, such functionality has been added in form of _page-identifying_ barcodes.

In multi-page documents you need to add barcode with following content:

::code-group
```[syntax]
[<document copy id>[@<document number>]]:<page number>[:<total pages>]
```

::code-block{label="examples" preview}

Basic form:
```
QWERTY:1:3
QWERTY:2:3
QWERTY:3:3
```

Basic form with `document number` - you don't need to place separate barcode with document number, as files are named after `document number` variable:
```
QWERTY@AGREEMENT-1:1:3
QWERTY@AGREEMENT-1:2:3
QWERTY@AGREEMENT-1:3:3
```

Short form - the `document copy id` is taken from another barcode - useful for small amount of space:
```
:1:3
:2:3
:3:3
```

Without `total pages` - if you want to save some space, or simply don't know final document length, you can ommit the `total pages` value in any of above forms:
```
QWERTY:1
QWERTY@AGREEMENT-1:2
:3
```

Basic-Short mixed form - you can mix basic and short mode - so for example if on first page you have barcode with `AGREEMENT-1` content, you can use short form on that page and on other pages basic form:
```
:1:3
AGREEMENT-1:2:3
AGREEMENT-1:3:3
```
::
::

The resulting PDF's will contain all pages with page-identifying barcodes in correct order, so you can scan them in any order.

::alert{type="info"}
While barcodes can be placed in any rotation and still will be scanned succesfully, 
this tool will not rotate the input documents so ensure that scanned files are in correct orientation.
::
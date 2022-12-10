---
title: PSS - PDF Scan Splitter
---


# Get started

Scanned PDF files splitter and sorter based on barcode

:button-link[GitHub Repository]{icon="bxl:github" href="https://github.com/kduma-OSS/CLI-pdf-scan-splitter" blank}


### `pss` tool

This tool reads every PDF provided as an argument, splits every page into separate PDF and looks for a Code-128 barcode on each page.
If a barcode is found, the page is saved into a file named after the barcode into the output directory.
If no barcode is found, the page is saved into a file named `UNKNOWN.pdf`.
If there are multiple barcodes on a page, the page is saved into a file named after first barcode.
If there is multiple pages with the same barcode, the pages are saved into a file with a number suffix for duplicates.

**WARNING: Files already existing in the output directory will be overwritten!**

```bash
./pss process <output_dir> <pdf> [<pdf>...] <--dpi=200>
```

### composer setup

```bash
composer global require kduma/pdf-scan-splitter-tool
```

Tool will be available globally as `pss` command.

### Requirements

This tool is based on `poppler-utils` and `zbar-tools` packages.
Those packages are run in a docker container, so you don't need to install them on your system, **but you need to have docker installed**.
[< Go Back to PDF Merge](/)

# PDF Merge Help

**Contents**
- [Usage](#usage)
  - [1 - Merging two or more documents](#1---merging-two-or-more-documents)
  - [2 - Extracting pages from a document](#2---extracting-pages-from-a-document)
  - [3 - Re-ordering pages in a document](#3---re-ordering-pages-in-a-document)
- [Ranges](#ranges)
  - [1 - Individual Pages](#1---individual-pages)
  - [2 - Range of Pages](#2---range-of-pages)
  - [Combining the two](#combining-the-two)
- [Limitations](#limitations)
- [Security and Privacy](#security-and-privacy)
- [Acknowledgments](#acknowledgments)

## Usage

**PDF Merge** is a simple tool for merging or extracting pages from one or more PDF Document(s) into a new PDF Document. This page will teach you how to use it for most use cases.

### 1 - Merging two or more documents

To combine a number of PDF documents into one:

1. Press on `Add PDF Document(s)...`. A window will open to select your files.
2. Select the PDF Documents you want to merge. You can select multiple files at once if they are in the same folder.
3. Repeat steps 1 and 2 until you have all your documents in the list.
4. If any document in the list has an `Error`, press on `Remove` next to it to remove it. See [Limitations](#limitations) below for more details.
5. If you only want a certain number of pages from some of your documents, enter the desired range in the 'Range' text box. For more information, see [Ranges](#ranges) below.
6. Enter the desired name for the merged file in the designated text box.
7. Press on `Merge Documents`. The merged file will download automatically and be available in your 'Downloads' folder.

### 2 - Extracting pages from a document

You can use the Range feature to extract pages from a PDF document:

1. Press on `Add PDF Document(s)...`. A window will open to select your files.
2. Select the PDF Document you want to extract pages from.
3. If the document in the list has an `Error`, press on `Remove` next to it to remove it. You will unfortunately not be able to extract pages from that document. See [Limitations](#limitations) below for more details.
4. Enter the desired range of pages in the 'Range' text box. For more information, see [Ranges](#ranges) below.
5. Enter the desired name for the new file containing your extracted pages in the designated text box.
6. Press on `Extract Pages into New Document`. The new file will download automatically and be available in your "Downloads" folder.

### 3 - Re-ordering pages in a document

You can use the Range feature to re-order the pages of a document by adding the same document multiple times. For example, let's assume you have a document called "invoice.pdf" that has 5 pages. Now let's say that you want pages 4 and 5 to be placed before pages 1, 2 and 3. Here's how you would proceed :

1. Press on `Add PDF Document(s)...`. A window will open to select your files.
2. Select "invoice.pdf".
3. In the `Range` text box next to this document, enter `4-5`.
4. Press on `Add PDF Document(s)...` and, once again, select "invoice.pdf".
5. In the `Range` text box next to that document, enter `1-3`.
6. Enter "invoice-reordered" in the file name text box.
7. Press on `Merge Documents`. The new file containing your re-ordered pages will download automatically and be available in your 'Downloads' folder.

## Ranges

The Range feature allows you to specify which pages to copy from a PDF document. You can enter the range in two different ways:

### 1 - Individual Pages

You can specify a number of individual pages to include in your merged PDF. Simply enter the number of the pages that you want to keep separated by commas. For example, if you want pages 5, 8, 13 and 16 of a document you would enter the following range: `5,8,13,16`.

### 2 - Range of Pages

You can also specify a range of pages to include in the merged PDF. Simply enter the start and the end pages to include separated by an hyphen. Note that both the indicated start and end pages will be included as well. For example, if you want pages 10, 11, 12, 13 and 14 of a document you would enter the following range: `10-14`.

### Combining the two

Finally, you can combine the two above methods in any way you want. For example, the following range: `5,18,21-23,34,65-70` would give you the pages 5, 18, 21, 22, 23, 34, 65, 66, 67, 68, 69 and 70 in the new document.

## Limitations

* **PDF Merge** does not work with *encrypted* PDF Documents. This is a limitation of the library I use for opening the files. In any case, encrypted documents usually disallow manipulation of any kind so it's probably for the best. It does mean however that some of your PDF Document may unfortunately not work for merging. You will receive an error if that's the case. Simply remove the offending document(s) and the others will work fine.
* **PDF Merge** is designed to work on a computer. That doesn't mean it wouldn't work on mobile, but it has not been tested for mobile and thus is unsupported. Also, please make sure to use PDF Merge in a modern web browser (Latest version of Google Chrome, Mozilla Firefox or Microsoft Edge will all work fine).

## Security and Privacy

**PDF Merge** has been designed to work directly inside your web browser locally on your computer. None of your PDF Documents will be uploaded on the internet or leave your computer in any way. In fact, you could completely disconnect your internet right now and it would still work perfectly fine.

In order to respect and protect your privacy, **PDF Merge** does not use cookies of any kind and does not show any advertisements. Finally, the complete source code of this product, should you want to inspect it, is available [here](https://github.com/jfdesrochers/pdfmerge).

## Acknowledgments

**PDF Merge** uses the following third-party libraries:

* **PDF-LIB**: A javascript library for reading and writing PDFs. Licensed under MIT. Available [here](https://pdf-lib.js.org).
* **Mithril.js**: An excellent small javascript framework for writing single-page applications. Licensed under MIT. Available [here](https://mithril.js.org).

**PDF Merge** is Copyright 2020 by Jean-François Desrochers. MIT License.
// Disable drag and drop
document.addEventListener('dragstart', function (event) {
    event.preventDefault();
    return false;
}, false);
document.addEventListener('dragover', function (event) {
    event.preventDefault();
    return false;
}, false);
document.addEventListener('drop', function (event) {
    event.preventDefault();
    return false;
}, false);

const options = {
    fileName: `Merged-${new Date().toDateString().replace(/\s/g, '_')}`,
    docs: [],
    errors: []
}

function removeError(doc) {
    for (let i = 0; i < options.errors.length; i++) {
        if (options.errors[i].doc === doc) {
            options.errors.splice(i, 1)
            return
        }
    }
}

function loadPDFFile (file) {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader()
            reader.onload = function (evt) {
                resolve(evt.target.result)
            }
            reader.readAsArrayBuffer(file)
        } catch (e) {
            reject(e)
        }
    })
}

function rangeToArray(lowBoundary, highBoundary) {
    const arr = new Array(highBoundary - lowBoundary);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = lowBoundary + i;
    }
    return arr;
}

function parseRange(index) {
    const invalidRange = 'This document has an invalid range specified. Please double-check before continuing.'

    let range = options.docs[index].range

    // First we separate the different range elements
    let rangeEl = range.split(',')
    if (rangeEl.length === 0) {
        // Range is empty or invalid. We default to all pages.
        return rangeToArray(0, options.docs[index].pageCount)
    }

    let result = []

    // Now we process all the range elements individually
    for (let i = 0; i < rangeEl.length; i++) {
        let el = rangeEl[i]
        if (el.indexOf('-') > -1) {
            // This is a range of pages. We first split it.
            let pages = el.split('-')
            if (pages.length !== 2) {
                // This would indicate an invalid range notation (like 2- or -6 or -)
                options.errors.push({doc: options.docs[index].fileName, message: invalidRange})
                return []
            }
            let [start, end] = [parseInt(pages[0]), parseInt(pages[1])]
            if (isNaN(start) || isNaN(end) || start < 1 || end > options.docs[index].pageCount || start > end) {
                // We cover the rest of the error cases
                options.errors.push({doc: options.docs[index].fileName, message: invalidRange})
                return []
            }
            // All the tests passed, we add the range of pages to our result
            // (index is 0-based but pages are 1-based hence the "start - 1")
            result = result.concat(rangeToArray(start - 1, end))
        } else {
            // We assume it to be a page number
            let pageno = parseInt(el)
            if (isNaN(pageno) || pageno < 1 || pageno > options.docs[index].pageCount) {
                options.errors.push({doc: options.docs[index].fileName, message: invalidRange})
                return []
            } else {
                result.push(pageno - 1)
            }
        }
    }

    // Finally we sort and return the resulting array
    return result.sort((a, b) => a - b)
}

class PDFMerge {

    inputChange(optname) {
        return (evt) => {
            options[optname] = evt.target.value
        }
    }

    inputChangeSave(optname) {
        return (evt) => {
            options[optname] = evt.target.value
            localStorage.setItem('JFDPDFMerge.' + optname, evt.target.value)
        }
    }

    fileNameValidate(optname) {
        return (evt) => {
            let val = evt.target.value
            if (val.endsWith('.pdf')) {
                val = val.slice(0, val.length - 4)
            }
            options[optname] = val
        }
    }

    rangeValidate(index) {
        return (evt) => {
            let val = evt.target.value
            if (val.length > 0 && /[0-9\-,]/.test(val[val.length - 1]) === false) {
                val = val.slice(0, val.length - 1)
            }
            options.docs[index].range = val
        }
    }

    async handleFileLoad(evt) {
        let files = evt.target.files
        options.loading = true
        const baseIndex = options.docs.length
        for (let i = 0; i < files.length; i++) {
            options.docs.push({
                fileName: files[i].name,
                pageCount: 0,
                range: '',
                doc: null,
                error: false,
                loading: true
            })
            m.redraw()
        }
        for (let i = 0; i < files.length; i++) {
            try {
                let pdfdata = await loadPDFFile(files[i])
                let pdfinstance = await PDFLib.PDFDocument.load(pdfdata)
                let pagecount = pdfinstance.getPageCount()
                Object.assign(options.docs[baseIndex + i], {
                    pageCount: pagecount,
                    range: '1-' + pagecount,
                    doc: pdfinstance,
                    loading: false
                })
                m.redraw()
            } catch (e) {
                Object.assign(options.docs[baseIndex + i], {
                    error: true,
                    loading: false
                })
                console.error(e)
                options.errors.push({doc: files[i].name, message: 'An error occured while loading this document. It may be encrypted. Please note that encrypted PDFs are not supported at this time.'})
                m.redraw()
            }
        }
        evt.target.value = ''
        options.loading = false
        m.redraw()
    }

    doMoveUp (index) {
        return () => {
            const itm = options.docs[index - 1]
            options.docs[index - 1] = options.docs[index]
            options.docs[index] = itm
        }
    }

    doMoveDown (index) {
        return () => {
            const itm = options.docs[index + 1]
            options.docs[index + 1] = options.docs[index]
            options.docs[index] = itm
        }
    }

    doRemoveDocument (index) {
        return () => {
            if (options.docs[index].error) {
                removeError(options.docs[index].fileName)
            }
            options.docs.splice(index, 1)
        }
    }

    doRemoveAll () {
        options.docs = []
        options.errors = []
    }

    async doMerge () {
        options.errors = []
        if (options.fileName === '') {
            options.errors.push({doc: 'Merging Error', message: 'Please specify a file name for the merged document.'})
            m.redraw()
            return
        }
        const ranges = new Array(options.docs.length)
        for (let i = 0; i < options.docs.length; i++) {
            ranges[i] = parseRange(i)
            if (options.docs[i].error) {
                options.errors.push({doc: options.docs[i].fileName, message: 'This document could not be loaded. Please remove it before continuing.'})
            }
        }
        if (options.errors.length > 0) {
            options.errors.push({doc: 'Merging Error', message: 'Please fix the above error(s) before merging.'})
            m.redraw()
            return
        }
        const loading = document.getElementById('loading')
        loading.classList.add('show')
        try {
            const mergedPDF = await PDFLib.PDFDocument.create()
            mergedPDF.setCreator('PDF Merger by J-F Desrochers')
            for (let i = 0; i < options.docs.length; i++) {
                const copiedPages = await mergedPDF.copyPages(options.docs[i].doc, ranges[i])
                copiedPages.forEach((page) => {
                    mergedPDF.addPage(page)
                })
            }
            const mergedBytes = await mergedPDF.save()
            const mergedBlob = new Blob([mergedBytes])
            const mergedUrl = URL.createObjectURL(mergedBlob)
            let el = document.createElement('a')
            el.href = mergedUrl
            el.download = options.fileName + '.pdf'
            el.click()
            URL.revokeObjectURL(mergedUrl)
            el = undefined
            loading.classList.remove('show')
            m.redraw()

        } catch (e) {
            options.errors.push({doc: 'Merging Error', message: 'An error occured during the merging­. Please try again with different documents.'})
            console.error(e)
            loading.classList.remove('show')
            m.redraw()
        }
    }

    view() {
        return [
            m('.list-loader', [
                options.errors.length > 0 ? m('.load-error', m('ul', options.errors.map(err => {
                    return m('li', [m('strong', err.doc), ': ' + err.message])
                }))) : '',
                m('.step', [
                    m('img.logo-title', {src: 'title.png'}),
                    m('h2.step-title', 'PDF Documents Merge Tool'),
                    m('h3.step-subtitle', [
                        'Welcome! This small tool will help you merge pages from 1 or more PDF documents into a single file. You can also select the range of pages to extract from a given document. To begin, please press on \'Add PDF Document(s)...\' below.',
                        m('a', {href: 'help.html'}, ' More information...')
                    ]),
                    options.docs.length > 0 ? [
                        m('table', [
                            m('thead', m('tr', [
                                m('th', 'File Name'),
                                m('th', {style: 'width: 120px'}, 'Page Count'),
                                m('th', {style: 'width: 120px'}, 'Range'),
                                m('th', {style: 'width: 160px'}, 'Actions')
                            ])),
                            m('tbody', options.docs.map((o, i) => {
                                return m('tr', [
                                    m('td', o.fileName),
                                    m('td', o.loading ? '' : o.error ? m('span.not-found', 'Error') : o.pageCount),
                                    m('td', m('input', {oninput: this.rangeValidate(i), disabled: (o.loading || o.error), value: o.range})),
                                    m('td', o.loading ? m('.lds-dual-ring') : [
                                        m('.spin-button', [
                                            m('button.btn', {onclick: this.doMoveUp(i), disabled: (i === 0)}, m('i.arrow.up')),
                                            m('button.btn', {onclick: this.doMoveDown(i), disabled: (i === options.docs.length - 1)}, m('i.arrow.down'))
                                        ]),
                                        m('button.btn', {onclick: this.doRemoveDocument(i)}, 'Remove')
                                    ])
                                ])
                            }))
                        ]),
                        m('.remove-all', m('button.btn.small', {onclick: this.doRemoveAll}, 'Remove All'))
                    ] : '',
                    m('label.btn', {for: 'addfile'}, [
                        'Add PDF Document(s)...',
                        m('input#addfile', {
                            type: 'file',
                            onchange: this.handleFileLoad,
                            style: 'display: none',
                            accept: 'application/pdf',
                            multiple: true
                        })
                    ]),
                    m('label', { for: 'filename' }, 'Enter the desired file name for your merged PDF'),
                    m('input#filename', { oninput: this.fileNameValidate('fileName'), value: options.fileName }),
                    m('button.btn', {onclick: this.doMerge, disabled: (options.fileName === '' || options.docs.length < 1 || options.loading)}, options.docs.length === 1 ? 'Extract Pages into New Document' : 'Merge Documents')
                ]),
                options.errors.length > 0 ? m('.load-error', m('ul', options.errors.map(err => {
                    return m('li', [m('strong', err.doc), ': ' + err.message])
                }))) : '',
                m('img.list-logo', {src: 'logo.png'})
            ])
        ]
    }
}


m.mount(document.getElementById('container'), PDFMerge)
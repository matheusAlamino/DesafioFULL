import { Component, Input, OnChanges, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core'

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit, OnChanges {

    pages: number[] = []
    pagesShow: any[] = []

    @Input() total: number
    @Input() pageSize: number
    @Input() currentPage: number
    @Input() language: string = "br"

    txt1: string = "Primeira página"
    txt2: string = "Anterior"
    txt3: string = "Próxima"
    txt4: string = "Última"
    txt5: string = "a"
    txt6: string = "de"
    txt7: string = "itens"

    @Output() pageChanged = new EventEmitter<number>()

    constructor() {}

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.total || isNaN(this.total)) return
        if (!this.pageSize || isNaN(this.pageSize)) return

        this.pages = Array(Math.ceil(this.total / this.pageSize))
        .fill(0)
        .map((x, i) => i + 1)
        this.generatePages()

        // if (changes.total && changes.total.previousValue != changes.total.currentValue) {
        //   this.currentPage = 0
        //   this.emitPage()
        // }
    }

    // dispara a página atual
    private emitPage() {
        this.pageChanged.emit(this.currentPage)
        this.generatePages()
    }

    goto(index: number) {
        if (this.currentPage !== index) {
        this.currentPage = index
        this.emitPage()
        }
    }

    nextPage() {
        if (this.currentPage < this.pages.length) {
            this.currentPage++
            this.emitPage()
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--
            this.emitPage()
        }
    }

    goFirst() {
        if (this.currentPage !== 1) {
            this.currentPage = 1
            this.emitPage()
        }
    }

    goLast() {
        if (this.pages.length !== this.currentPage) {
            this.currentPage = this.pages.length
            this.emitPage()
        }
    }

    generatePages() {
        const c = Number(this.currentPage),
        m = Number(this.pages[this.pages.length - 1])

        var current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l

        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || (i >= left && i < right)) {
                range.push(i)
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                rangeWithDots.push(l + 1)
                } else if (i - l !== 1) {
                rangeWithDots.push('...')
                }
            }
            rangeWithDots.push(i)
            l = i
        }

        this.pagesShow = rangeWithDots
    }
}

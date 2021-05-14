import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '../models/title.model';
import { TitleService } from '../services/title.service';
import { ConvertNumerics } from '../utils/convertNumerics';

@Component({
    selector: 'app-titles',
    templateUrl: './titles.component.html'
})
export class TitlesComponent implements OnInit {

    titles: Title[] = []
    today: Date = new Date()

    constructor(
        private titleService: TitleService,
        private datePipe: DatePipe,
        public convertNumerics: ConvertNumerics
    ) { }

    ngOnInit(): void {
        this.loadTitles()
    }

    loadTitles() {
        this.titleService.list().subscribe(data => {
            this.titles = data.data
            this.getDelayedDays()
        })
    }

    getDelayedDays() {
        this.titles.forEach((title, index) => {
            title.max_delayed_days = 0
            let totalValue: number = +title.total_value
            let fine: number = +title.percent_fine
            let fees: number = +title.percent_fees
            let value_corrected: number = 0
            fine = totalValue * (fine / 100)

            title.plots.forEach((plot, key) => {
                let dateBreak = plot.date_due.toString().split('/')
                let dateCompare = `${dateBreak[2]}-${dateBreak[1]}-${dateBreak[0]}`
                let date = new Date(dateCompare)
                let value: number = +plot.value
                date.setDate(date.getDate() + 1)
                if (plot.paid == false) {
                    if (date <= this.today) {
                        plot.delayed_days = Math.ceil(Math.abs(this.today.getTime() - date.getTime()) / (1000 * 3600 * 24))
                        title.max_delayed_days = title.max_delayed_days > 0 ? title.max_delayed_days : plot.delayed_days
                        let calcFees: number = ((fees / 100) / 30) * plot.delayed_days * value
                        value_corrected = value_corrected + calcFees + value
                    } else {
                        value_corrected = value_corrected + value
                        plot.delayed_days = 0
                    }
                } else {
                    value_corrected = value_corrected + value
                    plot.delayed_days = 0
                }
            })

            if (title.max_delayed_days > 0) {
                value_corrected = value_corrected + fine
            }
            title.value_corrected = value_corrected.toFixed(2)
            title.value_corrected = title.value_corrected.toString().replace('.', ',')
        })
    }
}

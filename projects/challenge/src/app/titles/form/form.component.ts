import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plot, Title } from '../../models/title.model';
import { TitleService } from '../../services/title.service';
import { Swal } from '../../utils';
import { ConvertNumerics } from '../../utils/convertNumerics';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

    titleCard: string = "Novo"
    error: boolean = false
    title_id: number = null
    title: Title = {
        id: null,
        number_title: null,
        name: null,
        cpf: null,
        percent_fees: null,
        percent_fine: null,
        qtd_plots: null,
        total_value: null,
        current_value: null,
        max_delayed_days: null,
        value_corrected: null,
        plots: []
    }
    plot: Plot = {
        id: null,
        title_id: null,
        number: null,
        date_due: null,
        value: null,
        paid: null,
        delayed_days: null
    }
    plot_edit: boolean = false

    @ViewChild('closeModalPlot') $closeModalPlot: ElementRef
    @ViewChild('form') formulario: any

    constructor(
        private datePipe: DatePipe,
        private convertNumerics: ConvertNumerics,
        private swal: Swal,
        private titleService: TitleService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.init()
    }

    init() {
        this.route.params.subscribe((params: any) => {
            if (params.id) {
                this.title_id = params.id
                this.titleCard = "Editar"
                this.loadTitle()
            }
        })
    }

    loadTitle() {
        this.titleService.show(this.title_id).subscribe(response => {
            this.title = response

            this.title.percent_fees = this.title.percent_fees.toString().replace('.', ',')
            this.title.percent_fine = this.title.percent_fine.toString().replace('.', ',')
        })
    }

    saveProcess() {
        if (!this.formulario.valid && this.title.plots.length > 0) {
            this.error = true
            return false
        }

        this.title.qtd_plots = this.title.plots.length
        let total_value: number = 0
        this.title.plots.forEach(plot => {
            let value: number = +plot.value
            total_value += value
        })
        this.title.total_value = total_value.toFixed(2)
        this.title.percent_fees = this.title.percent_fees.toString().replace(',', '.')
        this.title.percent_fine = this.title.percent_fine.toString().replace(',', '.')

        if (this.title.id) {
            this.titleService.edit(this.title_id, this.title).subscribe(response => {
                this.swal.msgAlert('Sucesso', 'Título editado com sucesso!', 'success')
                this.router.navigate([`/titles`])
            }, error => {
                this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar editar o título!', 'error', 'Ok')
            })
        } else {
            this.titleService.save(this.title).subscribe(response => {
                this.swal.msgAlert('Sucesso', 'Título cadastrado com sucesso!', 'success', 'Ok')
                this.router.navigate([`/titles`])
            }, error => {
                this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar cadastrar o título!', 'error', 'Ok')
            })
        }
    }

    openModal(plot) {
        if (plot) {
            this.plot_edit = true
            this.plot = {
                id: plot.id,
                title_id: plot.title_id,
                number: plot.number,
                date_due: plot.date_due,
                date: plot.date,
                value: plot.value.toString().replace(".", ","),
                paid: plot.paid,
                delayed_days: plot.delayed_days
            }
        } else {
            this.plot_edit = false
            this.clearObject()
        }
    }

    clearObject() {
        this.plot = {
            id: null,
            title_id: null,
            number: this.title.plots?.length + 1,
            date_due: null,
            value: null,
            paid: null,
            delayed_days: null
        }
    }

    onSavePlot() {
        if (this.plot.number && this.plot.value && this.plot.date) {
            let date = this.datePipe.transform(this.plot.date, 'dd/MM/yyyy')
            let value = this.convertNumerics.convertToAmericanValue(this.plot.value.toString()).toString()

            if (this.plot_edit) {
                let index = this.title.plots.findIndex(element => element.number == this.plot.number)
                this.title.plots[index].date_due = date.toString()
                this.title.plots[index].date = this.plot.date
                this.title.plots[index].value = value
            } else {
                this.title.plots.push({
                    id: null,
                    title_id: null,
                    number: this.plot.number,
                    date_due: date.toString(),
                    date: this.plot.date,
                    value: value,
                    paid: false,
                    delayed_days: null
                })
            }

            this.$closeModalPlot.nativeElement.click()
            this.swal.msgAlert('Sucesso', this.plot_edit ? 'Parcela editada com sucesso' : 'Parcela criada com sucesso', 'success')
        }
    }
}

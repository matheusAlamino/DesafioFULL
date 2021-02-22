import { Component, OnInit } from '@angular/core';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexTitleSubtitle
  } from "ng-apexcharts";
import { AppComponent } from 'projects/multiplx/src/app/app.component';
import { ClientService } from '../services/client.service';
import { ProcessService } from '../services/process.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    chartOptions: any
    fontFamily = '';
    colorsGrayGray500 = '';
    colorsGrayGray200 = '';
    colorsGrayGray300 = '';
    colorsThemeBaseDanger = '';
    colorsThemeBasePrimary = '';
    colorsThemeLightPrimary = '';
    colorsThemeBaseSuccess = '';
    colorsThemeLightSuccess = '';
    reportTotalProcess: number = 0
    reportTotalClients: number = 0

    constructor(
        private app: AppComponent,
        private processService: ProcessService,
        private clientService: ClientService
    ) { }

    ngOnInit(): void {
        this.fontFamily = 'Poppins'
        this.colorsGrayGray500 = '#B5B5C3'
        this.colorsGrayGray200 = '#ECF0F3'
        this.colorsGrayGray300 = '#E5EAEE'
        this.colorsThemeBaseDanger = '#F64E60'
        this.colorsThemeBasePrimary = '#6993FF'
        this.colorsThemeLightPrimary = '#E1E9FF'
        this.colorsThemeBaseSuccess = '#1BC5BD'
        this.colorsThemeLightSuccess = '#C9F7F5'
        this.initCharts()
    }

    initCharts() {
        this.processService.monthlyAmount().subscribe(response => {
            this.reportTotalProcess = response.total
            this.getChartOptions(response.amount, response.months)
        }, error => {
            if (error.status == 401) {
                this.app.logout('dashboard')
            }
        })

        this.clientService.count().subscribe(response => {
            this.reportTotalClients = response.total
        }, error => {
            if (error.status == 401) {
                this.app.logout('dashboard')
            }
        })

    }

    getChartOptions(amount, months) {
        console.log(amount, months)
        this.chartOptions = {
            series: [
                {
                    name: 'Quantidade de Processos',
                    data: amount
                }
            ],
            chart: {
                type: 'area',
                height: 150,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
                sparkline: {
                    enabled: true
                }
            },
            plotOptions: {},
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: 'solid',
                opacity: 1
            },
            stroke: {
                curve: 'smooth',
                show: true,
                width: 3,
                colors: [this.colorsThemeBaseSuccess]
            },
            xaxis: {
                categories: months,
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false,
                    style: {
                        colors: this.colorsGrayGray500,
                        fontSize: '12px',
                        fontFamily: this.fontFamily
                    }
                },
                crosshairs: {
                    show: false,
                    position: 'front',
                    stroke: {
                        color: this.colorsGrayGray300,
                        width: 1,
                        dashArray: 3
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: undefined,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        fontFamily: this.fontFamily
                    }
                }
            },
            yaxis: {
                labels: {
                    show: false,
                    style: {
                        colors: this.colorsGrayGray500,
                        fontSize: '12px',
                        fontFamily: this.fontFamily
                    }
                }
            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: '12px',
                    fontFamily: this.fontFamily
                },
                y: {
                    // tslint:disable-next-line
                    formatter: function (val) {
                        return val
                    }
                },
                marker: {
                    show: false
                }
            },
            colors: [this.colorsThemeLightSuccess],
            markers: {
                colors: this.colorsThemeLightSuccess,
                strokeColor: [this.colorsThemeBaseSuccess],
                strokeWidth: 3
            }
        }
    }

}

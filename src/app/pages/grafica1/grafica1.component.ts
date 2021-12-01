import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

   // Doughnut
   public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
   public doughnutChartData: MultiDataSet = [
     [350, 450, 100],
     [50, 150, 120],
     [250, 130, 70],
   ];
   public doughnutChartType: ChartType = 'doughnut';

   constructor() { }

   ngOnInit(): void {
   }

   // events
   public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
     console.log(event, active);
   }

   public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
     console.log(event, active);
   }

}

import { Component, Input } from '@angular/core';
import { IDiagramPoint } from '../../interfaces/diagram';

@Component({
  selector: 'diagram',
  templateUrl: './diagram.component.html',
})
export class DiagramComponent {
    public dataPoints: IDiagramPoint[] = [];
    public chart: any;
    
    public chartOptions = {
        theme: "light2",
        title: {
            text: "Charting data:"
        },
        data: [{
            type: "line",
            xValueFormatString: "DD MMMM YYYY hh:mm:ss TT",
            dataPoints: this.dataPoints
        }]
    }
    
    public getChartInstance(chart: object) {
        this.chart = chart;
    }
    
    public addData = (data: IDiagramPoint[]) => {
        data.forEach( (val) => {
            this.dataPoints.push(val); 
        })
        this.chart.render();
    }

    public clearData(): void {
        while(this.dataPoints.length) {
            this.dataPoints.pop();
        }
        this.chart.render();
    }
}
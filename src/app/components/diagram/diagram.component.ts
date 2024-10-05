import { Component, Input } from '@angular/core';

@Component({
  selector: 'diagram',
  templateUrl: './diagram.component.html',
})
export class DiagramComponent {
    public dataPoints:any[] = [];
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
    
    getChartInstance(chart: object) {
        this.chart = chart;
    }
    
    addData = (data: { x: any, y: any }[]) => {
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
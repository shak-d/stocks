import React, { Component } from "react";
import nextId from "react-id-generator";
import { IChartApi, UTCTimestamp } from '../node_modules/lightweight-charts';
import Button from "./Button";
import styles from "./Montage.module.css"
import TextBox from "./TextBox";

type IProps = {

    defaultWindowSize:number;
};

export default class Montage extends Component<IProps>{
    chartContainerId: string = nextId();
    chart: IChartApi | undefined;
    constructor(props: IProps) {
        super(props);
    }

    public resizeChart(width: number, height: number) {
        if (this.chart !== undefined) {
            this.chart.resize(width, height - 100);
        }
    }

    componentDidMount() {

        import("../node_modules/lightweight-charts").then((charts) => {
            this.chart = charts.createChart(this.chartContainerId, {
                width: this.props.defaultWindowSize, height: this.props.defaultWindowSize - 100,
                crosshair: {
                    mode: 0,
                }
            });
            this.chart.applyOptions({
                layout: {
                    backgroundColor: '#000',
                    textColor: '#99a39c',

                },
                watermark: {
                    color: 'rgba(0, 0, 0, 0)',
                },
                grid: {
                    vertLines: {
                        color: '#333333',
                        style: 3
                    },
                    horzLines: {
                        color: '#333333',
                        style: 3
                    },
                },
                rightPriceScale: {
                    borderColor: '#333333'
                },
                timeScale: {
                    borderColor: '#333333',
                    timeVisible: true
                },
            });
            var candleSeries = this.chart.addCandlestickSeries();
            candleSeries.applyOptions({
                downColor: '#ed1400',
                borderDownColor: '#ed1400',
                upColor: '#00b900',
                borderUpColor: '#00b900',
                wickUpColor: '#00b900',
                wickDownColor: '#ed1400'
            });

            candleSeries.setData(this.getChartStartingData());


        })
    }


    render() {
      return  <div>
            <div className={styles.contentContainer}>
                <div className={styles.tickerContainer}>
                    <div className={styles.tickerTextBoxContainer}>
                        <TextBox />
                    </div>
                    <Button title="Go" />
                </div>
                <div id={this.chartContainerId}>
                </div>
                <div className={styles.hotButtonsContainer}>
                    <Button title="Sell" type="sell" />
                    <Button title="Buy" type="buy" />
                </div>
            </div>
        </div>
    }


    getChartStartingData() {
        var d = new Date();
        var s1 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        d = new Date(d.getTime() + 60000)
        var s2 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        d = new Date(d.getTime() + 60000)
        var s3 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        d = new Date(d.getTime() + 60000)
        var s4 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        d = new Date(d.getTime() + 60000)
        var s5 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        d = new Date(d.getTime() + 60000)
        var s6 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        d = new Date(d.getTime() + 60000)
        var s7 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        d = new Date(d.getTime() + 60000)
        var s8 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        d = new Date(d.getTime() + 60000)
        var s9 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        d = new Date(d.getTime() + 60000)
        var s10 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        d = new Date(d.getTime() + 60000)
        var s11 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        d = new Date(d.getTime() + 60000)
        var s12 = Math.floor(d.getTime() / 1000) as UTCTimestamp;
        console.log(d.getTime());
        var data = [
            { time: s1, open: 56.49, high: 57.04, low: 56.26, close: 56.91 },
            { time: s2, open: 56.72, high: 57.34, low: 56.66, close: 56.75 },
            { time: s3, open: 56.76, high: 57.19, low: 56.50, close: 56.55 },
            { time: s4, open: 56.51, high: 56.84, low: 56.17, close: 56.81 },
            { time: s5, open: 57.00, high: 57.80, low: 56.82, close: 57.38 },
            { time: s6, open: 57.06, high: 58.48, low: 57.01, close: 58.09 },
            { time: s7, open: 59.15, high: 60.54, low: 58.00, close: 59.01 },
            { time: s8, open: 59.10, high: 59.63, low: 58.76, close: 59.50 },
            { time: s9, open: 59.09, high: 59.37, low: 58.96, close: 59.25 },
            { time: s10, open: 59.00, high: 59.27, low: 58.54, close: 58.87 },
            { time: s11, open: 59.07, high: 59.36, low: 58.67, close: 59.32 },
            { time: s12, open: 59.21, high: 59.66, low: 59.02, close: 59.57 },
        ];
        return data;
    }
}
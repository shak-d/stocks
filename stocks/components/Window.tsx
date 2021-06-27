import React, { Component } from 'react';
import Draggable from 'react-draggable';
import styles from './Window.module.css'
import { ResizableBox, ResizeCallbackData } from 'react-resizable'
import TextBox from './TextBox';
import Button from './Button';
import nextId from "react-id-generator";
import { SyntheticEvent } from 'react';
import { IChartApi } from '../node_modules/lightweight-charts';

interface IProps {

}

interface IState {
    width: number;
    height: number;
}

export default class Window extends Component<IProps, IState>{
    chartContainerId: string = nextId();
    chart : IChartApi | undefined;

    onResize(e: SyntheticEvent, data: ResizeCallbackData){
        this.setState({width: data.size.width, height: data.size.height});
        if(this.chart !== undefined){
            this.chart.resize(data.size.width, data.size.height-75);
        }
      };

    constructor(props: IProps) {
        super(props);
        this.chart = undefined;
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {

        import("../node_modules/lightweight-charts").then((charts) => {
            this.chart = charts.createChart(this.chartContainerId, { width: 400, height: 400 });
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
                timeScale:{
                    borderColor: '#333333'
                }
            });
            const lineSeries = this.chart.addLineSeries();
            lineSeries.setData([
                { time: '2019-04-11', value: 80.01 },
                { time: '2019-04-12', value: 96.63 },
                { time: '2019-04-13', value: 76.64 },
                { time: '2019-04-14', value: 81.89 },
                { time: '2019-04-15', value: 74.43 },
                { time: '2019-04-16', value: 80.01 },
                { time: '2019-04-17', value: 96.63 },
                { time: '2019-04-18', value: 76.64 },
                { time: '2019-04-19', value: 81.89 },
                { time: '2019-04-20', value: 74.43 },
            ]);

            
        })
    }

    render() {
        return (
            <Draggable
                handle={"." + styles.header}
                defaultPosition={{ x: 0, y: 0 }}
                bounds="parent"
                scale={1}>
                <ResizableBox width={500} height={500}
                    minConstraints={[100, 100]} className={styles.window} onResize={this.onResize}>
                    <div className={styles.header}>
                        <span className={styles.headerTitle}>GME chart</span>
                        <button className={styles.headerClose}>x</button>
                    </div>
                    <div className={styles.contentContainer}>
                        <div className={styles.tickerContainer}>
                            <div className={styles.tickerTextBoxContainer}>
                                <TextBox />
                            </div>
                            <Button title="Go" />
                        </div>
                        <div id={this.chartContainerId}>
                        </div>
                    </div>
                </ResizableBox>
            </Draggable>
        );
    }
}

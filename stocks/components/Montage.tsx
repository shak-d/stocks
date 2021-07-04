import React, { Component, MouseEvent, Ref, RefObject } from "react";
import nextId from "react-id-generator";
import { BarData, IChartApi, ISeriesApi } from '../node_modules/lightweight-charts';
import Button from "./Button";
import styles from "./Montage.module.css"
import TextBox from "./TextBox";

type IProps = {
    defaultWindowSize: number,
    onGoBtnClicked: (ticker: string) => void;
    charData: any
    onBuyBtnClicked: ()=>void;
    onSellBtnClicked: ()=>void;
    defaultTickerText?: string;
};

export default class Montage extends Component<IProps>{
    chartContainerId: string = nextId();
    chart: IChartApi | undefined;
    candleSeries: ISeriesApi<"Candlestick"> | undefined;
    tickerTextBox: RefObject<TextBox>;
    defaultTickerText : string;

    constructor(props: IProps) {
        super(props);
        this.tickerTextBox = React.createRef();
        this.defaultTickerText = props.defaultTickerText?props.defaultTickerText:"";
        this.onGoBtnClicked = this.onGoBtnClicked.bind(this);
        this.onBuyBtnClicked = this.onBuyBtnClicked.bind(this);
        this.onSellBtnClicked = this.onSellBtnClicked.bind(this);
        this.resizeChart = this.resizeChart.bind(this);
    }

    public resizeChart(width: number, height: number) {

        if (this.chart!==undefined) {
            console.info(width);
            this.chart.resize(width, height - 100);
        }
    }

    componentDidMount() {

        this.tickerTextBox.current?.setText(this.defaultTickerText);

        import("../node_modules/lightweight-charts").then((charts) => {
            this.chart = charts.createChart(this.chartContainerId, {
                width: 500, height: 500 - 100,
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
            this.candleSeries = this.chart.addCandlestickSeries();
            this.candleSeries.applyOptions({
                downColor: '#ed1400',
                borderDownColor: '#ed1400',
                upColor: '#00b900',
                borderUpColor: '#00b900',
                wickUpColor: '#00b900',
                wickDownColor: '#ed1400'
            });
        })
    }


    render() {
        if (this.candleSeries && this.props.charData)
            this.candleSeries.setData(this.props.charData.bars);

        return <div>
            <div className={styles.contentContainer}>
                <div className={styles.tickerContainer}>
                    <div className={styles.tickerTextBoxContainer}>
                        <TextBox ref={this.tickerTextBox} />
                    </div>
                    <Button title="Go" onClick={this.onGoBtnClicked} />
                </div>
                <div id={this.chartContainerId}>
                </div>
                <div className={styles.hotButtonsContainer}>
                    <Button title="Sell/Short" type="sell" onClick={this.onSellBtnClicked}/>
                    <Button title="Buy/Cover" type="buy" onClick={this.onBuyBtnClicked}/>
                </div>
            </div>
        </div>
    }

    private onGoBtnClicked(event: MouseEvent) {
        var ticker = this.tickerTextBox.current?.getText();
        if (ticker)
            this.props.onGoBtnClicked(ticker);
    }

    private onBuyBtnClicked(event: MouseEvent) {
            this.props.onBuyBtnClicked();
    }

    private onSellBtnClicked(event: MouseEvent) {
            this.props.onSellBtnClicked();
    }

}
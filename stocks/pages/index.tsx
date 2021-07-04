import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import stylesUtils from '../styles/utilities.module.css'
import Header from '../components/Header';
import Window from '../components/Window';
import React, { Component, RefObject } from 'react';
import Montage from '../components/Montage';
import nextId from 'react-id-generator';
import { BarData, UTCTimestamp } from 'lightweight-charts';
import Positions, { Position } from '../components/Positions';
import seedrandom from 'seedrandom';

interface IProps {
}

interface IState {
  windows: WindowElements;
  broker: Broker
}

interface WindowElement {
  ticker: string,
  type: WindowElementType;
}

interface WindowElements {
  [id: string]: WindowElement
}

enum WindowElementType {
  Montage,
  Positions
}

interface Stocks {
  [ticker: string]: StockData;
}

interface Broker {
  buyingPower: number,
  stocks: Stocks,
  positions: Position[]
}


interface StockData {
  lastClose: number,
  lastIndex: number,
  targetPrice: number,
  targetIndex: number,
  currentIndex: number,
  bars: BarData[],
  noisedPrice: number
}

export default class Home extends Component<IProps, IState> {

  barTicks: number = 0;
  private static orderSize = 100;
  currentTime: number = Math.floor(new Date().getTime() / 1000);
  randomNumber: () => number;

  constructor(props: IProps) {
    super(props);
    this.randomNumber = seedrandom();
    this.state = {
      windows: {},
      broker: {
        buyingPower: 200000,
        positions: [],
        stocks: {}
      }
    }
    this.onNewChart = this.onNewChart.bind(this);
    this.onNewPositions = this.onNewPositions.bind(this);

    setInterval(() => {
      this.addPricePointToStocks();
    }, 125);
  }

  componentDidMount(){
    this.createTickerIfInexistent("spy");
    this.setState((state:IState)=>{
      return {
        windows: {
          "default1":{
            ticker:"spy",
            type:WindowElementType.Montage
          },
          "default2":{
            ticker:"",
            type:WindowElementType.Positions
          }
        }
      }
    });
  }

  private addPricePointToStocks() {
    this.setState((state: IState) => {

      //Update stocks price
      var stocks = state.broker.stocks;
      if (!Object.keys(stocks).length) return state;
      var newStocks: Stocks = JSON.parse(JSON.stringify(stocks));
      var increaseIndex: boolean = false;
      if (this.barTicks === 480) {
        this.barTicks = 0;
        this.currentTime += 60;
        increaseIndex = true;
      }

      Object.keys(newStocks).forEach((key: string) => {
        let stock: StockData = newStocks[key];

        if (increaseIndex) {
          stock.currentIndex++;
          stock.bars[stock.currentIndex] = {
            close: 0,
            high: 0,
            low: 0,
            open: 0,
            time: this.currentTime as UTCTimestamp
          };
          if (stock.currentIndex === stock.targetIndex) {
            // change trend
            stock.lastClose = stock.noisedPrice;
            stock.lastIndex = stock.currentIndex;
            stock.targetIndex = stock.lastIndex + 50 + Math.round(this.randomNumber() + 30);
            stock.targetPrice = this.getRandomPrice();
          }
        }

        var deltaY = stock.targetPrice - stock.lastClose;
        var deltaX = stock.targetIndex - stock.lastIndex;
        var angle = deltaY / deltaX;
        var basePrice = stock.lastClose + (stock.currentIndex - stock.lastIndex) * angle;
        var noise = ((0.01 * this.randomNumber()) - this.randomNumber() * (this.randomNumber() * 0.004)) + 1;
        stock.noisedPrice = basePrice * noise;
        this.mergeTickToBar(stock.noisedPrice, stock.bars[stock.bars.length - 1], increaseIndex);
      });

      //Update positions values
      var newPositions: Position[] = JSON.parse(JSON.stringify(state.broker.positions));
      newPositions.forEach((position: Position) => {
        if (position.size != 0) {
          var updatedOpenPnl: number;
          var currentStockPrice = newStocks[position.ticker].bars[newStocks[position.ticker].bars.length - 1].close;
          if (position.size > 0)
            updatedOpenPnl = ((currentStockPrice - position.price) * Math.abs(position.size));
          else
            updatedOpenPnl = ((position.price - currentStockPrice) * Math.abs(position.size));
          position.openPnl = updatedOpenPnl;
        }
      });

      return {
        windows: state.windows,
        broker: {
          buyingPower: state.broker.buyingPower,
          positions: newPositions,
          stocks: newStocks
        }
      };
    }, () => {
      this.barTicks++;
    });

  }

  private getRandomPrice(): number {
    return 10 + Math.round(this.randomNumber() * 10000) / 100;
  }

  private mergeTickToBar(price: number, currentBar: BarData, isNewBar: boolean) {
    if (isNewBar) {
      currentBar.open = price;
      currentBar.high = price;
      currentBar.low = price;
      currentBar.close = price;
    } else {
      currentBar.close = price;
      currentBar.high = Math.max(currentBar.high, price);
      currentBar.low = Math.min(currentBar.low, price);
    }
  }

  private onNewChart() {
    this.setState((state: IState) => {
      var windows: WindowElements = JSON.parse(JSON.stringify(state.windows));
      windows[nextId()] = {
        ticker: "",
        type: WindowElementType.Montage
      };
      return {
        windows: windows,
        broker: state.broker
      }
    });
  }

  private onNewPositions() {
    this.setState((state: IState) => {
      var windows: WindowElements = JSON.parse(JSON.stringify(state.windows));
      windows[nextId()] = {
        ticker: "",
        type: WindowElementType.Positions
      };
      return {
        windows: windows,
        broker: state.broker
      }
    });
  }

  private createTickerIfInexistent(ticker: string) {
    this.setState((state: IState) => {
      if (Object.keys(state.broker.stocks).includes(ticker))
        return state;
      var newStocks: Stocks = JSON.parse(JSON.stringify(state.broker.stocks));

      var defaultBarData = this.getChartStartingData();
      var tickerData: StockData = {
        bars: defaultBarData,
        lastIndex: defaultBarData.length - 1,
        currentIndex: defaultBarData.length - 1,
        lastClose: defaultBarData[defaultBarData.length - 1].close,
        targetIndex: defaultBarData.length - 1 + 50 + Math.round(Math.random() + 30),
        targetPrice: this.getRandomPrice(),
        noisedPrice: defaultBarData[defaultBarData.length - 1].close
      }
      newStocks[ticker] = tickerData;
      return {
        windows: state.windows,
        broker: {
          buyingPower: state.broker.buyingPower,
          positions: state.broker.positions,
          stocks: newStocks
        }
      }
    });
  }

  private createMontageWindow(key: string): JSX.Element {

    var onGoClicked = (ticker: string) => {
      this.createTickerIfInexistent(ticker);
      this.setState((state: IState) => {
        var newWindows: WindowElements = JSON.parse(JSON.stringify(this.state.windows));
        newWindows[key].ticker = ticker;
        return {
          broker: state.broker,
          windows: newWindows
        }
      });
    };

    var onBuyClicked = () => {
      this.setState((state: IState) => {
        var newPositions: Position[] = JSON.parse(JSON.stringify(state.broker.positions));
        var ticker = state.windows[key].ticker;
        var tickerFound: boolean = false;
        var newBuyingPower = state.broker.buyingPower;
        var lastPrice = state.broker.stocks[ticker].bars[state.broker.stocks[ticker].bars.length - 1].close;
        newPositions.forEach((position: Position) => {
          if (position.ticker === ticker) {
            tickerFound = true;
            if (position.size == 0) {
              position.size = Home.orderSize;
              position.price = lastPrice;
              newBuyingPower -= position.size * position.price;
            }
            else if (position.size > 0) {
              // The new price is calculate as the weighted average of the new and old price based on the size
              position.price = ((position.price * position.size) + (lastPrice * Home.orderSize)) / (position.size + Home.orderSize);
              position.size = position.size + Home.orderSize;
              newBuyingPower = newBuyingPower - (lastPrice * Home.orderSize);
            }
            else {
              var newClosedPnl: number;
              newClosedPnl = position.openPnl * (Home.orderSize / Math.abs(position.size));
              position.closedPnl += newClosedPnl;
              position.openPnl -= newClosedPnl;
              position.size += Home.orderSize;
              newBuyingPower -= lastPrice * Home.orderSize;
            }
          }
        });
        if (!tickerFound) {
          var newPosition: Position = {
            id: nextId(),
            closedPnl: 0,
            openPnl: 0,
            price: lastPrice,
            size: Home.orderSize,
            ticker: ticker
          };
          newBuyingPower -= newPosition.size * newPosition.price;
          newPositions.push(newPosition);
        }
        return {
          windows: state.windows,
          broker: {
            buyingPower: newBuyingPower,
            stocks: state.broker.stocks,
            positions: newPositions
          }
        };
      });
    };

    var onSellClicked = () => {
      this.setState((state: IState) => {
        var newPositions: Position[] = JSON.parse(JSON.stringify(state.broker.positions));
        var ticker = state.windows[key].ticker;
        var tickerFound: boolean = false;
        var newBuyingPower = state.broker.buyingPower;
        var lastPrice = state.broker.stocks[ticker].bars[state.broker.stocks[ticker].bars.length - 1].close;
        newPositions.forEach((position: Position) => {
          if (position.ticker === ticker) {
            tickerFound = true;
            if (position.size == 0) {
              position.size = -Home.orderSize;
              position.price = lastPrice;
              newBuyingPower += Math.abs(position.size) * position.price;
            }
            else if (position.size > 0) {

              var newClosedPnl: number;
              newClosedPnl = position.openPnl * (Home.orderSize / position.size);
              position.closedPnl += newClosedPnl;
              position.openPnl -= newClosedPnl;
              position.size -= Home.orderSize;
              newBuyingPower += lastPrice * Home.orderSize;


            }
            else {
              // The new price is calculate as the weighted average of the new and old price based on the size
              position.price = ((position.price * Math.abs(position.size)) + (lastPrice * Home.orderSize)) / (Math.abs(position.size) + Home.orderSize);
              position.size -= Home.orderSize;
              newBuyingPower += lastPrice * Home.orderSize;
            }
          }
        });
        if (!tickerFound) {
          var newPosition: Position = {
            id: nextId(),
            closedPnl: 0,
            openPnl: 0,
            price: lastPrice,
            size: -Home.orderSize,
            ticker: ticker
          };
          newPositions.push(newPosition);
          newBuyingPower += lastPrice * Home.orderSize;
        }
        return {
          windows: state.windows,
          broker: {
            buyingPower: newBuyingPower,
            stocks: state.broker.stocks,
            positions: newPositions
          }
        };
      });
    };

    var montageRef: RefObject<Montage> = React.createRef();
    var onResize = (width: number, height: number) => montageRef.current?.resizeChart(width, height);
    var handleClose = ()=>this.removeWindow(key);
    return (
      <Window defaultPosX={0} defaultPosY={key=="default1"?0:30} key={key} onResize={onResize} onClose={handleClose} title={this.state.windows[key].ticker.toUpperCase() + " Chart"}>
        <Montage defaultTickerText={key=="default1"?"spy":""} onBuyBtnClicked={onBuyClicked} onSellBtnClicked={onSellClicked}
          defaultWindowSize={Window.defaultWindowSize} ref={montageRef}
          charData={this.state.broker.stocks[this.state.windows[key].ticker]} onGoBtnClicked={onGoClicked} />
      </Window>
    )
  }

  private createPositionsWindow(key: string): JSX.Element {

    var posX:number;
    if(key=="default2"){
      posX=510;
    }
    else
    posX=0;
    var handleClose = () => this.removeWindow(key);
    return (
      <Window defaultPosX={posX} defaultPosY={0} key={key} title="Positions" onClose={handleClose}>
        <Positions positions={this.state.broker.positions} />
      </Window>
    )
  }

  removeWindow(key: string) {
    this.setState((state: IState) => {
      var newWindows: WindowElements = JSON.parse(JSON.stringify(state.windows));
      delete newWindows[key];
      return {
        windows: newWindows,
        broker: state.broker
      }
    });
  }


  render() {

    let windows: JSX.Element[] = [];
    Object.keys(this.state.windows).forEach((key: string) => {
      let window: WindowElement = this.state.windows[key];
      if (window.type === WindowElementType.Montage)
        windows.push(this.createMontageWindow(key));
      else
        windows.push(this.createPositionsWindow(key));
    });

    return (
      <div className={stylesUtils.h100}>
        <Head>
          <title>Project spike</title>
          <meta name="description" content="Simulate a stock trading platform" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        </Head>
        <Header buyingPower={this.state.broker.buyingPower} onNewChartClicked={this.onNewChart} onNewPositionsClicked={this.onNewPositions} />

        <div className={styles.windowsContainer}>
          {windows}
        </div>

      </div>
    )
  }

  private getChartStartingData(): BarData[] {
    var d = new Date()
    var time = Math.floor(d.getTime() / 1000) as UTCTimestamp;
    var basePrice = this.randomNumber() *50 +10;
    var data = [
      { time: time, open: basePrice, high: basePrice + 1.1, low: basePrice - 1.1, close: basePrice+0.54 },
    ];
    return data;
  }
}

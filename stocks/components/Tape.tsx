import React, { Component } from "react";
import Button from "./Button";
import styles from "./Tape.module.css"
import montageStyles from "./Montage.module.css"
import tableStyles from "./Table.module.css"
import TextBox from "./TextBox";
import nextId from "react-id-generator";
import moment from "moment";

type IProps = {
};

type IState = {
    prices: PricePoint[]
}

type PricePoint = {
    time: Date;
    price: number;
}

export default class Tape extends Component<IProps, IState>{
    static readonly maxRows = 50;
    constructor(props: IProps) {
        super(props);
        this.state = {
            prices: []
        }
        this.addPricePoint = this.addPricePoint.bind(this);
    }

    componentDidMount(): void {
        this.addPricePoint({ time: new Date(), price: 456 });
        this.addPricePoint({ time: new Date(), price: 656 });
    }

    addPricePoint(pricePoint: PricePoint): void {
        this.setState((state:IState)=>{
            var newPrices: PricePoint[];
            newPrices = state.prices.slice().reverse();
            newPrices.push(pricePoint);
            if (newPrices.length > Tape.maxRows)
                newPrices.shift();
            newPrices.reverse();
            return {prices: newPrices};
        });
    }

    private createRow(pricePoint: PricePoint, index: number): JSX.Element {
        return (
            <tr key={nextId()}>
                <td>{moment(pricePoint.time).format("HH:mm:ss")}</td>
                <td>{pricePoint.price}</td>
            </tr>
        );
    }


    render(): JSX.Element {

        let tapeRows: JSX.Element[] = [];
        this.state.prices.forEach((item: PricePoint, index: number) => {
           
            tapeRows.push(this.createRow(item, index));
        }
        
        );

        return (
            <div>
                <div className={montageStyles.tickerContainer}>
                    <div className={montageStyles.tickerTextBoxContainer}>
                        <TextBox />
                    </div>
                    <Button title="Go" />
                </div>
                <table className={tableStyles.table}>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tapeRows}
                    </tbody>
                </table>
            </div>
        )

    }
}
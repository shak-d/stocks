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
    positions: Position[]
}

type Position = {
    price: number;
    ticker: string;
    size: number;
    pnl: number;
}

export default class Tape extends Component<IProps, IState>{
    static readonly maxRows = 50;
    constructor(props: IProps) {
        super(props);
        this.state = {
            positions: []
        }
        this.addPricePoint = this.addPricePoint.bind(this);
    }

    componentDidMount(): void {
        this.addPricePoint({ time: new Date(), price: 456 });
        this.addPricePoint({ time: new Date(), price: 656 });
    }

    addPricePoint(position: Position): void {
        this.setState((state:IState)=>{
            var newPrices: Position[];
            newPrices = state.prices.slice().reverse();
            newPrices.push(position);
            if (newPrices.length > Tape.maxRows)
                newPrices.shift();
            newPrices.reverse();
            return {prices: newPrices};
        });
    }

    private createRow(position: Position): JSX.Element {
        return (
            <tr key={nextId()}>
                <td>{position.ticker}</td>
                <td>{position.size}</td>
                <td>{position.price}</td>
                <td>{position.pnl}</td>
            </tr>
        );
    }


    render(): JSX.Element {

        let positionsRows: JSX.Element[] = [];
        this.state.positions.forEach((item: Position) => {
           
            positionsRows.push(this.createRow(item));
        }
        
        );

        return (
                <table className={tableStyles.table}>
                    <thead>
                        <tr>
                            <th>Ticker</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>PnL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positionsRows}
                    </tbody>
                </table>
        )

    }
}
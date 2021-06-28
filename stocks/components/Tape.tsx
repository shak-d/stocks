import React, { Component } from "react";
import Button from "./Button";
import styles from "./Tape.module.css"
import TextBox from "./TextBox";

type IProps = {
    defaultWindowSize: number;
};

type IState = {
    prices: PricePoint[]
}

type PricePoint = {
    time: number;
    price: number;
}

export default class Tape extends Component<IProps, IState>{
    static readonly maxRows = 50;
    constructor(props: IProps) {
        super(props);
        this.state = {
            prices: []
        }
    }

    addPricePoint(pricePoint: PricePoint): void {
        var newPrices: PricePoint[];
        newPrices = this.state.prices.slice().reverse();
        newPrices.push(pricePoint);
        if (newPrices.length > Tape.maxRows) {
            newPrices.shift();
        }
        newPrices.reverse();
        this.setState({
            prices: newPrices
        });
    }

    private createRow(pricePoint: PricePoint): JSX.Element {
        return (
            <tr>
                <td>{pricePoint.time}</td>
                <td>{pricePoint.price}</td>
            </tr>
        );
    }


    render(): JSX.Element {

        let tapeRows: JSX.Element[] = [];
        this.state.prices.map((item: PricePoint) =>
            tapeRows.push(this.createRow(item))
        );

        return (
            <table>
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
        )

    }
}
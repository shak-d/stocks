import React, { Component } from "react";
import tableStyles from "./Table.module.css"

type IProps = {
    positions: Position[]
};

type IState = {
}

export interface Position{
    price: number;
    ticker: string;
    size: number;
    openPnl: number;
    closedPnl: number;
    id: string;
}

export default class Tape extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props);
    }

    componentDidMount(): void {
    }

    private createRow(position: Position): JSX.Element {
        return (
            <tr key={position.id}>
                <td>{position.ticker.toUpperCase()}</td>
                <td>{position.size}</td>
                <td>{position.price.toFixed(2)}</td>
                
                <td className={"text-right"}>{position.openPnl.toFixed(2)}</td>
                <td className={`${"text-right"} ${position.closedPnl>0?" text-positive":" text-negative"}`}>{position.closedPnl.toFixed(2)}</td>
            </tr>
        );
    }


    render(): JSX.Element {

        let positionsRows: JSX.Element[] = [];
        this.props.positions.forEach((item: Position) => {
           
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
                            <th>Open PnL</th>
                            <th>Closed PnL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positionsRows}
                    </tbody>
                </table>
        )

    }
}
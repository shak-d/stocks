import styles from './Header.module.css';
import TitledElement from './TitledElement';
import Button from './Button';
import React, { Component, MouseEvent } from 'react';
import stylesUtils from '../styles/utilities.module.css';
import Logo from './Logo';
import Clock from 'react-live-clock';

interface IProps {
    onNewChartClicked : Function;
    onNewTapeClicked : Function;
}

interface IState {
}

export default class Header extends Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);
        this.onNewChartClick = this.onNewChartClick.bind(this);
        this.onNewTapeClick = this.onNewTapeClick.bind(this);
    }


    render() {
        return (
            <div>
                <nav className={styles.header}>
                    <Logo title="Project spike" />
                    <div className={stylesUtils.mlAuto}>
                        <TitledElement title="Buying power" >
                            200,000
                        </TitledElement>
                        <TitledElement title="Market clock ">
                        <Clock format={'HH:mm:ss'} ticking={true} timezone={'US/Eastern'} />
                        </TitledElement>
                    </div>
                </nav>
                <Button title="+ New Chart" onClick={this.onNewChartClick} />
                <Button title="+ New Tape" onClick={this.onNewTapeClick}/>
            </div>
        )
    }

    onNewChartClick(event: MouseEvent) {
        this.props.onNewChartClicked();
    }

    onNewTapeClick(event: MouseEvent) {
        this.props.onNewTapeClicked();
    }
}



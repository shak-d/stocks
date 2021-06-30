import React, { Component } from 'react';
import Draggable from 'react-draggable';
import styles from './Window.module.css'
import { ResizableBox, ResizeCallbackData } from 'react-resizable'
import TextBox from './TextBox';
import Button from './Button';
import nextId from "react-id-generator";
import { SyntheticEvent } from 'react';

import Moment from 'moment';
import moment from 'moment';
import Montage from './Montage';

interface IProps {
    children?: JSX.Element;
}

interface IState {
}

export default class Window extends Component<IProps, IState>{


    defaultWindowSize: number = 500;

    onResize(e: SyntheticEvent, data: ResizeCallbackData) {
        if (this.props.children instanceof Montage) {
            var montage = this.props.children as Montage;
            montage.resizeChart(data.size.width, data.size.height);
        }
    };

    constructor(props: IProps) {
        super(props);
        this.onResize = this.onResize.bind(this);
    }



    render() {

        return (
            <Draggable
                handle={"." + styles.header}
                defaultPosition={{ x: 0, y: 0 }}
                bounds="parent"
                scale={1}>
                <ResizableBox width={this.defaultWindowSize} height={this.defaultWindowSize}
                    minConstraints={[200, 100]} className={styles.window} onResize={this.onResize}>
                    <div className={styles.windowContentContainer}>
                        <div className={styles.header}>
                            <span className={styles.headerTitle}>GME chart</span>
                            <button className={styles.headerClose}>x</button>
                        </div>
                        {this.props.children}
                    </div>
                </ResizableBox>
            </Draggable>
        );
    }


}

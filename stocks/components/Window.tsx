import React, { Component, MouseEvent } from 'react';
import Draggable from 'react-draggable';
import styles from './Window.module.css'
import { ResizableBox, ResizeCallbackData } from 'react-resizable'
import { SyntheticEvent } from 'react';


interface IProps {
    children?: JSX.Element;
    onResize?: (width: number, height: number) => void;
    title: string;
    onClose: () => void;
    defaultPosX: number;
    defaultPosY: number;
}

interface IState {

}

export default class Window extends Component<IProps, IState>{

    public static defaultWindowSize: number = 500;
    private posX:number;
    private posY:number;

    onResize(e: SyntheticEvent, data: ResizeCallbackData) {
        if (this.props.onResize)
            this.props.onResize(data.size.width, data.size.height);
    };

    constructor(props: IProps) {
        super(props);
        this.onResize = this.onResize.bind(this);
        this.posX=props.defaultPosX;
        this.posY=props.defaultPosY;
        this.handleCloseClick = this.handleCloseClick.bind(this);
    }

    render() {

        return (
            <Draggable
                handle={"." + styles.header}
                defaultPosition={{ x: this.posX, y: this.posY }}
                bounds="parent"
                scale={1}>
                <ResizableBox width={Window.defaultWindowSize} height={Window.defaultWindowSize}
                    minConstraints={[200, 100]} className={styles.window} onResize={this.onResize}>
                    <div className={styles.windowContentContainer}>
                        <div className={styles.header}>
                            <span className={styles.headerTitle}>{this.props.title}</span>
                            <button className={styles.headerClose} onClick={this.handleCloseClick}>x</button>
                        </div>
                        {this.props.children}
                    </div>
                </ResizableBox>
            </Draggable>
        );
    }
    handleCloseClick(event: MouseEvent) {
        event.preventDefault();
        this.props.onClose();
    }


}

import { Component, MouseEvent } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
    title: string;
    onClick?: (event : MouseEvent) => void;
}

export default class Button extends Component<ButtonProps>{

    constructor(props: ButtonProps){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return(
            <button type="button" className={styles.button} onClick={this.handleClick}>
                {this.props.title}
            </button>
        )
    }

    handleClick(event: MouseEvent) {
        event.preventDefault();
        if(this.props.onClick)
            this.props.onClick(event)
      }

}




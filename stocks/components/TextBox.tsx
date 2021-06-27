import { Component, MouseEvent } from 'react';
import styles from './TextBox.module.css';

type TextBoxProps = {
    value?: string;
}

export default class TextBox extends Component<TextBoxProps>{

    constructor(props: TextBoxProps){
        super(props);
    }

    render() {
        return(
            <div className={styles.container}>
            <input type="text" className={styles.textBox} defaultValue={this.props.value?this.props.value:""}/>
            </div>
        )
    }

}




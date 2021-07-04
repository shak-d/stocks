import React from 'react';
import { RefObject } from 'react';
import { Component, MouseEvent } from 'react';
import styles from './TextBox.module.css';

type TextBoxProps = {
    value?: string;
}

export default class TextBox extends Component<TextBoxProps>{

    textBox: RefObject<HTMLInputElement>;
    constructor(props: TextBoxProps) {
        super(props);
        this.textBox = React.createRef();
        this.getText = this.getText.bind(this);
    }

    render() {
        return (
            <div className={styles.container}>
                <input ref={this.textBox} type="text" className={styles.textBox} defaultValue={this.props.value ? this.props.value : ""} />
            </div>
        )
    }

    getText(): string {
        return this.textBox.current?.value ?? "";
    }

    setText(text: string): void {
        if (this.textBox.current)
            this.textBox.current.value = text;
    }

}




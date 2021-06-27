import styles from './Header.module.css';
import TitledElement from './TitledElement';
import Button from './Button';
import { MouseEvent } from 'react';
import stylesUtils from '../styles/utilities.module.css';

export default function Header() {
    return (
        <nav className={styles.header}>
            <Button title="+ New Chart" onClick={onButtonClick} />
            <Button title="+ New Tape" />
            <div className={stylesUtils.mlAuto}>
                <TitledElement title="Buying power" >
                    200,000
                </TitledElement>
                <TitledElement title="Market clock" >
                    09:23:45
                </TitledElement>
            </div>
        </nav>
    )
}

function onButtonClick(event: MouseEvent) {
    alert(event.currentTarget.tagName);
}

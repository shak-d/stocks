import styles from './TitledElement.module.css';

type TitledElementProps = {
    title: string;
    children: JSX.Element | JSX.Element[] | string;
    className?: string;
}

export default function TitledElement(props: TitledElementProps) {
    return (
        <div className={styles.titledElement + (props.className ? " " + props.className : "")}>
            <small >{props.title}</small>
            <div>
                {props.children}
            </div>
        </div>
    )
}

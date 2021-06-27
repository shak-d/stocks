import styles from './Logo.module.css';

type LogoProps = {
    title: string;
}

export default function Logo(props: LogoProps) {
    return (
        <div className={styles.logo}>
            {props.title}
        </div>
    )
}

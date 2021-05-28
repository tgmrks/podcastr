import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './styles.module.scss';

export function Header() { //TODO: learn more about 'default' properties 
    //const currentDate = new Date.toLocaleDateString();
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR,
    }); //dependency: $ yarn add date-fns

    return(
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podcastr" />
            <p>O melhor para você ouvir, sempre</p>
            <span>{currentDate}</span>
        </header>
    );
}

/*
    a header without scss "module" component would look like :
    import './styles.module.scss';
    ...
    <header className="headerContainer">
*/
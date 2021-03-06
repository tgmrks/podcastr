import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Image from 'next/image';
import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    members: string, 
    description: string,
    duration: number;
    durationAsString: string,
    url: string,
    publishedAt: string,
}

type EpisodeProps = {
    episode: Episode,
}

export default function Episodes({ episode }: EpisodeProps) {
    const router = useRouter(); //React "hook" so pode ser usado dentro de componentes. TODO: estudar "hook" em React
    const { play } = usePlayer(); //using/importing PlaterContext from function usePlayer in PlayerContext.tsx
    return (
        //<h1>{router.query.slug}</h1>
        <div className={styles.episode}>

            <Head>
                <title>{episode.title}</title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image
                  width={700}
                  height={160}
                  src={episode.thumbnail}
                  objectFit="cover" />
                <button type="button" onClick={() => play(episode)}> 
                    <img src="/play.svg" alt="Tocar Episodio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }}/>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    
    const { data } = await api.get('episodes', {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc'
        }
      });

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id,
            }
        }
    });

    return {
        paths: paths,
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    //ctx = context
    const { slug } = ctx.params; //"slug" eh exatamente o nome dado ao arquivo [slug].tsx
    const { data } = await api.get(`/episodes/${slug}`);
    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
      }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, //24 horas
    }
}
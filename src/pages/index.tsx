import { GetStaticProps } from 'next' //typifying function 'getStaticProps'
import { api } from '../services/api'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import styles from './home.module.scss'
import { usePlayer } from '../contexts/PlayerContext'

//typifying variables:
type Episodes = {
  id: string,
  title: string,
  thumbnail: string,
  members: string, 
  duration: number;
  durationAsString: string,
  url: string,
  publishedAt: string,
}

type HomeProps = {
  //episodes: Array<Episodes>
  latestEpisodes: Episodes[];
  allEpisodes: Episodes[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) { 
    //const { playList } = useContext(PlayerContext);
    const { playList } = usePlayer();//import/use PlayerContext
    const episodeList = [...latestEpisodes, ...allEpisodes]; //... is copying attributes and spreading 'em in the new const 
    
    return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                
                <Image width={192} height={192} src={episode.thumbnail} alt={episode.title} objectFit="cover" />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>                
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}> 
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image 
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                        <img src="/play-green.svg" alt="Tocar episódio" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>
    </div>
  )
}
  
//before: export async function getStaticProps() { ...
export const getStaticProps: GetStaticProps = async () => {
  /* fetch possibilities:
  'http://localhost:3333/episodes'
  'http://localhost:3333/episodes?_limit=12'
  'http://localhost:3333/episodes?_limit=12&sort=published_at&_order+desc'
  ...
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();
  */
  const { data } = await api.get('episodes', {
    params: {
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
    
  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, //regerate/request a new page version every 8 hours
  }
} 

/* SPA (single page application) method for React: 
export default function Home() {
  useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then(response => response.json()) //cast return into json
      .then(data => console.log(data)) //get the return in 'data' var
  }, [])
  return (
    <h1>Index</h1>
  )
}

  useEffect: request new datas when sth changes in the application (side effects)
          what => when  :  whenever the [var] changes the effect will be called, if the [] is empty it only runs a single time
  useEffect(() => {}, [var])
  to get a 'response' make sure you server is running on port 3333 ($ yarn server). This must have been pre configure on package.json
  open the console in browser to see the console.log
*/

/* SSR (server side rendering) method for Next:
  export default function Home(props) { //will get props from async response from getServerSideProps
    console.log(props.episodes);
    return (
      <div>
        <h1>Index</h1>
        <p>{JSON.stringify(props.episodes)}</p>
      </div>
    )
  }
  export async function getServerSideProps() {
    const response = await fetch('http://localhost:3333/episodes');
    const data = await response.json();
    return {
      props: {
        episodes: data,
      }
    }
  }

  getServerSideProps: will get data (or be processed) from the Server (Node) 
  if you disable javascript on browse you can see the console.log on the server terminal or you can add it to the interface <w />
    <p>{JSON.stringify(props.episodes)}</p>
  therefore the data will always be prompt to the client before the page is load 
  and it will execute every time someone accesses the app page; if the app doesnt need realtime update use SSG instead 
*/

/* SSG (static site generation) method for Next:
  ...
  export async function getStaticProps() {
    const response = await fetch('http://localhost:3333/episodes');
    const data = await response.json();
    return {
      props: {
        episodes: data,
      },
      revalidate: 60 * 60 * 8, //regerate/request a new page version every 8 hours
    }
  }
  
  getStaticProps will avoid unnecessary server processing/requests and will help with performance 
*/
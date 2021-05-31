import { useEffect } from "react"
 
export default function Home(props) {
  console.log(props.episodes);
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

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
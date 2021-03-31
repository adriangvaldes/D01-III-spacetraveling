import { GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return(
    <>
      <Head>
          <title>Home | spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sicronização em vez de ciclos de vida</p>
            <div className={styles.info}>
              <div>
                <img src="/images/calendar.svg" alt="calendar"/> 
                <p>12 de abril de 2021</p>
              </div>
              <div>
                <img src="/images/user.svg" alt="users"/> 
                <p>João Miguel</p>
              </div>
            </div>
          </a>
        </div>
        <div className={styles.posts}>
          <a href="">
            <strong>Criando um app do Zero</strong>
            <p>Tudo sobre criar um app do zero</p>
            <div className={styles.info}>
              <div>
                <img src="/images/calendar.svg" alt="calendar"/> 
                <p>15 de março de 2021</p>
              </div>
              <div>
                <img src="/images/user.svg" alt="users"/> 
                <p>Antonio Bermudes</p>
              </div>
            </div>
          </a>
        </div>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };

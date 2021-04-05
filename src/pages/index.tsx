import { GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import Link from 'next/link';

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
  // postsPagination: PostPagination;
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {
  return(
    <>
      <Header isHome={true}/>
      <Head>
          <title>Home | spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>  
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div className={styles.info}>
                  <div>
                    <img src="/images/calendar.svg" alt="calendar"/> 
                    <p>{post.first_publication_date}</p>
                  </div>
                  <div>
                    <img src="/images/user.svg" alt="users"/> 
                    <p>{post.data.author}</p>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
        <button type="button">Carregar mais post</button>
      </main>
    </>
  );
}

export const getStaticProps:GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('',
    { 
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 4
  })


  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      data: {
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.subtitle),
        author: RichText.asText(post.data.author)
      },
    }
  })

  return {
    props: { posts }
  }
}

import { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import Link from 'next/link';

import Header from '../components/Header';

import { RichText } from 'prismic-dom';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

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



export default function Home({ postsPagination }: HomeProps) {
  const formattedPosts = postsPagination.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    } 
  })

  const [posts, setPosts] = useState<Post[]>(formattedPosts)
  const [nextPage, setNextPage] = useState<string>(postsPagination.next_page)
  const [currentPage, setCurrentPage] = useState(1);

  async function handlePagination(): Promise<void>{
    if(currentPage !== 1 && nextPage === null) return

    const postsResponse = await fetch(`${nextPage}`)
      .then(response => response.json())
      
    setNextPage(postsResponse.next_page)
    setCurrentPage(postsResponse.page)

    const loadPosts = postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...loadPosts])
    
  }
  
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
          {nextPage?
            <button type="button" onClick={() => handlePagination()}>Carregar mais post</button>
            :null
          }
        </div>
      </main>
    </>
  );
}

export const getStaticProps:GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    { 
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 2,
    })
  
  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      },
    }
  })

  const postsPagination:PostPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  }

  return {
    props: { postsPagination }
  }
}

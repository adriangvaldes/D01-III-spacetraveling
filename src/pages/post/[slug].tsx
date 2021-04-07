import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { strictEqual } from 'node:assert';
import { useRouter } from 'next/router';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }:PostProps) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <p>Carregando...</p>;
  }

  return (
     <>
        <Header isHome={false}/>
        <Head>
          <title>Post | spacetraveling</title>
        </Head>
        <div className={styles.bannerContainer}>
          <img src={post.data.banner.url} alt="bannerPost"/>
        </div>
        <main className={styles.postContainer}>
          <h1>{post.data.title}</h1>
          <div className={styles.postInfo}>
            <img src="/images/calendar.svg" alt="calendar"/> 
            <p>{post.first_publication_date}</p>
            <img src="/images/user.svg" alt="users"/> 
            <p>{post.data.author}</p>
            <img src="/images/user.svg" alt="users"/>
            <p>4 min</p> 
          </div>
          <div className={styles.postContent}> {/*Parte q vai ser pega por map */}
            {post.data.content.map(content => (
              <>
              <h1>{content.heading}</h1>
              {content.body.map(body => (
                <p>{body.text}</p>
              ))}
              </>
            ))}
          </div>
        </main>
     </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  // const paths = await prismic.query(Prismic.Predicates.at('document-type', 'posts'),
  //   {
  //     pageSize: 5, 
  //   });

  return {
    paths: [],
    fallback: 'blocking'
  }
};

export const getStaticProps:GetStaticProps = async (context) => {
  const prismic = getPrismicClient();
  const { slug } = context.params;

  const response = await prismic.getByUID('posts', String(slug), {});
  // console.log(response.data.content[1].heading)

  const post = {
    first_publication_date: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    data: {
      title: response.data.title[0].text,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author[0].text,
      content: response.data.content.map(content => ({
        heading: content.heading[0]?.text ?? '',
        body: content.body.map(body=>({
          type: body.type,
          text: body.text
        }))
      }))
     }
  }

  const formatedDate = new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return {
    props: { post }
  }
};

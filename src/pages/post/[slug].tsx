import React, { Fragment } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import Head from 'next/head';
import { strictEqual } from 'node:assert';
import { useRouter } from 'next/router';
import PrismicDOM from 'prismic-dom';

import Header from '../../components/Header';

import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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
            <p>{format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,})}
            </p>
            <img src="/images/user.svg" alt="users"/> 
            <p>{post.data.author}</p>
            <img src="/images/user.svg" alt="users"/>
            <p>4 min</p> 
          </div>
          <div className={styles.postContent}> {/*Parte q vai ser pega por map */}
            {post.data.content.map(({ heading, body }) => (
              <Fragment key={heading}>
                <h2>{heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: PrismicDOM.RichText.asHtml(body),
                  }}
                />
              </Fragment>
            ))}
          </div>
        </main>
     </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps:GetStaticProps = async (context) => {
  const prismic = getPrismicClient();
  const { slug } = context.params;

  const response = await prismic.getByUID('posts', String(slug), {});

  return {
    props: { post:response }
  }
};

import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import Head from 'next/head';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import { strictEqual } from 'node:assert';

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
          <h1>Criando um app CRA do zero</h1>
          <div className={styles.postInfo}>
            <img src="/images/calendar.svg" alt="calendar"/> 
            <p>{post.first_publication_date}</p>
            <img src="/images/user.svg" alt="users"/> 
            <p>{post.data.author}</p>
            <img src="/images/user.svg" alt="users"/>
            <p>4 min</p> 
          </div>
          <div className={styles.postContent}> {/*Parte q vai ser pega por map */}
            <h1>Point et varius</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, eos quis quaerat laudantium, sit eum praesentium omnis excepturi nostrum cum, reiciendis voluptas quia non ipsam rerum voluptate magnam quo eligendi.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, eos quis quaerat laudantium, sit eum praesentium omnis excepturi nostrum cum, reiciendis voluptas quia non ipsam rerum voluptate magnam quo eligendi.</p>
          </div>
        </main>
     </>
  );
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  return {
    paths: [],
    fallback: 'blocking'
  }
};

export const getStaticProps:GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  // console.log(slug)

  const response = await prismic.getByUID('posts', String(slug), {});

  // console.log(RichText.asText(response.data.content))

  const content = response.data.content.map(content => ({
    heading: RichText.asText(content.heading),
    body: content.body.map(body => ({
      text: ((body.text.concat('\n')))
      //RichText.asText(body.text)
    }))
  }))

  const post = {
    first_publication_date: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    data: {
      title: RichText.asText(response.data.title),
      banner: {
        url: response.data.banner.url,
      },
      author: RichText.asText(response.data.author),
      content: {
        heading: 'Some heading',//RichText.asText(response.data.content.heading),
        body: {
          text: 'Some text',//RichText.asText(response.data.content.body.text),
        },
      },
  }
  }
  // console.log(response.data)
  // console.log(JSON.stringify(post))

  return {
    props: { post }
  }
};

import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Head from 'next/head';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';

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

export default function Post() {
  return (
    <>
      <Head>
          <title>Post | spacetraveling</title>
      </Head>
    </>
  )
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

export const getStaticProps:GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  console.log(slug)

  const response = await prismic.getByUID('posts', String(slug), {});

  console.log(response)

  const post = {
    first_publication_date: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: {
        heading: RichText.asHtml(response.data.content.heading),
        body: {
          text: RichText.asHtml(response.data.content.body.text),
        },
      },
  }
  }

  return {
    props: { post }
  }
};

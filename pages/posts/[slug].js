import Layout from '../../components/layout';
import Head from 'next/head';

import Date from '../../components/date';

import utilStyles from '../../styles/utils.module.css';

import { getAllPostSlugs, getPostData } from '../../lib/posts';

export default function Post({ postData }){
    return (
        
        <Layout>
            {/* Add the head tag */}
            <Head>
                <title>
                    { postData.title }
                </title>
            </Head>

            <article>
                <h1 className={utilStyles.headingXl}>
                    { postData.title }
                </h1>

                <div className={utilStyles.lightText}>
                    <Date dateString={ postData.date } />
                </div>

                {/* { postData.contentHtml } */}
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    )
}

export async function getStaticPaths(){
    
    // Return a list of possible value for id
    const paths = getAllPostSlugs();

    return {
        paths,
        fallback: false
    }

}

export async function getStaticProps({ params }){
    //Fetch necessary data for the blog post using params.id
    const postData = await getPostData(params.slug);

    return {
        props: {
            postData
        }
    }
}
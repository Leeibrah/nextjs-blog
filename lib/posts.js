import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'data-content');

export function getSortedPostsData() {
    // Fetch data from the file system
    //Get file names under posts
    const fileNames = fs.readdirSync(postsDirectory); 

    const allPostsData = fileNames.map(fileName => {
        //Remove ".md extension" from the file name to get id
        const slug = fileName.replace(/\.md$/, '');

        //Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        //Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        //Combine the data with the slug
        return {
            slug,
            ...matterResult.data
        }
    });

    //Sort posts by date
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if(a < b){
            return 1;
        }else if(a > b){
            return -1;
        }else{
            return 0;
        }
    });

    //Fetching data from an API
    // const res = await fetch('..');
    // return res.json;
}

export async function getAllPostFromAPI(){

    //Fetch post data from an external API endpoint
    const res = await fetch('..');
    const posts = await res.json();

    return posts.map(post => {
        return {
            params: {
                slug: post.slug
            }
        }
    })
}

export function getAllPostSlugs(){
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map(fileName => {
        return {
            params: {
                slug: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export async function getPostData(slug){

    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    //Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    //Use remark to convert markdonw into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

    const contentHtml = processedContent.toString();

    // Combine the data with the slug
    return {
        slug,
        contentHtml,
        ...matterResult.data
    }
}
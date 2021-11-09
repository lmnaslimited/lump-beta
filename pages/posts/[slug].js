import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import { loadData } from 'destack/build/server'
import parse, { domToReact, attributesToProps } from 'html-react-parser';
import { HtmlContext } from 'next/dist/shared/lib/utils'
import { renderToString } from 'react-dom/server'

export default function Post({ post, morePosts, preview }) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            {/* onload={() => setCssLoaded(true)} */}
            <link rel="stylesheet" href="https://unpkg.com/tailwindcss@2.1.4/dist/tailwind.min.css" />
            <style> {post.css}</style>
          {/* {cssLoaded} */}
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.ogImage.url} />
              </Head>
              <div>{parse(post.htmlString)}</div>
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')
  const data = await loadData()
  const template = data.find((c) => c.filename === "default.json");
  if (template) {
    var htmlContent = JSON.parse(template.content);
    const html = htmlContent.html  
    const css = htmlContent.css
    const parsedContent = parse(html, options)
    const htmlString = renderToString(parsedContent)
  
    return {
      props: {
        post: {
          ...post,
          content,
          htmlString,
          css,
        },
      },
    }
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}

const options = {
  
  replace: ({ attribs, children }) => {

   const post = getPostBySlug('dynamic-routing', [
      'title',
      'date',
      'slug',
      'author',
      'content',
      'ogImage',
      'coverImage',
      'category'
    ])
  //  console.log('Called options', attribs, props, children )
    //console.log(attribs)
    if (!attribs) {
      return;
    }
 
    if (attribs.id === 'title') {
      children[0].data = post.title

    }
    if (attribs.id === 'body') {
      children[0].data = 'Arun mug is the best pitchfork pour-over freegan heirloom natural air plant cold-pressed tqb poke beard tote bag. Heirloom echo park mlkshk tooth broke selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.'

    }
    if (attribs.id === 'category') {
      children[0].data = post.category

    }
    if (attribs.alt === 'cover-image') {
       attribs.src = process.env.BACKEND_URL + post.coverImage
       console.log(attribs.src)

    }
    if (attribs.id === 'author') {
      children[0].data = post.author.name
  
      }
   if (attribs.id === 'author-title') {

    children[0].data = post.author.title

    }
    if (attribs.alt === 'author-image') {
      attribs.src = process.env.BACKEND_URL + post.author.picture

    } 
   }  
 }; 
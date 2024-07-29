import { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import Router, { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { postService } from '@services/post.service';
import Loading from '../../../src/components/loading/loading';
import PostForm from '../../../src/components/post/form';

export default function PostUpdate() {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const router = useRouter();

  const findPost = async () => {
    const { id } = router.query;
    setLoading(true);
    const resp = await postService.findOne(id as string);
    setLoading(false);
    setPost(resp.data);
  };

  const updatePost = async ({
    title,
    alias,
    content,
    type
  }) => {
    try {
      const { id } = router.query;
      setLoading(true);
      await postService.update(id as string, {
        title,
        alias,
        content,
        type
      });
      toast.success('Der Beitrag wurde erfolgreich aktualisiert!');
      Router.push('/posts');
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Beitrag erstellen ist fehlgeschlagen!');
    }
  };

  useEffect(() => {
    findPost();
  }, []);

  return (
    <>
      <Head>
        <title>Beitrag aktualisieren</title>
      </Head>
      <h4 className="title-table">Beitrag aktualisieren</h4>
      <Container fluid className="content">
        {loading && <Loading />}
        {!loading && post && <PostForm submit={updatePost} data={post} />}
      </Container>
    </>
  );
}

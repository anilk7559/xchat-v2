import * as React from 'react';
import { Container } from 'reactstrap';
import Router from 'next/router';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { postService } from '@services/post.service';
import PostForm from '../../src/components/post/form';

export default function PostCreate() {
  const savePost = async (data) => {
    try {
      await postService.create(data);
      toast.success('Der Beitrag wurde erfolgreich erstellt!');
      Router.push('/posts');
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Beitrag erstellen ist fehlgeschlagen!');
    }
  };

  return (
    <>
      <Head>
        <title>Beitrag erstellen </title>
      </Head>
      <h4 className="title-table">
      Beitragsverwaltung
      </h4>
      <Container fluid className="content">
        <PostForm submit={savePost} />
      </Container>
    </>
  );
}

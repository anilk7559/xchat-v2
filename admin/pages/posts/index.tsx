import { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import { postService } from '@services/post.service';
import { formatDate } from '@lib/utils';
import Link from 'next/link';
import Head from 'next/head';

function PostListing() {
  const [postsData, setPostsData] = useState({
    items: [],
    count: 0
  });

  const loadPosts = async () => {
    const resp = await postService.find();
    setPostsData(resp.data);
  };

  const deletePost = async (id) => {
    await postService.remove(id);
    await loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      <Head>
        <title>Posts listing</title>
      </Head>
      <Table responsive striped borderless>
        <thead>
          <tr>
            <th>
              <a>Titel</a>
            </th>
            <th>
              <a>Erstellen auf</a>
            </th>
            <th>
              <a>Letzte Aktualisierung am</a>
            </th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {postsData.items.map((post) => (
            <tr>
              <td>{post.title}</td>
              <td>{formatDate(post.createdAt)}</td>
              <td>{formatDate(post.updatedAt)}</td>
              <td>
                <Link href="/posts/[id]/update" as={`/posts/${post._id}/update`}>
                  <i className="fa fa-pencil-alt" />
                </Link>
                  &nbsp;
                <a
                  href="#"
                  onClick={() => {
                    if (window.confirm('Are you sure?')) {
                      deletePost(post._id);
                    }
                  }}
                >
                  <i className="fa fa-trash" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default PostListing;

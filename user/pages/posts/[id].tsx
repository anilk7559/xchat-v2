import PostContent from '@components/post/content';
import SeoMetaHead from '@components/seo-meta-head';
import { redirect } from '@lib/utils';
import { postService } from '@services/post.service';
import BlankWithFooterLayout from 'src/components/layouts/blank-with-footer';

type IProps = {
  post: any;
};

function PostDetail({
  post
}: IProps) {
  return (
    <>
      <SeoMetaHead item={post} />
      <PostContent post={post} />
    </>
  );
}

PostDetail.Layout = BlankWithFooterLayout;

PostDetail.getInitialProps = async (ctx) => {
  try {
    const { id } = ctx.query;
    const post = await postService.findOne(id);
    const {
      _id, title, alias, content, createdAt, updatedAt
    } = post.data;
    return {
      post: {
        _id, title, alias, content, createdAt, updatedAt
      }
    };
  } catch (e) {
    return redirect('/404');
  }
};

export default PostDetail;

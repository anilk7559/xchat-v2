/* eslint-disable react/no-danger */
export function PostContent({
  post
}: any) {
  return (
    <div className="page-container">
      <h1 className="text-center">{post.title}</h1>
      <div className="p-3" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

export default PostContent;

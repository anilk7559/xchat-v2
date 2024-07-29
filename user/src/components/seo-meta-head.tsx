import { truncate } from 'lodash';
import Head from 'next/head';

export interface ISeoMetaHeadProps {
  item?: any;
  imageUrl?: string;
  pageTitle?: string;
  keywords?: string | Array<string>;
  description?: string;
}

// const connector = connect(mapStates);

// type PropsFromRedux = ConnectedProps<typeof connector>;

function SeoMetaHead({
  item = null,
  imageUrl = '',
  pageTitle = '',
  keywords = '',
  description = ''
}: ISeoMetaHeadProps) {
  const itemTitle = item?.title || item?.name || item?.username;
  const title = pageTitle || itemTitle || '';
  let metaKeywords = keywords;
  if (Array.isArray(keywords)) metaKeywords = keywords.join(',');
  const metaDescription = truncate(description || item?.description || item?.bio || item?.name || '', {
    length: 160
  });

  return (
    <Head>
      <title>{title}</title>
      {metaKeywords && <meta name="keywords" content={metaKeywords as string} />}
      {metaDescription && <meta name="description" content={metaDescription} />}

      <meta property="og:title" content={title} key="title" />
      {imageUrl && <meta property="og:image" content={imageUrl || ''} />}
      <meta property="og:keywords" content={metaKeywords as string} />
      <meta property="og:description" content={metaDescription} />
      <meta name="twitter:title" content={title} />
      {imageUrl && <meta name="twitter:image" content={imageUrl || ''} />}
      <meta name="twitter:description" content={metaDescription} />
    </Head>
  );
}

export default SeoMetaHead;

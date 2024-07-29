import { truncate } from 'lodash';
import Head from 'next/head';

export interface IPageTitleProps {
  title: string;
}

function PageTitle({
  title
}: IPageTitleProps) {
  const itemTitle = truncate(title);

  return (
    <Head>
      <title>{itemTitle}</title>
    </Head>
  );
}

export default PageTitle;

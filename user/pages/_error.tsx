import Error from 'next/error';

import BlankWithFooterLayout from '../src/components/layouts/blank-with-footer';

function ErrorPage({ statusCode }: any) {
  return <Error statusCode={statusCode || 404} />;
}

const Wrapper = ErrorPage as any;
Wrapper.Layout = BlankWithFooterLayout;
export default Wrapper;

import Document, {
  Html, Head, Main, NextScript
} from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossOrigin="anonymous" />
        </Head>
        <body className="sidebar-mini layout-fixed layout-navbar-fixed layout-footer-fixed">
          <Main />
          <NextScript />
          <script src="/js/jquery/jquery.js" />
          <script src="/js/adminlte.js" />
        </body>
      </Html>
    );
  }
}

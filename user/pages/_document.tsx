import parse from 'html-react-parser';
import getConfig from 'next/config';
import Document, {
  Head, Html, Main, NextScript
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    try {
      const { publicRuntimeConfig } = getConfig();
      const resp = await fetch(`${publicRuntimeConfig.NEXT_PUBLIC_API_ENDPOINT}/system/configs/keys`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keys: ['headerScript'] })
      });
      const meta = await resp.json();
      return {
        ...initialProps,
        headerScript: meta.data.headerScript
      };
    } catch (e) {
      return initialProps;
    }
  }

  render() {
    const { headerScript } = this.props as any;
    return (
      <Html>
        <Head>
          {headerScript && parse(headerScript)}
        </Head>
        <body className="chats-tab-open">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

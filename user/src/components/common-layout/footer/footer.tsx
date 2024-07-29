/* eslint-disable react/no-danger */
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

import { systemService } from '@services/system.service';
import { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

const mapStates = (state) => ({
  menu: state.system.menu
});

const connector = connect(mapStates);

type PropsFromRedux = ConnectedProps<typeof connector>;

function Footer({
  menu
}: PropsFromRedux) {
  const [footerContent, setFooterContent] = useState(null);
  const footerMenus = menu?.footer || [];

  const loadFooter = async () => {
    const resp = await systemService.getConfigByKeys(['footerContent', 'footerScript']);
    setFooterContent(resp.data);
  };

  useEffect(() => {
    loadFooter();
  }, []);

  const renderMenus = () => {
    if (!footerMenus.length) return null;
    return (
      <ul>
        {footerMenus.map((item) => (
          <li className="mx-3 pointer" key={item._id}>
            <a target={item.openNewTab ? '_blank' : ''} href={item.path} rel="noreferrer">{item.title}</a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <footer className="footer">
      {renderMenus()}
      {footerContent?.footerContent && <div className="sun-editor-editable" dangerouslySetInnerHTML={{ __html: footerContent.footerContent }} />}
      {footerContent?.footerScript && <div dangerouslySetInnerHTML={{ __html: footerContent.footerScript }} />}
    </footer>
  );
}

export default connector(Footer);

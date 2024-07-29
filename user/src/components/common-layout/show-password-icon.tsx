import { useEffect, useState } from 'react';

interface IProps {
  handleClick: Function;
  showPw: boolean;
  error: any;
}

function ShowPasswordIcon({ handleClick, showPw, error }: IProps) {
  const [iconClassName, setIconClassName] = useState('fa fa-fw fa-eye toggle-password field-icon visible');
  useEffect(() => {
    let className = 'fa fa-fw fa-eye toggle-password field-icon visible';
    if (error) {
      className = className.replace('visible', 'invisible');
    } else {
      className = className.replace('invisible', 'visible');
    }
    if (!showPw) {
      className = className.replace('fa-eye-slash', 'fa-eye');
    } else {
      className = className.replace('fa-eye', 'fa-eye-slash');
    }

    return setIconClassName(className);
  }, [showPw, error]);
  return (
    <a onClick={() => handleClick(!showPw)}>
      <i className={iconClassName} />
    </a>
  );
}

export default ShowPasswordIcon;

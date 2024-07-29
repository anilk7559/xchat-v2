import {
  FunctionComponent, ReactNode, useEffect, useState
} from 'react';

interface IProps {
  icon: string;
  name: string;
  active: boolean;
  onActive?: Function;
  children?: ReactNode;
}

const NavDropDown: FunctionComponent<IProps> = ({
  icon,
  name,
  active,
  onActive = () => {},
  children = null
}) => {
  const [className, setClassname] = useState('nav-item nav-dropdown');
  const [activeClass, setActiveClass] = useState(false);

  useEffect(() => {
    if (active) {
      setClassname('nav-item nav-dropdown open');
      setActiveClass(true);
    } else {
      setClassname('nav-item nav-dropdown');
      setActiveClass(false);
    }
  }, [active]);

  const handleClick = (e: any) => {
    e.preventDefault();
    if (activeClass) {
      setClassname('nav-item nav-dropdown');
      setActiveClass(false);
      onActive && onActive({
        active: false,
        name
      });
    } else {
      setClassname('nav-item nav-dropdown open');
      setActiveClass(true);
      onActive && onActive({
        active: true,
        name
      });
    }
  };

  return (
    <li className={className}>
      <a className="nav-link nav-dropdown-toggle" href="#" onClick={handleClick.bind(this)}>
        <i className={icon} />
        {' '}
        {name}
      </a>
      <ul className="nav-dropdown-items">
        {children}
      </ul>
    </li>
  );
};
export default NavDropDown;

import { Nav } from 'reactstrap';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { settingService } from '@services/index';
import { FunctionComponent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Sidebar: FunctionComponent = () => {
  const router = useRouter();
  const [path, setPath] = useState('');
  const [logo, setLogo] = useState('');

  const loadLogo = () => {
    settingService
      .getPublicConfig()
      .then((resp) => setLogo(resp.data?.siteLogo))
      .catch(() => toast.error('Etwas ist schief gelaufen. Bitte überprüfen Sie es und versuchen Sie es erneut!'));
  };

  const menuItems = [
    {
      path: '/',
      title: 'Armaturenbrett',
      id: 'dashboard',
      icon: 'fa-chart-line'
    },
    {
      title: 'Benutzer',
      id: 'users',
      icon: 'fa-users',
      children: [
        {
          path: '/users/listing',
          title: 'Benutzerliste',
          id: 'user-listing',
          icon: 'fa-list fa-sm m1'
        },
        {
          path: '/users/create',
          title: 'Benutzer erstellen',
          id: 'user-create',
          icon: 'fa-plus fa-sm m1'
        }
      ]
    },
    {
      title: 'Beiträge',
      id: 'posts',
      icon: 'fa-font',
      children: [
        {
          path: '/posts',
          title: 'Auflistung der Beiträge',
          id: 'post-listing',
          icon: 'fa-list fa-sm m1'
        },
        {
          path: '/posts/create',
          title: 'Beitrag erstellen',
          id: 'post-create',
          icon: 'fa-plus fa-sm m1'
        }
      ]
    },

    {
      title: 'Token-Pakete',
      id: 'packages',
      icon: 'fa-dollar-sign',
      children: [
        {
          path: '/packages/listing',
          title: 'Paketliste',
          id: 'package-listing',
          icon: 'fa-list fa-sm m1'
        },
        {
          path: '/packages/create',
          title: 'Paket erstellen',
          id: 'package-create',
          icon: 'fa-plus fa-sm m1'
        }
      ]
    },
    {
      title: 'Medieninhalt',
      id: 'sell-items',
      icon: 'fa-camera',
      children: [
        {
          path: '/sell-items/listing?type=video',
          title: 'Videos',
          id: 'video-listing',
          icon: 'fa-video fa-sm m1'
        },
        {
          path: '/sell-items/listing?type=photo',
          title: 'Fotos',
          id: 'photo-listing',
          icon: 'fa-image fa-sm m1'
        }
      ]
    },
    {
      path: '/messages/listing',
      title: 'Mitteilungen',
      id: 'messages',
      icon: 'fa-envelope'
    },
    {
      path: '/payments/listing',
      title: 'Zahlungsverkehr',
      id: 'payments',
      icon: 'fa-dollar-sign'
    },
    {
      path: '/payouts/listing',
      title: 'Auszahlung',
      id: 'payouts',
      icon: 'fa-dollar-sign'
    },
    {
      path: '/earnings/listing',
      title: 'Verdienen',
      id: 'earnings',
      icon: 'fa-dollar-sign'
    },
    {
      title: 'System config',
      id: 'Systemkonfiguration',
      icon: 'fa-tools',
      children: [
        {
          path: '/settings',
          title: 'Systemeinstellungen',
          id: 'system-setting',
          icon: 'fa-cog fa-sm m1'
        },
        {
          path: '/settings/menus/listing',
          title: 'FE-Menüs',
          id: 'fe-menu-listing',
          icon: 'fa-image fa-sm m1'
        },
        {
          path: '/settings/menus/create',
          title: 'FE-Menü erstellen',
          id: 'fe-menu-create',
          icon: 'fa-image fa-sm m1'
        }
      ]
    },
    {
      path: '/automessages/autotexts',
      title: 'Auto Message',
      id: 'payouts',
      icon: 'fa-dollar-sign'
    },
  ];

  const handleRouterChange = () => {
    router.events.on('routeChangeComplete', (newPath) => {
      setPath(newPath);
    });
  };

  const renderMenuItems = (menus) => {
    if (!menus.length) return null;

    return menus.map((menu) => {
      if (!menu.children) {
        return (
          <li className="nav-item" key={menu.id}>
            <Link legacyBehavior href={menu.path}>
              <a
                className={`nav-link ${path === menu.path ? 'active' : ''}`}
              >
                <i className={`nav-icon fas fa ${menu.icon || ''}`} />
                <p>{menu.title}</p>
              </a>
            </Link>
          </li>
        );
      }

      // open all
      const openMenu = true; // path.includes(menu.id);
      return (
        <li className={`nav-item ${openMenu ? 'nav-item menu-is-opening menu-open' : ''}`} key={menu.id}>
          <a href="#" className="nav-link ">
            <i className={`nav-icon fa ${menu.icon || ''}`} />
            <p>
              {menu.title}
              <i className="right fas fa-angle-left" />
            </p>
          </a>

          <ul className="nav nav-treeview">
            {renderMenuItems(menu.children)}
          </ul>
        </li>
      );
    });
  };

  useEffect(() => {
    setPath(router.pathname);
    handleRouterChange();
    loadLogo();
  }, []);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Nav className="d-md-down-none" navbar>
        <a href="#" className="navbar-header">
          {logo ? <img src={logo} height="50" alt="" /> : 'Admin panel'}
        </a>
      </Nav>

      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {renderMenuItems(menuItems)}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

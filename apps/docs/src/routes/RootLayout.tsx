import {Link, NavLink, Outlet} from 'react-router';
import {docsRegistry} from '../generated/docsRegistry';

export function RootLayout() {
  const firstTopic = docsRegistry[0];

  return (
    <div className="site">
      <header className="site-header">
        <Link to="/">
          <h1 className="site-title">Tecton</h1>
        </Link>
        <nav className="site-nav" aria-label="Main">
          {firstTopic ? (
            <NavLink to={`/docs/${firstTopic.name}`}>Docs</NavLink>
          ) : null}
          <NavLink to="/components">Components</NavLink>
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        Tecton design system — documentation preview.
      </footer>
    </div>
  );
}

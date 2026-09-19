import {Link} from 'react-router';

export function NotFound() {
  return (
    <section>
      <h2>Not found</h2>
      <p className="prose">
        That page does not exist. <Link to="/">Back to the start</Link>.
      </p>
    </section>
  );
}

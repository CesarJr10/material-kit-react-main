import { Helmet } from 'react-helmet-async';

import { RouteView } from 'src/sections/route/view';

// ----------------------------------------------------------------------

export default function RoutePage() {
  return (
    <>
      <Helmet>
        <title> Routes </title>
      </Helmet>

      <RouteView />
    </>
  );
}

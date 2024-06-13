import { Helmet } from 'react-helmet-async';

import { MarkerView } from 'src/sections/marker/view';

// ----------------------------------------------------------------------

export default function MarkerPage() {
  return (
    <>
      <Helmet>
        <title> Markers </title>
      </Helmet>

      <MarkerView />
    </>
  );
}

import { MarksGallery } from '../../example/MarksGallery';
import { Lead, PageTitle } from '../CodeSample';

export function Marks() {
  return (
    <div>
      <PageTitle>Marks</PageTitle>
      <Lead>
        Every mark at a sensible height, with a static and a hoverable usage and the code for
        each. Colours follow the playground controls in the sidebar.
      </Lead>
      <MarksGallery />
    </div>
  );
}

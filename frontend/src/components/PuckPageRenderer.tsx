/**
 * Backwards-compatible shim — all pages that previously used PuckPageRenderer
 * now get the PagePlaceholder "coming soon" UI instead.
 * This file is intentionally kept so the existing page imports don't need updating.
 */
import PagePlaceholder from './PagePlaceholder';

interface Props {
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultLayout?: any;
}

export default function PuckPageRenderer({ title = 'Page' }: Props) {
  return <PagePlaceholder title={title} />;
}

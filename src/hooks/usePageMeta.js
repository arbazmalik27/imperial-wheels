import { useEffect } from 'react';

const SITE_NAME = 'Imperial Wheels';

/**
 * Sets document.title (and optionally the meta description) for the
 * current page, restoring the previous title on unmount. Deliberately
 * tiny — a full head-management library is unnecessary for a handful of
 * static per-route titles.
 *
 * @param {string} title Page title, shown as "<title> | Imperial Wheels".
 *   Pass the full string yourself (no suffix added) if you need something
 *   custom, e.g. for the site's own root title.
 * @param {string} [description] Optional meta description for this page.
 */
export const usePageMeta = (title, description) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let previousDescription;
    let metaTag;
    if (description) {
      metaTag = document.querySelector('meta[name="description"]');
      if (metaTag) {
        previousDescription = metaTag.getAttribute('content');
        metaTag.setAttribute('content', description);
      }
    }

    return () => {
      document.title = previousTitle;
      if (metaTag && previousDescription !== undefined) {
        metaTag.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
};

export { SITE_NAME };
export default usePageMeta;

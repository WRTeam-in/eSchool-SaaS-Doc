import React, {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import Details from '@theme-original/Details';
import {useLocation} from '@docusaurus/router';
import styles from './styles.module.css';

/**
 * Wraps the default Docusaurus <Details> (used for every <details> in MDX).
 *
 * Any <details> that has an `id` becomes a shareable, deep-linkable block:
 *  - visiting `page/#<id>` expands it and scrolls it into view;
 *  - a prominent "Share" / "Copy Link" button is displayed on the right side of the summary;
 *  - clicking the button copies the direct link and updates the browser URL hash.
 */

function getHashId(hash) {
  if (!hash) {
    return null;
  }
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function LinkIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CopyLinkButton({id}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async (event) => {
    // Keep the click from toggling the surrounding <details>.
    event.preventDefault();
    event.stopPropagation();

    const {origin, pathname, search} = window.location;
    const url = `${origin}${pathname}${search}#${encodeURIComponent(id)}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch {
      // Safe non-blocking fallback
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {
        console.warn('Could not copy text to clipboard:', err);
      }
    }

    // Update browser URL address bar with the current hash
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `#${encodeURIComponent(id)}`);
    }

    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      className={clsx(styles.copyLink, copied && styles.copyLinkCopied)}
      onClick={onClick}
      aria-label="Copy direct link to this FAQ"
      title={copied ? 'Link copied to clipboard!' : 'Copy direct link to this FAQ'}>
      {copied ? <CheckIcon /> : <LinkIcon />}
      <span className={styles.copiedText}>{copied ? 'Copied!' : 'Share'}</span>
    </button>
  );
}

export default function DetailsWrapper(props) {
  const {id, summary} = props;
  const {hash: routerHash} = useLocation();

  // Listen to both Docusaurus router hash and native window hash changes
  const [currentHash, setCurrentHash] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash || '';
    }
    return routerHash || '';
  });

  useEffect(() => {
    setCurrentHash(window.location.hash || routerHash || '');

    const onHashChange = () => {
      setCurrentHash(window.location.hash || '');
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
    };
  }, [routerHash]);

  const isTarget = Boolean(id) && getHashId(currentHash) === id;

  // Remount key to control open state when target changes
  const [openToken, setOpenToken] = useState(0);

  useEffect(() => {
    if (isTarget) {
      setOpenToken((token) => token + 1);
    }
  }, [isTarget]);

  // Scroll to targeted FAQ once rendered and open
  useEffect(() => {
    if (isTarget) {
      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      };

      // Timeouts to ensure DOM layout and collapsible expansion have stabilized
      const timer1 = setTimeout(scrollToElement, 80);
      const timer2 = setTimeout(scrollToElement, 250);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isTarget, openToken, id]);

  const summaryWithButton = React.isValidElement(summary)
    ? React.cloneElement(
        summary,
        undefined,
        ...React.Children.toArray(summary.props.children),
        id ? <CopyLinkButton key="copy-link" id={id} /> : null,
      )
    : (
      <summary>
        <span>{summary ?? 'Details'}</span>
        {id ? <CopyLinkButton key="copy-link" id={id} /> : null}
      </summary>
    );

  return (
    <Details
      key={openToken}
      {...props}
      summary={summaryWithButton}
      open={openToken > 0 ? true : props.open}
      className={clsx(
        props.className,
        id && styles.anchored,
        isTarget && styles.anchoredTarget,
      )}
    />
  );
}

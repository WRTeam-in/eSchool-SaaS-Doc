import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { formatTime, getSection, isPublished } from '@site/src/data/tutorials';
import styles from './Tutorials.module.css';

export default function TutorialCard({ tutorial }) {
  const section = getSection(tutorial.section);
  const poster = useBaseUrl(tutorial.poster || '/images/logo/transparent_logo.svg');

  if (!isPublished(tutorial)) {
    return (
      <div className={clsx(styles.card, styles.cardSoon)} aria-disabled="true">
        <div className={clsx(styles.thumb, styles.thumbSoon)}>
          <i className={clsx(section?.icon, styles.soonIcon)} aria-hidden="true" />
          <span className={styles.soonBadge}>Coming soon</span>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.tag}>{section?.title}</span>
          <h3 className={styles.cardTitle}>{tutorial.title}</h3>
          <p className={styles.cardText}>{tutorial.summary}</p>
        </div>
      </div>
    );
  }

  return (
    <Link to={tutorial.page} className={styles.card}>
      <div className={styles.thumb}>
        <img src={poster} alt="" loading="lazy" />
        <span className={styles.playBadge} aria-hidden="true"><i className="fa-solid fa-play" /></span>
        <span className={styles.duration}>{formatTime(tutorial.duration)}</span>
      </div>
      <div className={styles.cardBody}>
        <span className={styles.tag}>{section?.title}</span>
        <h3 className={styles.cardTitle}>{tutorial.title}</h3>
        <p className={styles.cardText}>{tutorial.summary}</p>
        <div className={styles.cardMeta}>
          <span><i className="fa-solid fa-list-ol" aria-hidden="true" /> {tutorial.chapters?.length || 0} chapters</span>
          <span className={styles.watch}>Watch <i className="fa-solid fa-arrow-right" aria-hidden="true" /></span>
        </div>
      </div>
    </Link>
  );
}

import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { SECTIONS, TUTORIALS, formatTime, isPublished } from '@site/src/data/tutorials';
import TutorialCard from './TutorialCard';
import styles from './Tutorials.module.css';

function matches(t, query) {
  if (!query) return true;
  const haystack = [t.title, t.summary, ...(t.chapters || []).map((c) => c.label)].join(' ').toLowerCase();
  return query.split(/\s+/).every((word) => haystack.includes(word));
}

export default function TutorialLibrary() {
  const [query, setQuery] = useState('');
  const [section, setSection] = useState('all');
  const featured = TUTORIALS.find((t) => t.featured && isPublished(t));
  const published = TUTORIALS.filter(isPublished);
  const totalMinutes = Math.max(1, Math.round(published.reduce((sum, t) => sum + (t.duration || 0), 0) / 60));
  const featuredVideo = useBaseUrl(featured?.video || '/');
  const featuredPoster = useBaseUrl(featured?.poster || '/');

  const q = query.trim().toLowerCase();
  const groups = useMemo(
    () =>
      SECTIONS.filter((s) => section === 'all' || s.id === section)
        .map((s) => ({ ...s, items: TUTORIALS.filter((t) => t.section === s.id && matches(t, q)) }))
        .filter((s) => s.items.length > 0),
    [section, q],
  );
  const sectionsWithItems = SECTIONS.filter((s) => TUTORIALS.some((t) => t.section === s.id));

  return (
    <div className={styles.library}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Video tutorials</span>
          <h1 className={styles.heroTitle}>Learn eSchool SaaS, step by step</h1>
          <p className={styles.heroLead}>
            Short videos that show you exactly how each feature works. Every step has clear on-screen subtitles, so you can follow along without sound.
          </p>
          <ul className={styles.heroStats}>
            <li><strong>{published.length}</strong> tutorials</li>
            <li><strong>{totalMinutes}</strong> min of video</li>
            <li><i className="fa-solid fa-closed-captioning" aria-hidden="true" /> Subtitled</li>
          </ul>
          {featured && (
            <Link className={styles.heroCta} to={featured.page}>
              <i className="fa-solid fa-circle-play" aria-hidden="true" /> Start with the {featured.title.toLowerCase()}
            </Link>
          )}
        </div>
        {featured && (
          <div className={styles.heroMedia}>
            <video className={styles.heroVideo} controls preload="none" playsInline poster={featuredPoster}>
              <source src={featuredVideo} type="video/mp4" />
            </video>
            <span className={styles.heroMediaCaption}>{featured.title} · {formatTime(featured.duration)}</span>
          </div>
        )}
      </header>

      <div className={styles.toolbar} role="search">
        <label className={styles.search}>
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search tutorials, e.g. transaction chart"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search tutorials"
          />
        </label>
        <div className={styles.chips} role="tablist" aria-label="Filter by panel">
          {[{ id: 'all', title: 'All' }, ...sectionsWithItems].map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={section === s.id}
              className={clsx(styles.chip, section === s.id && styles.chipActive)}
              onClick={() => setSection(s.id)}>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {groups.map((s) => (
        <section key={s.id} className={styles.group} aria-labelledby={`tutorials-${s.id}`}>
          <div className={styles.groupHead}>
            <span className={styles.groupIcon}><i className={s.icon} aria-hidden="true" /></span>
            <div>
              <h2 id={`tutorials-${s.id}`} className={styles.groupTitle}>{s.title}</h2>
              <p className={styles.groupText}>{s.description}</p>
            </div>
          </div>
          <div className={styles.grid}>
            {s.items.map((t) => <TutorialCard key={t.id} tutorial={t} />)}
          </div>
        </section>
      ))}

      {groups.length === 0 && (
        <div className={styles.empty}>
          <i className="fa-regular fa-face-meh" aria-hidden="true" />
          <p>No tutorials match “{query}”. Try another word, or <button type="button" onClick={() => { setQuery(''); setSection('all'); }}>show all tutorials</button>.</p>
        </div>
      )}
    </div>
  );
}

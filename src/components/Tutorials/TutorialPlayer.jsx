import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { formatTime, getSection, getTutorial } from '@site/src/data/tutorials';
import styles from './Tutorials.module.css';

export default function TutorialPlayer({ id }) {
  const tutorial = getTutorial(id);
  const videoRef = useRef(null);
  const listRef = useRef(null);
  const [now, setNow] = useState(0);
  const video = useBaseUrl(tutorial?.video || '/');
  const poster = useBaseUrl(tutorial?.poster || '/');

  // A link such as /tutorials/<page>/?t=260 starts the video at that second (used to link to one chapter).
  useEffect(() => {
    const v = videoRef.current;
    const t = Number(new URLSearchParams(window.location.search).get('t'));
    if (!v || !(t > 0)) return undefined;
    const start = () => { v.currentTime = t; setNow(t); };
    if (v.readyState >= 1) start(); else v.addEventListener('loadedmetadata', start, { once: true });
    v.preload = 'auto';
    v.closest('div')?.scrollIntoView({ block: 'center' });
    return () => v.removeEventListener('loadedmetadata', start);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const onTime = () => setNow(v.currentTime);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('seeked', onTime);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('seeked', onTime);
    };
  }, []);

  const activeIndex = (tutorial?.chapters || []).reduce((current, c, i) => (now + 0.3 >= c.t ? i : current), -1);
  useEffect(() => {
    const list = listRef.current;
    const item = list && activeIndex >= 0 ? list.children[activeIndex] : null;
    if (!item) return;
    const top = item.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop, bottom = top + item.offsetHeight;
    if (top < list.scrollTop) list.scrollTo({ top, behavior: 'smooth' });
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTo({ top: bottom - list.clientHeight, behavior: 'smooth' });
  }, [activeIndex]);

  if (!tutorial) {
    return <div className={styles.missing}>Tutorial “{id}” is not in src/data/tutorials.</div>;
  }

  const chapters = tutorial.chapters || [];
  const active = chapters.reduce((current, c, i) => (now + 0.3 >= c.t ? i : current), -1);
  const section = getSection(tutorial.section);

  const seek = (t) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = t;
    v.play().catch(() => {});
  };

  return (
    <div className={styles.playerWrap}>
      <div className={styles.player}>
        <div className={styles.playerMain}>
          <div className={styles.videoFrame}>
            <video ref={videoRef} controls preload="metadata" playsInline poster={poster}>
              <source src={video} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}><i className="fa-regular fa-clock" aria-hidden="true" /> {formatTime(tutorial.duration)}</span>
            {section && <span className={styles.metaItem}><i className={section.icon} aria-hidden="true" /> {section.title}</span>}
            <span className={styles.metaItem}>
              <i className="fa-solid fa-closed-captioning" aria-hidden="true" />
              {tutorial.hasMusic ? ' On-screen text with background music' : ' Silent, with on-screen subtitles'}
            </span>
            {tutorial.docs && (
              <Link className={styles.docsLink} to={tutorial.docs}>
                Read the written guide <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        {chapters.length > 0 && (
          <aside className={styles.chapters} aria-label="Chapters">
            <div className={styles.chaptersHead}>
              <span>Chapters</span>
              <span className={styles.chaptersCount}>{chapters.length}</span>
            </div>
            <ol className={styles.chapterList} ref={listRef}>
              {chapters.map((c, i) => (
                <li key={c.t}>
                  <button
                    type="button"
                    className={clsx(styles.chapter, i === active && styles.chapterActive)}
                    aria-current={i === active ? 'step' : undefined}
                    onClick={() => seek(c.t)}>
                    <span className={styles.chapterTime}>{formatTime(c.t)}</span>
                    <span className={styles.chapterLabel}>{c.label}</span>
                    <i className="fa-solid fa-play" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </div>

      {tutorial.learn?.length > 0 && (
        <div className={styles.learn}>
          <h2 className={styles.learnTitle}>What you’ll learn</h2>
          <ul>
            {tutorial.learn.map((item) => (
              <li key={item}><i className="fa-solid fa-circle-check" aria-hidden="true" /> {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

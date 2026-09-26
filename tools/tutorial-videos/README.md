# Tutorial videos

This tool records the step-by-step feature videos shown in the docs' **Tutorials** section (`/tutorials`). It signs in to an admin panel with headless Chrome and captures every UI state a tutorial needs (hover tooltips, open menus, dark mode, and so on). It then renders a 1920×1080 video with a moving camera, an animated cursor, highlights and on-screen subtitles.

The videos have no voice-over and no URLs. Every step is explained by a subtitle.

Requirements: Node 18+ and Google Chrome. On Windows or Linux, set `CHROME_PATH` to your Chrome binary. There's nothing to `npm install`: the MP4 muxer, font and icons are in `vendor/`.

## Make or update a video

```sh
# 1. Capture the UI states (screenshots + element positions -> tools/tutorial-videos/cache/, git-ignored)
export TUTORIAL_URL=https://your-dev-panel.example.com
export TUTORIAL_EMAIL=superadmin@example.com
export TUTORIAL_PASSWORD=********
node tools/tutorial-videos/captures/superadmin-dashboard.mjs

# 2. Check a few frames (-> tools/tutorial-videos/out/)
node tools/tutorial-videos/render.mjs superadmin-dashboard preview 6 40 95

# 3. Publish into the docs
node tools/tutorial-videos/render.mjs superadmin-dashboard publish
```

`publish` writes three files. The docs pick them up on the next build.

| File | Used for |
| --- | --- |
| `static/video/tutorials/<id>.mp4` | the video (H.264, constant quality, about 14 MB for 2 minutes) |
| `static/images/tutorials/<id>.jpg` | the poster on cards and the player |
| `src/data/tutorials/chapters/<id>.json` | the duration and the clickable chapter list |

Capture only ever reads from the panel. It changes nothing on the server. Inside the recording browser, `lib/tidy.mjs` hides the Laravel debug bar and shows the stock eSchool SaaS logo and name instead of the server's custom branding. It also rounds a "N.nnn Days left" display bug on the dev server to a whole number.

## Add a new tutorial

1. **Capture script:** copy `captures/superadmin-dashboard.mjs` to `captures/<id>.mjs`. Change the page it opens and the states it records. Each `snap(name)` saves `<name>.png` and `<name>.json` (element rectangles in page coordinates). If a tutorial creates data (for example "create a school"), use clearly fake details and run it against the dev server only.
2. **Story:** copy `stories/superadmin-dashboard.js` to `stories/<id>.js`. Change the intro and outro text and write the steps (see below).
3. **Publish:** run `render.mjs <id> publish`.
4. **Docs:** add an entry to `src/data/tutorials/index.js` (or change a `coming-soon` entry to published). Then add `tutorials/<section>/<page>.mdx` containing `<TutorialPlayer id="<id>" />`.

### Story steps

Each step is one subtitle. The camera, scroll and cursor move during the first second of a step.

| Field | Meaning |
| --- | --- |
| `text` | Subtitle. Keep it to one or two short sentences. The step length is worked out from its length. |
| `chapter` | Starts a new chapter: it becomes the subtitle label and appears in the docs chapter list. |
| `cam` | `'full'` or `[x, y, w, h]` in page pixels. The camera zooms to fit, up to `zoomMax` (default 2). |
| `scroll` | Page scroll position (the navbar and sidebar stay fixed, as in the real panel). |
| `state` | The captured screenshot to show (`base`, `dark`, `profile-open`, …). |
| `hl` | Spotlight rectangle. Everything else is dimmed. |
| `actions` | Cursor moves: `{ at, to: [x, y], click, state, fade, fixed }`. `state` switches the screenshot when the cursor arrives or clicks. Leave out `to` for a screen change without cursor movement. |
| `type` (in an action) | Types into a field: pass the field's `<name>_box` from the capture JSON. The field shows empty after the click and then fills in character by character with a caret. The action's `state` must be the capture taken *after* the field was filled. |
| `hide` (in an action) | Keeps a rectangle hidden until typing finishes, for example the green tick after the old password. |
| `fade` | Crossfade length for a screen change: about 0.1 s for dropdowns, 0.4–0.5 s for page changes. |
| `camFixed` / `hlFixed` / `fixed` | The target is in the fixed navbar or sidebar, so ignore scroll. |
| `dur` | Overrides the automatic step length. |

Story-level options: `previewState` picks the screen on the title card and poster. `posterAt` picks the poster time.

Two patterns that keep things natural:
- **Clicks respond instantly:** a click's result appears at the button press with a 0.15 s fade. If a step's last action is a click with no `state` and the next step has a `state` (a menu item that opens a window or page), the engine shows that next screen at the press and moves the click to the end of its step. The cursor points at the button while the subtitle is read, then clicks, and the camera follows. Check this with `node tools/tutorial-videos/lib/latency.mjs <id>`: every delay should be under 0.1 s, except picking a file (about 0.3 s).
- **Forms:** capture one state per field, taken right after filling that field in the live page (see `captures/superadmin-profile.mjs`). Every frame then shows the real UI. If a form saves data, reset it to a known starting point at the top of the capture script so re-recording gives the same video.

### Writing subtitles

- Say what the thing is, then what to do with it: "Expiring Soon lists the subscriptions that end first, so you can remind schools to renew on time."
- Use the panel's own labels (**View all**, **Search menu**), present tense, and "you".
- Never show or mention a server URL or real credentials.

## Tutorials with several phases

Some flows can't be captured in one go:
- **Manage schools** runs `create`, then waits until the school finishes setting up (about 2–3 minutes), then runs `actions` and `school`. Each run recreates the demo school, because the Academy Setup Wizard can only be completed once per school.
- The `school` phase assigns a plan (a new school has none, so its website is off), opens the Default domain URL, signs in with Login with staff, and completes the wizard.
- **Server prerequisite:** the wizard only offers what the Super Admin has added under **Settings › Academy setup**. Run `node tools/tutorial-videos/setup/academy-master-data.mjs` once per server. It adds mediums, sections, streams, classes 1–12 and 12 subjects, and skips anything that already exists.

```sh
node tools/tutorial-videos/captures/superadmin-manage-schools.mjs create
# wait until the school shows Active in Manage schools
node tools/tutorial-videos/captures/superadmin-manage-schools.mjs actions
node tools/tutorial-videos/captures/superadmin-manage-schools.mjs school
node tools/tutorial-videos/render.mjs superadmin-manage-schools publish
```

State types in a story: a plain path is a panel page (the engine keeps the navbar and sidebar fixed while scrolling). `{ src, viewport: true }` is a window-sized shot (dialogs, toasts, public pages). `{ src, plain: true }` is a full page without fixed parts (the wizard). `lib/capture-kit.mjs` records a snapshot's `viewport` flag automatically.

Docs pages can link to a moment in a video with `?t=<seconds>`, for example `/tutorials/super-admin/manage-schools/?t=300`.

## Product overview video

`static/video/tutorials/product-overview.mp4` is the one-off promo video. Its source lives outside this repo (`eSchool-SaaS-Intro-Video/source`) and was rendered with `?nourl` so it shows no web addresses.

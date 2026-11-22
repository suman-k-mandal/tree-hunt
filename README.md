# Tree Hunt

A small offline-friendly kindergarten learning app for iPad: stories, counting, letter sounds,
shapes & patterns, sorting circles and sight words, with read-aloud and levels 1–5.

Open the GitHub Pages link in Safari on the iPad, then Share → Add to Home Screen.
A grown-up can set the child's name under "For grown-ups" on the home screen; it is stored only on that device.

## Personalize from school notes (private by design)

Under "For grown-ups" on the home screen, a grown-up can add conference notes or a report card (PDF, Word .docx, text, or pasted).
The notes are read **on the device** with simple pattern matching (`personal.js`; PDFs via the bundled pdf.js in
`vendor/pdfjs`). Then they are discarded. Only the choices the grown-up confirms are saved, in the device's own storage:
letters and words to practice, a counting goal, favorite themes for custom stories, and starting levels.

The page's Content-Security-Policy (`connect-src 'self'`, `img-src 'self' data: blob:`) means the browser refuses to send anything to
any other website, so nothing can be uploaded, tracked or sent to an AI service.

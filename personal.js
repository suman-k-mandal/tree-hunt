/* =========================================================
   Tree Hunt — personalize from school notes

   Privacy design:
   - Everything runs on this device. Notes are read in memory, analyzed with simple
     pattern matching, and then discarded. They are never stored or sent anywhere.
   - Only the profile the grown-up confirms is saved (in this device's storage):
     letters to practice, words to practice, a counting goal, favorite themes, starting levels.
   - The page's Content-Security-Policy blocks network requests to any other site.
   ========================================================= */

/* ---------- favorite themes used for custom stories ---------- */
const THEMES = {
  dinosaurs: { label: 'Dinosaurs', icon: '🦕', kw: /\b(dinosaurs?|dinos?|t-?rex|triceratops)\b/i,
    hero: ['Dino', '🦕'], friend: ['T-Rex', '🦖'], thing: ['a big egg', '🥚'], place: ['the volcano', '🌋'] },
  bugs: { label: 'Bugs', icon: '🐞', kw: /\b(bugs?|insects?|ladybugs?|beetles?|caterpillars?|worms?|spiders?)\b/i,
    hero: ['Ladybug', '🐞'], friend: ['Ant', '🐜'], thing: ['a shiny leaf', '🍃'], place: ['the garden', '🌷'] },
  ocean: { label: 'Ocean', icon: '🐠', kw: /\b(ocean|sea|fish|sharks?|whales?|beach|mermaids?|octopus)\b/i,
    hero: ['Little Fish', '🐠'], friend: ['Octopus', '🐙'], thing: ['a pretty shell', '🐚'], place: ['the coral reef', '🪸'] },
  space: { label: 'Space', icon: '🚀', kw: /\b(space|rockets?|planets?|astronauts?|the moon|outer space)\b/i,
    hero: ['Astro', '🧑‍🚀'], friend: ['Robot', '🤖'], thing: ['a shooting star', '🌠'], place: ['the moon', '🌙'] },
  vehicles: { label: 'Trucks & trains', icon: '🚚', kw: /\b(trucks?|trains?|tractors?|diggers?|vehicles?|construction|race cars?)\b/i,
    hero: ['Little Truck', '🚚'], friend: ['Train', '🚂'], thing: ['a big rock', '🪨'], place: ['the farm', '🚜'] },
  pets: { label: 'Pets', icon: '🐶', kw: /\b(dogs?|pupp(y|ies)|cats?|kittens?|pets?|bunn(y|ies)|rabbits?|hamsters?)\b/i,
    hero: ['Puppy', '🐶'], friend: ['Kitten', '🐱'], thing: ['a red ball', '🔴'], place: ['the park', '🛝'] },
  horses: { label: 'Horses & farms', icon: '🐴', kw: /\b(horses?|pon(y|ies)|farm animals?|farms?)\b/i,
    hero: ['Pony', '🐴'], friend: ['Cow', '🐮'], thing: ['a shiny apple', '🍎'], place: ['the barn', '🏡'] },
  nature: { label: 'Nature', icon: '🌻', kw: /\b(nature|flowers?|gardening|plants?|outdoors|leaves|trees)\b/i,
    hero: ['Bee', '🐝'], friend: ['Butterfly', '🦋'], thing: ['a sunflower', '🌻'], place: ['the meadow', '🌼'] },
  art: { label: 'Art', icon: '🎨', kw: /\b(art|drawing|draws?|painting|paints?|colou?ring|crafts?)\b/i,
    hero: ['Bear', '🐻'], friend: ['Fox', '🦊'], thing: ['a paintbrush', '🖌️'], place: ['the art room', '🎨'] },
  music: { label: 'Music & dance', icon: '🎵', kw: /\b(music|singing|sings?|songs?|danc(e|es|ing)|instruments?)\b/i,
    hero: ['Birdie', '🐦'], friend: ['Frog', '🐸'], thing: ['a little drum', '🥁'], place: ['the stage', '🎤'] },
  sports: { label: 'Sports', icon: '⚽', kw: /\b(soccer|sports?|basketball|running|swimming|gym|ball games?)\b/i,
    hero: ['Bunny', '🐰'], friend: ['Turtle', '🐢'], thing: ['a soccer ball', '⚽'], place: ['the field', '🥅'] },
  cooking: { label: 'Cooking', icon: '🧁', kw: /\b(cooking|cooks?|baking|bakes?|kitchen)\b/i,
    hero: ['Mouse', '🐭'], friend: ['Panda', '🐼'], thing: ['a cupcake', '🧁'], place: ['the kitchen', '🍳'] },
  magic: { label: 'Magic & castles', icon: '🦄', kw: /\b(unicorns?|fair(y|ies)|magic|dragons?|castles?|princess(es)?|knights?)\b/i,
    hero: ['Unicorn', '🦄'], friend: ['Dragon', '🐉'], thing: ['a gold crown', '👑'], place: ['the castle', '🏰'] },
};
// themes distinctive enough to pick up even outside "loves/enjoys" sentences
const STRONG_THEMES = ['dinosaurs', 'space', 'ocean', 'magic', 'bugs'];

const AREAS = [
  { id: 'sounds', label: 'Letters & sounds', icon: '🔤',
    re: /\b(letters?|alphabet|phonics|phonemic|letter[- ]sounds?|initial sounds?|beginning sounds?|rhym\w*|syllables?)\b/i },
  { id: 'words', label: 'Sight words & reading', icon: '👀',
    re: /\b(sight words?|high[- ]frequency|snap words?|popcorn words?|heart words?|word wall|reading|reads)\b/i },
  { id: 'story', label: 'Listening & stories', icon: '📖',
    re: /\b(retell\w*|comprehension|stor(y|ies)|listening|recall\w*|answer(s|ing)? questions|sequenc\w*|read[- ]alouds?)\b/i },
  { id: 'count', label: 'Counting & numbers', icon: '🌰',
    re: /\b(count\w*|numbers?|numerals?|one[- ]to[- ]one|1[- ]to[- ]1|quantit(y|ies)|subitiz\w*|addition|subtract\w*|math)\b/i },
  { id: 'shapes', label: 'Shapes & patterns', icon: '🔷',
    re: /\b(shapes?|circles?|squares?|triangles?|rectangles?|hexagons?|patterns?)\b/i },
  { id: 'sort', label: 'Sorting & comparing', icon: '⭕',
    re: /\b(sort\w*|classif\w*|categor\w*|compar\w*|alike|same and different)\b/i },
];
const NEED_RE = /\b(working on|works on|work on|needs?|needed|practi[cs]e|practi[cs]ing|review(ing)?|struggl\w*|developing|emerging|confus\w*|revers\w*|mix(es|ing)? up|not yet|beginning to|continue|continues|goals?|next steps?|support|difficult\w*|trouble|still learning|benefit|focus(ing)? on|areas? (for|of) growth|growing|except)\b/i;
const STRONG_RE = /\b(mastered|knows|consistently|confident\w*|strong|strengths?|excel\w*|excellent|independently|secure|proficient|exceeds|meets|great|wonderful|easily|accurately|fluent\w*|all \d+|all of)\b/i;
const INTEREST_RE = /\b(loves?|enjoys?|likes?|interest(s|ed)?|favou?rite|passion\w*|excited|fascinated|curious about|talks about)\b/i;

/* ---------- reading files on the device ---------- */
async function notesFromFile(file) {
  const name = (file.name || '').toLowerCase();
  if (name.endsWith('.pdf') || file.type === 'application/pdf') return pdfText(await file.arrayBuffer());
  if (name.endsWith('.docx')) return docxText(await file.arrayBuffer());
  if (name.endsWith('.doc') || name.endsWith('.pages'))
    throw new Error('This kind of file can\'t be read here. Save it as a PDF or Word (.docx) file, or copy and paste the text.');
  if ((file.type || '').startsWith('image/'))
    throw new Error('Photos can\'t be read yet. Please copy and paste the text, or use a PDF.');
  return file.text();
}

async function pdfText(buf) {
  const pdfjs = await import('./vendor/pdfjs/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('vendor/pdfjs/pdf.worker.min.mjs', document.baseURI).href;
  const task = pdfjs.getDocument({
    data: new Uint8Array(buf), isEvalSupported: false, disableFontFace: true, enableXfa: false,
  });
  const doc = await task.promise;
  let out = '';
  for (let i = 1; i <= Math.min(doc.numPages, 40); i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    for (const it of tc.items) out += (it.str || '') + (it.hasEOL ? '\n' : ' ');
    out += '\n';
  }
  await task.destroy();
  return out;
}

/* .docx is a zip file; read word/document.xml with the browser's built-in decompressor */
async function docxText(buf) {
  const dv = new DataView(buf);
  let e = buf.byteLength - 22;
  while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
  if (e < 0) throw new Error('That Word file looks damaged. Try saving it as a PDF.');
  const count = dv.getUint16(e + 10, true);
  let p = dv.getUint32(e + 16, true);
  for (let i = 0; i < count && dv.getUint32(p, true) === 0x02014b50; i++) {
    const method = dv.getUint16(p + 10, true), size = dv.getUint32(p + 20, true);
    const nlen = dv.getUint16(p + 28, true), xlen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
    const local = dv.getUint32(p + 42, true);
    const name = new TextDecoder().decode(new Uint8Array(buf, p + 46, nlen));
    if (name === 'word/document.xml') {
      const start = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
      const data = new Uint8Array(buf, start, size);
      let xml;
      if (method === 0) xml = new TextDecoder().decode(data);
      else if (method === 8 && 'DecompressionStream' in window)
        xml = await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
      else throw new Error('This Word file can\'t be read on this device. Try saving it as a PDF.');
      return xml.replace(/<\/w:p>/g, '\n').replace(/<w:(tab|br)\/>/g, ' ').replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
    }
    p += 46 + nlen + xlen + clen;
  }
  throw new Error('No text found in that Word file.');
}

/* ---------- finding skills in the notes (pattern matching, on device) ---------- */
function lettersIn(s) {
  const found = new Set();
  for (const m of s.matchAll(/\b([A-Z])([a-z])\b/g)) if (m[1].toLowerCase() === m[2]) found.add(m[1]);        // "Bb, Dd"
  for (const m of s.matchAll(/\b([a-zA-Z])\s*\/\s*([a-zA-Z])\b/g)) { found.add(m[1].toUpperCase()); found.add(m[2].toUpperCase()); } // "b/d"
  for (const m of s.matchAll(/["“‘']([a-zA-Z])["”’']/g)) found.add(m[1].toUpperCase());                     // "m"
  for (const m of s.matchAll(/\bletters?\s+([a-zA-Z])\b(?!')/gi)) found.add(m[1].toUpperCase());               // letter m
  let singles = [...s.matchAll(/(?:^|[\s,(:;])([a-zA-Z])(?=[\s,).;:!?]|$)/g)].map(m => m[1]);
  if (singles.length < 3) singles = singles.filter(c => c !== 'a' && c !== 'I');                                 // ignore "a" and "I" in prose
  if (singles.length >= 2) singles.forEach(c => found.add(c.toUpperCase()));
  return found;
}
function wordsIn(s) {
  const out = new Set();
  const norm = w => (w.toLowerCase() === 'i' ? 'I' : w.toLowerCase());
  for (const m of s.matchAll(/["“‘']([A-Za-z]{1,10})["”’']/g)) if (m[1].length > 1 || /^[aI]$/.test(m[1])) out.add(norm(m[1]));
  const after = s.includes(':') ? s.slice(s.indexOf(':') + 1) : '';
  after.split(/,|;|\band\b|\bor\b/).map(x => x.trim().replace(/[.!?"“”'‘’()]/g, ''))
    .filter(x => /^[A-Za-z]{1,10}$/.test(x)).forEach(x => out.add(norm(x)));
  return [...out];
}
function analyzeNotes(text) {
  const clean = String(text || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ');
  const sentences = (clean.match(/[^.!?\n]+[.!?]?/g) || []).map(s => s.trim()).filter(s => s.length > 3);
  const draft = { evidence: [], letters: new Set(), knownLetters: new Set(), words: new Set(), knownWords: new Set(),
                  countTo: null, themes: new Set(), levels: {}, hadText: sentences.length > 0 };
  const flags = {};
  // a sentence can be both ("names shapes easily, beginning to make patterns")
  const status = s => {
    const need = NEED_RE.test(s), strong = STRONG_RE.test(s);
    return need && strong ? 'mixed' : need ? 'need' : strong ? 'strong' : 'info';
  };
  const interestSentences = [];

  for (const s of sentences) {
    const st = status(s);
    const hasExcept = /\b(except|but not|other than|besides)\b/i.test(s);
    let usedFor = [];
    for (const a of AREAS) {
      if (!a.re.test(s)) continue;
      usedFor.push(a.id);
      const f = (flags[a.id] = flags[a.id] || new Set());
      if (st === 'mixed') { f.add('need'); f.add('strong'); } else f.add(st);
    }
    if (usedFor.includes('sounds')) {
      const ls = lettersIn(s);
      ls.forEach(l => (st === 'strong' && !hasExcept ? draft.knownLetters : draft.letters).add(l));
      const n = s.match(/\b(\d{1,2})\s*(?:\/|out of|of)\s*26\b/) || s.match(/\b(\d{1,2})\s+(?:upper\s*case|lower\s*case|capital|uppercase|lowercase)?\s*letters\b/i);
      if (n) { const k = +n[1]; draft.levels.sounds = k >= 22 ? 3 : k >= 12 ? 2 : 1; }
    }
    if (usedFor.includes('words')) {
      const ws = wordsIn(s);
      ws.forEach(w => (st === 'strong' && !hasExcept ? draft.knownWords : draft.words).add(w));
      const n = s.match(/\b(\d{1,3})\s+(?:\w+\s+)?(?:sight|high[- ]frequency|snap|popcorn|heart)\s+words\b/i);
      if (n) { const k = +n[1]; draft.levels.words = k >= 40 ? 5 : k >= 30 ? 4 : k >= 20 ? 3 : k >= 10 ? 2 : 1; }
    }
    if (usedFor.includes('count')) {
      const nums = [];
      for (const m of s.matchAll(/\bcount\w*\b[^.!?]*?\b(?:to|through|up to)\s+(\d{1,3})\b/gi)) nums.push(+m[1]);
      for (const m of s.matchAll(/\bnumbers?\s+(?:\d{1,3}\s*(?:-|–|to|through)\s*)?(\d{1,3})\b/gi)) nums.push(+m[1]);
      for (const m of s.matchAll(/\b[01]\s*(?:-|–)\s*(\d{1,3})\b/g)) nums.push(+m[1]);
      if (nums.length) draft.countTo = Math.max(draft.countTo || 0, ...nums.filter(n => n <= 120));
    }
    if (INTEREST_RE.test(s)) interestSentences.push(s);
    if (usedFor.length) draft.evidence.push({ areas: usedFor, status: st, text: s });
  }

  // the highest number mentioned for counting sets the counting level
  if (draft.countTo) { const n = draft.countTo; draft.levels.count = n <= 10 ? 1 : n <= 20 ? 2 : n <= 30 ? 3 : n <= 50 ? 4 : 5; }
  // starting level from how the notes talk about each area (numbers above take priority)
  for (const a of AREAS) {
    const f = flags[a.id];
    if (!f || draft.levels[a.id]) continue;
    const need = f.has('need'), strong = f.has('strong');
    if (need && !strong) draft.levels[a.id] = 1;
    else if (need && strong) draft.levels[a.id] = 2;
    else if (strong) draft.levels[a.id] = 3;
  }

  // interests -> story themes
  for (const s of interestSentences)
    for (const [k, t] of Object.entries(THEMES)) if (t.kw.test(s)) { draft.themes.add(k); draft.evidence.push({ areas: ['themes'], status: 'info', text: s }); }
  if (!draft.themes.size)
    for (const s of sentences) for (const k of STRONG_THEMES) if (THEMES[k].kw.test(s)) { draft.themes.add(k); draft.evidence.push({ areas: ['themes'], status: 'info', text: s }); }

  draft.knownLetters.forEach(l => draft.letters.delete(l));
  draft.knownWords.forEach(w => draft.words.delete(w));
  // de-duplicate evidence lines
  const seen = new Set();
  draft.evidence = draft.evidence.filter(e => { const k = e.text + e.areas.join(); if (seen.has(k)) return false; seen.add(k); return true; });
  return draft;
}

/* ---------- profile helpers used by the activities ---------- */
const profile = () => save.profile || null;
function practiceLetters() { return (profile()?.letters || []).filter(l => LETTERS[l]); }
function practiceWords() { return profile()?.words || []; }
function markWords(sentence) {
  const ws = practiceWords().filter(w => w.length > 1 || w === 'I');
  if (!ws.length) return sentence;
  const re = new RegExp(`\\b(${ws.map(w => w.replace(/[^A-Za-z]/g, '')).join('|')})\\b`, 'gi');
  // only touch text outside of HTML tags
  return sentence.split(/(<[^>]+>)/).map(part => part.startsWith('<') ? part : part.replace(re, '<b class="pw">$1</b>')).join('');
}

/* stories built from the child's favorite themes (and name, if set) */
function themedStory() {
  const themes = (profile()?.themes || []).filter(k => THEMES[k]);
  if (!themes.length) return null;
  const key = pick(themes), T = THEMES[key];
  const H = T.hero[0], F = T.friend[0], name = kidName();
  const alt = (slot, exclude) => shuffle(Object.values(THEMES).filter(o => o !== T && o[slot][0] !== exclude && o.hero[0] !== exclude && o.friend[0] !== exclude))
    .slice(0, 2).map(o => o[slot]);
  const C = s => s.charAt(0).toUpperCase() + s.slice(1);
  const tpls = [
    () => ({ title: `${H} Finds Something`, pic: T.hero[1],
      sentences: [`${H} went to ${T.place[0]}.`, `${H} looked and looked.`, `${H} found ${T.thing[0]}!`, `${H} ran to show ${F}.`],
      q: `What did ${H} find?`, options: [[T.thing[1], C(T.thing[0]), true], ...alt('thing').map(x => [x[1], C(x[0])])], proof: 2 }),
    () => ({ title: `${F} Helps Out`, pic: T.friend[1],
      sentences: [`${H} wanted ${T.thing[0]}.`, `But it was up too high!`, `${F} came to help.`, `Together they got it down.`],
      q: `Who helped ${H}?`, options: [[T.friend[1], F, true], ...alt('friend', F).map(x => [x[1], x[0]])], proof: 2 }),
    () => ({ title: `Playing Together`, pic: T.place[1],
      sentences: [`${H} and ${F} went to ${T.place[0]}.`, `They played all day long.`, `When it got dark, they went home.`, `They were sleepy and happy.`],
      q: `Where did ${H} and ${F} go?`, options: [[T.place[1], C(T.place[0]), true], ...alt('place').map(x => [x[1], C(x[0])])], proof: 0 }),
    () => ({ title: `${H} Is Sad`, pic: T.hero[1],
      sentences: [`${H} was sad.`, `${H} could not find ${T.thing[0]}.`, `${F} helped look for it.`, `They found it, and ${H} was happy again!`],
      q: `Why was ${H} sad?`, options: [[T.thing[1], `${H} could not find ${T.thing[0]}`, true], ['🌧️', 'It was raining'], ['🛏️', 'It was bedtime']], proof: 1 }),
  ];
  if (name) tpls.push(() => ({ title: `${name} Meets ${H}`, pic: T.hero[1],
    sentences: [`${name} went to ${T.place[0]}.`, `There, ${name} saw ${H}!`, `${H} said, "Do you want to play?"`, `${name} said, "Yes, I do!"`],
    q: `Who did ${name} see?`, options: [[T.hero[1], H, true], ...alt('hero', H).map(x => [x[1], x[0]])], proof: 1 }));
  const s = pick(tpls)();
  s.level = 2;
  return s;
}

/* =========================================================
   Grown-up screens
   ========================================================= */
function grownScreen(html) {
  gen++; hush(); run = null; busy = false;
  setPlaying(false);
  document.body.classList.add('welcoming');
  stage.innerHTML = `<div class="screen grown">${html}</div>`;
  stage.scrollTop = 0;
}
function leaveGrown(to) { document.body.classList.remove('welcoming'); (to || grownupsPage)(); }

/* simple parental gate: an addition question a 5-year-old is unlikely to answer */
function parentGate(next) {
  const a = 6 + rand(4), b = 5 + rand(4), ans = a + b;
  const choices = shuffle([ans, ans + 1, ans - 1, ans + 2]);
  grownScreen(`
    <div class="hello"><h1>Grown-ups only 🔒</h1><p>To continue, tap the answer: what is ${a} + ${b}?</p></div>
    <div class="opts four">${choices.map(c => `<button class="opt num" data-n="${c}">${c}</button>`).join('')}</div>
    <button class="link-btn" id="gateBack">Back</button>`);
  stage.querySelectorAll('.opt').forEach(el => el.onclick = () => {
    if (+el.dataset.n === ans) next(); else { boop(); shake(el); setTimeout(() => parentGate(next), 500); }
  });
  $('#gateBack').onclick = () => leaveGrown(home);
}

function notesScreen() {
  grownScreen(`
    <div class="hello"><h1>Personalize from school notes</h1>
      <p>Add a report card, conference notes or teacher comments.</p></div>
    <div class="panel">
      <p class="privacy">🔒 <b>Stays on this device.</b> The notes are read right here and then thrown away.
        Nothing is uploaded, and only the choices you confirm on the next screen are saved.</p>
      <label class="big-btn file-btn">📄 Choose a file (PDF, Word or text)
        <input type="file" id="notesFile" accept=".pdf,.docx,.txt,.md,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden></label>
      <p class="or">or paste the text</p>
      <textarea id="notesText" rows="8" placeholder="Paste the teacher's comments here…"></textarea>
      <p class="err" id="notesErr"></p>
      <div class="row-btns">
        <button class="big-btn" id="readNotes">Read the notes</button>
        <button class="big-btn alt" id="byHand">Set it up by hand</button>
      </div>
      <button class="link-btn" id="notesBack">Cancel</button>
    </div>`);
  const err = msg => { $('#notesErr').textContent = msg || ''; };
  $('#notesFile').onchange = async e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    err(''); $('#notesText').value = 'Reading ' + f.name + '…';
    try {
      const text = await notesFromFile(f);
      $('#notesText').value = text.trim();
      if (!text.trim()) err('No text was found in that file. If it is a scanned page, please paste the text instead.');
    } catch (ex) { $('#notesText').value = ''; err(ex.message || 'That file could not be read.'); }
    e.target.value = '';
  };
  $('#readNotes').onclick = () => {
    const text = $('#notesText').value;
    if (!text.trim()) return err('Choose a file or paste some text first.');
    const draft = analyzeNotes(text);
    $('#notesText').value = ''; // drop the notes as soon as they are analyzed
    reviewScreen(draft);
  };
  $('#byHand').onclick = () => reviewScreen(draftFromProfile());
  $('#notesBack').onclick = () => leaveGrown();
}

function draftFromProfile() {
  const p = profile() || {};
  const levels = {}; Object.keys(ACTS).forEach(id => levels[id] = lvl(id));
  return { evidence: [], letters: new Set(p.letters || []), words: new Set(p.words || []), countTo: p.countTo || null,
           themes: new Set(p.themes || []), levels, fromProfile: true };
}

function reviewScreen(draft) {
  const levels = { ...draft.levels };
  Object.keys(ACTS).forEach(id => { if (!levels[id]) levels[id] = lvl(id); });
  const letters = new Set([...draft.letters].filter(l => LETTERS[l]));
  const missing = [...draft.letters].filter(l => !LETTERS[l]);
  const words = new Set(draft.words);
  const themes = new Set(draft.themes);
  let countTo = draft.countTo ? Math.min(Math.max(draft.countTo, 5), 100) : null;
  const AREA_NAME = Object.fromEntries([...AREAS.map(a => [a.id, a.icon + ' ' + a.label]), ['themes', '💛 Interests']]);
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const render = () => {
    grownScreen(`
      <div class="hello"><h1>Check & confirm</h1>
        <p>${draft.fromProfile ? 'Adjust anything, then save.' : draft.evidence.length ? 'Here is what the notes seem to say. Fix anything that looks wrong, then save.' : 'Nothing specific was found in the notes, so set things up here.'}</p></div>
      ${draft.evidence.length ? `<details class="panel" open><summary><b>What we found in the notes</b> (${draft.evidence.length})</summary>
        <ul class="evidence">${draft.evidence.slice(0, 30).map(e => `<li><span class="tag ${e.status}">${{ need: 'practice', strong: 'strength', mixed: 'strength + practice', info: 'mentioned' }[e.status]}</span>
          <small>${e.areas.map(a => AREA_NAME[a]).join(' · ')}</small><br>“${esc(e.text.length > 220 ? e.text.slice(0, 217) + '…' : e.text)}”</li>`).join('')}</ul>
        <p class="hint">This list is only shown now; it is not saved.</p></details>` : ''}

      <div class="panel"><h3>🔤 Letters to practice</h3>
        <div class="chips">${Object.keys(LETTERS).sort().map(l => `<button class="chip-t ${letters.has(l) ? 'on' : ''}" data-letter="${l}">${l}</button>`).join('')}</div>
        ${missing.length ? `<p class="hint">Also mentioned: ${missing.join(', ')} (no pictures for ${missing.length > 1 ? 'these' : 'this'} letter yet).</p>` : ''}</div>

      <div class="panel"><h3>👀 Sight words to practice</h3>
        <div class="chips">${[...words].map(w => `<button class="chip-t on" data-word="${esc(w)}">${esc(w)} ✕</button>`).join('') || '<span class="hint">None yet.</span>'}</div>
        <div class="add-row"><input id="addWord" maxlength="12" placeholder="Add a word" autocapitalize="off" autocorrect="off" spellcheck="false">
          <button class="soft-btn" id="addWordBtn">Add</button></div>
        <p class="hint">Quick picks: ${SIGHT_WORDS.filter(w => !words.has(w)).slice(0, 18).map(w => `<button class="chip-t small" data-pickword="${w}">${w}</button>`).join('')}</p></div>

      <div class="panel"><h3>🌰 Counting goal</h3>
        <div class="chips">${[null, 10, 15, 20, 30, 50, 100].map(n => `<button class="chip-t ${countTo === n ? 'on' : ''}" data-count="${n}">${n ? 'up to ' + n : 'not set'}</button>`).join('')}</div>
        <p class="hint">Counting questions use up to 20 objects; a higher goal just means more of the big numbers.</p></div>

      <div class="panel"><h3>💛 Favorite things (for custom stories)</h3>
        <div class="chips">${Object.entries(THEMES).map(([k, t]) => `<button class="chip-t ${themes.has(k) ? 'on' : ''}" data-theme="${k}">${t.icon} ${t.label}</button>`).join('')}</div></div>

      <div class="panel"><h3>⭐ Starting levels</h3>
        <div class="lvl-table">${Object.entries(ACTS).map(([id, a]) =>
          `<span>${a.icon} ${a.name}</span><button data-lv2="${id}" data-d="-1" aria-label="Lower">−</button><b>Level ${levels[id]}</b><button data-lv2="${id}" data-d="1" aria-label="Raise">+</button>`).join('')}</div></div>

      <div class="row-btns"><button class="big-btn" id="saveProfile">Save personalization</button>
        <button class="big-btn alt" id="cancelProfile">Cancel</button></div>`);

    const y = stage.scrollTop;
    stage.querySelectorAll('[data-letter]').forEach(b => b.onclick = () => { const l = b.dataset.letter; letters.has(l) ? letters.delete(l) : letters.add(l); keep(render); });
    stage.querySelectorAll('[data-word]').forEach(b => b.onclick = () => { words.delete(b.dataset.word); keep(render); });
    stage.querySelectorAll('[data-pickword]').forEach(b => b.onclick = () => { words.add(b.dataset.pickword); keep(render); });
    stage.querySelectorAll('[data-count]').forEach(b => b.onclick = () => { countTo = b.dataset.count === 'null' ? null : +b.dataset.count; keep(render); });
    stage.querySelectorAll('[data-theme]').forEach(b => b.onclick = () => { const k = b.dataset.theme; themes.has(k) ? themes.delete(k) : themes.add(k); keep(render); });
    stage.querySelectorAll('[data-lv2]').forEach(b => b.onclick = () => { const id = b.dataset.lv2; levels[id] = Math.min(MAX_LEVEL, Math.max(1, levels[id] + +b.dataset.d)); keep(render); });
    const addWord = () => {
      const raw = $('#addWord').value.trim().replace(/[^A-Za-z]/g, '');
      if (raw) { words.add(raw.toLowerCase() === 'i' ? 'I' : raw.toLowerCase()); keep(render); }
    };
    $('#addWordBtn').onclick = addWord;
    $('#addWord').onkeydown = e => { if (e.key === 'Enter') addWord(); };
    $('#saveProfile').onclick = () => {
      save.profile = { letters: [...letters].sort(), words: [...words], countTo, themes: [...themes], updated: new Date().toLocaleDateString('en-CA') };
      Object.assign(save.levels, levels);
      persist();
      leaveGrown();
      tone([523, 659, 784]);
    };
    $('#cancelProfile').onclick = () => leaveGrown();
    return y;
  };
  // re-render but keep the scroll position
  const keep = fn => { const y = stage.scrollTop; fn(); stage.scrollTop = y; };
  render();
}

/* summary + buttons shown in the garden's grown-up area */
function personalSection() {
  const p = profile();
  const parts = [];
  if (p) {
    if (p.letters.length) parts.push(`letters ${p.letters.join(', ')}`);
    if (p.words.length) parts.push(`words “${p.words.slice(0, 8).join(', ')}${p.words.length > 8 ? '…' : ''}”`);
    if (p.countTo) parts.push(`counting to ${p.countTo}`);
    if (p.themes.length) parts.push(`stories about ${p.themes.map(k => THEMES[k]?.label.toLowerCase()).filter(Boolean).join(', ')}`);
  }
  return `<div class="personal-box">
    ${p ? `<p><b>Personalized</b> (${p.updated}): ${parts.join('; ') || 'levels only'}.</p>` : '<p>Tailor letters, words, counting and stories to your child, using notes from school.</p>'}
    <button class="big-btn" id="personalize" style="font-size:20px;padding:12px 24px">📄 ${p ? 'Update from new notes' : 'Add school notes'}</button>
    ${p ? '<button class="soft-btn" id="editProfile">✏️ Edit</button> <button class="soft-btn" id="clearProfile">Remove</button>' : ''}
  </div>`;
}
function wirePersonalSection() {
  $('#personalize').onclick = notesScreen;
  if ($('#editProfile')) $('#editProfile').onclick = () => reviewScreen(draftFromProfile());
  if ($('#clearProfile')) $('#clearProfile').onclick = () => {
    if (confirm('Remove the personalization? Leaves and levels stay.')) { delete save.profile; persist(); grownupsPage(); }
  };
}

/* one place for all parent settings (reached through the grown-up check) */
function grownupsPage() {
  grownScreen(`
    <div class="hello"><h1>For grown-ups</h1><p>Everything here is saved on this device only.</p></div>

    <div class="panel"><h3>📄 Personalize from school notes</h3>${personalSection()}</div>

    <div class="panel"><h3>🙂 Child's name</h3>
      <div class="add-row"><input id="kidName" maxlength="20" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Name" value="${kidName()}">
        <button class="soft-btn" id="saveName">Save</button></div></div>

    <div class="panel"><h3>🔈 Voice</h3>
      <div class="add-row"><select id="voicePick" style="flex:1;font-size:17px;padding:10px;border-radius:14px;border:3px solid var(--border);background:#fff;min-width:0"></select>
        <button class="soft-btn" id="voiceTest">▶︎ Test</button></div>
      <p class="hint" style="margin:8px 0 0">For a natural voice, download one in iPad Settings → Accessibility → Spoken Content → Voices → English (pick one marked Enhanced or Premium). Then close Tree Hunt fully (swipe it away in the app switcher) and reopen it — it will show up here.</p></div>

    <div class="panel"><h3>⭐ Levels</h3>
      <div class="lvl-table">${Object.entries(ACTS).map(([id, a]) =>
        `<span>${a.icon} ${a.name}</span><button data-lv="${id}" data-d="-1" aria-label="Lower level">−</button><b>Level ${lvl(id)}</b><button data-lv="${id}" data-d="1" aria-label="Raise level">+</button>`).join('')}</div></div>

    <div class="panel"><h3>🍃 Leaf garden</h3>
      <p class="hint" style="margin:0 0 8px">${save.leaves} leaves collected.</p>
      <button class="soft-btn" id="reset">Reset garden</button></div>

    <div class="row-btns"><button class="big-btn" id="grownDone">Done</button></div>`);
  $('.personal-box').style.cssText = 'margin:0;border:none;padding:0';
  wirePersonalSection();
  $('#saveName').onclick = () => {
    save.kid = cleanName($('#kidName').value); persist(); applyName();
    $('#kidName').value = kidName(); $('#saveName').textContent = 'Saved ✓';
  };
  $('#kidName').onkeydown = e => { if (e.key === 'Enter') $('#saveName').click(); };
  stage.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => {
    const id = b.dataset.lv, y = stage.scrollTop;
    save.levels[id] = Math.min(MAX_LEVEL, Math.max(1, lvl(id) + +b.dataset.d));
    persist(); grownupsPage(); stage.scrollTop = y;
  });
  $('#reset').onclick = () => {
    if (confirm('Reset all leaves and trees? This cannot be undone.')) {
      save.leaves = 0; save.garden = []; persist(); showCount(); grownupsPage();
    }
  };
  $('#grownDone').onclick = () => leaveGrown(home);
  wireVoicePick();
}

function wireVoicePick() {
  const sel = $('#voicePick');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (!tts) { sel.innerHTML = '<option>Speech not available</option>'; sel.disabled = true; $('#voiceTest').disabled = true; return; }
  const fill = () => {
    if (!sel.isConnected) { speechSynthesis.removeEventListener?.('voiceschanged', fill); return; }
    const vs = englishVoices().filter(v => !ODD_VOICES.test(v.name) || v.voiceURI === save.voice).sort((a, b) => voiceQuality(b) - voiceQuality(a) || a.name.localeCompare(b.name));
    sel.innerHTML = `<option value="">Automatic${voice && !save.voice ? ' (' + esc(voiceLabel(voice)) + ')' : ''}</option>`
      + vs.map(v => `<option value="${esc(v.voiceURI)}">${esc(voiceLabel(v))}</option>`).join('');
    sel.value = save.voice && vs.some(v => v.voiceURI === save.voice) ? save.voice : '';
  };
  fill();
  speechSynthesis.addEventListener?.('voiceschanged', fill);
  sel.onchange = () => { save.voice = sel.value || undefined; persist(); pickVoice(); fill(); $('#voiceTest').click(); };
  $('#voiceTest').onclick = () => {
    const was = save.muted; save.muted = false; hush();
    say(`Hi ${kidName() || 'friend'}! Let's go on a tree hunt.`); save.muted = was;
  };
}

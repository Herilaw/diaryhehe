(() => {
'use strict';
// Adapted from Kabi's Hamster Doctor v1.0.0 state/store.ts and selectors.ts.
// React/Zustand presentation is replaced by the existing AVG runtime. See TEMPLATE-SOURCE.md.
window.createS2System = function({ data, read, write, now = () => Date.now() }) {
  const cfg = data.tuning;
  const listeners = new Set();
  const bookOf = key => data.books.find(book => book.key === key);
  const supplyOf = id => data.supplies.find(item => item.id === id);
  const geometry = book => window.S2_JIGSAW.buildGeometry(book.seed, book.grid);
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  const number = (value, fallback, low, high) => Number.isFinite(value) ? clamp(value, low, high) : fallback;
  const unique = (values, allowed) => [...new Set(Array.isArray(values) ? values.filter(allowed) : [])];
  function fresh() {
    const time = now();
    return { version: 1, ink: cfg.startInk, energy: cfg.maxEnergy, affection: 0,
      stock: 4, stockAnchor: time, energyAnchor: time, careUntil: 0, restUntil: 0,
      inventory: { paper: 3, ribbon: 0, blank: 1, fold: 0 }, equipped: { main: 'paper', snack: null },
      trip: null, tripCount: 0, books: Object.fromEntries(data.books.map(book => [book.key, { fragments: 0, placed: [], read: false, rewardClaimed: false }])),
      records: [], photos: [], guide: [], introSeen: false, completeSeen: false };
  }
  function validate(value) {
    if (!value || value.version !== 1 || !value.books || typeof value.books !== 'object' || Array.isArray(value.books)) throw Error(data.copy.importError);
    const clean = fresh();
    for (const key of ['ink','energy','affection','stock','stockAnchor','energyAnchor','careUntil','restUntil','tripCount']) {
      const max = key === 'energy' ? cfg.maxEnergy : key === 'stock' ? cfg.stockCap : key === 'ink' ? 100000 : Number.MAX_SAFE_INTEGER;
      clean[key] = number(value[key], clean[key], 0, max);
    }
    clean.introSeen = value.introSeen === true;
    clean.completeSeen = value.completeSeen === true;
    clean.records = unique(value.records, id => data.records.some(record => record.id === id));
    clean.guide = unique(value.guide, id => data.guideNotes.some(record => record.id === id));
    clean.photos = unique(value.photos, id => typeof id === 'string' && /^[a-z0-9-]+$/.test(id)).slice(0, cfg.maxPhotos);
    for (const supply of data.supplies) clean.inventory[supply.id] = Math.floor(number(value.inventory?.[supply.id], 0, 0, 999));
    for (const kind of ['main','snack']) {
      const id = value.equipped?.[kind];
      clean.equipped[kind] = supplyOf(id)?.kind === kind ? id : null;
    }
    for (const book of data.books) {
      const saved = value.books[book.key] || {};
      const fragments = Math.floor(number(saved.fragments, 0, 0, book.grid ** 2));
      const owned = window.S2_JIGSAW.ownedCells(geometry(book), fragments);
      clean.books[book.key] = { fragments, placed: unique(saved.placed, cell => Number.isInteger(cell) && owned.has(cell)), read: saved.read === true, rewardClaimed: saved.rewardClaimed === true };
      if (clean.books[book.key].read) {
        clean.books[book.key].fragments = book.grid ** 2;
        clean.books[book.key].placed = Array.from({length: book.grid ** 2}, (_, i) => i);
      }
    }
    if (value.trip) {
      const trip = value.trip;
      if (!bookOf(trip.book) || !['countdown','away','returned'].includes(trip.status) || ![trip.start,trip.departAt,trip.endAt,trip.duration].every(Number.isFinite) || trip.departAt < trip.start || trip.endAt < trip.departAt) throw Error(data.copy.importError);
      clean.trip = { book: trip.book, status: trip.status, start: trip.start, departAt: trip.departAt, endAt: trip.endAt,
        duration: clamp(trip.duration, 1, 600000), gain: Math.floor(number(trip.gain, 0, 0, 25)), bonus: number(trip.bonus, 0, 0, 3),
        event: data.events.some(event => event.id === trip.event) ? trip.event : data.events[0].id,
        choice: Number.isInteger(trip.choice) && trip.choice >= 0 && trip.choice < 2 ? trip.choice : null,
        guideDrop: data.guideNotes.some(note => note.id === trip.guideDrop) ? trip.guideDrop : null };
    }
    return clean;
  }
  let state;
  try { state = read() ? validate(read()) : fresh(); } catch { state = fresh(); }
  function emit() { write(structuredClone(state)); for (const listener of listeners) listener(); }
  function available(key) { const index = data.books.findIndex(book => book.key === key); return index === 0 || index > 0 && (state.books[data.books[index - 1].key].read || ready(key)); }
  function ready(key) { const book = bookOf(key); return !!book && state.books[key].placed.length === book.grid ** 2; }
  function tick() {
    const time = now();
    let changed = false;
    // Clamp future anchors after a clock correction; offline work stops at the storage cap.
    if (state.stockAnchor > time) { state.stockAnchor = time; changed = true; }
    if (state.energyAnchor > time) { state.energyAnchor = time; changed = true; }
    const produced = Math.floor((time - state.stockAnchor) / cfg.produceMs);
    if (produced > 0) {
      state.stock = Math.min(cfg.stockCap, state.stock + produced);
      state.stockAnchor = state.stock === cfg.stockCap ? time : state.stockAnchor + produced * cfg.produceMs;
      changed = true;
    }
    const trip = state.trip;
    if (trip?.status === 'countdown' && time >= trip.departAt) { trip.status = 'away'; changed = true; }
    if (trip?.status === 'away' && time >= trip.endAt) { trip.status = 'returned'; state.energyAnchor = trip.endAt; changed = true; }
    if (!trip || trip.status === 'returned') {
      const ticks = Math.floor((time - state.energyAnchor) / cfg.regenMs);
      if (ticks > 0) { state.energy = Math.min(cfg.maxEnergy, state.energy + ticks); state.energyAnchor += ticks * cfg.regenMs; changed = true; }
    }
    if (changed) emit();
  }
  function observe(game, art) {
    let changed = false;
    const found = new Set(game.found || []);
    for (const record of data.records) {
      if (state.records.includes(record.id) || !record.items.every(id => found.has(id)) || !(record.flags || []).every(flag => game.flags?.[flag])) continue;
      state.records.push(record.id); state.ink += cfg.recordReward; changed = true;
    }
    for (const key of game.completedStories || []) {
      const book = state.books[key];
      if (!book || book.read) continue;
      book.read = true; book.fragments = bookOf(key).grid ** 2; book.placed = Array.from({length: book.fragments}, (_, i) => i);
      if (!book.rewardClaimed) { state.ink += cfg.readReward; state.inventory.paper += 2; book.rewardClaimed = true; }
      state.energy = cfg.maxEnergy; state.affection += 2; state.energyAnchor = now(); changed = true;
    }
    if (changed) emit();
  }
  function mergePermanent(incoming, previous) {
    if (!previous) return incoming;
    incoming.records = unique([...incoming.records, ...previous.records], id => data.records.some(record => record.id === id));
    incoming.guide = unique([...incoming.guide, ...previous.guide], id => data.guideNotes.some(note => note.id === id));
    incoming.photos = unique([...incoming.photos, ...previous.photos], id => typeof id === 'string' && /^[a-z0-9-]+$/.test(id)).slice(0, cfg.maxPhotos);
    incoming.introSeen = incoming.introSeen || previous.introSeen;
    incoming.completeSeen = incoming.completeSeen || previous.completeSeen;
    // A claimed trip must not reappear when reading an older manual slot.
    if (incoming.tripCount < previous.tripCount) incoming.trip = null;
    incoming.tripCount = Math.max(incoming.tripCount, previous.tripCount);
    for (const book of data.books) {
      const current = incoming.books[book.key], old = previous.books[book.key];
      if (!old) continue;
      current.read = current.read || old.read;
      current.rewardClaimed = current.rewardClaimed || old.rewardClaimed;
      current.fragments = Math.max(current.fragments, old.fragments);
      const owned = window.S2_JIGSAW.ownedCells(geometry(book), current.fragments);
      current.placed = unique([...current.placed, ...old.placed], cell => owned.has(cell));
      if (current.read) {
        current.fragments = book.grid ** 2;
        current.placed = Array.from({length: book.grid ** 2}, (_, i) => i);
      }
    }
    return incoming;
  }
  function restore(value, game) {
    if (value) state = mergePermanent(validate(value), state);
    else {
      // Old AVG saves already inside a story receive its entry page without replaying a new gate.
      const visited = new Set(game?.visited || []);
      for (const book of data.books) if (visited.has(book.gate) || game?.scene === book.gate) {
        state.books[book.key].fragments = book.grid ** 2;
        state.books[book.key].placed = Array.from({length: book.grid ** 2}, (_, i) => i);
      }
    }
    observe(game || {}); tick(); emit();
  }
  const api = {
    snapshot: () => structuredClone(state), validate, available, ready, observe, restore, tick,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    introSeen() { state.introSeen = true; emit(); },
    collect() { tick(); const gain = state.stock * cfg.inkPerStock; state.ink += gain; state.stock = 0; state.stockAnchor = now(); emit(); return gain; },
    buy(id) { const item = supplyOf(id); if (!item) return false; if (state.ink < item.price) return false; state.ink -= item.price; state.inventory[id]++; emit(); return true; },
    equip(kind,id) {
      if (state.trip && state.trip.status !== 'returned') return false;
      if (!['main','snack'].includes(kind) || id !== null && (supplyOf(id)?.kind !== kind || state.inventory[id] < 1)) return false;
      const previous = state.equipped[kind]; if (previous) state.inventory[previous]++;
      state.equipped[kind] = id; if (id) state.inventory[id]--; emit(); return true;
    },
    care(rest = false) {
      tick(); const time = now(); if (state.trip && state.trip.status !== 'returned' || time < state.careUntil) return false;
      state.energy = Math.min(cfg.maxEnergy, state.energy + (rest ? 12 : 5)); state.affection++; state.careUntil = time + cfg.careCooldownMs;
      state.restUntil = rest ? time + 20000 : 0; emit(); return true;
    },
    depart(key) {
      tick(); if (!available(key) || state.trip || state.energy < 15 || !state.equipped.main) return false;
      const book = bookOf(key), main = supplyOf(state.equipped.main), snack = supplyOf(state.equipped.snack), time = now();
      const duration = state.tripCount === 0 ? cfg.firstTripMs : Math.round(cfg.tripMs * main.duration * (state.energy >= 80 ? .8 : 1));
      const remaining = book.grid ** 2 - state.books[key].fragments;
      const gain = Math.min(remaining, state.tripCount === 0 ? book.grid ** 2 : cfg.fragmentReward);
      const guidePool = data.guideNotes.filter(note => !state.guide.includes(note.id));
      state.trip = { book: key, status: 'countdown', start: time, departAt: time + cfg.packingMs, endAt: time + cfg.packingMs + duration,
        duration, gain, bonus: snack?.bonus || 0, event: data.events[state.tripCount % data.events.length].id, choice: null,
        guideDrop: guidePool.length ? guidePool[0].id : null };
      state.equipped = {main:null,snack:null}; state.energy = Math.max(0,state.energy - Math.ceil(duration / 3000)); state.energyAnchor = time;
      state.restUntil = 0; emit(); return true;
    },
    choose(index) {
      tick(); const trip = state.trip, event = data.events.find(event => event.id === trip?.event);
      if (!trip || trip.choice !== null || !['away','returned'].includes(trip.status) || !event?.choices[index]) return false;
      const choice = event.choices[index]; trip.choice = index; trip.endAt = Math.max(trip.departAt,trip.endAt - choice.seconds * 1000); state.ink += choice.ink;
      emit(); tick(); return true;
    },
    claim() {
      tick(); const trip = state.trip; if (trip?.status !== 'returned') return null;
      const result = structuredClone(trip); const book = state.books[trip.book];
      book.fragments = Math.min(bookOf(trip.book).grid ** 2,book.fragments + trip.gain);
      if (trip.guideDrop && !state.guide.includes(trip.guideDrop)) state.guide.push(trip.guideDrop);
      state.ink += 8 + trip.bonus * 4; state.tripCount++; state.trip = null; state.energyAnchor = now(); emit(); return result;
    },
    place(key,cell) {
      const book = bookOf(key); if (!book || !available(key) || !Number.isInteger(cell)) return false;
      const progress = state.books[key]; const owned = window.S2_JIGSAW.ownedCells(geometry(book),progress.fragments);
      if (!owned.has(cell) || progress.placed.includes(cell)) return false;
      progress.placed.push(cell); emit(); return true;
    },
    photo(id) { if (typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id) || state.photos.includes(id) || state.photos.length >= cfg.maxPhotos) return false; state.photos.push(id); emit(); return true; },
    removePhoto(id) { state.photos = state.photos.filter(photo => photo !== id); emit(); },
    movePhoto(id,delta) { const from = state.photos.indexOf(id), to = from + delta; if (from < 0 || to < 0 || to >= state.photos.length) return; state.photos.splice(to,0,...state.photos.splice(from,1)); emit(); },
    full: () => data.books.every(book => state.books[book.key].read) && data.records.every(record => state.records.includes(record.id)),
    markComplete() { state.completeSeen = true; emit(); },
    unlockAll() {
      for (const book of data.books) {
        state.books[book.key] = { fragments: book.grid ** 2, placed: Array.from({length:book.grid ** 2},(_,i)=>i), read: true, rewardClaimed: true };
      }
      state.records = data.records.map(record => record.id);
      state.guide = data.guideNotes.map(note => note.id);
      state.ink = Math.max(state.ink,200);
      emit();
    },
    reset() { state = fresh(); emit(); }
  };
  tick();
  return api;
};
})();

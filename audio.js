(() => {
'use strict';

const MUSIC = {
  title:'bgm_01_title', daily:'bgm_02_diary_daily', unease:'bgm_03_diary_unease',
  dorm:'bgm_04_dormitory_arrival', dormNight:'bgm_05_dormitory_night',
  coast:'bgm_06_coast_dusk', memory:'bgm_07_childhood_memory', finale:'bgm_08_finale'
};
const AMBIENCE = {
  rain:'loop_01_window_rain', storm:'loop_02_storm_rain', cicada:'loop_03_cicadas',
  boil:'loop_04_jam_simmer', fan:'loop_05_desk_fan', bees:'loop_06_bees',
  machine:'loop_07_conveyor', pool:'loop_08_pool_rain', sea:'loop_09_coast',
  wind:'loop_10_cold_wind', room:'loop_11_room_tone'
};
const EFFECTS = {
  select:'sfx_01_choice', tap:'sfx_02_clue_tap', open:'sfx_03_clue_open',
  close:'sfx_04_clue_close', collect:'sfx_05_clue_store', paper:'sfx_06_page_turn',
  book:'sfx_07_book_cross', dormTransition:'sfx_08_dormitory_transition',
  rainTransition:'sfx_09_rain_transition', failure:'sfx_10_failure',
  spoon:'sfx_11_spoon', key:'sfx_12_keys', stairs:'sfx_13_stairs',
  broom:'sfx_14_broom', stitch:'sfx_15_stitch', flashlight:'sfx_16_flashlight',
  doorbell:'sfx_17_doorbell', chain:'sfx_18_dog_chain', metal:'sfx_19_aluminum_bowl',
  telegram:'sfx_20_telegram', can:'sfx_21_empty_can'
};
const ALIASES = {turn:'paper', click:'tap', bell:'doorbell', drop:'failure'};
const FOCUS = {book:.26, dormTransition:.43, rainTransition:.38, failure:.22,
  doorbell:.48, broom:.53, stairs:.66, chain:.62, metal:.60, telegram:.68, can:.62, spoon:.67};
const EFFECT_LEVEL = {open:.85, close:.81, collect:.94};
const LISTEN_EFFECTS = {metal:'metal', chain:'chain', paper:'telegram'};
const NIGHT_DORM = new Set(['d2-wait','d2-empty-room','d2-illness','d2-second-letter',
  'd2-care','d2-tulips','d2-drops','d2-search','d2-hive']);
const LATE_DIARY = new Set(['jun15','jul02','jul22','aug08','aug11']);
const COLD_DORM = new Set(['d2-sound','d2-call','d2-journey','d2-arrival']);

function sceneMix(scene, node) {
  const {id} = scene;
  const bg = node.bg || scene.bg || '';
  const mood = node.ambience || scene.ambience || '';
  const layers = {};
  if (/pool-(rain|eyewash)/.test(bg)) layers.pool = .87;
  else if (/storm|typhoon/.test(mood+' '+bg)) layers.storm = .85;
  else if (/rain/.test(mood+' '+bg)) layers.rain = .77;
  if (/jam/.test(bg) || mood === 'boil') layers.boil = .72;
  if (/bees|honey/.test(mood) || bg === 'd2-hive') layers.bees = .62;
  if (mood === 'machine') layers.machine = .83;
  if (mood === 'sea' || (mood === 'dusk' && /seawall|catering|goodbye/.test(bg))) layers.sea = .69;
  if (mood === 'summer') layers[bg.includes('kitchen') ? 'fan' : 'cicada'] = .63;
  if (mood === 'fan') layers.fan = .59;
  if (mood === 'mist' || (COLD_DORM.has(id) && /exterior|station/.test(bg))) layers.wind = .51;
  if (!Object.keys(layers).length && /corridor|manager-(room|bed)|catering-empty/.test(bg)) layers.room = .22;

  // Let the hospital stairs, the vent and stopped machinery stand on their own.
  let music;
  if (scene.bridge || scene.inside === false || bg === 'reading-room' || id === 'intro' || id === 'return') {
    music = id === 'intro' && bg === 'kitchen' ? 'daily' : '';
  } else if (id.startsWith('d2-')) {
    music = /d2-(vent|hive)/.test(bg) ? '' : NIGHT_DORM.has(id) ? 'dormNight' : 'dorm';
  } else if (id.startsWith('d3-')) {
    music = mood === 'machine' || bg === 'd3-catering-empty' ? '' : node.memory ? 'memory' : 'coast';
  } else {
    music = /^(clinic-stairs|corridor)$/.test(bg) ? '' : LATE_DIARY.has(id) || node.memory ? 'unease' : 'daily';
  }
  return {music, layers};
}

window.createGameAudio = function(getSettings) {
  let context, master, musicBus, effectBus, ambientFocus, musicFocus;
  let hidden = document.hidden, generation = 0, listening = null, duckTimer, duckUntil = 0, duckLevel = 1;
  let desiredMusic = '', desiredLayers = {}, lastCue = '', lastCueBg = '';
  let currentMusic = null;
  const beds = new Map(), live = new Set(), buffers = new Map(), lastPlayed = new Map();
  const encoded = new Map();
  const errors = new Set();
  const enabled = () => getSettings().sound && !hidden;
  const glide = (param, value, time) => param.setTargetAtTime(value, context.currentTime, time);
  const slider = value => Math.max(0, Math.min(1, Number(value) || 0));

  function init() {
    if (!enabled()) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!context) {
      try { context = new AudioContext(); }
      catch { return; }
      musicBus = context.createGain();
      effectBus = context.createGain();
      musicFocus = context.createGain();
      ambientFocus = context.createGain();
      master = context.createGain();
      const limiter = context.createDynamicsCompressor();
      limiter.threshold.value = -6;
      limiter.knee.value = 4;
      limiter.ratio.value = 12;
      musicBus.connect(musicFocus).connect(master);
      ambientFocus.connect(effectBus).connect(master);
      master.connect(limiter).connect(context.destination);
      for (const kind of ['select','tap','open','close','collect','paper','book']) {
        load(EFFECTS[kind]).catch(() => {});
      }
    }
    if (context.state !== 'running') context.resume().catch(() => {});
    configure();
  }

  function configure() {
    if (!context) return;
    const settings = getSettings();
    glide(master.gain, enabled() ? 1 : 0, .035);
    glide(musicBus.gain, slider(settings.musicVolume) * .78, .035);
    glide(effectBus.gain, slider(settings.effectsVolume), .035);
    reconcile();
    if (!settings.sound || !slider(settings.effectsVolume)) listening?.stop();
  }

  function downloadAudio(file) {
    if (!encoded.has(file)) {
      const pending = fetch('audio/mixed/'+file+'.ogg', {signal:AbortSignal.timeout?.(45000)})
        .then(response => {
          if (!response.ok) throw new Error('Audio unavailable: '+file);
          return response.arrayBuffer();
        })
        .then(data => {
          const signature = new Uint8Array(data, 0, Math.min(4, data.byteLength));
          if (String.fromCharCode(...signature) !== 'OggS') throw new Error('Invalid audio file: '+file);
          return data;
        })
        .catch(error => {
          encoded.delete(file);
          throw error;
        });
      encoded.set(file, pending);
    }
    return encoded.get(file);
  }

  async function preload(file) {
    if (window.prepareLocalGameMedia) await window.prepareLocalGameMedia();
    if (!window.GAME_AUDIO?.[file]) await downloadAudio(file);
  }

  async function audioBytes(file) {
    if (window.prepareLocalGameMedia) await window.prepareLocalGameMedia();
    const embedded = window.GAME_AUDIO?.[file];
    if (embedded) return Uint8Array.from(atob(embedded), c => c.charCodeAt(0)).buffer;
    return (await downloadAudio(file)).slice(0);
  }

  function load(file) {
    if (buffers.has(file)) {
      const saved = buffers.get(file);
      buffers.delete(file);
      buffers.set(file, saved);
      return saved;
    }
    const pending = audioBytes(file).then(data => context.decodeAudioData(data)).catch(error => {
      if (buffers.get(file) === pending) buffers.delete(file);
      errors.add(file);
      throw error;
    });
    buffers.set(file, pending);
    // Playing sources hold their buffers. Cap the extra decoded recordings.
    const group = file.split('_')[0];
    const entries = [...buffers.keys()].filter(key => key.startsWith(group+'_'));
    const limit = group === 'bgm' ? 2 : group === 'loop' ? 4 : 21;
    if (entries.length > limit) buffers.delete(entries[0]);
    return pending;
  }

  function start(buffer, bus, {loop = false, level = 1, fade = .01} = {}) {
    const source = context.createBufferSource(), volume = context.createGain();
    source.buffer = buffer;
    source.loop = loop;
    volume.gain.value = fade ? 0 : level;
    source.connect(volume).connect(bus);
    const handle = {
      set(value, time) { glide(volume.gain, value, time); },
      stop(time = .07) {
        if (!live.delete(handle)) return;
        glide(volume.gain, 0, time);
        source.stop(context.currentTime + time * 4);
      }
    };
    source.onended = () => {
      live.delete(handle);
      source.disconnect();
      volume.disconnect();
    };
    source.start();
    if (fade) handle.set(level, fade);
    live.add(handle);
    return handle;
  }

  function reconcile() {
    const fadeMusic = .32, fadeBed = .22;
    if (currentMusic?.kind !== desiredMusic) {
      currentMusic?.voice?.stop(fadeMusic);
      currentMusic = null;
      if (desiredMusic && enabled()) {
        const entry = {kind:desiredMusic, voice:null};
        currentMusic = entry;
        load(MUSIC[entry.kind]).then(buffer => {
          if (currentMusic === entry) entry.voice = start(buffer, musicBus, {loop:true, fade:fadeMusic});
        }).catch(() => { if (currentMusic === entry) currentMusic = null; });
      }
    }
    for (const [kind, entry] of beds) {
      if (kind in desiredLayers) entry.voice?.set(desiredLayers[kind], fadeBed);
      else {
        entry.voice?.stop(fadeBed);
        beds.delete(kind);
      }
    }
    if (!enabled()) return;
    for (const kind of Object.keys(desiredLayers)) {
      if (beds.has(kind)) continue;
      const entry = {voice:null};
      beds.set(kind, entry);
      load(AMBIENCE[kind]).then(buffer => {
        if (beds.get(kind) === entry) entry.voice = start(buffer, ambientFocus, {
          loop:true, level:desiredLayers[kind], fade:fadeBed
        });
      }).catch(() => { if (beds.get(kind) === entry) beds.delete(kind); });
    }
  }

  function mix(music, layers = {}) {
    desiredMusic = music;
    desiredLayers = layers;
    if (context) reconcile();
  }

  function updateFocus() {
    if (!context) return;
    const current = performance.now() < duckUntil ? duckLevel : 1;
    const target = Math.min(current, listening ? .18 : 1);
    glide(musicFocus.gain, target, target < musicFocus.gain.value ? .035 : .23);
    glide(ambientFocus.gain, listening ? .17 : 1, .13);
  }

  function duck(level, seconds) {
    const now = performance.now();
    duckLevel = now < duckUntil ? Math.min(duckLevel, level) : level;
    duckUntil = Math.max(duckUntil, now + seconds * 1000);
    clearTimeout(duckTimer);
    duckTimer = setTimeout(updateFocus, duckUntil - now + 20);
    updateFocus();
  }

  function play(kind) {
    kind = ALIASES[kind] || kind;
    const file = EFFECTS[kind];
    if (!file || !enabled() || !context || !slider(getSettings().effectsVolume)) return;
    const now = performance.now();
    if (now - (lastPlayed.get(kind) ?? -Infinity) < 105) return;
    lastPlayed.set(kind, now);
    const ticket = generation;
    load(file).then(buffer => {
      if (ticket !== generation || !enabled() || performance.now() - now > 650) return;
      if (FOCUS[kind]) duck(FOCUS[kind], buffer.duration + .13);
      start(buffer, effectBus, {level:EFFECT_LEVEL[kind] || 1, fade:0});
    }).catch(() => {});
  }

  function listen(kind) {
    listening?.stop();
    const entry = {kind, voice:null, level:.82, stop};
    function stop() {
      if (listening !== entry) return;
      listening = null;
      entry.voice?.stop();
      updateFocus();
    }
    stop.progress = p => {
      entry.level = .72 + .28 * p;
      if (AMBIENCE[kind]) entry.voice?.set(entry.level, .12);
    };
    const effect = LISTEN_EFFECTS[kind], file = AMBIENCE[kind] || EFFECTS[effect];
    if (!file || !context || !enabled() || !slider(getSettings().effectsVolume)) return stop;
    listening = entry;
    updateFocus();
    load(file).then(buffer => {
      if (listening === entry && enabled()) entry.voice = start(buffer, effectBus, {
        loop:!effect, level:entry.level, fade:effect ? 0 : .13
      });
    }).catch(stop);
    return stop;
  }

  function render(scene, node, key) {
    const {music, layers} = sceneMix(scene, node);
    mix(music, layers);
    if (key === lastCue) return;
    const bg = node.bg || scene.bg;
    const cue = node.sfx === 'wood' ? (scene.id.startsWith('d2-') ? 'broom' : 'stairs')
      : node.sfx === 'paper' && scene.id.startsWith('d3-') ? 'telegram'
      : node.sfx || (bg === 'clinic-stairs' && bg !== lastCueBg ? 'stairs' : '');
    lastCue = key;
    lastCueBg = bg;
    if (cue) play(cue);
  }

  function stop() {
    generation++;
    lastCue = lastCueBg = '';
    listening?.stop();
    mix('');
    if (!context) return;
    for (const handle of live) handle.stop(.08);
    clearTimeout(duckTimer);
    duckUntil = 0;
    updateFocus();
  }

  return {
    init, configure, play, listen, render, mix, stop, preload,
    pause(flag) {
      hidden = flag;
      if (flag) listening?.stop();
      configure();
    },
    diagnostics() {
      return {
        music:desiredMusic, ambience:Object.keys(desiredLayers), listening:listening?.kind || '',
        ducked:!!listening || performance.now() < duckUntil, active:live.size,
        musicPlaying:!!currentMusic?.voice, ambiencePlaying:[...beds].filter(([,e]) => e.voice).map(([kind]) => kind),
        levels:{music:getSettings().musicVolume, effects:getSettings().effectsVolume},
        errors:[...errors]
      };
    }
  };
};
})();

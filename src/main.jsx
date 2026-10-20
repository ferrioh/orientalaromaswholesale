import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, MotionConfig, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Magnet from './components/Magnet';
import SceneTransition from './components/SceneTransition';
import { brandLinks, copy } from './data';
import previewProducts from './products.json';
import './styles.css';
import './mobile-dock.css';

const root = document.getElementById('oriental-aromas-root');
const config = root.dataset.configId ? JSON.parse(document.getElementById(root.dataset.configId).textContent) : {};
const asset = name => config.assets?.[name] || `${import.meta.env.BASE_URL}media/${name}`;
const shop = path => `${config.shopify ? '' : 'https://orientalaromaswholesale.com'}${path}`;
const collection = slug => shop(`/collections/${slug}`);
const wa = 'https://wa.me/17867319919?text=' + encodeURIComponent('Hola, me gustaría conocer la selección mayorista de Oriental Aromas.');
const ease = [.22, 1, .36, 1];

function Icon({ name = 'arrow', ...props }) {
  const paths = {
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
    right: <path d="M4 12h16m-6-6 6 6-6 6" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>,
    user: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
    menu: <path d="M3 8h18M3 16h18" />,
    close: <path d="m5 5 14 14M5 19 19 5" />,
    plus: <path d="M4 12h16M12 4v16" />,
    pin: <><path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    pause: <path d="M8 5v14M16 5v14" />,
    play: <path d="m7 4 14 8-14 8V4Z" />,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
    chat: <path d="M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.7-4.5A9 9 0 1 1 21 11.5Z" />,
    diamond: <><path d="m12 2 9 10-9 10L3 12 9-10Z" /><path d="M3 12h18M12 2v20" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" /></>,
    tiktok: <path d="M14 3v12.2a4.6 4.6 0 1 1-4-4.5v3a1.8 1.8 0 1 0 1.2 1.7V3H14c.5 3.2 2 4.7 5 5v3c-2-.1-3.6-.7-5-1.9" fill="currentColor" stroke="none" />,
    facebook: <path d="M14.2 22v-8.3H17l.5-3.2h-3.3V8.4c0-.9.4-1.7 1.7-1.7h1.8V3.8a21 21 0 0 0-2.6-.2c-2.6 0-4.4 1.5-4.4 4.4v2.5H8v3.2h2.7V22h3.5Z" fill="currentColor" stroke="none" />,
    box: <><path d="m12 2 9 5v10l-9 5-9-5V7l9-5ZM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5" /></>,
    home: <><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    bottle: <><path d="M9 3h6v4H9zM10 7v3H8a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2V7" /><path d="M9 14h6v4H9z" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 40, filter: 'blur(12px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .15 }} transition={{ duration: .9, ease, delay }}>{children}</motion.div>;
}

function LinkButton({ children, href, light = false, className = '', ...props }) {
  return <Magnet padding={25} maxOffset={4} magnetStrength={8}><a className={`link-button ${light ? 'light' : ''} ${className}`} href={href} {...props}><span>{children}</span><span className="button-arrow"><Icon /></span></a></Magnet>;
}

function useDialog(open, ref, close) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = ref.current?.querySelector('input, button, a');
    first?.focus();
    const keydown = e => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab') return;
      const nodes = [...ref.current.querySelectorAll('a[href],button,input,select,summary,[tabindex="0"]')].filter(n => !n.disabled && n.getClientRects().length);
      const firstNode = nodes[0], lastNode = nodes.at(-1);
      if (e.shiftKey && document.activeElement === firstNode) { e.preventDefault(); lastNode?.focus(); }
      else if (!e.shiftKey && document.activeElement === lastNode) { e.preventDefault(); firstNode?.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); previous?.isConnected && previous.focus(); };
  }, [open]);
}

function NewsletterForm({ t }) {
  const host = useRef(null);
  useEffect(() => {
    if (!config.shopify) return;
    const node = document.getElementById('oa-native-newsletter');
    if (!node) return;
    host.current.appendChild(node);
    node.hidden = false;
    node.querySelector('label').textContent = t.email;
    node.querySelector('input[type=email]').placeholder = t.email;
    node.querySelector('button').setAttribute('aria-label', t.subscribe);
  }, [t]);
  if (config.shopify) return <div ref={host} />;
  return <div className="preview-newsletter"><a className="text-link" href={shop('/#contact_form')}>{t.subscribe}<Icon name="right" /></a><small>{t.previewNewsletter}</small></div>;
}

function Overlay({ type, close, t, lang, setLang, onSearch }) {
  const ref = useRef(null);
  useDialog(true, ref, close);
  return <motion.div ref={ref} className={`overlay ${type}`} role="dialog" aria-modal="true" aria-label={type === 'search' ? t.search : t.menu} initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }} exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .55, ease }}>
    <div className="overlay-top"><a href="#inicio" onClick={close} className="wordmark">ORIENTAL AROMAS<span>WHOLESALE</span></a><div className="overlay-top-actions"><button className="icon-button" onClick={onSearch} aria-label={t.search}><Icon name="search" /></button><button className="icon-button" onClick={close} aria-label={t.close}><Icon name="close" /></button></div></div>
    {type === 'search' ? <div className="search-content"><p className="eyebrow">ORIENTAL AROMAS — EXPLORER</p><h2>{t.search}</h2><form action={shop('/search')} method="get"><input type="hidden" name="type" value="product" /><label className="sr-only" htmlFor="oa-search">{t.search}</label><input id="oa-search" name="q" type="search" required placeholder={t.searchPlaceholder} autoComplete="off" /><button className="icon-button" aria-label={t.searchButton}><Icon name="right" /></button></form><div className="search-suggestions">{brandLinks.slice(0, 6).map(([name, slug]) => <a key={slug} href={collection(slug)}>{name}<Icon /></a>)}</div></div> : <>
      <div className="overlay-scroll">
        <nav className="overlay-main" aria-label={lang === 'es' ? 'Menú principal' : 'Main menu'}>{[[t.catalog, collection('all')], [t.arrivals, collection('new-arrivals')], [t.about, '#nosotros'], [t.contact, '#contacto']].map(([label, href], i) => <motion.a href={href} onClick={close} key={href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .1 + i * .06, duration: .6, ease }}><sup>0{i + 1}</sup>{label}<Icon /></motion.a>)}</nav>
        <div className="overlay-groups">{[[t.brands, brandLinks], [t.categories, t.categoryLinks], [t.extras, t.extraLinks]].map(([title, links]) => <details className="overlay-group" key={title}><summary><span>{title}</span><span className="overlay-group-count">{links.length}</span><Icon name="plus" /></summary><div className="overlay-group-links">{links.map(([name, slug]) => <a key={slug} href={collection(slug)} onClick={close}>{name}<Icon /></a>)}</div></details>)}</div>
      </div>
      <div className="overlay-bottom"><a href={wa}>WhatsApp <Icon /></a><a href={shop('/account')}>{t.account} <Icon /></a><div className="language-options"><button onClick={() => setLang('es')} aria-pressed={lang === 'es'}>ESPAÑOL</button><span>/</span><button onClick={() => setLang('en')} aria-pressed={lang === 'en'}>ENGLISH</button></div></div>
    </>}
  </motion.div>;
}

function MobileDock({ t, lang, onOpenChange, disabled }) {
  const [panel, setPanel] = useState(null);
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const close = () => setPanel(null);
  const groups = {
    brands: { title: t.fragrances, links: brandLinks, icon: 'bottle', label: t.fragrances },
    categories: { title: t.categories, links: t.categoryLinks, icon: 'grid', label: t.categories },
    extras: { title: t.extras, links: t.extraLinks, icon: 'box', label: t.dockExtras },
  };
  const current = groups[panel];
  useDialog(!!panel, ref, close);
  useEffect(() => { onOpenChange(!!panel); }, [panel, onOpenChange]);
  useEffect(() => {
    const mobile = matchMedia('(max-width: 1180px)');
    const resize = () => { if (!mobile.matches) setPanel(null); };
    mobile.addEventListener('change', resize);
    return () => mobile.removeEventListener('change', resize);
  }, []);
  useEffect(() => { if (disabled) setPanel(null); }, [disabled]);
  const items = [
    { id: 'home', label: 'Home', href: '#inicio', icon: 'home' },
    { id: 'catalog', label: 'Wholesale Catalog', href: collection('all'), icon: 'bag' },
    { id: 'arrivals', label: 'New Arrivals', href: collection('new-arrivals'), icon: 'plus' },
    { id: 'brands', label: 'Fragrances', icon: 'bottle', group: true },
    { id: 'categories', label: 'Categories', icon: 'grid', group: true },
    { id: 'extras', label: 'Extras', icon: 'box', group: true },
    { id: 'about', label: 'About Us', href: '#nosotros', icon: 'user' },
    { id: 'contact', label: 'Contact', href: '#contacto', icon: 'chat' },
  ];
  const renderItem = item => item.group ? <button className={`mobile-dock-item ${panel === item.id ? 'is-selected' : ''}`} key={item.id} aria-expanded={panel === item.id} aria-controls={`oa-dock-${item.id}`} onClick={() => setPanel(previous => previous === item.id ? null : item.id)}>
    {panel === item.id && <motion.span className="mobile-dock-selection" layoutId="oa-dock-selection" aria-hidden="true" transition={{ duration: reduce ? 0 : .2, ease }} />}
    <Icon name={item.icon} /><span>{item.label}</span><Icon name="right" className="dock-chevron" />
  </button> : <a className="mobile-dock-item" href={item.href} key={item.id} onClick={close}><Icon name={item.icon} /><span>{item.label}</span></a>;

  return <div ref={ref} className="mobile-dock-shell" role={panel ? 'dialog' : undefined} aria-modal={panel ? true : undefined} aria-label={t.dockNavigation} inert={disabled ? true : undefined}>
    <AnimatePresence initial={false}>
      {current && <motion.div key="scrim" className="mobile-dock-scrim" aria-hidden="true" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .18 }} />}
      {current && <motion.section key={panel} id={`oa-dock-${panel}`} className="mobile-dock-panel" aria-labelledby={`oa-dock-title-${panel}`} initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} transition={{ duration: reduce ? 0 : .22, ease }}>
        <div className="mobile-dock-panel-heading"><div><p>{lang === 'es' ? 'EXPLORA ORIENTAL AROMAS' : 'EXPLORE ORIENTAL AROMAS'}</p><h2 id={`oa-dock-title-${panel}`}>{current.title}</h2></div><button className="icon-button" onClick={close} aria-label={t.close}><Icon name="close" /></button></div>
        <div className="mobile-dock-panel-links">{current.links.map(([label, slug]) => <a href={collection(slug)} key={slug} onClick={close}><span>{label}</span><Icon name="right" /></a>)}</div>
        <a className="mobile-dock-panel-all" href={collection('all')} onClick={close}>{t.all}<Icon name="right" /></a>
      </motion.section>}
    </AnimatePresence>
    <nav className="mobile-dock" aria-label={t.dockNavigation}>
      <div className="mobile-dock-track">{items.map(renderItem)}</div>
    </nav>
  </div>;
}

function CinematicStory({ t, children, chromeOpacity }) {
  const section = useRef(null), first = useRef(null), second = useRef(null);
  const firstFilm = useRef(null), secondFilm = useRef(null), information = useRef(null);
  const content = useRef(null), exit = useRef(null), welcome = useRef(null);
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const transitionProgress = useMotionValue(0);
  const { scrollYProgress: progress } = useScroll({ target: section, offset: ['start start', 'end start'] });

  useEffect(() => {
    const videos = [first.current, second.current];
    const playbackEvents = ['playing', 'waiting', 'stalled', 'pause'];
    const reportPlayback = event => { if (import.meta.env.DEV) console.debug('[intro-playback]', event.type, videos[0].currentTime.toFixed(3), videos[0].readyState); };
    if (import.meta.env.DEV) playbackEvents.forEach(event => videos[0].addEventListener(event, reportPlayback));
    const state = { targets: [0, 0], active: [true, false], frame: 0, visible: true, scrubbing: false, origin: 0, start: 0 };
    let metrics;
    const clamp = value => Math.max(0, Math.min(1, value));
    const smooth = value => value * value * (3 - 2 * value);
    const seek = () => {
      state.frame = 0;
      if (!state.visible || document.hidden || reduce || !state.scrubbing) return;
      videos.forEach((video, index) => {
        video.pause();
        if (!state.active[index] || video.seeking || !Number.isFinite(video.duration)) return;
        const target = Math.min(video.duration - .05, Math.max(0, state.targets[index]));
        if (Math.abs(video.currentTime - target) > .035) {
          try { video.currentTime = target; } catch { /* Wait for metadata. */ }
        }
      });
    };
    const queue = () => { if (!state.frame) state.frame = requestAnimationFrame(seek); };
    const render = value => {
      if (!metrics) return;
      const distance = value * metrics.range, h = metrics.height;
      if (state.scrubbing && distance <= 2) {
        state.scrubbing = false;
        state.origin = 0;
        state.start = 0;
        section.current.dataset.playback = 'auto';
        if (!reduce && state.visible && !document.hidden) videos[0].play().catch(() => {});
      }
      if (!state.scrubbing && distance > 2) {
        state.scrubbing = true;
        state.origin = distance;
        state.start = videos[0].currentTime;
        videos.forEach(video => video.pause());
        section.current.dataset.playback = 'scroll';
      }
      const entry = clamp((distance - (metrics.intro - h * .95)) / (h * .6));
      const swap = clamp((distance - (metrics.truck)) / (h * .4));
      const swapOut = smooth(clamp((distance - (metrics.truck - h * .35)) / (h * .3)));
      const swapIn = smooth(clamp((distance - (metrics.products - h * .85)) / (h * .6)));
      const sceneVisibility = reduce ? 1 : 1 - swapOut + swapIn;
      const heroVisibility = reduce ? 1 - smooth(entry) : 1 - smooth(clamp(distance / (h * .4)));
      const leave = clamp((distance - (metrics.range - h * .8)) / (h * .8));
      const entryEase = smooth(entry), swapEase = smooth(swap), leaveEase = smooth(leave);
      const phases = [entry, swap, swapIn, leave];
      const active = phases.find(phase => phase > 0 && phase < 1);
      const peak = active === undefined ? 0 : Math.sin(active * Math.PI);
      transitionProgress.set(reduce || active === undefined ? 0 : smooth(active));
      firstFilm.current.style.opacity = 1 - swapEase;
      secondFilm.current.style.opacity = swapEase;
      [firstFilm.current, secondFilm.current].forEach(film => {
        film.style.filter = reduce ? 'none' : `blur(${peak * 7}px) brightness(${1 + peak * .16})`;
        film.style.transform = `scale(${reduce ? 1 : 1 + peak * .045})`;
      });
      exit.current.style.opacity = leaveEase;
      information.current.style.opacity = reduce ? 1 : entryEase * sceneVisibility;
      information.current.style.pointerEvents = sceneVisibility < .1 || entryEase < .1 ? 'none' : 'auto';
      chromeOpacity.set(1);
      information.current.style.transform = 'none';
      section.current.querySelector('.intro-layout').style.transform = reduce ? 'none' : `perspective(1400px) translateZ(${-160 * (1 - entryEase)}px) scale(${.88 + entryEase * .12})`;
      information.current.style.filter = reduce ? 'none' : `blur(${(1 - entryEase) * 20 + (1 - sceneVisibility) * 18}px) brightness(${1 + peak * .35})`;
      content.current.style.opacity = 1 - leaveEase;
      content.current.style.filter = `blur(${reduce ? 0 : leaveEase * 18}px)`;
      content.current.style.transform = `scale(${reduce ? 1 : 1 - leaveEase * .04})`;
      const products = section.current.querySelector('.products-section');
      products.style.opacity = '1';
      products.style.transform = reduce ? 'none' : `perspective(1200px) translateZ(${-120 * (1 - swapIn)}px) scale(${.9 + swapIn * .1})`;
      products.style.filter = `blur(${reduce ? 0 : (1 - swapIn) * 16}px)`;
      welcome.current.style.opacity = heroVisibility;
      welcome.current.style.filter = reduce ? 'none' : `blur(${(1 - heroVisibility) * 15}px)`;
      welcome.current.style.pointerEvents = heroVisibility < .1 ? 'none' : 'auto';
      const heroGuide = section.current.querySelector('.story-hero-bottom');
      heroGuide.style.opacity = heroVisibility;
      heroGuide.style.visibility = heroVisibility < .05 ? 'hidden' : 'visible';
      state.active = [swapEase < .999 && leaveEase < 1, swapEase > .001 && leaveEase < 1];
      const duration = Math.max(0, (videos[0].duration || 20) - .05);
      state.targets[0] = distance < state.origin
        ? state.start * clamp(distance / Math.max(1, state.origin))
        : state.start + clamp((distance - state.origin) / Math.max(1, metrics.products - h * .2 - state.origin)) * (duration - state.start);
      const truckReveal = metrics.products - h * .85;
      const truckProgress = distance < truckReveal
        ? .62 * clamp((distance - metrics.truck) / Math.max(1, truckReveal - metrics.truck))
        : .62 + .38 * clamp((distance - truckReveal) / Math.max(1, metrics.range - h * .8 - truckReveal));
      state.targets[1] = truckProgress * Math.max(0, (videos[1].duration || 8) - .05);
      section.current.dataset.scene = leaveEase >= .99 ? 'complete' : swapEase >= .5 ? 'truck' : entryEase > 0 ? 'content' : 'discovery';
      queue();
    };
    const measure = () => {
      const layoutTop = node => { let top = 0; while (node && node !== section.current) { top += node.offsetTop; node = node.offsetParent; } return top; };
      metrics = {
        height: innerHeight,
        range: Math.max(1, section.current.offsetHeight),
        intro: layoutTop(section.current.querySelector('#nosotros')),
        products: layoutTop(section.current.querySelector('.products-section')),
        truck: layoutTop(section.current.querySelector('.collections-section')) + section.current.querySelector('.collections-section').offsetHeight + innerHeight * .3,
      };
      render(progress.get());
    };
    const ready = () => {
      render(progress.get());
      if (!state.scrubbing && !reduce && state.visible && !document.hidden) videos[0].play().catch(() => {});
    };
    videos.forEach(video => { video.addEventListener('loadedmetadata', ready); video.addEventListener('canplaythrough', ready); video.addEventListener('seeked', queue); });
    const observer = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (!state.visible) videos.forEach(video => video.pause());
      else if (!state.scrubbing && !reduce && !document.hidden) videos[0].play().catch(() => {});
      else queue();
    }, { threshold: .01 });
    const visibility = () => { if (document.hidden) videos.forEach(video => video.pause()); else ready(); };
    document.addEventListener('visibilitychange', visibility);
    observer.observe(section.current);
    const resize = new ResizeObserver(measure);
    resize.observe(section.current);
    window.addEventListener('resize', measure);
    const unsubscribe = progress.on('change', render);
    measure();
    return () => { playbackEvents.forEach(event => videos[0].removeEventListener(event, reportPlayback)); document.removeEventListener('visibilitychange', visibility); unsubscribe(); observer.disconnect(); resize.disconnect(); cancelAnimationFrame(state.frame); window.removeEventListener('resize', measure); videos.forEach(video => { video.removeEventListener('loadedmetadata', ready); video.removeEventListener('canplaythrough', ready); video.removeEventListener('seeked', queue); }); };
  }, [reduce, chromeOpacity]);

  return <div ref={section} id="inicio" className="cinematic-story cinematic-v3" data-scene="discovery" data-playback="auto">
    <div className="story-backdrop" aria-hidden="true">
      <div ref={firstFilm} className="story-film"><video ref={first} src={asset('discovery-pingpong.mp4')} poster={asset('discovery-end.webp')} autoPlay={!reduce} loop muted playsInline preload="auto" onPlaying={() => setLoaded(true)} /></div>
      <div ref={secondFilm} className="story-film story-truck" style={{ opacity: 0 }}><video ref={second} src={asset('truck-scroll.mp4')} poster={asset('intro-poster.webp')} muted playsInline preload="metadata" /></div>
      <div className="story-shade" /><div className="story-edge" /><div className="screen-grain" /><motion.div className="video-load-glow" initial={{ opacity: reduce ? 0 : .5 }} animate={{ opacity: loaded ? 0 : .5 }} transition={{ duration: 1.25, ease }} /><SceneTransition progress={transitionProgress} /><div ref={exit} className="story-exit" />
    </div>
    <div ref={content} className="story-content">
      <section className="story-hero" aria-label="Oriental Aromas Wholesale"><div className="story-hero-viewport">
        <h1 className="sr-only">Oriental Aromas Wholesale · {t.selection}</h1>
        <div ref={welcome} className="story-welcome"><span className="eyebrow">DUBAI FRAGRANCES / WHOLESALE</span><p>{t.heroNote.map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</p><LinkButton href="#nosotros">{t.scroll.replace('DESLIZA PARA ', '').replace('SCROLL TO ', '')}</LinkButton></div>
        <div className="story-hero-bottom"><span className="eyebrow">ORIENTAL AROMAS — WHOLESALE</span><a href="#nosotros">{t.scroll}<span>↓</span></a><span className="scroll-only-mark" aria-hidden="true">↕</span></div>
      </div></section>
      <div ref={information} className="story-information">{children}</div>
    </div>
  </div>;
}

function App() {
  const [lang, setLang] = useState(config.locale?.startsWith('en') ? 'en' : 'es');
  const [dockOpen, setDockOpen] = useState(false);
  const [overlay, setOverlay] = useState(null), [mega, setMega] = useState(false), [scrolled, setScrolled] = useState(false), [showBrands, setShowBrands] = useState(false);
  const t = copy[lang];
  const { scrollY } = useScroll();
  const chromeOpacity = useMotionValue(1);
  const chromeFilter = useTransform(chromeOpacity, value => `blur(${(1 - value) * 12}px)`);
  const chromePointer = useTransform(chromeOpacity, value => value < .1 ? 'none' : 'auto');
  useMotionValueEvent(scrollY, 'change', value => { const business = document.getElementById('comienzo'), footer = document.querySelector('.site-footer'); const next = !!business && value >= business.offsetTop - 110 && (!footer || value < footer.offsetTop - 110); setScrolled(current => current === next ? current : next); });
  useEffect(() => { document.documentElement.lang = lang; document.title = 'Oriental Aromas Wholesale — Dubai Fragrances'; }, [lang]);
  useEffect(() => {
    if (!mega) return;
    const esc = e => { if (e.key === 'Escape') setMega(false); };
    const outside = e => { if (!e.target.closest('.brand-nav')) setMega(false); };
    document.addEventListener('keydown', esc); document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', esc); document.removeEventListener('pointerdown', outside); };
  }, [mega]);
  const products = config.shopify ? (config.products || []) : previewProducts;
  return <MotionConfig reducedMotion="user"><div className="oa">
    <a className="skip-link" href="#colecciones">{lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
    <div className="page-shell" inert={overlay || dockOpen ? true : undefined}>
      <motion.header className={`site-header ${scrolled ? 'is-scrolled' : ''}`} style={{ opacity: chromeOpacity, filter: chromeFilter, pointerEvents: chromePointer }}>
        <div className="announcement"><a href={collection('all')}>{t.min}<Icon /></a><span>{t.shipping}</span><span>USD <i>·</i> <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}>{lang.toUpperCase()} <span>⌄</span></button></span></div>
        <div className="header-main"><a href="#inicio" className="logo-link" aria-label="Oriental Aromas Wholesale — Inicio"><img src={asset('logo.svg')} alt="Oriental Aromas Wholesale" width="169" height="72" /></a>
          <nav className="desktop-nav" aria-label={lang === 'es' ? 'Principal' : 'Main'}><a href={collection('all')}>{t.catalog}</a><a href={collection('new-arrivals')}>{t.arrivals}</a><div className="brand-nav" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setMega(false); }}><button aria-expanded={mega} aria-controls="oa-mega" onClick={() => setMega(!mega)}>{t.fragrances}<span className={mega ? 'rotated' : ''}>+</span></button><AnimatePresence>{mega && <motion.div id="oa-mega" className="mega-menu" initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: 8 }} transition={{ duration: .25 }}><p className="eyebrow">{t.brands}</p><div>{brandLinks.map(([name, slug]) => <a key={slug} href={collection(slug)}>{name}<Icon /></a>)}</div><a className="mega-all" href={collection('all')}>{t.all}<Icon /></a></motion.div>}</AnimatePresence></div><details className="nav-dropdown" name="oa-nav"><summary>{t.categories}</summary><div>{t.categoryLinks.map(([label, slug]) => <a key={slug} href={collection(slug)}>{label}</a>)}</div></details><details className="nav-dropdown" name="oa-nav"><summary>{t.extras}</summary><div>{t.extraLinks.map(([label, slug]) => <a key={slug} href={collection(slug)}>{label}</a>)}</div></details><a href="#nosotros">{t.about}</a><a href="#contacto">{t.contact}</a></nav>
          <div className="header-actions"><button className="icon-button" onClick={() => setOverlay('search')} aria-label={t.search}><Icon name="search" /></button><a className="icon-button account-link" href={shop('/account')} aria-label={t.account}><Icon name="user" /></a><a className="icon-button bag-link" href={shop('/cart')} aria-label={t.cart}><Icon name="bag" />{config.cartCount > 0 && <span>{config.cartCount}</span>}</a><button className="icon-button menu-toggle" onClick={() => setOverlay('menu')} aria-label={t.menu}><Icon name="menu" /></button></div>
        </div>
      </motion.header>
      <main>
        <CinematicStory t={t} chromeOpacity={chromeOpacity}>
        <section id="nosotros" className="intro-section section-space"><p className="eyebrow">{t.selection}<span>EST. DORAL, FL</span></p><div className="intro-layout"><Reveal><h2>{t.intro[0]}<br /><span>{t.intro[1]}</span></h2></Reveal><Reveal className="intro-copy" delay={.1}><span className="intro-symbol" aria-hidden="true">✳</span><p>{t.introBody}</p><a href={shop('/pages/about-new')} className="text-link">{t.about}<Icon /></a></Reveal></div></section>
        <section id="colecciones" className="collections-section section-space"><div className="section-heading"><Reveal><p className="eyebrow">{t.collectionLabel}</p><h2>{t.collectionTitle}<br /><span>{t.collectionItalic}</span></h2></Reveal><a className="text-link" href={collection('all')}>{t.all}<Icon /></a></div><div className="collection-grid">{t.cards.map(([title, label, slug], i) => <Reveal key={slug} delay={i * .1}><a className="collection-card" href={collection(slug)}><img src={asset(i === 0 ? 'dubai.webp' : 'sale.webp')} alt={i === 0 ? 'Al Haramain Amber Oud, Afnan Turathi y Orientica Oud Saffron' : 'Selección de fragancias: Yara y Hawas'} loading="lazy" width="507" height="492" /><div className="collection-overlay" /><div className="card-top"><span>{label}</span><span>0{i + 1}</span></div><div className="card-bottom"><h3>{title}</h3><span className="circle-arrow"><Icon /></span></div></a></Reveal>)}</div><div className="collection-categories">{[[lang === 'es' ? 'Para él' : 'For him', 'mens'], [lang === 'es' ? 'Para ella' : 'For her', 'womens'], [lang === 'es' ? 'Por docena' : 'By the dozen', 'wholesale-dozen-exclusives'], [t.extras, 'extras']].map(([name, slug]) => <a href={collection(slug)} key={slug}>{name}<Icon /></a>)}</div></section>
        <section className="products-section section-space"><div className="section-heading"><Reveal><p className="eyebrow">{t.featuredLabel}</p><h2>{t.featured}</h2></Reveal><a href={collection('new-arrivals')} className="text-link">{t.arrivals}<Icon /></a></div><div className="product-grid">{products.slice(0, 4).map((product, i) => <Reveal key={product.url} delay={i * .06}><a className="product-card" href={product.url.startsWith('https:') ? product.url : shop(product.url)}><div className="product-image"><span className="product-index">0{i + 1}</span><img src={config.products?.length ? product.image : asset(product.image)} alt={product.title} width="285" height="371" loading="lazy" /><span className="product-arrow"><Icon /></span></div><div className="product-info"><h3>{product.title}</h3><span>{product.price || t.productLink}<Icon /></span></div></a></Reveal>)}</div><div className="stock-link"><a href={collection('back-in-stock')} className="text-link">{lang === 'es' ? '¿Otra vez en tu lista? De nuevo disponibles' : 'Back on your list? Back in stock'}<Icon /></a></div></section>
        <section className="brands-section section-space"><p className="eyebrow">{t.brandLabel}</p><Reveal><h2>{t.brandTitle}</h2></Reveal><div className="brand-wordmarks">{[['AFNAN', 'afnan'], ['ARMAF', 'armaf'], ['LATTAFA', 'lataffa-and-alhambra'], ['AL HARAMAIN', 'haramain'], ['ORIENTICA', 'orientica'], ['FRENCH AVENUE', 'french-avenue']].map(([name, slug]) => <a href={collection(slug)} key={slug}>{name}<span>↗</span></a>)}</div><button className="text-link all-brands" onClick={() => setShowBrands(!showBrands)} aria-expanded={showBrands} aria-controls="all-brands">{t.brandsAll}<Icon name={showBrands ? 'close' : 'plus'} /></button><AnimatePresence>{showBrands && <motion.div className="expanded-brands" id="all-brands" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{brandLinks.map(([name, slug]) => <a href={collection(slug)} key={slug}>{name}<Icon /></a>)}</motion.div>}</AnimatePresence></section>
        </CinematicStory>
        <section id="comienzo" className="business-section section-space"><div className="business-orb" aria-hidden="true" /><p className="eyebrow">{t.startLabel}<span>ORIENTAL AROMAS / WHOLESALE</span></p><Reveal className="business-copy"><h2>{t.startA}<br /><span>{config.minimumLabel || t.startB}</span></h2><p>{t.startBody}</p><LinkButton href={collection('all')} light>{t.startCta}</LinkButton></Reveal><div className="benefits-grid">{t.benefits.map(([title, body], i) => <div key={title}><Icon name={['diamond', 'chat', 'globe', 'box'][i]} /><h3>{title}</h3><p>{body}</p></div>)}</div></section>
        <section id="preguntas" className="faq-section section-space"><Reveal><p className="eyebrow">{t.faqLabel}</p><h2>{t.faqTitle}</h2><a className="text-link" href={wa}>{t.talk}<Icon /></a></Reveal><div className="faq-list">{t.faqs.map(([question, answer], i) => <details key={question} name="oa-faq"><summary><span className="faq-index">0{i + 1}</span><span>{question}</span><Icon name="plus" /></summary><p>{answer}</p></details>)}</div></section>
        <section id="contacto" className="visit-section section-space"><div className="visit-graphic" aria-hidden="true"><div className="map-grid" /><span className="map-coordinate">DORAL / FLORIDA / USA</span><div className="map-point"><Icon name="pin" /><span>DORAL, FL</span></div><span className="map-bottom">ORIENTAL AROMAS — SHOWROOM</span></div><Reveal className="visit-content"><p className="eyebrow">{t.visitLabel}</p><h2>{t.visitTitle}</h2><p>{t.visitBody}</p><address>6371 NW 102nd Ave, Ste 102<br />Doral, Florida 33178<br /><span>{t.hours}</span></address><a href="tel:+17867319919" className="visit-phone">+1 (786) 731-9919</a><a href="mailto:Support@Orientalaromas.com" className="visit-email">Support@Orientalaromas.com</a><LinkButton href="https://www.google.com/maps/search/?api=1&query=6371%20NW%20102nd%20Ave%20Ste%20102%2C%20Doral%2C%20FL%2033178" target="_blank" rel="noopener noreferrer">{t.directions}</LinkButton></Reveal></section>
      </main>
      <footer className="site-footer section-space"><div className="footer-top"><div className="newsletter"><p className="eyebrow">THE ORIENTAL EDIT</p><h2>{t.newsletter}</h2><p>{t.newsletterBody}</p><NewsletterForm t={t} /></div><div className="footer-column"><p className="eyebrow">{t.info}</p><a href={collection('all')}>{t.catalog}</a><a href={collection('new-arrivals')}>{t.arrivals}</a><a href={collection('sale')}>Blowout sale</a><a href={shop('/pages/about-new')}>{t.about}</a></div><div className="footer-column"><p className="eyebrow">{t.help}</p><a href={shop('/policies/shipping-policy')}>{t.deliveries}</a><a href={shop('/policies/refund-policy')}>{t.refunds}</a><a href={shop('/pages/contact')}>{t.contact}</a><a href={wa}>WhatsApp ↗</a></div></div><div className="footer-wordmark">ORIENTAL AROMAS<span>WHOLESALE</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Oriental Aromas Wholesale.</span><div><a href={shop('/policies/privacy-policy')}>{t.policy}</a><a href={shop('/policies/terms-of-service')}>{t.terms}</a><a href={shop('/pages/accessibility-statement')}>{t.accessibility}</a></div><div className="social-links"><a href="https://www.instagram.com/orientallaromas/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" /></a><a href="https://www.tiktok.com/@orientalaromas.live" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><Icon name="tiktok" /></a><a href="https://www.facebook.com/profile.php?id=100069822069864" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon name="facebook" /></a></div></div></footer>
    </div>
    <MobileDock t={t} lang={lang} onOpenChange={setDockOpen} disabled={!!overlay} />
    <AnimatePresence>{overlay && <Overlay key={overlay} type={overlay} close={() => setOverlay(null)} t={t} lang={lang} setLang={setLang} onSearch={() => setOverlay('search')} />}</AnimatePresence>
  </div></MotionConfig>;
}

createRoot(root).render(<App />);

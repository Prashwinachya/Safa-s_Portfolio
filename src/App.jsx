import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, ExternalLink, Code2, Sparkles, Heart, Brain, Zap, Coffee, Star, BookOpen, Target, Rocket, Award, Home, User, Briefcase, Wrench, Mail } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from './useScrollAnimation';

const _particleCache = Array.from({ length: 12 }).map((_, i) => {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;
  return {
    left: (i * 83 + 17) % 100,
    top: (i * 47 + 9) % 100,
    size: 2 + (i % 4),
    duration: 12 + (i % 7) * 1.5,
    delay: (i * 0.9) % 6,
    opacity: 0.2 + ((i % 3) * 0.1),
    colorClass: i % 4 === 0 || i % 4 === 3 ? 'bg-accent/30' : 'bg-gray-400/50',
  };
});

const FloatingParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    <style>{`
      @keyframes _pFloat {
        0% { transform: translate3d(0, 0, 0); opacity: 0.25; }
        50% { transform: translate3d(-12px, -80px, 0); opacity: 0.45; }
        100% { transform: translate3d(0, 0, 0); opacity: 0.25; }
      }
      ._p { will-change: transform, opacity; animation: _pFloat linear infinite; }
    `}</style>
    {_particleCache.map((p, i) => (
      <div
        key={i}
        className={`_p absolute rounded-full ${p.colorClass}`}
        style={{
          left: `${p.left}%`,
          top: `${p.top}%`,
          width: p.size,
          height: p.size,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          opacity: p.opacity,
        }}
      />
    ))}
  </div>
);

/* ━━━ Magnetic Button ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const MagneticButton = ({ children, onClick, className = '', primary = false }) => {
  const buttonRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 500, damping: 20 });
  const springY = useSpring(y, { stiffness: 500, damping: 20 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={`relative px-8 py-3.5 rounded-lg font-semibold transition-all duration-300 overflow-hidden cursor-pointer ${primary
        ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-soft hover:shadow-soft-md'
        : 'border border-gray-300 text-gray-700 hover:border-accent hover:text-accent hover:shadow-accent-sm'
        } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
};

/* ━━━ Project Card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const ProjectCard = ({ project, index, isVisible }) => {
  const isFeatured = index === 0 || index === 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -10 }}
      animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: -10 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`group relative bg-white rounded-2xl p-0 overflow-hidden border transition-all duration-500 shadow-soft hover:shadow-soft-lg ${isFeatured
        ? 'border-accent/25'
        : 'border-gray-100 hover:border-accent/20'
        }`}
    >
      <div className="relative">
        {/* Card header */}
        <div className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:20px_20px]" />

          {isFeatured && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
              className="absolute top-4 right-4 bg-white text-accent text-xs font-bold px-3 py-1 rounded-full shadow-soft"
            >
              ✦ FEATURED
            </motion.div>
          )}

          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
            className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 border border-white/20"
          >
            <Sparkles className="w-7 h-7 text-white/90" />
          </motion.div>
        </div>

        {/* Card body */}
        <div className="p-8">
          <h3 className="text-2xl font-bold font-display mb-3 text-gray-900 group-hover:text-accent transition-colors duration-300">
            {project.title}
          </h3>

          <p className="text-gray-500 text-base mb-6 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {(project.tags || []).map((tag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.15 + i * 0.05 + 0.3 }}
                className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 transition-all duration-300 hover:bg-accent/5 hover:text-accent hover:border-accent/20 hover:scale-105"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ━━━ Skills Card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const categoryAccents = {
  Languages: { icon: '💻' },
  Frontend: { icon: '🎨' },
  Backend: { icon: '⚙️' },
  'Tools & Tech': { icon: '🛠️' },
};

const SkillsCard = ({ skillGroup, index, isVisible }) => {
  const accent = categoryAccents[skillGroup.category] || { icon: '📦' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={isVisible ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 40, rotate: -2 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="bg-white rounded-2xl p-8 border border-gray-100 shadow-soft hover:shadow-soft-lg hover:border-accent/15 transition-all duration-500"
    >
      <h3 className="text-xl font-bold font-display mb-6 pb-4 border-b border-gray-100 flex items-center gap-3 text-gray-900">
        <span className="text-lg">{accent.icon}</span>
        {skillGroup.category}
      </h3>
      <ul className="space-y-3">
        {skillGroup.items.map((skill, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3, delay: index * 0.12 + i * 0.06 }}
            className="text-gray-600 font-medium flex items-center gap-3 hover:text-gray-900 transition-colors duration-300 group/skill"
          >
            <span className="w-2 h-2 bg-accent rounded-full transition-all duration-300 group-hover/skill:scale-150" />
            {skill}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

/* ━━━ Section Heading ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SectionHeading = ({ title, subtitle, isVisible }) => (
  <div className="text-center mb-16">
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-4xl md:text-5xl font-bold font-display mb-4 text-gray-900"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-gray-500 text-lg max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ━━━ MAIN PORTFOLIO COMPONENT ━━━━━━━━━━━━━━━━━━━━━━ */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const { scrollY } = useScroll();

  const [aboutRef, isAboutVisible] = useScrollAnimation();
  const [projectsRef, isProjectsVisible] = useScrollAnimation();
  const [skillsRef, isSkillsVisible] = useScrollAnimation();
  const [contactRef, isContactVisible] = useScrollAnimation();

  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.92]);
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);
  const progressX = useTransform(scrollY, [0, 3000], [0, 1]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsNavScrolled(window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const projects = [
    {
      title: "A Multi-Modal Voice Liveness Detection Framework using Vocal Biomarkers",
      description: "A Multi-Modal Voice Liveness Detection Framework using Vocal Biomarkers is an AI-based system that verifies whether a voice sample is from a live human or a spoofed recording. By analyzing vocal biomarkers and multiple speech characteristics, the framework enhances authentication security, improves spoof detection accuracy, and helps prevent voice-based identity fraud in real-time applications.",
      link: "#",
      github: "#",
      color: "from-gray-700 to-gray-900",
      tags: ["Python", "Machine Learning", "Deep Learning", "Vocal Biomarkers"]
    },
    {
      title: "Smart Unified Project Recommendation System",
      description: "The Smart Unified Project Recommendation System is a web-based platform thatrecommends suitable project ideas by integrating data from GitHub repositories, public datasets, and research papers through automated API extraction. It employs a machine learning model to analyze and classify projects into easy, intermediate, and difficult levels while also assigning novelty and rating scores.",
      link: "#",
      github: "#",
      color: "from-gray-600 to-gray-800",
      tags: ["React", "Web Scraping", "REST API", "Metadata Extraction", "Machine Learning"]
    },
    {
      title: "PEER-LEARN : STUDY PARTNER FINDER",
      description: "Smart web application that provides instant previews for both keywords and URLs. It delivers concise definitions, extracts essential webpage metadata, and presents information in a clear, structured format. The application simplifies information retrieval, reduces search time, and enhances the user experience by providing quick insights without requiring users to open multiple links.",
      link: "#",
      github: "#",
      color: "from-gray-600 to-gray-800",
      tags: ["React", "Web Scraping", "REST API", "Metadata Extraction", "Machine Learning"]
    }
  ];

  const skills = [
    { category: "Languages", items: ["C", "C++", "JavaScript", "Python (Flask)"] },
    { category: "Frontend", items: ["HTML", "CSS"] },
    { category: "Databases", items: ["MongoDB", "MySQL"] },
    { category: "Tools", items: ["Docker"] }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50/60 via-gray-50 to-accent-100/40 text-gray-900 overflow-x-hidden font-sans">
      {/* Floating Particles */}
      <FloatingParticles />

      {/* ━━━ NAVIGATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full z-50"
      >
        {/* Scroll progress bar */}
        <motion.div
          className="absolute top-0 left-0 z-[60] h-[2px] bg-gradient-to-r from-accent via-accent-light to-gray-900 origin-left"
          style={{ scaleX: progressX }}
        />

        <div
          className={
            'w-full border-b transition-all duration-300 ease-out backdrop-blur-xl saturate-180 ' +
            (isNavScrolled
              ? 'bg-white/95 border-accent/25'
              : 'bg-white/70 border-gray-200/60')
          }
          style={{
            boxShadow: isNavScrolled
              ? '0 12px 30px -15px rgba(71, 85, 105, 0.25), 0 4px 12px -6px rgba(0, 0, 0, 0.06)'
              : '0 0px 0px rgba(0,0,0,0)',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div
              className="flex justify-between items-center w-full transition-all duration-300 ease-out"
              style={{ height: isNavScrolled ? '56px' : '64px' }}
            >
              {/* ━━━ LOGO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
              <motion.button
                onClick={() => scrollToSection('home')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                {/* Animated S monogram */}
                <motion.div
                  className="relative w-10 h-10 flex items-center justify-center"
                  whileHover={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Outer glow ring — cheap transform-based pulse */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-accent/40"
                    style={{
                      animation: '_logoRing 2.8s ease-out infinite',
                      willChange: 'transform, opacity',
                    }}
                  />
                  <style>{`@keyframes _logoRing{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.6)}}`}</style>
                  {/* Gradient circle badge */}
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-accent via-accent-dark to-gray-900 flex items-center justify-center shadow-md overflow-hidden">
                    {/* Inner shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/5" />
                    <span className="relative text-white font-black font-display text-lg tracking-tight select-none">
                      S
                    </span>
                  </div>
                </motion.div>

                {/* Name text */}
                <div className="flex flex-col items-start leading-none">
                  <span className="font-black font-display tracking-wide text-base md:text-lg text-gray-900 group-hover:text-accent-dark transition-colors duration-300">
                    Safa Rasheed
                  </span>
                  <span className="hidden sm:block text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold mt-1 group-hover:text-accent transition-colors duration-300">
                    Portfolio • 2026
                  </span>
                </div>
              </motion.button>

              {/* ━━━ DESKTOP NAV LINKS ━━━━━━━━━━━━━━━ */}
              <div className="hidden md:flex items-center gap-1">
                {[
                  { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
                  { id: 'about', label: 'About', icon: <User className="w-4 h-4" /> },
                  { id: 'projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
                  { id: 'skills', label: 'Skills', icon: <Wrench className="w-4 h-4" /> },
                  { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
                ].map((item, idx) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.3 + idx * 0.06 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0, scale: 0.97 }}
                    className={`relative group px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeSection === item.id
                      ? 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-md shadow-accent/30'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/70'
                      }`}
                  >
                    <span className={activeSection === item.id ? 'text-white' : 'text-gray-400 group-hover:text-accent transition-colors duration-300'}>
                      {item.icon}
                    </span>
                    {item.label}

                    {/* Tooltip indicator dot on hover (inactive only) */}
                    {activeSection !== item.id && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform duration-300" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* ━━━ RIGHT SIDE: CTA + MOBILE TOGGLE ━━━ */}
              <div className="flex items-center gap-3">

                {/* Mobile menu toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="md:hidden relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer transition-colors overflow-hidden group"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/8 group-hover:to-accent/0 transition-all duration-300" />
                  <div className="relative">
                    {isMenuOpen ? <X size={22} strokeWidth={2.4} /> : <Menu size={22} strokeWidth={2.4} />}
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ MOBILE MENU ━━━━━━━━━━━━━━━━━━━━━━━ */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden px-4 sm:px-6 pb-4"
            >
              <div className="rounded-3xl overflow-hidden border border-accent/15 shadow-xl shadow-gray-900/5"
                style={{ background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(24px)' }}>
                <div className="p-3 space-y-1">
                  {[
                    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
                    { id: 'about', label: 'About', icon: <User className="w-5 h-5" /> },
                    { id: 'projects', label: 'Projects', icon: <Briefcase className="w-5 h-5" /> },
                    { id: 'skills', label: 'Skills', icon: <Wrench className="w-5 h-5" /> },
                    { id: 'contact', label: 'Contact', icon: <Mail className="w-5 h-5" /> },
                  ].map((item, idx) => (
                    <motion.button
                      key={item.id}
                      onClick={() => { scrollToSection(item.id); setIsMenuOpen(false); }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      whileHover={{ x: 6 }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 group ${activeSection === item.id
                        ? 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-accent-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${activeSection === item.id
                        ? 'bg-white/18 text-white'
                        : 'bg-accent/8 text-accent-dark group-hover:bg-accent/15 transition-colors'
                        }`}>
                        {item.icon}
                      </div>
                      <span className="font-bold capitalize tracking-tight">{item.label}</span>
                      {activeSection === item.id && (
                        <motion.span
                          className="ml-auto flex items-center gap-1 text-xs font-semibold"
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          Active
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ━━━ HERO SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.section
        id="home"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="min-h-screen flex items-center justify-center pt-16 px-6 lg:px-12 relative overflow-hidden"
      >
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="h-full w-full bg-[radial-gradient(circle,#000_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Very subtle warm blobs — CSS-only, no scale to avoid repainting blur */}
        <div className="absolute inset-0 overflow-hidden">
          <style>{`
            @keyframes _blobA { 0%,100% { transform: translate3d(0,0,0) } 50% { transform: translate3d(40px,24px,0) } }
            @keyframes _blobB { 0%,100% { transform: translate3d(0,0,0) } 50% { transform: translate3d(-36px,-28px,0) } }
            ._blob { will-change: transform; }
          `}</style>
          <div
            className="_blob absolute top-1/4 right-1/4 w-[420px] h-[420px] rounded-full"
            style={{
              background: 'rgba(71, 85, 105, 0.05)',
              filter: 'blur(80px)',
              animation: '_blobA 14s ease-in-out infinite',
            }}
          />
          <div
            className="_blob absolute bottom-1/4 left-1/4 w-[360px] h-[360px] rounded-full"
            style={{
              background: 'rgba(156, 163, 175, 0.25)',
              filter: 'blur(80px)',
              animation: '_blobB 16s ease-in-out infinite',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto text-left relative z-10 w-full"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2"
          >
            <span className="text-sm font-medium text-accent tracking-widest px-5 py-2.5 bg-accent/5 rounded-full border border-accent/15">
              🚀 CSE UNDERGRAD AT Sahyadri College of Engineering and Management
            </span>
          </motion.div>

          {/* Hero headline */}
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold font-display mb-8 leading-[1.1]">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="block text-gray-400 font-light"
            >
              Hi, I'm
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="block text-gray-900"
            >
              Safa <span className="font-black">Rasheed.</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="block text-accent text-glow-accent"
            >
              I build smart experiences.
            </motion.span>
          </h1>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {['⚡ Software Developer', '🧠 Problem Solver', '💡 Creating Meaningful and Impactful Solutions', '💻 Tech Resource Person'].map((tag, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.1, y: -3 }}
                className="text-xs font-medium text-gray-500 bg-gray-50 rounded-full px-4 py-2 border border-gray-100 hover:border-accent/20 hover:text-accent transition-all duration-300"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex gap-4 flex-wrap"
          >
            <MagneticButton primary onClick={() => scrollToSection('projects')}>
              Explore Work
              <ChevronDown size={16} />
            </MagneticButton>
            <MagneticButton onClick={() => scrollToSection('contact')}>
              Get In Touch
            </MagneticButton>
            <MagneticButton onClick={() => window.open('https://drive.google.com/file/d/15A9C86L4VhLdJtOc_EK-f7TB9D-JUVaV/view?usp=sharing', '_blank')}>
              Resume
              <ExternalLink size={16} />
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-3 bg-accent rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ━━━ ABOUT SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="about"
        ref={aboutRef}
        className="min-h-screen py-24 px-6 lg:px-12 flex items-center relative overflow-hidden bg-gray-50/50"
      >
        {/* Animated warm blobs - Orange theme (CSS-only, 2 blobs, reduced blur) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <style>{`
            @keyframes _blob1 { 0%,100% { transform: translate3d(0,0,0) } 50% { transform: translate3d(50px,32px,0) } }
            @keyframes _blob2 { 0%,100% { transform: translate3d(0,0,0) } 50% { transform: translate3d(-44px,-28px,0) } }
          `}</style>
          <div
            className="absolute top-[10%] -left-[10%] w-[400px] h-[400px] rounded-full"
            style={{
              background: 'linear-gradient(135deg, #475569 0%, #E2E8F0 100%)',
              opacity: 0.22,
              filter: 'blur(80px)',
              animation: '_blob1 18s ease-in-out infinite',
              willChange: 'transform',
            }}
          />
          <div
            className="absolute bottom-[5%] -right-[10%] w-[440px] h-[440px] rounded-full"
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)',
              opacity: 0.14,
              filter: 'blur(80px)',
              animation: '_blob2 22s ease-in-out infinite',
              willChange: 'transform',
            }}
          />
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(circle,#000_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          {/* Section Heading - Orange/Black theme */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isAboutVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="px-5 py-2 rounded-full text-sm font-semibold backdrop-blur-md border border-white/60 shadow-lg bg-accent/5 text-accent-dark">
                <Sparkles className="w-4 h-4 inline mr-2 text-accent" />
                Get To Know Me
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isAboutVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-black font-display mb-6 leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-accent to-gray-900">
                About Me
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isAboutVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600"
            >
              A passionate developer crafting <span className="font-bold text-accent-dark">beautiful digital experiences</span> with code and creativity.
            </motion.p>
          </div>

          {/* Stats row - Orange theme */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isAboutVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-14"
          >
            {[
              { label: 'Projects Built', value: '10+', icon: <Rocket className="w-5 h-5" />, grad: 'from-gray-800 to-gray-950' },
              { label: 'Technologies', value: '20+', icon: <Code2 className="w-5 h-5" />, grad: 'from-accent-dark to-accent' },
              { label: 'Problems Solved', value: '150+', icon: <Brain className="w-5 h-5" />, grad: 'from-gray-700 to-gray-900' },
              { label: 'Cups of Coffee', value: '∞', icon: <Coffee className="w-5 h-5" />, grad: 'from-accent to-accent-light' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={isAboutVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1, type: 'spring', bounce: 0.5 }}
                whileHover={{ y: -8, scale: 1.04 }}
                className="relative group"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.grad} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`} />
                <div className="relative rounded-2xl p-5 md:p-6 backdrop-blur-xl border border-gray-200/60 shadow-soft hover:shadow-soft-lg transition-all duration-500 group-hover:border-accent/30 bg-white/80">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.grad} flex items-center justify-center mb-3 md:mb-4 shadow-md text-white`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-black font-display bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8" style={{ perspective: 1500 }}>
            {/* Left: Bio Card - Orange theme gradient border */}
            <motion.div
              initial={{ opacity: 0, x: -80, rotateY: -20 }}
              animate={isAboutVisible ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -80, rotateY: -20 }}
              transition={{ duration: 1, delay: 0.4, type: 'spring', bounce: 0.3 }}
              whileHover={{ scale: 1.015, rotateY: 4, rotateX: 4 }}
              className="lg:col-span-3 relative rounded-3xl overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Orange/Black gradient border */}
              <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-br from-accent via-gray-800 to-accent-light shadow-accent-md">
                <div className="w-full h-full rounded-[22px] bg-white/90 backdrop-blur-2xl p-8 md:p-10 relative">
                  {/* Floating decorative badges */}
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-4 -right-4 px-4 py-2 rounded-full text-white text-xs font-bold shadow-accent-md"
                    style={{ background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)' }}
                  >
                    <Heart className="w-3 h-3 inline mr-1 fill-accent" />
                    Tech Lover
                  </motion.div>

                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-accent/20 bg-accent/5">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-sm font-semibold text-accent-dark">Currently Building Awesome Things</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black font-display mb-4">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-accent-dark to-gray-900">
                        Hey, I'm Safa Rasheed! 👋
                      </span>
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-soft-md"
                        style={{ background: 'linear-gradient(135deg, #E2E8F0 0%, #475569 100%)' }}>
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                        I'm <span className="font-bold text-accent-dark">passionate</span> about building innovative software, solving complex problems, and continuously learning new technologies.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-soft-md"
                        style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                        Technology fascinates me because there's always something new to <span className="font-bold text-gray-900">discover</span>. I enjoy building practical solutions, exploring modern technologies, and constantly pushing beyond my comfort zone.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-soft-md"
                        style={{ background: 'linear-gradient(135deg, #475569 0%, #334155 100%)' }}>
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                        I believe in the power of technology to <span className="font-bold text-accent-dark">transform ideas into reality</span>. Driven by curiosity, I'm constantly exploring new frameworks and approaches to create meaningful solutions.
                      </p>
                    </div>
                  </div>

                  {/* Bottom signature accent */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      {[Star, Heart, Zap, Award].map((Icon, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.3, rotate: 15 }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 border border-gray-100 text-accent hover:text-accent-dark hover:bg-accent/5 hover:border-accent/20 transition-all"
                        >
                          <Icon className="w-4 h-4" />
                        </motion.div>
                      ))}
                    </div>
                    <MagneticButton className="text-sm py-2.5 px-5" primary onClick={() => scrollToSection('contact')}>
                      Let's Connect
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Info Cards - Orange theme */}
            <div className="lg:col-span-2 space-y-5">
              {/* Education Card */}
              <motion.div
                initial={{ opacity: 0, x: 80, scale: 0.85 }}
                animate={isAboutVisible ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 80, scale: 0.85 }}
                transition={{ duration: 0.8, delay: 0.5, type: 'spring', bounce: 0.5 }}
                whileHover={{ x: -10, y: -6, scale: 1.02 }}
                className="relative group rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-gray-900/5 to-accent-light/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-soft group-hover:shadow-soft-lg group-hover:border-accent/30 transition-all duration-500">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-soft-md"
                      style={{ background: 'linear-gradient(135deg, #475569 0%, #0F172A 100%)' }}
                    >
                      <BookOpen className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black font-display mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-accent-dark">
                        Education
                      </h3>
                      <p className="text-gray-800 font-bold mb-1">CSE Undergraduate</p>
                      <p className="text-gray-500 text-sm mb-3">Sahyadri College of Engineering and Management</p>
                      <div className="flex gap-2 flex-wrap">
                        {['Computer Science', 'Engineering', '2022-2026'].map((tag, i) => (
                          <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full border"
                            style={{
                              background: i === 1 ? 'rgba(0,0,0,0.03)' : 'rgba(71, 85, 105, 0.06)',
                              color: i === 1 ? '#1E293B' : '#334155',
                              borderColor: i === 1 ? 'rgba(0,0,0,0.08)' : 'rgba(71, 85, 105, 0.2)'
                            }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Interests Card */}
              <motion.div
                initial={{ opacity: 0, x: 80, scale: 0.85 }}
                animate={isAboutVisible ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 80, scale: 0.85 }}
                transition={{ duration: 0.8, delay: 0.65, type: 'spring', bounce: 0.5 }}
                whileHover={{ x: -10, y: -6, scale: 1.02 }}
                className="relative group rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/8 via-accent/10 to-gray-800/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-soft group-hover:shadow-soft-lg group-hover:border-accent/30 transition-all duration-500">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.7 }}
                      className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-soft-md"
                      style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)' }}
                    >
                      <Target className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black font-display mb-3 text-gray-900">
                        Areas of Interest
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'Web Dev', color: 'from-gray-900 to-gray-700' },
                          { name: 'AI/ML', color: 'from-accent-dark to-accent' },
                          { name: 'Cloud', color: 'from-gray-800 to-gray-600' },
                          { name: 'Problem Solving', color: 'from-accent to-accent-light' },
                          { name: 'UI/UX Design', color: 'from-gray-900 to-accent-dark' }
                        ].map((tag, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={isAboutVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
                            whileHover={{ scale: 1.15, y: -3 }}
                            className={`text-xs font-bold px-4 py-2 rounded-full text-white shadow-md cursor-pointer bg-gradient-to-r ${tag.color}`}
                          >
                            {tag.name}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Motivation Card */}
              <motion.div
                initial={{ opacity: 0, x: 80, scale: 0.85 }}
                animate={isAboutVisible ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 80, scale: 0.85 }}
                transition={{ duration: 0.8, delay: 0.8, type: 'spring', bounce: 0.5 }}
                whileHover={{ x: -10, y: -6, scale: 1.02 }}
                className="relative group rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-accent via-gray-900 to-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-full rounded-[22px] bg-white/90 backdrop-blur-xl" />
                </div>
                <div className="relative p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-soft group-hover:shadow-soft-lg group-hover:border-accent/30 transition-all duration-500">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      whileHover={{ scale: 1.15 }}
                      className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-soft-md"
                      style={{ background: 'linear-gradient(135deg, #475569 0%, #334155 100%)' }}
                    >
                      <Zap className="w-7 h-7 text-white fill-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black font-display mb-3 bg-clip-text text-transparent bg-gradient-to-r from-accent-dark via-gray-900 to-accent">
                        What Drives Me
                      </h3>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        <span className="text-accent-dark font-bold">Innovation</span>, <span className="text-gray-900 font-bold">continuous learning</span>, and creating <span className="text-accent-dark font-bold">solutions that matter</span>. Every line of code is a step toward something amazing!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      {/* ━━━ PROJECTS SECTION ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="projects"
        ref={projectsRef}
        className="min-h-screen py-24 px-6 lg:px-12 flex items-center relative"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="max-w-6xl mx-auto w-full">
          <SectionHeading
            title="Featured Projects"
            subtitle="Building modern, scalable, and user focused digital solutions."
            isVisible={isProjectsVisible}
          />

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                index={index}
                isVisible={isProjectsVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SKILLS SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="skills"
        ref={skillsRef}
        className="min-h-screen py-24 px-6 lg:px-12 flex items-center relative bg-gray-50/50"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="max-w-6xl mx-auto w-full">
          <SectionHeading
            title="Skills & Expertise"
            subtitle="Technologies and tools I work with"
            isVisible={isSkillsVisible}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skillGroup, index) => (
              <SkillsCard
                key={index}
                skillGroup={skillGroup}
                index={index}
                isVisible={isSkillsVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CONTACT SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="contact"
        ref={contactRef}
        className="min-h-screen py-24 px-6 lg:px-12 flex items-center relative"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="max-w-6xl mx-auto w-full text-center">
          <SectionHeading
            title="Let's Connect"
            subtitle="I'm always open to new opportunities and interesting projects. Feel free to reach out!"
            isVisible={isContactVisible}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isContactVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl p-12 border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all duration-500 relative overflow-hidden"
          >
            {/* Subtle accent glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] via-transparent to-gray-50/50 pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-2xl font-bold font-display mb-8 text-gray-900">
                Let's Build Something <span className="text-accent">Amazing</span> Together
              </h3>

              <div className="flex gap-4 justify-center flex-wrap">
                <motion.a
                  href="https://www.linkedin.com/in/safa-rasheed-26323b293/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 shadow-soft hover:shadow-soft-md transition-all duration-300"
                >
                  LinkedIn
                </motion.a>
                <motion.a
                  href="https://github.com/safarasheeed"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-accent hover:text-accent hover:shadow-accent-sm transition-all duration-300"
                >
                  GitHub
                </motion.a>
                <motion.a
                  href="mailto:safarasheed209@gmail.com"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark shadow-accent-sm hover:shadow-accent-md transition-all duration-300"

                >
                  Email
                </motion.a>
                <motion.a
                  href="tel:+918714050330"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-accent hover:text-accent hover:shadow-accent-sm transition-all duration-300"
                >
                  Phone
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="border-t border-gray-100 py-8 px-6 lg:px-12 bg-gray-50/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm mb-4">
            © 2026 Safa Rasheed. All rights reserved.
          </p>
          <div className="flex gap-6 justify-center">
            <a
              href="https://www.linkedin.com/in/safa-rasheed-26323b293/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent transition-colors duration-300 font-semibold"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/safarasheeed"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 transition-colors duration-300 font-semibold"
            >
              GitHub
            </a>
            <a
              href="mailto:safarasheed209@gmail.com"
              className="text-gray-400 hover:text-accent transition-colors duration-300 font-semibold"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

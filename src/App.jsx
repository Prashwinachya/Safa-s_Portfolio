import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, ExternalLink, Code2, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useScrollAnimation } from './useScrollAnimation';

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-zinc-500 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0.3
          }}
          animate={{
            y: [null, Math.random() * -100 - 50],
            x: [null, Math.random() * 40 - 20],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

// Magnetic Button Component
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
    const deltaX = (e.clientX - centerX) * 0.2;
    const deltaY = (e.clientY - centerY) * 0.2;
    x.set(deltaX);
    y.set(deltaY);
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
      className={`relative px-8 py-3 rounded-lg font-semibold transition-all duration-300 overflow-hidden ${
        primary
          ? 'bg-white text-black hover:bg-zinc-200'
          : 'border border-zinc-700 text-white hover:bg-zinc-900 hover:border-zinc-600'
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// Project Card Component
const ProjectCard = ({ project, index, isVisible }) => {
  // Mark first and last project as featured
  const isFeatured = index === 0 || index === 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -10 }}
      animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: -10 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative bg-zinc-900/80 rounded-2xl p-0 overflow-hidden border transition-all duration-500 ${isFeatured ? 'border-yellow-500/30' : 'border-zinc-800 hover:border-zinc-600'}`}
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      
      <div className="relative">
        {/* Project Header with Gradient Background */}
        <div className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
          {/* Featured Badge */}
          {isFeatured && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
              className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg"
            >
              FEATURED
            </motion.div>
          )}
          
          {/* Project Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Project Content */}
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 group-hover:bg-clip-text transition-all duration-300">
            {project.title}
          </h3>
          
          <p className="text-zinc-400 text-base mb-6 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.15 + i * 0.05 + 0.3 }}
                className="text-xs font-semibold text-zinc-300 bg-zinc-800/80 rounded-full px-4 py-2 transition-all duration-300 hover:bg-zinc-700 hover:text-white hover:scale-110"
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

// Skills Card Component
const SkillsCard = ({ skillGroup, index, isVisible }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, rotate: -2 }}
    animate={isVisible ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 40, rotate: -2 }}
    transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
    whileHover={{ y: -4, scale: 1.02, rotate: 1 }}
    className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-500"
  >
    <h3 className="text-xl font-bold mb-6 pb-4 border-b-2 border-zinc-800 flex items-center gap-2">
      <Code2 className="w-5 h-5" />
      {skillGroup.category}
    </h3>
    <ul className="space-y-3">
      {skillGroup.items.map((skill, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
          className="text-zinc-300 font-medium flex items-center gap-3 hover:text-white transition-colors duration-300"
        >
          <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 hover:scale-150" />
          {skill}
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { scrollY } = useScroll();
  
  const [aboutRef, isAboutVisible] = useScrollAnimation();
  const [projectsRef, isProjectsVisible] = useScrollAnimation();
  const [skillsRef, isSkillsVisible] = useScrollAnimation();
  const [contactRef, isContactVisible] = useScrollAnimation();

  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  const projects = [
    {
      title: "V Finance",
      description: "A comprehensive financial management and tracking platform built to streamline transactions and user portfolios.",
      tags: ["Java", "Web Technologies", "Database"],
      link: "#",
      github: "#",
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Industry Equipment System",
      description: "An inventory and equipment tracking system designed for industrial applications to monitor machinery status and maintenance.",
      tags: ["C Programming", "System Architecture", "UI/UX"],
      link: "#",
      github: "#",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Vote Fraud Detection System",
      description: "A secure and transparent voting application with advanced algorithms to detect and prevent fraudulent activities during elections.",
      tags: ["Java", "Security", "Algorithms"],
      link: "#",
      github: "#",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Career Guidance System",
      description: "An interactive platform helping students and professionals navigate their career paths through personalized recommendations.",
      tags: ["Web Dev", "API Integration", "Database"],
      link: "#",
      github: "#",
      color: "from-orange-500 to-red-600"
    }
  ];

  const skills = [
    { category: "Languages", items: ["Python", "JavaScript", "Java", "C++", "SQL"] },
    { category: "Frontend", items: ["React", "HTML/CSS", "Tailwind CSS", "Responsive Design"] },
    { category: "Backend", items: ["Node.js", "Express", "MongoDB", "Firebase"] },
    { category: "Tools & Tech", items: ["Git", "Docker", "REST APIs", "Machine Learning"] }
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-zinc-800 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <span className="text-lg font-bold tracking-wide bg-gradient-to-r from-white via-zinc-300 to-white bg-clip-text text-transparent">
                PN Bhavish
              </span>
            </motion.div>

            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'projects', 'skills', 'contact'].map((item, idx) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-sm font-medium transition-all duration-300 relative group ${
                    activeSection === item ? 'text-white' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
                    activeSection === item ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 space-y-3">
              {['home', 'about', 'projects', 'skills', 'contact'].map((item) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 8 }}
                  className="block w-full text-left text-sm font-medium text-zinc-300 hover:text-white py-2 capitalize"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        id="home"
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen flex items-center justify-center pt-16 px-6 lg:px-12 relative overflow-hidden"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, -30, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-6xl mx-auto text-left relative z-10 w-full"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2"
          >
            <span className="text-sm font-medium text-zinc-400 tracking-widest px-4 py-2 bg-zinc-900/50 rounded-full border border-zinc-800">
              🚀 CSE UNDERGRAD AT SAHYADRI COLLEGE OF ENGINEERING & MANAGEMENT
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="block"
            >
              Hi, I'm
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="block bg-gradient-to-r from-white via-zinc-200 to-white bg-clip-text text-transparent"
            >
              PN Bhavish.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"
            >
              I build smart experiences.
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {['⚡ Emerging Tech Enthusiast', '🧠 Problem Solver', '💡 Curious Mind', '💻 Technophile'].map((tag, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-xs font-medium text-zinc-300 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2 transition-all duration-300 hover:border-zinc-600"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex gap-4 flex-wrap"
          >
            <MagneticButton primary onClick={() => scrollToSection('projects')}>
              Explore Work
              <ChevronDown size={16} className="ml-2" />
            </MagneticButton>
            <MagneticButton onClick={() => scrollToSection('contact')}>
              Get In Touch
            </MagneticButton>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className="min-h-screen bg-zinc-950 py-20 px-6 lg:px-12 flex items-center relative"
      >
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isAboutVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            About Me
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={isAboutVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-zinc-900/80 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-600 transition-all duration-500 hover:shadow-xl"
            >
              <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                I'm a passionate CSE undergraduate at Sahyadri College of Engineering & Management with a keen interest in emerging technologies and problem-solving.
              </p>
              <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                As a curious mind and technophile, I love exploring new frameworks, tools, and approaches to build meaningful solutions. Whether it's web development, AI/ML, or cloud technologies, I'm always eager to learn and create.
              </p>
              <p className="text-zinc-300 text-lg leading-relaxed">
                My journey in tech is driven by the desire to make an impact, collaborate with brilliant minds, and continuously push the boundaries of what's possible.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                { title: '🎓 Education', desc1: 'CSE Undergraduate', desc2: 'Sahyadri College of Engineering & Management' },
                { title: '🎯 Focus Areas', desc1: 'Web Development • AI/ML • Cloud Computing • Problem Solving' },
                { title: '💡 What Drives Me', desc1: 'Innovation, continuous learning, and creating solutions that matter' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 60 }}
                  animate={isAboutVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
                  transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-500"
                >
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  {item.desc1 && <p className="text-zinc-400">{item.desc1}</p>}
                  {item.desc2 && <p className="text-zinc-500 text-sm">{item.desc2}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        ref={projectsRef}
        className="min-h-screen py-20 px-6 lg:px-12 flex items-center relative"
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isProjectsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
          >
            Featured Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isProjectsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center text-zinc-400 text-lg mb-16"
          >
            Showcasing my work and passion for building innovative solutions
          </motion.p>

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

      {/* Skills Section */}
      <section
        id="skills"
        ref={skillsRef}
        className="min-h-screen bg-zinc-950 py-20 px-6 lg:px-12 flex items-center relative"
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isSkillsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
          >
            Skills & Expertise
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isSkillsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center text-zinc-400 text-lg mb-16"
          >
            Technologies and tools I work with
          </motion.p>

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

      {/* Contact Section */}
      <section
        id="contact"
        ref={contactRef}
        className="min-h-screen py-20 px-6 lg:px-12 flex items-center relative"
      >
        <div className="max-w-6xl mx-auto w-full text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isContactVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Let's Connect
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isContactVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-zinc-400 text-xl mb-12"
          >
            I'm always open to new opportunities and interesting conversations. Feel free to reach out!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isContactVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-12 hover:border-zinc-600 transition-all duration-500"
          >
            <h3 className="text-2xl font-bold mb-8">Let's Build Something Amazing Together</h3>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.a
                href="https://www.linkedin.com/in/p-n-bhavish-300233293/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-all duration-300"
              >
                LinkedIn
              </motion.a>
              <motion.a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300"
              >
                GitHub
              </motion.a>
              <motion.a
                href="mailto:pnbhavish@gmail.com"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300"
              >
                Email
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-8 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-zinc-500 text-sm mb-4">
            © 2024 PN Bhavish. All rights reserved.
          </p>
          <div className="flex gap-6 justify-center">
            <a href="https://www.linkedin.com/in/p-n-bhavish-300233293/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors font-semibold">
              LinkedIn
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors font-semibold">
              GitHub
            </a>
            <a href="mailto:pnbhavish@gmail.com" className="text-zinc-500 hover:text-white transition-colors font-semibold">
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

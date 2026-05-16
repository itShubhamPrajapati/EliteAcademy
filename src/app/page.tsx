'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, BarChart3, MessageCircle, FileText, Shield, ArrowRight, GraduationCap, Star, Clock, Users, CheckCircle2 } from 'lucide-react'
import LeadModal from '@/components/modals/LeadModal'
import SyllabusModal from '@/components/modals/SyllabusModal'

const features = [
  {
    icon: BookOpen,
    title: 'Weekly Mock Tests',
    desc: 'Simulated exam environments every week to build stamina, improve time management, and identify weak areas early.',
    wide: true,
    color: '#0A84FF',
  },
  {
    icon: MessageCircle,
    title: 'One-on-One Doubt Solving',
    desc: 'Personalized attention via in-app chat to ensure no concept is ever left misunderstood.',
    wide: false,
    color: '#32D74B',
  },
  {
    icon: FileText,
    title: 'Curated Study Material',
    desc: 'Expert notes aligned perfectly with the latest SSC Maharashtra Board syllabus.',
    wide: false,
    color: '#FF9F0A',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    desc: 'Real-time dashboards for students and parents tracking scores, attendance, and growth trends.',
    wide: true,
    color: '#BF5AF2',
  },
]

const stats = [
  { value: '200+', label: 'Students Enrolled' },
  { value: '95%', label: 'Board Exam Pass Rate' },
  { value: '4.9★', label: 'Parent Satisfaction' },
  { value: '6 yrs', label: 'Teaching Excellence' },
]

export default function LandingPage() {
  const [isLeadOpen, setIsLeadOpen] = useState(false)
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false)

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden">
      <LeadModal isOpen={isLeadOpen} onClose={() => setIsLeadOpen(false)} />
      <SyllabusModal isOpen={isSyllabusOpen} onClose={() => setIsSyllabusOpen(false)} />

      {/* ── NAV ── */}
      <nav className="sticky top-4 z-50 mx-4 md:mx-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 bg-white/[0.06] backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-[#0A84FF]">Elite</span>Academy
          </Link>
          <ul className="hidden md:flex gap-8 items-center">
            {['Programs', 'Batches', 'Faculty'].map(item => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  onClick={(e) => handleScroll(e, item.toLowerCase())}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(10,132,255,0.4)] hover:shadow-[0_0_28px_rgba(10,132,255,0.6)]"
          >
            Portal Login <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="px-4 md:px-8 pt-20 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A84FF]/10 border border-[#0A84FF]/20 rounded-full text-[#0A84FF] text-sm font-semibold">
                <Star size={14} fill="currentColor" /> Academic Year 2025–26 Enrollments Open
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                Master 9th & 10th.
                <br />
                <span className="text-[#0A84FF]">Ace the Boards.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Expert guidance, weekly mock tests, real-time progress tracking, and a proven strategy for academic excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setIsLeadOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-[#0A84FF] text-white text-base font-bold px-8 py-4 rounded-2xl shadow-[0_0_24px_rgba(10,132,255,0.5)] hover:shadow-[0_0_36px_rgba(10,132,255,0.7)] hover:bg-[#0A84FF]/90 transition-all"
                >
                  <GraduationCap size={18} /> Join the Next Batch
                </button>
                <button 
                  onClick={() => setIsSyllabusOpen(true)}
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 text-base font-semibold px-8 py-4 rounded-2xl transition-all hover:bg-white/5"
                >
                  <Clock size={18} /> Explore Syllabus
                </button>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {stats.map(s => (
                  <div key={s.label} className="text-center lg:text-left">
                    <div className="text-2xl font-extrabold text-white">{s.value}</div>
                    <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right – Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative flex justify-center items-center"
            >
              <div className="absolute inset-0 bg-[#0A84FF]/20 rounded-full blur-[100px] scale-75" />
              <div className="relative w-full max-w-lg rounded-3xl overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
                <div className="bg-[#0A84FF]/10 border-b border-white/10 px-6 py-4 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF453A]" />
                    <div className="w-3 h-3 rounded-full bg-[#FF9F0A]" />
                    <div className="w-3 h-3 rounded-full bg-[#32D74B]" />
                  </div>
                  <span className="text-xs text-white/40 font-mono">eliteacademy.com/dashboard</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[{ l: 'Attendance', v: '92%', c: '#32D74B' }, { l: 'Avg Score', v: '84%', c: '#0A84FF' }, { l: 'Tests', v: '12', c: '#FF9F0A' }].map(k => (
                      <div key={k.l} className="bg-white/5 rounded-xl p-3 border border-white/[0.06]">
                        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{k.l}</div>
                        <div className="text-xl font-extrabold" style={{ color: k.c }}>{k.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/[0.06]">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Recent Test Scores</div>
                    <div className="space-y-2">
                      {[
                        { name: 'Unit Test 1 – Algebra', score: 38, max: 50 },
                        { name: 'Science: Force & Motion', score: 45, max: 50 },
                        { name: 'Mid-Term Examination', score: 76, max: 100 },
                      ].map(t => {
                        const pct = Math.round((t.score / t.max) * 100)
                        return (
                          <div key={t.name} className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-white/70 truncate">{t.name}</div>
                              <div className="h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
                                <div className="h-full rounded-full bg-[#0A84FF]" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                            <span className="text-xs font-bold text-white shrink-0">{t.score}/{t.max}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS BENTO ── */}
      <section id="programs" className="px-4 md:px-8 py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">The Elite Advantage</h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">A structured approach to ensure you peak at exactly the right time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-3xl p-8 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-default ${f.wide ? 'md:col-span-2' : ''}`}
              >
                <div className="absolute top-6 right-6 w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${f.color}20` }}>
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 pr-12">{f.title}</h3>
                <p className="text-white/50 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BATCH SELECTION ── */}
      <section id="batches" className="px-4 md:px-8 py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Select Your Journey</h2>
            <p className="text-lg text-white/50">Programs crafted for your academic year.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class 9 Card */}
            <div className="flex flex-col bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-white/20 hover:bg-white/[0.07] transition-all">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-[#32D74B]/10 text-[#32D74B] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  <GraduationCap size={12} /> Foundation
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">Class 9th Batch</h3>
                <p className="text-white/50 leading-relaxed">Build the critical concepts and mathematical foundations needed for high school success and board exam prep.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Core Subjects: Math, Science, English', 'Monthly Assessments & Report Cards', 'Concept Building Workshops', 'Parent Progress Updates'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                    <div className="w-5 h-5 rounded-full bg-[#32D74B]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#32D74B]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsLeadOpen(true)}
                className="w-full text-center border border-white/20 text-white font-bold py-4 rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all"
              >
                Apply Now
              </button>
            </div>

            {/* Class 10 Card – Featured */}
            <div className="relative flex flex-col bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(10,132,255,0.15)]">
              <div className="absolute top-6 right-6 bg-[#0A84FF] text-white text-xs font-bold px-3 py-1 rounded-full">
                Recommended
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-[#0A84FF]/20 text-[#0A84FF] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  <Shield size={12} /> Board Target
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">Class 10th Batch</h3>
                <p className="text-white/60 leading-relaxed">Intensive preparation focused purely on maximizing board exam scores with proven strategies and targeted practice.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Full SSC Board Syllabus Coverage', 'Weekly Board-Pattern Mock Tests', 'Previous Year Paper Analysis', 'One-on-One Doubt Chat', 'Downloadable Progress Reports'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                    <div className="w-5 h-5 rounded-full bg-[#0A84FF]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsLeadOpen(true)}
                className="w-full text-center bg-[#0A84FF] text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(10,132,255,0.4)] hover:bg-[#0A84FF]/90 hover:shadow-[0_0_28px_rgba(10,132,255,0.6)] transition-all"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FACULTY ── */}
      <section id="faculty" className="px-4 md:px-8 py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Our Master Faculty</h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">Learn from educators who have helped thousands of students achieve their dream results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-40 h-40 rounded-3xl bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                <Users className="text-primary" size={60} />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <div>
                  <h3 className="text-2xl font-bold text-white">Prof. Rajesh Mehta</h3>
                  <p className="text-primary font-semibold">Mathematics Specialist</p>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  With over 12 years of experience in SSC Board coaching, Prof. Mehta specializes in making complex Algebra and Geometry concepts simple and intuitive.
                </p>
                <div className="flex gap-2 justify-center md:justify-start">
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-wider text-white/40 border border-white/5">12+ Yrs Exp</div>
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-wider text-white/40 border border-white/5">98% Success</div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-40 h-40 rounded-3xl bg-success/20 flex items-center justify-center shrink-0 overflow-hidden">
                <Users className="text-success" size={60} />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <div>
                  <h3 className="text-2xl font-bold text-white">Dr. Sunita Sharma</h3>
                  <p className="text-success font-semibold">Science & Tech Expert</p>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  Dr. Sharma brings academic rigor and real-world scientific context to Physics, Chemistry, and Biology, ensuring students score perfectly in Science.
                </p>
                <div className="flex gap-2 justify-center md:justify-start">
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-wider text-white/40 border border-white/5">PhD Science</div>
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-wider text-white/40 border border-white/5">Authored 3 Books</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] px-4 md:px-8 py-12 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 max-w-sm">
            <div className="text-2xl font-extrabold tracking-tight">
              <span className="text-[#0A84FF]">Elite</span>Academy
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Empowering students in 9th and 10th standard with systematic education, premium tools, and dedicated mentorship.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10" />
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10" />
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="text-white font-bold">Platform</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li><a href="#" className="hover:text-primary transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold">Company</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-white font-bold">Support</h4>
              <p className="text-sm text-white/40">Email: support@eliteacademy.com</p>
              <p className="text-sm text-white/40">Phone: +91 98765 43210</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-white/20">© 2025 EliteAcademy Tuition Center. All rights reserved.</p>
          <div className="flex gap-6">
            <CheckCircle2 size={16} className="text-success/40" />
            <span className="text-[10px] uppercase tracking-widest text-white/20">Secure Server Verified</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

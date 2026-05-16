'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, GraduationCap, Microscope, Languages, History } from 'lucide-react'

interface SyllabusModalProps {
  isOpen: boolean
  onClose: () => void
}

const syllabusData = {
  maths: {
    title: 'Mathematics',
    icon: <BookOpen className="text-primary" />,
    items: ['Algebra (Part 1)', 'Geometry (Part 2)']
  },
  science: {
    title: 'Science & Tech',
    icon: <Microscope className="text-success" />,
    items: ['Science & Technology Part 1 (Physics/Chem)', 'Science & Technology Part 2 (Bio/EVS)']
  },
  languages: {
    title: 'Languages',
    icon: <Languages className="text-warning" />,
    items: ['English (Kumarbharati)', 'Marathi (Aksharbharati)', 'Hindi (Lokbharati)']
  },
  social: {
    title: 'Social Sciences',
    icon: <History className="text-destructive" />,
    items: ['History & Political Science', 'Geography']
  }
}

export default function SyllabusModal({ isOpen, onClose }: SyllabusModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <GraduationCap className="text-primary" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Maharashtra Board SSC Syllabus</h2>
                  <p className="text-white/40 text-sm">Official Curriculum for 9th & 10th Standard</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/5"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(syllabusData).map(([key, section]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {section.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-white/60 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-3xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-primary font-medium">
                  Looking for detailed chapter-wise weightage? 
                  <span className="block text-sm text-primary/60 mt-1">Download our comprehensive prep guide after signing up.</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

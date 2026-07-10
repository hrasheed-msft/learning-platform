import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgramStore } from '@/stores/programStore';
import { useFamilyStore } from '@/stores/familyStore';
import { useAuthStore } from '@/stores';
import type { LearningPath, Program } from '@/types/program';
import type { FamilyMember } from '@/types';

const PATH_INFO: Record<LearningPath, { emoji: string; label: string; schedule: string; description: string; color: string }> = {
  AFTER_SCHOOL: {
    emoji: '🕘',
    label: 'After-School Path',
    schedule: '3–4 evenings a week',
    description: 'Full curriculum — deep dives into every subject with comprehensive lessons, activities, and assessments.',
    color: 'from-emerald-500 to-green-700',
  },
  WEEKEND: {
    emoji: '📅',
    label: 'Weekend Path',
    schedule: 'Once a week',
    description: 'Core essentials — focused sessions covering the most important foundations of Islamic knowledge.',
    color: 'from-teal-500 to-cyan-700',
  },
};

interface EnrollModalProps {
  program: Program;
  onClose: () => void;
}

function EnrollModal({ program, onClose }: EnrollModalProps) {
  const { members } = useFamilyStore();
  const { enrollInProgram, isEnrolling, error, clearError } = useProgramStore();
  const navigate = useNavigate();

  const learners = members.filter((m) => (m.isActive ?? true) && !m.isAccountOwner);
  const [selectedMemberId, setSelectedMemberId] = useState(learners[0]?.id ?? '');
  const [selectedPath, setSelectedPath] = useState<LearningPath>('AFTER_SCHOOL');
  const [enrolled, setEnrolled] = useState(false);

  const selectedMember = learners.find((m) => m.id === selectedMemberId);

  useEffect(() => {
    if (!selectedMemberId && learners.length > 0) {
      setSelectedMemberId(learners[0].id);
    }
  }, [learners, selectedMemberId]);

  // Detect starting stage based on age
  function detectStageNumber(member: FamilyMember | undefined): number | undefined {
    if (!member) return undefined;
    const age = member.age;
    const match = program.stages.find((s) => age >= s.ageMin && age <= s.ageMax);
    return match?.stageNumber;
  }

  async function handleEnroll() {
    if (!selectedMemberId) return;
    clearError();
    const stageNumber = detectStageNumber(selectedMember);
    await enrollInProgram(program.id, selectedMemberId, selectedPath, stageNumber);
    setEnrolled(true);
  }

  if (enrolled) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">
            Enrolled! Masha'Allah!
          </h2>
          <p className="text-gray-600 mb-6">
            <strong>{selectedMember?.name}</strong> has been enrolled in the{' '}
            {PATH_INFO[selectedPath].label}. Their journey begins now!
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/child/maktab')}
              className="px-6 py-3 bg-[#1a5632] text-white font-semibold rounded-xl hover:bg-[#154526] transition min-h-[44px]"
            >
              View Dashboard 🌟
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition min-h-[44px]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="enroll-modal-title">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in">
        <div className="flex items-center justify-between mb-6">
          <h2 id="enroll-modal-title" className="text-xl font-heading font-bold text-gray-800">
            Enroll in {program.name}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Choose learner */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            👧 Who is enrolling?
          </label>
          {learners.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-500">
              No child learner profiles found.{' '}
              <a href="/settings" className="text-[#1a5632] underline font-medium">
                Add a learner in Settings first
              </a>
              .
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {learners.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMemberId(m.id)}
                  className={`p-3 rounded-xl border-2 text-left transition min-h-[44px] ${
                    selectedMemberId === m.id
                      ? 'border-[#1a5632] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-800">{m.name}</p>
                  <p className="text-xs text-gray-500">Age {m.age}</p>
                  {detectStageNumber(m) && (
                    <p className="text-xs text-green-700 font-medium mt-1">
                      → Stage {detectStageNumber(m)}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Choose path */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🛤️ Choose a learning path
          </label>
          <div className="grid grid-cols-1 gap-3">
            {(['AFTER_SCHOOL', 'WEEKEND'] as LearningPath[]).map((path) => {
              const info = PATH_INFO[path];
              return (
                <button
                  key={path}
                  onClick={() => setSelectedPath(path)}
                  className={`p-4 rounded-xl border-2 text-left transition min-h-[44px] ${
                    selectedPath === path
                      ? 'border-[#1a5632] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{info.emoji}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{info.label}</p>
                      <p className="text-xs text-gray-500">{info.schedule}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={() => void handleEnroll()}
          disabled={!selectedMemberId || isEnrolling}
          className="w-full py-3 bg-[#1a5632] text-white font-bold text-lg rounded-xl hover:bg-[#154526] disabled:opacity-50 disabled:cursor-not-allowed transition min-h-[44px]"
        >
          {isEnrolling ? 'Enrolling…' : '✨ Start the Journey!'}
        </button>
      </div>
    </div>
  );
}

export default function ProgramCatalog() {
  const { programs, fetchPrograms, isLoading } = useProgramStore();
  const { family } = useAuthStore();
  const { fetchMembers, fetchLearners } = useFamilyStore();
  const [showModal, setShowModal] = useState(false);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);

  useEffect(() => {
    void fetchPrograms();
  }, [fetchPrograms]);

  useEffect(() => {
    if (family?.id) {
      void fetchMembers(family.id);
      return;
    }
    void fetchLearners();
  }, [family?.id, fetchMembers, fetchLearners]);

  function handleEnrollClick(program: Program) {
    setActiveProgram(program);
    setShowModal(true);
  }

  // While loading, show skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f5] p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a5632]" />
      </div>
    );
  }

  // MVP: showcase a single program (or fall back to static display)
  const program = programs[0] ?? null;

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a5632] to-[#0d3320] text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="text-5xl mb-4">🕌</div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Maktab An Naṣīḥah
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            A complete Islamic curriculum for children — from the foundations of faith
            to the beauty of Qur'ān, Fiqh, Sīrah, and more.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 text-sm font-medium text-green-100">
            <span>✨</span>
            <span>Ages 4–16 · Structured stages · Progress tracking</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Learning Paths */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2 text-center">
            Choose Your Path
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Both paths cover the same rich curriculum — choose the schedule that fits your family.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(['AFTER_SCHOOL', 'WEEKEND'] as LearningPath[]).map((path) => {
              const info = PATH_INFO[path];
              return (
                <div
                  key={path}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  <div className={`h-3 bg-gradient-to-r ${info.color}`} />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{info.emoji}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{info.label}</h3>
                        <span className="text-sm font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          {info.schedule}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{info.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subjects preview */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2 text-center">
            What Your Child Will Learn
          </h2>
          <p className="text-gray-500 text-center mb-8">
            A well-rounded Islamic education covering all the essential subjects.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { emoji: '📗', subject: "Qur'ān" },
              { emoji: '🕋', subject: "Du'ā" },
              { emoji: '✨', subject: '99 Names' },
              { emoji: '🕌', subject: 'Fiqh' },
              { emoji: '📜', subject: 'Aḥādīth' },
              { emoji: '🌙', subject: 'Sīrah' },
              { emoji: '📖', subject: 'Tārīkh' },
              { emoji: '☪️', subject: "Aqā'id" },
              { emoji: '🌸', subject: 'Akhlāq' },
              { emoji: '🤲', subject: 'Ādāb' },
            ].map(({ emoji, subject }) => (
              <div
                key={subject}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <p className="text-sm font-semibold text-gray-700">{subject}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stage overview */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2 text-center">
            Stages of Learning
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Your child is automatically placed in the right stage based on their age.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(program?.stages ?? DEFAULT_STAGES).map((stage) => (
              <div
                key={stage.stageNumber}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-[#1a5632] text-white text-xs font-bold flex items-center justify-center">
                    {stage.stageNumber}
                  </span>
                  <h3 className="font-bold text-gray-800">{stage.name}</h3>
                </div>
                <p className="text-xs text-gray-500">Ages {stage.ageMin}–{stage.ageMax}</p>
                {stage.description && (
                  <p className="text-sm text-gray-600 mt-2 leading-snug">{stage.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#1a5632] to-[#0d3320] rounded-2xl p-8 text-center text-white">
          <div className="text-4xl mb-3">🌟</div>
          <h2 className="text-2xl font-heading font-bold mb-2">
            Ready to Begin?
          </h2>
          <p className="text-green-100 mb-6 max-w-md mx-auto">
            Start your child's Islamic learning journey today. Their stage is auto-detected — enrollment takes less than a minute.
          </p>
          <button
            onClick={() => handleEnrollClick(program ?? PLACEHOLDER_PROGRAM)}
            className="px-8 py-4 bg-white text-[#1a5632] font-bold text-lg rounded-xl hover:bg-green-50 transition shadow-lg min-h-[44px]"
          >
            ✨ Enroll Now
          </button>
        </div>
      </div>

      {showModal && activeProgram && (
        <EnrollModal
          program={activeProgram}
          onClose={() => {
            setShowModal(false);
            setActiveProgram(null);
          }}
        />
      )}
    </div>
  );
}

// Static fallback stages for display before API responds
const DEFAULT_STAGES = [
  { stageNumber: 1, name: 'Seedling', ageMin: 4, ageMax: 5, description: 'First steps in faith — simple duas, ABC of Islam.', id: '1', orderIndex: 1, courses: [] },
  { stageNumber: 2, name: 'Sprout', ageMin: 6, ageMax: 7, description: 'Growing foundations — short surahs, basic fiqh.', id: '2', orderIndex: 2, courses: [] },
  { stageNumber: 3, name: 'Sapling', ageMin: 8, ageMax: 9, description: 'Building knowledge — seerah, akhlaq, expanding Quran.', id: '3', orderIndex: 3, courses: [] },
  { stageNumber: 4, name: 'Tree', ageMin: 10, ageMax: 11, description: 'Deepening understanding — hadith, history, aqeedah.', id: '4', orderIndex: 4, courses: [] },
  { stageNumber: 5, name: 'Orchard', ageMin: 12, ageMax: 13, description: 'Mature understanding — advanced fiqh, classical texts.', id: '5', orderIndex: 5, courses: [] },
  { stageNumber: 6, name: 'Scholar', ageMin: 14, ageMax: 16, description: 'Completing the curriculum — ready for advanced study.', id: '6', orderIndex: 6, courses: [] },
];

const PLACEHOLDER_PROGRAM = {
  id: 'maktab-an-nasihah',
  slug: 'maktab-an-nasihah',
  name: 'Maktab An Naṣīḥah Curriculum',
  learningPaths: ['AFTER_SCHOOL', 'WEEKEND'] as LearningPath[],
  isPublished: true,
  stages: DEFAULT_STAGES,
};

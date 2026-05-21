import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, Loader2, X } from 'lucide-react';
import clsx from 'clsx';
import { useFamilyStore } from '@/stores/familyStore';
import { useAuthStore } from '@/stores/authStore';
import { familyService } from '@/services/familyService';
import type { CreateMemberRequest } from '@/types';

const TILE_COLORS = [
  'border-emerald-400 bg-emerald-50',
  'border-blue-400 bg-blue-50',
  'border-purple-400 bg-purple-50',
  'border-amber-400 bg-amber-50',
  'border-rose-400 bg-rose-50',
  'border-teal-400 bg-teal-50',
  'border-indigo-400 bg-indigo-50',
  'border-orange-400 bg-orange-50',
];

const AVATAR_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-orange-500',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function SelectLearner() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { members, selectedMember, isLoading, error, fetchLearners, selectMember, selfEnroll } =
    useFamilyStore();
  const [enrolling, setEnrolling] = useState(false);

  // Add learner modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    fetchLearners();
  }, [fetchLearners]);

  const handleSelectMember = (member: typeof members[0]) => {
    selectMember(member);
    navigate('/dashboard');
  };

  const handleSelfEnroll = async () => {
    setEnrolling(true);
    try {
      const member = await selfEnroll();
      selectMember(member);
      navigate('/dashboard');
    } catch {
      // error is set in the store
    } finally {
      setEnrolling(false);
    }
  };

  const handleAddLearner = async () => {
    if (!newName.trim() || !newAge) return;
    setAddingMember(true);
    setAddError(null);
    try {
      const memberData: CreateMemberRequest = {
        name: newName.trim(),
        age: parseInt(newAge, 10),
      };
      await familyService.addMember('current', memberData);
      await fetchLearners();
      setNewName('');
      setNewAge('');
      setShowAddModal(false);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add learner');
    } finally {
      setAddingMember(false);
    }
  };

  // If user already has a selected member (came here to switch), show them in the list
  const showCurrentBadge = selectedMember !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-3xl text-white font-arabic">ع</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-gray-900">
          Who's learning today?
        </h1>
        <p className="text-gray-500 mt-2 max-w-md">
          Select a learner profile to continue. Progress, streaks, and achievements are tracked per learner.
        </p>
      </div>

      {/* Loading state */}
      {isLoading && members.length === 0 && (
        <div className="flex items-center gap-2 text-gray-400 py-12">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading learners…</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm max-w-md text-center">
          {error}
        </div>
      )}

      {/* Learner tiles */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl w-full">
          {members.map((member, idx) => {
            const colorIdx = idx % TILE_COLORS.length;
            const isCurrent = showCurrentBadge && selectedMember?.id === member.id;
            return (
              <button
                key={member.id}
                onClick={() => handleSelectMember(member)}
                className={clsx(
                  'relative flex flex-col items-center gap-3 p-6 rounded-2xl border-3 transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400',
                  TILE_COLORS[colorIdx],
                  isCurrent && 'ring-2 ring-primary-500'
                )}
              >
                {/* Avatar */}
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                  />
                ) : (
                  <div
                    className={clsx(
                      'w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow',
                      AVATAR_COLORS[colorIdx]
                    )}
                  >
                    {getInitials(member.name)}
                  </div>
                )}

                {/* Name */}
                <span className="font-semibold text-gray-800 text-sm text-center truncate w-full">
                  {member.name}
                </span>

                {/* Current badge */}
                {isCurrent && (
                  <span className="absolute top-2 right-2 text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </button>
            );
          })}

          {/* "I'm learning too" / Self-enroll tile */}
          <button
            onClick={handleSelfEnroll}
            disabled={enrolling}
            className={clsx(
              'flex flex-col items-center gap-3 p-6 rounded-2xl border-3 border-dashed border-gray-300 bg-white/60 transition-all hover:scale-105 hover:shadow-lg hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400',
              enrolling && 'opacity-60 pointer-events-none'
            )}
          >
            {enrolling ? (
              <Loader2 className="w-16 h-16 text-primary-400 animate-spin" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
            )}
            <span className="font-semibold text-primary-700 text-sm text-center">
              I'm learning too
            </span>
            <span className="text-xs text-gray-400">
              {user?.name ? `Add ${user.name}` : 'Add myself'}
            </span>
          </button>

          {/* Add a learner tile (opens modal) */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border-3 border-dashed border-gray-300 bg-white/60 transition-all hover:scale-105 hover:shadow-lg hover:border-secondary-400 focus:outline-none focus:ring-2 focus:ring-secondary-400"
          >
            <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-secondary-600" />
            </div>
            <span className="font-semibold text-secondary-700 text-sm text-center">
              Add a learner
            </span>
            <span className="text-xs text-gray-400">Child or student</span>
          </button>
        </div>
      )}

      {/* Add Learner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => { setShowAddModal(false); setAddError(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Add a learner</h2>
            <p className="text-sm text-gray-500 mb-5">Create a new learner profile for your family.</p>

            {addError && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {addError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="learner-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="learner-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ahmad"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="learner-age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  id="learner-age"
                  type="number"
                  min="3"
                  max="99"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  placeholder="e.g. 8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowAddModal(false); setAddError(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLearner}
                disabled={addingMember || !newName.trim() || !newAge}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {addingMember && <Loader2 className="w-4 h-4 animate-spin" />}
                Add learner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

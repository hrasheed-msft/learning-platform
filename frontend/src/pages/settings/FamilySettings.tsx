import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Users, CheckCircle, AlertCircle, Crown, Trash2, Plus, Key, Lock, ShieldCheck } from 'lucide-react';
import { familyService } from '@/services/familyService';
import { authService } from '@/services/authService';
import { useAuthStore, useFamilyStore } from '@/stores';
import SetCredentialsModal from '@/components/SetCredentialsModal';
import type { Family, CreateMemberRequest } from '@/types/user';

export default function FamilySettings() {
  const { user } = useAuthStore();
  const { members, fetchMembers } = useFamilyStore();
  
  const [family, setFamily] = useState<Family | null>(null);
  const [familyName, setFamilyName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // New member form
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAge, setNewMemberAge] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [credentialsMember, setCredentialsMember] = useState<{ id: string; name: string } | null>(null);
  const [pinStatus, setPinStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch family and members
        const familyData = await familyService.getFamily(user?.familyId || 'current');
        setFamily(familyData);
        setFamilyName(familyData.name);
        
        await fetchMembers(familyData.id);
        
        // Fetch PIN status in parallel (non-blocking)
        authService.getParentPinStatus().then(({ hasPin }) => setPinStatus(hasPin)).catch(() => {});
      } catch (err) {
        console.error('Failed to fetch family:', err);
        setError('Failed to load family settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFamily();
  }, [fetchMembers, user?.familyId]);

  const handleSave = async () => {
    if (!family) return;
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      
      const updatedFamily = await familyService.updateFamily(family.id, {
        name: familyName,
      });
      
      setFamily(updatedFamily);
      setSuccess('Family settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to save family settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberName.trim() || !newMemberAge || !family) return;
    
    try {
      setAddingMember(true);
      setError(null);
      
      const memberData: CreateMemberRequest = {
        name: newMemberName.trim(),
        age: parseInt(newMemberAge, 10),
      };
      
      await familyService.addMember(family.id, memberData);
      await fetchMembers(family.id);
      
      // Reset form
      setNewMemberName('');
      setNewMemberAge('');
      setShowAddMember(false);
      setSuccess('Member added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to add member:', err);
      setError('Failed to add member. Please try again.');
    } finally {
      setAddingMember(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeletingMemberId(memberId);
      setError(null);
      
      if (!family) return;
      await familyService.removeMember(family.id, memberId);
      await fetchMembers(family.id);
      
      setSuccess('Member removed successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to delete member:', err);
      setError('Failed to remove member. Please try again.');
    } finally {
      setDeletingMemberId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading family settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Family Settings</h1>
      
      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Family Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Family Name</label>
            <Input
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Enter family name"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Subscription</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <Crown className="w-5 h-5 text-yellow-500 mr-2" />
              <p className="font-medium capitalize">
                Current Plan: {family?.subscriptionStatus || 'Free'}
              </p>
            </div>
            {family?.subscriptionExpiresAt && (
              <p className="text-sm text-gray-500 mt-1">
                Expires: {new Date(family.subscriptionExpiresAt).toLocaleDateString()}
              </p>
            )}
            <p className="text-sm text-gray-500">Upgrade to unlock more features</p>
          </div>
          <Button variant="outline">Upgrade Plan</Button>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
              <Lock className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Parent PIN</h2>
              {pinStatus === false ? (
                <p className="text-sm text-amber-700 mt-0.5">
                  ⚠️ No PIN set — anyone can switch to the parent account from a child profile.
                </p>
              ) : pinStatus === true ? (
                <p className="text-sm text-green-700 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> PIN active — account switching is protected.
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-0.5">Protect account switching with a 4-digit PIN.</p>
              )}
            </div>
          </div>
          <Link to="/settings/pin">
            <Button variant="outline" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {pinStatus ? 'Update PIN' : 'Set PIN'}
            </Button>
          </Link>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Family Members</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowAddMember(!showAddMember)}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
        
        {/* Add Member Form */}
        {showAddMember && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-3">Add New Family Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={newMemberAge}
                  onChange={(e) => setNewMemberAge(e.target.value)}
                  placeholder="Enter age"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleAddMember} 
                disabled={addingMember || !newMemberName.trim() || !newMemberAge}
              >
                {addingMember ? 'Adding...' : 'Add Member'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddMember(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {/* Members List */}
        <div className="space-y-3">
          {members.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No family members added yet.</p>
          ) : (
            members.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500">
                      Age: {member.age} • {member.ageCategory.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCredentialsMember({ id: member.id, name: member.name })}
                    className="flex items-center text-xs"
                  >
                    <Key className="w-3 h-3 mr-1" />
                    Set Login
                  </Button>
                  <Link 
                    to={`/family/${member.id}/progress`}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    View Progress
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleDeleteMember(member.id)}
                    disabled={deletingMemberId === member.id}
                    className="text-red-500 hover:bg-red-50"
                  >
                    {deletingMemberId === member.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving || !familyName.trim()}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Set Credentials Modal */}
      {credentialsMember && (
        <SetCredentialsModal
          isOpen={true}
          onClose={() => setCredentialsMember(null)}
          memberId={credentialsMember.id}
          memberName={credentialsMember.name}
        />
      )}
    </div>
  );
}

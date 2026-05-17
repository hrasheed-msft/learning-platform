import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { childAuthService } from '@/services/childAuthService';
import { CheckCircle, AlertCircle, Eye, EyeOff, Key } from 'lucide-react';

interface SetCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
}

export default function SetCredentialsModal({
  isOpen,
  onClose,
  memberId,
  memberName,
}: SetCredentialsModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isValid =
    username.trim().length >= 3 &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await childAuthService.setCredentials(memberId, {
        username: username.trim(),
        password,
      });
      setSuccess(`Credentials set! Username: ${result.username}`);
      // Reset password fields but keep username shown
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Set Login for ${memberName}`} size="md">
      {success ? (
        <div className="text-center py-4">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="font-medium text-gray-800 mb-1">Credentials Set Successfully!</p>
          <p className="text-sm text-gray-600 mb-4">{success}</p>
          <p className="text-xs text-gray-400 mb-4">
            {memberName} can now log in at the Student Login page.
          </p>
          <Button onClick={handleClose} variant="outline">
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 mb-2 p-3 bg-primary-50 rounded-lg">
            <Key className="w-5 h-5 text-primary-600" />
            <p className="text-sm text-primary-700">
              Set login credentials for <strong>{memberName}</strong> to access the student portal.
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. ahmad_student"
            helperText="At least 3 characters. Must be unique."
            error={username.length > 0 && username.trim().length < 3 ? 'Username must be at least 3 characters' : undefined}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password.length > 0 && password.length < 6 && (
              <p className="text-sm text-red-600 mt-1">Password must be at least 6 characters</p>
            )}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            error={
              confirmPassword.length > 0 && password !== confirmPassword
                ? 'Passwords do not match'
                : undefined
            }
          />

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
              Set Credentials
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/authService';

const WEAK_PINS = new Set(['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321', '0123', '9876']);

function PinInput({
  value,
  onChange,
  label,
  show,
  onToggleShow,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  label: string;
  show: boolean;
  onToggleShow: () => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  const handleChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[idx] = digit;
    onChange(next);
    if (digit && idx < 3) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={onToggleShow}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
        >
          {show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="flex gap-3">
        {value.map((d, idx) => (
          <input
            key={idx}
            ref={(el) => { refs.current[idx] = el; }}
            type={show ? 'text' : 'password'}
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl outline-none transition-colors focus:border-primary-500"
          />
        ))}
      </div>
    </div>
  );
}

export default function ParentPinSetup() {
  const navigate = useNavigate();
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const [pin, setPin] = useState(['', '', '', '']);
  const [confirm, setConfirm] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const { hasPin: hp } = await authService.getParentPinStatus();
      setHasPin(hp);
    } catch {
      setHasPin(false);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const validate = (): string | null => {
    const p = pin.join('');
    const c = confirm.join('');
    if (p.length < 4) return 'Please fill in all 4 digits.';
    if (WEAK_PINS.has(p)) return 'PIN is too simple. Avoid sequences like 1234 or repeated digits.';
    if (p !== c) return 'PINs do not match. Please try again.';
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError(null);
    setSaving(true);
    try {
      await authService.setParentPin(pin.join(''));
      setSuccessMsg(hasPin ? 'PIN updated successfully!' : 'PIN set! Account switching is now protected.');
      setHasPin(true);
      setPin(['', '', '', '']);
      setConfirm(['', '', '', '']);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      setValidationError('Failed to save PIN. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const pinFull = pin.every((d) => d !== '');
  const confirmFull = confirm.every((d) => d !== '');

  return (
    <div className="max-w-md mx-auto p-6">
      <button
        onClick={() => navigate('/settings')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Settings
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
          <Lock className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent PIN</h1>
          <p className="text-sm text-gray-500">
            {hasPin ? 'Update your 4-digit account-switch PIN' : 'Set a PIN to protect account switching'}
          </p>
        </div>
      </div>

      {statusLoading ? (
        <div className="flex items-center gap-2 text-gray-400 py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500" />
          <span>Checking PIN status…</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          {hasPin && (
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">A PIN is already set. Enter a new PIN below to update it.</p>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{successMsg}</p>
            </div>
          )}

          {validationError && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{validationError}</p>
            </div>
          )}

          <PinInput
            label="New PIN"
            value={pin}
            onChange={(v) => { setPin(v); setValidationError(null); }}
            show={showPin}
            onToggleShow={() => setShowPin((s) => !s)}
          />

          <PinInput
            label="Confirm PIN"
            value={confirm}
            onChange={(v) => { setConfirm(v); setValidationError(null); }}
            show={showConfirm}
            onToggleShow={() => setShowConfirm((s) => !s)}
          />

          <p className="text-xs text-gray-400">
            Avoid simple PINs like 1234, 0000, or repeated digits. Your PIN is required when switching from a child profile to a parent account.
          </p>

          <button
            onClick={() => void handleSave()}
            disabled={!pinFull || !confirmFull || saving}
            className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving ? 'Saving…' : hasPin ? 'Update PIN' : 'Set PIN'}
          </button>
        </div>
      )}
    </div>
  );
}

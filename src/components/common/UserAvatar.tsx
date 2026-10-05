import React from 'react';

interface UserAvatarProps {
  name?: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'Customer',
  avatarUrl,
  size = 'md',
  className = '',
}) => {
  // Get initials (up to 2 letters)
  const getInitials = (n: string) => {
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase() || 'U';
  };

  const initials = getInitials(name);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-28 h-28 sm:w-32 sm:h-32 text-3xl sm:text-4xl',
  };

  if (avatarUrl && avatarUrl.trim()) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm flex-shrink-0 ${className}`}
        onError={(e) => {
          // If image fails to load, replace with initials
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  // Fallback initial avatar with clean brand gradient
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 text-white font-extrabold flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm select-none flex-shrink-0 tracking-wider ${className}`}
      aria-label={name}
    >
      {initials}
    </div>
  );
};

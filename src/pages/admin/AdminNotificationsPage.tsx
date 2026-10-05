import React from 'react';
import { useAdminNotifications } from '../../context/NotificationContext';
import { Bell, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminNotification } from '../../types/notification';

export const AdminNotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useAdminNotifications();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Event Monitoring</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Admin Notification Center ({notifications.length})
          </h1>
        </div>

        <button
          onClick={markAllAsRead}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n: AdminNotification) => {
          const isRead = n.isRead;
          const link = n.linkUrl;

          return (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                !isRead ? 'bg-white border-brand-200 shadow-md ring-2 ring-brand-500/10' : 'bg-gray-50/50 border-gray-100 opacity-75'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 flex-shrink-0 mt-0.5">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-gray-900">{n.title}</h3>
                    {!isRead && <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />}
                  </div>
                  <p className="text-xs text-gray-600">{n.message}</p>
                  <span className="text-[11px] text-gray-400 font-medium block pt-1">{n.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {link && (
                  <Link
                    to={link}
                    onClick={() => markAsRead(n.id)}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl transition-colors"
                  >
                    View Details
                  </Link>
                )}
                {!isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

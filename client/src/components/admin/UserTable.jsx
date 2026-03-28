import React from 'react';
import { User, Shield, ShieldAlert, Trash2 } from 'lucide-react';

const UserTable = ({ users, onPromote, onDelete }) => {
  return (
    <div className="p-0 overflow-x-auto">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="text-left text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-[0.2em] bg-transparent border-b border-gray-50 dark:border-[rgb(63,51,51)]">
            <th className="px-10 py-6">User</th>
            <th className="px-10 py-6">Email</th>
            <th className="px-10 py-6">Role</th>
            <th className="px-10 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map(user => (
            <tr key={user._id} className="hover:bg-primary/5 transition-colors group">
              <td className="px-10 py-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-black text-dark tracking-tight">{user.name}</span>
                </div>
              </td>
              <td className="px-10 py-8 text-xs font-bold text-gray-500 dark:text-gray-400 lowercase transition-colors">{user.email}</td>
              <td className="px-10 py-8">
                <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full border ${user.role === 'admin' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20' : 'bg-gray-50 dark:bg-white/10 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-white/20'}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-10 py-8 text-right">
                {user.role !== 'admin' && (
                  <button 
                    onClick={() => onPromote(user._id)}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-dark transition-colors mr-6 flex items-center inline-flex"
                  >
                    <Shield className="w-3 h-3 mr-1" /> Promote
                  </button>
                )}
                <button 
                  onClick={() => onDelete(user._id)}
                  className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-700 transition-colors inline-flex items-center"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-20 font-black text-gray-300 uppercase tracking-widest">
          No registered users found.
        </div>
      )}
    </div>
  );
};

export default UserTable;

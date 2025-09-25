import React, { useEffect, useState } from 'react';

const SettingsPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('app_settings') || '{}');
        if (saved.name) setName(saved.name);
        if (saved.email) setEmail(saved.email);
        if (saved.theme) setTheme(saved.theme);
        applyTheme(saved.theme || 'dark');
    }, []);

    const applyTheme = (t) => {
        const root = document.documentElement;
        if (t === 'light') {
            root.classList.remove('dark');
        } else {
            root.classList.add('dark');
        }
    };

    const onSave = () => {
        const data = { name, email, theme };
        localStorage.setItem('app_settings', JSON.stringify(data));
        applyTheme(theme);
        alert('Settings saved');
    };

    return (
        <div className="min-h-screen bg-[#1f2937] p-6">
            <div className="max-w-3xl mx-auto bg-[#1f2937] border border-[#1f2937] rounded-xl p-6">
                <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm text-white/80 mb-1">Display Name</label>
                        <input className="w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-white p-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                    </div>
                    <div>
                        <label className="block text-sm text-white/80 mb-1">Email</label>
                        <input className="w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-white p-3" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm text-white/80 mb-1">Theme</label>
                        <select className="w-full rounded-md border border-[#1f2937] bg-[#6383b0] text-white p-3" value={theme} onChange={(e) => setTheme(e.target.value)}>
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={onSave} className="px-6 py-2 bg-white text-[#1f2937] rounded-md hover:bg-white/90">Save Settings</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

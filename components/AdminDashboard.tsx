
import React, { useState, useEffect, useRef } from 'react';
import { ImageRecord } from '../types';
import { imageDb } from '../services/imageDb';
import { Button } from './Button';
import { Upload, Trash2, RefreshCw, X, Search, Filter, Save, CheckCircle, Code, Copy, Download, FileJson, Link as LinkIcon, Check } from 'lucide-react';

interface AdminDashboardProps {
    onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
    const [images, setImages] = useState<ImageRecord[]>([]);
    const [filter, setFilter] = useState<'all' | 'hero' | 'gallery' | 'auth' | 'style' | 'feature'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [showExport, setShowExport] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
    
    // State for URL editing
    const [editingUrlId, setEditingUrlId] = useState<string | null>(null);
    const [tempUrl, setTempUrl] = useState('');

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        setImages(imageDb.getAll());
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeUploadId) {
            try {
                // Update DB (persists src immediately)
                const updatedRecord = await imageDb.update(activeUploadId, file);
                
                // Update local state, preserving any pending label edits for this record (or others)
                setImages(prev => prev.map(img => 
                    img.id === activeUploadId 
                        ? { ...updatedRecord, label: img.label } // Keep current UI label if user was editing it
                        : img
                ));
                
                setActiveUploadId(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
            } catch (err) {
                alert("Failed to upload image. It might be too large for local storage.");
                console.error(err);
            }
        }
    };

    const handleUrlSave = async (id: string) => {
        if (!tempUrl.trim()) return;
        try {
            const updatedRecord = await imageDb.updateUrl(id, tempUrl);
            setImages(prev => prev.map(img => 
                img.id === id ? { ...updatedRecord, label: img.label } : img
            ));
            setEditingUrlId(null);
            setTempUrl('');
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (err) {
            console.error(err);
        }
    };

    const triggerUpload = (id: string) => {
        setActiveUploadId(id);
        fileInputRef.current?.click();
    };

    const triggerUrlEdit = (id: string, currentUrl: string) => {
        setEditingUrlId(id);
        setTempUrl(currentUrl);
    };

    const handleReset = (id: string) => {
        if (window.confirm("Are you sure you want to reset this image to its default?")) {
            imageDb.reset(id);
            refreshData();
        }
    };

    const handleLabelChange = (id: string, newLabel: string) => {
        setImages(prev => prev.map(img => img.id === id ? { ...img, label: newLabel } : img));
        setSaveStatus('idle');
    };

    const handleSave = () => {
        setSaveStatus('saving');
        imageDb.updateBatch(images);
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 300);
    };

    const filteredImages = images.filter(img => {
        const matchesFilter = filter === 'all' || img.section === filter;
        const matchesSearch = img.label.toLowerCase().includes(searchTerm.toLowerCase()) || img.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const generateDbFileContent = (data: ImageRecord[]) => {
        return `
import { ImageRecord } from '../types';
import { STYLE_OPTIONS } from '../constants';
import { compressImage } from '../utils';

const STORAGE_KEY = 'dreamdesign_images_db';

// --- GENERATED DATA START ---
// This data was exported from the Admin Dashboard on ${new Date().toLocaleDateString()}
// Replaces previous default images with your current setup.
const ALL_INITIAL_DATA: ImageRecord[] = ${JSON.stringify(data, null, 2)};
// --- GENERATED DATA END ---

class ImageDatabase {
    private images: Record<string, ImageRecord>;

    constructor() {
        this.images = {};
        this.load();
    }

    private load() {
        // 1. Initialize with default data (YOUR CUSTOM EXPORT)
        this.images = {};
        ALL_INITIAL_DATA.forEach(img => {
            this.images[img.id] = { ...img };
        });

        // 2. Load from Standard Storage (Historical) and merge
        // We still check storage to allow for local overrides in dev.
        try {
            const standard = localStorage.getItem(STORAGE_KEY);
            if (standard) {
                const standardData = JSON.parse(standard);
                this.images = { ...this.images, ...standardData };
            }
        } catch (e) {
            console.error("Failed to load standard DB", e);
        }
    }

    private save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.images));
        } catch (e) {
            console.error("Storage quota exceeded!", e);
        }
    }

    getAll(): ImageRecord[] {
        return Object.values(this.images);
    }

    get(id: string): ImageRecord | undefined {
        return this.images[id];
    }

    async update(id: string, file: File): Promise<ImageRecord> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const result = e.target?.result as string;
                if (this.images[id]) {
                    try {
                        const compressed = await compressImage(result, 800, 0.7);
                        this.images[id] = { ...this.images[id], src: compressed.base64 };
                        this.save();
                        resolve(this.images[id]);
                    } catch (err) {
                        reject(err);
                    }
                } else {
                    reject(new Error("Image ID not found"));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async updateUrl(id: string, url: string): Promise<ImageRecord> {
        return new Promise((resolve, reject) => {
            if (this.images[id]) {
                this.images[id] = { ...this.images[id], src: url };
                this.save();
                resolve(this.images[id]);
            } else {
                reject(new Error("Image ID not found"));
            }
        });
    }

    updateBatch(records: ImageRecord[]) {
        records.forEach(record => {
             if (this.images[record.id]) {
                 this.images[record.id] = { ...this.images[record.id], ...record };
             }
        });
        this.save();
    }

    reset(id: string) {
        const initial = ALL_INITIAL_DATA.find(img => img.id === id);
        if (initial) {
            this.images[id] = { ...initial };
            this.save();
        }
    }

    resetAll() {
        this.images = {};
        ALL_INITIAL_DATA.forEach(img => {
            this.images[img.id] = { ...img };
        });
        this.save();
    }

    getHeroDemos() {
        const demos: any[] = [];
        for (let i = 0; i < 3; i++) {
            const before = this.images[\`hero_\${i}_before\`];
            const after = this.images[\`hero_\${i}_after\`];
            if (before && after) {
                demos.push({
                    id: i,
                    label: before.label.replace(" (Before)", ""),
                    before: before.src,
                    after: after.src
                });
            }
        }
        return demos;
    }

    getFeatureImages() {
        return [
            this.images['feature_0_before'],
            this.images['feature_0_after']
        ].filter(Boolean);
    }

    getAuthDemos() {
        const demos: any[] = [];
        for (let i = 0; i < 3; i++) {
            const before = this.images[\`auth_\${i}_before\`];
            const after = this.images[\`auth_\${i}_after\`];
            if (before && after) {
                demos.push({
                    id: i,
                    label: before.label.replace(" (Before)", "").replace("Auth ", ""),
                    before: before.src,
                    after: after.src
                });
            }
        }
        return demos;
    }

    getGalleryItems() {
        return Object.values(this.images)
            .filter(img => img.section === 'gallery')
            .sort((a, b) => {
                const idxA = parseInt(a.id.split('_')[1]);
                const idxB = parseInt(b.id.split('_')[1]);
                return idxA - idxB;
            });
    }

    getStyles() {
        return STYLE_OPTIONS.map(style => {
            const img = this.images[\`style_\${style.id}\`];
            return {
                ...style,
                image: img ? img.src : style.image
            };
        });
    }
}

export const imageDb = new ImageDatabase();
`;
    };

    const ExportModal = () => {
        if (!showExport) return null;
        
        const handleDownload = () => {
            const content = generateDbFileContent(images);
            const blob = new Blob([content], { type: 'text/typescript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'imageDb.ts';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F9F8F6]">
                        <div>
                            <h3 className="text-xl font-extrabold text-[#154845]">Export for Launch</h3>
                            <p className="text-sm text-[#64748B]">Hardcode your changes for the live website.</p>
                        </div>
                        <button onClick={() => setShowExport(false)} className="p-2 hover:bg-[#E2E8F0] rounded-full text-[#64748B]"><X size={20}/></button>
                    </div>
                    
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-[#FDF2F0] rounded-full flex items-center justify-center text-[#C26D53] mb-4">
                            <FileJson size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-[#154845] mb-2">Download Production Config</h4>
                        <p className="text-[#64748B] mb-6 text-sm">
                            This will generate a new <code>imageDb.ts</code> file containing all your current images and text.
                        </p>
                        
                        <div className="bg-[#F1F5F9] p-4 rounded-xl text-left text-sm text-[#334155] w-full mb-6 border border-[#E2E8F0]">
                            <p className="font-bold mb-2">Instructions:</p>
                            <ol className="list-decimal pl-4 space-y-1">
                                <li>Click the <b>Download</b> button below.</li>
                                <li>In your project files (on your computer or in this editor), find the folder: <code>services</code>.</li>
                                <li>Delete the old <code>imageDb.ts</code>.</li>
                                <li>Paste the new downloaded file there.</li>
                            </ol>
                        </div>

                        <Button onClick={handleDownload} size="lg" className="w-full flex items-center justify-center gap-2 shadow-xl shadow-[#154845]/10">
                            <Download size={20}/> Download imageDb.ts
                        </Button>
                    </div>

                    <div className="p-4 border-t border-[#E2E8F0] bg-[#F9F8F6] flex justify-center">
                        <button onClick={() => setShowExport(false)} className="text-sm font-bold text-[#64748B] hover:text-[#154845]">Close</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] bg-[#F9F8F6] overflow-hidden flex flex-col">
            <ExportModal />
            {/* Header */}
            <div className="h-20 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-extrabold text-[#154845]">Admin Dashboard</h1>
                    <span className="bg-[#E6E2DE] text-[#154845] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Image Manager
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Button 
                        onClick={() => setShowExport(true)}
                        variant="secondary"
                        className="flex items-center gap-2 text-[#154845] border-[#154845]"
                    >
                        <Code size={18} /> Export for Launch
                    </Button>
                    <div className="h-8 w-px bg-[#E2E8F0] mx-2"></div>
                    <Button 
                        onClick={handleSave}
                        className={`flex items-center gap-2 transition-all duration-300 ${
                            saveStatus === 'saved' ? 'bg-[#154845]' : 
                            saveStatus === 'saving' ? 'bg-[#C26D53]' : 
                            'bg-[#C26D53] hover:bg-[#A5563D]'
                        }`}
                        // Never disable, allow saving multiple times
                        disabled={false} 
                    >
                        {saveStatus === 'saving' ? (
                            <RefreshCw size={18} className="animate-spin" />
                        ) : saveStatus === 'saved' ? (
                            <CheckCircle size={18} />
                        ) : (
                            <Save size={18} />
                        )}
                        {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                    </Button>
                    <div className="h-8 w-px bg-[#E2E8F0] mx-2"></div>
                    <Button 
                        variant="ghost" 
                        onClick={() => {
                            if (window.confirm("Reset ALL images to default? This cannot be undone.")) {
                                imageDb.resetAll();
                                refreshData();
                            }
                        }}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        Reset All Defaults
                    </Button>
                    <button onClick={onClose} className="p-2 bg-[#F1F5F9] rounded-full hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#154845] transition-colors">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="px-8 py-6 flex flex-col md:flex-row gap-4 items-center bg-white/50 backdrop-blur-sm border-b border-[#E2E8F0]">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search images..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#154845] outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto w-full pb-2 md:pb-0 hide-scrollbar">
                    {['all', 'hero', 'gallery', 'style', 'auth', 'feature'].map((f) => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-colors ${
                                filter === f 
                                    ? 'bg-[#154845] text-white shadow-md' 
                                    : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#F3F4F6]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {filteredImages.map((img) => (
                        <div key={img.id} className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden group hover:shadow-lg transition-shadow duration-300 flex flex-col">
                            <div className="relative aspect-[4/3] bg-[#E2E8F0] overflow-hidden">
                                <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleReset(img.id)}
                                        className="p-2 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-50"
                                        title="Reset to Default"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide text-white shadow-sm ${
                                        img.section === 'hero' ? 'bg-blue-500' :
                                        img.section === 'gallery' ? 'bg-purple-500' :
                                        img.section === 'style' ? 'bg-orange-500' :
                                        img.section === 'feature' ? 'bg-pink-500' : 
                                        'bg-gray-500'
                                    }`}>
                                        {img.section}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-4 flex flex-col flex-1">
                                <div className="mb-2">
                                    <label className="text-[10px] uppercase font-bold text-[#94A3B8] block mb-1">Label / Tag</label>
                                    <input 
                                        type="text" 
                                        value={img.label} 
                                        onChange={(e) => handleLabelChange(img.id, e.target.value)}
                                        className="w-full text-base font-bold text-[#154845] border-b border-dashed border-[#CBD5E1] hover:border-[#C26D53] focus:border-[#C26D53] bg-transparent outline-none pb-0.5 transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-[#94A3B8] font-mono mb-4 truncate" title={img.id}>{img.id}</p>
                                
                                <div className="mt-auto pt-4 border-t border-[#F1F5F9]">
                                    {editingUrlId === img.id ? (
                                        <div className="flex flex-col gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="https://..." 
                                                className="w-full text-sm border border-[#CBD5E1] rounded-lg px-3 py-2 outline-none focus:border-[#C26D53]"
                                                value={tempUrl}
                                                onChange={(e) => setTempUrl(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => handleUrlSave(img.id)} className="flex-1 bg-[#154845] text-white py-1">Save</Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingUrlId(null)} className="py-1 px-3">Cancel</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="flex-1 flex items-center justify-center gap-1.5"
                                                onClick={() => triggerUpload(img.id)}
                                                title="Upload File"
                                            >
                                                <Upload size={14} /> Upload
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="flex-1 flex items-center justify-center gap-1.5"
                                                onClick={() => triggerUrlEdit(img.id, img.src)}
                                                title="Paste Link"
                                            >
                                                <LinkIcon size={14} /> Link
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredImages.length === 0 && (
                    <div className="h-full flex items-center justify-center text-[#94A3B8] font-medium">
                        No images found matching your search.
                    </div>
                )}
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileSelect}
            />
        </div>
    );
};

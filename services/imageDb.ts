
import { ImageRecord } from '../types';
import { STYLE_OPTIONS } from '../constants';
import { compressImage } from '../utils';

const STORAGE_KEY = 'dreamdesign_images_db';
const FALLBACK_KEY = 'dreamdesign_images_db_v1';

// Initial Data Seed
const INITIAL_HERO = [
  { id: 'hero_0_before', originalId: 0, section: 'hero', type: 'before', label: "Modern Living (Before)", src: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop" },
  { id: 'hero_0_after', originalId: 0, section: 'hero', type: 'after', label: "Modern Living (After)", src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" },
  { id: 'hero_1_before', originalId: 1, section: 'hero', type: 'before', label: "Scandi Bedroom (Before)", src: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=1200&auto=format&fit=crop" },
  { id: 'hero_1_after', originalId: 1, section: 'hero', type: 'after', label: "Scandi Bedroom (After)", src: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=1200&auto=format&fit=crop" },
  { id: 'hero_2_before', originalId: 2, section: 'hero', type: 'before', label: "Industrial Kitchen (Before)", src: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop" },
  { id: 'hero_2_after', originalId: 2, section: 'hero', type: 'after', label: "Industrial Kitchen (After)", src: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1200&auto=format&fit=crop" }
];

const INITIAL_AUTH = [
  { id: 'auth_0_before', originalId: 0, section: 'auth', type: 'before', label: "Auth Modern (Before)", src: "https://images.unsplash.com/photo-1581553612845-63529b380b06?q=80&w=1200&auto=format&fit=crop" },
  { id: 'auth_0_after', originalId: 0, section: 'auth', type: 'after', label: "Auth Modern (After)", src: "https://images.unsplash.com/photo-1502005229766-3c8ef9558553?q=80&w=1200&auto=format&fit=crop" },
  { id: 'auth_1_before', originalId: 1, section: 'auth', type: 'before', label: "Auth Scandi (Before)", src: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=1200&auto=format&fit=crop" },
  { id: 'auth_1_after', originalId: 1, section: 'auth', type: 'after', label: "Auth Scandi (After)", src: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=1200&auto=format&fit=crop" },
  { id: 'auth_2_before', originalId: 2, section: 'auth', type: 'before', label: "Auth Luxury (Before)", src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop" },
  { id: 'auth_2_after', originalId: 2, section: 'auth', type: 'after', label: "Auth Luxury (After)", src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop" }
];

const INITIAL_FEATURE = [
    { id: 'feature_0_before', originalId: 0, section: 'feature', type: 'before', label: "Feature Section (Original)", src: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=600" },
    { id: 'feature_0_after', originalId: 0, section: 'feature', type: 'after', label: "Feature Section (Result)", src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600" }
];

const INITIAL_GALLERY = [
    { label: "Mediterranean Kitchen", src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=500&auto=format&fit=crop" },
    { label: "Bohemian Living", src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500&auto=format&fit=crop" }, 
    { label: "Zen Sanctuary", src: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=500&auto=format&fit=crop" },
    { label: "Modern Minimalist", src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=500&auto=format&fit=crop" },
    { label: "Coastal Retreat", src: "https://images.unsplash.com/photo-1616594039964-40891a909d99?q=80&w=500&auto=format&fit=crop" },
    { label: "Transitional Home", src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=500&auto=format&fit=crop" },
    { label: "Scandi Bathroom", src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=500&auto=format&fit=crop" },
    { label: "Farmhouse Dining", src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=500&auto=format&fit=crop" },
    { label: "Industrial Loft", src: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=500&auto=format&fit=crop" },
    { label: "Eclectic Mix", src: "https://images.unsplash.com/photo-1583847661884-37839262f56f?q=80&w=500&auto=format&fit=crop" },
    { label: "Mid-Century Modern", src: "https://images.unsplash.com/photo-1556912172-45b7abe8d7e1?q=80&w=500&auto=format&fit=crop" }
].map((item, i) => ({
    id: `gallery_${i}`,
    originalId: i,
    section: 'gallery',
    type: 'single',
    label: item.label,
    src: item.src
}));

// Map style options to image records
const INITIAL_STYLES = STYLE_OPTIONS.map(style => ({
    id: `style_${style.id}`,
    originalId: style.id,
    section: 'style',
    type: 'single',
    label: `${style.name} Style`,
    src: style.image
}));

const ALL_INITIAL_DATA: ImageRecord[] = [
    ...INITIAL_HERO,
    ...INITIAL_AUTH,
    ...INITIAL_FEATURE,
    ...INITIAL_GALLERY,
    ...INITIAL_STYLES
] as ImageRecord[];

class ImageDatabase {
    private images: Record<string, ImageRecord>;

    constructor() {
        this.images = {};
        this.load();
    }

    private load() {
        // 1. Initialize with default data
        this.images = {};
        ALL_INITIAL_DATA.forEach(img => {
            this.images[img.id] = { ...img };
        });

        // 2. Load from Standard Storage (Historical) and merge
        try {
            const standard = localStorage.getItem(STORAGE_KEY);
            if (standard) {
                const standardData = JSON.parse(standard);
                this.images = { ...this.images, ...standardData };
            }
        } catch (e) {
            console.error("Failed to load standard DB", e);
        }

        // 3. Load from V1 Storage (Recent/Complex) and merge ON TOP
        try {
            const v1 = localStorage.getItem(FALLBACK_KEY);
            if (v1) {
                const v1Data = JSON.parse(v1);
                this.images = { ...this.images, ...v1Data };
                this.save();
            }
        } catch (e) {
            console.error("Failed to recover fallback DB", e);
        }
    }

    private save() {
        try {
            // Always save to the main key
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

    // NEW: Allow updating with a direct URL string (hosting)
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
            const before = this.images[`hero_${i}_before`];
            const after = this.images[`hero_${i}_after`];
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
            const before = this.images[`auth_${i}_before`];
            const after = this.images[`auth_${i}_after`];
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
            const img = this.images[`style_${style.id}`];
            return {
                ...style,
                image: img ? img.src : style.image
            };
        });
    }
}

export const imageDb = new ImageDatabase();

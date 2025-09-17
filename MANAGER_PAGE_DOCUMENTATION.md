# Halaman Profil Manager - JSR Consulting Group

## Deskripsi
Halaman `/manager` telah dibuat khusus untuk menampilkan profil dua manager JSR Consulting Group (JSR-007 dan JSR-008) dalam satu halaman dengan layout grid yang responsif dan desain yang konsisten dengan brand JSR.

## URL Access
```
https://yourdomain.com/manager
```

## Manager yang Ditampilkan

### 👨‍💼 **JSR-007 - Almer Reyhan Islam**
- **Posisi**: Manager
- **Foto**: `/img/karyawan/almer.png`
- **Pendidikan**: 
  - S.Ak. (Sarjana Akuntansi) - Universitas Widyatama
  - Ak. (Akuntan) - Universitas Padjadjaran
- **Sertifikasi**: CA (Chartered Accountant)

### 👩‍💼 **JSR-008 - Mesayu Dita Desianti**
- **Posisi**: Manager
- **Foto**: `/img/karyawan/mesayu.png`
- **Pendidikan**: 
  - S.E. (Sarjana Ekonomi) - Universitas Padjadjaran
- **Sertifikasi**: ACPA (Associate Chartered Public Accountant)

## Design Features

### 🎨 **Layout & Visual Design**
- **Grid Layout**: 2 kolom untuk desktop, 1 kolom untuk mobile
- **Card Design**: White/95% transparency dengan backdrop blur effect
- **Gradient Headers**: Blue-to-green gradient untuk setiap profil
- **Hover Effects**: Scale 105% dengan smooth transitions
- **Profile Photos**: Circular dengan border putih dan shadow

### 📱 **Responsive Design**
- **Desktop**: 2 manager cards side by side
- **Tablet**: 2 cards dengan spacing yang disesuaikan
- **Mobile**: Single column dengan full width cards
- **Touch-friendly**: Button dan link yang mudah diakses

### 🎯 **Interactive Elements**
- **Individual Profile Links**: Link ke halaman profil lengkap masing-masing
- **Social Media Links**: Link Instagram (jika tersedia)
- **Navigation**: Link kembali ke tim karyawan
- **Quick Actions**: Link ke berbagai bagian website

## Technical Implementation

### 🔧 **Data Filtering**
```typescript
const managers = karyawanData.filter(
  (karyawan: KaryawanData) => karyawan.slug === 'JSR-007' || karyawan.slug === 'JSR-008'
);
```

### 🎭 **Component Structure**
```typescript
// Main layout dengan background pattern
<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50">
  {/* Background effects */}
  {/* Header dengan logo dan navigation */}
  {/* Grid layout untuk manager cards */}
  {/* Footer navigation */}
</div>
```

### 🖼️ **Profile Card Template**
```typescript
{managers.map((manager) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl">
    {/* Gradient header dengan foto profil */}
    {/* Content sections: Education, Certification, Social Media */}
    {/* Individual profile link */}
  </div>
))}
```

## Content Sections

### 📚 **Education Section**
- **Icon**: 🎓
- **Color Theme**: Blue
- **Layout**: Vertical cards dengan border-left accent
- **Content**: Degree, Institution, Year
- **Filter**: Hanya menampilkan education yang tidak kosong

### 🏆 **Certification Section**
- **Icon**: 🏆
- **Color Theme**: Green
- **Layout**: Grid dengan border-left accent
- **Content**: Certification name, Issuer, Year
- **Filter**: Hanya menampilkan certification yang tidak kosong

### 📱 **Social Media Section**
- **Icon**: 📱
- **Color Theme**: Purple
- **Content**: Instagram link (jika tersedia)
- **Action**: External link ke Instagram profile

## Navigation Features

### 🔙 **Back Navigation**
```typescript
<Link href="/karyawan">
  ← Kembali ke Tim Karyawan
</Link>
```

### 🔗 **Quick Links Footer**
- **Semua Tim**: Link ke `/karyawan`
- **Managing Partner**: Link ke `/employee/JSR-001`
- **Quick Links**: Link ke `/info`

### 👤 **Individual Profiles**
```typescript
<Link href={`/employee/${manager.slug}`}>
  Lihat Profil Lengkap →
</Link>
```

## Error Handling

### 🚫 **No Data Found**
```typescript
if (managers.length === 0) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1>Data Manager Tidak Ditemukan</h1>
        <Link href="/karyawan">← Kembali ke Daftar Karyawan</Link>
      </div>
    </div>
  );
}
```

## Brand Consistency

### 🎨 **Color Palette**
- **Primary**: Blue (#1e3a8a) - JSR signature color
- **Secondary**: Green (#059669) - JSR accent color
- **Supporting**: Purple (#9333ea) for social media
- **Neutral**: Slate grays untuk text dan backgrounds

### 🖼️ **Logo Integration**
- JSR logo di header dengan hover scale effect
- Consistent dengan halaman lainnya
- White background dengan transparency

## Performance Optimizations

### ⚡ **Image Optimization**
```typescript
<ProfileImage
  src={manager.foto}
  alt={manager.name}
  width={160}
  height={160}
  className="w-full h-full rounded-full border-4 border-white shadow-2xl object-cover"
/>
```

### 🎭 **CSS Optimizations**
- Backdrop blur effects untuk depth
- Smooth transitions (300ms duration)
- Optimized hover states
- Minimal re-renders dengan proper key props

## SEO & Accessibility

### 📊 **Page Metadata**
```typescript
// Dapat ditambahkan di layout.tsx
export const metadata = {
  title: 'Tim Manager - JSR Consulting Group',
  description: 'Profil manager JSR Consulting Group - Almer Reyhan Islam dan Mesayu Dita Desianti',
  keywords: 'JSR, manager, team, consulting, audit'
}
```

### ♿ **Accessibility Features**
- Semantic HTML structure
- Alt text untuk semua images
- Keyboard navigation support
- High contrast color combinations
- Focus indicators

## Mobile Responsiveness

### 📱 **Responsive Grid**
```css
/* Desktop: 2 columns */
grid-cols-1 lg:grid-cols-2

/* Mobile: Single column with proper spacing */
gap-8 max-w-7xl mx-auto
```

### 👆 **Touch Optimization**
- Large touch targets (minimum 44px)
- Proper spacing between interactive elements
- Swipe-friendly card layouts
- Thumb-friendly button placement

## Integration Points

### 🔗 **Connected Pages**
- **Source Data**: `/data/karyawan.json`
- **Individual Profiles**: `/employee/JSR-007`, `/employee/JSR-008`
- **Team Overview**: `/karyawan`
- **Company Info**: `/info`

### 📊 **Analytics Potential**
```typescript
// Track manager profile views
const trackManagerView = (managerId: string) => {
  // Google Analytics, Mixpanel, etc.
  console.log(`Manager profile viewed: ${managerId}`);
};
```

## Future Enhancements

### 🚀 **Possible Additions**
1. **Contact Information**: Email, phone numbers
2. **Achievements**: Awards, recognitions
3. **Project History**: Notable client projects
4. **Skills**: Technical and soft skills
5. **Testimonials**: Client feedback
6. **Video Profiles**: Introduction videos

### 🔄 **Dynamic Features**
1. **Filter by Certification**: Filter managers by specific certifications
2. **Search**: Search within manager profiles
3. **Comparison**: Side-by-side comparison features
4. **Export**: PDF generation of profiles

## Browser Compatibility
- ✅ **Chrome**: Full support dengan advanced CSS effects
- ✅ **Firefox**: Full support dengan grid layouts
- ✅ **Safari**: Full support dengan backdrop filters
- ✅ **Edge**: Full support dengan modern CSS
- ✅ **Mobile Browsers**: Touch-optimized untuk iOS/Android

Halaman manager telah berhasil dibuat dan menyediakan tampilan yang comprehensive untuk kedua manager JSR dalam satu halaman yang elegan dan profesional! 👨‍💼👩‍💼
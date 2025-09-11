# Fitur Redirect Homepage ke Website Utama

## Deskripsi
Halaman home ("/") telah dikonfigurasi untuk otomatis redirect ke website utama **www.kapjsr.co.id** dengan loading screen yang menarik selama 2 detik.

## Fitur yang Diimplementasikan

### 🔄 **Auto Redirect**
- **URL Target**: `https://www.kapjsr.co.id`
- **Delay**: 2 detik sebelum redirect
- **Method**: JavaScript `window.location.href`

### 🎨 **Loading Screen Design**
- **Logo JSR**: Ditampilkan dengan animasi bounce
- **Loading Spinner**: Spinner biru yang berputar
- **Progress Bar**: Bar progress dengan gradient biru-hijau
- **Text Animation**: "Anda Sedang Diarahkan" dengan efek pulse
- **Background**: Gradient dengan pattern blur effects

### 🎯 **User Experience**
- **Loading Text**: "Anda Sedang Diarahkan"
- **Sub Text**: "Mengarahkan ke website utama..."
- **Fallback Link**: Link manual jika auto-redirect gagal
- **Responsive**: Desain yang responsif untuk semua device

## Technical Implementation

### 🔧 **React Components**
```tsx
'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";

// Auto redirect dengan timer 2 detik
useEffect(() => {
  const timer = setTimeout(() => {
    window.location.href = 'https://www.kapjsr.co.id';
  }, 2000);
  
  return () => clearTimeout(timer);
}, []);
```

### 🎭 **CSS Animations**
- **Loading Bar**: Custom keyframe animation `loadingBar`
- **Logo Bounce**: Built-in Tailwind `animate-bounce`
- **Spinner**: Built-in Tailwind `animate-spin`
- **Text Pulse**: Built-in Tailwind `animate-pulse`

### 📱 **Responsive Design**
- **Mobile-first**: Optimized untuk mobile devices
- **Flexible Layout**: Menggunakan Flexbox untuk centering
- **Scalable Elements**: Logo dan UI elements yang scalable

## Animasi Details

### ⏳ **Progress Bar Animation**
```css
@keyframes loadingBar {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-loading-bar {
  animation: loadingBar 2s ease-in-out forwards;
}
```

### 🎨 **Background Effects**
- **Gradient Background**: `from-white via-blue-50 to-green-50`
- **Blur Circles**: Multiple positioned blur effects untuk depth
- **Brand Colors**: Konsisten dengan brand JSR (biru dan hijau)

## User Journey

1. **User mengakses domain** → `yourdomain.com/`
2. **Loading screen muncul** → Logo JSR + spinner + progress bar
3. **2 detik timer** → Progress bar mengisi penuh
4. **Auto redirect** → Ke `https://www.kapjsr.co.id`
5. **Fallback option** → Manual link jika auto-redirect gagal

## Browser Compatibility

- ✅ **Chrome**: Full support
- ✅ **Firefox**: Full support  
- ✅ **Safari**: Full support
- ✅ **Edge**: Full support
- ✅ **Mobile Browsers**: Responsive design

## Fallback Mechanism

Jika JavaScript dinonaktifkan atau ada masalah dengan auto-redirect:
- Link manual tersedia: "www.kapjsr.co.id"
- User dapat klik manual untuk redirect
- Clear instruction provided

## File yang Dimodifikasi

1. **`app/page.tsx`**: Main redirect component
2. **`app/globals.css`**: Loading bar animation
3. **Public assets**: Logo JSR untuk branding

## Deployment Notes

- ✅ **Static Export**: Compatible dengan static export
- ✅ **SSR**: Works dengan server-side rendering
- ✅ **Client-side**: Menggunakan client-side redirect
- ✅ **SEO**: Tidak mempengaruhi SEO karena ini adalah temporary redirect

## Testing

### Local Testing:
```bash
npm run dev
# Akses http://localhost:3001
# Observe loading screen selama 2 detik
# Verify redirect ke https://www.kapjsr.co.id
```

### Production Testing:
- Deploy ke hosting
- Test akses root domain
- Verify redirect berfungsi dengan baik
- Check responsiveness di berbagai device

## Customization Options

### Mengubah Delay Redirect:
```tsx
setTimeout(() => {
  window.location.href = 'https://www.kapjsr.co.id';
}, 3000); // 3 detik
```

### Mengubah Target URL:
```tsx
window.location.href = 'https://new-domain.com';
```

### Mengubah Progress Bar Duration:
```css
.animate-loading-bar {
  animation: loadingBar 3s ease-in-out forwards;
}
```

Fitur redirect telah berhasil diimplementasikan dan siap untuk deployment! 🎉

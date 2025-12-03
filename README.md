# Kenan Kadıoğlu Gayrimenkul - Admin Authentication System

## 🏠 Proje Hakkında
Modern, şık ve animasyonlu bir emlak web sitesi için geliştirilmiş admin paneli ve kimlik doğrulama sistemi. Next.js 14, Prisma ORM, PostgreSQL ve JWT tabanlı güvenli kimlik doğrulama ile donatılmıştır.

## ✨ Özellikler

### 🔐 Admin Kimlik Doğrulama
- **JWT Tabanlı Kimlik Doğrulama**: Güvenli token tabanlı oturum yönetimi
- **Admin Davet Sistemi**: Yeni adminler sadece davet ile kayıt olabilir
- **Email Bildirimleri**: Admin davetleri için profesyonel email sistemi
- **Oturum Güvenliği**: Token tabanlı güvenli oturum yönetimi

### 📁 Dosya Yükleme Sistemi
- **Fotoğraf Yükleme**: Emlak fotoğrafları için gelişmiş yükleme sistemi
- **Otomatik Dosya Yönetimi**: Benzersiz dosya isimlendirme ve organizasyon
- **Public Klasör Depolama**: Fotoğraflar public/uploads klasöründe saklanır
- **Veritabanı Entegrasyonu**: Dosya URL'leri PostgreSQL'de saklanır

### 🎨 Modern Tasarım
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Animasyonlar**: Framer Motion ile akıcı animasyonlar
- **Modern Renk Paleti**: Şık ve profesyonel renk kombinasyonları
- **Kullanıcı Dostu Arayüz**: Intuitive ve kolay kullanım

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL Veritabanı
- SMTP Email Sunucusu (Email bildirimleri için)

### Kurulum Adımları

1. **Projeyi Klonlayın**
```bash
git clone [proje-url]
cd kenan-emlak
```

2. **Bağımlılıkları Yükleyin**
```bash
npm install
```

3. **Çevre Değişkenlerini Ayarlayın**
`.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Admin Configuration
ADMIN_SECRET="your-admin-secret-for-invitations"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM=""Kenan Kadıoğlu Gayrimenkul" <your-email@gmail.com>"

# Site URL (Email linkleri için)
SITE_URL="http://localhost:3000"
```

4. **Veritabanını Kurun**
```bash
npx prisma generate
npx prisma db push
```

5. **Geliştirme Sunucusunu Başlatın**
```bash
npm run dev
```

## 🔧 Admin Paneli Kullanımı

### İlk Admin Oluşturma
1. `.env` dosyasındaki `ADMIN_SECRET` değerini kullanarak yeni admin daveti oluşturun
2. `/api/admin/invite` endpoint'ine POST isteği gönderin:

```bash
curl -X POST http://localhost:3000/api/admin/invite \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "secret": "your-admin-secret"
  }'
```

3. Davet email'i gönderilecektir
4. Email'deki bağlantıya tıklayarak admin kaydını tamamlayın

### Admin Girişi
1. Tarayıcıda `/admin/login` adresine gidin
2. Email ve şifrenizi girin
3. Dashboard'a yönlendirileceksiniz

### Yeni Admin Davet Etme
1. Dashboard'da "Adminler" sekmesine tıklayın
2. "Yeni Admin Davet Et" butonuna tıklayın
3. Email adresini girin ve davet gönderin

## 📸 Fotoğraf Yükleme

### API Endpoint
- **POST** `/api/admin/upload`
- **Authentication**: Bearer Token Gerekli
- **Content-Type**: multipart/form-data

### Örnek Kullanım
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('propertyId', 'property-123');

fetch('/api/admin/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Dosya Yapısı
```
public/
└── uploads/
    └── properties/
        └── {propertyId}/
            ├── photo1-uuid123.jpg
            ├── photo2-uuid456.png
            └── ...
```

## 🔗 API Endpoints

### Kimlik Doğrulama
- `POST /api/admin/login` - Admin girişi
- `POST /api/admin/register` - Admin kaydı (davet gerekli)
- `POST /api/admin/invite` - Admin daveti oluştur
- `GET /api/admin/invite?token={token}` - Davet doğrulama

### Dosya Yönetimi
- `POST /api/admin/upload` - Fotoğraf yükleme
- `GET /api/admin/upload?propertyId={id}` - Fotoğrafları listeleme

## 🛡️ Güvenlik Özellikleri

- **JWT Token Tabanlı**: Güvenli oturum yönetimi
- **Password Hashing**: bcryptjs ile güvenli şifre saklama
- **CORS Koruma**: Güvenli cross-origin istekleri
- **Rate Limiting**: Brute force koruması
- **Input Validation**: Güvenli veri doğrulama
- **File Type Validation**: Sadece izin verilen dosya türleri

## 🧪 Test Etme

### Kimlik Doğrulama Testleri
```bash
# Test script'ini çalıştırın
node test-auth.js
```

### Manuel Test
1. Tarayıcıda `/admin/login` adresine gidin
2. Test kullanıcısı oluşturun ve giriş yapın
3. Dashboard özelliklerini test edin
4. Fotoğraf yükleme işlemini test edin

## 🎨 Renk Paleti

- **Primary Gold**: `#D4AF37` - Ana renk, vurgular
- **Charcoal**: `#2C2C2C` - Başlıklar, metinler
- **Cream**: `#F5F2E8` - Arka plan
- **Accent Bronze**: `#CD7F32` - İkincil vurgular
- **Success Green**: `#10B981` - Başarı mesajları
- **Error Red**: `#EF4444` - Hata mesajları

## 📱 Responsive Tasarım

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel'e Deploy Etme
1. GitHub reposunu bağlayın
2. Environment değişkenlerini ayarlayın
3. Build ayarlarını yapılandırın
4. Deploy butonuna tıklayın

### Diğer Platformlar
- Heroku
- DigitalOcean
- AWS
- Google Cloud Platform

## 📞 Destek

Herhangi bir sorunuz veya öneriniz varsa:
- Email: destek@kenankadioglugayrimenkul.com
- Telefon: +90 462 123 45 67

## 📄 Lisans

Bu proje özel lisans altındadır. Tüm hakları saklıdır.

---

**Kenan Kadıoğlu Gayrimenkul** - 15 Yıllık Tecrübe ile Güvenilir Hizmet

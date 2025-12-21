'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { MapPin, Home, Bath, Square, ArrowLeft, Phone, Calendar, Check, Share2, Heart, Maximize2, X, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';
import AppointmentModal from '@/components/AppointmentModal';
import { fetchWithCache } from '@/utils/apiCache';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await fetchWithCache<Property>(`/api/properties/${id}`);
        if (data) {
          setProperty(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (property?.photos) {
      setSelectedImageIndex((prev) => (prev + 1) % property.photos.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (property?.photos) {
      setSelectedImageIndex((prev) => (prev - 1 + property.photos.length) % property.photos.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-charcoal mb-4">İlan Bulunamadı</h1>
          <Link href="/" className="inline-flex items-center gap-2 text-primary-gold hover:text-primary-gold-dark transition-colors font-medium text-lg">
            <ArrowLeft className="w-5 h-5" />
            Ana Sayfaya Dön
          </Link>
        </motion.div>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-20">
       {/* Glassy Header */}
       <motion.div 
         initial={{ y: -100 }}
         animate={{ y: 0 }}
         className="bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/20 sticky top-0 z-50 shadow-sm transition-all duration-300"
       >
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-slate-300 transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
                </div>
                <span className="font-semibold text-sm tracking-wide hidden sm:block">GERİ DÖN</span>
              </Link>
              {isAdmin && (
                <Link href={`/admin?tab=properties&edit=${property.id}`} className="w-10 h-10 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-sm hover:scale-105 hover:border-primary-gold hover:bg-primary-gold/10 transition-all duration-300 group" title="İlanı Düzenle">
                  <Edit className="w-5 h-5 text-slate-600 group-hover:text-primary-gold transition-colors duration-300" />
                </Link>
              )}
            </div>
            
            <Link href="/" className="text-2xl font-bold tracking-tight text-slate-800 hover:opacity-80 transition-opacity">
              Kenan<span className="text-primary-gold">Emlak</span>
            </Link>

           <div className="flex gap-3">
             <button 
               onClick={() => setIsLiked(!isLiked)}
               className="w-10 h-10 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-sm hover:scale-105 hover:border-red-200 hover:bg-red-50 transition-all duration-300 group"
             >
               <Heart className={`w-5 h-5 transition-colors duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-600 group-hover:text-red-500'}`} />
             </button>
             <button className="w-10 h-10 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-sm hover:scale-105 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 group">
               <Share2 className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
             </button>
           </div>
         </div>
       </motion.div>

       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <motion.div 
           variants={containerVariants}
           initial="hidden"
           animate="visible"
           className="grid grid-cols-1 lg:grid-cols-12 gap-8"
         >
           {/* Left Column - Images (8 cols) */}
           <div className="lg:col-span-8 space-y-6">
             {/* Main Image Hero */}
             <motion.div 
               variants={itemVariants}
               className="aspect-video bg-gray-200 rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer"
               onClick={() => setShowLightbox(true)}
             >
               {property.photos?.length > 0 ? (
                 <motion.img 
                   key={selectedImageIndex}
                   initial={{ opacity: 0, scale: 1.1 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 0.5 }}
                   src={property.photos[selectedImageIndex].url} 
                   alt={property.title} 
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
                   <Home className="w-24 h-24 text-gray-300" />
                 </div>
               )}
               
               {/* Image Navigation Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                 <div className="flex justify-between items-start">
                   <div className="flex gap-2">
                     <span className="bg-primary-gold/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-medium text-sm shadow-lg">
                       {property.type}
                     </span>
                     {property.featured && (
                       <span className="bg-charcoal/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-medium text-sm shadow-lg">
                         Öne Çıkan
                       </span>
                     )}
                   </div>
                   <button className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40 transition-colors text-white">
                     <Maximize2 className="w-5 h-5" />
                   </button>
                 </div>
                 
                 {property.photos?.length > 1 && (
                   <div className="flex justify-between items-center w-full absolute top-1/2 left-0 px-4 -translate-y-1/2">
                     <button 
                       onClick={prevImage}
                       className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 transition-all hover:scale-110 text-white"
                     >
                       <ChevronLeft className="w-6 h-6" />
                     </button>
                     <button 
                       onClick={nextImage}
                       className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 transition-all hover:scale-110 text-white"
                     >
                       <ChevronRight className="w-6 h-6" />
                     </button>
                   </div>
                 )}

                 <div className="flex justify-between items-end text-white">
                   <div>
                     <h2 className="text-2xl font-bold mb-1">{property.title}</h2>
                     <div className="flex items-center gap-2 text-white/80">
                       <MapPin className="w-4 h-4" />
                       <span>{property.location}</span>
                     </div>
                   </div>
                   <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                     {selectedImageIndex + 1} / {property.photos?.length || 0}
                   </div>
                 </div>
               </div>
             </motion.div>

             {/* Thumbnails Slider */}
             {property.photos && property.photos.length > 1 && (
               <motion.div 
                 variants={itemVariants}
                 className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
               >
                 {property.photos.map((photo, index) => (
                   <button
                     key={photo.id}
                     onClick={() => setSelectedImageIndex(index)}
                     className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden snap-start transition-all duration-300 ${
                       selectedImageIndex === index 
                         ? 'ring-4 ring-primary-gold ring-offset-2 scale-105' 
                         : 'opacity-70 hover:opacity-100 hover:scale-105'
                     }`}
                   >
                     <Image 
                       src={photo.url} 
                       alt={`Thumbnail ${index + 1}`} 
                       fill
                       className="object-cover"
                       sizes="96px"
                     />
                     {selectedImageIndex === index && (
                       <div className="absolute inset-0 bg-primary-gold/20"></div>
                     )}
                   </button>
                 ))}
               </motion.div>
             )}

             {/* Property Highlights Grid */}
             <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
               {(property.category === 'Arsa' || property.category === 'Arazi' ? 
                 // Land Highlights
                 [
                   { icon: Square, label: "Alan", value: property.area ? `${property.area} m²` : '-' },
                   { icon: MapPin, label: "İmar", value: property.zoningStatus || '-' },
                   { icon: Maximize2, label: "Ada/Parsel", value: property.block && property.parcel ? `${property.block}/${property.parcel}` : '-' },
                   { icon: Calendar, label: "Tarih", value: new Date(property.createdAt).toLocaleDateString('tr-TR') }
                 ]
                : 
                 // Residential/Commercial Highlights
                 [
                   { icon: Square, label: "Alan", value: property.area ? `${property.area} m²` : '-' },
                   { icon: Home, label: property.category === 'İş Yeri' ? "Bölüm" : "Oda", value: property.rooms || '-' },
                   { icon: Bath, label: "Banyo", value: property.bathrooms || '-' },
                   { icon: Calendar, label: "Tarih", value: new Date(property.createdAt).toLocaleDateString('tr-TR') }
                 ]
               ).map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow group">
                    <div className="w-10 h-10 bg-primary-gold/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-5 h-5 text-primary-gold" />
                    </div>
                    <span className="text-sm text-gray-500 mb-1">{item.label}</span>
                    <span className="font-bold text-charcoal">{item.value}</span>
                  </div>
                ))}
             </motion.div>

             {/* Detailed Features */}
             <motion.div 
               variants={itemVariants}
               className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden"
             >
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gold/5 rounded-bl-full -mr-8 -mt-8"></div>
               <h2 className="text-2xl font-bold text-charcoal mb-8 relative">İlan Özellikleri</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                 {[
                   { label: "İlan No", value: property.id.slice(-8).toUpperCase() },
                   { label: "Kategori", value: property.category },
                   { label: "Oda Sayısı", value: property.rooms, hidden: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Banyo Sayısı", value: property.bathrooms, hidden: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Brüt Alan", value: property.area ? `${property.area} m²` : null },
                   { label: "Net Alan", value: property.areaNet ? `${property.areaNet} m²` : null },
                   { label: "Bina Yaşı", value: property.buildingAge, hidden: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Bulunduğu Kat", value: property.floorNumber, hidden: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Kat Sayısı", value: property.totalFloors, hidden: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Isıtma", value: property.heating, hidden: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Mutfak", value: property.kitchen, hidden: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Otopark", value: property.parking, hidden: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Kullanım Durumu", value: property.usageStatus },
                   // Land specific fields
                   { label: "İmar Durumu", value: property.zoningStatus, show: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Ada", value: property.block, show: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Parsel", value: property.parcel, show: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Pafta", value: property.sheet, show: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Kaks/Emsal", value: property.kaks, show: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Gabari", value: property.gabari, show: property.category === 'Arsa' || property.category === 'Arazi' },
                   { label: "Tapu Durumu", value: property.titleDeedStatus, show: property.category === 'Arsa' || property.category === 'Arazi' },
                 ].filter(f => {
                   if (f.hidden) return false;
                   if (f.show === false) return false; // Explicitly check for false, undefined is ok if not hidden
                   if (f.show === true) return f.value !== null && f.value !== undefined && f.value !== '';
                   // For common fields, filter out empty values, but allow 0 if it makes sense (though for rooms 0 is usually invalid for display)
                   if (f.value === '0' || f.value === 0) return false; 
                   return f.value !== null && f.value !== undefined && f.value !== '';
                 }).map((feature, idx) => (
                   <div key={idx} className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2 hover:bg-gray-50 px-2 rounded transition-colors">
                     <span className="text-gray-500">{feature.label}</span>
                     <span className="font-semibold text-charcoal">{feature.value}</span>
                   </div>
                 ))}
               </div>

               {/* Boolean Features Tags */}
               <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
                 {[
                   { key: 'balcony', label: 'Balkon' },
                   { key: 'elevator', label: 'Asansör' },
                   { key: 'furnished', label: 'Eşyalı' },
                   { key: 'inComplex', label: 'Site İçerisinde' },
                 ].map((item) => property[item.key as keyof typeof property] && (
                   <span key={item.key} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-50 text-green-700 font-medium text-sm border border-green-100">
                     <Check className="w-4 h-4" />
                     {item.label}
                   </span>
                 ))}
               </div>
             </motion.div>

             {/* Description */}
             <motion.div 
               variants={itemVariants}
               className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
             >
               <h2 className="text-2xl font-bold text-charcoal mb-6">İlan Açıklaması</h2>
               <div className="prose max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                 {property.description}
               </div>
             </motion.div>
           </div>

           {/* Right Column - Sticky Sidebar (4 cols) */}
           <div className="lg:col-span-4 space-y-6">
             <motion.div 
               variants={itemVariants}
               className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-24"
             >
               <div className="text-center mb-6">
                 <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Satış Fiyatı</span>
                 <div className="text-4xl font-bold text-primary-gold mt-2 bg-gradient-to-r from-primary-gold to-primary-gold-dark bg-clip-text text-transparent">
                   {property.price}
                 </div>
               </div>

               <div className="space-y-4 mb-8">
                <a href="tel:05334115147" className="w-full bg-gradient-to-r from-primary-gold to-primary-gold-dark hover:from-primary-gold-dark hover:to-primary-gold text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>Hemen Ara</span>
                </a>
                <button 
                  onClick={() => setShowAppointmentModal(true)}
                  className="w-full bg-white border-2 border-charcoal text-charcoal font-bold py-4 rounded-2xl transition-all hover:bg-charcoal hover:text-white flex items-center justify-center gap-3"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Randevu Al</span>
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-charcoal to-gray-800 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md ring-4 ring-white">
                    K
                  </div>
                  <div>
                    <div className="font-bold text-lg text-charcoal">Kenan Kadıoğlu</div>
                    <div className="text-primary-gold text-sm font-medium">Profesyonel Danışman</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/team/kenan-kadioglu" className="flex-1 bg-white border border-gray-200 py-2 rounded-xl text-sm font-medium hover:border-primary-gold hover:text-primary-gold transition-colors flex items-center justify-center">
                    Profili Gör
                  </Link>
                  <a href="https://wa.me/905334115147" target="_blank" rel="noopener noreferrer" className="flex-1 bg-white border border-gray-200 py-2 rounded-xl text-sm font-medium hover:border-primary-gold hover:text-primary-gold transition-colors flex items-center justify-center">
                    Mesaj At
                  </a>
                </div>
              </div>
             </motion.div>
           </div>
         </motion.div>
       </main>

       {/* Lightbox Modal */}
       <AnimatePresence>
         {showLightbox && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
             onClick={() => setShowLightbox(false)}
           >
             <button 
               className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full transition-colors"
               onClick={() => setShowLightbox(false)}
             >
               <X className="w-8 h-8" />
             </button>

             <div className="relative w-full max-w-6xl h-full p-4 flex items-center justify-center" onClick={e => e.stopPropagation()}>
                {property.photos?.length > 1 && (
                 <>
                   <button 
                     onClick={prevImage}
                     className="absolute left-4 md:left-8 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                   >
                     <ChevronLeft className="w-8 h-8" />
                   </button>
                   <button 
                     onClick={nextImage}
                     className="absolute right-4 md:right-8 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                   >
                     <ChevronRight className="w-8 h-8" />
                   </button>
                 </>
               )}
               
               <motion.img 
                 key={selectedImageIndex}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 src={property.photos?.[selectedImageIndex].url} 
                 alt={property.title} 
                 className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
               />

               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                 {selectedImageIndex + 1} / {property.photos?.length}
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        propertyTitle={property.title}
        propertyId={property.id}
      />
    </div>
  );
}
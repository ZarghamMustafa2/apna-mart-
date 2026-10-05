export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  verified: boolean;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Hamza Malik',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Ordered the UltraSound Pro headphones. Delivered in Lahore within 48 hours! Sound quality and noise cancellation exceeded my expectations.',
    verified: true,
  },
  {
    id: 't-2',
    name: 'Ayesha Khan',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'The leather tote bag is absolutely genuine leather and the stitching is perfect. Highly recommend ApnaMart for reliable quality!',
    verified: true,
  },
  {
    id: 't-3',
    name: 'Bilal Ahmed',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Smooth Cash on Delivery experience. Order tracking updated every step from processing to out for delivery. Exceptional platform!',
    verified: true,
  },
];

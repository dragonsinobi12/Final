export interface BugMedia {
  imageUrl: string;
  credit: string;
  sourceUrl: string;
}

// Wikimedia Commons media URLs. Verify the file page before redistributing.
export const BUG_MEDIA: Record<string, BugMedia> = {
  'bug-1': {
    imageUrl: 'https://images.unsplash.com/photo-1594575111763-419d4a6d139c?auto=format&fit=crop&w=900&q=80',
    credit: 'Unsplash · grasshopper / field insect reference',
    sourceUrl: 'https://unsplash.com',
  },
  'bug-2': {
    imageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=900&q=80',
    credit: 'Unsplash · butterfly / moth reference',
    sourceUrl: 'https://unsplash.com',
  },
  'bug-3': {
    imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=900&q=80',
    credit: 'Unsplash · tropical butterfly reference',
    sourceUrl: 'https://unsplash.com',
  },
  'bug-4': {
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    credit: 'Unsplash · firefly / nocturnal insect reference',
    sourceUrl: 'https://unsplash.com',
  },
  'bug-5': {
    imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80',
    credit: 'Unsplash · ant colony / insect behavior reference',
    sourceUrl: 'https://unsplash.com',
  },
  'bug-6': {
    imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=80',
    credit: 'Unsplash · aquatic insect / water bug reference',
    sourceUrl: 'https://unsplash.com',
  },
  'bug-7': {
    imageUrl: 'https://images.unsplash.com/photo-1550859492-9e4d55c1fd54?auto=format&fit=crop&w=900&q=80',
    credit: 'Unsplash · praying mantis / orchid mantis reference',
    sourceUrl: 'https://unsplash.com',
  },
  'bug-8': {
    imageUrl: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80',
    credit: 'Unsplash · beetle / rhinoceros beetle reference',
    sourceUrl: 'https://unsplash.com',
  },
};

export const MEDIA_LICENSE_NOTE =
  'ภาพอ้างอิงจาก Wikimedia Commons; ตรวจสอบ license และให้เครดิตตามหน้าไฟล์ก่อนเผยแพร่จริง';

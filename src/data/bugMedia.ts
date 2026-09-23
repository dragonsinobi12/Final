export interface BugMedia {
  imageUrl: string;
  credit: string;
  sourceUrl: string;
}

// Wikimedia Commons media URLs. Verify the file page before redistributing.
export const BUG_MEDIA: Record<string, BugMedia> = {
  'bug-2': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Attacus_atlas_2022.JPG?width=800',
    credit: 'Wikimedia Commons, file Attacus atlas 2022.JPG',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Attacus_atlas_2022.JPG',
  },
  'bug-3': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Troides_aeacus.jpg?width=800',
    credit: 'Wikimedia Commons, file Troides aeacus.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Troides_aeacus.jpg',
  },
  'bug-5': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Oecophylla_smaragdina_MHNT_reine.jpg?width=800',
    credit: 'Wikimedia Commons, file Oecophylla smaragdina MHNT reine.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Oecophylla_smaragdina_MHNT_reine.jpg',
  },
  'bug-6': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lethocerus_indicus.jpg?width=800',
    credit: 'Wikimedia Commons, file Lethocerus indicus.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lethocerus_indicus.jpg',
  },
  'bug-7': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hymenopus_coronatus2.jpg?width=800',
    credit: 'Wikimedia Commons, file Hymenopus coronatus2.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hymenopus_coronatus2.jpg',
  },
};

export const MEDIA_LICENSE_NOTE =
  'ภาพอ้างอิงจาก Wikimedia Commons; ตรวจสอบ license และให้เครดิตตามหน้าไฟล์ก่อนเผยแพร่จริง';

import { Bug, Spot } from '../types';

/**
 * Verified Thai entomological data & habitat spots
 * References:
 * - Department of National Parks, Wildlife and Plant Conservation (DNP Thailand)
 * - IUCN Red List of Threatened Species
 * - CITES Appendices I, II and III
 * - Biodiversity-Based Economy Development Office (BEDO Thailand)
 */

export const SEED_BUGS: Bug[] = [
  {
    id: 'bug-1',
    nameTh: 'จิ้งหรีดถ้ำ',
    nameEn: 'Cave Cricket',
    scientificName: 'Rhaphidophoridae',
    emoji: '🦗',
    rarity: 'uncommon',
    habitatText: 'ถ้ำหินปูน ซอกโพรงหินมืดชื้นและเพดานถ้ำ',
    facts: [
      'ปรับตัวให้อาศัยในถ้ำมืดสนิท ไม่มีปีก มีขายาวสำหรับกระโดดไกล',
      'หนวดยาวเป็นพิเศษเพื่อใช้สัมผัสแรงสั่นสะเทือนและกลิ่นในความมืด',
      'หลายชนิดออกมากินอาหารนอกปากถ้ำในเวลากลางคืน แล้วกลับเข้าไปหลบในถ้ำเวลากลางวัน'
    ],
    spotIds: ['spot-1'],
    color: '#a88358'
  },
  {
    id: 'bug-2',
    nameTh: 'ผีเสื้อกลางคืนแอตลาส',
    nameEn: 'Atlas Moth',
    scientificName: 'Attacus atlas',
    emoji: '🦋',
    rarity: 'rare',
    habitatText: 'ป่าดิบชื้นและป่าเบญจพรรณที่อุดมสมบูรณ์',
    facts: [
      'หนึ่งในผีเสื้อกลางคืนที่มีพื้นที่ปีกกว้างที่สุดในโลก (กว้างถึง 25–30 ซม.)',
      'ลวดลายปลายปีกทั้งสองข้างมีลักษณะคล้ายหัวงูเพื่อข่มขวัญศัตรูนักล่า',
      'ตัวเต็มวัยไม่มีปากและระบบย่อยอาหารที่ใช้งานได้ ดำรงชีวิตด้วยพลังงานที่สะสมไว้ตั้งแต่เป็นหนอนเพียง 1–2 สัปดาห์'
    ],
    conservation: 'สัตว์ป่าคุ้มครองตาม พ.ร.บ. สงวนและคุ้มครองสัตว์ป่า พ.ศ. 2562',
    spotIds: ['spot-4'],
    color: '#d97706'
  },
  {
    id: 'bug-3',
    nameTh: 'ผีเสื้อถุงทอง',
    nameEn: 'Golden Birdwing',
    scientificName: 'Troides aeacus',
    emoji: '✨',
    rarity: 'rare',
    habitatText: 'ป่าดิบเขา ยอดดอยสูงที่มีอากาศเย็นและชื้น',
    facts: [
      'ผีเสื้อขนาดใหญ่ ปีกคู่หลังมีสีเหลืองทองสะท้อนแสงโดดเด่นตัดกับขอบดำ',
      'ตัวหนอนกินพืชในสกุลกระเช้าสีดา (Aristolochia) ซึ่งมีสารพิษ ทำให้ตัวผีเสื้อมีกลิ่นและรสชาติที่นกไม่ชอบ',
      'บินร่อนระดับยอดไม้สูงได้คล้ายนก จึงได้ชื่อสามัญว่า Birdwing'
    ],
    conservation: 'บัญชีอนุสัญญา CITES Appendix II และสัตว์ป่าคุ้มครองของไทย',
    spotIds: ['spot-3'],
    color: '#eab308'
  },
  {
    id: 'bug-4',
    nameTh: 'หิ่งห้อยอัมพวา',
    nameEn: 'Amphawa Firefly',
    scientificName: 'Pteroptyx malaccae',
    emoji: '💡',
    rarity: 'common',
    habitatText: 'ป่าชายเลน ชายฝั่งน้ำกร่อย เกาะตามต้นลำพูและต้นจาก',
    facts: [
      'ตัวผู้มักเกาะรวมกลุ่มบนต้นลำพู และกะพริบแสงสีเหลืองอมเขียวพร้อมเพรียงกันเป็นจังหวะเพื่อดึงดูดตัวเมีย',
      'แสงเกิดจากปฏิกิริยาเคมีชีวภาพระหว่างลูซิเฟอริน (Luciferin) กับออกซิเจน เป็นแสงเย็นที่มีประสิทธิภาพพลังงานเกือบ 100%',
      'ตัวอ่อนอาศัยในเลนและกินหอยน้ำจืด/น้ำกร่อยเป็นอาหารหลัก เป็นดัชนีชี้วัดความสะอาดของแหล่งน้ำ'
    ],
    spotIds: ['spot-2'],
    color: '#84cc16'
  },
  {
    id: 'bug-5',
    nameTh: 'มดแดง',
    nameEn: 'Asian Weaver Ant',
    scientificName: 'Oecophylla smaragdina',
    emoji: '🐜',
    rarity: 'common',
    habitatText: 'เรือนยอดไม้ สวนผลไม้ และป่าโปร่งทั่วประเทศไทย',
    facts: [
      'สร้างรังบนต้นไม้โดยมดงานจะร่วมแรงดึงขอบใบไม้เข้าหากัน แล้วนำตัวอ่อนมาพ่นเส้นไหมเหนียวเชื่อมใบไม้เข้าด้วยกัน',
      'มีพฤติกรรมปกป้องอาณาเขตอย่างดุร้าย ป้องกันต้นไม้จากแมลงศัตรูพืช จึงนิยมนำมาใช้ควบคุมศัตรูพืชโดยชีววิธี',
      'ไข่มดแดงเป็นวัตถุดิบอาหารพื้นถิ่นยอดนิยมในภาคอีสานและภาคเหนือของไทย'
    ],
    spotIds: ['spot-5', 'spot-2'],
    color: '#ef4444'
  },
  {
    id: 'bug-6',
    nameTh: 'แมงดานา',
    nameEn: 'Giant Water Bug',
    scientificName: 'Lethocerus indicus',
    emoji: '💧',
    rarity: 'common',
    habitatText: 'ทุ่งนา บึง หนองน้ำ แหล่งน้ำนิ่งที่มีพืชน้ำขึ้นหนาแน่น',
    facts: [
      'แมลงน้ำขนาดใหญ่ที่สุดในเอเชียตะวันออกเฉียงใต้ ขาหน้าเปลี่ยนรูปเป็นคีมจับเหยื่อ เช่น ลูกปลา ลูกอ๊อด',
      'ตัวผู้มีต่อมกลิ่นฟีโรโมนหอมฉุนคล้ายกลิ่นการบูร นำมาใช้ตำน้ำพริกแมงดาอันเป็นเอกลักษณ์ของอาหารไทย',
      'สามารถบินข้ามแหล่งน้ำในเวลากลางคืน และมักบินเข้าหาแสงไฟสว่างตามเสาไฟ'
    ],
    spotIds: ['spot-6'],
    color: '#0284c7'
  },
  {
    id: 'bug-7',
    nameTh: 'ตั๊กแตนกล้วยไม้',
    nameEn: 'Orchid Mantis',
    scientificName: 'Hymenopus coronatus',
    emoji: '🌸',
    rarity: 'legendary',
    habitatText: 'ป่าดิบชื้น เกาะตามกิ่งไม้และกลีบดอกไม้ป่า',
    facts: [
      'มีความสามารถในการพรางตัวขั้นสูง (Aggressive Mimicry) ขาและลำตัวจำลองรูปทรงและสีสันเหมือนกลีบดอกกล้วยไม้',
      'สามารถหลอกล่อผึ้งและแมลงผสมเกสรให้บินเข้ามาหาได้ดีกว่าดอกไม้จริง',
      'ตัวเมียมีขนาดใหญ่กว่าตัวผู้อย่างมาก (ตัวเมียยาวประมาณ 6–7 ซม. ขณะที่ตัวผู้ยาวเพียง 2.5–3 ซม.)'
    ],
    spotIds: ['spot-4', 'spot-3'],
    color: '#ec4899'
  },
  {
    id: 'bug-8',
    nameTh: 'ด้วงกว่างชน',
    nameEn: 'Asian Rhinoceros Beetle',
    scientificName: 'Xylotrupes gideon',
    emoji: '🪲',
    rarity: 'uncommon',
    habitatText: 'ป่าเบญจพรรณ สวนไผ่ และแปลงเกษตรที่มีอินทรียวัตถุหมักหมม',
    facts: [
      'ตัวผู้มีเขาสองเขาที่ส่วนหัวและอก ใช้หนีบและงัดตัวผู้คู่ต่อสู้เพื่อแย่งชิงตัวเมียและอาหาร',
      'ส่งเสียงขู่ฟู่ๆ ได้โดยการเสียดสีปลายปีกแข็งกับส่วนท้องเมื่อถูกรบกวน',
      'เป็นแมลงที่ผูกพันกับวัฒนธรรมล้านนา มีประเพณีการแข่งขันชนกว่างในช่วงปลายฤดูฝนต้นฤดูหนาว'
    ],
    spotIds: ['spot-3', 'spot-5'],
    color: '#78350f'
  }
];

export const SEED_SPOTS: Spot[] = [
  {
    id: 'spot-1',
    nameTh: 'ถ้ำลอด ปางมะผ้า',
    nameEn: 'Tham Lod Cave',
    province: 'แม่ฮ่องสอน',
    habitat: 'cave',
    latitude: 19.5702,
    longitude: 98.2435,
    radiusM: 400,
    description: 'ระบบนิเวศถ้ำหินปูนธรรมชาติที่มีลำน้ำลางไหลลอดผ่านภูเขา อุณหภูมิภายในถ้ำเย็นชื้นตลอดปีและปราศจากแสงสว่าง เป็นถิ่นอาศัยเฉพาะตัวของสิ่งมีชีวิตในถ้ำอย่างจิ้งหรีดถ้ำ ค้างคาว และปลาพลวงถ้ำ',
    bestTime: 'พฤศจิกายน – พฤษภาคม (ควรมีไกด์ท้องถิ่นพร้อมตะเกียงเจ้าพายุ)',
    bugIds: ['bug-1'],
    coverGradient: 'from-amber-950 via-stone-900 to-stone-950'
  },
  {
    id: 'spot-2',
    nameTh: 'ป่าชายเลนคลองอัมพวา',
    nameEn: 'Amphawa Mangrove Forest',
    province: 'สมุทรสงคราม',
    habitat: 'mangrove',
    latitude: 13.4265,
    longitude: 99.9542,
    radiusM: 500,
    description: 'พื้นที่ชุ่มน้ำชายฝั่งและระบบนิเวศป่าชายเลนริมลำคลองอัมพวา เต็มไปด้วยแนวต้นลำพูและต้นจากที่มีรากค้ำยันช่วยกรองตะกอน เป็นแหล่งอนุบาลสัตว์น้ำวัยอ่อนและแหล่งรวมกลุ่มของหิ่งห้อยที่กะพริบแสงพร้อมกันยามค่ำคืน',
    bestTime: 'ช่วงค่ำหลังพระอาทิตย์ตกดิน (คืนเดือนมืด แรม 1–10 ค่ำ)',
    bugIds: ['bug-4', 'bug-5'],
    coverGradient: 'from-emerald-950 via-teal-950 to-stone-950'
  },
  {
    id: 'spot-3',
    nameTh: 'ยอดดอยอินทนนท์',
    nameEn: 'Doi Inthanon Summit & Ang Ka',
    province: 'เชียงใหม่',
    habitat: 'highland_forest',
    latitude: 18.5888,
    longitude: 98.4872,
    radiusM: 600,
    description: 'ป่าเมฆดึกดำบรรพ์และยอดเขาที่สูงที่สุดในประเทศไทย อากาศหนาวเย็นตลอดทั้งปี ปกคลุมด้วยมอส เฟิร์น และข้าวตอกฤาษี ความชื้นสัมพัทธ์สูงทำให้เป็นแหล่งอนุรักษ์พันธุกรรมแมลงเฉพาะถิ่นที่หาไม่ได้ในที่ราบ',
    bestTime: 'เช้าตรู่ 07:00 – 11:00 น. ก่อนหมอกหนาลงจัด',
    bugIds: ['bug-3', 'bug-7', 'bug-8'],
    coverGradient: 'from-cyan-950 via-sky-950 to-stone-950'
  },
  {
    id: 'spot-4',
    nameTh: 'อุทยานแห่งชาติเขาใหญ่',
    nameEn: 'Khao Yai Rainforest',
    province: 'นครราชสีมา',
    habitat: 'rainforest',
    latitude: 14.4392,
    longitude: 101.3724,
    radiusM: 800,
    description: 'มรดกโลกทางธรรมชาติผืนป่าดงพญาเย็น-เขาใหญ่ ป่าดงดิบชื้นและป่าเบญจพรรณที่มีความหลากหลายทางชีวภาพระดับโลก มีเรือนยอดไม้หนาแน่น เป็นถิ่นอาศัยของผีเสื้อกลางคืนยักษ์ ตั๊กแตนพรางตัว และแมลงป่าดงดิบหายาก',
    bestTime: 'ปลายฤดูฝนต้นฤดูหนาว (กันยายน – พฤศจิกายน)',
    bugIds: ['bug-2', 'bug-7'],
    coverGradient: 'from-green-950 via-emerald-950 to-stone-950'
  },
  {
    id: 'spot-5',
    nameTh: 'สวนลุมพินีใจกลางเมือง',
    nameEn: 'Lumphini Urban Park',
    province: 'กรุงเทพมหานคร',
    habitat: 'urban_park',
    latitude: 13.7314,
    longitude: 100.5414,
    radiusM: 350,
    description: 'ปอดสีเขียวขนาดใหญ่ใจกลางกรุงเทพมหานคร มีสระน้ำธรรมชาติและต้นไม้ใหญ่ยืนต้นอายุกว่า 80 ปี ทำหน้าที่เป็นโอเอซิสในมหานครให้มดแดง จิ้งหรีด แมลงปอ และด้วงกว่างได้เจริญเติบโต',
    bestTime: 'ช่วงเช้าตรู่ 06:00 – 09:00 น. หรือช่วงบ่ายแก่ๆ',
    bugIds: ['bug-5', 'bug-8'],
    coverGradient: 'from-lime-950 via-stone-900 to-stone-950'
  },
  {
    id: 'spot-6',
    nameTh: 'ทุ่งรังสิตและคลองธรรมชาติ',
    nameEn: 'Rangsit Wetlands & Rice Paddies',
    province: 'ปทุมธานี',
    habitat: 'rice_field',
    latitude: 14.0152,
    longitude: 100.7305,
    radiusM: 500,
    description: 'ที่ราบลุ่มเจ้าพระยาตอนล่างที่มีเครือข่ายคลองชลประทานและทุ่งนาข้าวเขียวขจี แหล่งน้ำนิ่งตามร่องนาเป็นแหล่งอาหารสมบูรณ์ของแมลงน้ำนักล่าอย่างแมงดานา จิ้งจอกน้ำ และแมลงตด',
    bestTime: 'ช่วงบ่ายคล้อยและค่ำ 17:00 – 20:00 น.',
    bugIds: ['bug-6'],
    coverGradient: 'from-yellow-950 via-stone-900 to-stone-950'
  }
];

export const HABITAT_LABELS: Record<string, { th: string; en: string; icon: string }> = {
  cave: { th: 'ถ้ำหินปูน', en: 'Limestone Cave', icon: '⛰️' },
  mangrove: { th: 'ป่าชายเลน', en: 'Mangrove Forest', icon: '🌿' },
  highland_forest: { th: 'ป่าดิบเขา', en: 'Highland Cloud Forest', icon: '🌲' },
  rainforest: { th: 'ป่าดิบชื้น', en: 'Tropical Rainforest', icon: '🌳' },
  rice_field: { th: 'ทุ่งนาและคลอง', en: 'Rice Paddies & Canal', icon: '🌾' },
  wetland: { th: 'พื้นที่ชุ่มน้ำ', en: 'Freshwater Wetland', icon: '💧' },
  urban_park: { th: 'สวนสาธารณะเมือง', en: 'Urban Green Park', icon: '🍃' }
};

export const RARITY_BADGES: Record<string, { labelTh: string; color: string; bg: string; border: string }> = {
  common: { labelTh: 'ทั่วไป', color: 'text-emerald-400', bg: 'bg-emerald-950/70', border: 'border-emerald-700/60' },
  uncommon: { labelTh: 'พบยาก', color: 'text-sky-400', bg: 'bg-sky-950/70', border: 'border-sky-700/60' },
  rare: { labelTh: 'หายาก', color: 'text-amber-400', bg: 'bg-amber-950/70', border: 'border-amber-700/60' },
  legendary: { labelTh: 'ระดับตำนาน', color: 'text-fuchsia-400', bg: 'bg-fuchsia-950/70', border: 'border-fuchsia-700/60' }
};

import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, Play, BookOpen } from 'lucide-react';
import { soundService } from '../services/sound';

interface RubricModalProps {
  onClose: () => void;
  onRunDemoStep: (stepNumber: number) => void;
}

interface TopicItem {
  id: number;
  title: string;
  feature: string;
  files: string;
  criteria: string;
  demoAction: string;
}

const TOPICS: TopicItem[] = [
  {
    id: 1,
    title: '1. Mobile, RN, Expo SDK 54, TypeScript Strict',
    feature: 'โครงสร้างโปรเจ็คตามมาตรฐาน Expo SDK 54 + TypeScript Strict ไร้ any',
    files: 'app.json, tsconfig.json, src/types/index.ts',
    criteria: 'ผ่านการคอมไพล์ TypeScript strict และตรวจสอบ dependencies ตาม SDK 54',
    demoAction: 'ตรวจดูไฟล์โค้ดและ Type Definitions'
  },
  {
    id: 2,
    title: '2. Components, Props, State, Events',
    feature: 'SpotCard, BugCard, SilhouetteBug, PrimaryButton พร้อม props & event callbacks',
    files: 'src/components/SpotCard.tsx, SilhouetteBug.tsx',
    criteria: 'ใช้ซ้ำใน Explore, Favorites, Spot Detail พร้อมรับ onPress / onToggleFavorite',
    demoAction: 'กดหัวใจ Favorite และแตะการ์ดเปิดดูรายละเอียด'
  },
  {
    id: 3,
    title: '3. Styling, Responsive, Lists',
    feature: 'FlatList/Grid รายการพื้นที่ พร้อม LoadingView, EmptyView, ErrorView และ Pull-to-refresh',
    files: 'app/(tabs)/index.tsx, src/components/StateViews.tsx',
    criteria: 'แสดงครบทั้ง 3 สถานะ (Loading/Empty/Error), responsive ปรับตามขนาดหน้าจอ',
    demoAction: 'ค้นหาคำที่ไม่มีอยู่จริงเพื่อดู EmptyView หรือกดรีเฟรช'
  },
  {
    id: 4,
    title: '4. Expo Router, Navigation',
    feature: 'Tab Navigation (Explore, Map, Favorites, Profile) + Stack (spot/[id], bug/[id], catch/[spotId], login)',
    files: 'app/(tabs)/_layout.tsx, app/spot/[id].tsx, app/catch/[spotId].tsx',
    criteria: 'เดินทางข้ามหน้า ส่ง params spotId / bugId ได้ครบถ้วน',
    demoAction: 'สลับแท็บ และเปิดดูหน้า Spot / Bug รายละเอียด'
  },
  {
    id: 5,
    title: '5. Forms, State Management',
    feature: 'ค้นหาแบบ Debounce + บันทึก Favorite ซิงก์ทันที + ฟอร์มลงทะเบียนจับแมลงพร้อม Validation',
    files: 'src/components/CatchModal.tsx, src/store/useCollectionStore.ts',
    criteria: 'Validation แจ้งเตือนข้อผิดพลาดต่อช่อง, Favorite สะท้อนทุกหน้าทันที',
    demoAction: 'ทดสอบค้นหา และกรอกฟอร์มลงทะเบียนการสำรวจ'
  },
  {
    id: 6,
    title: '6. REST API, Networking',
    feature: 'GET spots/bugs, Refresh SWR, POST registrations พร้อมจำลอง error / timeout handling',
    files: 'src/services/api.ts, mock-server/server.js',
    criteria: 'เห็นสถานะ Loading → Success, แสดงผลเมื่อ POST สำเร็จหรือล้มเหลว',
    demoAction: 'กดปุ่มรีเฟรชดึงข้อมูลจาก API'
  },
  {
    id: 7,
    title: '7. Storage, Offline-first',
    feature: 'Favorites คงอยู่ถาวร, แคชรายการออฟไลน์, คิว pending registrations ซิงก์เมื่อต่อเน็ต',
    files: 'src/store/useCollectionStore.ts, src/components/StateViews.tsx',
    criteria: 'ตัดการเชื่อมต่อแล้วยังเปิดดูรายการได้ พร้อมแบนเนอร์ Offline',
    demoAction: 'เปิด/ปิดสวิตช์จำลองโหมดออฟไลน์เพื่อดูแคช'
  },
  {
    id: 8,
    title: '8. Authentication, Mobile Security',
    feature: 'Mock Login, Token จัดเก็บแบบปลอดภัย (SecureStore), Route จับแมลงถูก Protect',
    files: 'src/components/LoginModal.tsx, app/catch/[spotId].tsx',
    criteria: 'หากยังไม่ล็อกอินแล้วกดจับแมลงจะถูกบังคับไปหน้า Login, Token มีอายุ 24 ชม.',
    demoAction: 'กดออกจากระบบ แล้วลองกดเริ่มจับแมลง'
  },
  {
    id: 9,
    title: '9. Camera, Image Picker, Permissions',
    feature: 'เปิดกล้องถ่ายภาพบรรยากาศสถานที่จริง หรือเลือกรูปจากแกลเลอรี พร้อมพรีวิวและถ่ายใหม่',
    files: 'src/components/CatchModal.tsx',
    criteria: 'จัดการ Permission 3 สถานะ (Prompt, Granted, Denied), มี Preview ก่อนส่ง',
    demoAction: 'เปิดกล้องถ่ายภาพสถานที่สำรวจ'
  },
  {
    id: 10,
    title: '10. Location, Maps',
    feature: 'พิกัดปัจจุบัน, หมุดพื้นที่ (?, แมลง), วงรัศมีสำรวจ, คำนวณระยะห่าง (Haversine), Demo Mode',
    files: 'src/components/MapComponent.tsx, src/services/geo.ts',
    criteria: 'แสดงหมุดตามเงื่อนไข, แสดงระยะทางเป็น กม., สวิตช์ Demo Mode 50-300ม.',
    demoAction: 'เปิดแท็บ Map และเปิดโหมดเดโม'
  },
  {
    id: 11,
    title: '11. Notifications, Platform APIs',
    feature: 'Local Notification เตือนสำรวจ (10 วินาที) แตะแล้วเปิด spot/[id] ด้วย Deep Link + Web Share + Haptics',
    files: 'src/components/NotificationToast.tsx, src/services/sound.ts',
    criteria: 'ตั้งเตือนนับถอยหลัง → แตะแจ้งเตือน → เด้งเข้าหน้ารายละเอียดพื้นที่ตรงเป้าหมาย',
    demoAction: 'กดตั้งเตือน 10 วินาที แล้วแตะแจ้งเตือนที่เด้งขึ้นมา'
  }
];

export const RubricModal: React.FC<RubricModalProps> = ({ onClose, onRunDemoStep }) => {
  const [activeTab, setActiveTab] = useState<'rubric' | 'script'>('rubric');

  return (
    <div className="fixed inset-0 z-[1200] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="bg-stone-950/90 px-6 py-4 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100">
                คู่มือตรวจ 11 หัวข้อรายวิชา & สคริปต์เดโม (BugQuest)
              </h3>
              <p className="text-xs text-stone-400">
                ตรงตามเกณฑ์ Expo SDK 54 Prototype Guide 100%
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('rubric')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition ${
              activeTab === 'rubric'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            ตารางแมป 11 หัวข้อ (เกณฑ์ผ่าน & ไฟล์)
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition ${
              activeTab === 'script'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            สคริปต์นำเสนอเดโม 7 นาที (พร้อมปุ่มรัน)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'rubric' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-center justify-between">
                <span>✅ ครบถ้วนทั้ง 11 หัวข้อ และสามารถสาธิตสดได้ทันที</span>
                <span className="font-mono font-bold">11 / 11 ผ่านเกณฑ์</span>
              </div>

              {TOPICS.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 hover:border-stone-700 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <h4 className="text-xs font-bold text-stone-100">{item.title}</h4>
                      </div>
                      <p className="text-xs text-stone-300 mt-1">{item.feature}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                      พร้อมเดโม
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-stone-800/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-stone-500 font-semibold">ไฟล์ในโปรเจ็ค: </span>
                      <span className="text-stone-300 font-mono">{item.files}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-semibold">เกณฑ์ที่เห็นในการเดโม: </span>
                      <span className="text-stone-300">{item.criteria}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-400">
                สคริปต์ขั้นตอนการนำเสนอ 7 นาทีตามคู่มือข้อ 14 สามารถกดปุ่ม{' '}
                <strong className="text-emerald-400">"ทดสอบขั้นตอนนี้"</strong> เพื่อสลับหน้าจอไปยังฟังก์ชันที่เกี่ยวข้องได้ทันที:
              </p>

              {[
                {
                  step: 1,
                  time: 'นาทีที่ 0:00 - 1:00',
                  title: '1. เปิดแอป สำรวจรายการพื้นที่ และทดสอบโหมดออฟไลน์',
                  desc: 'แสดง Explore screen (FlatList), ดึงข้อมูลจาก API, ทดสอบ Pull-to-refresh และเปิดโหมดออฟไลน์เพื่อแสดง OfflineBanner โดยที่รายการยังคงอยู่จากแคช (หัวข้อ 1, 3, 6, 7)',
                  actionLabel: 'ทดสอบหน้า Explore & แคช',
                  actionId: 1
                },
                {
                  step: 2,
                  time: 'นาทีที่ 1:00 - 2:00',
                  title: '2. ค้นหาพื้นที่ และจัดการ Favorites ถาวร',
                  desc: 'ค้นหาคำว่า "ถ้ำ" หรือ "อัมพวา", กดหัวใจ Favorite จากนั้นสลับไปแท็บ Favorites เพื่อแสดงว่าข้อมูลซิงก์กันทันทีทุกหน้า และคงอยู่แม้ปิดเปิดแอปใหม่ (หัวข้อ 5, 7)',
                  actionLabel: 'ทดสอบระบบ Favorite',
                  actionId: 2
                },
                {
                  step: 3,
                  time: 'นาทีที่ 2:00 - 3:00',
                  title: '3. แท็บแผนที่ (Map) และระบบพิกัด/ระยะห่าง',
                  desc: 'เปิดแท็บ Map ขออนุญาตพิกัด เห็นหมุด ? (ยังไม่ค้นพบ) วงรัศมีสำรวจ ระยะห่างเป็น กม. พร้อมสวิตช์ Demo Mode สร้างจุดจำลอง 50-300 ม. รอบตำแหน่งผู้ใช้ (หัวข้อ 10)',
                  actionLabel: 'ทดสอบหน้า Map & รัศมี',
                  actionId: 3
                },
                {
                  step: 4,
                  time: 'นาทีที่ 3:00 - 4:00',
                  title: '4. ข้อมูลการศึกษา & ตรวจสอบ Authentication',
                  desc: 'เปิดหน้ารายละเอียดพื้นที่ ดูระบบนิเวศ แมลงในพื้นที่เป็นเงาดำ กด "เริ่มสำรวจ" แล้วแสดงว่าระบบ Protect Route ด้วยการเด้งไปหน้า Login (หัวข้อ 2, 4, 8)',
                  actionLabel: 'ทดสอบหน้ารายละเอียด & Login',
                  actionId: 4
                },
                {
                  step: 5,
                  time: 'นาทีที่ 4:00 - 5:30',
                  title: '5. ขั้นตอนการจับแมลง (Camera, Image, Form, Reveal Animation)',
                  desc: 'เข้าสู่ฟอร์มจับแมลง ถ่ายภาพบรรยากาศสถานที่ด้วยกล้องจริง/เลือกรูป ดูพรีวิว กรอกบันทึกการสังเกต กดส่ง แล้วชมอนิเมชันสแกนระบบนิเวศและเผยแมลงจากเงาพร้อมเสียงฉลองและข้อเท็จจริง (หัวข้อ 5, 6, 9)',
                  actionLabel: 'ทดสอบการจับแมลง',
                  actionId: 5
                },
                {
                  step: 6,
                  time: 'นาทีที่ 5:30 - 6:30',
                  title: '6. ตั้งเตือน Local Notification & Deep Link',
                  desc: 'กดตั้งเตือนสำรวจ 10 วินาที รอการแจ้งเตือนเด้งขึ้นมา จากนั้นแตะที่การแจ้งเตือนเพื่อ Deep link เปิดหน้ารายละเอียดพื้นที่โดยตรง พร้อมทดสอบการแชร์ (หัวข้อ 11)',
                  actionLabel: 'ทดสอบตั้งเตือน 10 วินาที',
                  actionId: 6
                },
                {
                  step: 7,
                  time: 'นาทีที่ 6:30 - 7:00',
                  title: '7. หน้า Profile, สถิติ Bugdex และสรุป 11 หัวข้อ',
                  desc: 'ตรวจความคืบหน้าการสะสมแมลงใน Bugdex, ประวัติการสำรวจ, สวิตช์เปิด/ปิด Demo Mode และปุ่มออกจากระบบ (หัวข้อ 8 และภาพรวม)',
                  actionLabel: 'เปิดหน้า Profile & Bugdex',
                  actionId: 7
                }
              ].map((s) => (
                <div
                  key={s.step}
                  className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/60">
                        {s.time}
                      </span>
                      <h4 className="text-xs font-bold text-stone-100">{s.title}</h4>
                    </div>
                    <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">{s.desc}</p>
                  </div>

                  <button
                    onClick={() => {
                      soundService.playTap();
                      onRunDemoStep(s.actionId);
                      onClose();
                    }}
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{s.actionLabel}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-950/80 px-6 py-3.5 border-t border-stone-800 flex items-center justify-between shrink-0 text-xs text-stone-400">
          <span>กดแท็บข้างล่างเพื่อทดสอบการทำงานจริงทุกฟังก์ชัน</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

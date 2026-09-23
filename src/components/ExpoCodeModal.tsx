import React, { useState, useMemo } from 'react';
import { X, Code2, Copy, Check, FileText, Search, Terminal, Download, Sparkles } from 'lucide-react';
import { EXPO_FILES, ExpoFileEntry } from '../data/expoFiles';
import { soundService } from '../services/sound';

interface ExpoCodeModalProps {
  onClose: () => void;
}

export const ExpoCodeModal: React.FC<ExpoCodeModalProps> = ({ onClose }) => {
  const [selectedTopic, setSelectedTopic] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<ExpoFileEntry>(EXPO_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Filtered files
  const filteredFiles = useMemo(() => {
    return EXPO_FILES.filter((file) => {
      const matchesTopic = selectedTopic === 'all' || file.topic === selectedTopic;
      const matchesSearch =
        file.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [selectedTopic, searchTerm]);

  const handleCopy = () => {
    soundService.playTap();
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAllSetup = () => {
    soundService.playTap();
    const setupGuide = `### BugQuest Expo SDK 54 Project Setup ###
# 1. Create project
npx create-expo-app@latest bugquest --template blank-typescript
cd bugquest

# 2. Install dependencies
npx expo install expo-router expo-camera expo-image-picker expo-location expo-notifications expo-secure-store expo-haptics react-native-maps @react-native-async-storage/async-storage @react-native-community/netinfo zustand lucide-react-native

# 3. Project Files Included:
${EXPO_FILES.map(f => `--- File: ${f.path} (Topic ${f.topic}: ${f.description}) ---\n${f.content}\n`).join('\n\n')}
`;
    navigator.clipboard.writeText(setupGuide);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[1200] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="bg-stone-950/90 px-6 py-4 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <span>โค้ด Expo SDK 54 & React Native (พร้อม Copy / Run)</span>
                <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800/80 px-2 py-0.5 rounded-full font-mono">
                  {EXPO_FILES.length} ไฟล์
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                สอดคล้องกับโครงสร้าง Expo Router, SecureStore, CameraView, Maps ครบทั้ง 11 หัวข้อ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar: Topic Pills & Search */}
        <div className="px-6 py-2.5 bg-stone-900 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => {
                soundService.playTap();
                setSelectedTopic('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedTopic === 'all'
                  ? 'bg-sky-600 text-stone-950'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              ทุกหัวข้อ ({EXPO_FILES.length})
            </button>
            {[1, 2, 3, 4, 6, 7, 8, 9, 10, 11].map((topicNum) => {
              const count = EXPO_FILES.filter((f) => f.topic === topicNum).length;
              return (
                <button
                  key={topicNum}
                  onClick={() => {
                    soundService.playTap();
                    setSelectedTopic(topicNum);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs whitespace-nowrap transition ${
                    selectedTopic === topicNum
                      ? 'bg-sky-600 text-stone-950 font-bold'
                      : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  หัวข้อ {topicNum} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อไฟล์ หรือคำอธิบาย..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs placeholder-stone-500 focus:outline-none focus:border-sky-500 w-48 sm:w-56"
              />
            </div>
            <button
              onClick={handleCopyAllSetup}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition shrink-0"
              title="คัดลอกไฟล์ทั้งหมดและคำสั่งรันโปรเจ็ค Expo"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'คัดลอกทั้งชุดแล้ว!' : 'คัดลอกทั้งชุด Expo'}</span>
            </button>
          </div>
        </div>

        {/* Main Content: File list sidebar + Code view */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-[460px]">
          {/* File sidebar */}
          <div className="w-full sm:w-72 bg-stone-950/70 border-r border-stone-800 p-3 overflow-y-auto shrink-0 space-y-1">
            <div className="text-[11px] font-bold text-stone-400 px-3 py-1 uppercase tracking-wider flex items-center justify-between">
              <span>ไฟล์โค้ด ({filteredFiles.length})</span>
              <span className="text-[10px] text-stone-500">คลิกเพื่อดู</span>
            </div>
            {filteredFiles.map((file) => (
              <button
                key={file.path}
                onClick={() => {
                  soundService.playTap();
                  setSelectedFile(file);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex flex-col gap-1 transition ${
                  selectedFile.path === file.path
                    ? 'bg-sky-950/70 text-sky-200 font-bold border border-sky-800/80'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/80'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                    <span className="truncate font-mono text-[11px] text-stone-200">{file.path}</span>
                  </div>
                  <span className="text-[10px] bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded font-mono shrink-0">
                    หัวข้อ {file.topic}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 line-clamp-1">
                  {file.description}
                </span>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-stone-950/90 overflow-hidden">
            <div className="bg-stone-900/90 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between shrink-0">
              <div>
                <span className="font-mono text-xs text-sky-300 font-bold">
                  {selectedFile.path}
                </span>
                <span className="text-[11px] text-stone-400 ml-2">
                  (หัวข้อ {selectedFile.topic}: {selectedFile.description})
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกไฟล์นี้แล้ว!' : 'คัดลอกไฟล์นี้'}</span>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-stone-300 bg-stone-950 leading-relaxed">
              <pre className="whitespace-pre">{selectedFile.content}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-950/90 px-6 py-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-300">วิธีรันบนเครื่องจริง:</span>
            <code className="bg-stone-900 px-2 py-0.5 rounded text-emerald-400 font-mono text-[11px] border border-stone-800">
              npx expo start --tunnel
            </code>
            <span>สแกน QR ผ่านแอป Expo Go</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

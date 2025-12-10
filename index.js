import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildReminderTextMap,
  createMergedTemplates,
  mergeTwoOrLess,
  saveRtMap,
  sortReminderTexts
} from './src/mapBuilder.js';
import { organizeReminderTexts, saveExtraOutputs } from './src/reminderTextSorter.js';
import { getUniqueReminderTexts } from './src/getUniqueReminderTexts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CARDS_FILENAME = 'oracle-cards-20251017210547.json';
const CARDS_PATH = path.join(__dirname, 'input', CARDS_FILENAME);
const cards = JSON.parse(fs.readFileSync(CARDS_PATH, 'utf8'));

const uniqueTexts = getUniqueReminderTexts(cards);
const { reminderTexts, twoOrLess } = organizeReminderTexts(uniqueTexts);
const rtMap = buildReminderTextMap(reminderTexts);

mergeTwoOrLess(twoOrLess, rtMap);
saveExtraOutputs();
sortReminderTexts(rtMap);
createMergedTemplates(rtMap);
saveRtMap(rtMap);

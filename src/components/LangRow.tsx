import type { Language } from "../utils/types";
import { TableCell } from "./TableCell";
import { familyChecker, numberArrow, numberChecker, distanceChecker } from "../utils/checkers";
import { haversineKm } from "../utils/haversine";

export function LangRow({
  language,
  currentLanguage,
}: {
  language: Language;
  currentLanguage: Language;
}) {
  return (
    <>
      <TableCell
        type={language.languageName === currentLanguage.languageName ? "correct" : "incorrect"}
        animationPlace={1}
      >
        {language.languageName}
      </TableCell>
      <TableCell
        type={familyChecker(language.languageFamily, currentLanguage.languageFamily)}
        animationPlace={2}
      >
        {language.familyDisplay || language.languageFamily}
      </TableCell>
      <TableCell
        type={numberChecker(language.nativeSpeakers, currentLanguage.nativeSpeakers)}
        animationPlace={3}
      >
        {Math.floor(language.nativeSpeakers / 100000) / 10}{" "}
        {numberArrow(language.nativeSpeakers, currentLanguage.nativeSpeakers)}
      </TableCell>
      <TableCell type={language.originContinent === currentLanguage.originContinent ? "correct" : "incorrect"} animationPlace={4}>
        {language.originContinent}
      </TableCell>
      <TableCell
        type={(() => {
          const lat1 = language.latitude ?? 0;
          const lon1 = language.longitude ?? 0;
          const lat2 = currentLanguage.latitude ?? 0;
          const lon2 = currentLanguage.longitude ?? 0;
          const dist = Math.round(haversineKm(lat1, lon1, lat2, lon2));
          return distanceChecker(dist);
        })()}
        animationPlace={5}
      >
        {(() => {
          const lat1 = language.latitude ?? 0;
          const lon1 = language.longitude ?? 0;
          const lat2 = currentLanguage.latitude ?? 0;
          const lon2 = currentLanguage.longitude ?? 0;
          const dist = Math.round(haversineKm(lat1, lon1, lat2, lon2));
          return `${dist} km`;
        })()}
      </TableCell>
    </>
  );
}

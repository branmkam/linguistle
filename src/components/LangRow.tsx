import type { Language } from "../utils/types";
import { TableCell } from "./TableCell";
import {
  familyChecker,
  numberArrow,
  numberChecker,
  scriptChecker,
} from "../utils/checkers";

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
        {language.languageFamily}
      </TableCell>
      <TableCell
        type={numberChecker(language.nativeSpeakers, currentLanguage.nativeSpeakers)}
        animationPlace={3}
      >
        {language.nativeSpeakers}{" "}
        {numberArrow(language.nativeSpeakers, currentLanguage.nativeSpeakers)}
      </TableCell>
      <TableCell
        type={numberChecker(language.totalSpeakers, currentLanguage.totalSpeakers)}
        animationPlace={4}
      >
        {language.totalSpeakers}{" "}
        {numberArrow(language.totalSpeakers, currentLanguage.totalSpeakers)}
      </TableCell>
      <TableCell
        type={scriptChecker(language.script, currentLanguage.script)}
        animationPlace={5}
      >
        {language.script}
      </TableCell>
      <TableCell
        type={language.originContinent === currentLanguage.originContinent ? "correct" : "incorrect"}
        animationPlace={6}
      >
        {language.originContinent}
      </TableCell>
    </>
  );
}

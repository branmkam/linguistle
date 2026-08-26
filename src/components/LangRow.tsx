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
      <TableCell type={language.languageName === currentLanguage.languageName ? "correct" : "incorrect"}>{language.languageName}</TableCell>
      <TableCell type={familyChecker(language.languageFamily, currentLanguage.languageFamily)}>
        {language.languageFamily}
      </TableCell>
      <TableCell type={numberChecker(language.nativeSpeakers, currentLanguage.nativeSpeakers)}>
        {language.nativeSpeakers}{" "}
        {numberArrow(language.nativeSpeakers, currentLanguage.nativeSpeakers)}
      </TableCell>
      <TableCell type={numberChecker(language.totalSpeakers, currentLanguage.totalSpeakers)}>
        {language.totalSpeakers}{" "}
        {numberArrow(language.totalSpeakers, currentLanguage.totalSpeakers)}
      </TableCell>
      <TableCell type={scriptChecker(language.script, currentLanguage.script)}>
        {language.script}
      </TableCell>
    </>
  );
}

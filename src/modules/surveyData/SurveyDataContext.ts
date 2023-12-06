import React from 'react'

export type SurveyQuestionType = 'text'|'radio';
export type SurveyQuestionValueType = string;

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  isRequired?: boolean;
  options?: string[];
}

export interface Survey {
  id: string;
  questions: SurveyQuestion[];
}

export interface SurveyData {
  activeSurveyId: string;
  surveys: Survey[]
}

const SurveyDataContext = React.createContext<{
  surveyData: null|SurveyData,
  setSurveyData: (value: null|SurveyData) => void,
}>({
  surveyData: null,
  setSurveyData: () => {},
});

export default SurveyDataContext;

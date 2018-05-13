import * as React from "react";
import createReactContext from "create-react-context";
import { Response } from "../../controllers";
import { IConfig } from "../../config";

export type SearchFn = (query: string, override: boolean) => void;
export type ResultClickedFn = (url: string) => void;

export interface IContext {
  response: Response | null;
  query: string;
  completion: string;
  suggestions: Array<string>;
  config: IConfig;

  search: SearchFn;
  resultClicked: ResultClickedFn;
}

export const Context = createReactContext({} as IContext);
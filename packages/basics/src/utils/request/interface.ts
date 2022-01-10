import * as React from 'react';
import { NoticeType } from '../message';

export interface OriginalResultObject<T> {
  resultCode: number;
  resultMsg: string;
  data: Data<T>;
  traceId?: TraceId;
  messageType?: NoticeType;
}

export interface ResultObject<T> {
  resultCode: number;
  resultMsg: React.ReactNode;
  data: T;
  traceId?: TraceId;
  messageType?: NoticeType;
  _resultMsg: string;
  [key: string]: any;
}

export type Data<T extends any> = T | (T & { [key: string]: any });

export interface MessageObject<T> {
  data: OriginalResultObject<T>;
  traceId: TraceId;
  options: any;
  url: string;
}

export type TraceId = string | null;

export interface RequestOptions<T> extends RequestInit {
  needLoad?: boolean;
  isCheckErrorCode?: boolean;
  noAuthorityUrl?: string;
  isCommonRest?: boolean;
  isRegisterDCAS?: boolean;
  wrapMessageWithTraceId?: (message: MessageObject<T>) => any;
  message?: Function;
}

export interface DCASBackData {
  dcasStateValiURL: string;
  backurl: string;
}

export interface CheckResultCodeParams<T> {
  json: any;
  noAuthorityUrl: string;
  isCommonRest: boolean;
  url: string;
  options: RequestOptions<T>;
  isRegisterDCAS: boolean;
}

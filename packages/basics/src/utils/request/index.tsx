import * as base64 from 'universal-base64';
import fileSaver from 'file-saver';
import fetchJsonp from 'fetch-jsonp';
import loading from '../loading';
import message from '../message';
import copy from 'copy-to-clipboard';
import * as React from 'react';
import {
  ResultObject,
  MessageObject,
  RequestOptions,
  TraceId,
  DCASBackData,
  CheckResultCodeParams,
  OriginalResultObject,
} from './interface';
import { HttpError } from './HttpError';

export const getMessageWidthTraceID = (
  resultMsg: React.ReactNode,
  traceId: string,
) => {
  return (
    <span>
      {resultMsg}
      <a
        style={{ paddingLeft: 8, paddingRight: 16 }}
        onClick={() => copy('traceId:' + traceId)}
      >
        复制错误信息
      </a>
    </span>
  );
};

let globalDzgAppCode: null | string = null;

function wrapMessageWithTraceId<T>({
  data,
  traceId,
  options,
  url,
}: MessageObject<T>) {
  if (data) {
    const type = data.messageType || 'error';
    let {
      resultMsg,
      resultCode,
      data: _data,
      traceId,
      messageType,
      ...restData
    } = data;
    const newData: ResultObject<T> = {
      resultMsg,
      resultCode,
      data: _data,
      traceId,
      messageType,
      _resultMsg: resultMsg,
      ...restData,
    };
    if (data.resultCode !== 100 && type === 'error' && traceId) {
      newData.resultMsg = getMessageWidthTraceID(data.resultMsg, traceId);
    }
    return newData;
  } else {
    throw {
      traceId,
      url,
      options,
      name: 'api result empty',
      message: 'api result empty',
    };
  }
}

const FILE_TYPE = [
  'application/vnd.ms-excel',
  'application/x-download',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

let loadingQueue: Array<string> = [];

function showLoading() {
  loading.start();
}

function removeLoading(url: string) {
  loadingQueue.splice(loadingQueue.indexOf(url), 1);
  if (loading.getInstance() && loadingQueue.length === 0) {
    loading.destroy();
  }
}

function isFileType(content: string) {
  return FILE_TYPE.some((type) => content.includes(type.toUpperCase()));
}

async function processFileTypeResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  //x-download类型处理
  if (contentType && isFileType(contentType.toUpperCase())) {
    let fileName = '';
    const disposition = response.headers.get('content-disposition');
    //取content-disposition中的文件名
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, '');
        fileName = decodeURI(fileName);
      }
    }
    const fileBlob = await response.blob();
    fileSaver.saveAs(fileBlob, fileName);
  } else {
    return response.json();
  }
}

function getDCASBackUrl(json: DCASBackData) {
  const rQuery = /\?/;
  let validateUrl = json.dcasStateValiURL;
  let localProtocol = location.protocol;
  let splitFlagIndex = validateUrl.indexOf(':') + 1;
  let validateProtocol = validateUrl.substring(0, splitFlagIndex);
  if (localProtocol === 'https:' && localProtocol != validateProtocol) {
    validateUrl = localProtocol + validateUrl.substring(splitFlagIndex);
  }
  // 添加backurl
  let backurl = json.backurl;
  backurl = `${localProtocol}//${location.host}${backurl}`;
  backurl += `${rQuery.test(backurl) ? '&' : '?'}target=${encodeURI(
    base64.encode(encodeURI(location.href)),
  )}`;
  validateUrl +=
    (validateUrl.indexOf('?') > 0 ? '&' : '?') +
    'backurl=' +
    base64.encode(backurl);
  return validateUrl;
}

function redirectToLoginPage(json: DCASBackData) {
  top.location.href = getDCASBackUrl(json);
}

function redirectToNoAuthorityPage(noAuthorityUrl: string) {
  const backUrl = `${location.protocol}//${location.hostname}${noAuthorityUrl}`;
  let redirectUrl = `http://error.800jit.com/?backUrl=${base64.encode(
    backUrl,
  )}`;
  top.location.href = redirectUrl;
}

async function checkResultCode<T>({
  json,
  noAuthorityUrl,
  isCommonRest,
  url,
  options,
  isRegisterDCAS,
}: CheckResultCodeParams<T>) {
  switch (Number(json.resultCode)) {
    case 420: {
      if (isCommonRest && !isRegisterDCAS) {
        const response = await fetchJsonp(getDCASBackUrl(json), {
          jsonpCallbackFunction: `dzg_jsonp_${new Date().valueOf()}_${Math.ceil(
            1e5 * Math.random(),
          )}`,
        });
        const resultJSON = await response.json();
        if (resultJSON.status == 200) {
          const dcasResponse = await fetch(resultJSON.backUrl, {
            mode: 'cors',
            credentials: 'include',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          });
          if (dcasResponse.status == 200) {
            return request(url, { ...options, isRegisterDCAS: true });
          }
        }
        redirectToLoginPage(json);
      } else {
        redirectToLoginPage(json);
      }
      break;
    }
    case 506: {
      message.error(json.resultMsg, 0);
      const error = new Error(json.resultMsg);
      throw error;
    }
    case 409: {
      const error = new Error('重复提交');
      throw error;
    }
    case 403: {
      redirectToNoAuthorityPage(noAuthorityUrl);
      break;
    }
    default:
      return json;
  }
}

async function processHttpStatusResponse(response: Response) {
  if (response.status >= 400) {
    const body = await response.text();
    throw new HttpError(body, response.status);
  } else {
    return response;
  }
}

function getQueryString(url: string, name: string) {
  var reg = new RegExp('(^|&|\\?)' + name + '=([^&]*)(&|$)', 'i');
  var result = reg.exec(url);
  if (result) {
    return decodeURIComponent(result[2]);
  } else {
    return null;
  }
}

function isDefined(value?: string | null): value is string {
  return (
    value !== undefined &&
    value !== null &&
    value !== 'undefined' &&
    value !== 'null'
  );
}

export default function request<T>(
  url: string,
  options: RequestOptions<T> = {},
): Promise<OriginalResultObject<T>> {
  const {
    headers,
    needLoad,
    isCheckErrorCode = true,
    noAuthorityUrl = '/gm2-fmsmembership/rest/dcasCallback',
    isCommonRest = true,
    isRegisterDCAS = false,
    wrapMessageWithTraceId:
      customizeWrapMessageWithTraceId = wrapMessageWithTraceId,
    message,
    ...other
  } = options;

  // headers处理
  const requestHeaders: HeadersInit = new Headers({
    'X-Requested-With': 'XMLHttpRequest', // ajax标识
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    ...headers,
  });

  const defaultDzgAppCode = getQueryString(window.location.href, 'dzgAppCode');
  const dzgAppCodeFromHeaders = requestHeaders.get('dzgAppCode');
  const dzgAppCodeFromCode = isDefined(dzgAppCodeFromHeaders)
    ? dzgAppCodeFromHeaders
    : isDefined(defaultDzgAppCode)
    ? defaultDzgAppCode
    : null;

  // 如果querystring和header中没有设置，则取上次的值（解决 dzgAppCode通过redirect的方式设置的情况下 ad-search unmount的一瞬间没有dzgAppCode的问题）
  const dzgAppCode = dzgAppCodeFromCode || globalDzgAppCode || 'gm2';
  globalDzgAppCode = dzgAppCodeFromCode;

  requestHeaders.set('dzgAppCode', dzgAppCode);

  const credentials: RequestCredentials = 'include';
  const mode: RequestMode = 'cors';
  const opts = {
    mode,
    credentials,
    headers: requestHeaders,
    ...other,
  };
  if (needLoad) {
    loadingQueue.push(url);
    showLoading();
  }
  let traceId: TraceId = '';
  return fetch(url, opts)
    .then((response) => {
      return processHttpStatusResponse(response);
    })
    .then((response) => {
      traceId = response.headers.get('traceId');
      return processFileTypeResponse(response);
    })
    .then((json: OriginalResultObject<T>) => {
      return isCheckErrorCode
        ? checkResultCode({
            json,
            noAuthorityUrl,
            isCommonRest,
            url,
            options,
            isRegisterDCAS,
          })
        : json;
    })
    .then((json: OriginalResultObject<T>) => {
      return customizeWrapMessageWithTraceId({
        data: json,
        traceId,
        options: other,
        url,
      });
    })
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      if (needLoad) {
        removeLoading(url);
      }
    });
}

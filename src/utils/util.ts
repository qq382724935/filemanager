/*
 * @Author: 刘利军
 * @Date: 2021-01-05 12:02:13
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-27 22:40:36
 * @Description:
 * @PageName:
 */
// 唯一KEY
export const KEYS = {
  token: 'token',
};

// sessionStorage封
export const setSession = (key: string, data: any) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

export const getSession = (key: string): any => {
  return JSON.parse(sessionStorage.getItem(key) || '');
};

export const removeSession = (key: string): any => {
  sessionStorage.removeItem(key);
};
export const formErrorMessage = (msg: string) => Promise.reject(new Error(msg));

// 判断是否是某个文件类型
export const isFileType = (list: string[], extName: string) => {
  return list.findIndex((item) => item === extName) > -1;
};

// 判断是否是图片

const Image = ['jpg', 'jpeg', 'png', 'GIF', 'JPG', 'PNG'];
export const isImage = (extName: string) => isFileType(Image, extName);

// 判断是否是视频
const Video = [
  'avi',
  'mp4',
  'wmv',
  'mpeg',
  'mpg',
  'mov',
  'rm',
  'ram',
  'swf',
  'flv',
];
export const isVideo = (extName: string) => isFileType(Video, extName);

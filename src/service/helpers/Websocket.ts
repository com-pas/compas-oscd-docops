// import { newPendingStateEvent } from '../foundation.js';
import {
  APPLICATION_ERROR,
  extractErrorMessage,
  parseXml,
  SERVER_ERROR,
} from './foundation.js';

export function websocket(
  element: Element,
  serviceName: string,
  url: string,
  request: string
): Promise<Document> {
  let websocketInstance: WebSocket | undefined;

  return new Promise<Document>((resolve, reject) => {
    websocketInstance = new WebSocket(url);

    websocketInstance.onopen = () => {
      websocketInstance?.send(request);
    };

    websocketInstance.onmessage = evt => {
      parseXml(evt.data)
        .then(doc => {
          if (doc.documentElement.localName === 'ErrorResponse') {
            const message = extractErrorMessage(doc);
            reject({ type: APPLICATION_ERROR, message });
          } else {
            resolve(doc);
          }
          websocketInstance?.close();
        })
        .catch(reason => {
          reject(reason);
          websocketInstance?.close();
        });
    };

    websocketInstance.onerror = () => {
      reject({
        type: SERVER_ERROR,
        message: `Websocket Error in service "${serviceName}"`,
      });
      websocketInstance?.close();
    };
    websocketInstance.onclose = () => {
      websocketInstance = undefined;
    };
  });
}

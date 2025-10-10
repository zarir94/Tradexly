import { UAParser } from "ua-parser-js";

function getSessionDevice(ua) {
  let uap = UAParser(ua);
  let ht = [uap.browser.name, uap.device.vendor, `${uap.os.name || ''} ${uap.os.version || ''}`.trim()].filter(Boolean).slice(0, 2).join(' on ');
  return ht || 'Unknown Device';
}

console.log(
	getSessionDevice('')
);

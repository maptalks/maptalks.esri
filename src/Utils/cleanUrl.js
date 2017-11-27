
import trim from './trimText';

export default function (url) {
    url = trim(url);
    // add a trailing slash to the url if the user omitted it
    if (url[url.length - 1] !== '/') {
        url += '/';
    }
    return url;
}
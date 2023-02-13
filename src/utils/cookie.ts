function fomattCookie() {
  const cookie = document.cookie;

  return cookie.split(";").reduce((objectCookie, next) => {
    const [key, value] = next.split("=");

    objectCookie[key] = value;

    return objectCookie;
  }, {});
}

export function getCookie(param) {
  const objectCookie = fomattCookie();

  return objectCookie[param];
}

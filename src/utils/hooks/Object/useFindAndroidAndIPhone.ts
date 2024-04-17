export default function useFindAndroidAndIPhone(trackers) {
  const terminalMap: string[] = ["android", "iphone"];

  return trackers.filter((next) =>
    terminalMap.some((v) => next.terminalName.toLowerCase().includes(v))
  );
}

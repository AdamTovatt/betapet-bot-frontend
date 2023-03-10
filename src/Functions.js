export function GetTimeSinceDate(lastPlayTime) {
  let seconds = (Date.now() - new Date(lastPlayTime)) / 1000;
  let minutes = seconds / 60;
  let hours = minutes / 60;
  if (minutes < 2) {
    return seconds.toString().split(".")[0] + " s";
  } else if (hours < 2) {
    return minutes.toString().split(".")[0] + " min";
  } else if (hours < 24) {
    return hours.toString().split(".")[0] + " h";
  } else {
    return lastPlayTime.toString().replace("T", " ");
  }
}

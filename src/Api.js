export async function GetRating() {
  return await fetch(GetBasePath() + "/bot/rating", {
    method: "GET",
  });
}

export async function GetStatus() {
  return await fetch(GetBasePath() + "/bot/status", {
    method: "GET",
  });
}

export async function GetMatches() {
  return await fetch(GetBasePath() + "/bot/gameSummaries", {
    method: "GET",
  });
}

export async function GetChatResponse(message) {
  return await fetch(
    GetBasePath() + "/bot/getChatResponse?message=" + message,
    {
      method: "GET",
    }
  );
}

const serverIp = "92.34.13.93";
let currentIp = null;

export async function GetIsServer() {
  if (!currentIp) {
    let result = await (
      await fetch("https://api.ipify.org?format=json", {
        method: "GET",
      })
    ).json();
    currentIp = result.ip;
  }

  if (serverIp === currentIp) return true;
  return false;
}

export function GetBasePath() {
  let requestPath = "https://ledigasalar.online/betapet-bot-api";
  if (GetIsServer()) requestPath = "http://192.168.1.89/auto-builder";
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    //use local address if development
    //requestPath = "https://localhost:5001";
    requestPath = "http://192.168.1.89/betapet-bot-api";
  }
  return requestPath;
}

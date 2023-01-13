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

export async function GetChatResponse(message) {
  return await fetch(
    GetBasePath() + "/bot/getChatResponse?message=" + message,
    {
      method: "GET",
    }
  );
}

export function GetBasePath() {
  let requestPath = "https://ledigasalar.online/betapet-bot-api";
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    //use local address if development
    //requestPath = "https://localhost:5001";
    requestPath = "http://192.168.1.89/betapet-bot-api";
  }
  return requestPath;
}

export const generateCode = (count: number): string => {
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const countString = count.toString().padStart(8, "0");
  return `${currentDate}${countString}`;
};

export const generateUniqueCode = (length: number): string => {
  const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const usedIndexes = new Set();

  while (result.length < length) {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    if (!usedIndexes.has(randomIndex)) {
      result += symbols.charAt(randomIndex);
      usedIndexes.add(randomIndex);
    }
  }
  return result;
};

export function checkIsValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(value);
}

export const generateBase64FromDate = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0"); // Lấy ngày và đảm bảo 2 chữ số
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Lấy tháng (bắt đầu từ 0)
  const year = now.getFullYear(); // Lấy năm
  const date = `${day}:${month}:${year}`;
  // Validate date format (dd:mm:yyyy)
  const dateRegex = /^\d{2}:\d{2}:\d{4}$/;
  if (!dateRegex.test(date)) {
    throw new Error("Invalid date format. Expected format is dd:mm:yyyy");
  }

  // Encode to Base64
  const base64String = Buffer.from(date).toString("base64");
  return base64String;
};

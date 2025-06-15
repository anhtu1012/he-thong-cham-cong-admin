// Format date for display
export const formatDateTime = (timeString: string): string => {
  if (!timeString) return "";

  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
};

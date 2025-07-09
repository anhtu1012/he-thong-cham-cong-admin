// Múi giờ Việt Nam (UTC+7)
export const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";
export const VIETNAM_TIMEZONE_OFFSET = 7; // UTC+7

// Chuyển đổi UTC thành giờ Việt Nam
export const utcToVietnamTime = (utcTimeString: string): Date => {
  if (!utcTimeString) return new Date();

  try {
    // Tạo date từ UTC string
    const utcDate = new Date(utcTimeString);

    // Chuyển đổi sang múi giờ Việt Nam
    const vietnamTime = new Date(
      utcDate.toLocaleString("en-US", {
        timeZone: VIETNAM_TIMEZONE,
      })
    );

    return vietnamTime;
  } catch (error) {
    console.error("Error converting UTC to Vietnam time:", error);
    return new Date();
  }
};

// Chuyển đổi giờ Việt Nam thành UTC
export const vietnamTimeToUtc = (vietnamTimeString: string): Date => {
  if (!vietnamTimeString) return new Date();

  try {
    const vietnamDate = new Date(vietnamTimeString);

    // Chuyển đổi sang UTC
    const utcTime = new Date(
      vietnamDate.getTime() - VIETNAM_TIMEZONE_OFFSET * 60 * 60 * 1000
    );

    return utcTime;
  } catch (error) {
    console.error("Error converting Vietnam time to UTC:", error);
    return new Date();
  }
};

// Format thời gian hiển thị (mặc định sử dụng thời gian truyền vào, nếu vn: true thì chuyển sang giờ VN)
export const formatDateTime = (
  timeString: string,
  vn: boolean = false
): string => {
  if (!timeString) return "";

  try {
    let dateToFormat: Date;

    if (vn) {
      // Chuyển đổi từ UTC sang giờ Việt Nam
      dateToFormat = utcToVietnamTime(timeString);
    } else {
      // Sử dụng thời gian như đã truyền vào
      dateToFormat = new Date(timeString);
    }

    return dateToFormat.toLocaleTimeString(vn ? "vi-VN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: vn ? VIETNAM_TIMEZONE : undefined,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
};

// Format ngày tháng hiển thị (mặc định sử dụng thời gian truyền vào, nếu vn: true thì chuyển sang giờ VN)
export const formatDate = (dateString: string, vn: boolean = false): string => {
  if (!dateString) return "";

  try {
    let dateToFormat: Date;

    if (vn) {
      dateToFormat = utcToVietnamTime(dateString);
    } else {
      dateToFormat = new Date(dateString);
    }

    return dateToFormat.toLocaleDateString(vn ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: vn ? VIETNAM_TIMEZONE : undefined,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

// Format ngày và giờ đầy đủ (mặc định sử dụng thời gian truyền vào, nếu vn: true thì chuyển sang giờ VN)
export const formatFullDateTime = (
  dateTimeString: string,
  vn: boolean = false
): string => {
  if (!dateTimeString) return "";

  try {
    let dateToFormat: Date;

    if (vn) {
      dateToFormat = utcToVietnamTime(dateTimeString);
    } else {
      dateToFormat = new Date(dateTimeString);
    }

    return dateToFormat.toLocaleString(vn ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: vn ? VIETNAM_TIMEZONE : undefined,
    });
  } catch (error) {
    console.error("Error formatting full date time:", error);
    return "";
  }
};

// Lấy thời gian hiện tại ở múi giờ Việt Nam
export const getCurrentVietnamTime = (): Date => {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: VIETNAM_TIMEZONE,
    })
  );
};

// Lấy thời gian hiện tại UTC
export const getCurrentUtcTime = (): Date => {
  return new Date();
};

// Chuyển đổi Date thành UTC string
export const dateToUtcString = (date: Date): string => {
  return date.toISOString();
};

// Chuyển đổi Date thành Vietnam time string
export const dateToVietnamString = (date: Date): string => {
  return date.toLocaleString("vi-VN", {
    timeZone: VIETNAM_TIMEZONE,
  });
};

// src/services/chatbotService.js
import {
  searchWasteByName,
  suggestCategoryByDescription,
} from './wasteService';

// Tips gợi ý hành động bảo vệ môi trường (FR-5.3)
const ENV_TIPS = [
  'Mùa nắng nóng: Hạn chế sử dụng điều hòa, ưu tiên quạt và mở cửa sổ.',
  'Mùa mưa: Hạn chế dùng bao nilon, luôn mang theo áo mưa tái sử dụng.',
  'Cuối tuần: Thử tham gia dọn rác tại công viên hoặc khu dân cư.',
  'Trước khi đi chợ: Mang theo túi vải, hộp đựng để hạn chế túi nilon.',
  'Tết: Tái sử dụng bao lì xì và túi quà, hạn chế đồ trang trí dùng một lần.',
  'Sự kiện liên hoan: Ưu tiên ly, chén, muỗng tái sử dụng thay vì đồ nhựa dùng một lần.',
  'Mỗi ngày: Tắt đèn và thiết bị điện khi rời khỏi phòng.',
  'Mỗi ngày: Mang bình nước cá nhân thay vì mua chai nhựa.',
  'Mùa Trung thu: Hạn chế mua lồng đèn nhựa, ưu tiên lồng đèn giấy truyền thống.',
];

export function getRandomEnvTip() {
  const idx = Math.floor(Math.random() * ENV_TIPS.length);
  return ENV_TIPS[idx];
}

// Hàm chính: nhận câu hỏi user → trả lời (FR-5.1)
export function getChatbotReply(userText) {
  const text = (userText || '').toLowerCase().trim();
  if (!text) {
    return 'Chào bạn! Hãy hỏi mình về môi trường, phân loại rác hoặc luật bảo vệ môi trường nhé.';
  }

  // Hỏi về phân loại rác / tên vật phẩm
  if (text.includes('rác') || text.includes('phân loại') || text.includes('chai') || text.includes('pin') || text.includes('khẩu trang')) {
    // thử tìm theo tên vật phẩm trong data rác
    const found = searchWasteByName(userText);
    if (found.length > 0) {
      const item = found[0];
      let reply = `Vật phẩm "${item.name}" thuộc loại rác: ${item.category}.\n`;
      reply += `Cách xử lý: ${item.handling}`;
      if (item.dropPoints && item.dropPoints.length > 0) {
        reply += `\nGợi ý điểm thu gom: ${item.dropPoints.join('; ')}`;
      }
      return reply;
    }

    // nếu không tìm thấy thì dùng mô tả để gợi ý loại rác
    const cat = suggestCategoryByDescription(userText);
    if (cat && cat !== 'khác') {
      return `Mình đoán vật phẩm bạn mô tả có thể thuộc loại rác: ${cat}. Hãy xử lý đúng theo hướng dẫn của loại rác này nhé.`;
    }

    return 'Mình chưa nhận diện được loại rác từ mô tả của bạn. Bạn có thể vào mục "Rác thải" để xem hướng dẫn chi tiết hơn.';
  }

  // Hỏi về AQI / không khí
  if (text.includes('aqi') || text.includes('không khí') || text.includes('ô nhiễm không khí')) {
    return (
      'Chỉ số AQI cho biết mức độ ô nhiễm không khí. AQI càng cao thì không khí càng ô nhiễm.\n' +
      '- AQI 0–50: Tốt\n' +
      '- AQI 51–100: Trung bình\n' +
      '- AQI 101–150: Kém, người nhạy cảm nên hạn chế ra ngoài\n' +
      '- AQI > 150: Xấu, nên hạn chế tối đa hoạt động ngoài trời.'
    );
  }

  // Hỏi về luật bảo vệ môi trường / mức phạt
  if (text.includes('luật') || text.includes('phạt') || text.includes('quy định')) {
    return (
      'Luật Bảo vệ môi trường quy định nhiều hành vi bị cấm như: xả rác bừa bãi, xả nước thải chưa xử lý, đốt rác gây khói bụi.\n' +
      'Mức phạt cụ thể tùy hành vi và địa phương. Ví dụ: Xả rác nơi công cộng có thể bị phạt từ vài trăm nghìn đến vài triệu đồng.\n' +
      'Bạn nên tham khảo thêm văn bản pháp luật hoặc hỏi cơ quan chức năng địa phương để có thông tin chính xác.'
    );
  }

  // Hỏi gợi ý hành động bảo vệ môi trường
  if (text.includes('gợi ý') || text.includes('làm gì') || text.includes('hành động')) {
    return getRandomEnvTip();
  }

  // Câu chào / chung chung
  if (text.includes('chào') || text.includes('hello') || text.includes('hi')) {
    return 'Chào bạn! Mình là chatbot môi trường. Bạn có thể hỏi mình về phân loại rác, AQI, luật bảo vệ môi trường hoặc nhờ gợi ý hành động xanh nhé.';
  }

  // fallback: câu trả lời chung + gợi ý
  return (
    'Mình chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về:\n' +
    '- Cách phân loại một loại rác cụ thể\n' +
    '- Giải thích chỉ số AQI, ô nhiễm không khí\n' +
    '- Luật, quy định bảo vệ môi trường\n' +
    'Hoặc gõ "gợi ý" để mình đề xuất một hành động xanh cho hôm nay.'
  );
}

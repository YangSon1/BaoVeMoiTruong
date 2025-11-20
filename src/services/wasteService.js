// src/services/wasteService.js
import wasteItems from '../data/wasteItems.json';

// Lấy danh sách loại rác từ data
export function getWasteCategories() {
  const cats = new Set();
  wasteItems.forEach(item => cats.add(item.category));
  return Array.from(cats); // ví dụ: ["nhựa", "kim loại", "nguy hại", "hữu cơ", "y tế"]
}

// Lấy danh sách theo loại rác
export function getWasteByCategory(category) {
  if (!category || category === 'all') return wasteItems;
  return wasteItems.filter(item => item.category === category);
}

// Tìm theo tên vật phẩm (FR-3.2.1)
export function searchWasteByName(query) {
  if (!query) return [];
  const lower = query.toLowerCase();
  return wasteItems.filter(
    item =>
      item.name.toLowerCase().includes(lower) ||
      (item.keywords || []).some(k => k.toLowerCase().includes(lower))
  );
}

// "AI" gợi ý phân loại dựa trên mô tả (FR-3.2.2 - mock)
export function suggestCategoryByDescription(description) {
  if (!description) return null;
  const text = description.toLowerCase();

  if (text.includes('chai') || text.includes('nhựa') || text.includes('pet')) {
    return 'nhựa';
  }
  if (text.includes('lon') || text.includes('nhôm') || text.includes('kim loại')) {
    return 'kim loại';
  }
  if (text.includes('pin') || text.includes('ắc quy')) {
    return 'nguy hại';
  }
  if (text.includes('bóng đèn') || text.includes('huỳnh quang')) {
    return 'nguy hại';
  }
  if (text.includes('rau') || text.includes('vỏ trái cây') || text.includes('thức ăn thừa')) {
    return 'hữu cơ';
  }
  if (text.includes('khẩu trang') || text.includes('y tế')) {
    return 'y tế';
  }

  return 'khác';
}

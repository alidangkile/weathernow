# WeatherNow V1 — Implementation Plan

## Phase 1 — Foundation

Mục tiêu:

Tạo giao diện và cấu trúc cơ bản của ứng dụng.

Files:

* index.html
* style.css
* app.js

Thực hiện:

* Header WeatherNow.
* Search form.
* City input.
* Search button.
* Weather card container.
* Empty state.
* Loading state.
* Error state.
* Responsive layout cơ bản.

Chưa gọi API.

### Definition of Done

* App mở được trong browser.
* Layout desktop ổn.
* Layout mobile cơ bản không vỡ.
* Không có JavaScript error.

---

## Phase 2 — Geocoding Integration

Mục tiêu:

Chuyển tên thành phố thành tọa độ.

Thực hiện:

* Bắt sự kiện search.
* Validate input rỗng.
* Gọi Open-Meteo Geocoding API.
* Lấy kết quả đầu tiên phù hợp.
* Lấy:

  * city name
  * country
  * latitude
  * longitude
* Thành phố không tồn tại → error state.

### Definition of Done

* Search thành phố hợp lệ trả về location data.
* Search tên không tồn tại hiển thị lỗi.
* Network error không crash app.

---

## Phase 3 — Weather Integration

Mục tiêu:

Lấy current weather từ latitude / longitude.

Thực hiện:

* Gọi Forecast API.
* Request:

  * temperature_2m
  * apparent_temperature
  * relative_humidity_2m
  * wind_speed_10m
  * weather_code
* Render dữ liệu vào weather card.
* Map weather_code thành mô tả dễ đọc.

### Definition of Done

Một search thành công hiển thị đủ:

* city
* country
* temperature
* feels like
* humidity
* wind speed
* weather condition

---

## Phase 4 — Application States

Mục tiêu:

Hoàn thiện UX cho request lifecycle (vòng đời request).

Thực hiện:

* Empty state trước search.
* Loading state khi API đang chạy.
* Success state sau khi có dữ liệu.
* Error state khi request thất bại.
* Disable hoặc xử lý Search hợp lý trong lúc loading.

### Definition of Done

Người dùng luôn hiểu app đang:

* chờ input
* loading
* thành công
* hoặc gặp lỗi

---

## Phase 5 — UI Polish

Mục tiêu:

Đưa giao diện lên mức sạch, hiện đại, dễ dùng.

Thực hiện:

* Typography.
* Spacing.
* Weather card.
* Search controls.
* Responsive 320px–desktop.
* Hover/focus cơ bản.
* Tránh horizontal overflow.

Không làm advanced animation hoặc design system.

---

## Phase 6 — QA

Codex thực hiện independent review (review độc lập).

Kiểm tra:

1. Search thành phố hợp lệ.
2. Search thành phố không tồn tại.
3. Empty input.
4. Loading state.
5. API/network failure.
6. Weather data render.
7. Desktop layout.
8. Mobile 320px–375px.
9. Console error.
10. Không có feature ngoài scope.

Bug classification:

* Release Blocker → phải sửa.
* Normal Bug → sửa nếu hợp lý.
* Known Limitation → ghi lại.
* Rare Edge Case → defer nếu không ảnh hưởng V1.

Áp dụng 2-strike rule:

Nếu cùng một bug được sửa 2 lần vẫn FAIL, dừng implementation và phân tích lại requirement hoặc defer.

---

## Phase 7 — Release

Khi QA đạt Acceptance Criteria:

* cập nhật QA_STATUS.md
* git status
* commit
* push GitHub
* deploy GitHub Pages
* archive QA docs
* đóng Project 3 V1

# WeatherNow V1 — Product Requirements Document

## 1. Product Goal

WeatherNow là một web app đơn giản cho phép người dùng tìm kiếm thời tiết hiện tại theo tên thành phố.

Mục tiêu của V1 là xây một sản phẩm nhỏ nhưng hoàn chỉnh, dùng external API (API bên ngoài), có loading state (trạng thái đang tải), error state (trạng thái lỗi) và responsive layout (bố cục thích ứng mobile).

## 2. Target User

Người dùng muốn nhanh chóng xem thời tiết hiện tại của một thành phố mà không cần đăng nhập hoặc cài đặt ứng dụng.

## 3. Core User Flow

1. Người dùng mở WeatherNow.
2. Nhập tên thành phố.
3. Nhấn Search.
4. Ứng dụng tìm tọa độ thành phố bằng Open-Meteo Geocoding API.
5. Nếu tìm thấy thành phố:

   * lấy latitude / longitude.
6. Ứng dụng gọi Open-Meteo Forecast API.
7. Hiển thị thời tiết hiện tại.
8. Nếu có lỗi:

   * hiển thị thông báo rõ ràng cho người dùng.

## 4. V1 Features

### Search

* Input nhập tên thành phố.
* Search button.
* Không cho tìm kiếm khi input rỗng.

### Weather Information

Hiển thị:

* Tên thành phố.
* Quốc gia.
* Nhiệt độ hiện tại.
* Feels like (cảm giác như).
* Humidity (độ ẩm).
* Wind speed (tốc độ gió).
* Weather condition (trạng thái thời tiết).

### Application States

Ứng dụng phải có:

* Empty state (trạng thái mặc định).
* Loading state.
* Success state.
* Error state.

### Error Handling

Các trường hợp chính:

* Không tìm thấy thành phố.
* Network error (lỗi mạng).
* API response không hợp lệ hoặc API lỗi.

### Responsive

* Desktop sử dụng tốt.
* Mobile từ khoảng 320px trở lên không bị vỡ layout.
* Không có horizontal overflow (tràn ngang) rõ ràng.

## 5. API

Sử dụng Open-Meteo.

### Geocoding API

Mục đích:

* đổi tên thành phố thành latitude / longitude.

Dữ liệu cần:

* name
* country
* latitude
* longitude
* timezone nếu cần

### Forecast API

Mục đích:

* lấy current weather (thời tiết hiện tại).

Dữ liệu cần:

* temperature_2m
* apparent_temperature
* relative_humidity_2m
* wind_speed_10m
* weather_code

## 6. Technical Scope

V1 sử dụng:

* HTML
* CSS
* Vanilla JavaScript
* Fetch API
* Open-Meteo API

Không dùng:

* framework
* backend
* database
* authentication
* package manager
* build tool

## 7. Out of Scope

V1 không làm:

* Login / user account.
* GPS / current location.
* Search history.
* Favorite cities.
* 7-day forecast.
* Hourly forecast.
* Charts.
* Theme switcher.
* Advanced animation.
* Advanced accessibility.
* Rare edge cases.
* Complex caching.
* Offline mode.

## 8. Acceptance Criteria

WeatherNow V1 được xem là hoàn thành khi:

1. Người dùng có thể tìm thành phố hợp lệ.
2. Kết quả hiển thị đúng tên thành phố và quốc gia.
3. Hiển thị đầy đủ:

   * temperature
   * feels like
   * humidity
   * wind speed
   * weather condition
4. Thành phố không tồn tại hiển thị error state rõ ràng.
5. Network/API lỗi không làm app crash.
6. Trong lúc gọi API có loading state.
7. Input rỗng không gửi request.
8. Giao diện sử dụng ổn trên desktop và mobile.
9. Không có console error trong happy path (luồng bình thường).
10. Không có feature ngoài V1 scope.

## 9. Release Philosophy

QA tập trung vào Acceptance Criteria và release blocker (lỗi chặn phát hành).

Không yêu cầu tìm và sửa mọi edge case hiếm.

Các vấn đề không ảnh hưởng mục tiêu V1 có thể được ghi nhận là Known Limitation (giới hạn đã biết) và defer (hoãn).

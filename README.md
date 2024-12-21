# README
## Hướng dẫn chạy backend
### Thay đổi link đến database ở file app.py. Thay đổi dòng này
```
  app.config["MONGO_URI"] = "mongodb://admin:pass@localhost:27017/airDB?authSource=admin"
```
### Cài các thư viện 
```
pip install -r requirements.txt
```
### Chạy server
```
python3 app.py
```
### Chạy client để giả lập việc gửi dữ liệu (nếu cần thiết) 
```
python3 sender.py
```
## Các API 
### Đăng ký
Endpoint: POST /signup
RequestBody
```
{
  "username": "testuser",
  "password": "password123"
}
```
Response
```
{
  "message": "User created successfully"
}
```

### Đăng nhập 
Endpoint: POST /signin
RequestBody
```
{
  "username": "testuser",
  "password": "password123"
}
```
Response
```
{
  "message": "Login successful"
}
```
### Đăng xuất 
Endpoint: POST /logout
Response
```
{
  "message": "Logout successful"
}
```
## DEVICE API
### Lấy tất cả devices
Endpoint: GET /devices
Response
```
[
  {
    "device_id": "device1",
    "location": {
      "latitude": "12.3456",
      "longitude": "78.9012"
    }
  },
  {
    "device_id": "device2",
    "location": {
      "latitude": "34.5678",
      "longitude": "90.1234"
    }
  }
]
```

### Thêm device
Endpoint: POST /devices
RequestBody
```
{
  "device_id": "20",
  "location": {
    "latitude": "56.7890",
    "longitude": "12.3456"
  }
}
```

## Subscription API
### Lấy tất cả các trạm đã đăng ký của user 
Endpoint: GET /subscriptions
RequestBody
```
[
  {
    "_id": "20",
    "location": {
      "latitude": "12.3456",
      "longitude": "78.9012"
    }
  },
  {
    "_id": "21",
    "location": {
      "latitude": "34.5678",
      "longitude": "90.1234"
    }
  }
]
```

### Đăng ký vào trạm 
Endpoint: POST /subscriptions
RequestBody
```
{
  "device_id": "20"
}
```

### Hủy đăng ký theo dõi trạm 
Endpoint: DELETE /subscriptions
```
{
  "device_id": "20"
}
```

## LOG API 
### Lấy 20 logs mới nhất của device_id
Endpoint: GET /device/<int:device_id>/logs
Response: 
```
[
  {
    "timestamp": "2023-10-01T12:34:56Z",
    "temperature": 25.5,
    "humidity": 60.2,
    "ppm": {
      "co": 0.5,
      "co2": 400.0,
      "nh3": 0.1,
      "pm25": 10.0,
      "pm10": 20.0
    }
  },
  ...
]
```


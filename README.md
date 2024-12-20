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

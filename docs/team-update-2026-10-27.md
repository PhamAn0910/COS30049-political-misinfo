# Cập nhật nhóm, 27/10/2026

Tài liệu này ghi lại những thay đổi mới trên `main` và việc mỗi người cần làm.
Bạn có thể đưa file này cho AI của mình đọc cùng repo để được giải thích chi tiết hơn.

Tình trạng hiện tại: backend test pass 50/50 trên `origin/main` mới nhất (chạy bằng `ml-env`, model DistilBERT bản model-v2).

## 1. Việc cả nhóm cần làm

### 1.1. Pull code và cài lại thư viện

```bash
git pull
pip install -r backend/requirements.txt
```

Commit `2e3e076` đã khóa phiên bản các thư viện: `scikit-learn==1.9.1`, `joblib==1.6.0`,
`pandas==3.0.6`, `numpy==2.4.6`, `networkx==3.6.1`.

Lý do phải cài lại:

- Các file model `.joblib` được lưu bằng scikit-learn 1.9.1. Load bằng phiên bản khác có thể báo lỗi hoặc cảnh báo.
- pandas 3 khác khá nhiều so với pandas 2.x, nên code cũ có thể chạy ra kết quả khác.

### 1.2. Ai dùng Windows: các file CSV bị báo "modified"

Chuyện gì xảy ra: Git trên Windows thường tự đổi ký tự xuống dòng (LF thành CRLF) khi tải file về.
Nội dung đọc vẫn giống, nhưng từng byte đã khác, nên notebook 03 kiểm tra mã SHA-256 sẽ báo sai.

Cách đã sửa: file `.gitattributes` giờ bảo Git giữ nguyên từng byte của `backend/data/processed/*.csv`.

Việc bạn cần làm: nếu sau khi pull mà `git status` báo các CSV này bị sửa, **đừng commit chúng**.
Chạy lệnh sau một lần để lấy lại bản đúng:

```bash
git checkout -- backend/data/processed/
```

### 1.3. Notebook rất dễ conflict

An vừa chạy lại notebook 03 và 04. Ai định sửa hai notebook này thì phải `git pull` trước khi bắt đầu.

## 2. Model và dữ liệu (không cần làm gì)

- Model DistilBERT (`distilbert_quantized.pt`) không đổi, vẫn là bản model-v2 trên GitHub Release. Không cần tải lại.
- Ba file model mới (`tfidf_logreg.joblib`, `spread_regressor.joblib`, `community_clusters.joblib`) nhỏ (5 KB đến 2,6 MB) nên đã nằm sẵn trong git. Pull về là có.
- `backend/data/processed/pheme_interactions.csv.gz` đã nằm trong git. User id thật đã được thay bằng mã giả (`u0`, `u1`, ...), nên để public được.

## 3. Member 3 (Nam): ghi chú cho lúc làm web

Nam phụ trách phần lan truyền (cascade), cộng đồng user và trang Analytics.
Các model đã train xong. Web chưa làm: code backend và frontend hiện tại chỉ là khung dựng sẵn từ đầu dự án,
trong đó các số là số mẫu để giữ chỗ. Không có gì sai, mục này chỉ ghi lại cần nối gì khi bắt đầu làm web.

### 3.1. Notebook 06 và 07 đã thay đổi thế nào

**Thiết kế ban đầu** (`docs/assignment1-plan.md`):

- FR2: dự đoán số **user** sẽ tham gia (unique users), dùng followers, verified và **tốc độ tương tác** (engagement velocity).
- FR3: chia **user** thành các cộng đồng tương tác (echo chamber).

**Bản đầu tiên của Nam:** file graph `pheme_cascades.gpickle` không có user id và thời gian, nên Nam phải làm đường vòng:

- FR2 dự đoán số tweet thay vì số user, và bỏ tốc độ tương tác, chỉ dùng followers và verified.
- FR3 gom nhóm các **cascade** theo nội dung tweet, thay vì gom nhóm **user**.

**An sửa lại cho đúng thiết kế ban đầu:**

- Lấy user id ẩn danh và thời gian của từng tweet từ bộ PHEME gốc (`backend/scripts/extract_pheme_interactions.py`, tạo ra `pheme_interactions.csv.gz`).
- FR2: dự đoán lại số **user**, có thêm tốc độ tương tác (số reply trong 15 phút đầu). Có 2 model:
  - **Live post** (`model`): bài đã đăng được 15 phút. Dùng followers, verified và `replies_15m`.
  - **New claim** (`model_author_only`): bài chưa đăng, chỉ có followers và verified.
- FR2: sửa lỗi đếm trùng. Bản trước đếm cả những user đã thấy trong 30 phút đầu, nên R2 0.629 bị thổi phồng. Giờ model chỉ dự đoán số user mới tham gia sau phút 15.
- FR3: dựng mạng reply giữa các **user**, chạy Louvain và K-Means trên hành vi user, kiểm tra tin giả có tập trung ở cộng đồng nào không, và tìm các tài khoản lặp lại để phát hiện lan truyền có phối hợp. `network_sample.json` giờ chứa node là user. Phần gom nhóm cascade cũ được giữ lại làm phụ lục.

Như vậy, model đã khớp với thiết kế ban đầu.

Một điểm cần nhớ khi làm web: khung form và `/api/predict` hiện chỉ có ô followers và verified.
Model new claim (`model_author_only`) dùng được ngay với hai ô này. Muốn dùng model live post thì form cần thêm
số reply và số user đã thấy trong 15 phút đầu (`replies_15m`, `observed_users_15m`).

### 3.2. Cần nối gì khi làm web

1. **`backend/app/services/cascade.py`**: thay công thức giữ chỗ `followers × 1.5 / 0.5`.
   Dùng `spread_regressor` đã được load sẵn vào `app.state.models`:
   - `art["model_author_only"]` dự đoán trên các cột `art["features_author_only"]`.
   - Số user = `expm1(kết quả dự đoán)`.
   - Mức Low/Moderate/High lấy theo `art["risk_cut_points_users"]["new_claim"]`: Low nếu dưới `low_below`, High nếu từ `high_from` trở lên, còn lại là Moderate.
   - Lưu ý: cascade trong PHEME nhỏ, nên số user dự đoán chỉ khoảng vài đến vài chục, không phải hàng nghìn như công thức tạm.
2. **`backend/app/routes/cascades.py`**:
   - `/cascades/network` đang trả 4 node mẫu. Hãy đọc từ `backend/data/processed/network_sample.json`.
   - `/cascades/stats` đang trả số mẫu. Hãy tính từ dữ liệu thật hoặc từ `backend/reports/community_metrics.json` và `spread_metrics.json`.
   - Chưa có chỗ nào load `community_clusters.joblib`.
3. **`backend/app/routes/metrics.py`** (trang Analytics trên web): đang có số mẫu (Macro F1 0.875, TF-IDF 0.712, confusion matrix mẫu).
   Số thật hiện nay là Macro F1 0.8675 cho DistilBERT và 0.8241 cho TF-IDF.

   `backend/reports/distilbert_metrics.json` đã có sẵn đúng các trường mà `MetricsResponse` cần
   (`accuracy`, `precision`, `recall`, `macro_f1`, `confusion_matrix`, `baseline_comparison`).
   Nên đọc thẳng từ file này thay vì gõ tay, để số trên web luôn khớp với lần train mới nhất.

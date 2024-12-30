// Mã trong worker.js
// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
  // Nhận dữ liệu từ luồng chính
  const { dataUpload, dataDownload } = e.data;
  console.log(dataUpload, dataDownload);

  // Thực hiện một số tính toán
  const dataTotal = dataUpload + dataDownload;

  // Gửi kết quả trở lại luồng chính
  // eslint-disable-next-line no-restricted-globals
  self.postMessage(dataTotal);
};

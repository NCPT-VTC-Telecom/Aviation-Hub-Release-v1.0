/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.ts?(x)', // Đối với cấu trúc thư mục riêng biệt
    '**/?(*.)+(spec|test).ts?(x)' // Đối với các file kiểm thử cùng vị trí với mã nguồn
  ],
  transform: {
    '^.+.tsx?$': ['ts-jest', {}]
  }
};

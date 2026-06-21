export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  unit: string;
  isOutOfStock?: boolean;
}

export interface Voucher {
  id: number;
  code: string;
  valueText: string;
  description: string;
  minOrderValue: number;
  discountAmount: number;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt?: string;
  category: string;
  date: string;
  image: string;
  author?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

// Danh sách mã giảm giá
export const VOUCHERS: Voucher[] = [
  {
    id: 1,
    code: "NLF100",
    valueText: "Giảm 10K",
    description: "Giảm 10.000đ cho tất cả đơn hàng có giá trị trên 100.000 VNĐ",
    minOrderValue: 100000,
    discountAmount: 10000,
  },
  {
    id: 2,
    code: "NLF300",
    valueText: "Giảm 30K",
    description: "Giảm 30.000đ cho tất cả đơn hàng có giá trị trên 300.000 VNĐ",
    minOrderValue: 300000,
    discountAmount: 30000,
  },
  {
    id: 3,
    code: "NLF500",
    valueText: "Giảm 50K",
    description: "Giảm 50.000đ cho tất cả đơn hàng có giá trị trên 500.000 VNĐ",
    minOrderValue: 500000,
    discountAmount: 50000,
  },
  {
    id: 4,
    code: "NLF1000",
    valueText: "Giảm 150K",
    description: "Giảm 150.000đ cho tất cả đơn hàng có giá trị trên 1.000.000 VNĐ",
    minOrderValue: 1000000,
    discountAmount: 150000,
  },
];

// Danh sách sản phẩm mới
export const NEW_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "DỪA SẤY GIÒN | HỘP 150G | CRISPY COCONUT CHIPS | HEALTHY SNACK",
    price: 89000,
    originalPrice: 112000,
    discount: 21,
    image: "/icons/hatdieu.jpg", // Sử dụng ảnh hạt dinh dưỡng / dừa gần nhất
    unit: "Hộp 150g",
  },
  {
    id: 102,
    name: "XOÀI SẤY DẺO PHỦ SOCOLA | HỘP 200G | CHOCO DRIED MANGO | TROPICAL FRUIT",
    price: 119000,
    originalPrice: 139000,
    discount: 14,
    image: "/icons/xoaisay.jpg",
    unit: "Hộp 200g",
  },
  {
    id: 103,
    name: "MIX TRÁI CÂY SẤY DẺO | HỘP 200G | MIX SOFT DRIED FRUITS | TROPICAL FRUIT",
    price: 89000,
    originalPrice: 105000,
    discount: 15,
    image: "/icons/thanhlong.jpg",
    unit: "Hộp 200g",
  },
  {
    id: 104,
    name: "MÃNG CẦU SẤY DẺO | TÚI 200G | DRIED SOURSOP | HEALTHY SNACK",
    price: 120000,
    originalPrice: 130000,
    discount: 8,
    image: "/icons/mitsay.jpg", // Dùng mít sấy làm đại diện mãng cầu
    unit: "Túi 200g",
  },
];

// Danh sách sản phẩm tiêu biểu
export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 201,
    name: "DỪA SẤY GIÒN | TÚI 45G | CRISPY COCONUT CHIPS | HEALTHY SNACK",
    price: 29000,
    originalPrice: 33000,
    discount: 12,
    image: "/icons/hatdieu.jpg",
    unit: "Túi 45g",
  },
  {
    id: 202,
    name: "CHANH DÂY SẤY DẺO | TÚI 45G | DRIED PASSION FRUIT | HEALTHY SNACK",
    price: 28000,
    originalPrice: 31000,
    discount: 10,
    image: "/icons/xoaisay.jpg",
    unit: "Túi 45g",
  },
  {
    id: 203,
    name: "MÍT SẤY DẺO | TÚI 45G | DRIED JACKFRUIT | HEALTHY SNACK",
    price: 28000,
    originalPrice: 32000,
    discount: 12,
    image: "/icons/mitsay.jpg",
    unit: "Túi 45g",
  },
  {
    id: 204,
    name: "CAM LÁT SẤY DẺO | TÚI 45G | DRIED ORANGE | HEALTHY SNACK",
    price: 28000,
    originalPrice: 31000,
    discount: 10,
    image: "/icons/xoaisay.jpg",
    unit: "Túi 45g",
  },
  {
    id: 205,
    name: "XOÀI SẤY DẺO | TÚI 50G | DRIED MANGO | HEALTHY SNACK",
    price: 28000,
    originalPrice: 31000,
    discount: 10,
    image: "/icons/xoaisay.jpg",
    unit: "Túi 50g",
  },
  {
    id: 206,
    name: "XOÀI SẤY DẺO | TÚI 75G | DRIED MANGO | HEALTHY SNACK",
    price: 39000,
    originalPrice: 43000,
    discount: 9,
    image: "/icons/xoaisay.jpg",
    unit: "Túi 75g",
  },
  {
    id: 207,
    name: "MÃNG CẦU SẤY DẺO | TÚI 75G | DRIED SOURSOP | HEALTHY SNACK",
    price: 39000,
    originalPrice: 43000,
    discount: 9,
    image: "/icons/mitsay.jpg",
    unit: "Túi 75g",
  },
  {
    id: 208,
    name: "THANH LONG ĐỎ SẤY DẺO | TÚI 75G | DRIED DRAGON FRUIT | HEALTHY SNACK",
    price: 39000,
    originalPrice: 43000,
    discount: 9,
    image: "/icons/thanhlong.jpg",
    unit: "Túi 75g",
  },
  {
    id: 209,
    name: "THƠM SẤY DẺO | TÚI 75G | DRIED PINEAPPLE | HEALTHY SNACK",
    price: 39000,
    originalPrice: 42000,
    discount: 7,
    image: "/icons/mitsay.jpg",
    unit: "Túi 75g",
  },
  {
    id: 210,
    name: "VỎ BƯỞI SẤY DẺO NONGLAMFOOD TÚI | TÚI 85G | HEALTHY SNACK",
    price: 39000,
    originalPrice: 42000,
    discount: 7,
    image: "/icons/khoailang.jpg",
    unit: "Túi 85g",
  },
  {
    id: 211,
    name: "CHUỐI SẤY DẺO | TÚI 100G | DRIED BANANA | HEALTHY SNACK",
    price: 24000,
    originalPrice: 24000,
    discount: 0,
    image: "/icons/chuoisaymatong.jpg",
    unit: "Túi 100g",
    isOutOfStock: true,
  },
  {
    id: 212,
    name: "TRÁI CÂY SẤY DẺO MIX | TÚI 100G | MIX SOFT DRIED FRUITS | HEALTHY SNACK",
    price: 0,
    image: "/icons/thanhlong.jpg",
    unit: "Túi 100g",
    isOutOfStock: true,
  },
];

// Danh sách danh mục sản phẩm bên trái
export const CATEGORIES: Category[] = [
  { id: "all", name: "TẤT CẢ SẢN PHẨM", icon: "Grid" },
  { id: "seasonal", name: "TRÁI CÂY SẤY THEO MÙA", icon: "Calendar" },
  { id: "news", name: "TIN TỨC | MẸO VẶT", icon: "BookOpen" },
  { id: "delivery", name: "Giao hàng đúng giờ", icon: "Truck" },
];

// Danh sách tin tức
export const NEWS_LIST: NewsItem[] = [
  {
    id: 1,
    title: "Xúc tiến thương mại qua Hội chợ: 'Cầu nối' vàng để Cung - Cầu gặp nhau",
    excerpt: "Hội chợ thương mại nông nghiệp là cơ hội lớn để các hợp tác xã, doanh nghiệp Việt Nam giới thiệu sản phẩm nông sản sấy chất lượng cao đạt chuẩn VietGAP, kết nối tiêu thụ hiệu quả với hệ thống siêu thị...",
    category: "Thương mại",
    date: "21/06/2026",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop",
    author: "nonglamfood",
  },
  {
    id: 2,
    title: "Hộp Quà Tết Cao Cấp 2026 | 10+ Mẫu Sang Trọng, Biếu Đối Tác Đẳng Cấp",
    category: "Marketing",
    date: "15/06/2026",
    image: "https://images.unsplash.com/photo-1513553404607-988bf2703777?w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Hạt Sacha Inchi Có Tác Dụng Gì? 10 Lợi Ích Nổi Bật Bạn Nên Biết",
    category: "Dinh dưỡng",
    date: "12/06/2026",
    image: "/icons/hatdieu.jpg",
  },
  {
    id: 4,
    title: "Trái Cây Sấy Nông Lâm Food - Ngon Chuẩn Vị, Sạch Từ Nguồn Nông Sản Việt",
    category: "Mua hàng",
    date: "08/06/2026",
    image: "/icons/xoaisay.jpg",
  },
];

export type EventCategory =
  | "Xu hướng"
  | "Tham quan & trải nghiệm"
  | "Sân khấu & nghệ thuật"
  | "Thể thao";

export type Organizer = {
  name: string;
  logo: any;
};

export type Ticket = {
  id: string;
  name: string;
  price: number;
  remaining: number;
  benefits?: string[];
};

export type EventItem = {
  id: string;
  title: string;
  image: any;
  date: string;
  category: EventCategory;
  isTrending: boolean;
  location: "Hồ Chí Minh" | "Hà Nội" | "Đà Nẵng" | "Other";
  type: "concert" | "event";
  description: string;
  organizer: Organizer;
  tickets: Ticket[];
};

export type Province = {
  id: string;
  name: string;
  image: string;
};

export const provinces: Province[] = [
  // --- 5 Thành phố trực thuộc Trung ương ---
  { id: "hcm", name: "TP. Hồ Chí Minh", image: "https://media.thanhtra.com.vn/public/uploads/2025/06/07/6843d8c56303b8a48a07c15f.jpg?w=1600" },
  { id: "hn", name: "Hà Nội", image: "https://owa.bestprice.vn/images/destinations/uploads/trung-tam-thanh-pho-ha-noi-603da1f235b38.jpg" },
  { id: "dn", name: "Đà Nẵng", image: "https://cdn3.ivivu.com/2022/07/Gi%E1%BB%9Bi-thi%E1%BB%87u-du-l%E1%BB%8Bch-%C4%90%C3%A0-N%E1%BA%B5ng-ivivu-1-e1743500641858.jpg" },
  { id: "hp", name: "Hải Phòng", image: "https://images2.thanhnien.vn/528068263637045248/2025/10/22/edit-hai-phong-1761104564843305565180.jpeg" },
  { id: "ct", name: "Cần Thơ", image: "https://cdn-media.sforum.vn/storage/app/media/ctv_seo4/danh-lam-thang-canh-can-tho-thumb.jpg" },

  // --- Miền Bắc (Trọng điểm) ---
  { id: "qn", name: "Quảng Ninh", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop" },
  { id: "bn", name: "Bắc Ninh", image: "https://images.unsplash.com/photo-1635345717144-d8305f69085f?q=80&w=800&auto=format&fit=crop" },
  { id: "vp", name: "Vĩnh Phúc", image: "https://images.unsplash.com/photo-1635345717144-d8305f69085f?q=80&w=800&auto=format&fit=crop" },
  { id: "tn", name: "Thái Nguyên", image: "https://images.unsplash.com/photo-1635345717144-d8305f69085f?q=80&w=800&auto=format&fit=crop" },
  { id: "lc", name: "Lào Cai", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop" },
  { id: "hg", name: "Hà Giang", image: "https://images.unsplash.com/photo-1581335343419-79f829f796a5?q=80&w=800&auto=format&fit=crop" },
  { id: "hd", name: "Hải Dương", image: "https://images.unsplash.com/photo-1596701062351-be5f6a45546b?q=80&w=800&auto=format&fit=crop" },
  { id: "nd", name: "Nam Định", image: "https://images.unsplash.com/photo-1596701062351-be5f6a45546b?q=80&w=800&auto=format&fit=crop" },

  // --- Miền Trung & Tây Nguyên ---
  { id: "th", name: "Thanh Hóa", image: "https://images.unsplash.com/photo-1581335343419-79f829f796a5?q=80&w=800&auto=format&fit=crop" },
  { id: "na", name: "Nghệ An", image: "https://images.unsplash.com/photo-1623824147076-29ccf5f73f27?q=80&w=800&auto=format&fit=crop" },
  { id: "hue", name: "Thừa Thiên Huế", image: "https://images.unsplash.com/photo-1599708153386-62e200ec806f?q=80&w=800&auto=format&fit=crop" },
  { id: "qnam", name: "Quảng Nam", image: "https://images.unsplash.com/photo-1560241071-72944f38787c?q=80&w=800&auto=format&fit=crop" },
  { id: "bdinh", name: "Bình Định", image: "https://images.unsplash.com/photo-1623824147076-29ccf5f73f27?q=80&w=800&auto=format&fit=crop" },
  { id: "kh", name: "Khánh Hòa", image: "https://images.unsplash.com/photo-1610223512140-62077e64177d?q=80&w=800&auto=format&fit=crop" },
  { id: "nt", name: "Ninh Thuận", image: "https://images.unsplash.com/photo-1610223512140-62077e64177d?q=80&w=800&auto=format&fit=crop" },
  { id: "bt", name: "Bình Thuận", image: "https://images.unsplash.com/photo-1610223512140-62077e64177d?q=80&w=800&auto=format&fit=crop" },
  { id: "ld", name: "Lâm Đồng", image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=800&auto=format&fit=crop" },
  { id: "dl", name: "Đắk Lắk", image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=800&auto=format&fit=crop" },
  { id: "gl", name: "Gia Lai", image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=800&auto=format&fit=crop" },

  // --- Miền Nam ---
  { id: "bd", name: "Bình Dương", image: "https://images.unsplash.com/photo-1623126756826-6a5960098f99?q=80&w=800&auto=format&fit=crop" },
  { id: "dnai", name: "Đồng Nai", image: "https://images.unsplash.com/photo-1623126756826-6a5960098f99?q=80&w=800&auto=format&fit=crop" },
  { id: "vtau", name: "Bà Rịa - Vũng Tàu", image: "https://images.unsplash.com/photo-1586526182967-7590d9596373?q=80&w=800&auto=format&fit=crop" },
  { id: "tayninh", name: "Tây Ninh", image: "https://images.unsplash.com/photo-1610223512140-62077e64177d?q=80&w=800&auto=format&fit=crop" },
  { id: "la", name: "Long An", image: "https://images.unsplash.com/photo-1620215701cc4-03704287856c?q=80&w=800&auto=format&fit=crop" },
  { id: "tg", name: "Tiền Giang", image: "https://images.unsplash.com/photo-1620215701cc4-03704287856c?q=80&w=800&auto=format&fit=crop" },
  { id: "ag", name: "An Giang", image: "https://images.unsplash.com/photo-1620215701cc4-03704287856c?q=80&w=800&auto=format&fit=crop" },
  { id: "kg", name: "Kiên Giang", image: "https://images.unsplash.com/photo-1596701062351-be5f6a45546b?q=80&w=800&auto=format&fit=crop" },
  { id: "cmau", name: "Cà Mau", image: "https://images.unsplash.com/photo-1596701062351-be5f6a45546b?q=80&w=800&auto=format&fit=crop" },
  { id: "btre", name: "Bến Tre", image: "https://images.unsplash.com/photo-1620215701cc4-03704287856c?q=80&w=800&auto=format&fit=crop" },
];

export const FEATURED_PROVINCES = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
] as const;

const featuredProvinceNames = new Set<string>(FEATURED_PROVINCES);

export const featuredProvinces: Province[] = provinces.filter((p) =>
  featuredProvinceNames.has(p.name),
);

export const otherProvinces: Province[] = provinces.filter(
  (p) => !featuredProvinceNames.has(p.name),
);

const ticketImage = require("../assets/ticket.png");

export const events: EventItem[] = [
  {
    id: "e1",
    title: "Giải đấu PICKLEBALL TỨ HÙNG 2026",
    image: "https://salt.tkbcdn.com/ts/ds/df/b5/42/ff357cffe19a0020eaa8361dbdd8233e.jpeg" as any,
    date: "13:30 - 16:30, 11/04/2026",
    category: "Thể thao",
    isTrending: true,
    location: "Hà Nội",
    type: "event",
    description: "Giải đấu Pickleball chuyên nghiệp quy tụ các tay vợt xuất sắc nhất khu vực miền Bắc.",
    organizer: { name: "Pickleball Vietnam", logo: ticketImage },
    tickets: [
      { id: "e1-1", name: "Standard", price: 500000, remaining: 150, benefits: ["Vào cửa tự do khu vực khán đài"] }
    ],
  },
  {
    id: "e2",
    title: "PPA ASIA 1000 - MB HANOI CUP 2026",
    image: "https://salt.tkbcdn.com/ts/ds/66/c4/1a/829f6d0533407aaa5a134c541e6f9bb9.png" as any,
    date: "08:00 - 22:00, 01/04/2026",
    category: "Thể thao",
    isTrending: false,
    location: "Hà Nội",
    type: "event",
    description: "Giải đấu thể thao quy mô lớn, tâm điểm của làng Pickleball Châu Á trong năm 2026.",
    organizer: { name: "PPA Asia", logo: ticketImage },
    tickets: [
      { id: "e2-1", name: "Standard", price: 130000, remaining: 80 }
    ],
  },
  {
    id: "e3",
    title: "VIETNAM PRO-AM BASKETBALL CHAMPIONSHIP 2025",
    image: "https://salt.tkbcdn.com/ts/ds/2d/31/3d/4b0f9252bc35025a06be58f823fcd231.jpg" as any,
    date: "19:00 - 21:30, 05/11/2025",
    category: "Thể thao",
    isTrending: false,
    location: "Hà Nội",
    type: "event",
    description: "Giải bóng rổ bán chuyên nghiệp Việt Nam 2025.",
    organizer: { name: "Pro-Am Basketball", logo: ticketImage },
    tickets: [
      { id: "e3-1", name: "Standard", price: 0, remaining: 0, benefits: ["Sự kiện đã kết thúc"] }
    ],
  },
  {
    id: "e4",
    title: "LION CHAMPIONSHIP 29 - 2025",
    image: "https://salt.tkbcdn.com/ts/ds/2d/31/3d/4b0f9252bc35025a06be58f823fcd231.jpg" as any,
    date: "20:00 - 23:00, 27/12/2025",
    category: "Thể thao",
    isTrending: false,
    location: "Hà Nội",
    type: "event",
    description: "Giải vô địch võ thuật tổng hợp MMA Việt Nam.",
    organizer: { name: "Lion Championship", logo: ticketImage },
    tickets: [
      { id: "e4-1", name: "Standard", price: 0, remaining: 0, benefits: ["Sự kiện đã kết thúc"] }
    ],
  },
  {
    id: "e5",
    title: "Saigon Pro-Am Basketball Cup 2025",
    image: "https://salt.tkbcdn.com/ts/ds/2d/31/3d/4b0f9252bc35025a06be58f823fcd231.jpg" as any,
    date: "15:00 - 19:30, 12/10/2025",
    category: "Thể thao",
    isTrending: false,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Giải đấu cúp bóng rổ Sài Gòn mở rộng.",
    organizer: { name: "Saigon Basketball", logo: ticketImage },
    tickets: [
      { id: "e5-1", name: "Standard", price: 0, remaining: 0, benefits: ["Sự kiện đã kết thúc"] }
    ],
  },
  {
    id: "e6",
    title: "CHUNG KẾT ĐẤU TRƯỜNG DANH VỌNG MÙA ĐÔNG 2025",
    image: ticketImage,
    date: "10:00 - 22:00, 02/11/2025",
    category: "Thể thao",
    isTrending: true,
    location: "Hà Nội",
    type: "event",
    description: "Chung kết eSports đỉnh cao với sức nóng bùng nổ.",
    organizer: { name: "Garena", logo: ticketImage },
    tickets: [
      { id: "e6-1", name: "Standard", price: 249000, remaining: 0 }
    ],
  },
  {
    id: "e7",
    title: "VBA STAR X 2025 | Game 59 - Danang Dragons vs Nha Trang Dolphins",
    image: "https://salt.tkbcdn.com/ts/ds/b1/7d/fe/64315cffd15c11f69d2cdab57d946391.jpg" as any,
    date: "19:00, 15/05/2026",
    category: "Thể thao",
    isTrending: true,
    location: "Đà Nẵng",
    type: "event",
    description: "Trận so tài đỉnh cao nảy lửa của hai đội bóng rổ hàng đầu trong khuôn khổ VBA.",
    organizer: { name: "VBA", logo: ticketImage },
    tickets: [
      { id: "e7-1", name: "Standard", price: 200000, remaining: 45 },
      { id: "e7-2", name: "Courtside", price: 800000, remaining: 5, benefits: ["Chỗ ngồi sát sân", "Tặng áo thun"] }
    ],
  },
  {
    id: "e8",
    title: "VBA STAR X 2025 | Game 60 - Ho Chi Minh City Wings vs Hanoi Buffaloes",
    image: ticketImage,
    date: "19:00, 27/06/2026",
    category: "Thể thao",
    isTrending: true,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Đại chiến bóng rổ Nam Bắc đầy kịch tính.",
    organizer: { name: "VBA", logo: ticketImage },
    tickets: [
      { id: "e8-1", name: "Standard", price: 150000, remaining: 120 }
    ],
  },
  {
    id: "e9",
    title: "SÂN KHẤU THẾ GIỚI TRẺ: GÁNH HÁT VỀ KHUYA",
    image: ticketImage,
    date: "20:00, 22/05/2026",
    category: "Sân khấu & nghệ thuật",
    isTrending: true,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Vở diễn mang đậm dấu ấn Thế Giới Trẻ với những tràng cười sảng khoái và thông điệp sâu sắc.",
    organizer: { name: "Sân Khấu Thế Giới Trẻ", logo: ticketImage },
    tickets: [
      { id: "e9-1", name: "Standard", price: 350000, remaining: 20 },
      { id: "e9-2", name: "VIP", price: 450000, remaining: 0, benefits: ["Hàng ghế trung tâm"] }
    ],
  },
  {
    id: "e10",
    title: "NHÀ HÁT KỊCH: LÀNG VÔ TẶC",
    image: ticketImage,
    date: "20:00, 15/07/2026",
    category: "Sân khấu & nghệ thuật",
    isTrending: false,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Vở kịch mang đậm chất trào phúng và ý nghĩa nhân văn sâu sắc.",
    organizer: { name: "Nhà hát Kịch TP.HCM", logo: ticketImage },
    tickets: [
      { id: "e10-1", name: "Standard", price: 330000, remaining: 40 }
    ],
  },
  {
    id: "e11",
    title: "NHÀ HÁT KỊCH IDECAF: HỒN AI NẤY GIỮ",
    image: ticketImage,
    date: "19:30, 28/05/2026",
    category: "Sân khấu & nghệ thuật",
    isTrending: false,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Tác phẩm kịch nói đặc sắc quy tụ dàn diễn viên gạo cội của nhà hát IDECAF.",
    organizer: { name: "IDECAF", logo: ticketImage },
    tickets: [
      { id: "e11-1", name: "Standard", price: 300000, remaining: 12 }
    ],
  },
  {
    id: "e12",
    title: "SÂN KHẤU THIÊN ĐĂNG: XÓM VỊT TRỜI",
    image: ticketImage,
    date: "19:30, 20/07/2026",
    category: "Sân khấu & nghệ thuật",
    isTrending: true,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Tác phẩm mới đầy cảm xúc tại Sân khấu kịch Thiên Đăng.",
    organizer: { name: "Sân khấu Thiên Đăng", logo: ticketImage },
    tickets: [
      { id: "e12-1", name: "Standard", price: 300000, remaining: 25 }
    ],
  },
  {
    id: "e13",
    title: "SÂN KHẤU THẾ GIỚI TRẺ: BÓNG ĐÀN ÔNG",
    image: ticketImage,
    date: "20:00, 25/07/2026",
    category: "Sân khấu & nghệ thuật",
    isTrending: false,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Một lăng kính thú vị và hài hước về cuộc sống.",
    organizer: { name: "Sân Khấu Thế Giới Trẻ", logo: ticketImage },
    tickets: [
      { id: "e13-1", name: "Standard", price: 330000, remaining: 30 }
    ],
  },
  {
    id: "e14",
    title: "[Nhà Hát Bến Thành] Hài kịch: Đảo Hoa Hậu",
    image: ticketImage,
    date: "19:30, 05/08/2026",
    category: "Sân khấu & nghệ thuật",
    isTrending: false,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Tiếng cười sảng khoái với dàn diễn viên hài gạo cội.",
    organizer: { name: "Nhà Hát Bến Thành", logo: ticketImage },
    tickets: [
      { id: "e14-1", name: "Standard", price: 350000, remaining: 50 }
    ],
  },
  {
    id: "e15",
    title: "Sân Khấu Thế Giới Trẻ: Mật Mã Cầu Cơ",
    image: ticketImage,
    date: "20:00, 10/08/2026",
    category: "Sân khấu & nghệ thuật",
    isTrending: true,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Vở kịch kinh dị, giật gân thu hút sự chú ý của giới trẻ.",
    organizer: { name: "Sân Khấu Thế Giới Trẻ", logo: ticketImage },
    tickets: [
      { id: "e15-1", name: "Standard", price: 350000, remaining: 15 }
    ],
  },
  {
    id: "e16",
    title: "SKNT TRƯƠNG HÙNG MINH : NGÀY MAI NGƯỜI TA LẤY CHỒNG",
    image: ticketImage,
    date: "19:30, 15/08/2026",
    category: "Sân khấu & nghệ thuật",
    isTrending: false,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Câu chuyện tình cảm nhẹ nhàng, sâu lắng.",
    organizer: { name: "SKNT Trương Hùng Minh", logo: ticketImage },
    tickets: [
      { id: "e16-1", name: "Standard", price: 300000, remaining: 60 }
    ],
  },
  {
    id: "e17",
    title: "Trải Nghiệm Bay Dù Lượn Hà Nội",
    image: ticketImage,
    date: "08:00 - 17:00, Cuối tuần",
    category: "Tham quan & trải nghiệm",
    isTrending: true,
    location: "Hà Nội",
    type: "event",
    description: "Trải nghiệm ngắm nhìn toàn cảnh từ trên cao cực kỳ kích thích dành cho những người đam mê thể thao mạo hiểm.",
    organizer: { name: "Hanoi Paragliding", logo: ticketImage },
    tickets: [
      { id: "e17-1", name: "Chuyến bay tiêu chuẩn", price: 1850000, remaining: 15, benefits: ["Bao gồm quay video GoPro"] }
    ],
  },
  {
    id: "e18",
    title: "Địa Đạo Củ Chi : Trăng Chiến Khu",
    image: ticketImage,
    date: "18:00 - 21:00, 14/06/2026",
    category: "Tham quan & trải nghiệm",
    isTrending: false,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Tour tham quan đêm độc đáo tái hiện lại đời sống sinh hoạt và chiến đấu tại Củ Chi.",
    organizer: { name: "Khu di tích Củ Chi", logo: ticketImage },
    tickets: [
      { id: "e18-1", name: "Vé người lớn", price: 399000, remaining: 50 }
    ],
  },
  {
    id: "e19",
    title: "Trải Nghiệm Bay Dù Lượn Mù Cang Chải",
    image: ticketImage,
    date: "07:00 - 16:00, Tháng 9/2026",
    category: "Tham quan & trải nghiệm",
    isTrending: true,
    location: "Other",
    type: "event",
    description: "Bay dù lượn ngắm mùa lúa chín vàng ươm tại Mù Cang Chải.",
    organizer: { name: "MCC Paragliding", logo: ticketImage },
    tickets: [
      { id: "e19-1", name: "Vé bay", price: 2190000, remaining: 30 }
    ],
  },
  {
    id: "e20",
    title: "Vietnam Int'l Cafe Show 2026 in HCMC",
    image: ticketImage,
    date: "09:00 - 17:00, 20/07/2026",
    category: "Tham quan & trải nghiệm",
    isTrending: true,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Triển lãm chuyên ngành F&B mang đến trải nghiệm toàn diện về ngành công nghiệp cà phê và thức uống.",
    organizer: { name: "Exporum Vietnam", logo: ticketImage },
    tickets: [
      { id: "e20-1", name: "Vé tham quan", price: 150000, remaining: 500, benefits: ["Tham quan các gian hàng", "Dùng thử sản phẩm"] }
    ],
  },
  {
    id: "e21",
    title: "Aquafield Ocean City",
    image: ticketImage,
    date: "Mở cửa hàng ngày",
    category: "Tham quan & trải nghiệm",
    isTrending: true,
    location: "Hà Nội",
    type: "event",
    description: "Tổ hợp vui chơi giải trí dưới nước mang phong cách nghỉ dưỡng hiện đại.",
    organizer: { name: "Ocean City", logo: ticketImage },
    tickets: [
      { id: "e21-1", name: "Vé vào cổng", price: 170000, remaining: 500 }
    ],
  },
  {
    id: "e22",
    title: "IMMERSIVE OPERA HOUSE - \"115 NĂM NHÀ HÁT KỂ CHUYỆN\"",
    image: ticketImage,
    date: "19:00, 12/08/2026",
    category: "Sân khấu & nghệ thuật",
    isTrending: false,
    location: "Hồ Chí Minh",
    type: "event",
    description: "Show diễn thực tế ảo và nghệ thuật thị giác độc đáo kể lại lịch sử 115 năm của Nhà hát Thành phố.",
    organizer: { name: "Saigon Opera House", logo: ticketImage },
    tickets: [
      { id: "e22-1", name: "Standard", price: 300000, remaining: 100 }
    ],
  },
  {
    id: "e23",
    title: "Vé vào cửa Công Viên Biển Hà Nội - Tuần Châu",
    image: ticketImage,
    date: "08:00 - 18:00, Mở cửa hàng ngày",
    category: "Tham quan & trải nghiệm",
    isTrending: false,
    location: "Hà Nội",
    type: "event",
    description: "Khu vui chơi bãi biển nhân tạo lớn nhất ngoại thành Hà Nội.",
    organizer: { name: "Tuần Châu Hà Nội", logo: ticketImage },
    tickets: [
      { id: "e23-1", name: "Standard", price: 150000, remaining: 200 }
    ],
  },
  {
    id: "e24",
    title: "Trải Nghiệm Bay Dù Lượn Mù Cang Chải (Dự kiến mở thêm)",
    image: "https://salt.tkbcdn.com/ts/ds/da/85/17/b6ffb722910203a125c0fd062b52d242.jpeg" as any,
    date: "Sắp diễn ra",
    category: "Tham quan & trải nghiệm",
    isTrending: false,
    location: "Other",
    type: "event",
    description: "Đăng ký nhận thông báo sớm cho đợt mở bán vé tiếp theo của sự kiện bay dù lượn.",
    organizer: { name: "MCC Paragliding", logo: ticketImage },
    tickets: [
      { id: "e24-1", name: "Chờ mở bán", price: 0, remaining: 0 }
    ],
  }
];

export type MyTicket = {
  id: string;
  title: string;
  banner: any;
  ticketPrice: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  location: string;
  date: string;
  time: string;
  boughtAt: string;
  status: "upcoming" | "ended";
};

const myTicketBanner = require("../assets/ticket.png");

export const myTicketsUpcoming: MyTicket[] = [
  {
    id: "mt-1",
    title: "Trải nghiệm Bay Dữ Lượn Mùa Cargando",
    banner: myTicketBanner,
    ticketPrice: 150000,
    buyerName: "Trần Ngọc Bích Ly",
    buyerEmail: "bichly@example.com",
    buyerPhone: "0901234567",
    location: "Sao Paulo, SP - Allianz Park",
    date: "28/09/2023",
    time: "21:00 (BRT)",
    boughtAt: "22/05/2023",
    status: "upcoming",
  },
  {
    id: "mt-2",
    title: "GAMES BAY DỪ LƯỢN HẢI",
    banner: myTicketBanner,
    ticketPrice: 250000,
    buyerName: "Trần Ngọc Bích Ly",
    buyerEmail: "bichly@example.com",
    buyerPhone: "0901234567",
    location: "Đà Nẵng",
    date: "29/03/2026",
    time: "08:00 - 16:00",
    boughtAt: "01/03/2026",
    status: "upcoming",
  },
];

export const myTicketsEnded: MyTicket[] = [
  {
    id: "mt-3",
    title: "Gorillaz",
    banner: myTicketBanner,
    ticketPrice: 199000,
    buyerName: "Trần Ngọc Bích Ly",
    buyerEmail: "bichly@example.com",
    buyerPhone: "0901234567",
    location: "Curitiba, PR - Pedreira Paulo Leminsky",
    date: "17/10/2023",
    time: "19:00 (BRT)",
    boughtAt: "14/07/2023",
    status: "ended",
  },
  {
    id: "mt-4",
    title: "Foo Fighters",
    banner: myTicketBanner,
    ticketPrice: 189000,
    buyerName: "Trần Ngọc Bích Ly",
    buyerEmail: "bichly@example.com",
    buyerPhone: "0901234567",
    location: "Sao Paulo, SP - Allianz Park",
    date: "28/10/2023",
    time: "21:00 (BRT)",
    boughtAt: "13/08/2023",
    status: "ended",
  },
];

